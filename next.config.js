/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/flask-api/:path*",
        // destination: "http://127.0.0.1:5000/:path*",
        destination: "https://2023-flask-api.azurewebsites.net/:path*",
      },
      {
        source: "/fruit-api/:path*",
        destination: "https://www.fruityvice.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
