import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
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
