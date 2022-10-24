/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"], // <--add this
  },
  target: "serverless",
};

module.exports = nextConfig;
