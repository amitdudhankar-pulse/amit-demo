import { Constants, Paths } from "@/contants";
import {
  createDirectus,
  readItems,
  rest,
  readSingleton,
  aggregate,
  createItem,
  authentication,
  readMe,
  deleteItems,
} from "@directus/sdk";
import { z } from "zod";
import { isEmail } from "validator";
import { ValidationError } from "./exceptions";
import { Rating } from "./rating";
import { OrderedList } from "@chakra-ui/react";

// TODO: This entire file is in need of a huge refactoring

// --------------------------------------------------------
// Helpers: Boolean, Date, Array, and File Normalizers
// --------------------------------------------------------

function normalizeRatingFields(raw: any) {
  return {
    ...raw,
    ease_of_use: raw.ease_of_use ?? 0,
    value_for_money: raw.value_for_money ?? 0,
    intuitive_interface: raw.intuitive_interface ?? 0,
    overall_satisfaction: raw.overall_satisfaction ?? 0,
    support_team_responsiveness: raw.support_team_responsiveness ?? 0,
    ease_of_customization: raw.ease_of_customization ?? 0,
  };
}

/**
 * Accepts: boolean | number | null | undefined
 * Returns: boolean
 */
const BoolFromNumber = z
  .union([z.boolean(), z.number(), z.null(), z.undefined()])
  .transform((v) => Boolean(v));

/**
 * Accepts:
 *  - MySQL DATETIME string: "2024-01-01 10:00:00"
 *  - ISO string
 *  - null / undefined
 * Returns: ISO string or null
 */
const FlexibleDate = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => {
    if (!v) return null;

    const s = String(v).trim();
    if (!s) return null;

    // MySQL "YYYY-MM-DD HH:MM:SS" → "YYYY-MM-DDTHH:MM:SS"
    const normalized =
      s.includes(" ") && !s.includes("T") ? s.replace(" ", "T") : s;

    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d.toISOString();
  });

/**
 * Accepts:
 *  - [ "tag1", "tag2" ]
 *  - "tag1, tag2"
 *  - null / undefined
 * Returns: string[]
 */
const StringArrayFlexible = z
  .union([z.array(z.string()), z.string(), z.null(), z.undefined()])
  .transform((v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;

    return String(v)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  });

/**
 * Accepts:
 *  - string UUID
 *  - Directus file object
 *  - null / undefined
 * Returns: unified { id, title, filename_disk, filename_download } | null
 */
const FileType = z
  .union([
    z.string().uuid(),
    z.object({
      id: z.string().uuid().nullable().optional(),
      title: z.string().nullable().optional(),
      filename_disk: z.string().nullable().optional(),
      filename_download: z.string().nullable().optional(),
    }),
    z.null(),
    z.undefined(),
  ])
  .transform((v) => {
    if (!v) return null;

    if (typeof v === "string") {
      return {
        id: v,
        title: null,
        filename_disk: null,
        filename_download: null,
      };
    }

    return {
      id: v.id ?? null,
      title: v.title ?? null,
      filename_disk: v.filename_disk ?? null,
      filename_download: v.filename_download ?? null,
    };
  });

type FileType = z.infer<typeof FileType>;

// const User = z.object({
//   id: z.string(),
//   firstname: z.string(),
//   lastname: z.string(),
// });

// --------------------------------------------------------
// User Schema
// --------------------------------------------------------

/**
 * Normalizes nullable/undefined strings → ""
 */
const OptionalStringToEmpty = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => (v ? v : ""));

const User = z.object({
  id: z.string().uuid(),

  firstname: OptionalStringToEmpty,
  lastname: OptionalStringToEmpty,
});

type User = z.infer<typeof User>;

// --------------------------------------------------------
// Configuration Example (Refactored)
// --------------------------------------------------------

const ConfigurationDataExample = {
  id: 1,

  // Basic info
  website_title: "Groupify AI",
  website_description: "Groupify AI",

  // Logos
  desktop_logo: {
    id: "d99421c2-df27-436f-b891-1d8ec65eeb34",
    title: "large-image",
  },
  mobile_logo: {
    id: "d99421c2-df27-436f-b891-1d8ec65eeb34",
    title: "large-image",
  },
  favicon: { id: "6a9e03d2-c769-471e-a5b1-2a1219d87ef8", title: "" },

  // Menus
  Menu: [1, 2, 3],
  Footer_Links: [],
  footer_content: "",

  // Social links
  linkedin: "https://www.linkedin.com/company/groupify-ai",
  facebook: "https://www.facebook.com/groupifyai",
  instagram: "https://www.instagram.com/groupify.ai/",
  x: "https://x.com/GroupifyAI",
  tiktok: "",
  pinterest: "https://in.pinterest.com/groupifyai/",
  youtube: "https://www.youtube.com/@groupifyai",
  threads: "https://www.threads.net/@groupify.ai",

  // Analytics
  google_analytics_id: "",

  // Background color layers
  background_colors: [
    {
      color: "",
      blurriness: 1,
      top: 1,
      bottom: 1,
      right: 1,
      left: 1,
    },
  ],

  // Boxes
  signup_box: {
    id: "d99421c2-df27-436f-b891-1d8ec65eeb34",
    title: "large-image",
  },
  subscribe_box: {
    id: "d99421c2-df27-436f-b891-1d8ec65eeb34",
    title: "large-image",
  },

  // News Page
  news_hero_banner: {
    id: "d99421c2-df27-436f-b891-1d8ec65eeb34",
    title: "large-image",
  },
  news_hero_title: "",
  news_section_title: "",
  news_meta_title: "",
  news_meta_description: "",

  // Blogs Page
  blogs_hero_banner: {
    id: "d99421c2-df27-436f-b891-1d8ec65eeb34",
    title: "large-image",
  },
  blogs_hero_title: "",
  blogs_section_title: "",
  blogs_meta_title: "",
  blogs_meta_description: "",

  // Search Page
  search_hero_banner: {
    id: "d99421c2-df27-436f-b891-1d8ec65eeb34",
    title: "large-image",
  },
  search_hero_title: "",
  search_meta_title: "",
  search_meta_description: "",

  // TnC Page
  tnc_meta_title: "",
  tnc_meta_description: "",

  // Favorites Page
  favorites_hero_banner: {
    id: "d99421c2-df27-436f-b891-1d8ec65eeb34",
    title: "large-image",
  },
  favorites_hero_title: "",
  favorites_meta_title: "",
  favorites_meta_description: "",

  // Website background
  website_background: {
    id: "d99421c2-df27-436f-b891-1d8ec65eeb34",
    title: "large-image",
  },

  // Navigation groups
  navigation: [] as {
    group: string;
    link?: { title: string; url: string }[];
  }[],

  // Subscription box
  subscription_box_text: "",
};

// --------------------------------------------------------
// Core Interfaces: File, Blog, News
// --------------------------------------------------------

/**
 * Matches the normalized output of FileType (your Zod helper).
 */
interface File {
  id: string | null;
  title: string | null;
  filename_disk?: string | null;
  filename_download?: string | null;
}

// --------------------------------------------------------
// FAQ Schema
// --------------------------------------------------------

const FAQ = z.object({
  question: z.string().min(1, "FAQ question cannot be empty"),
  answer: z.string().min(1, "FAQ answer cannot be empty"),
});

type FAQ = z.infer<typeof FAQ>;

/**
 * Blog structure returned by Directus after parsing.
 */
interface Blog {
  id: number;
  // id: string;
  slug: string;

  b_meta_title: string | null;
  b_meta_desc: string | null;
  title: string;
  sub_title?: string;

  description: string;
  content: string;

  image?: File | null;

  tags: string[];
  faq?: FAQ[] | null;

  date_created: string | null; // Converted to ISO via FlexibleDate
  read_minutes?: number | null;
}
/**
 * Blog schema with FAQ normalization
 */
