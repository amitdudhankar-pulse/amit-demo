import { Layout } from "@/ui/layouts/layouts";
import { Section, parseAMW, Button, Form } from "@/ui/components/components";
import { Configuration, SponsorshipPageInfo } from "@/lib/lib";
import { useState } from "react";
import { CMS } from "@/lib/lib";

export interface PageProps {
  config: Configuration;
  page: SponsorshipPageInfo;
}

const Page = ({ config, page }: PageProps) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const stripHTML = (text?: string) => (text ?? "").replace(/<[^>]+>/g, "");
  const pageInfo = page ?? ({} as SponsorshipPageInfo);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const body = Object.fromEntries(new FormData(e.currentTarget)) as any;

    try {
      await CMS.addSponsorshipLead(body);
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout.General
      config={config}
      meta={{
        title: pageInfo.meta_title ?? "",
        description: pageInfo.meta_description ?? "",
      }}
      title={`<h1>${pageInfo.title ?? ""}</h1>`}
      className="items-center mb-5 w-full max-w-content-width"
      bgURL={
        "https://uat-cms.groupify.ai/assets/bd21e881-66c9-4e4d-9dc4-f1b3dde6b116"
      }
    >
      <Section title={stripHTML(pageInfo.contact_title)} id="contact">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-10 border">
          <div className="prose mb-8 text-lg">
            {parseAMW(pageInfo.contact_description)}
          </div>

          {done ? (
            <p className="text-green-600 text-lg font-medium">
              We’ve received your request. We’ll contact you soon.
            </p>
          ) : (
            <Form.SponsorshipContact
              onSubmit={async (data) => {
                setLoading(true);
                try {
                  await CMS.addSponsorshipLead(data);
                  setDone(true);
                } finally {
                  setLoading(false);
                }
              }}
            />
          )}
        </div>
      </Section>
    </Layout.General>
  );
};

export { Page };
