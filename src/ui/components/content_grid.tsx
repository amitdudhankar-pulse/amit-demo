import {
  Breadcrumb,
  Section,
  BreadcrumbPath,
} from "@/ui/components/components";
import { ItemListingAnimation } from "./animations";
import { useRef } from "react";

function ContentGrid<T>({
  title,
  dataList,
  breadcrumb,
  builder,
}: {
  title: string;
  dataList: T[];
  breadcrumb: BreadcrumbPath[];
  builder: (data: T, index: number, className?: string) => React.ReactElement;
}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  ItemListingAnimation.useAnimation({
    ref,
    selector: ".animation-card-identifier",
    from: ItemListingAnimation.DEFAULT.from,
  });
  return (
    <div className="flex flex-col self-stretch px-0 md:px-14 mt-2 lg:mt-1 w-full">
      <Breadcrumb className="mb-5" path={breadcrumb} />
      <Section id={title} title={title}>
        <div
          ref={ref}
          className="grid auto-rows-min xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4 justify-items-center items-center w-full"
        >
          {dataList.map((e, i) => builder(e, i, "animation-card-identifier"))}
        </div>
      </Section>
    </div>
  );
}

export { ContentGrid };
