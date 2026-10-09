import type { NextConfig } from "next";

const nextConfig: NextConfig = {
allowedDevOrigins: ["*.ngrok-free.app"],

/* config options here */
experimental: {
agentFeedback: true,
},
cacheComponents: true,
partialPrefetching: true,
turbopack: {
rules: {
"*.css": {
loaders: ["@tailwindcss/turbopack"],
as: "*.css",
},
},
},
};

export default nextConfig;
