/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  output: 'export',
  //assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
  //assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || './',
  assetPrefix: '/bar-curion',
  //basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,


  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        //path: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;