import type { NextConfig } from "next";

const dotenv = require('dotenv');
dotenv.config({ path: '.env.live' });

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"], // Add the domain here
  },
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  
};

export default nextConfig;
