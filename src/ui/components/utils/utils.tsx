import parse, {
  attributesToProps,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import { Iframe, Text, Ahref } from "@/ui/components/components";

/**
 * Allowed override components
 */
interface TextReplacementOptions {
  h1?: React.ComponentType<any>;
  h2?: React.ComponentType<any>;
  h3?: React.ComponentType<any>;
  p?: React.ComponentType<any>;
  ul?: React.ComponentType<any>;
  li?: React.ComponentType<any>;
  ol?: React.ComponentType<any>;
  span?: React.ComponentType<any>; // ✅ ADD THIS
}

/**
 * Create safe HTML parsing options
 */
const createOptions = (
  opts: TextReplacementOptions
): HTMLReactParserOptions => {
  const options: HTMLReactParserOptions = {
    replace(domNode: any) {
      // -------------------------------
      // 1. Remove useless newline nodes
      // -------------------------------
      if (domNode.data === "\n") return <></>;

      // If text node or no attributes -> let parser render normally
      if (!domNode.attribs && !domNode.children) return;

      const tag = domNode.name?.toLowerCase();

      // // -------------------------------
      // // 2. Allow <span>, <strong>, <b>, <i>, etc. (inline tags)
      // // -------------------------------
      // const inlineTags = ["span", "strong", "b", "i", "em", "u"];
      // if (inlineTags.includes(tag)) {
      //   return <>{domToReact(domNode.children ?? [], options)}</>;
      // }

      // -------------------------------
      // 2. Inline tags WITH styles (span, strong, etc.)
      // -------------------------------
      if (tag === "span") {
        const props = attributesToProps(domNode.attribs || {});
        return (
          <span {...props}>{domToReact(domNode.children ?? [], options)}</span>
        );
      }

      const inlineTags = ["strong", "b", "i", "em", "u"];
      if (inlineTags.includes(tag)) {
        return <>{domToReact(domNode.children ?? [], options)}</>;
      }

      // -------------------------------
      // 3. Component overrides
      // -------------------------------
      let Component: React.ComponentType<any> | undefined;

      switch (tag) {
        case "iframe":
          Component = Iframe;
          break;
        case "a":
          Component = Ahref;
          break;
        case "h1":
          Component = opts.h1;
          break;
        case "h2":
          Component = opts.h2;
          break;
        case "h3":
          Component = opts.h3;
          break;
        case "p":
          Component = opts.p;
          break;
        case "ul":
          Component = opts.ul;
          break;
        case "ol":
          Component = opts.ol;
          break;
        case "li":
          Component = opts.li;
          break;
      }

      // If no replacement -> render default HTML
      if (!Component) return;

      const props = attributesToProps(domNode.attribs || {});
      if (tag !== "span") {
        delete props.style;
      }

      delete props.width;
      delete props.height;

      return (
        <Component {...props}>
          {domToReact(domNode.children ?? [], options)}
        </Component>
      );
    },
  };

  return options;
};

/**
 * Universal HTML parser wrapper
 */
const parseAMW = (
  text: unknown,
  overrideComponents?: TextReplacementOptions
) => {
  const raw = text ? String(text) : "";

  // If plain text → wrap with Paragraph
  if (!raw.includes("<")) {
    return <Text.P>{raw}</Text.P>;
  }

  return parse(
    raw,
    createOptions({
      h1: Text.H1,
      h2: Text.H2,
      h3: Text.H3,
      p: Text.P,
      ul: Text.UL,
      li: Text.LI,
      ol: Text.OL,
      ...overrideComponents,
    })
  );
};

/**
 * Convert any YT link to embed
 */
function convertToEmbedLink(url: string | null | undefined) {
  if (!url || typeof url !== "string") return null;

  const YT1 = /youtube\.com\/watch\?v=([^&]+)/;
  const YT2 = /youtu\.be\/([a-zA-Z0-9_-]+)/;

  let videoId: string | undefined;

  if (YT1.test(url)) videoId = url.match(YT1)?.[1];
  else if (YT2.test(url)) videoId = url.match(YT2)?.[1];
  else return null;

  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Delay utility
 */
const delayedPromise = (delay: number) =>
  new Promise((res) => setTimeout(res, delay));

export { parseAMW, convertToEmbedLink, delayedPromise };
