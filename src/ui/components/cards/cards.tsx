// import { getAssetPathFromID, Paths } from "@/contants";
// import {
//   Blog,
//   Category,
//   CategoryV2,
//   Configuration,
//   Product,
//   Review,
// } from "@/lib/lib";
// import {
//   Button,
//   Rating,
//   Link,
//   ClickToOpenDialog,
//   Avatar,
//   delayedPromise,
// } from "@/ui/components/components";
// import { ReactElement, useEffect, useRef } from "react";
// import { Image, Text } from "@/ui/components/components";
// import NewsCard from "./newsCard";
// import { twMerge } from "tailwind-merge";
// import { Disclosure, DisclosureButton } from "@headlessui/react";
// import { ComparisonControls } from "@/ui/logic/comparison";
// import { IoIosBookmark } from "react-icons/io";
// import { colors } from "@/../style_constants";
// import { StatefulBuilder } from "@/ui/logic/logic";
// import { FaArrowRight, FaRegBookmark } from "react-icons/fa";

// const ContentCardV2 = (props: {
//   id?: string;
//   url: string;
//   imagePath?: string;
//   imageAltText?: string;
//   title: string;
//   description: string;
//   readMinutes?: number;
//   bottomComponent?: ReactElement;
//   disableMargins?: boolean;
//   key?: any;
//   className?: string;
// }) => {
//   return (
//     <div
//       className={twMerge(
//         "flex flex-col bg-white outline outline-1 outline-boundary-light rounded-xl overflow-clip",
//         "ease-out duration-150 sm:hover:shadow-focusCard sm:hover:scale-focusCard",
//         "h-full max-w-xl min-w-72 sm:min-w-[22rem] w-full",
//         "shadow-md",
//         props.disableMargins ? "" : "sm:my-7",
//         props.className
//       )}
//       key={props.key}
//     >
//       <Link className="flex" noUnderline href={props.url}>
//         <img
//           className="aspect-[16/9]"
//           loading="lazy"
//           src={props.imagePath}
//           alt={props.imageAltText ?? ""}
//         />
//       </Link>
//       <div className="flex flex-col gap-3 p-4 h-full">
//         <Text.CardTitle
//           title={props.title}
//           href={props.url}
//           lineClamp="line-clamp-2"
//           className="text-left"
//         />
//         {props.readMinutes && (
//           <span className="text-left font-roboto text-gray-500 text-sm font-normal">
//             {props.readMinutes} min read
//           </span>
//         )}
//         <div className="flex flex-col h-full justify-between">
//           <Text.CardDescription>{props.description}</Text.CardDescription>
//           {props.bottomComponent}
//           {/* <div className="flex justify-end items-end text-primary mt-6">
//               Read more
//             </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ArticleCard = (props: {
//   className?: string;
//   blog: Blog;
//   disableMargins?: boolean;
//   key?: any;
// }) => {
//   const { title, description, image } = props.blog;
//   const url = `${Paths.Frontend.BLOG.href}/${props.blog.slug}`;
//   return (
//     <ContentCardV2
//       className={props.className}
//       key={props.key}
//       id={props.blog.id}
//       title={title}
//       description={description}
//       readMinutes={props.blog.read_minutes}
//       imagePath={getAssetPathFromID(props.blog.image?.id, { quality: 5 })}
//       imageAltText={props.blog.image?.title ?? ""}
//       url={url}
//       bottomComponent={
//         <Link
//           className="flex justify-end items-end text-primary mt-6"
//           href={url}
//           ariaLabel={`Read more about: ${props.blog.title}`}
//         >
//           <FaArrowRight
//             size={25}
//             className="p-1 rounded-md hover:bg-bg-primary-LIGHT"
//           />
//         </Link>
//       }
//       disableMargins={props.disableMargins}
//     />
//   );
// };

