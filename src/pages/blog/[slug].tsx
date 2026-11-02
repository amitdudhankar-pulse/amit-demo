import { Constants, Paths } from "@/contants";
import { CMS } from "@/lib/lib";
import { BlogProps, BlogPage } from "@/ui/pages";

// ----------------- Static Paths -----------------

export async function getStaticPaths() {
  const ret = { paths: [] as { params: { slug: string } }[], fallback: "blocking" };

  // Skip building pages in staging
  if (Constants.DEPLOYMENT === "staging") return ret;

  // Safe fetch wrapper
  const safe = async (fn: any) => {
    try {
      return await fn();
    } catch (e) {
      console.error("⚠️ getStaticPaths fetch failed:", e);
      return [];
    }
  };

  // Fetch all blogs safely
  const blogs = await safe(() => CMS.getAllBlogs());

  // ✅ Prebuild only a small subset (latest/popular) to speed up build
  const paths = (blogs ?? [])
    .filter((b: any) => b?.slug)
    .slice(0, 20)
    .map((blog: any) => ({
      params: { slug: String(blog.slug) },
    }));

  console.log("> ✅ Prebuilding blog paths:", paths.length);

  return { ...ret, paths };
}

export async function getStaticProps({
  params,
}: {
  params: { slug: string };
}): Promise<{ props?: BlogProps; revalidate?: number; notFound?: boolean }> {
  try {
    if (!params?.slug) {
      console.warn("❌ Missing slug param in getStaticProps");
      return { notFound: true };
    }

    console.log("⚙️ Building blog page for slug:", params.slug);

    // Safe fetch wrapper
    const safe = async (fn: any, fallback: any = null) => {
      try {
        return await fn();
      } catch (e) {
        console.error("⚠️ getStaticProps fetch failed:", e);
        return fallback;
      }
    };

    const [config, blog, latestBlogListRaw, featuredProductList] = await Promise.all([
      safe(() => CMS.getConfig(), {}),
      safe(() => CMS.getBlogFromSlug(params.slug), null),
      safe(() => CMS.getAllBlogs({ sort: "-date_created", limit: 200 }), []),
      safe(() => CMS.getFeaturedProductList("tool"), []),
    ]);

    // 🧱 If blog not found → prevent build crash
    if (!blog) {
      console.warn("❌ Blog not found for slug:", params.slug);
      return { notFound: true };
    }

    // ✅ Filter out the current blog safely
    const latestBlogList = Array.isArray(latestBlogListRaw)
      ? latestBlogListRaw.filter((b: any) => b?.id !== blog.id)
      : [];

    return {
      props: {
        config,
        blog,
        latestBlogList,
        featuredProductList,
        pathList: [
          Paths.Frontend.HOME,
          Paths.Frontend.BLOG,
          { title: blog.title, href: `${Paths.Frontend.BLOG.href}/${blog.slug}` },
        ],
      },
      revalidate: 60, // ISR every 60 seconds
    };
  } catch (error) {
    console.error("💥 getStaticProps fatal error for slug:", params?.slug, error);
    return { notFound: true };
  }
}

// ----------------- Page Component -----------------
const Page = (props: BlogProps) => <BlogPage {...props} />;

export default Page;
