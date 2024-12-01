/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  async headers() {
    const commonHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
    ];

    // Development-specific headers
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          headers: [
            ...commonHeaders,
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET,DELETE,PATCH,POST,PUT',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value:
                'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, userId, Authorization',
            },
          ],
        },
      ];
    }

    // Default headers for all routes
    return [
      {
        source: '/:path*',
        headers: commonHeaders,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/',
        destination: 'http://localhost:8080/:path*', // Updated to point to your local backend
      },
    ];
  },

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset/resource',
      generator: {
        filename: isServer
          ? '../static/videos/[name][ext]'
          : 'static/videos/[name][ext]',
        publicPath: '/_next/static/videos/',
      },
    });
    return config;
  },
};

module.exports = nextConfig;