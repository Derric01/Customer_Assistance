/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing config preserved
  
  reactStrictMode: true,
  
  // Disable image optimization to reduce build complexity
  images: {
    unoptimized: true,
  },
  // Fix webpack cache issues
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable cache in development mode
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig; 
  // Force reload of tailwind config
  webpack: (config) => {
    // This helps ensure tailwind config is properly loaded
    config.watchOptions = {
      ...config.watchOptions,
      poll: 1000,
    };
    return config;
  },
};

module.exports = nextConfig;
