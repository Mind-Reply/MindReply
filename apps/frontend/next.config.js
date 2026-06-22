/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3001',
  },
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
