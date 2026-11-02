import { CMS } from "@/lib/lib";
import { TextualPage, TextualPageProps } from "@/ui/pages";
import { NextSeo } from "@/ui/components/components";

export async function getStaticProps(): Promise<{
  props: TextualPageProps;
  revalidate: number;
}> {
  try {
    const [text, config] = await Promise.all([CMS.getTnCText(), CMS.getConfig()]);

    return {
      props: { text, config },
      revalidate: 60,
    };
  } catch (error) {
    console.error("terms-and-conditions getStaticProps error:", error);
    return {
      props: { text: "", config: {} as any },
      revalidate: 60,
    };
  }
}

const TnCPage = ({ text, config }: TextualPageProps) => (
  <>
    <NextSeo
      title={config.tnc_meta_title ?? "Terms & Conditions – GroupifyAI"}
      description={
        config.tnc_meta_description ??
        "Read the terms and conditions of using GroupifyAI's platform."
      }
    />

    <TextualPage text={text} config={config} />
  </>
);

export default TnCPage;
