import type { NextConfig } from "next";

const backendHost = process.env.NEXT_PUBLIC_API_HOST || "be-tickets";
const backendPort = process.env.NEXT_PUBLIC_API_PORT || "8000";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: `http://${backendHost}:${backendPort}/api/:path*/`,
      },
    ];
  },
};

export default nextConfig;
