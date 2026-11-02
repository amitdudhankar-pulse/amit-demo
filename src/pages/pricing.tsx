// import { CMS } from "@/lib/lib";
// import {
//   Page as PricingPage,
//   PageProps as PricingPageProps,
// } from "@/ui/pages/pricing_page";

// export async function getStaticProps() {
//   const config = await CMS.getConfig();

//   const props: PricingPageProps = {
//     config,
//   };

//   return {
//     props,
//     revalidate: 60,
//   };
// }

// const Page = (props: PricingPageProps) => <PricingPage {...props} />;
// export default Page;


import { CMS } from "@/lib/lib";
import {
  Page as PricingPage,
  PageProps as PricingPageProps,
} from "@/ui/pages/pricing_page";

export async function getStaticProps() {
  try {
    const [config, pricing] = await Promise.all([
      CMS.getConfig(),
      CMS.getPricingPage(),
    ]);

    const props: PricingPageProps = {
      config,
      pricing,
    };

    return {
      props,
      revalidate: 60,
    };
  } catch (error) {
    console.error("pricing getStaticProps error:", error);
    return {
      props: {
        config: {} as any,
        pricing: {
          page: {
            title: "",
            meta_title: "",
            meta_description: "",
            intro_title: "",
            intro_description: "",
            why_list_title: "",
            why_list_points: [],
            contact_text: "",
            contact_email: "",
          },
          plans: [],
        },
      },
      revalidate: 60,
    };
  }
}

export default function Page(props: PricingPageProps) {
  return <PricingPage {...props} />;
}
