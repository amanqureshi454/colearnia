import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
  },
  typescript: {
    ignoreBuildErrors: true, // Never fail build on TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Never fail build on ESLint errors
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ar",
        permanent: false,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
