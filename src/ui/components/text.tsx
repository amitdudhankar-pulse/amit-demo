import { Link } from "@/ui/components/components";
import {
  DOMElement,
  ElementType,
  forwardRef,
  PropsWithChildren,
  RefObject,
} from "react";
import { twMerge } from "tailwind-merge";

const Text = {
  H1: (props: { className?: string } & PropsWithChildren) => (
    <h1 className={twMerge("text-5xl font-bold w-full", props.className)}>
      {props.children}
    </h1>
  ),
  H2: (props: { className?: string } & PropsWithChildren) => (
    <h2 className={twMerge("text-3xl font-bold w-full", props.className)}>
      {props.children}
    </h2>
  ),
  H3: (
    props: {
      className?: string;
      as?: ElementType;
      onClick?: () => void;
    } & PropsWithChildren
  ) => {
    const Component = props.as ?? "h3";
    return (
      <Component
        onClick={props.onClick}
        className={twMerge(
          "font-roboto md:text-lg text-lg font-semibold w-full",
          props.className
        )}
      >
        {props.children}
      </Component>
    );
  },

  P: forwardRef<
    HTMLDivElement,
    PropsWithChildren<{
      className?: string;
      as?: ElementType;
    }>
  >((props, ref) => {
    const Component = props.as ?? "p";
    return (
      <Component
        ref={ref}
        className={twMerge(
          "text-base font-normal leading-tight w-full",
          props.className
        )}
      >
        {props.children}
      </Component>
    );
  }),

  UL: (props: PropsWithChildren<{ className?: string }>) => (
    <Text.P
      as="ul"
      className={twMerge(
        "list-disc list-outside w-full pl-3 [&_ul]:pl-5",
        props.className
      )}
    >
      {props.children}
    </Text.P>
  ),
  OL: (props: PropsWithChildren<{ className?: string }>) => (
    <Text.P
      as="ol"
      className={twMerge(
        "list-decimal list-outside w-full pl-3 [&_ul]:pl-5",
        props.className
      )}
    >
      {props.children}
    </Text.P>
  ),
  LI: (props: PropsWithChildren<{ className?: string }>) => (
    <Text.P as="li" className={twMerge("list-item py-1", props.className)}>
      {props.children}
    </Text.P>
  ),

  PunchText: (props: PropsWithChildren<{ className?: string }>) => (
    <Text.H1
      className={twMerge(
        "md:text-8xl text-6xl font-extrabold font-rokkitt leading-tight",
        props.className
      )}
    >
      {props.children}
    </Text.H1>
  ),
  CardTitle: (props: {
    title: string;
    href?: string;
    lineClamp: "line-clamp-1" | "line-clamp-2" | "line-clamp-3";
    className?: string;
  }) => {
    // IMP: Bug: TODO: Why are we using `a` instead of `Link`. Here why:
    // When using search, the tool-cards are the result. And when these cards are clicked on, this link below gets triggered.
    // However, for some reason, using Next's Link messes with the browser's history/page stack in such a way, that after the tool
    // page opens up, clicking on the browser's back button does not take the user back to the search page. Instead, just the URL
    // changes and it sits there, doing nothing.
    // Using `a` instead of `Link` fixes that.
    const title = (
      <Text.H3 className={twMerge(props.lineClamp, props.className)}>
        {props.title}
      </Text.H3>
    );
    if (!!props.href)
      return (
        <a href={props.href} className="hover:underline">
          {title}
        </a>
      );
    return title;
  },
  CardDescription: (props: PropsWithChildren<{ className?: string }>) => (
    <Text.P className={twMerge("line-clamp-3 text-justify", props.className)}>
      {props.children}
    </Text.P>
  ),
  Indicative: (props: PropsWithChildren<{ className?: string }>) => (
    <Text.P className={twMerge("text-[14px]", props.className)}>
      {props.children}
    </Text.P>
  ),
};

// Using anonymous function in Text.P above causes it to not have the displayName property.
// Hence, add it manually.
Text.P.displayName = "P";

const ProductPageText = {
  ...Text,
  P: (props: PropsWithChildren<{ className?: string }>) => (
    <Text.P className={twMerge("text-xl", props.className)}>
      {props.children}
    </Text.P>
  ),
  LI: (props: PropsWithChildren) => (
    <Text.LI className="text-xl">{props.children}</Text.LI>
  ),
};

export { Text, ProductPageText };
