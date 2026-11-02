import { Constants } from "@/contants";
import { Link } from "@/ui/components/components";
import { BreadcrumbJsonLd } from "next-seo";
import { MdKeyboardArrowRight } from "react-icons/md";
import { twMerge } from "tailwind-merge";

interface BreadcrumbPath {
  title: string;
  href: string;
}
const Breadcrumb = (props: { className?: string; path: BreadcrumbPath[] }) => {
  return (
    <>
      <BreadcrumbJsonLd
        itemListElements={props.path.map((e, i) => ({
          position: i + 1,
          name: e.title,
          id: e.href,
          item: e.href,
        }))}
      />
      <div
        className={twMerge(
          "flex w-full justify-start items-center text-md text-gray-600 gap-1",
          props.className
        )}
      >
        {props.path.map((e, i: number) => (
          <>
            <Link
              href={e.href}
              className={twMerge(
                i === props.path.length - 1 ? "line-clamp-1" : ""
              )}
              key={`${i}-link`}
            >
              {e.title}
            </Link>{" "}
            {i !== props.path.length - 1 && (
              <MdKeyboardArrowRight key={`${i}-arrow`} />
            )}
          </>
        ))}
      </div>
    </>
  );
};

export { Breadcrumb };
export type { BreadcrumbPath };