const BlogSchema = z.object({
  id: z.number(),
  // id: z.string(),
  slug: z.string(),

  b_meta_title: z.string().nullable(),
  b_meta_desc: z.string().nullable(),
  title: z.string(),
  sub_title: z
    .string()
    .nullable()
    .transform((v) => v ?? ""),
  description: z.string(),
  content: z.string(),

  image: FileType.nullable(),

  // tags: z.string(),
  // FIX: Directus returns array | comma string | null
  tags: z
    .union([z.array(z.string()), z.string(), z.null(), z.undefined()])
    .transform((v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      return String(v)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }),
  faq: z
    .union([z.array(FAQ), z.string(), z.null(), z.undefined()])
    .transform((v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;

      try {
        const parsed = JSON.parse(v);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }),

  date_created: FlexibleDate,
  read_minutes: z
    .number()
    .nullable()
    .transform((v) => v ?? null)
    .optional(),
});
type ParsedBlog = z.infer<typeof BlogSchema>;

/**
 * Pricing Page structure.
 */

// lib/lib.ts (or wherever CMS is defined)

export interface PricingPageInfo {
  title: string;
  meta_title: string;
  meta_description: string;
  intro_title: string;
  intro_description: string;
  why_list_title: string;
  why_list_points: { point: string }[];
  contact_email: string;
  contact_text: string;
}

export interface PricingPlanFeature {
  id: number;
  text: { points: string }[];
  order: number;
}

export interface PricingPlan {
  id: number;
  title: string;
  image: string | null;
  price_original?: number;
  price_discounted?: number;
  button_text: string;
  button_url: string | null;
  is_custom?: boolean;
  order: number;
  highlight_color: string | null;
  features: PricingPlanFeature[];
}

export interface SponsorshipPageInfo {
  title: string;
  meta_title: string;
  meta_description: string;
  contact_title: string;
  contact_description: string;
  submit_button_text: string;
}

/**
 * News entry structure.
 */
interface News {
  id: number;
  URL: string;
  image?: File | null; // NEW
  date_created: string; // should also be ISO in parsed output
  publish_date: string; // ISO
}

// --------------------------------------------------------
// Categories (Values, Types & Lists)
// --------------------------------------------------------

const CategoryValue = z.enum([
  "productivity_tools",
  "video_generators",
  "text_generators",
  "image_generators",
  "art_generators",
  "audio_generators",
  "misc_ai_tools",
  "code_generators",
  "free_ai_tools",
  "ai_machine_learning",
  "generative_ai",
  "data_science",
  "computer_science",
  "ai_for_beginners",
]);

type CategoryValue = z.infer<typeof CategoryValue>;

/**
 * Base Category structure.
 */
interface Category {
  title: string;
  value: CategoryValue;
  icon: string;
  count?: number;
}

/**
 * Helper: creates a Category entry with full type inference.
 */
const createCategory = (
  value: CategoryValue,
  title: string,
  icon: string
): Category => ({
  value,
  title,
  icon,
});

/**
 * List of categories used specifically for courses.
 */
const CourseCategoryList: Partial<Record<CategoryValue, Category>> = {
  ai_machine_learning: createCategory(
    "ai_machine_learning",
    "AI & Machine Learning",
    Paths.ICONS.AI_MACHINE_LEARNING
  ),

  generative_ai: createCategory(
    "generative_ai",
    "Generative AI",
    Paths.ICONS.GENERATIVE_AI
  ),

  data_science: createCategory(
    "data_science",
    "Data Science",
    Paths.ICONS.DATA_SCIENCE
  ),

  computer_science: createCategory(
    "computer_science",
    "Computer Science",
    Paths.ICONS.COMPUTER_SCIENCE
  ),

  ai_for_beginners: createCategory(
    "ai_for_beginners",
    "AI for Beginners",
    Paths.ICONS.AI_FOR_BEGINNERS
  ),
};

// --------------------------------------------------------
// Function Categories + Tool Category List (Refactored)
// --------------------------------------------------------

/**
 * Each function category has only a title.
 */
interface FunctionCategory {
  title: string;
}

/**
 * Helper to create a function category.
 */
const createFunction = (title: string): FunctionCategory => ({ title });

/**
 * List of all function categories.
 */
const Functions: Record<string, FunctionCategory> = {
  research: createFunction("Research"),
  finance: createFunction("Finance"),
  project_management: createFunction("Project Management"),
  legal: createFunction("Legal"),
  e_commerce: createFunction("E-Commerce"),
  ai_agents: createFunction("AI Agents"),
  business: createFunction("Business"),
  real_estate: createFunction("Real-Estate"),
  hr: createFunction("HR"),
  gaming: createFunction("Gaming"),
  data_analytics: createFunction("Data-Analytics"),
  fitness_and_health: createFunction("Fitness and Health"),
  information_technology: createFunction("Information Technology"),
  sales: createFunction("Sales"),
  social_media: createFunction("Social Media"),
  search_engine: createFunction("Search Engine"),
  logistics: createFunction("Logistics"),
  operations: createFunction("Operations"),
  augmented_reality: createFunction("Augmented-Reality"),
  training_and_development: createFunction("Training And Development"),
  design: createFunction("Design"),
  marketing: createFunction("Marketing"),
  education: createFunction("Education"),
};

/**
 * Tool categories (used only in your legacy new-tool form)
 */
const ToolCategoryList: Partial<Record<CategoryValue, Category>> = {
  productivity_tools: {
    title: "AI Productivity Tools",
    icon: Paths.ICONS.AI_PRODUCTIVITY_TOOLS,
    value: "productivity_tools",
  },
  video_generators: {
    title: "AI Video Generators",
    icon: Paths.ICONS.AI_VIDEO_GENERATOR,
    value: "video_generators",
  },
  text_generators: {
    title: "AI Text Generators",
    icon: Paths.ICONS.AI_TEXT_GENERATOR,
    value: "text_generators",
  },
  image_generators: {
    title: "AI Image Generators",
    icon: Paths.ICONS.AI_IMAGE_GENERATOR,
    value: "image_generators",
  },
  art_generators: {
    title: "AI Art Generators",
    icon: Paths.ICONS.AI_ART_GENERATOR,
    value: "art_generators",
  },
  audio_generators: {
    title: "AI Audio Generators",
    icon: Paths.ICONS.AI_AUDIO_GENERATOR,
    value: "audio_generators",
  },
  misc_ai_tools: {
    title: "Misc AI Tools",
    icon: Paths.ICONS.MISC_AI_TOOLS,
    value: "misc_ai_tools",
  },
  code_generators: {
    title: "AI Code Generators",
    icon: Paths.ICONS.AI_CODE_GENERATOR,
    value: "code_generators",
  },
  free_ai_tools: {
    title: "Free AI Tools",
    icon: Paths.ICONS.FREE_AI_TOOLS,
    value: "free_ai_tools",
  },
};

// const FileType = z.object({
//   id: z.string(),
//   title: z.string().optional(),
// });

// // --------------------------------------------------------
// // FAQ Schema
// // --------------------------------------------------------

// const FAQ = z.object({
//   question: z.string().min(1, "FAQ question cannot be empty"),
//   answer: z.string().min(1, "FAQ answer cannot be empty"),
// });

// type FAQ = z.infer<typeof FAQ>;

// --------------------------------------------------------
// Function Schema (Part 1)
// --------------------------------------------------------

/**
 * Reusable schema for { title, url } objects
 */
const LinkItem = z.object({
  title: z.string(),
  url: z.string(),
});

/**
 * FunctionV2 base schema (without relational expansions)
 */
const FunctionV2Schema_part1 = z.object({
  slug: z.string(),

  title: z.string(),

  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),

  image: FileType.nullable(),

  short_description: z.string(),

  description: z.string().nullable(),

  related_topics: z
    .union([z.array(LinkItem), z.string(), z.null(), z.undefined()])
    .transform((v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;

      // If Directus stores JSON string
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) return parsed;
      } catch {}

      // Else comma-separated string
      return String(v)
        .split(",")
        .map((s) => ({ title: s.trim(), url: "" }))
        .filter((e) => e.title);
    }),

  additional_topics: z.string().nullable(),

  keywords: z
    .union([z.array(z.string()), z.string(), z.null(), z.undefined()])
    .transform((v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;

      return String(v)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }),

  faq: z
    .union([z.array(FAQ), z.string(), z.null(), z.undefined()])
    .transform((v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;

      try {
        const parsed = JSON.parse(v);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }),

  products_count: z.number(),
});

// --------------------------------------------------------
// Category (Part 1) Schema
// --------------------------------------------------------

/**
 * Minimal structure for related function entries
 * { functions_id: { title, slug } }
 */
const MinimalFunctionRef = z
  .object({
    functions_id: FunctionV2Schema_part1.pick({
      title: true,
      slug: true,
    }),
  })
  .transform((e) => e.functions_id);

/**
 * Base Category schema (without product relations)
 */
