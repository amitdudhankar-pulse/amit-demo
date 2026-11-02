import { propagateServerField } from "next/dist/server/lib/render-server";
import {
  Banner,
  CategorySection,
  ClickToOpenDialog,
  MediaDecorator,
  ToolCard,
  useDialogControls,
  Text,
  Button,
  delayedPromise,
  Section,
} from "./components";
// import { Section } from "./components";

import { Category, Configuration, FunctionV2 } from "@/lib/lib";
import { CategoryCardData, ToolCardData } from "@/lib/card_data";
import { ItemListingAnimation } from "./animations";
import { createRef, useRef } from "react";
import { Paths, getAssetPathFromID } from "@/contants";
import { twMerge } from "tailwind-merge";
import { StatefulBuilder } from "../logic/logic";
import Image from "next/image";

const ToolCategoriesSection = ({
  type = "v1",
  ...props
}: {
  toolCategoryList: CategoryCardData[];
  allToolCount: number;
  className?: string;
  type?: "v1" | "v2";
}) => (
  <CategorySection
    title={"Explore Top AI Tool Categories"}
    subtitle={
      <>
        {"Find "}
        <MediaDecorator.Underline>
          {props.allToolCount} AI tools
        </MediaDecorator.Underline>{" "}
        sorted into {props.toolCategoryList.length} categories with reviews,
        comparisons & active deals
      </>
    }
    categories={props.toolCategoryList}
    className={props.className}
    type={type}
  />
);

const AiCourseCategoriesSection = ({
  type = "v1",
  ...props
}: {
  courseCategoryList: CategoryCardData[];
  allCourseCount: number;
  className?: string;
  type?: "v1" | "v2";
}) => (
  <CategorySection
    title={"Curated AI Course Categories"}
    subtitle={
      <>
        {"Find "}
        <MediaDecorator.Underline>
          {props.allCourseCount} AI courses
        </MediaDecorator.Underline>{" "}
        listed into {props.courseCategoryList.length} categories to help you
        excel in your education & career
      </>
    }
    categories={props.courseCategoryList}
    className={props.className}
    type={type}
    countSuffix="Courses"
  />
);

// const FunctionCategoriesSection = ({
//   functionList,
//   className,
// }: {
//   functionList: FunctionV2[];
//   className?: string;
// }) => {
//   return (
//     <Section
//       id="Functions"
//       title="AI Functions"
//       subtitle={
//         <>
//           {"Explore "}
//           <MediaDecorator.Underline>
//             {functionList.length} AI functions
//           </MediaDecorator.Underline>{" "}
//           that group tools by real-world use cases
//         </>
//       }
//       className={twMerge("w-full items-center", className)}
//     >
//       <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
//         {functionList.map((fn) => (
//           <a
//             key={fn.slug}
//             href={`${Paths.Frontend.HOME.href}/${fn.slug}`}
//             className="p-6 rounded-xl border border-boundary hover:shadow-md transition bg-white anim-card"
//           >
//             <Image
//               className="w-full h-40 mb-4 object-cover rounded-md"
//               src={getAssetPathFromID(fn.image?.id) || ""}
//               alt={fn.title}
//             />

//             <h3 className="text-lg font-semibold">{fn.title}</h3>

//             {fn.short_description && (
//               <p className="text-sm text-gray-600 mt-2 line-clamp-3">
//                 {fn.short_description}
//               </p>
//             )}

//             <div className="mt-3 text-xs text-gray-500">
//               {fn.products_count ?? 0} tools
//             </div>
//           </a>
//         ))}
//       </div>
//     </Section>
//   );
// };

