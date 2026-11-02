// src/pages/ai-courses/[slug].tsx

import { Constants } from "@/contants";
import { CMS } from "@/lib/lib";
import { AiCoursePage, AiCoursePageProps } from "@/ui/pages";

// Utility for clean logs
const log = (...args: any[]) =>
  console.log(`[AI-COURSE]`, new Date().toISOString(), ...args);

export const getStaticPaths = async () => {
  const ret = {
    paths: [] as { params: { slug: string } }[],
    fallback: "blocking",
  };

  try {
    log("getStaticPaths → START");

    if (Constants.DEPLOYMENT === "staging") {
      log("Skipping getStaticPaths in staging");
      return ret;
    }

    const courses = await CMS.getAllProducts("course");

    if (!courses || !Array.isArray(courses)) {
      log("No courses found!");
      return ret;
    }

    const paths = courses
      .filter((course) => course?.slug)
      .slice(0, 50) // 🧩 Limit prebuild to keep build small & fast
      .map((course) => ({
        params: { slug: String(course.slug) },
      }));

    log(`Prebuilding paths: ${paths.length}`);

    return { ...ret, paths };
  } catch (error) {
    log("⚠️ Error in getStaticPaths:", error);
    return ret;
  }
};

// ===============================================
//   OPTIMIZED getStaticProps (Very Fast)
// ===============================================

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const startTime = Date.now();
  log(`getStaticProps → START for slug: ${slug}`);

  try {
    // Parallel = fastest possible
    const [config, product] = await Promise.all([
      CMS.getConfig(),
      CMS.getProductsFromSlug("course", slug),
    ]);

    if (!product) {
      log("❌ Product not found:", slug);
      return { notFound: true };
    }

    // More parallel fetching (non-blocking)
    const [reviews, alternateRaw, featuredRaw] = await Promise.all([
      CMS.getReviewsForProduct(product.id),
      CMS.getAlternateProductList(product),
      CMS.getFeaturedProductList("course"),
    ]);

    // Filter once in-memory (fastest)
    const productId = product.id;
    const alternateProductList = alternateRaw.filter((p) => p.id !== productId);
    const featuredProductList = featuredRaw.filter((p) => p.id !== productId);

    log(
      `getStaticProps → DONE in ${Date.now() - startTime}ms | slug: ${slug}`
    );

    return {
      props: {
        product,
        config,
        alternateProductList,
        featuredProductList,
        reviews,
        disableEmbedSection: true,
        disableClaimButton: true,
      },
      revalidate: 60, // ISR refresh every 60 secs
    };
  } catch (error) {
    log("❌ getStaticProps error:", error);
    return { notFound: true }; // ensures stable ISR fallback
  }
}

// ===============================================
//     Lightweight Page Component
// ===============================================
const Page = (props: AiCoursePageProps) => {
  return <AiCoursePage {...props} />;
};

export default Page;
