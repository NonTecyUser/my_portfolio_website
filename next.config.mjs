/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/my_portfolio_website',
  images: {
    unoptimized: true,
  },
  basePath: '/samir-portfolio'
  trailingSlash: true,
  
  // Ensure asset paths work correctly with basePath
  assetPrefix: '/my_portfolio_website/',
};

export default nextConfig;