const FunctionCategoriesSection = ({
  functionList,
  className,
  limit,
  showCTA = false,
}: {
  functionList: FunctionV2[];
  className?: string;
  limit?: number; // 👈 optional
  showCTA?: boolean; // 👈 optional
}) => {
  const visibleList = limit ? functionList.slice(0, limit) : functionList;

  return (
    <Section
      id="ai-functions"
      title="AI Functions"
      subtitle={
        <>
          {"Explore "}
          <MediaDecorator.Underline>
            {functionList.length} AI functions
          </MediaDecorator.Underline>{" "}
          that group tools by real-world use cases
        </>
      }
      className={twMerge("w-full items-center", className)}
    >
      {/* GRID */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {visibleList.map((fn) => (
          <a
            key={fn.slug}
            href={`${Paths.Frontend.HOME.href}/${fn.slug}`}
            className="p-6 rounded-xl border border-boundary hover:shadow-md transition bg-white anim-card"
          >
            <Image
              src={getAssetPathFromID(fn.image?.id) || ""}
              alt={fn.title}
              width={400}
              height={160}
              className="w-full h-40 mb-4 object-cover rounded-md"
            />

            <h3 className="text-lg font-semibold">{fn.title}</h3>

            {fn.short_description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {fn.short_description}
              </p>
            )}

            <div className="mt-3 text-xs text-gray-500">
              {fn.products_count ?? 0} tools
            </div>
          </a>
        ))}
      </div>

      {/* CTA — ONLY WHEN EXPLICITLY ENABLED */}
      {/* {showCTA && limit && functionList.length > limit && (
        <div className="mt-6">
          <Button.PrimaryBoundary
            text="View All AI Functions"
            action={{
              type: "url",
              url: "/ai-functions",
            }}
          />
        </div>
      )} */}
    </Section>
  );
};

const ToolGrid = (props: {
  toolList: ToolCardData[];
  disableCardAnimation?: boolean;
  className?: string;
  activateLoadMore?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <StatefulBuilder initialValue={{ list: props.toolList.slice(0, 12) }}>
      {({ state, setState }) => (
        <div className="flex flex-col items-center w-full gap-7">
          <div
            ref={props.disableCardAnimation ? undefined : ref}
            className={twMerge(
              "p-4 gap-5 bg-neutral-400/opacity-20 justify-items-center",
              "grid",
              props.toolList.length === 0
                ? "grid-cols-1"
                : "2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2",
              props.className
            )}
          >
            {props.toolList.length === 0 && (
              <Text.Indicative className="text-center w-full py-5">
                No Data Found
              </Text.Indicative>
            )}
            {state.list.map((f, i) => (
              <ToolCard
                className={twMerge(
                  "anim-card",
                  i > 12 && !props.activateLoadMore
                    ? "sm:inline-flex hidden"
                    : ""
                )}
                key={f.id}
                {...f}
              />
            ))}
          </div>
          {!!props.activateLoadMore && (
            <Button.PrimaryBoundary
              className={twMerge(
                state.list.length === props.toolList.length ? "hidden" : ""
              )}
              text="Load More"
              action={{
                type: "callback",
                onClick: async () => {
                  await delayedPromise(0.3 * 1000);
                  setState({
                    list: props.toolList.slice(0, state.list.length + 12),
                  });
                },
              }}
            />
          )}
        </div>
      )}
    </StatefulBuilder>
  );
};

const NewsletterBanner = (props: {
  config: Configuration;
  className?: string;
}) => {
  const { openDialog } = useDialogControls<void>({
    id: Paths.DIALOG_ID.NEWSLETTER_FORM,
  });
  return (
    <Banner
      className={twMerge("cursor-pointer", props.className)}
      onClick={openDialog}
      src={
        getAssetPathFromID(props.config.subscribe_box?.id ?? "", {
          quality: 50,
        }) ?? ""
      }
      alt="subscribe_box"
    />
  );
};

const SingupBanner = (props: { config: Configuration; className?: string }) => {
  const { openDialog } = useDialogControls<void>({
    id: Paths.DIALOG_ID.LOGIN,
  });
  return (
    <Banner
      className={twMerge("cursor-pointer", props.className)}
      onClick={openDialog}
      src={
        getAssetPathFromID(props.config.signup_box?.id ?? "", {
          quality: 50,
        }) ?? ""
      }
      alt="signup_box"
    />
  );
};

export {
  ToolCategoriesSection,
  AiCourseCategoriesSection,
  FunctionCategoriesSection,
  ToolGrid,
  NewsletterBanner,
  SingupBanner,
};
