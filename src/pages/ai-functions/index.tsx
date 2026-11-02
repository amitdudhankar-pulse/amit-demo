// src/pages/ai-functions/index.tsx
import { CMS } from "@/lib/lib";
import { CategoryPage } from "@/ui/pages";

export async function getStaticProps() {
  try {
    const [
      configBundle,
      functionCategoryPage,
      functionList,
    ] = await Promise.all([
      CMS.getConfigv2(),
      CMS.getFunctionCategoryPageInfo(),
      CMS.getAllFunctions({ options: { limit: 50 } }),
    ]);

    return {
      props: {
        config: configBundle?.config ?? null,
        pageInfo: functionCategoryPage,
        categoryList: functionList, // ← functions list
        type: "function-category",
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps(/ai-functions):", error);
    return { notFound: true };
  }
}

export default CategoryPage;
