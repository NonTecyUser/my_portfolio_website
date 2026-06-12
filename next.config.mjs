/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/my_portfolio_website',
  // Disable default image optimization since GitHub Pages is purely static
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for proper routing on GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
