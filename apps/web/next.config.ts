import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@agri-scan/shared'],
  reactCompiler: true,
};

export default nextConfig;
