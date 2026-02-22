/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      // This is the fix for the Turbopack build error
      root: __dirname,
    },
    // This is the fix for the cross-origin warning
    allowedDevOrigins: [
      'https://*.cloudworkstations.dev',
    ],
  },
};

module.exports = nextConfig;
