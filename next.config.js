/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'mind-reply.com', 'avatars.githubusercontent.com'],
  },
};

module.exports = nextConfig;
