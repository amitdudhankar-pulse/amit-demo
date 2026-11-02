import { CustomProjectConfig } from "lost-pixel";

export const config: CustomProjectConfig = {
  pageShots: {
    breakpoints: [640, 768, 1024, 1536, 1908],
    pages: [
      { path: "/", name: "home" },
      { path: "/blogs", name: "blog_list" },
      // TODO: Add news test. As of now, its giving timeout failures.
      // { path: "/news", name: "news_list" },
      {
        path: "/blog/Corporate-Governance-Reporting-with-AI",
        name: "blog_detail",
      },
      {
        path: "/ai-tool/mathly",
        name: "product_detail",
        mask: [{ selector: "iframe" }],
      },
    ],
    baseUrl: "http://localhost:3000",
  },
  waitBeforeScreenshot: 1000 * 20,
  generateOnly: true,
  failOnDifference: true,
  // TODO: Test on other browsers as well
  browser: ["chromium"],
  timeouts: {
    networkRequests: 1000 * 60 * 2,
    loadState: 1000 * 60 * 2,
    fetchStories: 1000 * 60 * 2,
  },
};
