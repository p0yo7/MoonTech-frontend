// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: `/_next/static/videos/`,
            outputPath: `${isServer ? '../' : ''}static/videos/`,
          },
        },
      ],
    });
    return config;
  },
  // ... otras configuraciones que ya tenías
};

export default nextConfig;