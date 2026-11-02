// src/pages/[slug].tsx
import { Constants, Paths } from "@/contants";
import { CMS } from "@/lib/lib";
import {
  BlogProps,
  BlogPage,
  ToolCategoryPageProps,
  ToolCategoryPage,
} from "@/ui/pages";

// ⭐ FIX: Move type here
export type PageProps =
  | { type: "blog"; data: BlogProps }
  | { type: "category"; data: ToolCategoryPageProps }
  | { type: "function"; data: ToolCategoryPageProps };

const REVALIDATE_TIME = 60;

// ✨ Structured log helper
const log = (...args: any[]) =>
  console.log(`[SLUG]`, new Date().toISOString(), ...args);

// -----------------------------------------------------------------------------
// 🔥 OPTIMIZED getStaticPaths (Fast Build + Safe Data + GTMetrix Friendly)
// -----------------------------------------------------------------------------
export async function getStaticPaths() {
  log("getStaticPaths → START");

  // Skip pre-render on staging (faster deployments)
  if (Constants.DEPLOYMENT === "staging") {
    log("Skipping prebuild on staging");
    return { paths: [], fallback: "blocking" };
  }

  const safe = async (fn: any, name: string) => {
    try {
      return await fn();
    } catch (e) {
      log(`⚠️ getStaticPaths ${name} failed:`, e);
      return [];
    }
  };

  // Run all in parallel
  const [blogs, categories, functions] = await Promise.all([
    safe(() => CMS.getAllDirectBlogs({ limit: 20 }), "blogs"),
    safe(
      () =>
        CMS.getAllCategories({
          type: "course_category",
          options: { limit: 20 },
        }),
      "categories"
    ),
    safe(() => CMS.getAllFunctions({ options: { limit: 20 } }), "functions"),
  ]);

  const allItems = [
    ...(blogs ?? []),
    ...(categories ?? []),
    ...(functions ?? []),
  ].filter((i) => i?.slug);

  // Limit to 30 for smaller build & faster GTMetrix
  const paths = allItems.slice(0, 30).map((i) => ({
    params: { slug: String(i.slug) },
  }));

  log(`Prebuilding paths: ${paths.length}`);

  return { paths, fallback: "blocking" };
}

// -----------------------------------------------------------------------------
// 🔥 Helper: Fetch Blog Page Data (Parallelized + Reduced Payload)
// -----------------------------------------------------------------------------
const getBlogData = async (slug: string) => {
  const blog = await CMS.getDirectBlogFromSlug(slug);
  if (!blog) return null;

  const [latestBlogListRaw, featuredProductList] = await Promise.all([
    CMS.getAllDirectBlogs({
      sort: "-date_created",
      limit: 6,
      fields: ["id", "title", "slug", "cover_image"], // smaller payload
    }),
    CMS.getFeaturedProductList("tool"),
  ]);

  const latestBlogList = latestBlogListRaw.filter((b) => b.id !== blog.id);

  return {
    blog,
    latestBlogList,
    featuredProductList,
    pathList: [
      Paths.Frontend.HOME,
      { title: blog.title, href: `${Paths.Frontend.HOME.href}/${blog.slug}` },
    ],
  };
};

// -----------------------------------------------------------------------------
// 🔥 OPTIMIZED getStaticProps (Fastest Possible + Reduced Payload)
// -----------------------------------------------------------------------------
export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params?.slug;

  log(`getStaticProps → START | slug=${slug}`);
  const start = Date.now();

  if (!slug) {
    log("❌ Missing slug param");
    return { notFound: true };
  }

  try {
    // Fetch config early (parallel-safe)
    const configPromise = CMS.getConfig();

    // Try Blog first (fastest for >50% cases)
    const blogData = await getBlogData(slug);
    if (blogData) {
      log(`✔ Blog match for slug=${slug} (${Date.now() - start}ms)`);
      return {
        props: {
          type: "blog",
          data: { config: await configPromise, ...blogData },
        },
        revalidate: REVALIDATE_TIME,
      };
    }

    // Try Category
    const categoryData = await CMS.getCategoryFromSlug(slug).catch(() => null);
    if (categoryData) {
      log(`✔ Category match for slug=${slug} (${Date.now() - start}ms)`);
      return {
        props: {
          type: "category",
          data: {
            config: await configPromise,
            data: { layout_type: "categories", element: categoryData },
          },
        },
        revalidate: REVALIDATE_TIME,
      };
    }

    // Try Function
    const functionData = await CMS.getFunctionFromSlug(slug).catch(() => null);
    if (functionData) {
      log(`✔ Function match for slug=${slug} (${Date.now() - start}ms)`);
      return {
        props: {
          type: "function",
          data: {
            config: await configPromise,
            data: { layout_type: "functions", element: functionData },
          },
        },
        revalidate: REVALIDATE_TIME,
      };
    }

    log(`❌ No match for slug=${slug}`);
    return { notFound: true };
  } catch (error) {
    log(`💥 ERROR slug=${slug}:`, error);
    return { notFound: true };
  }
}

// -----------------------------------------------------------------------------
// 🔥 Optimized Page Component (zero overhead + faster hydration)
// -----------------------------------------------------------------------------
const Page = (props: PageProps) => {
  if (props.type === "blog") {
    return <BlogPage {...props.data} disableMoreBlogsSection />;
  }

  const { layout_type, element } = props.data.data;

  // Minimal logic for faster hydration
  const toolFilter =
    layout_type === "categories" && element.category_type === "course_category"
      ? false
      : true;

  return <ToolCategoryPage {...props.data} toolFilter={toolFilter} />;
};

export default Page;
