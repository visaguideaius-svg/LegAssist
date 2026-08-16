import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Netlify requires no standalone output — uses SSR functions */
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
