/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出：让 GitHub Pages（纯静态托管）能直接托管本站点
  output: "export",
  // 导出模式下关闭 Next 内置图片优化（本站点图片均为静态 SVG/资源）
  images: { unoptimized: true },
  // 若日后用 username.github.io/<repo> 预览而非自定义域名，把下行的注释打开并改成你的仓库名
  // basePath: "/tmoi-art",
};

export default nextConfig;
