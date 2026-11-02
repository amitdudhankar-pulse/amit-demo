// import {
//   convertToEmbedLink,
//   parseAMW as defaultParse,
// } from "@/ui/components/utils/utils";
// import {
//   TabGroup,
//   Section,
//   ToolListing,
//   Button,
//   Rating as RatingUI,
//   Image,
//   Breadcrumb,
//   ProductPageText as Text,
//   ClickToOpenDialog,
//   HorizontalScroller,
//   ReviewCard,
//   FAQs,
//   FAQItem,
//   SMIcons,
//   NextSeo,
// } from "@/ui/components/components";
// import { Constants, getAssetPathFromID, Paths } from "@/contants";
// import { Layout } from "@/ui/layouts/layouts";
// import { CMS, Configuration, Product, Review, Rating } from "@/lib/lib";
// import { twMerge } from "tailwind-merge";
// import { ComparisonControls, StatefulBuilder } from "@/ui/logic/logic";
// import copy from "copy-to-clipboard";
// import dynamic from "next/dynamic";
// import NextImage from "next/image";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { SafeImage } from "../components/SafeImage";

// const parseAMW = (text: string) =>
//   defaultParse(text, {
//     p: Text.P,
//     li: Text.LI,
//   });

// type PageProps = {
//   product: Product;
//   config: Configuration;
//   alternateProductList: Product[];
//   featuredProductList: Product[];
//   reviews: Review[];
//   disableEmbedSection: boolean;
//   disableClaimButton: boolean;
// };

// // Lazy load iframe (huge GTmetrix win)
// const LiteYouTube = dynamic(
//   () => import("@/ui/components/lite-youtube"), // You must create or already have a lightweight component
//   { ssr: false, loading: () => null }
// );

// function parseVisibleTags(input: unknown): string[] {
//   try {
//     // Already an array
//     if (Array.isArray(input)) {
//       return input.map((t) => String(t).trim());
//     }

//     // Stringified JSON
//     if (typeof input === "string") {
//       const parsed = JSON.parse(input);
//       if (Array.isArray(parsed)) {
//         return parsed.map((t) => String(t).trim());
//       }
//     }

//     return [];
//   } catch {
//     return [];
//   }
// }

// export const ToolShowcase = React.memo(
//   (props: {
//     data: Product;
//     className: string;
//     disableClaimButton: boolean;
//   }) => {
//     console.log("🧰 TOOL SHOWCASE → Product ID:", props.data.id);
//     console.log(
//       "🧰 TOOL SHOWCASE → Has YouTube video:",
//       !!props.data.youtube_url
//     );

//     const largeImageClasses = "rounded-2xl aspect-video w-full overflow-auto";

//     const showVideo = !!props.data.youtube_url;

//     // Memoize the conversion → avoids recalculation
//     const embedLink = useMemo(
//       () => convertToEmbedLink(props.data.youtube_url ?? ""),
//       [props.data.youtube_url]
//     );

//     // Memoize image path
//     // const imageSrc = useMemo(
//     //   () => getAssetPathFromID(props.data.large_image?.id) ?? "",
//     //   [props.data.large_image?.id]
//     // );
//     const imageSrc = useMemo(
//       () =>
//         getAssetPathFromID(props.data.large_image?.id) ?? Paths.IMAGE.FALLBACK,
//       [props.data.large_image?.id]
//     );

//     const [safeImageSrc, setSafeImageSrc] = useState<string | null>(null);
//     const [isClient, setIsClient] = useState(false);

//     useEffect(() => {
//       setIsClient(true);
//       setSafeImageSrc(imageSrc);
//     }, [imageSrc]);

//     // Use imageSrc directly on server, safeImageSrc on client
//     const displayImageSrc = isClient ? (safeImageSrc ?? imageSrc) : imageSrc;

//     return (
//       <div className={twMerge("flex flex-col gap-1.5 w-full", props.className)}>
//         {!props.disableClaimButton && (
//           <Button.Text
//             text="Is this tool maintained by you? Click to claim it"
//             className="font-normal text-base text-left hover:underline"
//             action={{
//               type: "url",
//               url: Paths.Frontend.NEW_TOOL_FORM.href,
//               underline: true,
//             }}
//           />
//         )}

//         {/* IMAGE */}
//         {!showVideo && (
//           // <NextImage
//           //   className={twMerge(
//           //     largeImageClasses,
//           //     "object-contain outline outline-1 outline-boundary-light bg-bg-primary"
//           //   )}
//           //   src={imageSrc}
//           //   alt={props.data.large_image?.title ?? ""}
//           //   width={1920}
//           //   height={1080}
//           //   loading="lazy"
//           //   quality={70}
//           //   unoptimized={imageSrc === Paths.IMAGE.FALLBACK}
//           // />
//           <NextImage
//             className={twMerge(
//               largeImageClasses,
//               "object-contain outline outline-1 outline-boundary-light bg-bg-primary"
//             )}
//             src={displayImageSrc}
//             alt={props.data.large_image?.title ?? ""}
//             width={1920}
//             height={1080}
//             loading="lazy"
//             quality={70}
//             unoptimized={displayImageSrc === Paths.IMAGE.FALLBACK}
//             suppressHydrationWarning
//             onError={() => {
//               if (displayImageSrc !== Paths.IMAGE.FALLBACK) {
//                 setSafeImageSrc(Paths.IMAGE.FALLBACK);
//               }
//             }}
//           />
//         )}

//         {/* LAZY LOADED YOUTUBE (no design change, but faster) */}
//         {showVideo && embedLink && (
//           <LiteYouTube
//             videoUrl={embedLink}
//             className={twMerge(
//               "outline outline-1 outline-boundary-light bg-bg-primary",
//               largeImageClasses
//             )}
//           />
//         )}
//       </div>
//     );
//   }
// );
// ToolShowcase.displayName = "ToolShowcase";

// const Hero = React.memo(
//   ({
//     data,
//     disableClaimButton,
//   }: {
//     data: Product;
//     disableClaimButton: boolean;
//   }) => {
//     // Memo: Prevent recalculation
//     // const logoSource = useMemo(
//     //   () => getAssetPathFromID(data.logo?.id) ?? data.logo_url ?? "",
//     //   [data.logo?.id, data.logo_url]
//     // );
//     const logoSource = useMemo(
//       () =>
//         getAssetPathFromID(data.logo?.id) ??
//         data.logo_url ??
//         Paths.IMAGE.FALLBACK,
//       [data.logo?.id, data.logo_url]
//     );

//     const logoAltText = useMemo(
//       () => data.logo?.title ?? data.title,
//       [data.logo?.title, data.title]
//     );

//     const ratingValue = useMemo(
//       () => data.overall_satisfaction ?? 0,
//       [data.overall_satisfaction]
//     );

//     const reviewCount = useMemo(
//       () => data.review_count ?? 0,
//       [data.review_count]
//     );

//     const socialLinks = useMemo(
//       () => [
//         data.instagram ?? "",
//         data.facebook ?? "",
//         data.linkedin ?? "",
//         data.tiktok ?? "",
//         data.x ?? "",
//       ],
//       [data.instagram, data.facebook, data.linkedin, data.tiktok, data.x]
//     );

//     const visibleTags = useMemo(
//       () => data.visible_tags ?? [],
//       [data.visible_tags]
//     );

//     const hasCoupon = useMemo(() => !!data.coupon_code, [data.coupon_code]);

//     console.log("⭐ HERO → Rating value:", ratingValue);
//     console.log("⭐ HERO → Review count:", reviewCount);

//     const parsedVisibleTags = useMemo(
//       () => parseVisibleTags(data.visible_tags),
//       [data.visible_tags]
//     );

