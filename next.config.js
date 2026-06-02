/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-*'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.graphassets.com',
        pathname: '/**',
      },
      {
        // Cobre subdomínios regionais do Hygraph CDN (ex: eu-west-2.graphassets.com)
        protocol: 'https',
        hostname: '*.graphassets.com',
        pathname: '/**',
      },
    ],
  },
  onDemandEntries: {
    maxInactiveAge: 15 * 60 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