// const ArticleCard_Small = (props: Blog) => {
//   return (
//     <div className="w-full px-4 py-3 h-fit bg-white rounded-xl border border-zinc-400 flex-col justify-between items-start gap-4 inline-flex ease-out duration-150 sm:hover:shadow-focusCard sm:hover:scale-focusCard">
//       <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
//         <Text.CardTitle
//           title={props.title}
//           href={`${Paths.Frontend.BLOG.href}/${props.slug}`}
//           lineClamp="line-clamp-2"
//         />
//       </div>
//     </div>
//   );
// };

// const ToolCard_Small = (props: Product & { className?: string }) => {
//   const logoSource = getAssetPathFromID(props.logo?.id) ?? props.logo_url ?? "";
//   const logoAltText = props.logo?.title ?? props.title;
//   return (
//     <div
//       className={twMerge(
//         "w-full h-fit p-2",
//         "flex-col inline-flex gap-4 justify-between items-start",
//         "bg-white rounded-xl border border-boundary-light",
//         "ease-out duration-150 sm:hover:shadow-focusCard sm:hover:scale-focusCard shadow-md",
//         props.className
//       )}
//     >
//       <div className="h-full self-stretch flex-col items-start gap-5 justify-between flex">
//         <div className="self-stretch justify-start items-center gap-5 inline-flex">
//           <span className="relative inline-block">
//             <Image
//               className="p-1 size-20 rounded-2xl object-contain outline outline-1 outline-boundary-light"
//               src={logoSource}
//               alt={logoAltText}
//               fallbackSrc={Paths.IMAGE.FALLBACK}
//             />
//             {!!props.verified && (
//               <img
//                 src={Paths.ICONS.VERIFIED}
//                 className="absolute -top-1 -right-2 size-6 justify-center items-center inline-flex"
//                 alt="icon"
//               />
//             )}
//           </span>
//           <div className="grow shrink basis-0 justify-center items-start gap-2.5 flex">
//             <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
//               <Text.CardTitle
//                 title={props.title}
//                 href={props.url}
//                 lineClamp="line-clamp-2"
//               />
//               <Rating rating={props.overall_satisfaction ?? 0} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ToolCard_FigmaExport_TailwindRounded = (
//   props: { className?: string } & Omit<
//     Omit<Product, "category_relations">,
//     "function_relations"
//   >
// ) => {
//   const logoSource = getAssetPathFromID(props.logo?.id) ?? props.logo_url ?? "";
//   const logoAltText = props.logo?.title ?? props.title;
//   return (
//     <div
//       className={twMerge(
//         "w-full max-w-80 min-w-72 px-3 py-2 bg-white rounded-xl border border-boundary-light flex-col justify-between items-start gap-4 inline-flex",
//         "ease-out duration-150 sm:hover:shadow-focusCard sm:hover:scale-focusCard",
//         "shadow-md",
//         props.className
//       )}
//     >
//       <div className="h-full self-stretch flex-col items-start gap-5 justify-between flex">
//         <div className="flex flex-col gap-3 self-stretch">
//           <div className="self-stretch justify-start items-center gap-3 inline-flex">
//             <span className="relative inline-block">
//               <Image
//                 className="p-1 size-20 min-w-20 rounded-2xl object-contain outline outline-1 outline-boundary-light"
//                 src={logoSource}
//                 alt={logoAltText}
//                 fallbackSrc={Paths.IMAGE.FALLBACK}
//               />

