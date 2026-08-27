import type { NextConfig } from "next";

const basePath = process.env.NODE_ENV === "production" ? "/prima-web" : "";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
