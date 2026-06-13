/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,

  // If you were deploying under a subpath (like GitHub Pages),
  // you’d use basePath and assetPrefix. For Netlify custom domain,
  // leave them out so assets resolve correctly.
};

export default nextConfig;
