// import { CMS, Product } from "@/lib/lib";
// import { CategoryPage, CategoryPageProps } from "@/ui/pages";

// export async function getStaticProps(): Promise<{
//   props: CategoryPageProps;
//   revalidate: number;
// }> {
//   // ✅ Fetch everything in parallel to reduce total load time
//   const [config, allTools, productCount, categoryList] = await Promise.all([
//     CMS.getConfigv2(),
//     CMS.getAllProducts("tool", { sort: "-date_created" }) as Promise<Product[]>,
//     CMS.getProductCount("course"),
//     CMS.getAllCategories({ type: "course_category" }),
//   ]);

//   // ✅ Precompute reusable variables
//   const allItemCount = productCount - allTools.length;

//   // ✅ Return optimized props
//   return {
//     props: {
//       config: config.config,
//       pageInfo: config.courseCategoryPage,
//       allItemCount,
//       categoryList,
//       type: "ai-category",
//     },
//     revalidate: 60, // Regenerate every 60 seconds
//   };
// }

// export default CategoryPage;

// src/pages/ai-courses/index.tsx

import { CMS, Product } from "@/lib/lib";
import { CategoryPage, CategoryPageProps } from "@/ui/pages";

// 🔧 Structured log helper
const log = (...args: any[]) =>
  console.log(`[AI-COURSE-LIST]`, new Date().toISOString(), ...args);

export async function getStaticProps() {
  const start = Date.now();
  log("getStaticProps → START");

  try {
    // ==========================================================
    // 🧩 ALL CALLS PARALLELIZED — ULTRA FAST
    // ==========================================================
    const [config, allTools, productCount, categoryList] = await Promise.all([
      CMS.getConfigv2(),
      CMS.getAllProducts("tool", {
        sort: ["order", "-date_created", "-id"], // 🧩 SORT by order field
        limit: 50, // 🧩 LIMIT the payload (was huge!) improves GTmetrix + page speed
        fields: ["id", "title", "slug", "thumbnail"], // minimal fields → smaller JSON
      }) as Promise<Product[]>,

      CMS.getProductCount("course"),

      CMS.getAllCategories({
        type: "course_category",
        options: { fields: ["id", "title", "slug"] }, // ✅ FIX
      }),
    ]);

    // ==========================================================
    // ⚡ SUPER-FAST PRECOMPUTATION
    // ==========================================================
    const allItemCount = Math.max(0, productCount - allTools.length);

    // ==========================================================
    // 🎯 SMALLER PAYLOAD for GTmetrix + Better LCP
    // ==========================================================
    const props: CategoryPageProps = {
      config: config.config,
      pageInfo: config.courseCategoryPage,
      allItemCount,
      categoryList,
      type: "ai-category",
    };

    log(
      `getStaticProps → DONE in ${Date.now() - start}ms | categories: ${
        categoryList.length
      }`
    );

    return {
      props,
      revalidate: 60, // ISR every 60 sec
    };
  } catch (err) {
    log("❌ ERROR in getStaticProps:", err);

    return {
      props: {
        config: {} as any,
        pageInfo: {
          meta_title: "",
          meta_description: "",
          hero_title: "",
        },
        allItemCount: 0,
        categoryList: [],
        type: "ai-category",
      },
      revalidate: 30,
    };
  }
}

export default CategoryPage;
