// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CMS } from "@/lib/lib";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const searchQuery = (req.query.search_query as string) ?? "";

    // ✅ Early exit for empty query (faster response)
    if (!searchQuery.trim()) {
      return res.status(200).json({ name: [] });
    }

    // ✅ Await directly (no .then()) and map efficiently
    const products = await CMS.searchProduct(searchQuery, {
      tagSearch: true,
      titleSearch: true,
      descriptionSearch: true,
    });

    // ✅ Transform results
    const output = products.map((p) => [p.title, p.slug]);

    res.status(200).json({ name: output });
  } catch (error) {
    console.error("❌ Search API error:", error);
    res.status(500).json({ name: [], error: "Internal server error" });
  }
}
