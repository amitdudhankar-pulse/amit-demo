import { Layout } from "@/ui/layouts/layouts";
import { getAssetPathFromID, Paths } from "@/contants";
import { Blog, Configuration, Product } from "@/lib/lib";
import { parseAMW } from "@/ui/components/utils/utils";
import {
  BlogListing,
  Breadcrumb,
  Section,
  Text,
  ToolListing,
  NextSeo,
  Button,
  FAQs,
} from "@/ui/components/components";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

export type BlogProps = {
  config: Configuration;
  blog: Blog;
  latestBlogList: Blog[];
  featuredProductList: Product[];
  pathList: { title: string; href: string }[];
  disableMoreBlogsSection?: boolean;
};

export const BlogPage = ({
  config,
  blog,
  latestBlogList,
  featuredProductList,
  ...props
}: BlogProps) => {
  const breakpoingToChangeSideView = "lg";
  return (
    <>
      <NextSeo
        title={blog.b_meta_title || blog.title}
        description={blog.b_meta_desc || blog.description}
        // additionalMetaTags={[{ name: "keywords", content: blog.tags }]}
        additionalMetaTags={[
          { name: "keywords", content: blog.tags.join(", ") },
        ]}
        openGraph={{
          title: blog.title,
          images: [
            { url: getAssetPathFromID(blog.image?.id, { quality: 25 }) ?? "" },
          ],
          url: `${Paths.Frontend.BLOG.href}/${blog.slug}`,
          type: "Blog",
          siteName: config.website_title,
        }}
      />
      <Layout.Base
        config={config}
        className="max-w-content-width mx-auto my-9 md:my-16"
      >
        <section className="flex flex-col justify-center w-full">
          <Breadcrumb className="mb-6" path={props.pathList} />
          <Text.H1 className="font-bold">{blog.title}</Text.H1>

          {!!blog.sub_title ? (
            <div className="mt-14 flex items-start justify-between gap-4">
              <Text.H2 className="font-medium">{blog.sub_title}</Text.H2>

              <Button.Share
                url={`${Paths.Frontend.BLOG.href}/${blog.slug}`}
                type="blog"
              />
            </div>
          ) : (
            <div className="mt-4">
              <Button.Share
                url={`${Paths.Frontend.BLOG.href}/${blog.slug}`}
                type="blog"
              />
            </div>
          )}

          {blog.read_minutes && (
            <span className="text-left font-roboto text-gray-500 text-sm font-normal mt-5">
              {blog.read_minutes} min read
            </span>
          )}

          {!!blog.image && (
            <Image
              src={getAssetPathFromID(blog.image.id) || "#"}
              alt={blog.image.title ?? ""}
              width={1600}
              height={900} // 16:9 aspect ratio
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 80vw"
              className="aspect-[16/9] mt-14 w-full object-cover"
            />
          )}
        </section>
        <section className="flex justify-start content-start w-full gap-default-horizontal-gap">
          <div className="flex flex-col gap-default-vertical-gap w-full font-roboto">
            <Section title={""} id={"blog-content"}>
              {blog.content && parseAMW(blog.content)}
            </Section>
            {/* --- FAQ SECTION --- */}
            {!!blog.faq && blog.faq.length > 0 && (
              <div className="-mt-12">
                {" "}
                {/* 👈 reduce vertical gap */}
                <Section id="FAQs" title="Frequently Asked Questions">
                  <FAQs itemList={blog.faq} />
                </Section>
              </div>
            )}

            <div
              className={twMerge(
                "flex flex-col",
                breakpoingToChangeSideView + ":hidden",
                "gap-default-vertical-gap"
              )}
            >
              <Section
                id="featured-tools"
                title="Featured Tools"
                className="h-fit"
              >
                <ToolListing.Horizontal productList={featuredProductList} />
              </Section>
              {!props.disableMoreBlogsSection && (
                <Section id="blogs" title="Blogs">
                  <BlogListing.Horizontal blogList={latestBlogList} />
                </Section>
              )}
            </div>
          </div>
          <div
            className={`min-w-80 hidden ${breakpoingToChangeSideView}:block`}
          >
            {/* TODO: This div below should not be required. Ideally the same css should go in the above div. But for somereason `lg:flex` is not getting triggered */}
            <div className="flex flex-col gap-default-vertical-gap">
              <ToolListing.Vertical productList={featuredProductList} />
              {!props.disableMoreBlogsSection && (
                <BlogListing.Vertical blogList={latestBlogList.slice(0, 12)} />
              )}
            </div>
          </div>
        </section>
      </Layout.Base>
    </>
  );
};
