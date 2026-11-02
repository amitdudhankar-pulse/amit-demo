/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_PUBLIC_URL,
  generateRobotsTxt: true,
  exclude: ["/no-crawl/*", "/ai-tool/embed/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/no-crawl/" },
      { userAgent: "*", disallow: "/ai-tool/embed/" },
    ],
  },
};
