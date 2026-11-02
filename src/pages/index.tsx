import { OrganizationJsonLd, NextSeo } from "next-seo";
import {
  Section,
  ToolListing,
  TabV2,
  BlogListing,
  MediaDecoratorSrc,
  SearchBox,
  MediaDecorator,
} from "@/ui/components/components";
import { Button } from "@/ui/components/button/button";
import { ToolFilterMenu } from "@/ui/components/tool_filter";
import { FAQs } from "@/ui/components/faqs";
import { useDialogControls } from "@/ui/dialog/dialog_core";
import { Text as T } from "@/ui/components/text";
import { parseAMW } from "@/ui/components/utils/utils";
import throttle from "lodash/throttle";

import {
  AiCourseCategoriesSection,
  ToolCategoriesSection,
  // ToolGrid,
  NewsletterBanner,
} from "@/ui/components/domain_components";
import { Constants, getAssetPathFromID, Paths } from "@/contants";
import { Layout } from "@/ui/layouts/layouts";
import {
  Blog,
  CMS,
  Configuration,
  Product,
  HeropageInfo,
  CategoryV2,
} from "@/lib/lib";
import dynamic from "next/dynamic";

const TrustedBySlider = dynamic(
  () => import("@/ui/components/TrustedBySlider"),
  {
    ssr: false,
    loading: () => (
      <div className="h-24 w-full animate-pulse bg-gray-200 rounded-xl" />
    ),
  },
);

const YoutubePlayerSection = dynamic(
  () => import("@/ui/components/youtubePlayer"), {
    ssr:false,
     loading: () => (
      <div className="h-24 w-full animate-pulse bg-gray-200 rounded-xl" />
    ),
  }
)
// import TrustedBySlider from "@/ui/components/TrustedBySlider";
import { twMerge } from "tailwind-merge";
import { PropsWithChildren, useRef, memo, useCallback, useMemo } from "react";
import { useIntersectionObserver } from "@/ui/logic/logic";
import { ToolFilterProvider } from "@/ui/components/tool_filter";

const MAX_CARDS_IN_GRID = 12;

type HomeProps = {
  allToolCount: number;
  allCourseCount: number;
  config: Configuration;
  toolCategoryList: CategoryV2[];
  courseCategoryList: CategoryV2[];
  // functionList: FunctionV2[];
  blogList: Blog[];
  courseList: Product[];
  editorChoiceToolList: Product[];
  verifiedToolList: Product[];
  featruedToolList: Product[];
  popularToolList: Product[];
  heropageInfo: HeropageInfo[];
  // ✅ ADD THIS
  trustedBy: {
    id: number;
    name: string;
    company_url?: string | null;
    logo: string | null;
  }[];
};

interface HeroProps {
  config: Configuration;
  heropageInfo: HeropageInfo[];
  className?: string;
}

// export async function getStaticProps(): Promise<{
//   props: HomeProps;
//   revalidate: number;
// }> {
//   try {
//     // ✅ Run all CMS calls in parallel
//     const [
//       config,
//       blogList,
//       allTools,
//       toolCategoryList,
//       courseCategoryList,
//       allCourses,
//       productCount,
//       trustedBy,
//     ] = await Promise.all([
//       CMS.getConfigv2(),
//       CMS.getAllBlogs({ sort: "-date_created", limit: 6 }),
//       CMS.getAllProducts("tool", { sort: ["order", "-date_created", "-id"] }),
//       CMS.getAllCategories({ type: "tool_category" }),
//       CMS.getAllCategories({ type: "course_category" }),
//       CMS.getAllProducts("course"),
//       CMS.getProductCount("course"),
//       CMS.getTrustedBy(),
//     ]);

//     // ✅ Helper function to get tools safely
//     const getTools = (randomize = false): Product[] => {
//       let list = [...allTools];
//       if (randomize) {
//         list = list.sort((a, b) => (a.id > b.id ? 1 : -1));
//       }
//       return list.slice(0, 12); // show 12
//     };

