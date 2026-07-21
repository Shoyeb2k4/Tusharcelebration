/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Prisma client is a server-only dependency.
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  eslint: {
    // Lint is run as a separate CI step; don't block production builds on it.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
