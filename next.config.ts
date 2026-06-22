import type { Config } from "next";

const config: Config = {
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        },
      ],
    };
  },
};

export default config;