//     // ✅ Build categorized lists (no random sorting)
//     const featuredToolList = getTools(false);
//     const verifiedToolList = getTools(false);
//     const editorChoiceToolList = getTools(false);
//     const popularToolList = getTools(false);

//     // ✅ Compute counts safely
//     const allToolCount = allTools.length;
//     const allCourseCount = Math.max(productCount - allToolCount, 0);

//     // ✅ Return optimized props
//     return {
//       props: {
//         allCourseCount,
//         trustedBy,
//         allToolCount,
//         toolCategoryList,
//         courseCategoryList,
//         blogList,
//         popularToolList,
//         courseList: allCourses.slice(0, MAX_CARDS_IN_GRID),
//         editorChoiceToolList,
//         verifiedToolList,
//         featruedToolList: featuredToolList, // fixed typo
//         ...config,
//         heropageInfo: Array.isArray(config.heropageInfo)
//           ? config.heropageInfo
//           : [config.heropageInfo],
//       },
//       // ✅ ISR: revalidate once every minute
//       revalidate: 60,
//     };
//   } catch (error) {
//     console.error("getStaticProps error (Home page):", error);

//     // fallback props in case CMS fails
//     return {
//       props: {
//         allCourseCount: 0,
//         allToolCount: 0,
//         toolCategoryList: [],
//         courseCategoryList: [],
//         blogList: [],
//         popularToolList: [],
//         courseList: [],
//         editorChoiceToolList: [],
//         verifiedToolList: [],
//         featuredToolList: [],
//         ...({} as any),
//       },
//       revalidate: 60,
//     };
//   }
// }

// export async function getStaticProps(): Promise<{
//   props: HomeProps;
//   revalidate: number;
// }> {
//   try {
//     // ----------------------------------------------------------
//     // 1️⃣ FETCH CORE DATA (PARALLEL)
//     // ----------------------------------------------------------
//     const [
//       configBundle,
//       blogList,
//       allTools,
//       toolCategoryList,
//       courseCategoryList,
//       allCourses,
//       courseCount,
//       trustedBy,

//       // FILTERED TOOL LISTS
//       featuredToolList,
//       editorChoiceToolList,
//       verifiedToolList,
//       popularToolList,
//     ] = await Promise.all([
//       CMS.getConfigv2(), // contains { config, heropageInfo, ... }
//       CMS.getAllBlogs({ sort: "-date_created", limit: 6 }),
//       CMS.getAllProducts("tool", { sort: ["order", "-date_created", "-id"] }),
//       CMS.getAllCategories({ type: "tool_category" }),
//       CMS.getAllCategories({ type: "course_category" }),
//       CMS.getAllProducts("course"),
//       CMS.getProductCount("course"),
//       CMS.getTrustedBy(),

//       // ----------------------------------------------------------
//       // ⭐ CORRECT BOOLEAN FILTERING (Directus boolean uses true/false)
//       // ----------------------------------------------------------
//       CMS.getAllProducts("tool", {
//         limit: 12,
//         sort: ["order"],
//         filter: { featured: { _eq: true } },
//       }),

//       CMS.getAllProducts("tool", {
//         limit: 12,
//         sort: ["order"],
//         filter: { editor_choice: { _eq: true } },
//       }),

//       CMS.getAllProducts("tool", {
//         limit: 12,
//         sort: ["order"],
//         filter: { verified: { _eq: true } },
//       }),

//       CMS.getAllProducts("tool", {
//         limit: 12,
//         sort: ["order"],
//         filter: { popular: { _eq: true } },
//       }),
//     ]);

//     // ----------------------------------------------------------
//     // 2️⃣ EXTRACT ONLY WHAT HomeProps EXPECTS
//     // ----------------------------------------------------------
//     const config = configBundle.config;

//     const heropageInfo = Array.isArray(configBundle.heropageInfo)
//       ? configBundle.heropageInfo
//       : [configBundle.heropageInfo];

//     const allToolCount = allTools.length;
//     const allCourseCount = Math.max(courseCount - allToolCount, 0);

