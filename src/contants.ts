const Constants = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
  BASE_ASSET_URL: `${process.env.NEXT_PUBLIC_BASE_URL!}/assets`,
  PUBLIC_URL: process.env.NEXT_PUBLIC_PUBLIC_URL!,
  DEPLOYMENT: process.env.NEXT_PUBLIC_DEPLOYMENT! as "production" | "staging",
};

if (!Constants.BASE_URL) throw "Empty NEXT_APP_BASE_URL";
if (!Constants.PUBLIC_URL) throw "Empty NEXT_APP_PUBLIC_URL";
if (!Constants.DEPLOYMENT) throw "Empty NEXT_PUBLIC_DEPLOYMENT";

const Paths = {
  IMAGE: {
    FALLBACK: `/static/fallback.webp`,
  },
  DIALOG_ID: {
    NEWSLETTER_FORM: "subscribe-newsletter",
    EMBED_CODE: "embed-code",
    SHARE_PRODUCT: "share-product",
    UNDER_DEV: "under-dev",
    LOGIN: "login",
    REVIEW_FORM: "review-form",
  },
  Frontend: {
    FAVORITES: {
      title: "Favorites",
      href: `${Constants.PUBLIC_URL}/favorites`,
    },
    TOOLS_PAGES: {
      href: `${Constants.PUBLIC_URL}/tools/page`,
      name: "Tools",
    },
    BLOG: {
      title: "Blogs",
      path: "/blog",
      href: `${Constants.PUBLIC_URL}/blog`,
    },
    BLOG_PAGES: {
      title: "Blog Pages",
      href: `${Constants.PUBLIC_URL}/blog/page`,
    },
    NEWS: {
      title: "News",
      href: `${Constants.PUBLIC_URL}/news`,
    },
    NEWS_PAGES: {
      title: "News",
      href: `${Constants.PUBLIC_URL}/news/page`,
    },
    AI_TOOL: {
      title: "AI Tools",
      path: "/ai-tool",
      href: `${Constants.PUBLIC_URL}/ai-tool`,
    },
    AI_COURSES: {
      title: "AI Courses",
      path: "/ai-courses",
      href: `${Constants.PUBLIC_URL}/ai-courses`,
    },
    HOME: {
      title: "Home",
      path: "",
      href: `${Constants.PUBLIC_URL}`,
    },
    SEARCH: { title: "Search", href: "/search" },
    LOGIN_REDIRECT: {
      title: "Login Check",
      href: `${Constants.PUBLIC_URL}/login`,
    },
    NEW_TOOL_FORM: {
      title: "Submit/Update New Tool",
      href: `${Constants.PUBLIC_URL}/new-tool-form`,
    },
    SUBMIT_TOOL_FORM: {
      title: "Submit New Tool",
      href: `${Constants.PUBLIC_URL}/new-tool-form`,
    },
    SUBSCRIBE_PAGE_FORM: {
      title: "Subscribe",
      href: `${Constants.PUBLIC_URL}/subscribe`,
    },
  },
  Backend: {
    ASSETS: `${Constants.BASE_URL}/assets`,
    LOGIN: `${Constants.BASE_URL}/auth/login/google`,
  },
  ICONS: {
    SHARE: "/static/icons/share.svg",
    BOOKMARK: "/static/icons/bookmark.svg",
    VISIT: "/static/icons/visit.svg",
    DEAL: "/static/icons/deal.svg",
    FULL_STAR: "/static/icons/full_star.svg",
    HALF_STAR: "/static/icons/half_star.svg",
    IG: "/static/icons/ig_icon.svg",
    FB: "/static/icons/fb_icon.svg",
    X: "/static/icons/x_icon.svg",
    LINKEDIN: "/static/icons/in_icon.svg",
    TIKTOK: "/static/icons/tiktok_icon.svg",
    THREADS: "/static/icons/threads_icon.svg",
    PINTEREST: "/static/icons/pinterest_icon.svg",
    YOUTUBE: "/static/icons/yt_icon.svg",
    ARROW_RIGHT_CONTAINED: "/static/icons/arrow_right_contained_02.svg",
    ARROW_LEFT_CONTAINED: "/static/icons/arrow_left_contained_02.svg",
    ARROW_RIGHT: "/static/icons/arrow_right.svg",
    ARROW_LEFT: "/static/icons/arrow_left.svg",
    VERIFIED: "/static/icons/verified.png",
    SETUP_3D: "/static/icons/setup.png",
    CODE_3D: "/static/icons/code.png",
    COMPUTER_3D: "/static/icons/computer.png",
    CHART_3D: "/static/icons/chart.png",
    FLASH_3D: "/static/icons/flash.png",
    VIDEO_CAMERA_3D: "/static/icons/video_camera.png",
    TEXT_3D: "/static/icons/text.png",
    IMAGE_3D: "/static/icons/image.png",
    COLOR_PLATE_3D: "/static/icons/color_plate.png",
    APPS_3D: "/static/icons/apps_3d.png",
    FIRE_3D: "/static/icons/fire_3d.png",
    MICROPHONE_3D: "/static/icons/microphone_3d.png",
    ROCKET_3D: "/static/icons/rocket_3d.png",
    DASHBOARD_3D: "/static/icons/dashboard_3d.png",
    BOOKS_3D: "/static/icons/books_3d.png",

    FREE_AI_TOOLS: "/static/svg/free_ai_tools.svg",
    MISC_AI_TOOLS: "/static/svg/misc_ai_tools.svg",

    AI_CODE_GENERATOR: "/static/svg/ai_code_generators.svg",
    AI_TEXT_GENERATOR: "/static/svg/ai_text_generators.svg",
    AI_VIDEO_GENERATOR: "/static/svg/ai_video_generators.svg",
    AI_AUDIO_GENERATOR: "/static/svg/ai_audio_generators.svg",
    AI_PRODUCTIVITY_TOOLS: "/static/svg/ai_productivity_tools.svg",
    AI_ART_GENERATOR: "/static/svg/ai_art_generators.svg",
    AI_IMAGE_GENERATOR: "/static/svg/ai_image_generators.svg",

    GENERATIVE_AI: "/static/svg/generative_ai.svg",
    COMPUTER_SCIENCE: "/static/svg/computer_science.svg",
    DATA_SCIENCE: "/static/svg/data_science.svg",
    AI_FOR_BEGINNERS: "/static/svg/ai_for_beginners.svg",
    AI_MACHINE_LEARNING: "/static/svg/ai_machine_learning.svg",

    AIMED_LABS: "/static/svg/aimed_labs.svg",
  },
  STATIC: {
    TOP_AI_TOOLS: "/static/svg/top_ai_courses.svg",
    EDITOR_CHOICE: "/static/svg/editor_choice.svg",
    TOOL_SORTING: "/static/svg/tool_sorting.svg",
    SPARKLE: "/static/sparkle.gif",
  },
  OTHERS: {
    PRICING: "https://www.paypal.com/ncp/payment/JP6RJZB5ENCV2",
  },
};
// const LOGIN_URL = `${Paths.Backend.LOGIN}?redirect=${Paths.Frontend.LOGIN_REDIRECT.href}`;

