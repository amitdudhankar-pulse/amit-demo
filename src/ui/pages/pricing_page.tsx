import { parseAMW, Section, Text } from "@/ui/components/components";
import { Layout } from "@/ui/layouts/layouts";
import { Configuration, PricingPageInfo, PricingPlan } from "@/lib/lib";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { startPayment } from "@/lib/razorpayClient";

interface PageProps {
  config: Configuration;
  pricing: {
    page: PricingPageInfo;
    plans: PricingPlan[];
  };
}

const Page = ({ config, pricing }: PageProps) => {
  const page = pricing?.page ?? ({} as PricingPageInfo);
  const plans = pricing?.plans ?? [];
  const whyPoints = Array.isArray(page.why_list_points) ? page.why_list_points : [];
  console.log("Pricing Page Data:", page, plans);
  const stripHTML = (text?: string) => (text ?? "").replace(/<[^>]+>/g, "");

  return (
    <Layout.General
      config={config}
      meta={{
        title: stripHTML(page.meta_title),
        description: stripHTML(page.meta_description),
      }}
      className="items-center mb-5 w-full max-w-content-width"
      title={`<h1>${page.title}</h1>`}
      bgURL={
        "https://uat-cms.groupify.ai/assets/bd21e881-66c9-4e4d-9dc4-f1b3dde6b116"
      }
    >
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className="flex flex-col my-7 gap-default-vertical-gap w-full text-start">
        <Section title={stripHTML(page.intro_title)} id="pricing">
          <div className="flex gap-10 flex-col">
            <div className="flex flex-col my-12 gap-16 w-full text-start">
              {/* INTRO SECTION */}

              {/* Intro Description (HTML supported) */}
              <div className="prose max-w-none text-lg leading-relaxed">
                {parseAMW(page.intro_description)}
              </div>

              {/* WHY LIST WITH GROUPIFYAI */}
              <div>
                <h3 className="font-semibold text-xl mb-3">
                  {stripHTML(page.why_list_title)}
                </h3>

                <ul className="space-y-2">
                  {whyPoints.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-lg">
                      <span>✅</span>
                      <span>{p.point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {plans.map((e) => (
                <div
                  key={e.id}
                  className="relative bg-white rounded-xl shadow-xl p-8 border border-gray-200 flex flex-col h-full hover:shadow-2xl transition"
                >
                  <div className="flex flex-col gap-4 mb-6">
                    {e.image && (
                      <Image
                        className="mx-auto w-full md:w-[70%] lg:w-[80%] rounded-lg"
                        src={e.image}
                        alt={e.title}
                      />
                    )}

                    <h3 className="text-2xl font-bold text-gray-800 text-center">
                      {e.title}
                    </h3>

                    <ul className="space-y-2 text-lg">
                      {(e.features ?? []).map((f) => (
                        <li key={f.id} className="flex items-start gap-2">
                          <span>✅</span>

                          <span>
                            {f.text.map((t, i) => (
                              <span key={i} className="block">
                                {parseAMW(t.points)}
                              </span>
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* {(e.price_original || e.price_discounted) && (
                    <div className="flex items-center gap-3 text-xl mb-4">
                      {e.price_original && (
                        <span className="line-through text-gray-400">
                          ${e.price_original}
                        </span>
                      )}
                      {e.price_discounted && (
                        <span className="font-bold text-primary text-3xl">
                          ${e.price_discounted}
                        </span>
                      )}
                    </div>
                  )} */}

                  <Link
                    href={e.button_url ?? "#"}
                    target="_blank"
                    onClick={(event) => {
                      event.preventDefault();

                      const price = e.price_discounted ?? e.price_original ?? 0;
                      const email =
                        localStorage.getItem("groupify_user_email") ?? "";

                      if (!email) {
                        // alert("Please provide your email before purchasing.");
                      window.location.href = "/sponsorship";
                        return;
                      }
                      // window.location.href = "/sponsorship";

                      startPayment({
                        amount: price,
                        email, // 🔥 user's email from form
                        planName: e.title,
                        onSuccess: () => {
                          localStorage.removeItem("groupify_user_email"); // 🧹 clear before redirect
                          window.location.href = "/payment-success";
                        },
                      });
                    }}
                    rel="noopener noreferrer"
                    className="mt-auto w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition text-center block font-medium"
                  >
                    {e.button_text}
                  </Link>

                  {e.is_custom && (
                    <p className="text-center text-sm italic mt-2 text-gray-500">
                      Tailored solutions available
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="w-full">
              <Text.H3>
                {page.contact_text}{" "}
                <a href={`mailto:${page.contact_email}`}>
                  {page.contact_email}
                </a>
              </Text.H3>
            </div>
          </div>
          {/* <h2 className="text-2xl font-bold">
            Indian customers can contact us at info@groupify.ai for any payment
            assistance.
          </h2> */}
          {/* TERMS & CONDITIONS */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Terms & Conditions</h2>

            <ol className="list-decimal pl-6 space-y-6 text-lg leading-relaxed">
              <li>
                <strong className="text-xl">General Terms</strong>
                <ul className="list-disc pl-6 space-y-3 mt-3">
                  <li>
                    By purchasing any listing, sponsorship, or newsletter
                    mention on GroupifyAI, you agree to comply with these terms
                    and conditions.
                  </li>
                  <li>
                    GroupifyAI reserves the right to modify or discontinue any
                    pricing plan at its discretion.
                  </li>
                  <li>
                    All purchases are final, and refunds will be considered only
                    under specific conditions.
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-xl">
                  AI Tool Listing & Verification
                </strong>
                <ul className="list-disc pl-6 space-y-3 mt-3">
                  <li>
                    Listings will be reviewed before publication to ensure they
                    meet GroupifyAI’s content guidelines.
                  </li>
                  <li>
                    Updates to listed tools will be processed within 2 business
                    days after submission.
                  </li>
                  <li>
                    Verified badges are granted at GroupifyAI’s discretion based
                    on credibility and authenticity.
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-xl">
                  Sponsorship & Promotional Services
                </strong>
                <ul className="list-disc pl-6 space-y-3 mt-3">
                  <li>
                    Sponsored placements on the homepage, category pages, and
                    newsletter will be active for the agreed-upon duration.
                  </li>
                  <li>
                    Social media promotions are subject to GroupifyAI’s content
                    guidelines and approval.
                  </li>
                  <li>
                    GroupifyAI reserves the right to adjust the placement based
                    on availability and engagement.
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-xl">Newsletter Mentions</strong>
                <ul className="list-disc pl-6 space-y-3 mt-3">
                  <li>
                    The tool featured in the newsletter must align with our
                    audience’s interests.
                  </li>
                  <li>
                    GroupifyAI does not guarantee a specific number of
                    engagements but ensures the email reaches our 10K+ relevant
                    subscribers.
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-xl">
                  Refund & Cancellation Policy
                </strong>
                <ul className="list-disc pl-6 space-y-3 mt-3">
                  <li>
                    Refunds will be granted only in cases where the service was
                    not delivered as per agreed terms.
                  </li>
                  <li>
                    No refunds will be issued for completed services or expired
                    sponsorships.
                  </li>
                  <li>
                    Any cancellation must be submitted to{" "}
                    <a
                      href="mailto:info@groupify.ai"
                      className="text-primary underline"
                    >
                      info@groupify.ai
                    </a>{" "}
                    at least 2 days prior to the scheduled campaign.
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-xl">Content & Compliance</strong>
                <ul className="list-disc pl-6 space-y-3 mt-3">
                  <li>
                    The AI tools listed must comply with ethical AI practices
                    and must not promote harmful or misleading content.
                  </li>
                  <li>
                    GroupifyAI reserves the right to remove or suspend any
                    listing that violates our policies.
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-xl">Contact & Support</strong>
                <ul className="list-disc pl-6 space-y-3 mt-3">
                  <li>
                    For any inquiries regarding pricing, listings, or
                    sponsorships, please contact{" "}
                    <a
                      href="mailto:info@groupify.ai"
                      className="text-primary underline"
                    >
                      info@groupify.ai
                    </a>
                    .
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </Section>
      </div>
    </Layout.General>
  );
};

export { Page };
export type { PageProps };
