import { CMS } from "@/lib/lib";
import { PaymentSuccessPage } from "@/ui/pages/payment-success-page";
import { NextSeo } from "@/ui/components/components";

export async function getStaticProps() {
  try {
    const config = await CMS.getConfig();

    return {
      props: { config },
      revalidate: 60, // regenerate every 60 sec
    };
  } catch (error) {
    console.error("payment-success getStaticProps error:", error);
    return {
      props: { config: {} },
      revalidate: 60,
    };
  }
}

export default function PaymentSuccess({ config }: any) {
  return (
    <>
      <NextSeo
        title="Payment Successful – GroupifyAI"
        description="Your payment was successful. Thank you for your submission!"
      />

      <PaymentSuccessPage config={config} />
    </>
  );
}
