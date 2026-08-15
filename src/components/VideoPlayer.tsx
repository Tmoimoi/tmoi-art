// 视频模块：详情页带控制条内嵌播放；尊重无障碍（aria-label + 说明文字）
export default function VideoPlayer({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  return (
    <figure>
      <video
        src={src}
        poster={poster}
        controls
        preload="metadata"
        playsInline
        className="w-full rounded-xl bg-ink-soft"
        aria-label={`${title} 影像`}
      >
        您的浏览器不支持视频播放，请升级浏览器或
        <a href={src}>直接下载视频</a>。
      </video>
      <figcaption className="mt-2 text-xs text-paper-dim">
        影像 · {title}（建议佩戴耳机观看）
      </figcaption>
    </figure>
  );
}
