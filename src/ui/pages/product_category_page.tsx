import {
  convertToEmbedLink,
  parseAMW as defaultParse,
} from "@/ui/components/utils/utils";
import {
  TabGroup,
  Section,
  ToolListing,
  Button,
  Rating as RatingUI,
  Image,
  Breadcrumb,
  ProductPageText as Text,
  ClickToOpenDialog,
  HorizontalScroller,
  ReviewCard,
  FAQs,
  FAQItem,
  SMIcons,
  NextSeo,
  Link,
  ToolGrid,
  ToolFilterProvider,
  ToolFilterMenu,
} from "@/ui/components/components";
import { Constants, getAssetPathFromID, Paths } from "@/contants";
import { Layout } from "@/ui/layouts/layouts";
import {
  CMS,
  Configuration,
  Product,
  Review,
  Rating,
  File,
  FAQ,
  CategoryV2 as Category,
  FunctionV2,
} from "@/lib/lib";
import { twMerge } from "tailwind-merge";
import { ComparisonControls, StatefulBuilder } from "@/ui/logic/logic";
import copy from "copy-to-clipboard";
import ToolFilterList from "../components/tool_filter";
import { useEffect, useRef, useState } from "react";

const parseAMW = (text: string) =>
  defaultParse(text, {
    p: Text.P,
    li: Text.LI,
  });

type PageProps = {
  data:
    | { layout_type: "categories"; element: Category }
    | { layout_type: "functions"; element: FunctionV2 };
  config: Configuration;
};

const ToolShowcase = (props: {
  data: Category | FunctionV2;
  className: string;
}) => {
  const largeImageClasses = "rounded-2xl aspect-video w-full overflow-auto";
  // const showVideo = !!props.data.youtube_url;
  return (
    <div className={twMerge("flex flex-col gap-1.5 w-full", props.className)}>
      <Image
        className={twMerge(
          largeImageClasses,
          "object-contain outline outline-1 outline-boundary-light bg-bg-primary"
        )}
        src={getAssetPathFromID(props.data.image?.id) ?? ""}
        alt={props.data.image?.title ?? ""}
        fallbackSrc={Paths.IMAGE.FALLBACK}
      />
    </div>
  );
};

