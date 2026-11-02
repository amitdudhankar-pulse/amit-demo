// import { Constants } from "@/contants";
// import { CMS } from "@/lib/lib";
// import { AiToolPage, AiToolPageProps } from "@/ui/pages";

// export const getStaticPaths = async () => {
//   // Prebuild only minimal paths for speed
//   const paths: { params: { slug: string } }[] = [];

//   try {
//     // Skip prebuilding for staging
//     if (Constants.DEPLOYMENT === "staging") {
//       return { paths, fallback: "blocking" };
//     }

//     // Fetch just the top 20–30 tools (not all)
//     const tools = await CMS.getAllProducts("tool");

//     // Use a subset only — rest will build on demand
//     tools?.slice(0, 30).forEach((tool) => {
//       if (tool?.slug) paths.push({ params: { slug: String(tool.slug) } });
//     });

//     console.log("> Prebuilding AI Tool paths:", paths.length);
//   } catch (error) {
//     console.error("Error in getStaticPaths:", error);
//   }

//   // fallback 'blocking' => On-demand ISR for new tools
//   return { paths, fallback: "blocking" };
// };

// export async function getStaticProps({ params }: { params: { slug: string } }) {
//   try {
//     const [config, product] = await Promise.all([
//       CMS.getConfig(),
//       CMS.getProductsFromSlug("tool", params.slug),
//     ]);

//     if (!product) return { notFound: true };

//     const [reviews, alternateListRaw, featuredListRaw] = await Promise.all([
//       CMS.getReviewsForProduct(product.id),
//       CMS.getAlternateProductList(product),
//       CMS.getFeaturedProductList("tool"),
//     ]);

//     const productId = product.id;
//     const alternateProductList = alternateListRaw.filter(
//       (p) => p.id !== productId
//     );
//     const featuredProductList = featuredListRaw.filter(
//       (p) => p.id !== productId
//     );

//     return {
//       props: {
//         product,
//         config,
//         alternateProductList,
//         featuredProductList,
//         reviews,
//         disableEmbedSection: false,
//         disableClaimButton: false,
//       },
//       revalidate: 60, // ISR — rebuild after 60s when requested
//     };
//   } catch (error) {
//     console.error("Error in getStaticProps:", error);
//     return { notFound: true };
//   }
// }

// // ✅ Lightweight and clean page component
// const Page = (props: AiToolPageProps) => <AiToolPage {...props} />;

// export default Page;

// src/pages/ai-tool/[slug].tsx
import { Constants } from "@/contants";
import { CMS } from "@/lib/lib";

// NOTE: import the *named* Page component and PageProps from the real file
// The file is src/ui/pages/ai_tool_page.tsx which exports { Page } and type { PageProps }.
import {
  Page as AiToolPage,
  PageProps as AiToolPageProps,
} from "@/ui/pages/ai_tool_page";

// ----------------------------------------
// SAFE FETCH WRAPPER
// ----------------------------------------
async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return (await promise) ?? fallback;
  } catch (err) {
    console.warn("⚠️ Safe fetch error:", err);
    return fallback;
  }
}

// ----------------------------------------
// getStaticPaths — optimized
// ----------------------------------------
export const getStaticPaths = async () => {
  const paths: { params: { slug: string } }[] = [];

  if (Constants.DEPLOYMENT === "staging") {
    return { paths, fallback: "blocking" };
  }

  try {
    const tools = await safe(
      CMS.getAllProducts("tool", {
        fields: ["slug"],
        limit: 30,
        slim: true,
      }),
      []
    );

    tools.forEach((tool: any) => {
      if (tool?.slug) {
        paths.push({ params: { slug: String(tool.slug) } });
      }
    });

    console.log("> 🔧 Prebuilding AI Tool paths:", paths.length);
  } catch (err) {
    console.error("❌ getStaticPaths error:", err);
  }

  return { paths, fallback: "blocking" };
};

