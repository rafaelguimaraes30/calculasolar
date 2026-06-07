import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/energia-solar-em-:slug",
        destination: "/energia-solar-em/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