const Hero = (props: PageProps) => {
  const logoSource =
    props.data.layout_type === "categories"
      ? getAssetPathFromID(props.data.element.logo?.id) ?? ""
      : undefined;
  const logoAltText =
    props.data.layout_type === "categories"
      ? props.data.element.logo?.title ?? props.data.element.title
      : undefined;

  const relatedTitle =
    props.data.layout_type === "categories"
      ? "Related Functions:"
      : "Related Courses:";
  const relatedItems: { url: string; title: string }[] | undefined =
    props.data.layout_type === "categories"
      ? props.data.element.functions?.map((e) => ({
          url: Paths.Frontend.HOME.href + e.slug,
          title: e.title,
        }))
      : props.data.element.related_courses?.map((e) => ({
          url: e.url,
          title: e.title,
        }));

  const Element1 = (
    <div className="flex flex-col justify-start items-start gap-4 max-w-full xl:max-w-[60%]">
      <div className="flex justify-between w-full items-center">
        <div className="justify-start items-center align-top gap-6 flex">
          {props.data.layout_type === "categories" && (
            <div className="relative w-fit h-fit">
              <Image
                className="w-28 aspect-square rounded-md object-contain outline outline-1 outline-boundary-light bg-bg-primary"
                src={logoSource}
                alt={logoAltText}
                fallbackSrc={Paths.IMAGE.FALLBACK}
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Text.H1 className="font-bold">{props.data.element.title}</Text.H1>
          </div>
        </div>
        <div className="flex flex-col gap-3 mx-4 min-h-9 aspect-square">
          {/* TODO: Add URL here */}
          <Button.Share url={"#"} />
        </div>
      </div>
      <ToolShowcase className="xl:hidden flex" data={props.data.element} />
      <Text.P>{props.data.element.short_description}</Text.P>
      {!!relatedItems && relatedItems.length > 0 && (
        <div>
          <div className="justify-start items-start gap-1 inline-flex flex-wrap">
            <span className="font-semibold">{relatedTitle}</span>
            {relatedItems?.map((e, i) => (
              <Link
                href={e.url}
                key={e.title}
                className="text-tertiary text-base font-normal font-roboto leading-normal"
              >
                {`${e.title}${i + 1 !== relatedItems?.length ? "," : ""}`}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  const Element2 = (
    <ToolShowcase className="xl:flex hidden " data={props.data.element} />
  );
  return (
    <div className={twMerge("justify-start items-center gap-8 flex w-full")}>
      {props.data.layout_type === "functions"
        ? [Element2, Element1]
        : [Element1, Element2]}
    </div>
  );
};
type ToolListItem = Omit<
  Omit<Product, "category_relations">,
  "function_relations"
>;

const ProductBody = (props: {
  config: Configuration;
  element: Category | FunctionV2;
  toolFilter: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const initialProducts = props.element.products ?? [];
  const [products, setProducts] = useState<ToolListItem[]>(
    props.element.products ?? []
  );

  useEffect(() => {
    if (!props.element.products || props.element.products.length === 0) {
      CMS.getCategoryFromSlug(props.element.slug).then((res) => {
        setProducts(res.products ?? []);
      });
    }
  }, []);

  const updateButtons = () => {
    const el = containerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    updateButtons();
  }, []);

  return (
    <ToolFilterProvider enable={{ price: true, curation: true }}>
      <div className="flex flex-col gap-20 w-full h-full">
        <TabGroup.Vertical className="gap-7 my-6 mt-0">
          <Section id="Tools" title={""} tabHide={!props.element.products}>
            {props.toolFilter && (
              <div className="flex w-full justify-end">
                <ToolFilterMenu />
              </div>
            )}
            {/* <ToolFilterList toolList={props.element.products}> */}
            <ToolFilterList toolList={products}>
              {(filteredList) => (
                <ToolGrid
                  className="p-0"
                  // toolList={
                  //   props.toolFilter ? filteredList : props.element.products
                  // }
                  toolList={
                    props.toolFilter && filteredList.length > 0
                      ? filteredList
                      : products
                  }
                  disableCardAnimation={true}
                  activateLoadMore={true}
                />
              )}
            </ToolFilterList>
          </Section>
          <Section
            id="Description"
            title={"Description"}
            tabHide={!props.element.description}
          >
            {parseAMW(props.element.description ?? "")}
          </Section>

          {/* <Section
            id="Related Topics"
            title={"Related Topics"}
            tabHide={!props.element.related_topics}
          >
            <div className="flex w-full gap-2">
              {props.element.related_topics?.map((e, i) => (
                <Link
                  key={e.title}
                  className="text-tertiary text-base font-normal font-roboto leading-normal outline outline-1 outline-boundary px-3 py-1 rounded-2xl"
                  href={e.url}
                >
                  {e.title}
                </Link>
              ))}
            </div>
          </Section> */}
          <Section
            id="Related Topics"
            title="Related Topics"
            tabHide={!props.element.related_topics}
          >
            <div className="relative w-full flex items-center">
              {/* Left Arrow */}
              <button
                onClick={() =>
                  containerRef.current?.scrollBy({
                    left: -300,
                    behavior: "smooth",
                  })
                }
                disabled={!canScrollLeft}
                className="absolute -left-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card disabled:opacity-30"
              >
                ◀
              </button>

              {/* Slider Container */}
              <div
                ref={containerRef}
                onScroll={updateButtons}
                className="
        flex gap-4 overflow-x-auto scrollbar-hide
        px-14 py-2
      "
              >
                {props.element.related_topics?.map((e) => (
                  <Link
                    key={e.title}
                    href={e.url}
                    className="
            min-w-[280px]
            max-w-[320px]
            rounded-xl
            border border-boundary
            bg-white
            px-4 py-3
            text-sm font-roboto text-tertiary
            leading-snug
            hover:shadow-md hover:border-tertiary
            transition
          "
                  >
                    {e.title}
                  </Link>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() =>
                  containerRef.current?.scrollBy({
                    left: 300,
                    behavior: "smooth",
                  })
                }
                disabled={!canScrollRight}
                className="absolute -right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card disabled:opacity-30"
              >
                ▶
              </button>
            </div>
          </Section>

          <Section
            id="Additional Topics"
            title={"Additional Topics"}
            tabHide={!props.element.additional_topics}
          >
            {parseAMW(props.element.additional_topics ?? "")}
          </Section>

          <Section
            title="FAQs"
            id="FAQs"
            className="bg-blbl"
            tabHide={!props.element.faq}
          >
            {props.element.faq && <FAQs itemList={props.element.faq} />}
          </Section>
        </TabGroup.Vertical>
      </div>
    </ToolFilterProvider>
  );
};

const Page = (props: PageProps & { toolFilter: boolean }) => {
  let logoSource: string | undefined;
  if (props.data.layout_type == "categories")
    logoSource = getAssetPathFromID(props.data.element.logo?.id);
  return (
    <>
      <NextSeo
        title={props.data.element.meta_title ?? props.data.element.title}
        description={
          props.data.element.meta_description ??
          props.data.element.short_description
        }
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              props.data.element.keywords?.reduce((a, b) => a + "," + b) ?? "",
          },
        ]}
        openGraph={{
          title: props.data.element.title,
          description: props.data.element.short_description,
          images: [
            {
              url: logoSource ?? Paths.IMAGE.FALLBACK,
            },
          ],
          // TODO: Add a url here
          // url: props.url,
        }}
      />
      <Layout.Base
        config={props.config}
        className="w-full flex-col justify-center lg:gap-6 gap-6 inline-flex my-8 max-w-content-width overflow-clip"
      >
        <Breadcrumb
          path={[
            Paths.Frontend.HOME,
            {
              title: props.data.element.title,
              href: Paths.Frontend.HOME.href + "/" + props.data.element.slug,
            },
          ]}
        />
        <div className="w-full flex-col justify-center md:gap-10 gap-default-vertical-gap inline-flex">
          <Hero {...props} />
          <div className="flex flex-col w-full gap-5 mb-5">
            <div className="flex flex-row justify-center items-start gap-4 w-full">
              <div className="lg:mr-6 w-full">
                <ProductBody
                  toolFilter={props.toolFilter}
                  config={props.config}
                  element={props.data.element}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout.Base>
    </>
  );
};

export { Page };
export type { PageProps };
