# 生成示例占位视频（抽象“回声星群”动画），输出 H.264 mp4。
# 依赖：imageio, imageio-ffmpeg, numpy（由 imageio-ffmpeg 提供 ffmpeg 二进制）。
# 用法：python scripts/generate-video.py
import numpy as np
import imageio.v2 as imageio
from pathlib import Path

W, H = 720, 404
FPS, DUR = 24, 6
N = FPS * DUR

rng = np.random.default_rng(42)
nstars = 240
sx = rng.uniform(0, W, nstars)
sy = rng.uniform(0, H, nstars)
ssz = rng.uniform(0.6, 2.4, nstars)
sph = rng.uniform(0, 2 * np.pi, nstars)

out = Path("public/works/echo-realm/clip.mp4")
out.parent.mkdir(parents=True, exist_ok=True)

writer = imageio.get_writer(
    str(out),
    fps=FPS,
    codec="libx264",
    quality=8,
    macro_block_size=1,
    ffmpeg_params=["-pix_fmt", "yuv420p"],
)

Y, X = np.mgrid[0:H, 0:W]
yy = np.linspace(0, 1, H)[:, None]
cx, cy = W * 0.5, H * 0.45

for f in range(N):
    t = f / FPS
    frame = np.zeros((H, W, 3), dtype=np.float32)
    # 暗色渐变底
    frame[..., 0] = 0.04 * (1 - yy)
    frame[..., 1] = 0.03 * (1 - yy)
    frame[..., 2] = 0.03 * (1 - yy)

    # 中心呼吸光晕
    d = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)
    pulse = 0.5 + 0.5 * np.sin(t * 1.2)
    glow = np.exp(-(d**2) / (2 * (120 + 40 * pulse) ** 2)) * (0.5 + 0.4 * pulse)
    frame[..., 0] += glow
    frame[..., 1] += glow * 0.45
    frame[..., 2] += glow * 0.18

    # 同心涟漪环
    for k in range(6):
        r0 = 60 + k * 28
        ring = np.exp(-(((d - (r0 + 12 * np.sin(t * 1.5 + k))) ** 2) / (2 * 6**2)))
        a = 0.22 * (0.6 + 0.4 * np.sin(t * 2 + k))
        frame[..., 0] += ring * a
        frame[..., 1] += ring * a * 0.5

    # 星点缓慢上浮
    sy = (sy - 0.35) % H
    for i in range(nstars):
        x = int(sx[i]) % W
        y = int(sy[i]) % H
        sz = int(ssz[i])
        tw = 0.5 + 0.5 * np.sin(t * 2 + sph[i])
        x0, x1 = max(0, x - sz), min(W, x + sz + 1)
        y0, y1 = max(0, y - sz), min(H, y + sz + 1)
        frame[y0:y1, x0:x1, 0] += 1.0 * tw
        frame[y0:y1, x0:x1, 1] += 0.82 * tw
        frame[y0:y1, x0:x1, 2] += 0.66 * tw

    frame = np.clip(frame, 0, 1)
    writer.append_data((frame * 255).astype(np.uint8))

writer.close()
print(f"已生成 {out}（{out.stat().st_size/1024:.0f} KB）")
