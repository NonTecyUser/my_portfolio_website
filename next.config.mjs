const isNetlify = process.env.NETLIFY === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isNetlify ? '' : '/my_portfolio_website',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  
  // Ensure asset paths work correctly with basePath
  assetPrefix: isNetlify ? '' : '/my_portfolio_website/',
};

export default nextConfig;
