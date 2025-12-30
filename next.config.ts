import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisations de performance pour le développement
  typescript: {
    // Désactive la vérification TypeScript pendant le build en dev
    ignoreBuildErrors: true,
  },
  // Optimise les imports des packages pour réduire le temps de compilation
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      'lucide-react',
      'recharts'
    ],
  },
};

export default nextConfig;
