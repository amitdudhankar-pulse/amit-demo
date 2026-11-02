// import { getAssetPathFromID } from "@/contants";
// import { File } from "@/lib/lib";
// import { Link } from "@/ui/components/components";

// export default function Logo(props: {
//   responsive?: boolean;
//   mobileLogo: File;
//   desktopLogo: File;
// }) {
//   return (
//     <Link noUnderline className="w-12 md:w-[240px]" href="/">
//       <img
//         className={`w-full max-w-52 object-center ${
//           !!props.responsive ? "md:block hidden" : "block"
//         }`}
//         src={getAssetPathFromID(props.desktopLogo.id, { quality: 50 })}
//         alt={props.desktopLogo.title ?? ""}
//       />
//       {!!props.responsive && (
//         <img
//           className="w-12 object-center block md:hidden"
//           src={getAssetPathFromID(props.mobileLogo.id)}
//           alt={props.mobileLogo.title ?? ""}
//         />
//       )}
//     </Link>
//   );
// }


import { getAssetPathFromID } from "@/contants";
import { File } from "@/lib/lib";
import Image from "next/image";
import Link from "next/link";

export default function Logo(props: {
  responsive?: boolean;
  mobileLogo?: File | null;
  desktopLogo?: File | null;
}) {
  const desktopSrc =
    getAssetPathFromID(props.desktopLogo?.id ?? "", { quality: 50 }) ??
    "/logo.svg";

  const mobileSrc =
    getAssetPathFromID(props.mobileLogo?.id ?? "", { quality: 50 }) ??
    "/static/logo_small.svg";

  return (
    <Link
      href="/"
      prefetch
      scroll
      aria-label="Go to home page"
      className="w-12 md:w-[240px] relative flex items-center"
    >
      {/* DESKTOP LOGO */}
      <div
        className={`w-full max-w-52 ${
          props.responsive ? "hidden md:block" : "block"
        }`}
      >
        <Image
          src={desktopSrc}
          alt={props.desktopLogo?.title ?? ""}
          width={208}          // matches max-w-52 (52 * 4)
          height={52}
          className="w-full object-center"
        />
      </div>

      {/* MOBILE LOGO */}
      {!!props.responsive && (
        <div className="w-12 md:hidden">
          <Image
            src={mobileSrc}
            alt={props.mobileLogo?.title ?? ""}
            width={48}
            height={48}
            className="w-full object-center"
          />
        </div>
      )}
    </Link>
  );
}
