import * as React from "react";
import { Layout } from "@/ui/layouts/layouts";
import { Constants, getAssetPathFromID, Paths } from "@/contants";
import { Blog, CMS, Configuration } from "@/lib/lib";
import {
  ArticleCard,
  ContentGrid,
  NewsletterBanner,
  Pagination,
} from "@/ui/components/components";

const PER_PAGE_LIMIT = 12;

// ----------------- Static Paths -----------------
export async function getStaticPaths() {
  const ret = { paths: [] as { params: { page_number: string } }[], fallback: "blocking" };

  // Skip generating pages in staging
  if (Constants.DEPLOYMENT === "staging") return ret;

  // Get total number of blogs
  const blogCount = await CMS.getBlogsCount();
  const totalPages = Math.ceil((blogCount ?? 0) / PER_PAGE_LIMIT);

  // ✅ Prebuild only first few pages (e.g., first 5 pages)
  const pagesToPrebuild = Math.min(totalPages, 5);

  const paths = Array.from({ length: pagesToPrebuild }, (_, i) => ({
    params: { page_number: (i + 1).toString() },
  }));

  // Optional debug log
  console.log("> Prebuilding blog pagination pages:", paths.length);

  return { ...ret, paths };
}


// ----------------- Static Props -----------------
export async function getStaticProps({ params }: { params: { page_number: string } }) {
  const currentPage = parseInt(params.page_number);

  // ✅ Fetch blog count, blogs, and config in parallel
  const [blogCount, blogList, config] = await Promise.all([
    CMS.getBlogsCount(),
    CMS.getAllBlogs({
      offset: PER_PAGE_LIMIT * (currentPage - 1),
      limit: PER_PAGE_LIMIT,
    }),
    CMS.getConfig(),
  ]);

  const totalPage = Math.ceil((blogCount ?? 0) / PER_PAGE_LIMIT);

  return {
    props: {
      currentPage,
      totalPage,
      config,
      blogList,
    },
    revalidate: 60, // ISR every 60s
  };
}

// ----------------- Page Component -----------------
const BlogsListPage = ({
  currentPage,
  totalPage,
  config,
  blogList,
}: {
  currentPage: number;
  totalPage: number;
  config: Configuration;
  blogList: Blog[];
}) => {
  return (
    <Layout.General
      config={config}
      meta={{
        title: config.blogs_meta_title,
        description: config.blogs_meta_description,
      }}
      title={config.blogs_hero_title}
      bgURL={getAssetPathFromID(config.blogs_hero_banner?.id)}
      className="items-center mb-5 max-w-content-width"
    >
      <ContentGrid
        breadcrumb={[Paths.Frontend.HOME, Paths.Frontend.BLOG]}
        title={config.blogs_section_title}
        dataList={blogList}
        builder={(e, i, className) => (
          <ArticleCard className={className} blog={e} disableMargins />
        )}
      />
      <Pagination
        className="text-primary"
        current={currentPage}
        total={totalPage}
        pageUrlPrefix={Paths.Frontend.BLOG_PAGES.href}
      />
      <NewsletterBanner config={config} />
    </Layout.General>
  );
};

export default BlogsListPage;