const CategoryV2Schema_part1 = FunctionV2Schema_part1.extend({
  logo: FileType.nullable(),

  /**
   * Relations: categories → functions
   * Directus returns:
   * [
   *   { functions_id: { title, slug } },
   *   ...
   * ]
   *
   * Output should be:
   * [
   *   { title, slug },
   *   ...
   * ]
   */
  functions: z.array(MinimalFunctionRef).nullable().optional(),

  category_type: z.enum(["course_category", "tool_category"]),
});

// --------------------------------------------------------
// Pricing Mode Enum
// --------------------------------------------------------

const PricingMode = z.enum(["free", "paid", "freemium", "active_deals"]);
type PricingMode = z.infer<typeof PricingMode>;

// --------------------------------------------------------
// Product Base Schema (Refactored)
// --------------------------------------------------------

/**
 * Minimal category reference:
 * { categories_id: { ... } } → { ... }
 */
const MinimalCategoryRef = z
  .object({
    categories_id: CategoryV2Schema_part1.omit({ functions: true }).nullable(),
  })
  .transform((e) => e.categories_id ?? null);

/**
 * Pricing mode transformer map
 */
const PricingModeMap = {
  free: { title: "Free", value: "free" },
  active_deals: { title: "Active Deals", value: "active_deals" },
  paid: { title: "Paid", value: "paid" },
  freemium: { title: "Freemium", value: "freemium" },
} as const;

/**
 * Clean YouTube URL transformer
 */
const CleanYoutubeURL = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => (v ? String(v).trim() : null))
  .refine(
    (e) =>
      !e ||
      (e.startsWith("https") &&
        e.includes("youtu") &&
        !e.includes("@") &&
        !e.includes("channel")),
    { message: "Error in the youtube url" }
  )
  .nullable();

/**
 * Product Base Schema
 */
const ProductBase = Rating.extend({
  id: z.number(),
  order: z.number().nullable().default(null),
  editor_choice_order: z.number().nullable().optional(),
  featured_order: z.number().nullable().optional(),
  popular_order: z.number().nullable().optional(),
  verified_order: z.number().nullable().optional(),

  title: z.string(),
  meta_title: z.string().nullable(),
  slug: z.string(),

  tool_url: z.string().url().nullable(),

  youtube_url: CleanYoutubeURL,

  logo: FileType.nullable(),
  logo_url: z.string().url().nullable(),

  visible_tags: StringArrayFlexible.nullable(),

  long_description: z.string().nullable().default(""),
  use_cases: z.string().nullable(),
  pricing: z.string().nullable(),
  pricing_url: z.string().url().nullable(),

  embed_description: z.string().nullable(),
  short_description: z.string().nullable(),

  large_image: FileType.nullable(),

  // booleans accepting 0/1/true/false
  editor_choice: BoolFromNumber,
  featured: BoolFromNumber,
  verified: BoolFromNumber,
  popular: BoolFromNumber,
  publish: BoolFromNumber,

  coupon_code: z.string().nullable(),

  x: z.string().url().nullable(),
  facebook: z.string().url().nullable(),
  instagram: z.string().url().nullable(),
  linkedin: z.string().url().nullable(),
  tiktok: z.string().url().nullable(),

  date_updated: FlexibleDate,
  date_created: FlexibleDate,

  review_count: z.number().optional(),

  save_count: z.number().nullable().optional().default(20),

  // FAQs
  faq_1_question: z.string().nullable(),
  faq_1_answer: z.string().nullable(),
  faq_2_question: z.string().nullable(),
  faq_2_answer: z.string().nullable(),
  faq_3_question: z.string().nullable(),
  faq_3_answer: z.string().nullable(),

  // course flag (0/1/null)
  course: BoolFromNumber.nullable(),

  // category relationships
  category_relations: z.array(MinimalCategoryRef).optional().default([]),

  // function relationships
  function_relations: z.array(MinimalFunctionRef).optional().default([]),

  // pricing mode
  pricing_mode: PricingMode.nullable().transform((e) => {
    if (!e) return null;
    return PricingModeMap[e];
  }),

  opinion: z.string().nullable(),
});

/**
 * Inject URL based on tool/course type
 */
const addURLToProduct = <T extends { slug: string; course: boolean | null }>(
  e: T
) => {
  const base =
    e.course === true
      ? Paths.Frontend.AI_COURSES.href
      : Paths.Frontend.AI_TOOL.href;

  return {
    ...e,
    url: `${base}/${e.slug}`,
  };
};

const Product = ProductBase.transform(addURLToProduct);

// --------------------------------------------------------
// Category V2 (Full Schema)
// --------------------------------------------------------

/**
 * Reusable relation for:
 * { Products_id: <ProductBase + transforms> }
 *
 * transform → extract Products_id and apply addURLToProduct
 */
const ProductRelationFull = ProductBase.omit({
  category_relations: true,
}).transform(addURLToProduct);

const CategoryV2Schema = CategoryV2Schema_part1.extend({
  /**
   * Directus returns:
   * [
   *   { Products_id: { ...product object... } }
   * ]
   *
   * We output:
   * [
   *   productObjectWithURL
   * ]
   */
  products: z
    .array(
      z
        .object({
          Products_id: ProductRelationFull,
        })
        .transform((e) => e.Products_id)
    )
    .default([]),
});

export type CategoryV2 = z.infer<typeof CategoryV2Schema>;

// --------------------------------------------------------
// Function V2 (Full Schema)
// --------------------------------------------------------

/**
 * Relation for related courses:
 * Only uses { title, slug, course }, then adds URL
 */
const ProductRelationMinimal = ProductBase.pick({
  title: true,
  slug: true,
  course: true,
}).transform(addURLToProduct);

/**
 * Product reference for function details (omit relations)
 */
const ProductRelationForFunction = ProductBase.omit({
  category_relations: true,
  function_relations: true,
}).transform(addURLToProduct);

const FunctionV2Schema = FunctionV2Schema_part1.extend({
  related_courses: z
    .array(
      z
        .object({
          Products_id: ProductRelationMinimal,
        })
        .transform((e) => e.Products_id)
    )
    .nullable()
    .optional(),

  products: z
    .array(
      z
        .object({
          Products_id: ProductRelationForFunction,
        })
        .transform((e) => e.Products_id)
    )
    .default([]),
});

export type FunctionV2 = z.infer<typeof FunctionV2Schema>;

// --------------------------------------------------------
// Page Info Types
// --------------------------------------------------------

type GeneralPageInfo = {
  meta_title: string;
  meta_description: string;
  hero_banner?: File | null;
  hero_title: string;
};

type HeropageInfo = {
  hero_text: string;
  about: string;
  faq?: FAQ[] | null;
};

type SponsorshipLead = {
  name: string;
  email: string;
  company_name?: string;
  website?: string;
  interested_package?: string;
  message?: string;
};

// Derive Product type from schema
type Product = z.infer<typeof Product>;

/**
 * Configuration type extends example object
 * + normalizes nav_bar_menu type
 */
type Configuration = typeof ConfigurationDataExample & {
  nav_bar_menu:
    | {
        title: string;
        link_list: { title: string; url: string }[];
      }[]
    | null
    | undefined;
};

type NewsLetterSubscriber = {
  name?: string;
  email: string;
};

type ToolCategoryPage = GeneralPageInfo & {
  description?: string;
};

type FunctionCategoryPage = GeneralPageInfo & {
  description?: string;
};

type CourseCategoryPage = GeneralPageInfo & {
  description?: string;
};

export type NewToolFormPage = GeneralPageInfo & {
  instructions?: string;
};

// --------------------------------------------------------
// Review Schemas
// --------------------------------------------------------

/**
 * Review submitted by user (before saving)
 */
const NewReview = Rating.extend({
  comment: z.string().optional(),
  product: z.number().optional(), // can be undefined before saving
});
type NewReview = z.infer<typeof NewReview>;

/**
 * Full Review as stored in Directus
 */
const Review = NewReview.extend({
  id: z.number(),
  published: z.boolean(),
  created_by_name: z.string(),
  user_created: z.string(),

  // Better: use FlexibleDate for consistency
  date_created: FlexibleDate,
});
type Review = z.infer<typeof Review>;

// --------------------------------------------------------
// Directus Schema (Top-Level API Shape)
// --------------------------------------------------------

interface Schema {
  blogs: Blog[];
  direct_blogs: Blog[];
  news: News[];

