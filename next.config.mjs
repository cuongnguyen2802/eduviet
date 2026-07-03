/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Chỉ bundle icon thực sự dùng tới thay vì toàn bộ barrel file lucide-react — giảm thời gian compile dev.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
