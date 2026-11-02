import {
  ContentGrid,
  NewsCard,
  Pagination,
  NewsletterBanner,
} from "@/ui/components/components";
import { Constants, getAssetPathFromID, Paths } from "@/contants";
import { Layout } from "@/ui/layouts/layouts";
import { CMS, Configuration, News } from "@/lib/lib";
import { intlFormatDistance } from "date-fns";
import urlMetadata from "url-metadata";

const PER_PAGE_LIMIT = 12;

interface NewsItem {
  id: number;
  title: string | null;
  imageSrc: string;
  description: string | null;
  publisherLogo: string | null;
  publisherName: string | null;
  timeAgo: string | null;
  url: string;
}

// ---------------- Utility ----------------
const fetchList = async (newsList: News[]): Promise<NewsItem[]> => {
  const emergencyBannerImage = `${Constants.BASE_URL}/assets/ecd27d1f-30b9-41f1-924f-6e4df0f3a672.png`;
  const emergencyPublisherImage = `${Constants.BASE_URL}/assets/1a132da7-5db7-4e33-8f08-901db03994a4.png`;

  const list = await Promise.all(
    newsList.map(async (item) => {
      try {
        const metadata = await urlMetadata(item.URL);

        // Fix incomplete favicon URLs
        const startUrl = metadata["msapplication-starturl"];
        const favicons = (metadata.favicons || []).map(
          (f: {
            rel: string;
            type?: string;
            href?: string;
            sizes?: string;
          }) => ({
            rel: f.rel,
            type: f.type || null,
            href:
              f.href && startUrl && !f.href.includes(startUrl)
                ? startUrl + f.href
                : f.href || emergencyPublisherImage,
            sizes: f.sizes || null,
          })
        );

        return {
          id: item.id,
          title: metadata["og:title"] || null,
          description: metadata["og:description"] || null,
          // imageSrc: (metadata["og:image"]?.split(",")[0] ||
          //   emergencyBannerImage) as string,
          imageSrc: item.image?.id
            ? getAssetPathFromID(item.image.id)
            : "/static/news fallback.webp",

          timeAgo: item.date_created
            ? intlFormatDistance(new Date(item.date_created), new Date())
            : null,

          publisherName: metadata["og:site_name"] || null,
          publisherLogo: favicons[0]?.href || null,
          url: item.URL,
        } as NewsItem;
      } catch (error) {
        console.error("Metadata fetch failed:", error);
        return null;
      }
    })
  );

  // Filter out failed/null items
  return list.filter(Boolean) as NewsItem[];
};

// ---------------- Static Paths ----------------
export async function getStaticPaths() {
  const ret = {
    paths: [] as { params: { page_number: string } }[],
    fallback: "blocking",
  };

  // Skip generating pages in staging
  if (Constants.DEPLOYMENT === "staging") return ret;

  // Get total number of news items
  const newsCount = (await CMS.getNewsCount()) ?? 0;
  const totalPages = Math.ceil(newsCount / PER_PAGE_LIMIT);

  // ✅ Prebuild only first few pages (e.g., first 5 pages)
  const pagesToPrebuild = Math.min(totalPages, 5);

  const paths = Array.from({ length: pagesToPrebuild }, (_, i) => ({
    params: { page_number: (i + 1).toString() },
  }));

  // Optional debug log
  console.log("> Prebuilding news pagination pages:", paths.length);

  return { ...ret, paths };
}

// ---------------- Static Props ----------------
export async function getStaticProps({
  params,
}: {
  params: { page_number: string };
}) {
  const currentPage = parseInt(params.page_number);
  const [newsCount, config, newsDataList] = await Promise.all([
    CMS.getNewsCount(),
    CMS.getConfig(),
    CMS.getAllNews({
      offset: PER_PAGE_LIMIT * (currentPage - 1),
      limit: PER_PAGE_LIMIT,
    }),
  ]);

  const totalPage = Math.ceil((newsCount ?? 0) / PER_PAGE_LIMIT);
  const newsList = await fetchList(newsDataList);

  return {
    props: {
      currentPage,
      totalPage,
      config,
      newsList,
    },
    revalidate: 60,
  };
}

// ---------------- Page Component ----------------
const NewsListPage = ({
  currentPage,
  totalPage,
  newsList,
  config,
}: {
  currentPage: number;
  totalPage: number;
  newsList: NewsItem[];
  config: Configuration;
}) => (
  <Layout.General
    config={config}
    meta={{
      title: config.news_meta_title,
      description: config.news_meta_description,
    }}
    title={config.news_hero_title}
    bgURL={getAssetPathFromID(config.news_hero_banner?.id)}
    className="items-center mb-5 max-w-content-width"
  >
    <ContentGrid
      breadcrumb={[Paths.Frontend.HOME, Paths.Frontend.NEWS]}
      title={config.news_section_title}
      dataList={newsList}
      builder={(item, i, className) => (
        <NewsCard
          key={item.id}
          className={className}
          title={item.title ?? ""}
          imageSrc={item.imageSrc}
          description={item.description ?? ""}
          publisherLogo={item.publisherLogo ?? ""}
          publisherName={item.publisherName ?? ""}
          timeAgo={item.timeAgo ?? ""}
          url={item.url}
        />
      )}
    />
    <Pagination
      current={currentPage}
      total={totalPage}
      pageUrlPrefix={Paths.Frontend.NEWS_PAGES.href}
    />
    <NewsletterBanner config={config} />
  </Layout.General>
);

export default NewsListPage;