  products: Product[];

  configuration: Configuration;

  tool_category_page: ToolCategoryPage;
  function_category_page: FunctionCategoryPage;
  course_category_page: CourseCategoryPage;
  home_page: HeropageInfo;

  categories: CategoryV2[]; // original categories
  newslettersubscriber: NewsLetterSubscriber[];

  reviews: Review[];

  _404_page: { text: string };
  terms_and_conditions_page: { text: string };

  new_tool_page: NewToolFormPage;

  tool_request: NewToolData;

  bookmark: { product: string | number }[];

  functions: FunctionV2[];

  pricing_page: PricingPageInfo;
  pricing_plans: PricingPlan[];
  pricing_plan_features: PricingPlanFeature[];
  sponsorship_leads: SponsorshipLead[];
}

// --------------------------------------------------------
// New Tool Form Schema (Refactored)
// --------------------------------------------------------

/**
 * Utility: Optional social link (trimmed), returns "" for empty cases
 */
const optionalURL = z
  .string()
  .optional()
  .transform((v) => (v?.trim() ? v.trim() : ""));

/**
 * Utility: Validate comma-separated tag list
 * Must contain 3 to 10 tags
 */
const tagsString = z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value) return false;
      const tags = value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      return tags.length >= 3 && tags.length <= 10;
    },
    { message: "Add at least 3 & a maximum of 10 tags" }
  );

/**
 * Base Schema
 */
const NewToolDataSchema = z
  .object({
    intention: z.enum(["submit_new_tool", "update_tool"]),

    // User Info
    user_name: z.string().min(1, "User name cannot be empty"),
    user_designation: z.string().min(1, "User designation cannot be empty"),
    user_email: z.string().email("Please use a valid user email"),

    // Tool Info
    title: z.string({ message: "Tool title is required" }),
    slug: z.string().optional(),
    category: z.string(),

    function: z
      .array(z.string())
      .min(1, "Select at least 3 relevant functions")
      .max(3, "A maximum of 3 functions can be selected"),

    short_description: z.string().optional(),

    long_description: z.string().min(1, "Long description cannot be empty"),

    usecases: z.string().min(1, "Usecases cannot be empty"),

    // FAQ fields
    faq_ques_1: z.string().optional(),
    faq_ans_1: z.string().optional(),
    faq_ques_2: z.string().optional(),
    faq_ans_2: z.string().optional(),
    faq_ques_3: z.string().optional(),
    faq_ans_3: z.string().optional(),

    // Pricing
    pricing: z.enum(["freemium", "free", "paid"], {
      required_error: "Select one of the pricing options",
    }),
    pricing_url: z.string().optional(),
    where_did_you_hear: z.string().optional(),

    // Social links (trimmed but not validated here)
    facebook_url: optionalURL,
    x_url: optionalURL,
    instagram_url: optionalURL,
    linkedin_url: optionalURL,
    youtube_url: optionalURL,
    tiktok_url: optionalURL,

    tags: tagsString,
    feedback: z.string().optional(),
  })

  // --------------------------------------------------------
  // Final Validation: At least 1 social link must be provided
  // --------------------------------------------------------
  .refine(
    (data) => {
      const socialLinks = [
        data.facebook_url,
        data.x_url,
        data.instagram_url,
        data.linkedin_url,
        data.youtube_url,
        data.tiktok_url,
      ].filter((link) => link && link.trim() !== "");

      return socialLinks.length > 0;
    },
    { message: "At least 1 social media links should be provided" }
  );

type NewToolData = z.infer<typeof NewToolDataSchema>;

// --------------------------------------------------------
// Directus Client (Refactored)
// --------------------------------------------------------

const directusClient = createDirectus<Schema>(Constants.BASE_URL)
  .with(
    authentication("session", { credentials: "include", autoRefresh: true })
  )
  .with(rest({ credentials: "include" }));

// --------------------------------------------------------
// Product Type Filters
// --------------------------------------------------------

type ProductType = "all" | "course" | "tool";

/**
 * Course products
 * course = "true"
 */
const COURSE_FILTER = {
  course: { _eq: "true" },
};

/**
 * Tool products
 * course = "false" OR course is null
 */
const TOOL_FILTER = {
  _or: [{ course: { _eq: "false" } }, { course: { _null: true } }],
};

// --------------------------------------------------------
// Fields Namespace — Clean + Deduplicated
// --------------------------------------------------------

namespace Fields {
  /**
   * Why these base fields?
   * Categories and Products reference each other.
   * To prevent infinite loops, we define minimal "base" fields.
   */

  // Base category fields
  const BASE_CATEGORY = ["*", "logo.*", "image.*", "count(products)"];

  // Base function fields
  const BASE_FUNCTION = ["*", "image.*", "count(products)"];

  // Base product fields
  const BASE_PRODUCT = ["*", "large_image.*", "logo.*"];

  /**
   * Product Fields
   * Expands product → function relations → category relations
   */
  export const product = [
    ...BASE_PRODUCT,
    "editor_choice",
    "editor_choice_order",

    "featured",
    "featured_order",

    "popular",
    "popular_order",

    "verified",
    "verified_order",
    // Function relations
    "function_relations.*",
    "function_relations.functions_id.title",
    "function_relations.functions_id.slug",

    // Category relations (categories_id.…)
    ...BASE_CATEGORY.map(
      (field) => `category_relations.categories_id.${field}`
    ),
  ];

  /**
   * Category Fields
   * Includes:
   * - Base category details
   * - Linked functions
   * - Linked products
   */
  export const category = [
    ...BASE_CATEGORY,

    // Function relations
    "functions.*",
    "functions.functions_id.title",
    "functions.functions_id.slug",

    // Product relations (products.Products_id.…)
    "products.*.*",
    ...BASE_PRODUCT.map((field) => `products.Products_id.${field}`),
  ];

  /**
   * Category Fields without the product/function relations
   * (the category schema defaults `products` to []).
   * Listed explicitly because "*" returns relations as bare IDs,
   * which the category schema rejects.
   */
  export const categoryWithoutProducts = [
    "slug",
    "title",
    "meta_title",
    "meta_description",
    "image.*",
    "short_description",
    "description",
    "related_topics",
    "additional_topics",
    "keywords",
    "faq",
    "category_type",
    "logo.*",
    "count(products)",
  ];

  /**
   * Function Fields
   * Includes:
   * - Base function fields
   * - related_courses
   * - products
   */
  export const functions = [
    ...BASE_FUNCTION,

    // Related courses (Products_id.…)
    "related_courses.*.*",
    ...BASE_PRODUCT.map((field) => `related_courses.Products_id.${field}`),

    // Products (Products_id.…)
    "products.*.*",
    ...BASE_PRODUCT.map((field) => `products.Products_id.${field}`),
  ];
}

// helper: build related fields with prefix and return string[]
function buildPrefixedFields(prefix: string, baseFields: string[]): string[] {
  // prefix like "product" -> produce ["product.*", "product.large_image.*", ...]
  return baseFields.map((f) => {
    // if base field is "*" keep it as `${prefix}.*` to get nested object
    if (f === "*") return `${prefix}.*`;
    return `${prefix}.${f}`;
  });
}

/**
 * Small safe cast wrapper when calling directus readItems fields:
 * Some directus SDK types are very strict about tuple/readonly shapes,
 * so cast fields to `any` only at the call-site (minimize 'any' spread).
 */
function callReadItems<T = any>(
  collection: string,
  options: Record<string, any>
) {
  // cast fields option to any only here
  const opts = { ...options } as any;
  return directusClient.request(readItems(collection as any, opts));
}

// ---------- helpers (put near top of file) ----------
function asUnknown<T>(v: unknown): T {
  return v as T;
}

function normalizeFaqArray(raw: unknown): FAQ[] | null {
  if (!Array.isArray(raw)) return null;

  const out: FAQ[] = [];
  for (const item of raw) {
    try {
      out.push(FAQ.parse(item));
    } catch (_) {
      // skip invalid faq item
    }
  }

  return out.length > 0 ? out : null;
}

