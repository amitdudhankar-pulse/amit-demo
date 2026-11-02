import { CMS } from "@/lib/lib";
import {
  Page as SponsorshipPage,
  PageProps,
} from "@/ui/pages/sponsorship_page";

export async function getStaticProps() {
  try {
    const [config, page] = await Promise.all([
      CMS.getConfig(),
      CMS.getSponsorshipPage(),
    ]);

    return {
      props: {
        config,
        page,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("sponsorship getStaticProps error:", error);
    return {
      props: {
        config: {} as any,
        page: {
          title: "",
          meta_title: "",
          meta_description: "",
          contact_title: "",
          contact_description: "",
        },
      },
      revalidate: 60,
    };
  }
}

export default function Page(props: PageProps) {
  return <SponsorshipPage {...props} />;
}
