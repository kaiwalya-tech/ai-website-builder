/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // ✅ Disable to prevent double execution
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ui-avatars.com',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'via.placeholder.com',
        }
      ]
    }
    // ✅ Removed deprecated 'experimental.appDir' - not needed in Next.js 15
  }
  
  module.exports = nextConfig
  