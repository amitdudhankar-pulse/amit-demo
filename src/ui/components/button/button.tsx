// import { Share, Bookmark } from "./image_button";
// import { ClassNameValue, twMerge } from "tailwind-merge";
// import {
//   Text,
//   Link,
//   CircularProgress,
//   ClickToOpenDialog,
// } from "@/ui/components/components";
// import { ElementType, useState } from "react";
// import { colors } from "@/../style_constants";
// import { Product, Review } from "@/lib/lib";
// import { Paths } from "@/contants";
// import { AuthControls } from "@/ui/logic/auth";
// import { IconType } from "react-icons/lib";
// import { FcGoogle } from "react-icons/fc";

// type Action =
//   | { type: "url"; url: string; underline?: boolean }
//   | { type: "callback"; onClick?: () => Promise<any> };

// const Button = {
//   Tag: (props: {
//     text: string;
//     key?: string;
//     href: string;
//     className?: string;
//   }) => {
//     return (
//       <Link noUnderline href={props.href}>
//         <div
//           key={props.key ?? props.text}
//           className={twMerge(
//             "lg:px-3 p-2 rounded-md shadow border border-primary justify-center items-center gap-5 flex hover:shadow-button",
//             props.className
//           )}
//         >
//           <div className="text-blue-500 lg:text-xl text-md font-medium font-roboto capitalize">
//             {props.text}
//           </div>
//         </div>
//       </Link>
//     );
//   },

//   Text: ({
//     size = "md",
//     ...props
//   }: {
//     as?: ElementType;
//     text: string;
//     key?: string;
//     action?: Action;
//     className?: string;
//     size?: "sm" | "md";
//     icon?: IconType;
//   }) => {
//     const IconComponent = props.icon;
//     const Component = props.as ?? "button";
//     var button = (
//       <Component
//         key={`${props.key}-button`}
//         className={twMerge(
//           "flex flex-row items-center gap-2 font-semibold text-blue-500",
//           size === "md" ? "text-xl" : "text-base",
//           props.className
//         )}
//         onClick={() => {
//           if (props.action?.type === "callback") props.action?.onClick?.();
//         }}
//       >
//         {!!IconComponent && <IconComponent size={20} />}
//         {props.text}
//       </Component>
//     );

//     if (props.action?.type === "url")
//       button = (
//         <Link
//           href={props.action.url}
//           key={`${props.key}-link`}
//           noUnderline={!props.action.underline}
//         >
//           {button}
//         </Link>
//       );
//     return button;
//   },