//     return (
//       <div className="justify-start items-start gap-8 flex w-full">
//         {/* LEFT SIDE */}
//         <div className="flex flex-col justify-start items-start gap-4 max-w-full xl:max-w-[45%]">
//           {/* LOGO + NAME + RATING */}
//           <div className="flex justify-between w-full items-center">
//             <div className="justify-start items-center align-top gap-6 flex">
//               <div className="relative w-fit h-fit">
//                 <SafeImage
//                   src={logoSource}
//                   alt={logoAltText}
//                   width={112}
//                   height={112}
//                   className="w-28 aspect-square rounded-md object-contain outline outline-1 outline-boundary-light bg-bg-primary"
//                 />

//                 {data.verified && (
//                   <NextImage
//                     src={Paths.ICONS.VERIFIED}
//                     alt="Verified"
//                     width={24}
//                     height={24}
//                     className="absolute -top-2 -right-2 size-6 inline-flex"
//                   />
//                 )}
//               </div>

//               <div className="flex flex-col gap-1.5">
//                 <Text.H1 className="font-bold">{data.title}</Text.H1>

//                 <div className="flex gap-2">
//                   <RatingUI rating={ratingValue} />
//                   <span className="text-app-primary">
//                     ({reviewCount} reviews)
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* SHARE + BOOKMARK */}
//             <div className="flex flex-col gap-3">
//               <Button.Share url={data.url} />
//               <Button.Bookmark productId={data.id} />
//             </div>
//           </div>

//           {/* MOBILE TOOL SHOWCASE */}
//           <ToolShowcase
//             className="xl:hidden flex"
//             data={data}
//             disableClaimButton={disableClaimButton}
//           />

//           {/* DESCRIPTION */}
//           <Text.P>{data.short_description}</Text.P>

//           {/* SOCIAL ICONS */}
//           <div className="justify-start items-center gap-4 inline-flex">
//             <SMIcons urlList={socialLinks} />
//           </div>

//           {/* TAGS */}
//           <div>
//             <div className="justify-start items-start gap-1 inline-flex flex-wrap">
//               <span className="font-semibold">Key AI Functions:</span>

//              {/* <span className="text-tertiary text-base font-normal font-roboto leading-normal">
//                 {String(parsedVisibleTags)
//                   .replace(/[\[\]"]/g, "")
//                   .replace(/,/g, ", ") // ✅ add space after comma
//                   .trim()}
//               </span> */}

//               <p
//                 style={{
//                   fontWeight: 'normal',
//                   fontSize: '18px',
//                   fontFamily: 'Roboto, sans-serif',
//                   lineHeight: '1.9',
//                   color: '#2563EB',
//                   margin: 0
//                 }}
//               >
//                 {String(parsedVisibleTags)
//                   .replace(/<[^>]*>/g, '')     // 🔥 removes all HTML tags like <p>
//                   .replace(/^\[|\]$/g, '')     // remove [ ]
//                   .replace(/"/g, '')           // remove quotes
//                   .trim()}
//               </p>
//             </div>
//           </div>

//           {/* CTAs */}
//           <div className="justify-start items-start gap-6 flex flex-wrap">
//             <ComparisonControls>
//               {({ addProduct }) => (
//                 <Button.PrimaryBoundary
//                   text="Start Comparing"
//                   action={{
//                     type: "callback",
//                     onClick: () => Promise.resolve(addProduct(data)),
//                   }}
//                 />
//               )}
//             </ComparisonControls>

//             <Button.Primary
//               text="Visit"
//               action={{ type: "url", url: data.tool_url ?? "" }}
//             />
//           </div>

//           {/* COUPON */}
//           {/* {hasCoupon && (
//             <div className="md:w-fit w-full rounded-md p-2.5 px-5 outline outline-1 outline-boundary-light text-center bg-slate-400/40">
//               <Text.H3>Click for Exclusive Discounts</Text.H3>
//             </div>
//           )} */}
//           {hasCoupon && data.coupon_code && (
//             <Button.PrimaryBoundary
//               text="Click for Exclusive Discounts"
//               action={{
//                 type: "url",
//                 url: data.coupon_code,
//               }}
//               className="md:w-fit w-full"
//             />
//           )}
//         </div>

//         {/* DESKTOP TOOL SHOWCASE */}
//         <ToolShowcase
//           className="xl:flex hidden"
//           data={data}
//           disableClaimButton={disableClaimButton}
//         />
//       </div>
//     );
//   }
// );
// Hero.displayName = "Hero";

// const ReviewSectionBody = React.memo(
//   (props: { className?: string; reviewList: Review[]; product: Product }) => {
//     console.log("📝 REVIEW SECTION → Full review list:", props.reviewList);
//     console.log("📝 REVIEW SECTION → Review count:", props.reviewList.length);

//     console.log("📝 REVIEW SECTION → Product rating snapshot:", {
//       overall_satisfaction: props.product.overall_satisfaction,
//       review_count: props.product.review_count,
//       ease_of_use: props.product.ease_of_use,
//       ease_of_customization: props.product.ease_of_customization,
//       intuitive_interface: props.product.intuitive_interface,
//       value_for_money: props.product.value_for_money,
//       support_team_responsiveness: props.product.support_team_responsiveness,
//     });

//     // Memoized slice logic → no recalculation on every render
//     const { sliceAt, topReviewList, horizontalReviewList } = useMemo(() => {
//       const s = props.reviewList.length > 10 ? 6 : 10;

//       console.log("✂️ REVIEW SLICE → sliceAt:", s);
//       console.log(
//         "✂️ REVIEW SLICE → Top reviews:",
//         props.reviewList.slice(0, s)
//       );
//       console.log(
//         "✂️ REVIEW SLICE → Horizontal reviews:",
//         props.reviewList.slice(s)
//       );
//       return {
//         sliceAt: s,
//         topReviewList: props.reviewList.slice(0, s),
//         horizontalReviewList: props.reviewList.slice(s),
//       };
//     }, [props.reviewList]);

//     // Memoized rating rows
//     // const ratingRows = useMemo(
//     //   () => [
//     //     ["Ease of Use", props.product.ease_of_use ?? 0],
//     //     ["Ease of Customization", props.product.ease_of_customization ?? 0],
//     //     ["Intuitive Interface", props.product.intuitive_interface ?? 0],
//     //     ["Value for Money ", props.product.value_for_money ?? 0],
//     //     [
//     //       "Support Team Responsiveness ",
//     //       props.product.support_team_responsiveness ?? 0,
//     //     ],
//     //   ],
//     //   [
//     //     props.product.ease_of_use,
//     //     props.product.ease_of_customization,
//     //     props.product.intuitive_interface,
//     //     props.product.value_for_money,
//     //     props.product.support_team_responsiveness,
//     //   ]
//     // );

//     const ratingRows = useMemo(() => {
//       const rows = [
//         ["Ease of Use", props.product.ease_of_use ?? 0],
//         ["Ease of Customization", props.product.ease_of_customization ?? 0],
//         ["Intuitive Interface", props.product.intuitive_interface ?? 0],
//         ["Value for Money", props.product.value_for_money ?? 0],
//         [
//           "Support Team Responsiveness",
//           props.product.support_team_responsiveness ?? 0,
//         ],
//       ];

//       console.log("📊 RATING ROWS →", rows);
//       return rows;
//     }, [
//       props.product.ease_of_use,
//       props.product.ease_of_customization,
//       props.product.intuitive_interface,
//       props.product.value_for_money,
//       props.product.support_team_responsiveness,
//     ]);

//     // Memoized left & right columns for 2-column top reviews
//     const leftColumn = useMemo(
//       () =>
//         topReviewList
//           .filter((_, i) => i % 2 === 0)
//           .map((e, i) => {
//             console.log("⬅️ LEFT COLUMN REVIEW:", e);
//             return (
//               <ReviewCard key={i} data={e} className="h-fit text-primary" />
//             );
//           }),
//       [topReviewList]
//     );

