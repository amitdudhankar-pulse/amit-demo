import React, { useState, useEffect, useCallback } from "react";
import {
  Hero2,
  SearchBox,
  ToolGrid,
  Section,
  Breadcrumb,
  CircularProgress,
  parseAMW,
  NextSeo,
} from "@/ui/components/components";
import { getAssetPathFromID, Paths } from "@/contants";
import { Layout } from "@/ui/layouts/layouts";
import { Configuration, CMS, Product } from "@/lib/lib";
import { colors } from "@/../style_constants";

interface SearchPageProps {
  config: Configuration;
  toolCount: number;
}

export async function getStaticProps(): Promise<{
  props: SearchPageProps;
  revalidate?: number;
}> {
  try {
    const [config, toolCount] = await Promise.all([
      CMS.getConfig(),
      CMS.getProductCount("all"),
    ]);

    return {
      props: { config, toolCount },
      revalidate: 60 * 60 * 5, // 5 hours
    };
  } catch (error) {
    console.error("search getStaticProps error:", error);
    return {
      props: { config: {} as Configuration, toolCount: 0 },
      revalidate: 60,
    };
  }
}

const SearchPage = ({ config, toolCount }: SearchPageProps) => {
  const [results, setResults] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: Product[] = [];
      if (query.trim() === "") {
        data = await CMS.getAllProducts("all", { limit: 20 });
      } else {
        data = await CMS.searchProduct(query, {
          tagSearch: true,
          titleSearch: true,
          descriptionSearch: true,
        });
      }
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <>
      <NextSeo
        title={config.search_meta_title}
        description={config.search_meta_description}
      />

      <Layout.Base config={config} className="items-center mb-5 max-w-content-width">
        <Hero2
          bgUrl={getAssetPathFromID(config.search_hero_banner?.id) ?? ""}
          className="flex flex-col gap-5 py-16"
        >
          {parseAMW(config.search_hero_title)}
          <SearchBox onSearch={setQuery} />
        </Hero2>

        <div className="w-full">
          <Breadcrumb className="mb-6" path={[Paths.Frontend.HOME, Paths.Frontend.SEARCH]} />

          <Section
            id="search-results"
            title={query ? `Results for "${query}"` : "Explore the AI tools"}
            subtitle={
              query
                ? `Searched through ${toolCount} AI tools worldwide`
                : "Use search to find the best match"
            }
            className="w-full"
          >
            <div className="flex flex-col justify-center items-center min-h-56 w-full">
              {isLoading ? (
                <CircularProgress
                  color={colors.primary}
                  backgroundColor={colors.bgPrimary}
                  isIndeterminate
                />
              ) : (
                <ToolGrid toolList={results} disableCardAnimation activateLoadMore />
              )}
            </div>
          </Section>
        </div>
      </Layout.Base>
    </>
  );
};

export default SearchPage;
