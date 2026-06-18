import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.16'],
  cacheComponents: true,
};

export default nextConfig;
