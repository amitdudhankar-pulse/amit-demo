// import type { NextApiRequest, NextApiResponse } from "next";
// import { CMS } from "@/lib/lib";

// const PER_PAGE_LIMIT = 12;

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const { type = "tool", price = "", page = 1 } = req.query;

//     const offset = (Number(page) - 1) * PER_PAGE_LIMIT;
//     const filter: any = {};

//     if (price) filter.pricing_mode = price;

//     const [total, tools] = await Promise.all([
//       CMS.getProductCount(type as any, { filter }),
//       CMS.getAllProducts(type as any, {
//         offset,
//         limit: PER_PAGE_LIMIT,
//         filter,
//         sort: ["order", "-date_created", "-id"],
//       }),
//     ]);

//     res.status(200).json({
//       total: Math.ceil(total / PER_PAGE_LIMIT),
//       tools,
//     });
//   } catch (err) {
//     console.error("API Error →", err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// }

// import type { NextApiRequest, NextApiResponse } from "next";
// import { CMS } from "@/lib/lib";

// const PER_PAGE_LIMIT = 12;

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const {
//       type = "tool",
//       price = "",
//       page = 1,

//       // ⭐ NEW FILTERS (coming from frontend tool filter)
//       featured,
//       editor_choice,
//       verified,
//       popular,
//     } = req.query;

//     const offset = (Number(page) - 1) * PER_PAGE_LIMIT;

//     // BUILD FILTER OBJECT
//     const filter: any = {};

//     // PRICE FILTER
//     if (price) {
//       filter.pricing_mode = { _eq: price };
//     }

//     // ⭐ BOOLEAN FILTERS FOR CURATION
//     if (featured === "true") {
//       filter.featured = { _eq: true };
//     }

//     if (editor_choice === "true") {
//       filter.editor_choice = { _eq: true };
//     }

//     if (verified === "true") {
//       filter.verified = { _eq: true };
//     }

//     if (popular === "true") {
//       filter.popular = { _eq: true };
//     }

//     // FETCH DATA
//     const [totalCount, tools] = await Promise.all([
//       CMS.getProductCount(type as any, { filter }),
//       CMS.getAllProducts(type as any, {
//         offset,
//         limit: PER_PAGE_LIMIT,
//         filter,
//         sort: ["order", "-date_created", "-id"],
//       }),
//     ]);

//     // Total pages
//     const totalPages = Math.ceil(totalCount / PER_PAGE_LIMIT);

//     res.status(200).json({
//       total: totalPages,
//       tools,
//     });
//   } catch (err) {
//     console.error("API Error →", err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// }

// import type { NextApiRequest, NextApiResponse } from "next";
// import { CMS } from "@/lib/lib";

// const PER_PAGE_LIMIT = 12;

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const {
//       type = "tool",
//       price = "",
//       page = 1,

//       featured,
//       editor_choice,
//       verified,
//       popular,
//     } = req.query;

//     const offset = (Number(page) - 1) * PER_PAGE_LIMIT;
//     const filter: any = {};

//     // PRICE FILTER ONLY FOR TOOLS
//     if (type === "tool" && price) {
//       filter.pricing_mode = { _eq: price };
//     }

//     // ⭐ APPLY CURATION FILTERS FOR BOTH TOOLS & COURSES
//     if (featured === "true") filter.featured = { _eq: true };
//     if (editor_choice === "true") filter.editor_choice = { _eq: true };
//     if (verified === "true") filter.verified = { _eq: true };
//     if (popular === "true") filter.popular = { _eq: true };

//     // "ALL" SHOULD SHOW EVERYTHING
//     if (type === "all") {
//       delete filter.pricing_mode;
//       delete filter.featured;
//       delete filter.editor_choice;
//       delete filter.verified;
//       delete filter.popular;
//     }

//     const [totalCount, tools] = await Promise.all([
//       CMS.getProductCount(type as any, { filter }),
//       CMS.getAllProducts(type as any, {
//         offset,
//         limit: PER_PAGE_LIMIT,
//         filter,
//         sort: ["order", "-date_created", "-id"],
//       }),
//     ]);

//     const totalPages = Math.ceil(totalCount / PER_PAGE_LIMIT);

//     return res.status(200).json({
//       page: Number(page),
//       total: totalPages,
//       tools,
//     });
//   } catch (err) {
//     console.error("API Error →", err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import { CMS } from "@/lib/lib";

const PER_PAGE_LIMIT = 12;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      type = "tool",
      pricing_mode, // ✅ FIX 1
      page = 1,

      featured,
      editor_choice,
      verified,
      popular,
    } = req.query;

    const offset = (Number(page) - 1) * PER_PAGE_LIMIT;

    const filter: any = {};

    // ✅ PRICE FILTER (TOOLS + COURSES + ALL)
    if (pricing_mode) {
      const modes = String(pricing_mode).split(",");

      filter.pricing_mode = {
        _in: modes, // ✅ FIX 2 (OR inside price group)
      };
    }

    // ✅ CURATION FILTERS (AND with price)
    if (featured === "true") filter.featured = { _eq: true };
    if (editor_choice === "true") filter.editor_choice = { _eq: true };
    if (verified === "true") filter.verified = { _eq: true };
    if (popular === "true") filter.popular = { _eq: true };

    // ✅ TYPE HANDLING
    // CMS already understands:
    // - "tool"
    // - "course"
    // - "all"
    // ❌ DO NOT delete filters for "all"

    const [totalCount, tools] = await Promise.all([
      CMS.getProductCount(type as any, { filter }),
      CMS.getAllProducts(type as any, {
        offset,
        limit: PER_PAGE_LIMIT,
        filter,
        sort: ["order", "-date_created", "-id"],
      }),
    ]);

    res.status(200).json({
      page: Number(page),
      total: Math.ceil(totalCount / PER_PAGE_LIMIT),
      tools,
    });
  } catch (err) {
    console.error("API Error →", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
