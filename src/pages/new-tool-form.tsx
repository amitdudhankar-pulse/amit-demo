import React from "react";
import { Layout } from "@/ui/layouts/layouts";
import { CMS, Configuration, NewToolFormPage } from "@/lib/lib";
import { Form, parseAMW } from "@/ui/components/components";
import { getAssetPathFromID } from "@/contants";

interface NewToolPageProps {
  config: Configuration;
  pageConfig: NewToolFormPage[];
}

export async function getStaticProps(): Promise<{
  props: NewToolPageProps;
  revalidate?: number;
}> {
  try {
    const config = await CMS.getConfig();
    const newToolFormConfig = (await CMS.getConfigv2())
      .newToolFormPage as NewToolFormPage[];

    return {
      props: {
        config,
        pageConfig: newToolFormConfig,
      },
      revalidate: 60, // 60 seconds
    };
  } catch (error) {
    console.error("new-tool-form getStaticProps error:", error);
    return {
      props: {
        config: {} as Configuration,
        pageConfig: [{ hero_title: "", instructions: "" } as NewToolFormPage],
      },
      revalidate: 60,
    };
  }
}

const NewToolPage = ({ config, pageConfig }: NewToolPageProps) => {
  const page = pageConfig?.[0] ?? ({} as NewToolFormPage);
  return (
    <Layout.General
      config={config}
      className="items-center mb-5 w-full max-w-content-width"
      title={page.hero_title ?? ""}
      bgURL={getAssetPathFromID(page.hero_banner?.id)}
    >
      <div className="flex flex-col justify-start w-full max-w-screen-lg gap-6">
        {parseAMW(page.instructions ?? "")}
      </div>

      <Form.NewTool
        className="w-full max-w-screen-lg p-4 bg-gray-200 bg-opacity-40 rounded-xl outline-1 outline-boundary-light flex flex-col items-center content-center"
        legend="Subscribe To Our Newsletter"
      />
    </Layout.General>
  );
};

export default NewToolPage;