// ------------------------------------------------------
// GOOGLE LOGIN (DIRECTUS - REST ONLY)
// ------------------------------------------------------
const loginWithGoogle = async (idToken: string) => {
  const res = await fetch(`${Constants.BASE_URL}/auth/login/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ access_token: idToken }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};

// ------------------------------------------------------
// BASE CONFIG FETCHER (shared)
// ------------------------------------------------------
const CONFIG_FIELDS = [
  "*.*",
  "favicon.*",
  "mobile_logo.*",
  "desktop_logo.*",
  "hero_image.*",
  "hero_image_mobile.*",
  "favorites_hero_banner.*",
  "website_background.*",
] as const;

const PAGE_FIELDS = ["*.*", "hero_banner.*"] as const;

// --------------------------------------------------------
// CMS Service — Refactored (Part 1)
// --------------------------------------------------------

const CMS = {
  // ------------------------------------------------------
  // FUNCTIONS
  // ------------------------------------------------------
  getAllFunctions: async (props?: { options?: object }) => {
    const options = props?.options ?? {};

    const data = await directusClient.request(
      readItems("functions", {
        ...options,
        fields: Fields.functions as any,
        limit: 50,
      })
    );

    // Parse with Zod schema
    return (data as unknown[]).map((item) => FunctionV2Schema.parse(item));
  },

  getFunctionFromSlug: async (slug: string, limit?: number) => {
    const rows = await CMS.getAllFunctions({
      options: {
        filter: { slug: { _eq: slug } },
      },
    });

    return rows[0] ?? null;
  },

  // ------------------------------------------------------
  // TOOL CATEGORY PAGE
  // ------------------------------------------------------
  getToolCategoryPageInfo: async () => {
    try {
      const [row] = await directusClient.request(
        readItems("tool_category_page" as any, {
          limit: 1,
          fields: ["*", "hero_banner.*"],
        })
      );

      return row ?? null;
    } catch (error) {
      console.error("❌ Error fetching tool_category_page:", error);
      return null;
    }
  },

  // ------------------------------------------------------
  // CATEGORIES
  // ------------------------------------------------------
  getAllCategories: async (props?: {
    options?: Record<string, any>;
    type?: "tool_category" | "course_category";
    // false: skip the nested products, for pages that only show the category
    // itself (the full query returns ~100 products per category)
    withProducts?: boolean;
  }): Promise<CategoryV2[]> => {
    const options = props?.options ?? {};

    const filter = {
      ...options.filter,
      ...(props?.type && { category_type: { _eq: props.type } }),
    };

    const fields: string[] =
      props?.withProducts === false
        ? Fields.categoryWithoutProducts
        : [
            "*",
            "logo.*",
            "image.*",
            "products.*.*",
            ...Fields.product.map((f) => `products.Products_id.${f}`),
            "functions.*",
            "functions.functions_id.*",
            "count(products)",
          ];

    let rows: unknown[];

    try {
      rows = await directusClient.request(
        readItems("categories", {
          ...options,
          filter,
          fields: fields as any,
          limit: 20,
        })
      );
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      return [];
    }

    // Parse using Zod, log errors but do not break entire list
    const parsed = rows
      .map((row) => {
        try {
          return CategoryV2Schema.parse(row);
        } catch (err) {
          console.error(
            "❌ Failed to parse category row:",
            JSON.stringify(row, null, 2),
            err
          );
          return null;
        }
      })
      .filter((item): item is CategoryV2 => item !== null);

    return parsed;
  },

  getCategoryFromSlug: async (slug: string, limit?: number) => {
    const rows = await CMS.getAllCategories({
      options: {
        filter: { slug: { _eq: slug } },
      },
    });

    return rows[0] ?? null;
  },

  // ------------------------------------------------------
  // BOOKMARKS
  // ------------------------------------------------------

  getAllBookmarkObjects: async (): Promise<{ product: Product }[]> => {
    // Build fields so Directus returns product as the full nested object
    const productFields = buildPrefixedFields("product", Fields.product);

    const fields = ["*", ...productFields];

    try {
      // callReadItems wraps the strict typing issue
      const rows = await callReadItems("bookmark", { fields });

      // rows at runtime should be array of objects like { product: { ... } }
      return rows as unknown as { product: Product }[];
    } catch (error) {
      console.error("❌ Error fetching bookmark objects:", error);
      return [];
    }
  },

  createBookmarkObjectForProduct: async (props: { productId: number }) => {
    try {
      return await directusClient.request(
        createItem("bookmark", { product: props.productId })
      );
    } catch (error) {
      console.error("❌ Error creating bookmark object:", error);
      throw error;
    }
  },

  getBookmarkObjectForProduct: async (props: { productId: number }) => {
    try {
      return await directusClient.request(
        readItems("bookmark", {
          filter: { product: { _eq: props.productId } },
        })
      );
    } catch (error) {
      console.error("❌ Error fetching bookmark object:", error);
      return [];
    }
  },

  deleteBookmarkObjectForProduct: async (props: { productId: number }) => {
    try {
      return await directusClient.request(
        deleteItems("bookmark", {
          filter: { product: { _eq: props.productId } },
        })
      );
    } catch (error) {
      console.error("❌ Error deleting bookmark object:", error);
      throw error;
    }
  },

  // ------------------------------------------------------
  // BLOG HELPERS
  // ------------------------------------------------------

  // _getAllBlogs: async (
  //   collection: "blogs" | "direct_blogs",
  //   options: Record<string, any> = {}
  // ): Promise<Blog[]> => {
  //   try {
  //     return await directusClient.request(
  //       readItems(collection, {
  //         ...options,
  //         fields: ["*", "image.*"],
  //         sort: "-date_created",
  //       })
  //     );
  //   } catch (error) {
  //     console.error(`❌ Error fetching ${collection}:`, error);
  //     return [];
  //   }
  // },

  _getAllBlogs: async (
    collection: "blogs" | "direct_blogs",
    options: Record<string, any> = {}
  ): Promise<Blog[]> => {
    try {
      const rows = await directusClient.request(
        readItems(collection, {
          ...options,
          fields: ["*", "image.*"],
          sort: "-date_created",
        })
      );

      return rows.map((raw: unknown) => BlogSchema.parse(raw));
    } catch (error) {
      console.error(`❌ Error fetching ${collection}:`, error);
      return [];
    }
  },

  // ------------------------------------------------------
  // BLOG COUNTS
  // ------------------------------------------------------
  _getBlogsCount: async (
    collection: "blogs" | "direct_blogs"
  ): Promise<number> => {
    try {
      const result = await directusClient.request(
        aggregate(collection, {
          aggregate: { count: "*" },
        })
      );

      const count = result?.[0]?.count;
      return parseInt(count ?? "0", 10);
    } catch (error) {
      console.error(`❌ Error counting blogs for ${collection}:`, error);
      return 0;
    }
  },

  // ------------------------------------------------------
  // BLOG GETTERS — BY KEY / BY SLUG
  // ------------------------------------------------------
  _getBlogFromKey: async (
    collection: "blogs" | "direct_blogs",
    key: number
  ) => {
    const rows = await CMS._getAllBlogs(collection, {
      filter: { id: { _eq: key } },
    });

    return rows[0] ?? null;
  },

  _getBlogFromSlug: async (
    collection: "blogs" | "direct_blogs",
    slug: string
  ) => {
    const rows = await CMS._getAllBlogs(collection, {
      filter: { slug: { _eq: slug } },
    });

    return rows[0] ?? null;
  },

  // ------------------------------------------------------
  // BLOGS — PUBLIC METHODS
  // ------------------------------------------------------
  getAllBlogs: async (options: Record<string, any> = {}) =>
    CMS._getAllBlogs("blogs", options),

  getBlogsCount: async () => CMS._getBlogsCount("blogs"),

  getBlogFromKey: async (key: number) => CMS._getBlogFromKey("blogs", key),

  getBlogFromSlug: async (slug: string) => CMS._getBlogFromSlug("blogs", slug),

  // ------------------------------------------------------
  // DIRECT BLOGS — PUBLIC METHODS
  // ------------------------------------------------------
  getAllDirectBlogs: async (options: Record<string, any> = {}) =>
    CMS._getAllBlogs("direct_blogs", options),

  getDirectBlogFromSlug: async (slug: string) =>
    CMS._getBlogFromSlug("direct_blogs", slug),

  getDirectBlogFromKey: async (key: number) =>
    CMS._getBlogFromKey("direct_blogs", key),

  getDirectBlogsCount: async () => CMS._getBlogsCount("direct_blogs"),

  // ------------------------------------------------------
  // PRODUCTS (DEBUG VERSION)
  // ------------------------------------------------------
  _tmp_getProductsWithError: async (
    options: Record<string, any> = {}
  ): Promise<Product[]> => {
    try {
      const rows = await callReadItems("products", {
        limit: 20,
        ...options,
        fields: Fields.product,
      });

      const errored: Product[] = [];

      for (const raw of rows as unknown[]) {
        try {
          // Product.parse(raw);
          Product.parse(normalizeRatingFields(raw));
        } catch (err) {
          errored.push({
            ...(raw as object),
            error: err,
          } as any);
        }
      }

      return errored;
    } catch (error) {
      console.error("❌ Error fetching products with error checking:", error);
      return [];
    }
  },

  // ------------------------------------------------------
  // PUBLIC PRODUCT FETCHER (ALL | COURSE | TOOL)
  // ------------------------------------------------------
  // getAllProducts: async (
  //   type: ProductType,
  //   options: Record<string, any> = {}
  // ): Promise<Product[]> => {
  //   const typeFilter = {
  //     course: COURSE_FILTER,
  //     tool: TOOL_FILTER,
  //     all: undefined,
  //   }[type];

  //   try {
  //     const rows = await callReadItems("products", {
  //       limit: 20,
  //       sort: ["order"],
  //       ...options,
  //       filter: {
  //         ...options.filter,
  //         // publish: { _eq: "true" },
  //         publish: { _eq: true },

  //         ...typeFilter,
  //       },
  //       fields: Fields.product,
  //     });
  //     const parsed: Product[] = [];

  //     for (const raw of rows as unknown[]) {
  //       try {
  //         // parsed.push(Product.parse(raw));
  //         parsed.push(Product.parse(normalizeRatingFields(raw)));
  //       } catch (err) {
  //         console.error("❌ Product parse failed:", raw, err);
  //       }
  //     }

  //     return parsed;
  //   } catch (error) {
  //     console.error("❌ Error fetching products:", error);
  //     return [];
  //   }
  // },

  getAllProducts: async (
    type: ProductType,
    options: Record<string, any> = {}
  ): Promise<Product[]> => {
    const typeFilter = {
      course: COURSE_FILTER,
      tool: TOOL_FILTER,
      all: undefined,
    }[type];

    const curatedSortMap: Record<string, string> = {
      editor_choice: "editor_choice_order",
      featured: "featured_order",
      popular: "popular_order",
      verified: "verified_order",
    };

    let resolvedSort: string[] = ["order", "-date_created"];

    // if (options.filter) {
    //   for (const key of Object.keys(curatedSortMap)) {
    //     if (options.filter?.[key]?._eq === true) {
    //       resolvedSort = [`-${key}`, curatedSortMap[key], "-date_created"];
    //       break;
    //     }
    //   }
    // }

    if (options.filter) {
      for (const key of Object.keys(curatedSortMap)) {
        if (options.filter?.[key]?._eq === true) {
          resolvedSort = [curatedSortMap[key], "-date_created"];
          break;
        }
      }
    }

    try {
      const rows = await callReadItems("products", {
        limit: 20,
        ...options,
        sort: resolvedSort,
        filter: {
          ...options.filter,
          publish: { _eq: true },
          ...typeFilter,
        },
        fields: Fields.product,
      });

      return (rows as unknown[]).map((raw) =>
        Product.parse(normalizeRatingFields(raw))
      );
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      return [];
    }
  },

  // ------------------------------------------------------
  // PRODUCT SEARCH
  // ------------------------------------------------------
  searchProduct: async (
    query: string,
    options: {
      tagSearch?: boolean;
      titleSearch?: boolean;
      descriptionSearch?: boolean;
    }
  ): Promise<Product[]> => {
    if (!query.trim()) return [];

    // ----------------------------------------------------
    // Normalize query → words
    // ----------------------------------------------------
    const rawWords = query.includes("+") ? query.split("+") : query.split(" ");

    let words = rawWords.map((w) => w.trim()).filter((w) => w.length > 0);

    if (words.length > 1) words.push(query.trim());

    const queryLower = query.toLowerCase();

    // ----------------------------------------------------
    // Build Filters
    // ----------------------------------------------------

    // Exact title starts-with
    const exactTitleQuery = {
      _or: [{ title: { _istarts_with: query } }],
    };

    const tagIgnoreList = ["ai"];

    // Build variations for tag matching (all the "," + " " combos)
    const tagPieces = words
      .filter((w) => !tagIgnoreList.includes(w.toLowerCase()))
      .flatMap((w) => [
        `,${w},`,
        ` ${w} `,
        ` ${w},`,
        `,${w} `,
        `${w},`,
        `,${w}`,
        `, ${w}`,
      ]);

    const tagQuery = {
      _or: tagPieces.map((t) => ({
        visible_tags: { _icontains: t },
      })),
    };

    // Title-based "icontains" query
    const titleQuery = {
      _or: [
        ...words.map((w) => ({ title: { _icontains: ` ${w}` } })),
        ...(words.length === 1
          ? words.map((w) => ({ title: { _icontains: w } }))
          : []),
      ],
    };

    // Description query
    const descriptionQuery = {
      _or: [
        ...words.map((w) => ({ long_description: { _icontains: ` ${w}` } })),
        ...words.map((w) => ({ long_description: { _icontains: `${w} ` } })),
      ],
    };

    // ----------------------------------------------------
    // Build search tasks
    // ----------------------------------------------------
    const tasks: Promise<Product[]>[] = [];

    if (options.titleSearch) {
      tasks.push(
        CMS.getAllProducts("all", { limit: 20, filter: exactTitleQuery }).then(
          (rows) =>
            rows.sort((a) => (a.title.toLowerCase() === queryLower ? -1 : 1))
        )
      );

      tasks.push(
        CMS.getAllProducts("all", { limit: 20, filter: titleQuery }).then(
          (rows) =>
            rows.sort((a) => (a.title.toLowerCase() === queryLower ? -1 : 1))
        )
      );
    }

    if (options.tagSearch) {
      tasks.push(
        CMS.getAllProducts("all", { limit: 20, filter: tagQuery }).then(
          (rows) =>
            rows.sort((a) =>
              a.visible_tags?.map((t) => t.toLowerCase()).includes(queryLower)
                ? -1
                : 1
            )
        )
      );
    }

    if (options.descriptionSearch) {
      tasks.push(
        CMS.getAllProducts("all", { limit: 20, filter: descriptionQuery })
      );
    }

    // No search fields selected -> no results
    if (tasks.length === 0) return [];

    // ----------------------------------------------------
    // Execute all tasks
    // ----------------------------------------------------
    let result: Product[][] = [];

    try {
      result = await Promise.all(tasks);
    } catch (err) {
      console.error("❌ Error in search operations:", err);
      return [];
    }

    // ----------------------------------------------------
    // Merge & Remove duplicates by ID
    // ----------------------------------------------------
    const seen = new Set<number>();
    return result.flat().filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  },

  // ------------------------------------------------------
  // PRODUCT COUNT (FIXED & TYPE-AWARE)
  // ------------------------------------------------------
  getProductCount: async (
    type: ProductType,
    options: Record<string, any> = {}
  ): Promise<number> => {
    // type-aware filters
    const typeFilter = {
      course: COURSE_FILTER,
      tool: TOOL_FILTER,
      all: undefined,
    }[type];

    try {
      const result = await directusClient.request(
        aggregate("products", {
          ...options,
          filter: {
            ...(options.filter || {}),
            // publish: { _eq: "true" },
            publish: { _eq: true },

            ...typeFilter,
          },
          aggregate: { count: "*" },
        })
      );

      const count = result?.[0]?.count;
      return parseInt(count ?? "0", 10);
    } catch (error) {
      console.error("❌ Error counting products:", error);
      return 0;
    }
  },

  // ------------------------------------------------------
  // ALTERNATE PRODUCTS (TAG-BASED)
  // ------------------------------------------------------
  getAlternateProductList: async (product: Product): Promise<Product[]> => {
    const query =
      product.visible_tags?.reduce((acc, tag) => `${tag}+${acc}`, "") ?? "";

    if (!query.trim()) return [];

    const results = await CMS.searchProduct(query, { tagSearch: true });
    return results.slice(0, 10);
  },

  // ------------------------------------------------------
  // FEATURED PRODUCTS (RANDOMIZED ORDER)
  // ------------------------------------------------------
  getFeaturedProductList: async (type: ProductType): Promise<Product[]> => {
    const results = await CMS.getAllProducts(type);

    return results
      .sort(() => (Math.random() > 0.5 ? 1 : -1)) // random shuffle
      .slice(0, 5);
  },

  // ------------------------------------------------------
  // PRODUCT LOOKUP BY SLUG
  // ------------------------------------------------------
  getProductsFromSlug: async (
    type: ProductType,
    slug: string
  ): Promise<Product | undefined> => {
    const rows = await CMS.getAllProducts(type, {
      filter: { slug: { _eq: slug } },
    });

    return rows.length ? rows[0] : undefined;
  },

  // ------------------------------------------------------
  // PRODUCT LOOKUP BY ID
  // ------------------------------------------------------
  getProductsFromKey: async (
    type: ProductType,
    key: number
  ): Promise<Product | undefined> => {
    const rows = await CMS.getAllProducts(type, {
      filter: { id: { _eq: key } },
    });

    return rows.length ? rows[0] : undefined;
  },

  // ------------------------------------------------------
  // NEWS LIST
  // ------------------------------------------------------
  getAllNews: async (options: Record<string, any> = {}) => {
    try {
      return await directusClient.request(
        readItems("news", {
          limit: 20,
          ...options,
          sort: "-date_created",
          fields: ["*", "image.*"], //  THIS IS REQUIRED
        })
      );
    } catch (error) {
      console.error("❌ Error fetching news:", error);
      return [];
    }
  },

  // ------------------------------------------------------
  // NEWS COUNT
  // ------------------------------------------------------
  getNewsCount: async (): Promise<number> => {
    try {
      const result = await directusClient.request(
        aggregate("news", {
          aggregate: { count: "*" },
        })
      );

      const count = result?.[0]?.count;
      return parseInt(count ?? "0", 10);
    } catch (error) {
      console.error("❌ Error counting news:", error);
      return 0;
    }
  },

  // ------------------------------------------------------
  // CONFIG (v1)
  // ------------------------------------------------------
  // ---------- getConfig (minimal safe) ----------
  getConfig: async (): Promise<Configuration> => {
    try {
      const raw = await directusClient.request(
        readSingleton("configuration", {
          fields: CONFIG_FIELDS as any,
        })
      );

      // cast via unknown first to quiet the TypeScript conversion complaint
      const cfg = asUnknown<Partial<Configuration>>(raw);

      // normalize required properties and provide sensible defaults
      const normalized: Configuration = {
        // spread default example then overrides from raw
        ...ConfigurationDataExample,
        ...cfg,
        // ensure nav_bar_menu exists in typed shape
        nav_bar_menu: (cfg.nav_bar_menu ??
          null) as Configuration["nav_bar_menu"],
      };

      return normalized;
    } catch (err) {
      console.error("❌ Error fetching configuration:", err);
      throw err;
    }
  },

  // ---------- getConfigv2 (minimal safe) ----------

  getConfigv2: async () => {
    try {
      // ------------------------------
      // 1) CONFIG
      // ------------------------------
      const rawConfig = await directusClient.request(
        readSingleton("configuration", { fields: CONFIG_FIELDS as any })
      );
      const config = asUnknown<Configuration>(rawConfig);

      // ------------------------------
      // 2) CATEGORY PAGES
      // ------------------------------
      const rawCourse = await directusClient.request(
        readSingleton("course_category_page", { fields: PAGE_FIELDS as any })
      );
      const courseCategoryPage = asUnknown<CourseCategoryPage>(rawCourse);

      const rawTool = await directusClient.request(
        readSingleton("tool_category_page", { fields: PAGE_FIELDS as any })
      );
      const toolCategoryPage = asUnknown<ToolCategoryPage>(rawTool);

      const rawNewTool = await directusClient.request(
        readSingleton("new_tool_page", {
          fields: ["*", "hero_banner.*"] as any,
        })
      );
      const functionCategoryPage = asUnknown<FunctionCategoryPage>(rawTool);

      const rawFunction = await directusClient.request(
        readSingleton("function_category_page", {
          fields: ["*", "hero_banner.*"] as any,
        })
      );

      const newToolFormPage = asUnknown<NewToolFormPage[]>(rawNewTool);
      // console.log(newToolFormPage);

      // ------------------------------
      // 3) HERO PAGE
      // ------------------------------

      const heropageInfo = await (
        directusClient.request(
          readSingleton("home_page", {
            fields: [
              "*.*",
              "hero_text",
              "hero_image.*",
              "hero_image_mobile.*",
            ] as any,
          })
        ) as any as Promise<HeropageInfo>
      ).then((e) => {
        if (!e.faq) return e;
        let ret: FAQ[] = [];
        for (let item of e.faq) {
          try {
            let parsed = FAQ.parse(item);
            ret.push(parsed);
          } catch (err) {}
        }
        return { ...e, faq: ret };
      });

      // ------------------------------
      // 4) FINAL RETURN
      // ------------------------------
      return {
        config,
        toolCategoryPage,
        functionCategoryPage,
        heropageInfo,
        courseCategoryPage,
        newToolFormPage,
      };
    } catch (err) {
      console.error("❌ Error fetching config v2:", err);
      throw err;
    }
  },

  // ------------------------------------------------------
  // ADD NEW TOOL ENTRY
  // ------------------------------------------------------
  addNewToolEntry: async (props: NewToolData) => {
    try {
      return await directusClient.request(
        createItem("tool_request", { ...props })
      );
    } catch (error) {
      console.error("❌ Error adding new tool entry:", error);
      throw error;
    }
  },

  // ------------------------------------------------------
  // ADD NEWSLETTER SUBSCRIBER
  // ------------------------------------------------------
  addNewsletterSubscriber: async ({ email }: { email: string }) => {
    if (!isEmail(email)) {
      throw new ValidationError("A valid email id should be provided");
    }

    try {
      return await directusClient.request(
        createItem("newslettersubscriber", { email })
      );
    } catch (error) {
      console.error("❌ Error adding newsletter subscriber:", error);
      throw error;
    }
  },

  // ------------------------------------------------------
  // ADD REVIEW
  // ------------------------------------------------------
  addReview: async (props: NewReview) => {
    if (!props.product) {
      throw new ValidationError("Select a product to create review");
    }

    try {
      return await directusClient.request(
        createItem("reviews", {
          ...props,
          product: props.product, // product is now number, correct
        })
      );
    } catch (error) {
      console.error("❌ Error creating review:", error);
      throw error;
    }
  },

  // ------------------------------------------------------
  // GET USER
  // ------------------------------------------------------
  getUser: async (): Promise<User | undefined> => {
    try {
      const me = await directusClient.request(readMe());
      if (!me) return undefined;

      return {
        id: me.id,
        firstname: me.first_name ?? "",
        lastname: me.last_name ?? "",
      };
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      return undefined;
    }
  },

  // ------------------------------------------------------
  // LOGOUT
  // ------------------------------------------------------
  logout: async () => {
    try {
      return await directusClient.logout();
    } catch (error) {
      console.error("❌ Error logging out:", error);
      throw error;
    }
  },

  // ------------------------------------------------------
  // GET REVIEWS FOR A PRODUCT
  // ------------------------------------------------------
  getReviewsForProduct: async (productId: number): Promise<Review[]> => {
    try {
      const rows = await directusClient.request(
        readItems("reviews", {
          limit: 20,
          filter: {
            product: { _eq: productId }, // ✔ FIXED
            published: { _eq: true },
          },
        })
      );

      return rows
        .map((r) => {
          try {
            return Review.parse(r);
          } catch (err) {
            console.error("❌ Review parse failed:", r, err);
            return null;
          }
        })

        .filter(Boolean) as Review[];
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      return [];
    }
  },

  // ------------------------------------------------------
  // GET ALL REVIEWS
  // ------------------------------------------------------
  getAllReviews: async (
    options: Record<string, any> = {}
  ): Promise<Review[]> => {
    try {
      const rows = await directusClient.request(
        readItems("reviews", {
          limit: 20,
          ...options,
          fields: ["product.*"] as any,
        })
      );

      return rows
        .map((r: any) => {
          try {
            return Review.parse(r);
          } catch {
            return null;
          }
        })
        .filter(Boolean) as Review[];
    } catch (error) {
      console.error("❌ Error fetching all reviews:", error);
      return [];
    }
  },

  // ------------------------------------------------------
  // 404 PAGE TEXT
  // ------------------------------------------------------
  get404Text: async (): Promise<string> => {
    try {
      const res = await directusClient.request(readSingleton("_404_page"));
      return res.text ?? "";
    } catch (error) {
      console.error("❌ Error fetching 404 text:", error);
      return "";
    }
  },

  // ------------------------------------------------------
  // TERMS AND CONDITIONS
  // ------------------------------------------------------
  getTnCText: async (): Promise<string> => {
    try {
      const res = await directusClient.request(
        readSingleton("terms_and_conditions_page")
      );
      return res.text ?? "";
    } catch (error) {
      console.error("❌ Error fetching T&C text:", error);
      return "";
    }
  },

  // ------------------------------------------------------
  // PRICING PAGE
  // ------------------------------------------------------

  // getPricingPage: async () => {
  //   try {
  //     // 1. Fetch singleton: pricing_page
  //     const page = await directusClient.request(
  //       readSingleton("pricing_page", {
  //         fields: ["*", "why_list_points.*"] as any,
  //       })
  //     );

  //     // 2. Fetch pricing plans
  //     const plans = await directusClient.request(
  //       readItems("pricing_plans", {
  //         sort: "order",
  //         fields: ["*", "image.*"] as any,
  //       })
  //     );

  //     // 3. Fetch features
  //     const features = await directusClient.request(
  //       readItems("pricing_plan_features", {
  //         sort: "order",
  //         fields: ["*"] as any,
  //       })
  //     );

  //     // 4. Attach features → plan.features[]
  //     const fullPlans = plans.map((plan: any) => {
  //       const planFeatures = features.filter((f: any) => f.plan === plan.id);

  //       return {
  //         ...plan,
  //         image: plan.image?.id
  //           ? `${Constants.BASE_URL}/assets/${plan.image.id}`
  //           : null,
  //         features: planFeatures,
  //       };
  //     });

  //     return {
  //       page,
  //       plans: fullPlans,
  //     };
  //   } catch (error) {
  //     console.error("❌ Error fetching pricing page:", error);
  //     return { page: null, plans: [] };
  //   }
  // },

  getPricingPage: async () => {
    try {
      // 1. Fetch single pricing_page
      const rawPage = (await directusClient.request(
        readSingleton("pricing_page" as any, {
          fields: ["*", "why_list_points.*"] as any,
        })
      )) as any;

      // Normalize to PricingPageInfo shape
      const page: PricingPageInfo = {
        title: rawPage.title ?? "",
        meta_title: rawPage.meta_title ?? "",
        meta_description: rawPage.meta_description ?? "",
        intro_title: rawPage.intro_title ?? "",
        intro_description: rawPage.intro_description ?? "",
        why_list_title: rawPage.why_list_title ?? "",
        why_list_points: Array.isArray(rawPage.why_list_points)
          ? rawPage.why_list_points.map((p: any) => ({
              point: p.point ?? "",
            }))
          : [],
        contact_email: rawPage.contact_email ?? "",
        contact_text: rawPage.contact_text ?? "",
      };

      // 2. Fetch plans
      const rawPlans = (await directusClient.request(
        readItems("pricing_plans" as any, {
          sort: "order",
          fields: ["*"] as any,
        })
      )) as any[];

      // 3. Fetch features
      const rawFeatures = await directusClient.request(
        readItems("pricing_plan_features", {
          sort: "order",
          fields: ["*"] as any,
        })
      );

      // 4. Normalize each plan → PricingPlan
      const plans: PricingPlan[] = rawPlans.map((plan: any) => {
        const features = rawFeatures
          .filter((f: any) => f.plan === plan.id)
          .map((f: any) => ({
            id: f.id,
            text: f.text,
            order: f.order,
          }));

        return {
          id: plan.id,
          title: plan.title ?? "",
          image: plan.image
            ? `${Constants.BASE_URL}/assets/${plan.image}`
            : null,
          price_original: plan.price_original ?? null,
          price_discounted: plan.price_discounted ?? null,
          button_text: plan.button_text ?? "",
          button_url: plan.button_url ?? "",
          highlight_color: plan.highlight_color ?? "",
          is_custom: plan.is_custom ?? "",
          order: plan.order ?? 0,
          features,
        };
      });

      return {
        page, // <-- NOW matches PricingPageInfo EXACTLY
        plans, // <-- NOW matches PricingPlan[]
      };
    } catch (error) {
      console.error("❌ Error fetching Pricing Page:", error);
      return {
        page: {
          title: "",
          intro_title: "",
          intro_description: "",
          why_list_title: "",
          why_list_points: [],
          contact_email: "",
          contact_text: "",
          meta_title: "",
          meta_description: "",
        },
        plans: [],
      };
    }
  },

  // ------------------------------------------------------
  // TRUSTED BY LIST
  // ------------------------------------------------------

  getTrustedBy: async () => {
    try {
      const items = (await directusClient.request(
        readItems("trusted_by" as any, {
          sort: ["order"],
          fields: ["id", "name", "company_url", "logo.id"] as any,
        })
      )) as any[];

      return items.map((e) => ({
        id: e.id,
        name: e.name,
        company_url: e.company_url || null,
        logo: e.logo?.id ? `${Constants.BASE_URL}/assets/${e.logo.id}` : null,
      }));
    } catch (err) {
      console.error("Error fetching trusted_by:", err);
      return [];
    }
  },
  // ------------------------------------------------------
  // FUNCTION CATEGORY PAGE
  // ------------------------------------------------------
  getFunctionCategoryPageInfo: async () => {
    try {
      const row = await directusClient.request(
        readSingleton("function_category_page" as any, {
          fields: ["*", "hero_banner.*"],
        })
      );

      return row ?? null;
    } catch (error) {
      console.error("❌ Error fetching function_category_page:", error);
      return null;
    }
  },

  addSponsorshipLead: async (props: SponsorshipLead) => {
    if (!isEmail(props.email)) {
      throw new ValidationError("A valid email id should be provided");
    }

    try {
      return await directusClient.request(
        createItem("sponsorship_leads", {
          ...props,
        })
      );
    } catch (error) {
      console.error("❌ Error creating sponsorship lead:", error);
      throw error;
    }
  },
  getSponsorshipPage: async (): Promise<SponsorshipPageInfo | null> => {
    try {
      const raw = await directusClient.request(
        readSingleton("sponsorship_page" as any, {
          fields: ["*"],
        })
      );

      if (!raw) return null;

      const page: SponsorshipPageInfo = {
        title: raw.title ?? "",
        meta_title: raw.meta_title ?? "",
        meta_description: raw.meta_description ?? "",
        contact_title: raw.contact_title ?? "",
        contact_description: raw.contact_description ?? "",
        submit_button_text: raw.submit_button_text ?? "",
      };

      return page;
    } catch (error) {
      console.error("❌ Error fetching sponsorship_page:", error);
      return null;
    }
  },
};

// ------------------------------------------------------
// PARTIAL PRODUCT (lightweight product representation)
// ------------------------------------------------------
interface PartialProduct {
  id: number;
  title: string;
  slug: string;
  url: string;
  logo: FileType | null;
  logo_url: string | null;
}

// ------------------------------------------------------
// EXPORTS (Primary library API)
// ------------------------------------------------------
export {
  CMS,
  Review as ReviewZod, // Backward compatible alias
  ToolCategoryList,
  Functions,
  NewToolDataSchema,
};

// ------------------------------------------------------
// EXPORT TYPES
// ------------------------------------------------------
export type {
  Blog,
  News,
  Product,
  Configuration,
  File,
  Category,
  CategoryValue,
  GeneralPageInfo,
  FAQ,
  HeropageInfo,
  User,
  Review,
  Schema,
  NewReview,
  PartialProduct,
  PricingMode,
  NewToolData,
};

// ------------------------------------------------------
// DIRECTUS LAZY LOADER
// Ensures tree-shakable dynamic import, reduces bundle size
// ------------------------------------------------------
export async function getDirectus() {
  const {
    createDirectus,
    readItems,
    rest,
    readSingleton,
    aggregate,
    createItem,
    authentication,
    readMe,
    deleteItems,
  } = await import("@directus/sdk");

  return {
    createDirectus,
    readItems,
    rest,
    readSingleton,
    aggregate,
    createItem,
    authentication,
    readMe,
    deleteItems,
  };
}

// ------------------------------------------------------
// RE-EXPORTS
// ------------------------------------------------------
export * from "./exceptions";
export { loginWithGoogle };
export * from "./rating";
