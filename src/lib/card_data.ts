import type { Blog, CategoryV2, Product } from "@/lib/lib";

// Card-sized views of CMS records.
// Pages that only render cards should pass these to the client instead of the
// full records: everything returned from getStaticProps is embedded in the
// HTML (__NEXT_DATA__) and parsed by the browser before hydration.

const TOOL_CARD_FIELDS = [
  // Rendered by ToolCard
  "id",
  "title",
  "slug",
  "url",
  "logo",
  "logo_url",
  "verified",
  "overall_satisfaction",
  "pricing_mode",
  "short_description",
  "visible_tags",
  // Read by ToolFilterList
  "course",
  "editor_choice",
  "featured",
  "popular",
] as const;

const CATEGORY_CARD_FIELDS = ["title", "slug", "logo", "products_count"] as const;

const BLOG_CARD_FIELDS = [
  "id",
  "slug",
  "title",
  "description",
  "read_minutes",
  "image",
] as const;

type ToolCardData = Pick<Product, (typeof TOOL_CARD_FIELDS)[number]>;
type CategoryCardData = Pick<CategoryV2, (typeof CATEGORY_CARD_FIELDS)[number]>;
type BlogCardData = Pick<Blog, (typeof BLOG_CARD_FIELDS)[number]>;

function pick<T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    // getStaticProps cannot serialize `undefined`, so absent fields stay absent
    if (source[key] !== undefined) result[key] = source[key];
  }
  return result;
}

const toToolCard = (product: Product): ToolCardData =>
  pick(product, TOOL_CARD_FIELDS);

const toCategoryCard = (category: CategoryV2): CategoryCardData =>
  pick(category, CATEGORY_CARD_FIELDS);

const toBlogCard = (blog: Blog): BlogCardData => pick(blog, BLOG_CARD_FIELDS);

export { toToolCard, toCategoryCard, toBlogCard };
export type { ToolCardData, CategoryCardData, BlogCardData };
