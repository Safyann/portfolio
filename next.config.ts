import type { NextConfig } from 'next';

// GitHub Pages без своего домена отдаёт сайт из подпапки репозитория — basePath приходит из workflow.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
