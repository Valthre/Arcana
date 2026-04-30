/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  allowedDevOrigins: [
    'https://*.cloudworkstations.dev'
  ],
  
};

module.exports = nextConfig;