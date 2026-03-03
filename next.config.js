/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs',
        destination: apiUrl + '/docs',
      },
      {
        source: '/openapi.json',
        destination: apiUrl + '/openapi.json',
      },
      {
        source: '/health',
        destination: apiUrl + '/health',
      },
      {
        source: '/api/:path*',
        destination: apiUrl + '/api/:path*',
      },
      {
        source: '/ml/:path*',
        destination: apiUrl + '/ml/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ENABLE_3D: process.env.NEXT_PUBLIC_ENABLE_3D,
    NEXT_PUBLIC_ENABLE_ML: process.env.NEXT_PUBLIC_ENABLE_ML,
  },
}

module.exports = nextConfig
