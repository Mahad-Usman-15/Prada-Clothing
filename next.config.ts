import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  redirects: async () => [
    {
      source: "/productlisting",
      destination: "/shop",
      permanent: true,
    },
    {
      source: "/productsdetail/:slug",
      destination: "/shop/:slug",
      permanent: true,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blanchedalmond-spider-395289.hostingersite.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
