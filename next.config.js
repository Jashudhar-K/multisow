/** @type {import('next').NextConfig} */
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  // --- Performance: package import tree-shaking ---
  experimental: {
    optimizePackageImports: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
    ],
  },

  // --- Image optimisation ---
  images: {
    formats: ['image/avif', 'image/webp'],
  },



  // --- Compiler optimizations ---
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // --- Turbopack: silence Turbopack/webpack co-existence warning (Next 16+) ---
  turbopack: {},

  // --- Webpack: split Three.js, charts, and UI deps into separate chunks ---
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = config.optimization || {}
      config.optimization.splitChunks = {
        ...(config.optimization.splitChunks || {}),
        cacheGroups: {
          ...((config.optimization.splitChunks || {}).cacheGroups || {}),
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three-vendor',
            chunks: 'all',
            priority: 30,
          },
          charts: {
            test: /[\\/]node_modules[\\/](recharts|d3-)[\\/]/,
            name: 'charts-vendor',
            chunks: 'all',
            priority: 20,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
            name: 'ui-vendor',
            chunks: 'all',
            priority: 10,
          },
        },
      }
    }
    return config
  },

  async headers() {
    return [
      {
        // Static assets — long cache
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // All pages — security headers + revalidate
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  async rewrites() {
    return {
      // beforeFiles rewrites are checked before pages/public files
      beforeFiles: [],
      // afterFiles rewrites are checked after pages/public files but before fallback
      afterFiles: [
        { source: '/docs', destination: `${BACKEND_URL}/docs` },
        { source: '/openapi.json', destination: `${BACKEND_URL}/openapi.json` },
        { source: '/health', destination: `${BACKEND_URL}/health` },
        { source: '/ml/:path*', destination: `${BACKEND_URL}/ml/:path*` },
        { source: '/presets', destination: `${BACKEND_URL}/presets` },
      ],
      // fallback rewrites are checked after both pages and dynamic routes
      fallback: [
        // Exclude NextAuth routes from the backend proxy so /api/auth/* is
        // always handled by the Next.js route handler, not proxied to FastAPI.
        {
          source: '/api/auth/:path*',
          destination: '/api/auth/:path*',
        },
        { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
      ],
    };
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ENABLE_3D: process.env.NEXT_PUBLIC_ENABLE_3D,
    NEXT_PUBLIC_ENABLE_ML: process.env.NEXT_PUBLIC_ENABLE_ML,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
