import { Paths } from "@/contants";
import { CMS } from "@/lib/lib";
import { MY_CMS_SECRET, RequestBody } from "./common";

// ----------------- Helper Functions -----------------

async function revalidateProduct(productId: string | number, res: any) {
  const [product] = await CMS.getAllProducts("all", { filter: { id: { _eq: productId } } });
  if (!product) return;

  const path = (product.course ? Paths.Frontend.AI_COURSES.path : Paths.Frontend.AI_TOOL.path) + "/" + product.slug;
  await res.revalidate(path);
}

async function revalidateBlog(blogId: string | number, type: "direct" | "normal", res: any) {
  const f = type === "direct"
    ? await CMS.getDirectBlogFromKey(Number(blogId))
    : await CMS.getBlogFromKey(Number(blogId));
  if (!f) return;

  const path = type === "direct"
    ? `${Paths.Frontend.HOME.path}/${f.slug}`
    : `${Paths.Frontend.BLOG.path}/${f.slug}`;
  await res.revalidate(path);
}

// ----------------- Event Handlers -----------------

async function handleDeleteEvent(data: any, res: any) {
  // Currently ignored
}

async function handleCreateEvent(data: Extract<RequestBody, { event: "items.create" }>, res: any) {
  switch (data.collection) {
    case "products":
      await revalidateProduct(data.key, res);
      break;
    case "direct_blogs":
      await revalidateBlog(data.key, "direct", res);
      break;
    case "blogs":
      await revalidateBlog(data.key, "normal", res);
      break;
    default:
      throw { status: 500, message: `Collection ${data.collection} not supported` };
  }

  await res.revalidate(`/`);
}

async function handleUpdateEvent(data: Extract<RequestBody, { event: "items.update" }>, res: any) {
  switch (data.collection) {
    case "products":
      await Promise.all(data.keys.map((id) => revalidateProduct(id, res)));
      break;
    case "blogs":
      await Promise.all(data.keys.map((id) => revalidateBlog(id, "normal", res)));
      break;
    default:
      throw { status: 500, message: `Collection ${data.collection} not supported` };
  }

  await res.revalidate(`/`);
}

// ----------------- Main Handler -----------------

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") throw { status: 405, message: "Method not allowed" };
    if (req.headers["x-directus-secret"] !== MY_CMS_SECRET) throw { status: 401, message: "Invalid token" };

    const data: RequestBody = req.body;

    try {
      switch (data.event) {
        case "items.create":
          await handleCreateEvent(data as any, res);
          break;
        case "items.update":
          await handleUpdateEvent(data as any, res);
          break;
        case "items.delete":
          await handleDeleteEvent(data as any, res);
          break;
        default:
          throw { status: 500, message: "Event not supported" };
      }

      return res.json({ revalidated: true });
    } catch (err: any) {
      throw {
        status: 500,
        message: `Error revalidating - ${JSON.stringify(err, null, 4)}`,
      };
    }
  } catch (err: any) {
    console.error("E> inside revalidate: ", JSON.stringify(err, null, 4));
    return res.status(err.status || 500).json({ message: err.message || "Internal server error" });
  }
}
