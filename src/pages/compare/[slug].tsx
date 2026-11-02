import {
  Text,
  Section,
  Image,
  Rating,
  Button,
  parseAMW,
  Link,
} from "@/ui/components/components";
import { getAssetPathFromID, Paths } from "@/contants";
import { Layout } from "@/ui/layouts/layouts";
import { Configuration, CMS, Product } from "@/lib/lib";
import { PropsWithChildren } from "react";

interface PageProps {
  product_1: Product;
  product_2: Product;
  product_3?: Product;
  config: Configuration;
}

export async function getServerSideProps({
  params,
}: {
  params: { slug: string };
}): Promise<{ props: PageProps }> {
  // ✅ Fetch all products and config in parallel
  const slugs = params.slug.split("-vs-");
  const [toolList, config] = await Promise.all([
    Promise.all(slugs.map((slug) => CMS.getProductsFromSlug("all", slug))),
    CMS.getConfig(),
  ]);
  const filteredTools = toolList.filter(Boolean) as Product[];

  const data: PageProps = {
    config,
    product_1: filteredTools[0]!,
    product_2: filteredTools[1]!,
  };
  if (filteredTools[2]) data.product_3 = filteredTools[2];

  return { props: data };
}

// ---------------- Table Components ----------------
const Td = ({ children }: PropsWithChildren) => (
  <td className="p-3 border border-boundary justify-center align-top">
    {children}
  </td>
);

const Th = ({ children }: PropsWithChildren) => (
  <th className="p-3 border border-boundary">{children}</th>
);

const Tr = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <tr className={`h-full ${className ?? ""}`}>{children}</tr>
);

const ComparisonTable = ({ product_1, product_2, product_3 }: PageProps) => {
  const productList = [product_1, product_2, product_3].filter(
    Boolean
  ) as Product[];

  return (
    <table className="table-auto">
      <tbody className="min-w-[2200px]">
        {/* Header Row */}
        <Tr>
          <th></th>
          {productList.map((prod, i) => (
            <Th key={i}>
              <div className="flex flex-row xl:flex-nowrap justify-center flex-wrap items-center gap-x-3">
                <Image
                  className="size-16 rounded-2xl object-contain"
                  src={getAssetPathFromID(prod.logo?.id) ?? prod.logo_url ?? ""}
                  alt={prod.logo?.title ?? prod.title}
                  fallbackSrc={Paths.IMAGE.FALLBACK}
                />
                <Link href={prod.url}>
                  <Text.H2>{prod.title}</Text.H2>
                </Link>
              </div>
            </Th>
          ))}
        </Tr>

        {/* Short Description */}
        <Tr>
          <Td>
            <Text.H3>Short Description</Text.H3>
          </Td>
          {productList.map((prod, i) => (
            <Td key={i}>
              <Text.P className="h-full">{prod.short_description}</Text.P>
            </Td>
          ))}
        </Tr>

        {/* Categories */}
        <Tr>
          <Td>
            <Text.H3>Categories</Text.H3>
          </Td>
          {productList.map((prod, i) => (
            <Td key={i}>
              <Text.P>
                {prod.category_relations
                  ?.map((cat) => cat?.title)
                  .filter(Boolean)
                  .join(", ")}
              </Text.P>
            </Td>
          ))}
        </Tr>

        {/* Pricing */}
        <Tr>
          <Td>
            <Text.H3>Pricing</Text.H3>
          </Td>
          {productList.map((prod, i) => (
            <Td key={i}>
              <Text.P>{prod.pricing_mode?.title ?? "—"}</Text.P>
            </Td>
          ))}
        </Tr>

        {/* Tags */}
        <Tr>
          <Td>
            <Text.H3>Tags</Text.H3>
          </Td>
          {productList.map((prod, i) => (
            <Td key={i}>
              <Text.P>{prod.visible_tags?.join(", ")}</Text.P>
            </Td>
          ))}
        </Tr>

        {/* Use Cases */}
        <Tr>
          <Td>
            <Text.H3>Use Cases</Text.H3>
          </Td>
          {productList.map((prod, i) => (
            <Td key={i}>
              <div className="flex w-full h-full justify-start items-start">
                {parseAMW(prod.use_cases ?? "")}
              </div>
            </Td>
          ))}
        </Tr>

        {/* Ratings */}
        {[
          "overall_satisfaction",
          "value_for_money",
          "intuitive_interface",
          "ease_of_use",
          "ease_of_customization",
        ].map((key) => (
          <Tr key={key}>
            <Td>
              <Text.H3>
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Text.H3>
            </Td>
            {productList.map((prod, i) => {
              const ratingValue = Number(prod[key as keyof Product] ?? 0);
              return (
                <Td key={i}>
                  <Rating
                    rating={ratingValue}
                    size={key === "overall_satisfaction" ? 30 : undefined}
                  />
                  <Text.P>({ratingValue})</Text.P>
                </Td>
              );
            })}
          </Tr>
        ))}

        {/* Pricing Button */}
        <Tr>
          <Td>
            <Text.H3>Link to Pricing Page</Text.H3>
          </Td>
          {productList.map((prod, i) => (
            <Td key={i}>
              {prod.pricing_url ? (
                <Button.Primary
                  text="Pricing"
                  action={{ type: "url", url: prod.pricing_url }}
                />
              ) : (
                "—"
              )}
            </Td>
          ))}
        </Tr>
      </tbody>
    </table>
  );
};

// ---------------- Page Component ----------------
const Page = (props: PageProps) => {
  const title = [
    props.product_1.title,
    props.product_2.title,
    props.product_3?.title,
  ]
    .filter(Boolean)
    .join(" vs ");

  return (
    <Layout.General
      config={props.config}
      title={`<h1>${title}</h1>`}
      meta={{
        title: `Comparison between - ${title}`,
        description: `Comparison between - ${title}`,
      }}
      className="items-center mb-5 max-w-content-width"
    >
      <Section id="comparison" title="" className="w-full">
        <div className="flex items-center content-center min-h-56 w-full overflow-x-auto">
          <ComparisonTable {...props} />
        </div>
      </Section>
    </Layout.General>
  );
};

export default Page;
