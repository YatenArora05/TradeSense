import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://s3.tradingview.com; frame-src 'self' https://*.tradingview.com https://*.tradingview-widget.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
