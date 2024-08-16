/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      unoptimized: true,
    },
    output: "export", //静的エクスポートの設定(Github Pages用)
};

export default nextConfig;