//     const rightColumn = useMemo(
//       () =>
//         topReviewList
//           .filter((_, i) => i % 2 !== 0)
//           .map((e, i) => {
//             console.log("➡️ RIGHT COLUMN REVIEW:", e);
//             return (
//               <ReviewCard key={i} data={e} className="h-fit text-primary" />
//             );
//           }),
//       [topReviewList]
//     );

//     return (
//       <div
//         className={twMerge(
//           "flex flex-row flex-wrap gap-6 w-full justify-start",
//           props.className
//         )}
//       >
//         {/* LEFT SUMMARY BOX */}
//         <div className="flex flex-col gap-3">
//           <div className="flex flex-col gap-1">
//             <Text.P className="font-semibold">
//               <span className="text-4.5xl">
//                 {props.product.overall_satisfaction ?? 0}
//               </span>{" "}
//               / 5
//             </Text.P>

//             <Text.Indicative>
//               from {props.product.review_count ?? 0} reviews
//             </Text.Indicative>

//             <div className="self-stretch h-px border border-white/70"></div>
//           </div>

//           {/* RATING FIELDS */}
//           <div className="grid grid-cols-1 w-fit gap-1">
//             {ratingRows.map(([label, value], index) => (
//               <div
//                 className="flex gap-3 items-center whitespace-nowrap"
//                 key={index}
//               >
//                 <Text.P>{label}</Text.P>
//                 <RatingUI rating={value as number} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* TWO COLUMN REVIEW LIST */}
//         <div
//           className={twMerge(
//             "flex w-full flex-col gap-4",
//             "md:flex-row md:items-start md:justify-center"
//           )}
//         >
//           <div className="flex flex-col w-full md:max-w-5/10 justify-center gap-4 px-5">
//             {leftColumn}
//           </div>

//           <div className="flex flex-col w-full md:max-w-5/10 justify-center gap-4 px-5">
//             {rightColumn}
//           </div>
//         </div>

//         {/* HORIZONTAL SCROLLER */}
//         {horizontalReviewList.length > 0 && (
//           <div className="px-5 w-full">
//             <HorizontalScroller
//               dataList={horizontalReviewList}
//               builder={(e, _, className) => {
//                 console.log("➡️➡️ HORIZONTAL REVIEW:", e);
//                 return (
//                   <ReviewCard
//                     key={e.id}
//                     data={e}
//                     className={twMerge("h-full", className)}
//                   />
//                 );
//               }}
//             />
//           </div>
//         )}
//       </div>
//     );
//   }
// );
// ReviewSectionBody.displayName = "ReviewSectionBody";

// const ProductBody = React.memo(
//   (props: {
//     config: Configuration;
//     product: Product;
//     alternateProductList: Product[];
//     featuredProductList: Product[];
//     reviews: Review[];
//     disableEmbedSection: boolean;
//   }) => {
//     const { product } = props;

//     /** -----------------------------
//      * MEMOIZED VALUES
//      * ----------------------------- */

//     const embedCode = useMemo(
//       () =>
//         `
//       <a target="_" href=${product.url}
//       style="
//     text-decoration:none;
//     font-family: Inter, Arial, sans-serif;
//     display:inline-block;
//   "
//       >
//   <div
//     style="
//       position:relative;
//     display:flex;
//     align-items:center;
//     gap:10px;
//     padding:8px 10px;
//     width:320px;
//     height:64px;
//     box-sizing:border-box;
//     "
//   >
//         <iframe
//           style="pointer-events: none;"
//           src="${Paths.Frontend.AI_TOOL.href}/embed/${
//           product.slug || product.id
//         }"
//           width="350"
//           height="86"
//           scrolling="no"
//           frameborder="0"
//           allowTransparency="true"
//           allow="encrypted-media"
//         >
//           </iframe>

//      <!-- RIGHT: Bookmark Icon -->
//       <div
//         style="
//            position:absolute;
//           top:6px;
//           right:10px;
//           display:flex;
//           flex-direction:column;
//           align-items:center;
//           gap:3px;
//           font-family: Inter, Arial, sans-serif;
//         "
//       >
//           <svg
//             viewBox="0 0 24 24"
//             width="50"
//             height="50"
//             fill="#018290"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path d="M6 2c-1.1 0-2 .9-2 2v18l8-4 8 4V4c0-1.1-.9-2-2-2H6z"/>
//           </svg>
//           <!-- Count -->
//             <span
//               style="
//                 font-size:1.2rem;
//                 font-weight:600;
//                 color:#111827;
//                 line-height:1;
//               "
//             >
//               (${10})
//             </span>
//           </div>
//       </div>

//       </div>

//       </a>
//     `,
//       [product.url, product.id, product.slug]
//     );

//     const faqList = useMemo<FAQItem[]>(
//       () =>
//         [
//           [product.faq_1_question ?? "", product.faq_1_answer ?? ""],
//           [product.faq_2_question ?? "", product.faq_2_answer ?? ""],
//           [product.faq_3_question ?? "", product.faq_3_answer ?? ""],
//         ]
//           .filter(([q, a]) => q !== "" && a !== "")
//           .map(([question, answer]) => ({ question, answer })),
//       [
//         product.faq_1_question,
//         product.faq_1_answer,
//         product.faq_2_question,
//         product.faq_2_answer,
//         product.faq_3_question,
//         product.faq_3_answer,
//       ]
//     );

//     const parsedDescription = useMemo(
//       () => parseAMW(product.long_description ?? ""),
//       [product.long_description]
//     );

//     const parsedPricing = useMemo(
//       () => parseAMW(product.pricing ?? ""),
//       [product.pricing]
//     );

//     const parsedUseCases = useMemo(
//       () => parseAMW(product.use_cases ?? ""),
//       [product.use_cases]
//     );

//     const parsedOpinion = useMemo(
//       () => (product.opinion ? parseAMW(product.opinion) : null),
//       [product.opinion]
//     );

//     /** Copy handler wrapped in async */
//     const copyEmbed = useCallback(async () => {
//       copy(embedCode);
//     }, [embedCode]);

//     /** -----------------------------
//      *  RENDER
//      * ----------------------------- */

//     return (
//       <div className="flex flex-col gap-20 w-full h-full">
//         <TabGroup.Vertical
//           className="gap-7 my-6"
//           additionalTabs={["Alternative Tools"]}
//         >
//           {/* DESCRIPTION SECTION */}
//           <Section
//             id="Description"
//             title={"Description for " + product.title}
//             tabHide={!product.long_description}
//           >
//             {parsedDescription}
//           </Section>

//           {/* PRICING */}
//           <Section
//             id="Pricing"
//             title={"Pricing for " + product.title}
//             tabHide={!product.pricing && !product.pricing_url}
//             insideSection={{ className: "items-baseline" }}
//           >
//             {!!product.pricing && <>{parsedPricing}</>}
//             {!!product.pricing_url && (
//               <Button.Primary
//                 text="Pricing"
//                 action={{
//                   type: "url",
//                   url: product.pricing_url,
//                 }}
//               />
//             )}
//           </Section>

//           {/* USE CASES */}
//           <Section
//             id="Use Cases"
//             title={"Use Cases for " + product.title}
//             tabHide={!product.use_cases}
//           >
//             {parsedUseCases}
//           </Section>

//           {/* OPINION */}
//           {!!product.opinion && (
//             <Section className="w-full" title={""} id={"opinion"}>
//               {parsedOpinion}
//             </Section>
//           )}

//           {/* FAQ */}
//           <Section
//             id="FAQs"
//             title={"FAQs for " + product.title}
//             tabHide={!product.faq_1_question}
//           >
//             {!!product.faq_1_question && <FAQs itemList={faqList} />}
//           </Section>

//           {/* EMBED SECTION */}
//           {!props.disableEmbedSection && (
//             <Section title={"Embed for " + product.title}>
              
