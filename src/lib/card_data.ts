import type { Blog, CategoryV2, Product } from "@/lib/lib";
import { Constants } from "@/contants";

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

type ToolCardData = Pick<Product, (typeof TOOL_CARD_FIELDS)[number]> & {
  // The logo file can be served resized by Directus (see findResizableLogos)
  logo_resizable?: boolean;
};
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

const toToolCard = (
  product: Product,
  resizableLogos?: Set<string>
): ToolCardData => {
  const card: ToolCardData = pick(product, TOOL_CARD_FIELDS);
  if (product.logo?.id && resizableLogos?.has(product.logo.id)) {
    card.logo_resizable = true;
  }
  return card;
};

// Some logos in the CMS are SVG files stored as .webp and served as
// image/webp. Browsers refuse to show them (the card falls back), but
// Directus' resizer reads them fine, so resizing would suddenly show a
// different picture. Only still PNG/JPEG/WebP files are resized; everything
// else (SVG, GIF, animated, forbidden files) keeps the original URL.
const isStillRasterImage = (bytes: Uint8Array) => {
  const text = (from: number, to: number) =>
    String.fromCharCode(...Array.from(bytes.subarray(from, to)));
  const isPng = text(1, 4) === "PNG";
  const isAnimatedPng = isPng && text(0, bytes.length).includes("acTL");
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isWebp = text(0, 4) === "RIFF" && text(8, 12) === "WEBP";
  // VP8X header, flags byte: 0x02 = animation
  const isAnimatedWebp = isWebp && text(12, 16) === "VP8X" && (bytes[20] & 0x02) !== 0;
  return (isPng && !isAnimatedPng) || isJpeg || (isWebp && !isAnimatedWebp);
};

// A file's content does not change under the same id, so results are kept
// for the life of the server process.
const resizableLogoCache = new Map<string, boolean>();

async function isResizableAsset(fileId: string): Promise<boolean> {
  const cached = resizableLogoCache.get(fileId);
  if (cached !== undefined) return cached;
  try {
    const response = await fetch(`${Constants.BASE_ASSET_URL}/${fileId}`, {
      headers: { Range: "bytes=0-63" },
    });
    const resizable =
      response.ok &&
      isStillRasterImage(new Uint8Array(await response.arrayBuffer()));
    resizableLogoCache.set(fileId, resizable);
    return resizable;
  } catch {
    // Network error: use the original this time, check again next build
    return false;
  }
}

async function findResizableLogos(products: Product[]): Promise<Set<string>> {
  const ids = Array.from(
    new Set(
      products
        .map((product) => product.logo?.id)
        .filter((id): id is string => !!id)
    )
  );
  const results = await Promise.all(
    ids.map(async (id) => [id, await isResizableAsset(id)] as const)
  );
  return new Set(results.filter(([, resizable]) => resizable).map(([id]) => id));
}

const toCategoryCard = (category: CategoryV2): CategoryCardData =>
  pick(category, CATEGORY_CARD_FIELDS);

const toBlogCard = (blog: Blog): BlogCardData => pick(blog, BLOG_CARD_FIELDS);

export { toToolCard, toCategoryCard, toBlogCard, findResizableLogos };
export type { ToolCardData, CategoryCardData, BlogCardData };