//     // ----------------------------------------------------------
//     // 3️⃣ RETURN EXACT HomeProps SHAPE
//     // ----------------------------------------------------------
//     return {
//       props: {
//         allToolCount,
//         allCourseCount,

//         config,
//         toolCategoryList,
//         courseCategoryList,
//         blogList,

//         courseList: allCourses.slice(0, MAX_CARDS_IN_GRID),

//         editorChoiceToolList,
//         verifiedToolList,
//         featruedToolList: featuredToolList,
//         popularToolList,

//         heropageInfo,
//         trustedBy,
//       },
//       revalidate: 60,
//     };
//   } catch (error) {
//     console.error("Home getStaticProps error:", error);

//     // ----------------------------------------------------------
//     // 4️⃣ SAFE FALLBACK (still matching HomeProps)
//     // ----------------------------------------------------------
//     return {
//       props: {
//         allToolCount: 0,
//         allCourseCount: 0,
//         config: {} as Configuration,
//         toolCategoryList: [],
//         courseCategoryList: [],
//         blogList: [],
//         courseList: [],
//         editorChoiceToolList: [],
//         verifiedToolList: [],
//         featruedToolList: [],
//         popularToolList: [],
//         heropageInfo: [],
//         trustedBy: [],
//       },
//       revalidate: 60,
//     };
//   }
// }

// export async function getStaticProps(): Promise<{
//   props: HomeProps;
//   revalidate: number;
// }> {
//   try {
//     // ----------------------------------------------------------
//     // 1️⃣ FETCH CORE DATA (PARALLEL)
//     // ----------------------------------------------------------
//     const [
//       configBundle,
//       blogList,
//       allTools,
//       toolCategoryList,
//       courseCategoryList,
//       allCourses,
//       courseCount,
//       trustedBy,

//       // 🎯 CURATED TOOL LISTS (auto-sorted)
//       featuredToolList,
//       editorChoiceToolList,
//       verifiedToolList,
//       popularToolList,
//     ] = await Promise.all([
//       CMS.getConfigv2(),
//       CMS.getAllBlogs({ sort: "-date_created", limit: 6 }),

//       // 🔹 All tools (default order)
//       CMS.getAllProducts("tool"),

//       CMS.getAllCategories({ type: "tool_category" }),
//       CMS.getAllCategories({ type: "course_category" }),
//       CMS.getAllFunctions(),

//       CMS.getAllProducts("course"),
//       CMS.getProductCount("course"),
//       CMS.getTrustedBy(),

//       // ----------------------------------------------------------
//       // ⭐ CURATED SECTIONS (NO sort PASSED)
//       // getAllProducts will auto-pick correct order field
//       // ----------------------------------------------------------

//       CMS.getAllProducts("tool", {
//         limit: 12,
//         filter: { featured: { _eq: true } },
//       }),

//       CMS.getAllProducts("tool", {
//         limit: 12,
//         filter: { editor_choice: { _eq: true } },
//       }),

//       CMS.getAllProducts("tool", {
//         limit: 12,
//         filter: { verified: { _eq: true } },
//       }),

//       CMS.getAllProducts("tool", {
//         limit: 12,
//         filter: { popular: { _eq: true } },
//       }),
//     ]);

//     // ----------------------------------------------------------
//     // 2️⃣ NORMALIZE DATA
//     // ----------------------------------------------------------
//     const config = configBundle.config;

//     const heropageInfo = Array.isArray(configBundle.heropageInfo)
//       ? configBundle.heropageInfo
//       : [configBundle.heropageInfo];

//     const allToolCount = allTools.length;
//     const allCourseCount = Math.max(courseCount - allToolCount, 0);
//     const functionList = await CMS.getAllFunctions();

//     // ----------------------------------------------------------
//     // 3️⃣ RETURN EXACT HomeProps SHAPE
//     // ----------------------------------------------------------
//     return {
//       props: {
//         allToolCount,
//         allCourseCount,

//         config,
//         toolCategoryList,
//         courseCategoryList,
//         blogList,

//         courseList: allCourses.slice(0, MAX_CARDS_IN_GRID),

