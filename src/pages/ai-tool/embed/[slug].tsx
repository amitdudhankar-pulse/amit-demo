// import { CMS } from "@/lib/lib";
// import { Constants } from "@/contants";

// async function safeFetch<T>(promise: Promise<T>, fallback: T): Promise<T> {
//   try {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
//     const result = await promise;
//     clearTimeout(timeout);
//     return result || fallback;
//   } catch (err) {
//     console.warn("⚠️ getStaticPaths fetch failed:", err);
//     return fallback;
//   }
// }

// export const getStaticPaths = async () => {
//   const ret = { paths: [] as { params: { id: string } }[], fallback: "blocking" };

//   // 🧩 Skip heavy fetching during staging
//   if (Constants.DEPLOYMENT === "staging") return ret;

//   // ✅ Fetch only minimal tool identifiers
//   const products = await safeFetch(CMS.getAllProducts("tool", { fields: ["id"], limit: 50 }), []);

//   // ✅ Prebuild only a few for faster build
//   const paths = (products ?? [])
//     .filter((p: any) => p?.id)
//     .slice(0, 10)
//     .map((p: any) => ({
//       params: { id: p.id.toString() },
//     }));

//   console.log("> ✅ Prebuilding tool embed paths:", paths.length);
//   return { ...ret, paths };
// };

// // ✅ Highly optimized getStaticProps
// export async function getStaticProps({ params }: { params: { id: string } }) {
//   // Fetch config + product in parallel
//   const [config, product] = await Promise.all([
//     safeFetch(CMS.getConfig(), null),
//     safeFetch(CMS.getProductsFromKey("tool", Number(params.id)), null),
//   ]);

//   // Gracefully handle missing data
//   if (!product) return { notFound: true };

//   return {
//     props: { product, config },
//     revalidate: 60, // ISR refresh every 60 seconds
//   };
// }

// export default function EmbedPage({ product, config }: any) {
//   // lightweight UI (your existing component)
//   return <div>{product?.name ?? "Tool not found"}</div>;
// }

// import { CMS } from "@/lib/lib";
// import { Constants } from "@/contants";

// // -----------------------------
// // 🔒 Safe Fetch Helper
// // -----------------------------
// async function safeFetch<T>(promise: Promise<T>, fallback: T): Promise<T> {
//   try {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 8000);

//     const result = await promise;
//     clearTimeout(timeout);

//     return result ?? fallback;
//   } catch (err) {
//     console.warn("⚠️ safeFetch() failed:", err);
//     return fallback;
//   }
// }

// // -----------------------------
// // 🔥 getStaticPaths — Optimized
// // -----------------------------
// export const getStaticPaths = async () => {
//   const ret = {
//     paths: [] as { params: { id: string } }[],
//     fallback: "blocking",
//   };

//   if (Constants.DEPLOYMENT === "staging") return ret;

//   const products = await safeFetch(
//     CMS.getAllProducts("tool", {
//       // fields: ["id"],
//       fields: ["slug"],
//       limit: 30,
//     }),
//     []
//   );

//   const paths = products
//     .filter((p: any) => p?.id)
//     .slice(0, 10)
//     .map((p: any) => ({
//       // params: { id: String(p.id) },
//       params: { id: String(p.slug) },
//     }));

//   console.log(`> 🔧 Prebuilding embed paths: ${paths.length}`);

//   return { ...ret, paths };
// };

// // -----------------------------
// // 🚀 getStaticProps — Optimized
// // -----------------------------
// // export async function getStaticProps({ params }: { params: { id: string } }) {
// //   const id = Number(params.id);

// //   const [config, product] = await Promise.all([
// //     safeFetch(CMS.getConfig(), null), // full config is safe here
// //     safeFetch(CMS.getProductsFromKey("tool", id), null),
// //   ]);

// //   if (!product) return { notFound: true };

// //   return {
// //     props: { product, config },
// //     revalidate: 60,
// //   };
// // }

// export async function getStaticProps({ params }: { params: { id: string } }) {
//   const slug = params.id;

//   const [config, product] = await Promise.all([
//     safeFetch(CMS.getConfig(), null),
//     safeFetch(CMS.getProductsFromSlug("tool", slug), null),
//   ]);

//   if (!product) return { notFound: true };

//   return {
//     props: { product, config },
//     revalidate: 60,
//   };
// }

// // -----------------------------
// // 🤏 Light & Fast Embed Component
// // -----------------------------
// export default function EmbedPage({ product }: any) {
//   return (
//     <div
//       style={{
//         padding: "6px 10px",
//         fontSize: "15px",
//         fontFamily: "sans-serif",
//       }}
//     >
//       {product?.name ?? "Tool not found"}
//     </div>
//   );
// }