//                 <Text.P>
//                   Add a live badge on your website, showcasing your ever
//                   increasing ratings & authority at Groupify AI
//                 </Text.P>
//                 <div className="flex flex-start w-full"
//                   > 
//                     <div 
//                     className="rounded-md m-2 outline outline-1 outline-boundary-dark p-1s"
//                     >
//                     <ClickToOpenDialog
//                       dialogId={Paths.DIALOG_ID.EMBED_CODE}
//                       args={{ config: props.config, product: props.product }}
//                     >
//                     <div className="flex cursor-pointer">
//                       <div dangerouslySetInnerHTML={{ __html: embedCode }}></div>
//                     </div>
//                  </ClickToOpenDialog>

//                     </div>
//                 </div>
//                 <div className="flex flex-start w-full">

//                 <StatefulBuilder<boolean> initialValue={false}>
//                   {({ state, setState }) => {
//                     const handleCopy = async () => {
//                       await copyEmbed();
//                       setState(true);
//                       setTimeout(() => setState(false), 1500);
//                     };

//                     return state ? (
//                       <Text.P className="px-2 bg-gray-300 rounded-md w-fit">
//                         Embed code copied
//                       </Text.P>
//                     ) : (
//                       <Button.Text
//                         text="Click to copy embed code"
//                         action={{
//                           type: "callback",
//                           onClick: handleCopy,
//                         }}
//                       />
//                     );
//                   }}
//                 </StatefulBuilder>
//                 </div>

// {/* Other Below code is already committed */}

//               {/* <div className="flex flex-col flex-wrap gap-2 justify-start w-full">
//                 <Text.P>
//                   Add a live badge on your website, showcasing your ever
//                   increasing ratings & authority at Groupify AI
//                 </Text.P>

//                 <div className="relative inline-block w-fit">
//                   <button
//                     onClick={() => setBookmarked(!bookmarked)}
//                     className="absolute top-0 right-0 z-10 cursor-pointer select-none"
//                     aria-label="bookmark toggle"
//                   >
//                     <div
//                       className={`relative w-7 h-10 rounded-t-md transition-all before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 ${bookmarked ? "bg-[#018290] before:border-t-[#018290]" : "bg-gray-300 before:border-t-gray-300"} before:w-0 before:h-0 before:border-l-[14px] before:border-l-transparent before:border-r-[14px] before:border-r-transparent before:border-t-[12px]`}
//                     ></div>
//                     <span className="ml-2 font-semibold text-gray-700">
//                       ({props.product.review_count})
//                     </span>
//                   </button>

//                   <ClickToOpenDialog
//                     dialogId={Paths.DIALOG_ID.EMBED_CODE}
//                     args={{ config: props.config, product: props.product }}
//                   >
//                     <div dangerouslySetInnerHTML={{ __html: embedCode }}></div>
//                   </ClickToOpenDialog>
//                 </div>

//                 <StatefulBuilder<boolean> initialValue={false}>
//                   {({ state, setState }) => {
//                     const handleCopy = async () => {
//                       await copyEmbed();
//                       setState(true);
//                       setTimeout(() => setState(false), 1500);
//                     };

//                     return state ? (
//                       <Text.P className="px-2 bg-gray-300 rounded-md w-fit">
//                         Embed code copied
//                       </Text.P>
//                     ) : (
//                       <Button.Text
//                         text="Click to copy embed code"
//                         action={{
//                           type: "callback",
//                           onClick: handleCopy,
//                         }}
//                       />
//                     );
//                   }}
//                 </StatefulBuilder>
//               </div> */}
//             </Section>
//           )}

//           {/* REVIEWS */}
//           <Section
//             id="Reviews"
//             title={"Reviews for " + product.title}
//             className={twMerge(
//               "bg-primary outline outline-1 outline-boundary-light rounded-xl",
//               "md:p-5 p-3",
//               "bg-gradient-to-br from-primary-light to-primary",
//               "backdrop-filter backdrop-blur-lg bg-opacity-70",
//               "text-white",
//               "overflow-clip",
//               "w-full"
//             )}
//             sideComponent={(() => {
//               console.log(
//                 "✍️ WRITE REVIEW BUTTON → Reviews passed:",
//                 props.reviews
//               );
//               return (
//                 <Button.WriteAReview
//                   reviewList={props.reviews}
//                   product={product}
//                 />
//               );
//             })()}
//           >
//             <ReviewSectionBody reviewList={props.reviews} product={product} />
//           </Section>
//         </TabGroup.Vertical>
//       </div>
//     );
//   }
// );

// ProductBody.displayName = "ProductBody";

// const Page = React.memo((props: PageProps) => {
//   const { product, config } = props;

//   console.log("🔍 PAGE → Reviews received:", props.reviews);
//   console.log("🔍 PAGE → Reviews count:", props.reviews?.length);
//   console.log("🔍 PAGE → Product rating fields:", {
//     overall_satisfaction: product.overall_satisfaction,
//     review_count: product.review_count,
//     ease_of_use: product.ease_of_use,
//     ease_of_customization: product.ease_of_customization,
//     intuitive_interface: product.intuitive_interface,
//     value_for_money: product.value_for_money,
//     support_team_responsiveness: product.support_team_responsiveness,
//   });

//   /** -----------------------------
//    * MEMOIZED VALUES
//    * ----------------------------- */

//   const logoSource = useMemo(
//     () =>
//       getAssetPathFromID(product.logo?.id) ??
//       product.logo_url ??
//       Paths.IMAGE.FALLBACK,
//     [product.logo?.id, product.logo_url]
//   );

//   const seoTitle = useMemo(
//     () => product.meta_title ?? product.title,
//     [product.meta_title, product.title]
//   );

//   const seoDescription = useMemo(
//     () => product.short_description ?? product.long_description ?? "",
//     [product.short_description, product.long_description]
//   );

//   // const seoKeywords = useMemo(
//   //   () => (product.visible_tags?.length ? product.visible_tags.join(",") : ""),
//   //   [product.visible_tags]
//   // );

//   const seoKeywords = useMemo(
//     () => parseVisibleTags(product.visible_tags).join(", "),
//     [product.visible_tags]
//   );

//   const openGraphImage = useMemo(
//     () => product.logo_url ?? logoSource,
//     [product.logo_url, logoSource]
//   );

//   const breadcrumbPath = useMemo(
//     () => [
//       Paths.Frontend.HOME,
//       product.course ? Paths.Frontend.AI_COURSES : Paths.Frontend.AI_TOOL,
//       { title: product.title, href: product.url },
//     ],
//     [product.course, product.title, product.url]
//   );

//   const altToolsTitle = useMemo(
//     () => "Alternative Tools for " + product.title,
//     [product.title]
//   );

//   const featuredToolsTitle = "Featured Tools";

//   /** -----------------------------
//    * RENDER
//    * ----------------------------- */

//   return (
//     <>
//       <NextSeo
//         title={seoTitle}
//         description={seoDescription}
//         additionalMetaTags={[
//           {
//             name: "keywords",
//             content: seoKeywords,
//           },
//         ]}
//         openGraph={{
//           type: "Product",
//           title: product.title,
//           description: seoDescription,
//           images: [{ url: openGraphImage }],
//           url: product.url,
//         }}
//       />

//       <Layout.Base
//         config={config}
//         className="w-full flex-col justify-center lg:gap-6 gap-6 inline-flex my-8 max-w-content-width overflow-clip"
//       >
//         {/* BREADCRUMB */}
//         <Breadcrumb path={breadcrumbPath} />

//         <div className="w-full flex-col justify-center md:gap-10 gap-default-vertical-gap inline-flex">
//           {/* HERO */}
//           <Hero data={product} disableClaimButton={props.disableClaimButton} />

