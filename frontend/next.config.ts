import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Prevent duplicate builds when deployed on Vercel */
  reactStrictMode: true,

  /* Remove X-Powered-By header */
  poweredByHeader: false,

  };

export default nextConfig;