//               {!!props.verified && (
//                 <img
//                   alt="icon"
//                   src={Paths.ICONS.VERIFIED}
//                   className="absolute -top-1 -right-2 size-6 justify-center items-center inline-flex "
//                 />
//               )}
//             </span>
//             <div className="grow shrink basis-0 justify-center items-start gap-2.5 flex">
//               <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
//                 <Text.CardTitle
//                   href={props.url}
//                   title={props.title}
//                   lineClamp="line-clamp-2"
//                   className="break-all"
//                 />
//                 <div className="justify-start items-start gap-2.5 inline-flex">
//                   <Rating rating={props.overall_satisfaction ?? 0} />
//                 </div>
//               </div>
//               <div className="flex-col justify-start items-center gap-2.5 inline-flex w-8">
//                 <Button.Bookmark productId={props.id} />
//                 <Button.Share url={props.url} />
//               </div>
//             </div>
//           </div>
//           <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
//             {props.pricing_mode && (
//               <>
//                 <img
//                   alt="icon"
//                   src={Paths.ICONS.DEAL}
//                   className="w-5 h-5 relative"
//                 />
//                 <div className="grow shrink basis-0 self-stretch text-emerald-500 text-lg font-medium font-roboto leading-snug">
//                   {props.pricing_mode.title}
//                 </div>
//               </>
//             )}
//           </div>
//           <Text.CardDescription>{props.short_description}</Text.CardDescription>
//         </div>
//         <div className="self-stretch flex-col justify-start items-start gap-3 flex">
//           <div className="self-stretch text-tertiary text-base font-normal font-roboto leading-tight line-clamp-2">
//             {props.visible_tags
//               ?.slice(0, 2)
//               .reduce((p, c, i) => `${i === 1 ? "#" : ""}${p} #${c}`)}
//           </div>
//         </div>
//       </div>
//       <div className="self-stretch justify-between items-center inline-flex">
//         {/* TODO: I don't like this elevation effect on button, since its on the card as well.*/}
//         <ComparisonControls>
//           {({ addProduct }) => (
//             <Button.Primary
//               text="Compare"
//               size="sm"
//               className="font-normal"
//               action={{
//                 type: "callback",
//                 onClick: async () =>
//                   addProduct({
//                     id: props.id,
//                     title: props.title,
//                     url: props.url,
//                     slug: props.slug,
//                     logo: props.logo,
//                     logo_url: props.logo_url,
//                   }),
//               }}
//             />
//           )}
//         </ComparisonControls>
//         <Link noUnderline href={props.url}>
//           <img
//             alt="icon"
//             src={Paths.ICONS.VISIT}
//             className="size-9 px-1.5 rounded-md justify-center items-center gap-2 flex hover:bg-button-focus"
//           />
//         </Link>
//       </div>
//     </div>
//   );
// };

// const CategoryCardV2 = ({
//   countSuffix = "Tools",
//   ...props
// }: {
//   category: CategoryV2;
//   toolCount: number;
//   className?: string;
//   countSuffix?: "Tools" | "Courses";
// }) => {
//   const icon = getAssetPathFromID(props.category.logo?.id ?? "");
//   return (
//     <Link
//       className="flex flex-col gap-1 text-center items-center"
//       href={`${Paths.Frontend.HOME.href}/${props.category.slug}`}
//     >
//       <img
//         className=" bg-primary-light w-44 aspect-square p-4 rounded-xl object-contain shadow-md"
//         src={icon}
//         alt={props.category.title}
//         fetchPriority="high"
//       />
//       <div className="justify-center items-start gap-2 flex h-full w-full">
//         <div className="flex-col justify-start items-start inline-flex">
//           <Text.CardTitle
//             title={props.category.title}
//             lineClamp="line-clamp-2"
//           />
//           <Text.Indicative className="text-text-primary-light">
//             {`${props.toolCount} ${countSuffix}`}
//           </Text.Indicative>
//         </div>
//       </div>
//     </Link>
//   );
// };

