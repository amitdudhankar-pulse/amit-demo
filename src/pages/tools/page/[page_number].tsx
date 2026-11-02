import { Layout } from "@/ui/layouts/layouts";
import { useEffect, useState } from "react";
import { Constants, getAssetPathFromID, Paths } from "@/contants";
import { CMS, Configuration, Product } from "@/lib/lib";
import { ToolCard, ContentGrid, Pagination } from "@/ui/components/components";
import {
  ToolFilterMenu,
  ToolFilterProvider,
  useToolFilter,
} from "@/ui/components/tool_filter";
import { useRouter } from "next/router";

const PER_PAGE_LIMIT = 12;

// ---------- STATIC PATHS ----------
export async function getStaticPaths() {
  const ret = { paths: [], fallback: "blocking" };

  if (Constants.DEPLOYMENT === "staging") return ret;

  const totalTools = await CMS.getProductCount("tool");
  const totalPages = Math.ceil(totalTools / PER_PAGE_LIMIT);

  const pagesToPrebuild = Math.min(totalPages, 5);

  const paths = Array.from({ length: pagesToPrebuild }, (_, i) => ({
    params: { page_number: (i + 1).toString() },
  }));

  return { ...ret, paths };
}

// ---------- STATIC PROPS ----------
export async function getStaticProps(context: {
  params: { page_number: string };
}) {
  const { params } = context;
  const currentPage = parseInt(params.page_number);

  // STATIC BUILD DOES NOT SUPPORT QUERY — USE DEFAULTS
  const contentType = "tool";
  const price = null;

  const offset = PER_PAGE_LIMIT * (currentPage - 1);

  const filter: any = {};
  if (price) filter.pricing_mode = price;

  const [total, toolList, config] = await Promise.all([
    CMS.getProductCount(contentType as any, { filter }),
    CMS.getAllProducts(contentType as any, {
      offset,
      limit: PER_PAGE_LIMIT,
      filter,
      sort: ["order", "-date_created", "-id"],
    }),
    CMS.getConfig(),
  ]);

  return {
    props: {
      currentPage,
      totalPage: Math.ceil(total / PER_PAGE_LIMIT),
      config,
      toolList,
      contentType,
      price,
    },
    revalidate: 60,
  };
}

const ToolsContent = ({
  initialTools,
  initialPage,
  initialTotal,
}: {
  initialTools: Product[];
  initialPage: number;
  initialTotal: number;
}) => {
  const { filterState } = useToolFilter();

  const [tools, setTools] = useState(initialTools);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  // const fetchFilteredTools = async (pageNum = page) => {
  //   setLoading(true);

  //   const params = new URLSearchParams({
  //     type: filterState.state.contentType,
  //     page: pageNum.toString(),
  //   });

  //   // PRICE FILTER ONLY FOR TOOLS
  //   if (filterState.state.contentType === "tool") {
  //     const price =
  //       filterState.state.showFree &&
  //       !filterState.state.showPaid &&
  //       !filterState.state.showFreemium
  //         ? "free"
  //         : filterState.state.showPaid &&
  //           !filterState.state.showFree &&
  //           !filterState.state.showFreemium
  //         ? "paid"
  //         : "";

  //     if (price) params.set("price", price);
  //   }

  //   // CURATION FILTERS (TOOLS ONLY)
  //   if (filterState.state.contentType === "tool") {
  //     if (filterState.state.featured) params.set("featured", "true");
  //     if (filterState.state.editorsChoice) params.set("editor_choice", "true");
  //     if (filterState.state.verified) params.set("verified", "true");
  //     if (filterState.state.popular) params.set("popular", "true");
  //   }

  //   const res = await fetch(`/api/tools?${params.toString()}`);
  //   const data = await res.json();

  //   setTools(data.tools);
  //   setTotal(data.total);
  //   setPage(pageNum);
  //   setLoading(false);
  // };

  const fetchFilteredTools = async (pageNum = page) => {
    setLoading(true);

    const params = new URLSearchParams({
      type: filterState.state.contentType, // MUST send type always
      page: pageNum.toString(),
    });

    // ⭐ CURATION FILTERS (TOOLS + COURSES)
    if (filterState.state.featured) params.set("featured", "true");
    if (filterState.state.editorsChoice) params.set("editor_choice", "true");
    if (filterState.state.verified) params.set("verified", "true");
    if (filterState.state.popular) params.set("popular", "true");

    // 💰 PRICE FILTERS → ONLY for tools
    if (filterState.state.contentType === "tool") {
      const modes: string[] = [];

      if (filterState.state.showActiveDeals) modes.push("active_deals");
      if (filterState.state.showFree) modes.push("free");
      if (filterState.state.showFreemium) modes.push("freemium");
      if (filterState.state.showPaid) modes.push("paid");

      // backend expects CSV of pricing_mode
      if (modes.length > 0) params.set("pricing_mode", modes.join(","));
    }

    const res = await fetch(`/api/tools?${params.toString()}`);
    const data = await res.json();

    setTools(data.tools);
    setTotal(data.total);
    setPage(pageNum);
    setLoading(false);
  };

  useEffect(() => {
    fetchFilteredTools(1);
  }, [filterState]);

  return (
    <>
      <ToolFilterMenu />

      <ContentGrid
        title="Explore AI Tools and Courses"
        breadcrumb={[
          Paths.Frontend.HOME,
          { title: "AI Tools & Courses", href: "/tools/page/1" },
        ]}
        dataList={tools}
        builder={(tool, i, className) => (
          <ToolCard className={className} {...tool} />
        )}
      />

      <Pagination
        current={page}
        total={total}
        className="text-primary"
        pageUrlPrefix="/tools/page"
        onPageChange={(p) => fetchFilteredTools(p)} // CSR MODE
      />

      {loading && <p className="text-center py-5">Loading...</p>}
    </>
  );
};

// ---------- PAGE UI ----------
const ToolsListPage = ({
  currentPage,
  totalPage,
  config,
  toolList,
}: {
  currentPage: number;
  totalPage: number;
  config: Configuration;
  toolList: Product[];
}) => {
  return (
    <ToolFilterProvider enable={{ price: true, curation: true }}>
      <Layout.General
        config={config}
        meta={{
          title: "AI Tools Directory",
          description: "Explore the best AI tools updated daily.",
        }}
        title="Browse All AI Tools and Courses"
        bgURL={getAssetPathFromID(config.blogs_hero_banner?.id)}
        className="items-center mb-5 max-w-content-width"
      >
        <ToolsContent
          initialTools={toolList}
          initialPage={currentPage}
          initialTotal={totalPage}
        />
      </Layout.General>
    </ToolFilterProvider>
  );
};

export default ToolsListPage;
