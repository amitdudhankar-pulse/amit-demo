// import { Layout } from "@/ui/layouts/layouts";
import { CMS } from "@/lib/lib";
import { TextualPage, TextualPageProps } from "@/ui/pages";
import { NextSeo } from "next-seo";

export async function getStaticProps(): Promise<{
  props: TextualPageProps;
  revalidate: number;
}> {
  try {
    const [text, config] = await Promise.all([CMS.get404Text(), CMS.getConfig()]);

    return {
      props: { text, config },
      revalidate: 60, // ISR: regenerates every 60 seconds
    };
  } catch (error) {
    console.error("getStaticProps error (404 page):", error);
    return {
      props: { text: "Page not found", config: {} as any },
      revalidate: 60,
    };
  }
}


const Page = (props: TextualPageProps) => (
  <>
    <NextSeo title="404" />
    <TextualPage text={props.text} config={props.config} type="text-center" />
  </>
);

export default Page;
