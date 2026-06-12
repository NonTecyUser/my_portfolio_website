/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Disable default image optimization since GitHub Pages is purely static
  images: {
    unoptimized: true,
  },
};

export default nextConfig;