//   Primary: ({
//     className,
//     text,
//     action,
//     size = "md",
//     ...props
//   }: {
//     className?: string;
//     disabledClassName?: ClassNameValue;
//     text: string;
//     action?: Action;
//     disable?: boolean;
//     size?: "md" | "sm";
//   }) => {
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const button = (
//       <Text.H3
//         as="button"
//         className={twMerge(
//           size === "md" ? "px-10 py-2.5" : "px-5 py-2",
//           "h-fit w-fit",
//           "rounded-lg justify-center items-center gap-2 flex",
//           "text-white text-xl font-semibold",
//           "bg-primary",
//           !!props.disable
//             ? twMerge("bg-slate-400", props.disabledClassName)
//             : twMerge("cursor-pointer", "hover:shadow-button duration-200"),

//           className
//         )}
//         onClick={() => {
//           if (action?.type !== "callback") return;
//           setIsLoading(true);
//           action
//             .onClick?.()
//             .then((_) => setIsLoading(false))
//             .catch((e) => {
//               setIsLoading(false);
//               console.error(e);
//             });
//         }}
//       >
//         {isLoading ? (
//           <CircularProgress
//             color={colors.bgPrimary}
//             trackColor={colors.secondary}
//             isIndeterminate
//             size={size === "md" ? 7 : 7}
//           />
//         ) : (
//           text
//         )}
//       </Text.H3>
//     );

//     if (action?.type === "url" && !props.disable)
//       return (
//         <Link noUnderline href={action.url}>
//           {button}
//         </Link>
//       );

//     return button;
//   },

//   SecondaryBold: (props: { text: string; href: string }) => (
//     <Link noUnderline href={props.href}>
//       <div className="flex flex-col justify-center max-w-fit hover:shadow-button p-3 rounded-md border-2 border-sky-700 items-center">
//         <div className="text-sky-700 text-2xl font-bold font-roboto leading-7">
//           {props.text}
//         </div>
//       </div>
//     </Link>
//   ),

//   PrimaryBoundary: (props: {
//     text: string;
//     className?: string;
//     action?: Action;
//     disable?: boolean;
//   }) => {
//     return (
//       <Button.Primary
//         {...props}
//         className={twMerge(
//           "outline outline-2 rounded-lg ",

//           "outline-primary text-app-primary bg-bg-primary",
//           props.className
//         )}
//         disabledClassName={twMerge("outline-gray-400 bg-gray-400")}
//       />
//     );
//   },

//   Icon: ({
//     icon,
//     url,
//     size,
//     alt = "icon",
//   }: {
//     icon: string;
//     url: string;
//     size?: "small" | "medium";
//     alt?: string;
//   }) => {
//     const sizeClass = {
//       medium: "size-12",
//       small: "size-10",
//     }[size ?? "medium"];
//     return (
//       <Link noUnderline href={url} className="hover:bg-button-focus rounded-md">
//         <img
//           className={twMerge(
//             sizeClass,
//             "p-2 outline-[1.75px] rounded-lg bg-bg-primary"
//           )}
//           src={icon as string}
//           alt={alt}
//         />
//       </Link>
//     );
//   },

//   Share: Share,
//   Bookmark: Bookmark,

//   WriteAReview: (props: {
//     className?: string;
//     reviewList: Review[];
//     product: Product;
//   }) => {
//     return (
//       <AuthControls>
//         {({ user }) => (
//           <ClickToOpenDialog
//             dialogId={
//               !!user ? Paths.DIALOG_ID.REVIEW_FORM : Paths.DIALOG_ID.LOGIN
//             }
//             args={props.product}
//           >
//             <button
//               className={twMerge(
//                 "flex w-fit outline outline-2 outline-white rounded-md whitespace-nowrap font-semibold",
//                 "px-3 py-2",
//                 props.className
//               )}
//             >
//               {props.reviewList
//                 .map((e) => e.user_created)
//                 .includes(user?.id ?? "")
//                 ? "Update your review"
//                 : "Write a review"}
//             </button>
//           </ClickToOpenDialog>
//         )}
//       </AuthControls>
//     );
//   },

//   GoogleLogin: (props: { href: string }) => (
//     <a
//       className="flex flex-row gap-1.5 p-1 px-2.5 outline outline-1 outline-boundary rounded-md justify-center items-center w-fit cursor-pointer"
//       href={props.href}
//     >
//       <FcGoogle size={27} /> Login
//     </a>
//   ),
// };

// export { Button };
// export type { Action };

import { Share, Bookmark } from "./image_button";
import { twMerge, ClassNameValue } from "tailwind-merge";
import {
  Text,
  Link,
  CircularProgress,
  ClickToOpenDialog,
} from "@/ui/components/components";
import { ElementType, useState } from "react";
import { colors } from "@/../style_constants";
import { Product, Review } from "@/lib/lib";
import { Paths } from "@/contants";
import { AuthControls } from "@/ui/logic/auth";
import { IconType } from "react-icons/lib";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

type Action =
  | { type: "url"; url: string; underline?: boolean }
  | { type: "callback"; onClick?: () => Promise<any> };

const Button = {
  Tag: ({
    text,
    href,
    className,
  }: {
    text: string;
    href: string;
    className?: string;
  }) => (
    <Link noUnderline href={href}>
      <div
        className={twMerge(
          "lg:px-3 p-2 rounded-md shadow border border-primary justify-center items-center gap-5 flex hover:shadow-button",
          className
        )}
      >
        <div className="text-blue-500 lg:text-xl text-md font-medium font-roboto capitalize">
          {text}
        </div>
      </div>
    </Link>
  ),

  Text: ({
    text,
    action,
    as: Component = "button",
    className,
    size = "md",
    icon: IconComponent,
  }: {
    text: string;
    action?: Action;
    as?: ElementType;
    className?: string;
    size?: "sm" | "md";
    icon?: IconType;
  }) => {
    const button = (
      <Component
        className={twMerge(
          "flex items-center gap-2 font-semibold text-blue-500",
          size === "md" ? "text-xl" : "text-base",
          className
        )}
        onClick={() => action?.type === "callback" && action.onClick?.()}
      >
        {IconComponent && <IconComponent size={20} />}
        {text}
      </Component>
    );

    return action?.type === "url" ? (
      <Link noUnderline href={action.url}>
        {button}
      </Link>
    ) : (
      button
    );
  },

  Primary: ({
    text,
    action,
    className,
    disable,
    size = "md",
    disabledClassName,
  }: {
    text: string;
    action?: Action;
    className?: string;
    disable?: boolean;
    size?: "sm" | "md";
    disabledClassName?: ClassNameValue;
  }) => {
    const [isLoading, setIsLoading] = useState(false);

    const button = (
      <Text.H3
        as="button"
        className={twMerge(
          "rounded-lg justify-center items-center gap-2 flex font-semibold text-white",
          size === "md" ? "px-10 py-2.5 text-xl" : "px-5 py-2 text-lg",
          "h-fit w-fit",
          disable
            ? twMerge("bg-slate-400", disabledClassName)
            : "bg-primary cursor-pointer hover:shadow-button duration-200",
          className
        )}
        onClick={() => {
          if (action?.type !== "callback") return;
          setIsLoading(true);
          action.onClick?.().finally(() => setIsLoading(false));
        }}
      >
        {isLoading ? (
          <CircularProgress
            color={colors.bgPrimary}
            trackColor={colors.secondary}
            isIndeterminate
            size={7}
          />
        ) : (
          text
        )}
      </Text.H3>
    );

    return action?.type === "url" && !disable ? (
      <Link noUnderline href={action.url}>
        {button}
      </Link>
    ) : (
      button
    );
  },

  PrimaryBoundary: (props: {
    text: string;
    className?: string;
    action?: Action;
    disable?: boolean;
  }) => (
    <Button.Primary
      {...props}
      className={twMerge(
        "outline outline-2 rounded-lg outline-primary text-app-primary bg-bg-primary",
        props.className
      )}
      disabledClassName="outline-gray-400 bg-gray-400"
    />
  ),

  SecondaryBold: ({ text, href }: { text: string; href: string }) => (
    <Link noUnderline href={href}>
      <div className="flex flex-col justify-center max-w-fit hover:shadow-button p-3 rounded-md border-2 border-sky-700 items-center">
        <div className="text-sky-700 text-2xl font-bold font-roboto leading-7">
          {text}
        </div>
      </div>
    </Link>
  ),

  // Icon: ({
  //   icon,
  //   url,
  //   size = "medium",
  //   alt = "icon",
  // }: {
  //   icon: string;
  //   url: string;
  //   size?: "small" | "medium";
  //   alt?: string;
  // }) => {
  //   const sizeClass = size === "small" ? "size-10" : "size-12";
  //   return (
  //     <Link noUnderline href={url} className="hover:bg-button-focus rounded-md">
  //       <Image
  //         src={icon}
  //         alt={alt}
  //         width={size === "small" ? 40 : 48} // approximate px size based on your `sizeClass`
  //         height={size === "small" ? 40 : 48}
  //         className="p-2 outline-[1.75px] rounded-lg bg-bg-primary"
  //         unoptimized={false} // optional: true if you don't want optimization
  //       />
  //     </Link>
  //   );
  // },

  Icon: ({
    icon,
    url,
    size = "small",
    alt = "icon",
  }: {
    icon: string;
    url: string;
    size?: "small" | "medium";
    alt?: string;
  }) => {
    const boxSize = size === "small" ? "size-12" : "size-14"; // <- outer box always same
    const imgSize = size === "small" ? 24 : 32; // <- image sits inside

    return (
      <Link
        noUnderline
        href={url}
        className={twMerge(
          boxSize,
          "bg-bg-primary rounded-md flex items-center justify-center border border-boundary-light hover:bg-button-focus"
        )}
      >
        <Image
          src={icon}
          alt={alt}
          width={imgSize}
          height={imgSize}
          className="object-contain" // ❗ removes padding; scales nicely
          unoptimized={false}
        />
      </Link>
    );
  },

  Share,
  Bookmark,

  WriteAReview: ({
    className,
    reviewList,
    product,
  }: {
    className?: string;
    reviewList: Review[];
    product: Product;
  }) => (
    <AuthControls>
      {({ user }) => (
        <ClickToOpenDialog
          dialogId={user ? Paths.DIALOG_ID.REVIEW_FORM : Paths.DIALOG_ID.LOGIN}
          args={product}
        >
          <button
            className={twMerge(
              "flex w-fit outline outline-2 outline-white rounded-md whitespace-nowrap font-semibold px-3 py-2",
              className
            )}
          >
            {reviewList.some((r) => r.user_created === user?.id)
              ? "Update your review"
              : "Write a review"}
          </button>
        </ClickToOpenDialog>
      )}
    </AuthControls>
  ),

  // GoogleLogin: ({ href }: { href: string }) => (
  //   <a
  //     className="flex gap-1.5 p-1 px-2.5 outline outline-1 outline-boundary rounded-md justify-center items-center w-fit cursor-pointer"
  //     href={href}
  //   >
  //     <FcGoogle size={27} /> Login
  //   </a>
  // ),
  GoogleLogin: ({ onClick }: { onClick: () => void | Promise<void> }) => (
    <button
      onClick={onClick}
      className="flex gap-1.5 p-1 px-2.5 outline outline-1 outline-boundary rounded-md justify-center items-center w-fit cursor-pointer"
    >
      <FcGoogle size={27} /> Login
    </button>
  ),
};

export { Button };
export type { Action };