//           <div className="flex flex-col w-full gap-5 mb-5">
//             <div className="flex flex-row justify-center items-start gap-4 w-full">
//               {/* PRODUCT BODY */}
//               <div className="lg:mr-6 w-full lg:max-w-7.5/10">
//                 <ProductBody
//                   config={config}
//                   product={product}
//                   alternateProductList={props.alternateProductList}
//                   featuredProductList={props.featuredProductList}
//                   reviews={props.reviews}
//                   disableEmbedSection={props.disableEmbedSection}
//                 />
//               </div>

//               {/* FEATURED TOOLS SIDEBAR (Desktop) */}
//               <div className="lg:block hidden w-full max-w-2.5/10">
//                 <ToolListing.Vertical productList={props.featuredProductList} />
//               </div>
//             </div>

//             {/* ALTERNATIVE TOOLS */}
//             {/* <Section id="Alternative Tools" title={altToolsTitle}>
//               <ToolListing.Horizontal
//                 productList={props.alternateProductList}
//               />
//             </Section> */}
//             {props.alternateProductList.length > 0 && (
//               <Section id="Alternative Tools" title={altToolsTitle}>
//                 <ToolListing.Horizontal
//                   productList={props.alternateProductList}
//                 />
//               </Section>
//             )}

//             {/* FEATURED TOOLS (Mobile Only) */}
//             <Section
//               id="Featured Tools"
//               title={featuredToolsTitle}
//               className="lg:hidden"
//             >
//               <ToolListing.Horizontal productList={props.featuredProductList} />
//             </Section>
//           </div>
//         </div>
//       </Layout.Base>
//     </>
//   );
// });
// Page.displayName = "Page";

// export { Page };
// export type { PageProps };



























import {
  convertToEmbedLink,
  parseAMW as defaultParse,
} from "@/ui/components/utils/utils";
import {
  TabGroup,
  Section,
  ToolListing,
  Button,
  Rating as RatingUI,
  Image,
  Breadcrumb,
  ProductPageText as Text,
  ClickToOpenDialog,
  HorizontalScroller,
  ReviewCard,
  FAQs,
  FAQItem,
  SMIcons,
  NextSeo,
} from "@/ui/components/components";
import { Constants, getAssetPathFromID, Paths } from "@/contants";
import { Layout } from "@/ui/layouts/layouts";
import { CMS, Configuration, Product, Review, Rating } from "@/lib/lib";
import { twMerge } from "tailwind-merge";
import { ComparisonControls, StatefulBuilder } from "@/ui/logic/logic";
import copy from "copy-to-clipboard";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeImage } from "../components/SafeImage";

const parseAMW = (text: string) =>
  defaultParse(text, {
    p: Text.P,
    li: Text.LI,
  });

type PageProps = {
  product: Product;
  config: Configuration;
  alternateProductList: Product[];
  featuredProductList: Product[];
  reviews: Review[];
  disableEmbedSection: boolean;
  disableClaimButton: boolean;
};

// Lazy load iframe (huge GTmetrix win)
const LiteYouTube = dynamic(
  () => import("@/ui/components/lite-youtube"), // You must create or already have a lightweight component
  { ssr: false, loading: () => null }
);

function parseVisibleTags(input: unknown): string[] {
  try {
    // Already an array
    if (Array.isArray(input)) {
      return input.map((t) => String(t).trim());
    }

    // Stringified JSON
    if (typeof input === "string") {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed.map((t) => String(t).trim());
      }
    }

    return [];
  } catch {
    return [];
  }
}

export const ToolShowcase = React.memo(
  (props: {
    data: Product;
    className: string;
    disableClaimButton: boolean;
  }) => {
    console.log("🧰 TOOL SHOWCASE → Product ID:", props.data.id);
    console.log(
      "🧰 TOOL SHOWCASE → Has YouTube video:",
      !!props.data.youtube_url
    );

    const largeImageClasses = "rounded-2xl aspect-video w-full overflow-auto";

    const showVideo = !!props.data.youtube_url;

    // Memoize the conversion → avoids recalculation
    const embedLink = useMemo(
      () => convertToEmbedLink(props.data.youtube_url ?? ""),
      [props.data.youtube_url]
    );

    // Memoize image path
    // const imageSrc = useMemo(
    //   () => getAssetPathFromID(props.data.large_image?.id) ?? "",
    //   [props.data.large_image?.id]
    // );
    const imageSrc = useMemo(
      () =>
        getAssetPathFromID(props.data.large_image?.id) ?? Paths.IMAGE.FALLBACK,
      [props.data.large_image?.id]
    );

    const [safeImageSrc, setSafeImageSrc] = useState(imageSrc);

    useEffect(() => {
      setSafeImageSrc(imageSrc);
    }, [imageSrc]);

    return (
      <div className={twMerge("flex flex-col gap-1.5 w-full", props.className)}>
        {!props.disableClaimButton && (
          <Button.Text
            text="Is this tool maintained by you? Click to claim it"
            className="font-normal text-base text-left hover:underline"
            action={{
              type: "url",
              url: Paths.Frontend.NEW_TOOL_FORM.href,
              underline: true,
            }}
          />
        )}

        {/* IMAGE */}
        {!showVideo && (
          // <NextImage
          //   className={twMerge(
          //     largeImageClasses,
          //     "object-contain outline outline-1 outline-boundary-light bg-bg-primary"
          //   )}
          //   src={imageSrc}
          //   alt={props.data.large_image?.title ?? ""}
          //   width={1920}
          //   height={1080}
          //   loading="lazy"
          //   quality={70}
          //   unoptimized={imageSrc === Paths.IMAGE.FALLBACK}
          // />
          <NextImage
            className={twMerge(
              largeImageClasses,
              "object-contain outline outline-1 outline-boundary-light bg-bg-primary"
            )}
            src={safeImageSrc}
            alt={props.data.large_image?.title ?? ""}
            width={1920}
            height={1080}
            loading="lazy"
            quality={70}
            unoptimized={safeImageSrc === Paths.IMAGE.FALLBACK}
            onError={() => {
              if (safeImageSrc !== Paths.IMAGE.FALLBACK) {
                setSafeImageSrc(Paths.IMAGE.FALLBACK);
              }
            }}
          />
        )}

        {/* LAZY LOADED YOUTUBE (no design change, but faster) */}
        {showVideo && embedLink && (
          <LiteYouTube
            videoUrl={embedLink}
            className={twMerge(
              "outline outline-1 outline-boundary-light bg-bg-primary",
              largeImageClasses
            )}
          />
        )}
      </div>
    );
  }
);
ToolShowcase.displayName = "ToolShowcase";

