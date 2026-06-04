import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages (no Node server at runtime).
  output: "export",
  // Project page served under https://chaosaigent.github.io/VaiBReport
  basePath: "/VaiBReport",
  // Emit each route as a folder/index.html — plays nicely with Pages routing.
  trailingSlash: true,
  // GitHub Pages can't run the Next image optimizer.
  images: { unoptimized: true },
};

export default nextConfig;
