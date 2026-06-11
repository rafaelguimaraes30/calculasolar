import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/energia-solar-em-:slug",
        destination: "/energia-solar-em/:slug",
        permanent: true,
      },
      {
        source: "/tarifas",
        destination: "/",
        permanent: true,
      },
      {
        source: "/tarifas/:uf",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ranking-tarifas",
        destination: "/",
        permanent: true,
      },
      {
        source: "/tarifa/:slug",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