// const CategoryCard = ({
//   countSuffix = "Tools",
//   ...props
// }: {
//   category: CategoryV2;
//   toolCount: number;
//   className?: string;
//   countSuffix?: "Tools" | "Courses";
// }) => {
//   const icon = getAssetPathFromID(props.category.logo?.id ?? "");
//   return (
//     <div
//       className={twMerge(
//         "group w-full p-2 rounded-2xl bg-bg-primary items-center gap-2 flex",
//         "border border-white",
//         "shadow duration-100 hover:shadow-focusCard hover:scale-105",
//         props.className
//       )}
//     >
//       <img
//         className="w-16 h-full aspect-square p-0.5 rounded-xl object-contain"
//         src={icon}
//         alt={props.category.title}
//         fetchPriority="high"
//       />
//       <div className="justify-start items-center gap-2 flex h-full">
//         <div className="flex-col justify-start items-center inline-flex">
//           <Text.CardTitle
//             title={props.category.title}
//             href={`${Paths.Frontend.HOME.href}/${props.category.slug}`}
//             lineClamp="line-clamp-2"
//           />
//           <Text.Indicative className="text-text-primary-light">
//             {`${props.toolCount} ${countSuffix}`}
//           </Text.Indicative>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProductEmbedCard = (props: {
//   config: Configuration;
//   product: Product;
// }) => (
//   <div className="flex flex-row py-1 pr-2 gap-4 bg-bg-primary outline outline-1 outline-boundary rounded-lg w-fit max-w-screen-md items-center -outline-offset-1">
//     <img
//       className="size-16"
//       src={getAssetPathFromID(props.config.mobile_logo.id)}
//       alt={props.config.mobile_logo.title ?? ""}
//     />
//     <div className="flex flex-col h-fit">
//       <Text.Indicative>
//         {!!props.product.featured ? "Featured" : "Available"} on GroupifyAI
//       </Text.Indicative>
//       <span className="relative inline-block">
//         <Text.H2 className="font-roboto leading-8 line-clamp-1">
//           {props.product.title}
//         </Text.H2>
//         {!!props.product.verified && (
//           <img
//             alt="icon"
//             src={Paths.ICONS.VERIFIED}
//             className="absolute -top-[4px] -right-[2px] size-4 justify-center items-center inline-flex"
//           />
//         )}
//       </span>
//       <Rating rating={props.product.overall_satisfaction ?? 0} />
//     </div>
//     <div className="flex flex-col gap-1 w-fit items-center text-center">
//       <IoIosBookmark size={35} color={colors.primary} />
//       <Text.Indicative>({props.product.save_count})</Text.Indicative>
//     </div>
//   </div>
// );

// const ReviewCard = (props: { className?: string; data: Review }) => {
//   return (
//     <div
//       className={twMerge(
//         "w-full min-w-60 px-3 py-4 h-full bg-white rounded-lg border border-boundary flex-col justify-between items-start gap-2 inline-flex",
//         "shadow-md",
//         props.className
//       )}
//     >
//       <>
//         <div className="flex w-full gap-3 items-center text-text-primary-light">
//           <Avatar round={true} name={props.data.created_by_name} size="55" />
//           <div className="flex flex-col gap-1 justify-start">
//             <Rating rating={props.data.overall_satisfaction ?? 0} />
//             <Text.P className="line-clamp-1">
//               {props.data.created_by_name}
//             </Text.P>
//           </div>
//         </div>
//         {props.data.comment && (
//           <StatefulBuilder<boolean> initialValue={true}>
//             {({ state: clampLine, setState }) => {
//               const textLimit = 75;
//               const comment = props.data.comment!;
//               var truncatedText = comment;
//               if (clampLine && comment.length > textLimit) {
//                 truncatedText = comment.slice(0, textLimit) + "...";
//               }
//               return (
//                 <>
//                   <Text.P>{truncatedText}</Text.P>
//                   {comment.length > textLimit && (
//                     <div className="flex w-full justify-end">
//                       <Button.Text
//                         className="font-normal"
//                         text={clampLine ? "Read more" : "Less"}
//                         size="sm"
//                         action={{
//                           type: "callback",
//                           onClick: async () => setState(!clampLine),
//                         }}
//                       />
//                     </div>
//                   )}
//                 </>
//               );
//             }}
//           </StatefulBuilder>
//         )}
//       </>
//     </div>
//   );
// };

// export {
//   ArticleCard,
//   ToolCard_FigmaExport_TailwindRounded as ToolCard,
//   ToolCard_Small as ToolCardSmall,
//   ContentCardV2,
//   ArticleCard_Small,
//   NewsCard,
//   CategoryCardV2,
//   CategoryCard,
//   ProductEmbedCard,
//   ReviewCard,
// };

