// import { parseAMW } from "@/ui/components/components";
// import { Layout } from "@/ui/layouts/layouts";
// import { Configuration } from "@/lib/lib";
// import { twMerge } from "tailwind-merge";

// interface PageProps {
//   text: string;
//   config: Configuration;
// }

// const Page = (props: PageProps & { type?: "text-center" }) => (
//   <Layout.Base
//     config={props.config}
//     className={twMerge("max-w-content-width", "my-10")}
//   >
//     <div
//       className={twMerge(
//         "flex flex-col",
//         props.type === "text-center"
//           ? "text-center items-center justify-center"
//           : ""
//       )}
//     >
//       {parseAMW(props.text)}
//     </div>
//   </Layout.Base>
// );

// export { Page };
// export type { PageProps };

import { parseAMW } from "@/ui/components/utils/utils";
import { Layout } from "@/ui/layouts/layouts";
import { Configuration } from "@/lib/lib";
import { twMerge } from "tailwind-merge";

interface PageProps {
  text: string;
  config: Configuration;
}

const Page = (props: PageProps & { type?: "text-center" }) => (
  <Layout.Base
    config={props.config}
    className={twMerge("max-w-content-width", "my-10")}
  >
    {/* <div
      className={twMerge(
        "flex flex-col prose max-w-none",
        props.type === "text-center"
          ? "text-center items-center justify-center"
          : ""
      )}
    >
      {parseAMW(props.text)}
    </div> */}
    {/* <div
      className={twMerge(
        "flex flex-col prose max-w-none",
        // 👇 force image sizing ONLY inside textual pages
        "[&_img]:mx-auto [&_img]:max-w-[950px] [&_img]:w-full",
        "[&_img]:aspect-[950/550] [&_img]:object-contain",
        props.type === "text-center"
          ? "text-center items-center justify-center"
          : ""
      )}
    >
      {parseAMW(props.text)}
    </div> */}
    <div
      className={twMerge(
        "flex flex-col prose max-w-none",
        "[&_img]:mx-auto [&_img]:max-w-[500px] [&_img]:w-auto", // 👈 smaller width
        "[&_img]:aspect-[950/550] [&_img]:object-contain",
        props.type === "text-center"
          ? "text-center items-center justify-center"
          : ""
      )}
    >
      {parseAMW(props.text)}
    </div>
  </Layout.Base>
);

export { Page };
export type { PageProps };
