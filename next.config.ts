import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  // Documented in this install: devIndicators false hides the on-screen
  // indicator and still shows compile and runtime errors. The default
  // bottom-left badge covers the phone bar.
  devIndicators: false,
  experimental: {
    // This install's security reminder draws an Insight badge over the phone
    // bar. false turns the reminder off. It does not upgrade Next.js.
    agentUpgrade: false,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "same-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/auth/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};
export default config;