// ----------------------------------------
// getStaticProps — optimized
// ----------------------------------------
export async function getStaticProps({ params }: { params: { slug: string } }) {
  console.log("🧭 getStaticProps → slug:", params.slug);
  try {
    // const [config, product] = await Promise.all([
    //   safe(CMS.getConfig(), null),
    //   safe(CMS.getProductsFromSlug("tool", params.slug), null),
    // ]);
    const [config, product] = await Promise.all([
      safe(CMS.getConfig(), null),
      safe(CMS.getProductsFromSlug("tool", params.slug), null),
    ]);

    console.log("📦 PRODUCT FETCHED:", product);

    if (product) {
      console.log("⭐ PRODUCT RATINGS (raw):", {
        overall_satisfaction: product.overall_satisfaction,
        review_count: product.review_count,
        ease_of_use: product.ease_of_use,
        ease_of_customization: product.ease_of_customization,
        intuitive_interface: product.intuitive_interface,
        value_for_money: product.value_for_money,
        support_team_responsiveness: product.support_team_responsiveness,
      });
    }

    if (!product) return { notFound: true };

    const [reviews, alternateRaw, featuredRaw] = await Promise.all([
      safe(CMS.getReviewsForProduct(product.id), []),
      safe(CMS.getAlternateProductList(product), []),
      safe(CMS.getFeaturedProductList("tool"), []),
    ]);

    console.log("📝 REVIEWS FETCHED:", reviews);
    console.log("📝 REVIEWS COUNT:", reviews?.length);
    console.log("🆔 REVIEWS FOR PRODUCT ID:", product.id);

    if (Array.isArray(reviews) && reviews.length > 0) {
      console.log("🧬 SAMPLE REVIEW OBJECT:", reviews[0]);
    }

    const id = product.id;
    // const alternateProductList = Array.isArray(alternateRaw)
    //   ? alternateRaw.filter((p: any) => p.id !== id)
    //   : [];
    const filteredAlternate = Array.isArray(alternateRaw)
      ? alternateRaw.filter((p: any) => p.id !== id)
      : [];

    const alternateProductList =
      filteredAlternate.length > 0
        ? filteredAlternate
        : featuredRaw.filter((p: any) => p.id !== id).slice(0, 10);

    const featuredProductList = Array.isArray(featuredRaw)
      ? featuredRaw.filter((p: any) => p.id !== id)
      : [];

    console.log("🔁 ALTERNATE TOOLS COUNT:", alternateProductList.length);
    console.log("⭐ FEATURED TOOLS COUNT:", featuredProductList.length);

    console.log("🚀 FINAL PAGE PROPS SNAPSHOT:", {
      productId: product.id,
      reviewCountFromDB: reviews.length,
      reviewCountOnProduct: product.review_count,
      overallSatisfaction: product.overall_satisfaction,
    });

    return {
      props: {
        product,
        config,
        alternateProductList,
        featuredProductList,
        reviews,
        disableEmbedSection: false,
        disableClaimButton: false,
      } as AiToolPageProps,
      revalidate: 60,
    };
  } catch (err) {
    console.error("❌ getStaticProps error:", err);
    return { notFound: true };
  }
}

// ----------------------------------------
// Page — statically imported named component (type-safe)
// ----------------------------------------
// export default function Page(props: AiToolPageProps) {
//   // Render the named Page component (AiToolPage) that was exported from ai_tool_page.tsx
//   return <AiToolPage {...props} />;
// }

export default function Page(props: AiToolPageProps) {
  console.log("🖥️ PAGE RENDER → Reviews received:", props.reviews);
  console.log("🖥️ PAGE RENDER → Review count:", props.reviews?.length);

  console.log("🖥️ PAGE RENDER → Ratings received:", {
    overall_satisfaction: props.product.overall_satisfaction,
    review_count: props.product.review_count,
  });

  return <AiToolPage {...props} />;
}
