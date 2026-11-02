import React, { useEffect, useState } from "react";
import {
  Hero2,
  Breadcrumb,
  Section,
  CircularProgress,
  NextSeo,
  ToolGrid,
} from "@/ui/components/components";
import { getAssetPathFromID, Paths } from "@/contants";
import { Layout } from "@/ui/layouts/layouts";
import { CMS, Product, Configuration } from "@/lib/lib";
import { useAPI } from "@/ui/logic/api";
import { AuthControls, useAuthState } from "@/ui/logic/auth";
import { colors } from "@/../style_constants";
import { useDialogControls } from "@/ui/components/components";

interface NewToolPageProps {
  config: Configuration;
}

export async function getStaticProps() {
  try {
    const config = await CMS.getConfig();
    return { props: { config }, revalidate: 60 };
  } catch (error) {
    console.error("favorites getStaticProps error:", error);
    return { props: { config: {} as Configuration }, revalidate: 60 };
  }
}

const Page = ({ config }: NewToolPageProps) => {
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getAllBookmarkedTools } = useAPI();
  const { user } = useAuthState();
  const { openDialog } = useDialogControls<void>({ id: Paths.DIALOG_ID.LOGIN });

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        openDialog();
        setIsLoading(false);
        return;
      }

      try {
        const data = await getAllBookmarkedTools();
        setResults(data);
      } catch (error) {
        console.error("Error fetching bookmarked tools:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, getAllBookmarkedTools, openDialog]);

  const heroBgUrl = getAssetPathFromID(config.favorites_hero_banner?.id) ?? "";

  return (
    <AuthControls>
      {({ user }) => (
        <>
          <NextSeo
            title={config.favorites_meta_title ?? "Favorites"}
            description={config.favorites_meta_description ?? ""}
          />

          <Layout.Base
            config={config}
            className="items-center mb-5 max-w-content-width"
          >
            <Hero2 bgUrl={heroBgUrl} className="flex flex-col gap-5 py-16">
              {config.favorites_hero_title && config.favorites_hero_title}
            </Hero2>

            <div className="w-full">
              <Breadcrumb
                className="mb-6"
                path={[Paths.Frontend.HOME, Paths.Frontend.FAVORITES]}
              />

              <Section id="favorites" title="" className="w-full">
                <div className="flex flex-col justify-center items-center min-h-56 w-full">
                  {isLoading ? (
                    <CircularProgress
                      color={colors.primary}
                      backgroundColor={colors.bgPrimary}
                      isIndeterminate
                    />
                  ) : results.length > 0 ? (
                    <ToolGrid toolList={results} disableCardAnimation />
                  ) : (
                    <p className="text-gray-500 text-lg font-medium">
                      No bookmarked tools found.
                    </p>
                  )}
                </div>
              </Section>
            </div>
          </Layout.Base>
        </>
      )}
    </AuthControls>
  );
};

export default Page;
