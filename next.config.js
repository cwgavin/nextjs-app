/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8080/:path*",
      },
      {
        source: "/fruit-api/:path*",
        destination: "https://www.fruityvice.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
