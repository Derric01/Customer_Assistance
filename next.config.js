/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Disable image optimization to reduce build complexity
  images: {
    unoptimized: true,
  },
  
  // Completely disable TypeScript and ESLint checks
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Fix webpack cache issues and tailwind config
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable cache in development mode
      config.cache = false;
    }
    
    // This helps ensure tailwind config is properly loaded
    config.watchOptions = {
      ...config.watchOptions,
      poll: 1000,
    };
    
    return config;
  },
};

module.exports = nextConfig;
