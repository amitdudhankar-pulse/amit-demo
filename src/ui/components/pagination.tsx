// import { useRouter } from "next/router";
// import ResponsivePagination from "react-responsive-pagination";
// import "react-responsive-pagination/themes/classic.css";

// const Pagination = (props: {
//   className?: string;
//   current: number;
//   total: number;
//   pageUrlPrefix: string;
// }) => {
//   const router = useRouter();
//   return (
//     <ResponsivePagination
//       extraClassName={"!text-app-primary"}
//       pageLinkClassName="page-link cursor-pointer !text-app-primary !border-none"
//       activeItemClassName="*:!bg-primary *:!outline-primary *:!text-white *:z-10"
//       linkHref="omit"
//       current={props.current}
//       total={props.total}
//       onPageChange={(i) => {
//         router.push(props.pageUrlPrefix + "/" + i);
//       }}
//       maxWidth={600}
//     />
//   );
// };

// export { Pagination };

import { useRouter } from "next/router";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";

interface PaginationProps {
  className?: string;
  current: number;
  total: number;
  pageUrlPrefix: string;
  onPageChange?: (page: number) => void; // NEW
}

const Pagination = ({
  current,
  total,
  pageUrlPrefix,
  onPageChange,
}: PaginationProps) => {
  const router = useRouter();

  return (
    <ResponsivePagination
      linkHref="omit"
      current={current}
      total={total}
      onPageChange={(i) => {
        if (onPageChange) return onPageChange(i); // CSR MODE
        router.push(`${pageUrlPrefix}/${i}`); // SSR MODE
      }}
      maxWidth={600}
    />
  );
};

export { Pagination };
