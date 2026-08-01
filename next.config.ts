import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // gluon-ai uses createRequire/dynamic import in its instrumentation hook
  // and CJS-only server bundle — keep it external so Node.js loads it natively
  // rather than having Turbopack try to analyze/bundle those patterns.
  serverExternalPackages: ["gluon-ai"],
};

export default nextConfig;
