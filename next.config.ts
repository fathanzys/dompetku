import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/dompetku",
  assetPrefix: "/dompetku",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
