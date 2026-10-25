import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Backend health route uses `export const dynamic = "force-dynamic"`,
     which is incompatible with cacheComponents. Keep classic App Router. */
};

export default nextConfig;
