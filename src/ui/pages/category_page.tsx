import {
  ToolCategoriesSection,
  AiCourseCategoriesSection,
  FunctionCategoriesSection,
  parseAMW,
  Section,
} from "@/ui/components/components";
import { getAssetPathFromID } from "@/contants";
import { Layout } from "@/ui/layouts/layouts";
import {
  Configuration,
  CMS,
  Category,
  Product,
  GeneralPageInfo,
  CategoryV2,
} from "@/lib/lib";

interface PageProps {
  config: Configuration;
  allItemCount: number;
  categoryList: CategoryV2[];
  pageInfo: GeneralPageInfo & { description?: string };
  type: "tool-category" | "ai-category" | "function-category";
}

const Page = (props: PageProps) => {
  const pageInfo = props.pageInfo ?? ({} as PageProps["pageInfo"]);
  return (
    <Layout.General
      config={props.config}
      meta={{
        title: pageInfo.meta_title ?? "",
        description: pageInfo.meta_description ?? "",
      }}
      className="items-center mb-5 w-full max-w-content-width"
      title={pageInfo.hero_title ?? ""}
      bgURL={getAssetPathFromID(pageInfo.hero_banner?.id)}
    >
      <div className="flex flex-col my-7 gap-default-vertical-gap w-full text-start">
        {props.type === "tool-category" && (
          <ToolCategoriesSection
            toolCategoryList={props.categoryList}
            allToolCount={props.allItemCount}
            type="v2"
          />
        )}

        {props.type === "ai-category" && (
          <AiCourseCategoriesSection
            courseCategoryList={props.categoryList}
            allCourseCount={props.allItemCount}
            type="v2"
          />
        )}

        {props.type === "function-category" && (
          <FunctionCategoriesSection functionList={props.categoryList as any} />
        )}

        {pageInfo.description && (
          <Section title={""} id={"info"}>
            {parseAMW(pageInfo.description)}
          </Section>
        )}
      </div>
    </Layout.General>
  );
};

export { Page };
export type { PageProps };
