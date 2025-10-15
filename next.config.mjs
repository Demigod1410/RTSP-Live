/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This will ignore type errors during production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