import { getAssetPathFromID, Paths } from "@/contants";
import { Blog, Configuration, Product, Review } from "@/lib/lib";
import {
  BlogCardData,
  CategoryCardData,
  ToolCardData,
} from "@/lib/card_data";
import { Button, Rating, Link, Avatar } from "@/ui/components/components";
import { ReactElement } from "react";
import NextImage from "next/image";
import { Image, Text } from "@/ui/components/components";
import NewsCard from "./newsCard";
import { twMerge } from "tailwind-merge";
import { ComparisonControls } from "@/ui/logic/comparison";
import { IoIosBookmark } from "react-icons/io";
import { colors } from "@/../style_constants";
import { StatefulBuilder } from "@/ui/logic/logic";
import { FaArrowRight } from "react-icons/fa";

const ContentCardV2 = ({
  id,
  url,
  imagePath,
  imageAltText,
  title,
  description,
  readMinutes,
  bottomComponent,
  disableMargins,
  className,
  key,
}: {
  id?: string;
  url: string;
  imagePath?: string;
  imageAltText?: string;
  title: string;
  description: string;
  readMinutes?: number;
  bottomComponent?: ReactElement;
  disableMargins?: boolean;
  key?: any;
  className?: string;
}) => (
  <div
    key={key}
    className={twMerge(
      "flex flex-col bg-white outline outline-1 outline-boundary-light rounded-xl overflow-clip h-full max-w-xl min-w-72 sm:min-w-[22rem] w-full shadow-md ease-out duration-150 sm:hover:shadow-focusCard sm:hover:scale-focusCard",
      disableMargins ? "" : "sm:my-7",
      className
    )}
  >
    <Link className="flex" href={url} aria-label={imageAltText ?? "card image"}>
      {/* Responsive Image Wrapper */}
      <div className="relative aspect-[16/9] w-full">
        <NextImage
          // src={imagePath}
          src={imagePath || "/static/fallback.webp"} // ✅ fallback path in /public folder
          alt={imageAltText ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={false} // or true if it's above the fold
        />
      </div>
    </Link>
    <div className="flex flex-col gap-3 p-4 h-full">
      <Text.CardTitle
        title={title}
        href={url}
        lineClamp="line-clamp-2"
        className="text-left"
      />
      {readMinutes && (
        <span className="text-left font-roboto text-gray-500 text-sm font-normal">
          {readMinutes} min read
        </span>
      )}
      <div className="flex flex-col h-full justify-between">
        <Text.CardDescription>{description}</Text.CardDescription>
        {bottomComponent}
      </div>
    </div>
  </div>
);

const ArticleCard = ({
  blog,
  className,
  disableMargins,
  key,
}: {
  blog: BlogCardData;
  className?: string;
  disableMargins?: boolean;
  key?: any;
}) => {
  const url = `${Paths.Frontend.BLOG.href}/${blog.slug}`;
  return (
    <ContentCardV2
      className={className}
      key={key}
      id={String(blog.id)}
      title={blog.title}
      description={blog.description}
      readMinutes={blog.read_minutes ?? undefined}
      imagePath={getAssetPathFromID(blog.image?.id, { quality: 5 })}
      imageAltText={blog.image?.title ?? ""}
      url={url}
      bottomComponent={
        <Link
          className="flex justify-end items-end text-primary mt-6"
          href={url}
          ariaLabel={`Read more about: ${blog.title}`}
        >
          <FaArrowRight
            size={25}
            className="p-1 rounded-md hover:bg-bg-primary-LIGHT"
          />
        </Link>
      }
      disableMargins={disableMargins}
    />
  );
};

const ArticleCard_Small = (props: Blog) => (
  <div className="w-full px-4 py-3 h-fit bg-white rounded-xl border border-zinc-400 flex-col justify-between items-start gap-4 inline-flex ease-out duration-150 sm:hover:shadow-focusCard sm:hover:scale-focusCard">
    <Text.CardTitle
      title={props.title}
      href={`${Paths.Frontend.BLOG.href}/${props.slug}`}
      lineClamp="line-clamp-2"
    />
  </div>
);

const ToolCard_Small = ({
  logo,
  logo_url,
  verified,
  title,
  url,
  overall_satisfaction,
  className,
  ...props
}: Product & { className?: string }) => {
  const logoSrc = getAssetPathFromID(logo?.id) ?? logo_url ?? "";
  return (
    <div
      className={twMerge(
        "w-full h-fit p-2 flex-col inline-flex gap-4 justify-between items-start bg-white rounded-xl border border-boundary-light ease-out duration-150 sm:hover:shadow-focusCard sm:hover:scale-focusCard shadow-md",
        className
      )}
    >
      <div className="h-full self-stretch flex-col items-start gap-5 justify-between flex">
        <div className="self-stretch justify-start items-center gap-5 inline-flex">
          <span className="relative inline-block">
            <Image
              className="p-1 size-20 rounded-2xl object-contain outline outline-1 outline-boundary-light"
              src={logoSrc}
              alt={logo?.title ?? title}
              fallbackSrc={Paths.IMAGE.FALLBACK}
            />
            {verified && (
              <NextImage
                src={Paths.ICONS.VERIFIED as string}
                alt="Verified icon"
                width={24}
                height={24}
                className="absolute -top-1 -right-2 size-6 justify-center items-center inline-flex"
              />
            )}
          </span>
          <div className="grow shrink basis-0 justify-center items-start gap-2.5 flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
              <Text.CardTitle
                title={title}
                href={url}
                lineClamp="line-clamp-2"
              />
              <Rating rating={overall_satisfaction ?? 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCard_FigmaExport_TailwindRounded = ({
  logo,
  logo_url,
  verified,
  title,
  url,
  overall_satisfaction,
  pricing_mode,
  short_description,
  visible_tags,
  id,
  slug,
  className,
}: { className?: string } & ToolCardData) => {
  const logoSrc = getAssetPathFromID(logo?.id) ?? logo_url ?? "";
  return (
    <div
      className={twMerge(
        "w-full max-w-80 min-w-72 px-3 py-2 bg-white rounded-xl border border-boundary-light flex-col justify-between items-start gap-4 inline-flex ease-out duration-150 sm:hover:shadow-focusCard sm:hover:scale-focusCard shadow-md",
        className
      )}
    >
      <div className="h-full self-stretch flex-col items-start gap-5 justify-between flex">
        <div className="flex flex-col gap-3 self-stretch">
          <div className="self-stretch justify-start items-center gap-3 inline-flex">
            <span className="relative inline-block">
              <Image
                className="p-1 size-20 min-w-20 rounded-2xl object-contain outline outline-1 outline-boundary-light"
                src={logoSrc}
                alt={logo?.title ?? title}
                fallbackSrc={Paths.IMAGE.FALLBACK}
              />
              {verified && (
                <NextImage
                  src={Paths.ICONS.VERIFIED}
                  alt="Verified icon"
                  width={24}
                  height={24}
                  className="absolute -top-1 -right-2 size-6 justify-center items-center inline-flex"
                />
              )}
            </span>
            <div className="grow shrink basis-0 justify-center items-start gap-2.5 flex">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
                <Text.CardTitle
                  href={url}
                  title={title}
                  lineClamp="line-clamp-2"
                  className="break-all"
                />
                <Rating rating={overall_satisfaction ?? 0} />
              </div>
              <div className="flex-col justify-start items-center gap-2.5 inline-flex w-8">
                <Button.Bookmark productId={id} />
                <Button.Share url={url} />
              </div>
            </div>
          </div>
          {pricing_mode && (
            <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
              <NextImage
                alt="icon"
                src={Paths.ICONS.DEAL}
                width={20}
                height={20}
                className="w-5 h-5 relative"
              />
              <div className="grow shrink basis-0 self-stretch text-emerald-500 text-lg font-medium font-roboto leading-snug">
                {pricing_mode.title}
              </div>
            </div>
          )}
          <Text.CardDescription>{short_description}</Text.CardDescription>
        </div>
        {/* <div className="self-stretch flex-col justify-start items-start gap-3 flex">
          <div className="self-stretch text-tertiary text-base font-normal font-roboto leading-tight line-clamp-2">
            {String(visible_tags)
              .replace(/[\[\]"]/g, "") // remove [, ], "
              .split(" ")              // split into tags
              .map((tag) => tag.trim())
              .filter(Boolean)
              .slice(0, 2)
              .map((tag) => `#${tag}`)
              .join(" ")}
          </div>
        </div> */}
        <div className="self-stretch flex-col justify-start items-start gap-3 flex">
          <div className="self-stretch text-tertiary text-base font-normal font-roboto leading-tight line-clamp-2">
            {String(visible_tags)
              .replace(/[\[\]"]/g, "") // remove [, ], "
              .split(",") // ✅ split by comma
              .map((tag) => tag.trim()) // remove extra spaces
              .filter(Boolean)
              .slice(0, 2)
              .map((tag) => `#${tag}`) // ✅ add # to each tag
              .join(" ")}
          </div>
        </div>
      </div>
      <div className="self-stretch justify-between items-center inline-flex">
        <ComparisonControls>
          {({ addProduct }) => (
            <Button.Primary
              text="Compare"
              size="sm"
              className="font-normal"
              action={{
                type: "callback",
                onClick: async () =>
                  addProduct({ id, title, url, slug, logo, logo_url }),
              }}
            />
          )}
        </ComparisonControls>
        <Link noUnderline href={url}>
          <NextImage
            alt="Visit icon"
            src={Paths.ICONS.VISIT}
            width={36} // same as size-9 → 9 * 4px = 36px
            height={36}
            className="px-1.5 rounded-md flex justify-center items-center gap-2 hover:bg-button-focus"
            priority={false}
            loading="lazy"
          />
        </Link>
      </div>
    </div>
  );
};

const CategoryCardV2 = ({
  category,
  toolCount,
  countSuffix = "Tools",
}: {
  category: CategoryCardData;
  toolCount: number;
  className?: string;
  countSuffix?: "Tools" | "Courses";
}) => {
  const icon = getAssetPathFromID(category.logo?.id ?? "");
  return (
    <Link
      className="flex flex-col gap-1 text-center items-center"
      href={`${Paths.Frontend.HOME.href}/${category.slug}`}
    >
      <NextImage
        src={icon ?? "/fallback-icon.png"}
        alt={category.title || "Category icon"}
        width={96} // w-44 → 44 * 4px = 176px
        height={96} // aspect-square keeps it equal height
        // width={176} // w-44 → 44 * 4px = 176px
        // height={176} // aspect-square keeps it equal height
        className="bg-primary-light p-4 rounded-xl object-contain shadow-md"
        decoding="async"
      />
      <div className="justify-center items-start gap-2 flex h-full w-full">
        <div className="flex-col justify-start items-start inline-flex">
          <Text.CardTitle title={category.title} lineClamp="line-clamp-2" />
          <Text.Indicative className="text-text-primary-light">{`${toolCount} ${countSuffix}`}</Text.Indicative>
        </div>
      </div>
    </Link>
  );
};

const CategoryCard = ({
  category,
  toolCount,
  countSuffix = "Tools",
  className,
}: {
  category: CategoryCardData;
  toolCount: number;
  className?: string;
  countSuffix?: "Tools" | "Courses";
}) => {
  const icon = getAssetPathFromID(category.logo?.id ?? "");
  return (
    <div
      className={twMerge(
        "group w-full p-2 rounded-2xl bg-bg-primary items-center gap-2 flex border border-white shadow duration-100 hover:shadow-focusCard hover:scale-105",
        className
      )}
    >
      <NextImage
        src={icon ?? "/static/fallback.webp"}
        alt={category.title || "Category icon"}
        width={64} // w-16 = 16 * 4 = 64px
        height={64} // aspect-square → equal height
        className="h-full p-0.5 rounded-xl object-contain"
        decoding="async"
      />
      <div className="justify-start items-center gap-2 flex h-full">
        <div className="flex-col justify-start items-center inline-flex">
          <Text.CardTitle
            title={category.title}
            href={`${Paths.Frontend.HOME.href}/${category.slug}`}
            lineClamp="line-clamp-2"
          />
          <Text.Indicative className="text-text-primary-light">{`${toolCount} ${countSuffix}`}</Text.Indicative>
        </div>
      </div>
    </div>
  );
};

const ProductEmbedCard = ({
  config,
  product,
}: {
  config: Configuration;
  product: Product;
}) => (
  <div className="flex flex-row py-1 pr-2 gap-4 bg-bg-primary outline outline-1 outline-boundary rounded-lg w-fit max-w-screen-md items-center -outline-offset-1">
    <NextImage
      src={getAssetPathFromID(config.mobile_logo?.id) ?? "/fallback-logo.png"}
      alt={config.mobile_logo?.title || "Mobile logo"}
      width={64} // size-16 → 16 * 4 = 64px
      height={64}
      className="size-16"
      loading="lazy"
      decoding="async"
    />
    <div className="flex flex-col h-fit">
      <Text.Indicative>
        {product.featured ? "Featured" : "Available"} on GroupifyAI
      </Text.Indicative>
      <span className="relative inline-block">
        <Text.H2 className="font-roboto leading-8 line-clamp-1">
          {product.title}
        </Text.H2>
        {product.verified && (
          <NextImage
            alt="Verified icon"
            src={Paths.ICONS.VERIFIED ?? "/fallback-icon.png"}
            width={16} // size-4 → 4 * 4 = 16px
            height={16}
            className="absolute -top-[4px] -right-[2px] inline-flex justify-center items-center"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        )}
      </span>
      <Rating rating={product.overall_satisfaction ?? 0} />
    </div>
    <div className="flex flex-col gap-1 w-fit items-center text-center">
      <IoIosBookmark size={35} color={colors.primary} />
      <Text.Indicative>({product.save_count})</Text.Indicative>
    </div>
  </div>
);

const ReviewCard = ({
  className,
  data,
}: {
  className?: string;
  data: Review;
}) => {
  const { created_by_name, comment, overall_satisfaction } = data;
  return (
    <div
      className={twMerge(
        "w-full min-w-60 px-3 py-4 h-full bg-white rounded-lg border border-boundary flex-col justify-between items-start gap-2 inline-flex shadow-md",
        className
      )}
    >
      <div className="flex w-full gap-3 items-center text-text-primary-light">
        <Avatar round name={created_by_name} size="55" />
        <div className="flex flex-col gap-1 justify-start">
          <Rating rating={overall_satisfaction ?? 0} />
          <Text.P className="line-clamp-1">{created_by_name}</Text.P>
        </div>
      </div>
      {comment && (
        <StatefulBuilder<boolean> initialValue={true}>
          {({ state: clampLine, setState }) => {
            const textLimit = 75;
            const truncatedText = comment
              ? clampLine && comment.length > textLimit
                ? comment.slice(0, textLimit) + "..."
                : comment
              : "";
            return (
              <>
                <Text.P>{truncatedText}</Text.P>
                {comment.length > textLimit && (
                  <div className="flex w-full justify-end">
                    <Button.Text
                      className="font-normal"
                      text={clampLine ? "Read more" : "Less"}
                      size="sm"
                      action={{
                        type: "callback",
                        onClick: async () => setState(!clampLine),
                      }}
                    />
                  </div>
                )}
              </>
            );
          }}
        </StatefulBuilder>
      )}
    </div>
  );
};

export {
  ArticleCard,
  ToolCard_FigmaExport_TailwindRounded as ToolCard,
  ToolCard_Small as ToolCardSmall,
  ContentCardV2,
  ArticleCard_Small,
  NewsCard,
  CategoryCardV2,
  CategoryCard,
  ProductEmbedCard,
  ReviewCard,
};
