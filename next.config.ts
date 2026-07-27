import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.MEDIA_HOSTNAME ?? "localhost",
      },
    ],
  },
};

export default withPayload(nextConfig);
