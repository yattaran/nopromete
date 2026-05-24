import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.nacion.com" },
      { protocol: "https", hostname: "**.delfino.cr" },
      { protocol: "https", hostname: "**.semanariouniversidad.com" },
      { protocol: "https", hostname: "**.gravatar.com" },
    ],
  },
};

export default nextConfig;
