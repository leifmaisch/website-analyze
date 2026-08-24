import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["playwright", "playwright-core", "postgres"],
};

export default nextConfig;
