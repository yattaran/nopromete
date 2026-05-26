import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/noticias", destination: "/", permanent: false },
      { source: "/noticias/:path*", destination: "/", permanent: false },
      { source: "/categoria/:path*", destination: "/", permanent: false },
      { source: "/admin/posts/:path*", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