import { CMS } from "@/lib/lib";
import { Constants } from "@/contants";
import Image from "next/image";

// -----------------------------
// Safe Fetch
// -----------------------------
async function safeFetch<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return (await promise) ?? fallback;
  } catch (err) {
    console.warn("⚠️ safeFetch failed:", err);
    return fallback;
  }
}

// -----------------------------
// getStaticPaths
// -----------------------------
export const getStaticPaths = async () => {
  const ret = {
    paths: [] as { params: { slug: string } }[],
    fallback: "blocking",
  };

  if (Constants.DEPLOYMENT === "staging") return ret;

  const products = await safeFetch(
    CMS.getAllProducts("tool", {
      fields: ["slug"],
      limit: 30,
      slim: true,
    }),
    []
  );

  const paths = products
    .filter((p: any) => p?.slug)
    .slice(0, 10)
    .map((p: any) => ({
      params: { slug: p.slug },
    }));

  return { ...ret, paths };
};

// -----------------------------
// getStaticProps
// -----------------------------
export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const [config, product] = await Promise.all([
    safeFetch(CMS.getConfig(), null),
    safeFetch(CMS.getProductsFromSlug("tool", slug), null),
  ]);

  if (!product) {
    console.warn("❌ Embed product not found for slug:", slug);
    return { notFound: true };
  }

  return {
    props: { product, config },
    revalidate: 60,
  };
}

// -----------------------------
// Embed UI (lightweight)
// -----------------------------
// export default function EmbedPage({ product }: any) {
//   return (
//     <div
//       style={{
//         padding: "6px 10px",
//         fontSize: "14px",
//         fontFamily: "system-ui, sans-serif",
//         whiteSpace: "nowrap",
//       }}
//     >
//       ⭐ {product.title} · {product.review_count ?? 0} reviews
//     </div>
//   );
// }

export default function EmbedPage({ product }: any) {
  const rating = Math.round(Number(product.overall_satisfaction ?? 0));
  const reviews = Number(product.review_count ?? 0);

  // return (
  //   <div className="h-[130px]">
  //     <a
  //       href={product.url}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="no-underline"
  //     >
  //       <div className="flex items-center gap-4 px-4 py-3 bg-transparent rounded-xl shadow-md font-sans w-[520px] h-[110px]">
  //         {/* LEFT LOGO */}
  //         <img
  //           src={"https://groupify.ai/logo_small.svg"}
  //           alt="Groupify AI"
  //           className="w-[52px] h-[52px] object-contain"
  //         />

  //         {/* CENTER CONTENT */}
  //         <div className="flex flex-col flex-1 leading-tight">
  //           <span className="text-sm font-medium text-gray-700">
  //             Featured on GroupifyAI
  //           </span>

  //           <span className="text-2xl font-extrabold text-black">
  //             {product.title}
  //           </span>

  //           <div className="flex items-center gap-2 mt-1">
  //             <span className="text-[#F5B301] text-lg leading-none">
  //               {"★".repeat(rating)}
  //               {"☆".repeat(5 - rating)}
  //             </span>

  //             <span className="text-sm font-semibold text-gray-900">
  //               ({reviews})
  //             </span>
  //           </div>
  //         </div>

  //         {/* RIGHT ICON */}
  //         <div className="bg-[#5FB3B3] rounded-lg p-2 flex items-center justify-center">
  //           <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
  //             <path d="M6 2C4.9 2 4 2.9 4 4v18l8-4 8 4V4c0-1.1-.9-2-2-2H6z" />
  //           </svg>
  //         </div>
  //       </div>
  //     </a>
  //   </div>
  // );
  return (
    <div className="min-h-[140px]">
      {" "}
      {/* just a minimum, not forced */}
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline block"
      >
        <div className="flex items-center gap-4 px-4 py-4 bg-transparent rounded-xl shadow-md font-sans w-[520px]">
          {/* LEFT LOGO */}
            <Image
              src="https://groupify.ai/logo_small.svg"
              alt="Groupify AI"
              width={52}
              height={52}
              className="object-contain"
              priority={false}
            />

          {/* CENTER CONTENT */}
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium text-gray-700">
              Featured on GroupifyAI
            </span>

            <span className="text-2xl font-extrabold text-black leading-tight">
              {product.title}
            </span>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#F5B301] text-lg leading-none">
                {"★".repeat(rating)}
                {"☆".repeat(5 - rating)}
              </span>

              <span className="text-sm font-semibold text-gray-900">
                ({reviews})
              </span>
            </div>
          </div>

          {/* RIGHT ICON */}
          <div className="bg-[#5FB3B3] rounded-lg p-2 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M6 2C4.9 2 4 2.9 4 4v18l8-4 8 4V4c0-1.1-.9-2-2-2H6z" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}