const Hero = React.memo(
  ({
    data,
    disableClaimButton,
  }: {
    data: Product;
    disableClaimButton: boolean;
  }) => {
    // Memo: Prevent recalculation
    // const logoSource = useMemo(
    //   () => getAssetPathFromID(data.logo?.id) ?? data.logo_url ?? "",
    //   [data.logo?.id, data.logo_url]
    // );
    const logoSource = useMemo(
      () =>
        getAssetPathFromID(data.logo?.id) ??
        data.logo_url ??
        Paths.IMAGE.FALLBACK,
      [data.logo?.id, data.logo_url]
    );

    const logoAltText = useMemo(
      () => data.logo?.title ?? data.title,
      [data.logo?.title, data.title]
    );

    const ratingValue = useMemo(
      () => data.overall_satisfaction ?? 0,
      [data.overall_satisfaction]
    );

    const reviewCount = useMemo(
      () => data.review_count ?? 0,
      [data.review_count]
    );

    const socialLinks = useMemo(
      () => [
        data.instagram ?? "",
        data.facebook ?? "",
        data.linkedin ?? "",
        data.tiktok ?? "",
        data.x ?? "",
      ],
      [data.instagram, data.facebook, data.linkedin, data.tiktok, data.x]
    );

    const visibleTags = useMemo(
      () => data.visible_tags ?? [],
      [data.visible_tags]
    );

    const hasCoupon = useMemo(() => !!data.coupon_code, [data.coupon_code]);

    console.log("⭐ HERO → Rating value:", ratingValue);
    console.log("⭐ HERO → Review count:", reviewCount);

    const parsedVisibleTags = useMemo(
      () => parseVisibleTags(data.visible_tags),
      [data.visible_tags]
    );

    const [imgSrc, setImgSrc] = useState<string>(logoSource);

    // Reset image when product changes
    useEffect(() => {
      setImgSrc(logoSource);
    }, [logoSource]);

    return (
      <div className="justify-start items-start gap-8 flex w-full">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-start items-start gap-4 max-w-full xl:max-w-[45%]">
          {/* LOGO + NAME + RATING */}
          <div className="flex justify-between w-full items-center">
            <div className="justify-start items-center align-top gap-6 flex">
              <div className="relative w-fit h-fit">
                <SafeImage
                  src={logoSource}
                  alt={logoAltText}
                  width={112}
                  height={112}
                  className="w-28 aspect-square rounded-md object-contain outline outline-1 outline-boundary-light bg-bg-primary"
                />

                {data.verified && (
                  <NextImage
                    src={Paths.ICONS.VERIFIED}
                    alt="Verified"
                    width={24}
                    height={24}
                    className="absolute -top-2 -right-2 size-6 inline-flex"
                  />
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Text.H1 className="font-bold">{data.title}</Text.H1>

                <div className="flex gap-2">
                  <RatingUI rating={ratingValue} />
                  <span className="text-app-primary">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* SHARE + BOOKMARK */}
            <div className="flex flex-col gap-3">
              <Button.Share url={data.url} />
              <Button.Bookmark productId={data.id} />
            </div>
          </div>

          {/* MOBILE TOOL SHOWCASE */}
          <ToolShowcase
            className="xl:hidden flex"
            data={data}
            disableClaimButton={disableClaimButton}
          />

          {/* DESCRIPTION */}
          {parseAMW(data.short_description ?? "")}

          {/* SOCIAL ICONS */}
          <div className="justify-start items-center gap-4 inline-flex">
            <SMIcons urlList={socialLinks} />
          </div>

          {/* TAGS */}
          <div>
            <div className="justify-start items-start gap-1 inline-flex  flex-wrap">
              <span className="font-semibold">Key AI Functions:</span>

              {/* <p style={{ fontWeight: 'normal', fontSize: '5px', fontFamily: 'Roboto, sans-serif', lineHeight: '1.1', color: '#2563EB' }}>
                {parseAMW(String(parsedVisibleTags))}
              </p> */}
                <p
                style={{
                  fontWeight: 'normal',
                  fontSize: '12px',
                  fontFamily: 'Roboto, sans-serif',
                  lineHeight: '1.4',
                  color: '#2563EB',
                  margin: 0
                }}
              >
                {String(parsedVisibleTags)
                  .replace(/<[^>]*>/g, '')     // 🔥 removes all HTML tags like <p>
                  .replace(/^\[|\]$/g, '')     // remove [ ]
                  .replace(/"/g, '')           // remove quotes
                  .trim()}
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="justify-start items-start gap-6 flex flex-wrap">
            <ComparisonControls>
              {({ addProduct }) => (
                <Button.PrimaryBoundary
                  text="Start Comparing"
                  action={{
                    type: "callback",
                    onClick: () => Promise.resolve(addProduct(data)),
                  }}
                />
              )}
            </ComparisonControls>

            <Button.Primary
              text="Visit"
              action={{ type: "url", url: data.tool_url ?? "" }}
            />
          </div>

          {/* COUPON */}
          {/* {hasCoupon && (
            <div className="md:w-fit w-full rounded-md p-2.5 px-5 outline outline-1 outline-boundary-light text-center bg-slate-400/40">
              <Text.H3>Click for Exclusive Discounts</Text.H3>
            </div>
          )} */}
          {hasCoupon && data.coupon_code && (
            <Button.PrimaryBoundary
              text="Click for Exclusive Discounts"
              action={{
                type: "url",
                url: data.coupon_code,
              }}
              className="md:w-fit w-full"
            />
          )}
        </div>

        {/* DESKTOP TOOL SHOWCASE */}
        <ToolShowcase
          className="xl:flex hidden"
          data={data}
          disableClaimButton={disableClaimButton}
        />
      </div>
    );
  }
);
Hero.displayName = "Hero";

const ReviewSectionBody = React.memo(
  (props: { className?: string; reviewList: Review[]; product: Product }) => {
    console.log("📝 REVIEW SECTION → Full review list:", props.reviewList);
    console.log("📝 REVIEW SECTION → Review count:", props.reviewList.length);

    console.log("📝 REVIEW SECTION → Product rating snapshot:", {
      overall_satisfaction: props.product.overall_satisfaction,
      review_count: props.product.review_count,
      ease_of_use: props.product.ease_of_use,
      ease_of_customization: props.product.ease_of_customization,
      intuitive_interface: props.product.intuitive_interface,
      value_for_money: props.product.value_for_money,
      support_team_responsiveness: props.product.support_team_responsiveness,
    });

    // Memoized slice logic → no recalculation on every render
    const { sliceAt, topReviewList, horizontalReviewList } = useMemo(() => {
      const s = props.reviewList.length > 10 ? 6 : 10;

      console.log("✂️ REVIEW SLICE → sliceAt:", s);
      console.log(
        "✂️ REVIEW SLICE → Top reviews:",
        props.reviewList.slice(0, s)
      );
      console.log(
        "✂️ REVIEW SLICE → Horizontal reviews:",
        props.reviewList.slice(s)
      );
      return {
        sliceAt: s,
        topReviewList: props.reviewList.slice(0, s),
        horizontalReviewList: props.reviewList.slice(s),
      };
    }, [props.reviewList]);

    // Memoized rating rows
    // const ratingRows = useMemo(
    //   () => [
    //     ["Ease of Use", props.product.ease_of_use ?? 0],
    //     ["Ease of Customization", props.product.ease_of_customization ?? 0],
    //     ["Intuitive Interface", props.product.intuitive_interface ?? 0],
    //     ["Value for Money ", props.product.value_for_money ?? 0],
    //     [
    //       "Support Team Responsiveness ",
    //       props.product.support_team_responsiveness ?? 0,
    //     ],
    //   ],
    //   [
    //     props.product.ease_of_use,
    //     props.product.ease_of_customization,
    //     props.product.intuitive_interface,
    //     props.product.value_for_money,
    //     props.product.support_team_responsiveness,
    //   ]
    // );

    const ratingRows = useMemo(() => {
      const rows = [
        ["Ease of Use", props.product.ease_of_use ?? 0],
        ["Ease of Customization", props.product.ease_of_customization ?? 0],
        ["Intuitive Interface", props.product.intuitive_interface ?? 0],
        ["Value for Money", props.product.value_for_money ?? 0],
        [
          "Support Team Responsiveness",
          props.product.support_team_responsiveness ?? 0,
        ],
      ];

      console.log("📊 RATING ROWS →", rows);
      return rows;
    }, [
      props.product.ease_of_use,
      props.product.ease_of_customization,
      props.product.intuitive_interface,
      props.product.value_for_money,
      props.product.support_team_responsiveness,
    ]);

    // Memoized left & right columns for 2-column top reviews
    const leftColumn = useMemo(
      () =>
        topReviewList
          .filter((_, i) => i % 2 === 0)
          .map((e, i) => {
            console.log("⬅️ LEFT COLUMN REVIEW:", e);
            return (
              <ReviewCard key={i} data={e} className="h-fit text-primary" />
            );
          }),
      [topReviewList]
    );

    const rightColumn = useMemo(
      () =>
        topReviewList
          .filter((_, i) => i % 2 !== 0)
          .map((e, i) => {
            console.log("➡️ RIGHT COLUMN REVIEW:", e);
            return (
              <ReviewCard key={i} data={e} className="h-fit text-primary" />
            );
          }),
      [topReviewList]
    );

    return (
      <div
        className={twMerge(
          "flex flex-row flex-wrap gap-6 w-full justify-start",
          props.className
        )}
      >
        {/* LEFT SUMMARY BOX */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Text.P className="font-semibold">
              <span className="text-4.5xl">
                {props.product.overall_satisfaction ?? 0}
              </span>{" "}
              / 5
            </Text.P>

            <Text.Indicative>
              from {props.product.review_count ?? 0} reviews
            </Text.Indicative>

            <div className="self-stretch h-px border border-white/70"></div>
          </div>

          {/* RATING FIELDS */}
          <div className="grid grid-cols-1 w-fit gap-1">
            {ratingRows.map(([label, value], index) => (
              <div
                className="flex gap-3 items-center whitespace-nowrap"
                key={index}
              >
                <Text.P>{label}</Text.P>
                <RatingUI rating={value as number} />
              </div>
            ))}
          </div>
        </div>

        {/* TWO COLUMN REVIEW LIST */}
        <div
          className={twMerge(
            "flex w-full flex-col gap-4",
            "md:flex-row md:items-start md:justify-center"
          )}
        >
          <div className="flex flex-col w-full md:max-w-5/10 justify-center gap-4 px-5">
            {leftColumn}
          </div>

          <div className="flex flex-col w-full md:max-w-5/10 justify-center gap-4 px-5">
            {rightColumn}
          </div>
        </div>

        {/* HORIZONTAL SCROLLER */}
        {horizontalReviewList.length > 0 && (
          <div className="px-5 w-full">
            <HorizontalScroller
              dataList={horizontalReviewList}
              builder={(e, _, className) => {
                console.log("➡️➡️ HORIZONTAL REVIEW:", e);
                return (
                  <ReviewCard
                    key={e.id}
                    data={e}
                    className={twMerge("h-full", className)}
                  />
                );
              }}
            />
          </div>
        )}
      </div>
    );
  }
);
ReviewSectionBody.displayName = "ReviewSectionBody";

const ProductBody = React.memo(
  (props: {
    config: Configuration;
    product: Product;
    alternateProductList: Product[];
    featuredProductList: Product[];
    reviews: Review[];
    disableEmbedSection: boolean;
  }) => {
    const { product } = props;

    /** -----------------------------
     * MEMOIZED VALUES
     * ----------------------------- */

    const embedCode = useMemo(
      () =>
        `
      <a target="_" href=${product.url}
      style="
    text-decoration:none;
    font-family: Inter, Arial, sans-serif;
    display:inline-block;
  "
      >
  <div
    style="
      position:relative;
    display:flex;
    align-items:center;
    gap:10px;
    padding:8px 10px;
    width:320px;
    height:64px;
    box-sizing:border-box;
    "
  >
        <iframe
          style="pointer-events: none;"
          src="${Paths.Frontend.AI_TOOL.href}/embed/${
          product.slug || product.id
        }"
          width="350"
          height="86"
          scrolling="no"
          frameborder="0"
          allowTransparency="true"
          allow="encrypted-media"
        >
          </iframe>

     <!-- RIGHT: Bookmark Icon -->
      <div
        style="
           position:absolute;
          top:6px;
          right:10px;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:3px;
          font-family: Inter, Arial, sans-serif;
        "
      >
          <svg
            viewBox="0 0 24 24"
            width="50"
            height="50"
            fill="#018290"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 2c-1.1 0-2 .9-2 2v18l8-4 8 4V4c0-1.1-.9-2-2-2H6z"/>
          </svg>
          <!-- Count -->
            <span
              style="
                font-size:1.2rem;
                font-weight:600;
                color:#111827;
                line-height:1;
              "
            >
              (${10})
            </span>
          </div>
      </div>

      </div>

      </a>
    `,
      [product.url, product.id, product.slug]
    );

    const faqList = useMemo<FAQItem[]>(
      () =>
        [
          [product.faq_1_question ?? "", product.faq_1_answer ?? ""],
          [product.faq_2_question ?? "", product.faq_2_answer ?? ""],
          [product.faq_3_question ?? "", product.faq_3_answer ?? ""],
        ]
          .filter(([q, a]) => q !== "" && a !== "")
          .map(([question, answer]) => ({ question, answer })),
      [
        product.faq_1_question,
        product.faq_1_answer,
        product.faq_2_question,
        product.faq_2_answer,
        product.faq_3_question,
        product.faq_3_answer,
      ]
    );

    const parsedDescription = useMemo(
      () => parseAMW(product.long_description ?? ""),
      [product.long_description]
    );

    const parsedPricing = useMemo(
      () => parseAMW(product.pricing ?? ""),
      [product.pricing]
    );

    const parsedUseCases = useMemo(
      () => parseAMW(product.use_cases ?? ""),
      [product.use_cases]
    );

    const parsedOpinion = useMemo(
      () => (product.opinion ? parseAMW(product.opinion) : null),
      [product.opinion]
    );

    /** Copy handler wrapped in async */
    const copyEmbed = useCallback(async () => {
      copy(embedCode);
    }, [embedCode]);

    // inside your component
    const [bookmarked, setBookmarked] = React.useState(false);

    /** -----------------------------
     *  RENDER
     * ----------------------------- */

    return (
      <div className="flex flex-col gap-20 w-full h-full">
        <TabGroup.Vertical
          className="gap-7 my-6"
          additionalTabs={["Alternative Tools"]}
        >
          {/* DESCRIPTION SECTION */}
          <Section
            id="Description"
            title={"Description for " + product.title}
            tabHide={!product.long_description}
          >
            {parsedDescription}
          </Section>

          {/* PRICING */}
          <Section
            id="Pricing"
            title={"Pricing for " + product.title}
            tabHide={!product.pricing && !product.pricing_url}
            insideSection={{ className: "items-baseline" }}
          >
            {!!product.pricing && <>{parsedPricing}</>}
            {!!product.pricing_url && (
              <Button.Primary
                text="Pricing"
                action={{
                  type: "url",
                  url: product.pricing_url,
                }}
              />
            )}
          </Section>

          {/* USE CASES */}
          <Section
            id="Use Cases"
            title={"Use Cases for " + product.title}
            tabHide={!product.use_cases}
          >
            {parsedUseCases}
          </Section>

          {/* OPINION */}
          {!!product.opinion && (
            <Section className="w-full" title={""} id={"opinion"}>
              {parsedOpinion}
            </Section>
          )}

          {/* FAQ */}
          <Section
            id="FAQs"
            title={"FAQs for " + product.title}
            tabHide={!product.faq_1_question}
          >
            {!!product.faq_1_question && <FAQs itemList={faqList} />}
          </Section>

          {/* EMBED SECTION */}
          {!props.disableEmbedSection && (
            <Section title={"Embed for " + product.title}>
              
                <Text.P>
                  Add a live badge on your website, showcasing your ever
                  increasing ratings & authority at Groupify AI
                </Text.P>
                <div className="flex flex-start w-full"
                  > 
                    <div 
                    className="rounded-md m-2 outline outline-1 outline-boundary-dark p-1s"
                    >
                    <ClickToOpenDialog
                      dialogId={Paths.DIALOG_ID.EMBED_CODE}
                      args={{ config: props.config, product: props.product }}
                    >
                    <div className="flex cursor-pointer">
                      <div dangerouslySetInnerHTML={{ __html: embedCode }}></div>
                    </div>
                 </ClickToOpenDialog>

                    </div>
                </div>
                <div className="flex flex-start w-full">

                <StatefulBuilder<boolean> initialValue={false}>
                  {({ state, setState }) => {
                    const handleCopy = async () => {
                      await copyEmbed();
                      setState(true);
                      setTimeout(() => setState(false), 1500);
                    };

                    return state ? (
                      <Text.P className="px-2 bg-gray-300 rounded-md w-fit">
                        Embed code copied
                      </Text.P>
                    ) : (
                      <Button.Text
                        text="Click to copy embed code"
                        action={{
                          type: "callback",
                          onClick: handleCopy,
                        }}
                      />
                    );
                  }}
                </StatefulBuilder>
                </div>

{/* Other Below code is already committed */}

              {/* <div className="flex flex-col flex-wrap gap-2 justify-start w-full">
                <Text.P>
                  Add a live badge on your website, showcasing your ever
                  increasing ratings & authority at Groupify AI
                </Text.P>

                <div className="relative inline-block w-fit">
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className="absolute top-0 right-0 z-10 cursor-pointer select-none"
                    aria-label="bookmark toggle"
                  >
                    <div
                      className={`relative w-7 h-10 rounded-t-md transition-all before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 ${bookmarked ? "bg-[#018290] before:border-t-[#018290]" : "bg-gray-300 before:border-t-gray-300"} before:w-0 before:h-0 before:border-l-[14px] before:border-l-transparent before:border-r-[14px] before:border-r-transparent before:border-t-[12px]`}
                    ></div>
                    <span className="ml-2 font-semibold text-gray-700">
                      ({props.product.review_count})
                    </span>
                  </button>

                  <ClickToOpenDialog
                    dialogId={Paths.DIALOG_ID.EMBED_CODE}
                    args={{ config: props.config, product: props.product }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: embedCode }}></div>
                  </ClickToOpenDialog>
                </div>

                <StatefulBuilder<boolean> initialValue={false}>
                  {({ state, setState }) => {
                    const handleCopy = async () => {
                      await copyEmbed();
                      setState(true);
                      setTimeout(() => setState(false), 1500);
                    };

                    return state ? (
                      <Text.P className="px-2 bg-gray-300 rounded-md w-fit">
                        Embed code copied
                      </Text.P>
                    ) : (
                      <Button.Text
                        text="Click to copy embed code"
                        action={{
                          type: "callback",
                          onClick: handleCopy,
                        }}
                      />
                    );
                  }}
                </StatefulBuilder>
              </div> */}
            </Section>
          )}

          {/* REVIEWS */}
          <Section
            id="Reviews"
            title={"Reviews for " + product.title}
            className={twMerge(
              "bg-primary outline outline-1 outline-boundary-light rounded-xl",
              "md:p-5 p-3",
              "bg-gradient-to-br from-primary-light to-primary",
              "backdrop-filter backdrop-blur-lg bg-opacity-70",
              "text-white",
              "overflow-clip",
              "w-full"
            )}
            sideComponent={(() => {
              console.log(
                "✍️ WRITE REVIEW BUTTON → Reviews passed:",
                props.reviews
              );
              return (
                <Button.WriteAReview
                  reviewList={props.reviews}
                  product={product}
                />
              );
            })()}
          >
            <ReviewSectionBody reviewList={props.reviews} product={product} />
          </Section>
        </TabGroup.Vertical>
      </div>
    );
  }
);

ProductBody.displayName = "ProductBody";

const Page = React.memo((props: PageProps) => {
  const { product, config } = props;

  console.log("🔍 PAGE → Reviews received:", props.reviews);
  console.log("🔍 PAGE → Reviews count:", props.reviews?.length);
  console.log("🔍 PAGE → Product rating fields:", {
    overall_satisfaction: product.overall_satisfaction,
    review_count: product.review_count,
    ease_of_use: product.ease_of_use,
    ease_of_customization: product.ease_of_customization,
    intuitive_interface: product.intuitive_interface,
    value_for_money: product.value_for_money,
    support_team_responsiveness: product.support_team_responsiveness,
  });

  /** -----------------------------
   * MEMOIZED VALUES
   * ----------------------------- */

  const logoSource = useMemo(
    () =>
      getAssetPathFromID(product.logo?.id) ??
      product.logo_url ??
      Paths.IMAGE.FALLBACK,
    [product.logo?.id, product.logo_url]
  );

  const seoTitle = useMemo(
    () => product.meta_title ?? product.title,
    [product.meta_title, product.title]
  );

  const seoDescription = useMemo(
    () => product.short_description ?? product.long_description ?? "",
    [product.short_description, product.long_description]
  );

  // const seoKeywords = useMemo(
  //   () => (product.visible_tags?.length ? product.visible_tags.join(",") : ""),
  //   [product.visible_tags]
  // );

  const seoKeywords = useMemo(
    () => parseVisibleTags(product.visible_tags).join(", "),
    [product.visible_tags]
  );

  const openGraphImage = useMemo(
    () => product.logo_url ?? logoSource,
    [product.logo_url, logoSource]
  );

  const breadcrumbPath = useMemo(
    () => [
      Paths.Frontend.HOME,
      product.course ? Paths.Frontend.AI_COURSES : Paths.Frontend.AI_TOOL,
      { title: product.title, href: product.url },
    ],
    [product.course, product.title, product.url]
  );

  const altToolsTitle = useMemo(
    () => "Alternative Tools for " + product.title,
    [product.title]
  );

  const featuredToolsTitle = "Featured Tools";

  /** -----------------------------
   * RENDER
   * ----------------------------- */

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        additionalMetaTags={[
          {
            name: "keywords",
            content: seoKeywords,
          },
        ]}
        openGraph={{
          type: "Product",
          title: product.title,
          description: seoDescription,
          images: [{ url: openGraphImage }],
          url: product.url,
        }}
      />

      <Layout.Base
        config={config}
        className="w-full flex-col justify-center lg:gap-6 gap-6 inline-flex my-8 max-w-content-width overflow-clip"
      >
        {/* BREADCRUMB */}
        <Breadcrumb path={breadcrumbPath} />

        <div className="w-full flex-col justify-center md:gap-10 gap-default-vertical-gap inline-flex">
          {/* HERO */}
          <Hero data={product} disableClaimButton={props.disableClaimButton} />

          <div className="flex flex-col w-full gap-5 mb-5">
            <div className="flex flex-row justify-center items-start gap-4 w-full">
              {/* PRODUCT BODY */}
              <div className="lg:mr-6 w-full lg:max-w-7.5/10">
                <ProductBody
                  config={config}
                  product={product}
                  alternateProductList={props.alternateProductList}
                  featuredProductList={props.featuredProductList}
                  reviews={props.reviews}
                  disableEmbedSection={props.disableEmbedSection}
                />
              </div>

              {/* FEATURED TOOLS SIDEBAR (Desktop) */}
              <div className="lg:block hidden w-full max-w-2.5/10">
                <ToolListing.Vertical productList={props.featuredProductList} />
              </div>
            </div>

            {/* ALTERNATIVE TOOLS */}
            {/* <Section id="Alternative Tools" title={altToolsTitle}>
              <ToolListing.Horizontal
                productList={props.alternateProductList}
              />
            </Section> */}
            {props.alternateProductList.length > 0 && (
              <Section id="Alternative Tools" title={altToolsTitle}>
                <ToolListing.Horizontal
                  productList={props.alternateProductList}
                />
              </Section>
            )}

            {/* FEATURED TOOLS (Mobile Only) */}
            <Section
              id="Featured Tools"
              title={featuredToolsTitle}
              className="lg:hidden"
            >
              <ToolListing.Horizontal productList={props.featuredProductList} />
            </Section>
          </div>
        </div>
      </Layout.Base>
    </>
  );
});
Page.displayName = "Page";

export { Page };
export type { PageProps };