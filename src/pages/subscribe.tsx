import { Layout } from "@/ui/layouts/layouts";
import { Form, Text } from "@/ui/components/components";
import { ThanksMessage } from "@/ui/pages/thanks_message";
import { CMS, Configuration } from "@/lib/lib";
import { useState } from "react";
import TrustedBySlider from "@/ui/components/TrustedBySlider";

type TrustedByItem = {
  id: number;
  name: string;
  company_url?: string | null;
  logo: string | null;
};

interface SubscribePageProps {
  config: Configuration;
  trustedBy: TrustedByItem[];
}

export async function getStaticProps() {
  try {
    const [config, trustedBy] = await Promise.all([
      CMS.getConfig(),
      CMS.getTrustedBy(),
    ]);

    return {
      props: {
        config,
        trustedBy,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Subscribe getStaticProps error:", error);

    return {
      props: {
        config: {} as Configuration,
        trustedBy: [],
      },
      revalidate: 60,
    };
  }
}

const SubscribePage: React.FC<SubscribePageProps> = ({ config, trustedBy }) => {
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (data: any) => {
    await CMS.addNewsletterSubscriber(data);
    setSuccessMsg("You have successfully subscribed");
    setSubmitted(true);
  };

  return (
    <Layout.Base config={config} className="max-w-content-width mx-auto py-20">
      {!submitted ? (
        <div className="flex flex-col items-center gap-8 px-6 text-center">
          {/* H1 */}
          <Text.H1 className="font-bold">
            Subscribe to receive email updates from GroupifyAI.
          </Text.H1>

          {/* SEO Subtitle */}
          <Text.P className="text-lg text-gray-600 max-w-2xl">
            Get curated AI tools, product launches, and insights delivered
            straight to your inbox.
          </Text.P>

          {/* Newsletter Form */}
          <div className="w-full max-w-md">
            <Form.Newsletter onSubmit={handleSubmit} />
          </div>

          {/* Trusted By Section */}
          {trustedBy.length > 0 && (
            <div className="w-full mt-16">
              <TrustedBySlider items={trustedBy} />
            </div>
          )}
        </div>
      ) : (
        <ThanksMessage message={successMsg} />
      )}
    </Layout.Base>
  );
};

export default SubscribePage;
