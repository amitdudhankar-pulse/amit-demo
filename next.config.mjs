// /** @type {import('next').NextConfig} */
// import withBundleAnalyzer from "@next/bundle-analyzer";

// const nextConfig = {
//   reactStrictMode: false,

//   // ✅ Reduce build load by limiting static generation timeout
//   staticPageGenerationTimeout: 200,

//   // ✅ Make build lighter and server-ready
//   output: "standalone",

//   // ✅ Disable Next image optimization (huge speed-up on Vercel)
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "admin.groupify.ai",
//         port: "",
//         pathname: "/assets/**",
//       },
//     ],
//   },

//   experimental: {
//     nextScriptWorkers: false, // disable for faster build
//   },

//   // ✅ Keep your redirects
//   async redirects() {
//     return [
//       { source: "/blog", destination: "/blog/page", permanent: true },
//       { source: "/blog/page", destination: "/blog/page/1", permanent: true },
//       { source: "/news", destination: "/news/page", permanent: true },
//       { source: "/news/page", destination: "/news/page/1", permanent: true },
//     ];
//   },

//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/i,
//       issuer: /\.[jt]sx?$/,
//       use: ["@svgr/webpack"],
//     });
//     return config;
//   },
// };

// // ✅ Bundle analyzer only for local dev if needed
// export default withBundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// })(nextConfig);



/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  // React + build performance
  reactStrictMode: true,
  compress: true,
  swcMinify: true,

  // Static generation timeout
  staticPageGenerationTimeout: 300,

  // Standalone mode for server deployments (e.g., Docker/Node)
  output: "standalone",

  // Image optimization
  images: {
    unoptimized: false, // New config applies optimization
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uat-cms.groupify.ai",
        pathname: "/assets/**",
      },
    ],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: {
      exclude: ["error"], // Keep error logs only
    },
    styledComponents: true,
  },

  // Experimental optimizations
  experimental: {
    nextScriptWorkers: false, // from old config
    optimizeCss: true,
    optimizePackageImports: ["lodash", "date-fns"],
    // legacyBrowsers: false,
    scrollRestoration: true,
  },

  // URL redirects (from old config + kept exactly as-is)
  async redirects() {
    return [
      { source: "/blog", destination: "/blog/page", permanent: true },
      { source: "/blog/page", destination: "/blog/page/1", permanent: true },
      { source: "/news", destination: "/news/page", permanent: true },
      { source: "/news/page", destination: "/news/page/1", permanent: true },
    ];
  },

  // Custom headers for caching (from new config)
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Files in public/static (hero, icons, decorations). Cached for a year:
        // when replacing one, give it a new name/folder (e.g. hero/v2/).
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Webpack custom rules (SVG support from both old & new)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

// Bundle analyzer support
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