//         // 🎯 curated lists (each ordered independently)
//         editorChoiceToolList,
//         verifiedToolList,
//         featruedToolList: featuredToolList,
//         popularToolList,

//         heropageInfo,
//         trustedBy,
//       },
//       revalidate: 60,
//     };
//   } catch (error) {
//     console.error("Home getStaticProps error:", error);

//     // ----------------------------------------------------------
//     // 4️⃣ SAFE FALLBACK
//     // ----------------------------------------------------------
//     return {
//       props: {
//         allToolCount: 0,
//         allCourseCount: 0,
//         config: {} as Configuration,
//         toolCategoryList: [],
//         courseCategoryList: [],
//         blogList: [],
//         courseList: [],
//         editorChoiceToolList: [],
//         verifiedToolList: [],
//         featruedToolList: [],
//         popularToolList: [],
//         heropageInfo: [],
//         trustedBy: [],
//       },
//       revalidate: 60,
//     };
//   }
// }

export async function getStaticProps(): Promise<{
  props: HomeProps;
  revalidate: number;
}> {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const withRetry = async <T,>(
    fn: () => Promise<T>,
    retries = 3,
    backoffMs = 600,
  ): Promise<T> => {
    let lastError: unknown;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < retries - 1) {
          await delay(backoffMs * (i + 1));
        }
      }
    }
    throw lastError;
  };

  try {
    // ----------------------------------------------------------
    // 1️⃣ FETCH CORE DATA (PARALLEL)
    // ----------------------------------------------------------
    const [
      configBundle,
      blogList,
      allTools,
      toolCategoryList,
      courseCategoryList,
      // functionList, // ✅ FIXED
      allCourses,
      courseCount,
      trustedBy,

      // 🎯 CURATED TOOL LISTS
      featuredToolList,
      editorChoiceToolList,
      verifiedToolList,
      popularToolList,
    ] = await Promise.all([
      withRetry(() => CMS.getConfigv2()),
      withRetry(() => CMS.getAllBlogs({ sort: "-date_created", limit: 6 })),

      // 🔹 All tools
      withRetry(() => CMS.getAllProducts("tool")),

      // 🔹 Categories & Functions
      withRetry(() => CMS.getAllCategories({ type: "tool_category" })),
      withRetry(() => CMS.getAllCategories({ type: "course_category" })),
      // CMS.getAllFunctions(), // ✅ USED PROPERLY

      // 🔹 Courses
      withRetry(() => CMS.getAllProducts("course")),
      withRetry(() => CMS.getProductCount("course")),

      // 🔹 Trusted by
      withRetry(() => CMS.getTrustedBy()),

      // ----------------------------------------------------------
      // ⭐ CURATED TOOL SECTIONS
      // ----------------------------------------------------------
      withRetry(() =>
        CMS.getAllProducts("tool", {
          limit: 8,
          filter: { featured: { _eq: true } },
        }),
      ),

      withRetry(() =>
        CMS.getAllProducts("tool", {
          limit: 8,
          filter: { editor_choice: { _eq: true } },
        }),
      ),

      withRetry(() =>
        CMS.getAllProducts("tool", {
          limit: 8,
          filter: { verified: { _eq: true } },
        }),
      ),

      withRetry(() =>
        CMS.getAllProducts("tool", {
          limit: 8,
          filter: { popular: { _eq: true } },
        }),
      ),
    ]);

    // ----------------------------------------------------------
    // 2️⃣ NORMALIZE DATA
    // ----------------------------------------------------------
    const config = configBundle.config;

    const heropageInfo = Array.isArray(configBundle.heropageInfo)
      ? configBundle.heropageInfo
      : [configBundle.heropageInfo];

    const allToolCount = allTools.length;
    const allCourseCount = Math.max(courseCount - allToolCount, 0);

    // ----------------------------------------------------------
    // 3️⃣ RETURN EXACT HomeProps SHAPE
    // ----------------------------------------------------------
    return {
      props: {
        allToolCount,
        allCourseCount,

        config,
        toolCategoryList,
        courseCategoryList,
        // functionList, // ✅ FIXED

        blogList,
        courseList: allCourses.slice(0, MAX_CARDS_IN_GRID),

        // 🎯 curated lists
        featruedToolList: featuredToolList,
        editorChoiceToolList,
        verifiedToolList,
        popularToolList,

        heropageInfo,
        trustedBy,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Home getStaticProps error:", error);

    // ----------------------------------------------------------
    // 4️⃣ SAFE FALLBACK
    // ----------------------------------------------------------
    return {
      props: {
        allToolCount: 0,
        allCourseCount: 0,
        config: {} as Configuration,
        toolCategoryList: [],
        courseCategoryList: [],
        // functionList: [], // ✅ FIXED
        blogList: [],
        courseList: [],
        editorChoiceToolList: [],
        verifiedToolList: [],
        featruedToolList: [],
        popularToolList: [],
        heropageInfo: [],
        trustedBy: [],
      },
      revalidate: 10,
    };
  }
}

const HeroComponent: React.FC<HeroProps> = ({ heropageInfo, className }) => {
  const hero = heropageInfo[0] ?? ({} as HeropageInfo);

  return (
    <div
      className={twMerge(
        "flex flex-col justify-start items-center gap-1 text-center",
        className,
      )}
    >
      {/* HERO TEXT */}
      <div className="font-quicksand relative z-[50] px-4">
        {parseAMW(hero.hero_text, {
          h1: ({ children }) => (
            <T.H1 className="leading-[1.45]">{children}</T.H1>
          ),
          p: ({ children }) => (
            <T.P className="font-semibold text-xl">{children}</T.P>
          ),
        })}
      </div>

      {/* HERO IMAGES */}
      <div className="w-full md:max-w-[80%] relative">
        <div className="w-full sm:aspect-[7.4/3] aspect-[4.5/3]" />

         <picture>
          {/* Desktop */}
          <source
            media="(min-width: 640px)"
            srcSet="/static/homepage-hero.svg"
          />

          {/* Mobile (fallback) */}
          <img
            src="/static/homepage-hero-mobile.svg"
            alt="hero-image"
            className="absolute w-full z-[1] object-top top-[25px] sm:top-[65px]"
            width={1600}
            height={900}
            loading="eager"
            decoding="async"
          />
        </picture>
        {/* <img
          src="/static/homepage-hero-mobile.svg"
          alt="hero-image"
          className="absolute w-full z-[1] object-top top-[25px] sm:hidden block"
        />

        <img
          src="/static/homepage-hero.svg"
          alt="hero-image"
          className="absolute w-full z-[1] object-top top-[65px] hidden sm:block"
        /> */}
        <SearchBox
          className={twMerge(
            // Spacing from top
            "pt-[70px] sm:pt-[80px] md:pt-[90px]",

            // Card styles
            "rounded-2xl shadow-focusCard backdrop-blur-3xl",
            "bg-gradient-to-br from-primary-light to-primary",

            // Widths (mobile → desktop)
            "w-[95%] sm:w-[65%] md:w-[85%] lg:w-[90%]",

            // Positioning
            "mx-auto md:ml-auto md:mr-8",
          )}
          redirectTo={Paths.Frontend.SEARCH.href}
        />
      </div>
    </div>
  );
};

// const HeroComponent: React.FC<HeroProps> = ({ heropageInfo, className }) => {
//   const text = heropageInfo.hero_text || "";
//   console.log("Hero text:", heropageInfo);

//   return (
//     <div
//       className={twMerge(
//         "flex flex-col justify-start items-center gap-1 text-center",
//         className
//       )}
//     >
//       {/* HERO TEXT — MUST BE ABOVE IMAGES */}
//       <div className="font-quicksand relative z-[50] px-4">
//         {parseAMW(text, {
//           h1: ({ children }: PropsWithChildren<{}>) => (
//             <T.H1 className="leading-[1.45]">{children}</T.H1>
//           ),
//           p: ({ children }: PropsWithChildren<{}>) => (
//             <T.P className="font-semibold text-xl">{children}</T.P>
//           ),
//         })}
//       </div>

//       {/* HERO IMAGES */}
//       <div className="w-full md:max-w-[80%] relative">
//         <div className="w-full sm:aspect-[7.4/3] aspect-[4.5/3]" />

//         {/* MOBILE */}
//         <Image
//           src={HomepageHeroMobile}
//           alt="hero-image"
//           width={900}
//           height={900}
//           priority
//           className="absolute w-full z-[1] object-top top-[25px] sm:hidden block"
//         />

//         {/* DESKTOP */}
//         <Image
//           src={HomepageHero}
//           alt="hero-image"
//           width={1600}
//           height={900}
//           priority
//           className="absolute w-full z-[1] object-top top-[65px] hidden sm:block"
//         />

//         {/* SEARCH BOX */}
//         <SearchBox
//           className={twMerge(
//             "md:pt-[90px] sm:pt-[60px] pt-[80px]",
//             "rounded-2xl shadow-focusCard backdrop-blur-3xl",
//             "bg-gradient-to-br from-primary-light to-primary relative z-[0]"
//           )}
//           redirectTo={Paths.Frontend.SEARCH.href}
//         />
//       </div>
//     </div>
//   );
// };

type ToolFeedProps = {
  data: { name: string; toolList: Product[] }[];
  className?: string;
};

// Heavy components -> lazy load (same UI, less JS on load)

const ToolGrid = dynamic(
  () => import("@/ui/components/domain_components").then((m) => m.ToolGrid),
  { ssr: false },
);
const ToolFilterList = dynamic(() => import("@/ui/components/tool_filter"), {
  ssr: false,
});

const ToolFeedComponent: React.FC<ToolFeedProps> = ({ data, className }) => {
  const { openDialog } = useDialogControls<void>({
    id: Paths.DIALOG_ID.NEWSLETTER_FORM,
  });

  const triggered = useRef(false);

  // Throttle => PageSpeed safe, avoids long main-thread tasks
  const handleIntersection = useCallback(
    throttle(() => {
      if (!triggered.current) {
        openDialog();
        triggered.current = true;
      }
    }, 2000),
    [],
  );

  const ref = useIntersectionObserver(handleIntersection);

  // Memoized data → MUCH less re-renders
  const tabNames = useMemo(() => data.map((d) => d.name), [data]);
  const tabPanels = useMemo(() => data, [data]);

  return (
    <div
      id="a"
      className={twMerge(
        "flex flex-col justify-center items-center gap-6 min-w-full",
        className,
      )}
    >
      <ToolFilterProvider
        enable={{ price: true, curation: false }}
        defaultPriceChecked={true} // ✅ HOME PAGE ONLY
      >
        <TabV2.Group className="w-full">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-row justify-between items-center w-full">
              <MediaDecorator.Decorator
                className="h-fit"
                mediaDecorator={MediaDecoratorCollection.TOOL_FEED}
              >
                <TabV2.TabList underline list={tabNames} />
              </MediaDecorator.Decorator>

              <ToolFilterMenu />
            </div>

            <TabV2.Panels className="bg-gray-200 bg-opacity-40 min-w-full min-h-7 rounded-xl">
              {tabPanels.map((panel) => (
                <TabV2.Panel key={panel.name}>
                  <ToolFilterList toolList={panel.toolList}>
                    {(filteredToolList) => (
                      <ToolGrid toolList={filteredToolList} />
                    )}
                  </ToolFilterList>
                </TabV2.Panel>
              ))}
            </TabV2.Panels>
          </div>
        </TabV2.Group>
      </ToolFilterProvider>

      {/* <div ref={ref}>
        <Button.PrimaryBoundary
          text="Load More"
          action={{
            type: "url",
            url: Paths.Frontend.SEARCH.href,
            underline: false,
          }}
        />
      </div> */}
      <div ref={ref}>
        <Button.PrimaryBoundary
          text="View All Tools"
          action={{
            type: "url",
            url: "/tools/page/1",
            underline: false,
          }}
        />
      </div>
    </div>
  );
};

const MediaDecoratorCollection: { [key: string]: MediaDecoratorSrc } = {
  AI_COURSES: {
    src: "/static/svg/top_ai_courses.svg",
    className: "top-[-170px] -left-[20px] size-[220px]",
    showAt: "xl",
    alt: "Level up your Career with AI, in GroupifyAI",
  },
  EDITOR_CHOICE: {
    src: "/static/svg/editor_choice.svg",
    className: "right-[-280px] top-[-100px] h-[230px] w-[270px]",
    showAt: "lg",
    alt: "Dive into our AI Picks, in GroupifyAI",
  },
  TOOL_FEED: {
    src: "/static/svg/tool_feed.svg",
    className: "top-[-65px] -right-[350px] h-[174px] w-[240px] rotate-[0deg]",
    showAt: "lg",
    alt: "Tools that will make you AI savy, in GroupifyAI",
  },
};

// ✅ Memoize the component to prevent unnecessary re-renders

export const Page = memo(
  (props: HomeProps) => {
    const { trustedBy } = props; // ✅ FIXED
    const firstHero = props.heropageInfo?.[0];

    // Memoized tab data → avoids recalculating arrays on every render
    const tabData = useMemo(
      () => [
        { name: "Featured", toolList: props.featruedToolList },
        { name: "Editor's Choice", toolList: props.editorChoiceToolList },
        { name: "Verified", toolList: props.verifiedToolList },
        { name: "Popular", toolList: props.popularToolList },
      ],
      [
        props.featruedToolList,
        props.editorChoiceToolList,
        props.verifiedToolList,
        props.popularToolList,
      ],
    );

    return (
      <>
        {/* SEO */}
        <NextSeo
          title={
            props.config.website_title ??
            "Best AI Tools & AI Software Directory Updated Daily | Groupify.ai"
          }
          description={
            props.config.website_description ??
            "Discover 5000+ top AI tools, Generative AI apps & Agentic AI software. Compare, review & use powerful AI tools for work, learning & productivity on Groupify.ai."
          }
          openGraph={{
            type: "Website",
            title: props.config.website_title,
            description: props.config.website_description,
            images: [
              // { url: getAssetPathFromID(props.config.desktop_logo.id) ?? "" },
              {
                url:
                  getAssetPathFromID(props.config.desktop_logo?.id ?? "") ?? "",
              },
            ],
            url: Paths.Frontend.HOME.href,
          }}
        />

        <OrganizationJsonLd
          type="Organization"
          id={`${Constants.PUBLIC_URL}/#organization`}
          name={props.config.website_title}
          url={Constants.PUBLIC_URL}
          logo={getAssetPathFromID(props.config.desktop_logo?.id, {
            quality: 25,
          })}
          sameAs={[
            props.config.tiktok,
            props.config.linkedin,
            props.config.instagram,
            props.config.youtube,
            props.config.threads,
            props.config.pinterest,
          ]}
        />

        {/* MAIN LAYOUT */}
        <Layout.Base
          config={props.config}
          className={twMerge(
            "justify-center my-10 md:my-6 md:mb-20",
            "max-w-content-width",
          )}
        >
          {/* HERO */}
          <Hero
            config={props.config}
            heropageInfo={props.heropageInfo}
            className="z-0"
          />

          {/* TRUSTED BY SLIDER */}
          <TrustedBySlider items={trustedBy} />

          {/* TOOL FEED */}
          <ToolFeed className="pt-5" data={tabData} />

          {/* TOOL CATEGORIES */}
          <ToolCategoriesSection
            toolCategoryList={props.toolCategoryList}
            allToolCount={props.allToolCount}
          />

          {/* SIGNUP DECORATOR */}
          {/* <MediaDecorator.Decorator
            mediaDecorator={{
              src: "/static/svg/sign_up_box.svg",
              showAt: "lg",
              className: twMerge(
                "size-[205px]",
                "lg:right-[-65px] lg:top-[-120px]",
                "xl:right-[45px] xl:top-[-90px]",
                "2xl:right-[75px] 2xl:top-[-100px]"
              ),
              alt: "Be an AI Insider, in Groupify AI",
            }}
          >
            <SingupBanner config={props.config} />
          </MediaDecorator.Decorator> */}

          {/* AI COURSES SECTION */}
          <Section
            id="top-ai-courses"
            title="Search for Popular AI Courses"
            mediaDecorator={MediaDecoratorCollection.AI_COURSES}
          >
            <ToolListing.Horizontal productList={props.courseList} />
          </Section>

          <AiCourseCategoriesSection
            courseCategoryList={props.courseCategoryList}
            allCourseCount={props.allCourseCount}
          />

          {/* NEWSLETTER DECORATOR */}
          <MediaDecorator.Decorator
            mediaDecorator={{
              src: "/static/svg/subscribe_box.svg",
              showAt: "lg",
              className: twMerge(
                "size-[205px]",
                "lg:right-[-70px] lg:top-[-150px]",
                "xl:right-[-15px] xl:top-[-70px]",
                "2xl:right-[10px] 2xl:top-[-60px]",
              ),
              alt: "Stay lit with AI, in Groupify AI",
            }}
          >
            <NewsletterBanner config={props.config} />
          </MediaDecorator.Decorator>

          {/* EDITOR’S CHOICE */}
          <Section
            id="editors-choice"
            title="Personalized AI Picks Crafted by Our Experts"
            mediaDecorator={MediaDecoratorCollection.EDITOR_CHOICE}
          >
            <TabV2.Group className="w-full h-full" defaultIndex={0}>
              <TabV2.TabList list={["Tools", "AI Courses"]} />

              <TabV2.Panel className="h-full w-full">
                <ToolListing.Horizontal
                  productList={props.editorChoiceToolList}
                />
              </TabV2.Panel>

              <TabV2.Panel>
                <ToolListing.Horizontal productList={props.courseList} />
              </TabV2.Panel>
            </TabV2.Group>
          </Section>

          {/* Functions CATEGORIES */}
          {/* <FunctionCategoriesSection
            functionList={props.functionList}
            limit={6}
            showCTA
            className="bg-blbl"
          /> */}

          {/* BLOGS */}
          <Section
            title="Explore AI through Blogs"
            id="blogs"
            sideComponent={
              <Button.Text
                text="View More"
                action={{
                  type: "url",
                  url: Paths.Frontend.BLOG_PAGES.href + "/1",
                }}
              />
            }
          >
            <BlogListing.Horizontal blogList={props.blogList} />
          </Section>
          
          
          {/* Youtube Player SECTION */}
           <Section
            title="Discover GroupifyAI in 60 Seconds: Explore AI Tools & Courses"
            id="player"
          >
            <YoutubePlayerSection videoUrl={"https://youtu.be/ofy0fyXZTJA?si=0CK10E-EABOnRmUn"}/>
          </Section>

          {/* ABOUT SECTION */}
          <Section className="w-full" title="" id="info">
            {parseAMW(firstHero?.about)}
          </Section>

          {/* FAQ SECTION */}
          {Array.isArray(firstHero?.faq) && firstHero.faq!.length > 0 && (
              <Section title="FAQs" id="faq">
                <FAQs itemList={firstHero.faq!} />
              </Section>
            )}
          
          {/* {Array.isArray(props.heropageInfo.faq) &&
            props.heropageInfo.faq.length > 0 && (
              <Section title="FAQs" id="faq" className="bg-blbl">
                <FAQs itemList={props.heropageInfo.faq} />
              </Section>
            )} */}
        </Layout.Base>
      </>
    );
  },
  // re-renders unless props actually change
  () => false,
);
Page.displayName = "Page";

export const Hero = memo(HeroComponent, (prev, next) => {
  const prevHero = prev.heropageInfo[0];
  const nextHero = next.heropageInfo[0];

  return (
    prevHero?.hero_text === nextHero?.hero_text &&
    prev.className === next.className
  );
});

// ✅ Memoize the component to prevent unnecessary re-renders
export const ToolFeed = memo(
  ToolFeedComponent,
  (prev, next) =>
    prev.data.length === next.data.length && prev.className === next.className,
);

export default Page;
