import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Car photographs are served from Supabase Storage. Declared here so a
    // later move from <img> to next/image needs no config change.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
