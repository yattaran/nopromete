import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/assets/social/[id]": [
      "./node_modules/@fontsource/source-serif-4/files/**/*.woff",
      "./node_modules/@fontsource/barlow/files/**/*.woff",
      "./public/don-zopi/**/*.png",
    ],
  },
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