// function getAssetPathFromID(
//   id?: string,
//   options?: { quality?: number }
// ): string | undefined {
//   if (!id) return undefined;
//   return [
//     Constants.BASE_ASSET_URL,
//     "/",
//     id,
//     !!options ? "?" : "",
//     ...(!!options?.quality ? ["quality=", options.quality.toString()] : []),
//   ].reduce((a, b) => `${a}${b}`);
// }

function getAssetPathFromID(
  id?: string | null,
  options?: { quality?: number }
): string | undefined {
  if (!id) return undefined;

  return [
    Constants.BASE_ASSET_URL,
    "/",
    id,
    options ? "?" : "",
    options?.quality ? `quality=${options.quality}` : "",
  ].join("");
}

// Formats Directus can resize without changing how they look
// (GIF could lose its animation, SVG its vector sharpness).
const RESIZABLE_IMAGE = /\.(png|jpe?g|webp)$/i;

/**
 * `srcSet` (1x/2x/3x) that asks Directus for a file resized to the displayed
 * size instead of the original upload, which is often 100-250 KB for an
 * 80px logo. `fit=inside` keeps the aspect ratio and `withoutEnlargement`
 * never upscales, so `object-contain` renders the same as with the original.
 */
function getResizedAssetSrcSet(
  file: { id?: string | null; filename_disk?: string | null } | null | undefined,
  displaySize: number
): string | undefined {
  if (!file?.id || !RESIZABLE_IMAGE.test(file.filename_disk ?? "")) return undefined;

  return [1, 2, 3]
    .map((density) => {
      const size = displaySize * density;
      return `${Constants.BASE_ASSET_URL}/${file.id}?width=${size}&height=${size}&fit=inside&withoutEnlargement=true&format=webp&quality=80 ${density}x`;
    })
    .join(", ");
}

export { Constants, Paths, getAssetPathFromID, getResizedAssetSrcSet };
