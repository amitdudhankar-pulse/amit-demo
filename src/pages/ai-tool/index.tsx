import { CMS } from "@/lib/lib";
import { CategoryPage, CategoryPageProps } from "@/ui/pages";

// ✅ Optimized and parallelized getStaticProps

// export async function getStaticProps() {
//   try {
//     const [config, toolCategoryList, toolCount] = await Promise.all([
//       CMS.getConfigv2(),
//       CMS.getAllCategories({ type: "tool_category" }),
//       CMS.getProductCount("tool"),
//     ]);

//     return {
//       props: {
//         config: config.config,
//         pageInfo: config.toolCategoryPage,
//         allItemCount: toolCount,
//         categoryList: toolCategoryList,
//         type: "tool-category",
//       },
//       revalidate: 60,
//     };
//   } catch (error) {
//     console.error("Error in getStaticProps(/ai-tool):", error);
//     return { notFound: true };
//   }
// }

export async function getStaticProps() {
  try {
    const [config, toolCategoryPage, toolCategoryList, toolCount] =
      await Promise.all([
        CMS.getConfigv2(),                           // config
        CMS.getToolCategoryPageInfo(),               // ⬅ NEW
        CMS.getAllCategories({ type: "tool_category" }),
        CMS.getProductCount("tool"),
      ]);

    return {
      props: {
        config: config?.config ?? null,
        pageInfo: toolCategoryPage,   // ← FIXED
        allItemCount: toolCount,
        categoryList: toolCategoryList,
        type: "tool-category",
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps(/ai-tool):", error);
    return { notFound: true };
  }
}



// ✅ Lightweight and stable export
export default CategoryPage;
