import {
  createRef,
  ElementType,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
} from "react";
import { IoIosSearch } from "react-icons/io";
import {
  Tab as HTab,
  TabGroup as HTabGroup,
  TabList as HTabList,
  TabPanels as HTabPanels,
  TabPanel as HTabPanel,
} from "@headlessui/react";
import { Blog, Category, CategoryV2, Product, User } from "@/lib/lib";
import { Paths } from "@/contants";
import Logo from "./logo";
import { HorizontalScroller } from "./horizontal_scroller";
import { ContentGrid } from "./content_grid";
import { Action, Button } from "./button/button";
import { ImageWithFallback } from "./image";
import { useIntersection } from "@mantine/hooks";
import { twMerge } from "tailwind-merge";
import React from "react";
import {
  ArticleCard,
  ArticleCard_Small,
  CategoryCard,
  CategoryCardV2,
  ToolCard,
  ToolCardSmall,
} from "./cards/cards";
import { Text } from "./text";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";
import Link from "next/link";

import {
  FaAngleDown,
  FaChevronDown,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import StarRatings from "react-star-ratings";

interface TabProps {
  id?: string;
  tabHide?: boolean;
}
interface SectionProps {
  title: string;
  subtitle?: ReactElement | string;
  className?: string;
  insideSection?: { className?: string };
  slideIn?: boolean;
  mediaDecorator?: MediaDecoratorSrc;
  sideComponent?: ReactElement;
}

import {
  Menu as ChakraMenu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  ChakraProvider,
  theme as ChakraTheme,
} from "../components/chackraUiComponents/chackraCompReact";

export { ChakraProvider, ChakraTheme };

const Menu = (props: {
  children?: ({ isOpen }: { isOpen: boolean }) => ReactElement;
  closeOnSelect?: boolean;
}) => (
  <ChakraProvider theme={ChakraTheme}>
    <ChakraMenu closeOnSelect={props.closeOnSelect}>
      {props.children}
    </ChakraMenu>
  </ChakraProvider>
);

const SlideInAnimation = (props: PropsWithChildren<{ className?: string }>) => {
  const prevYRef = useRef<number | null>(null);
  const showRef = useRef<boolean>(false);
  const prevIsIntersectingRef = useRef<boolean>(false);
  const { ref, entry } = useIntersection({
    threshold: [0, 0.5, 1],
  });

  useEffect(() => {
    if (entry) {
      if (!prevYRef.current) prevYRef.current = entry.boundingClientRect.y;

      if (prevIsIntersectingRef.current !== entry.isIntersecting) {
        if (entry.boundingClientRect.y < prevYRef.current && !showRef.current) {
          showRef.current = true;
        }
        if (
          entry.boundingClientRect.y > prevYRef.current &&
          !entry.isIntersecting
        ) {
          showRef.current = false;
        }
      }
      prevIsIntersectingRef.current = entry.isIntersecting;
      prevYRef.current = entry.boundingClientRect.y;
      // console.log(entry.target.clientTop);
    }
  }, [entry]);
  return (
    <div
      ref={ref}
      className={twMerge(
        "h-full duration-300 ease-in",
        props.className,
        showRef.current
          ? "translate-y-0 opacity-100"
          : "translate-y-52 opacity-0"
      )}
    >
      {props.children}
    </div>
  );
};

const SlideIn = (props: PropsWithChildren<{ className?: string }>) => {
  return props.children;
  // <>
  // {React.Children.map(props.children, (e) => (
  //   <SlideInAnimation className={props.className}>
  //     {e}
  //     </SlideInAnimation>
  // ))}
  // </>
};

interface MediaDecoratorSrc {
  src: string;
  className?: string;
  showAt?: "sm" | "md" | "lg" | "xl";
  alt: string;
}

const MediaDecorator = {
  Decorator: (
    props: {
      mediaDecorator: MediaDecoratorSrc;
      className?: string;
    } & PropsWithChildren
  ) => {
    const { mediaDecorator } = props;

    return (
      <span className={twMerge("relative inline-block", props.className)}>
        {/* POSITIONED WRAPPER */}
        <span
          className={twMerge(
            "absolute",
            mediaDecorator.className,
            mediaDecorator.showAt
              ? `hidden ${mediaDecorator.showAt}:block`
              : ""
          )}
        >
          <Image
            src={mediaDecorator.src}
            alt={mediaDecorator.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </span>

        {props.children}
      </span>
    );
  },

  Underline: (props: PropsWithChildren) => {
    return (
      <MediaDecorator.Decorator
        mediaDecorator={{
          src: "/static/svg/underline.svg",
          className:
            "h-[50px] w-[150px] bottom-[-30px] left-[-35px]",
          showAt: "md",
          alt: "underline",
        }}
      >
        {props.children}
      </MediaDecorator.Decorator>
    );
  },
};

const Section: React.FC<SectionProps & PropsWithChildren & TabProps> = ({
  id,
  title,
  subtitle,
  className,
  children,
  tabHide,
  mediaDecorator,
  sideComponent,
  insideSection,
}) => {
  const Title = () => <Text.H2>{title}</Text.H2>;

  return (
    // TODO: Remove this extra div
    // TODO: The class-name argument probably should not be used. In the current scenario,
    // the classNames will also affect the positioning and rendering of the title & subtitle (which should only be controlled by section itself).
    // The className should only affect the rendering of the children of Section component
    <div className={twMerge(tabHide ? "hidden" : "", "h-full", className)}>
      <section
        id={id}
        className={twMerge(
          "flex flex-col gap-3.5 h-full items-center",
          insideSection?.className
        )}
      >
        <div
          className={twMerge("flex flex-col gap-1 h-fit items-center w-full")}
        >
          <div className="flex justify-between items-start w-full">
            {!!mediaDecorator ? (
              <MediaDecorator.Decorator mediaDecorator={mediaDecorator}>
                <Title />
              </MediaDecorator.Decorator>
            ) : (
              <span>
                <Title />
              </span>
            )}

            {sideComponent}
          </div>
          {!!subtitle && (
            <div className="text-slate-600 text-lg font-normal font-roboto leading-tight w-full text-left">
              {subtitle}
            </div>
          )}
        </div>
        {children}
      </section>
    </div>
  );
};

const ToolListing = {
  // Horizontal: (props: { productList: Product[]; className?: string }) => {
  //   return (
  //     <HorizontalScroller
  //       className={props.className}
  //       dataList={props.productList}
  //       builder={(e, _, className) => (
  //         <ToolCard className={className} key={e.id} {...e} />
  //       )}
  //     />
  //   );
  // },

  Horizontal: (props: { productList: Product[]; className?: string }) => {
    return (
      <HorizontalScroller
        className={props.className}
        dataList={props.productList}
        builder={(e, _, className) => (
          <ToolCard
            key={e.id}
            {...e}
            className={twMerge(
              "min-w-[300px] max-w-[300px]", // 🔥 THIS IS THE FIX
              className
            )}
          />
        )}
      />
    );
  },

  Vertical: (props: { className?: string; productList: Product[] }) => {
    return (
      <div
        className={twMerge(
          "flex flex-col gap-3 outline outline-boundary-light outline-1 p-3 rounded-lg",
          props.className
        )}
      >
        <Text.H2 className="font-bold">Featured Tools</Text.H2>
        {props.productList.map((tool, i) => {
          return <ToolCardSmall key={i} {...tool} />;
        })}
      </div>
    );
  },
};

const BlogListing = {
  Horizontal: (props: { blogList: Blog[] }) => {
    return (
      <HorizontalScroller
        dataList={props.blogList}
        builder={(e, _, className) => (
          <ArticleCard
            className={className}
            key={e.id}
            blog={e}
            disableMargins={true}
          />
        )}
      />
    );
  },

  Vertical: (props: { blogList: Blog[]; className?: string }) => {
    return (
      <div
        className={twMerge(
          "flex flex-col gap-5 outline outline-zinc-600 outline-1 px-5 py-5 rounded-lg",
          props.className
        )}
      >
        <Text.H2 className="font-bold">More Blogs</Text.H2>
        <div className="flex flex-col gap-5">
          {props.blogList.map((blog, index) => (
            <ArticleCard_Small key={index} {...blog} />
          ))}
        </div>
      </div>
    );
  },
};

const Tab = (props: TabProps & PropsWithChildren) => {
  return <div>{props.children}</div>;
};

const TabGroupVertical = ({
  className,
  children,
  additionalTabs = [],
}: {
  className?: string;
  children?:
    | React.ReactElement<TabProps>
    | Array<React.ReactElement<TabProps> | false>;
  additionalTabs?: string[];
}) => {
  const activeIndex = 0;
  var tabNameList: string[] = [];
  children = children;
  if (children instanceof Array) {
    tabNameList = children
      .filter((e) => !!e)
      .map((e) => e as React.ReactElement<TabProps>)
      .filter((e) => !e.props.tabHide && !!e.props.id)
      .map((e) => e.props.id as string);
  } else {
    if (children?.props.tabHide) tabNameList = [];
    else tabNameList = [children?.props.id ?? ""];
  }
  tabNameList = [...tabNameList, ...additionalTabs];
  return (
    <div className="flex flex-col">
      <div className="justify-start items-center inline-flex gap-1 flex-wrap">
        {tabNameList.map((e, i) => {
          return (
            <a
              href={`#${e}`}
              key={i}
              className={`px-4 py-2 ${
                i === activeIndex ? "bg-secondary" : ""
              } rounded-full justify-center items-center flex hover:bg-button-focus`}
            >
              <div className="text-center text-zinc-800 text-xl font-medium font-['Roboto'] leading-tight">
                {e}
              </div>
            </a>
          );
        })}
      </div>
      <div className="self-stretch h-px my-2 border border-boundary"></div>
      <div className={twMerge("flex flex-col", className)}>{children}</div>
    </div>
  );
};

const TabV2 = {
  Group: (
    props: PropsWithChildren & {
      vertical?: boolean;
      defaultIndex?: number;
      className?: string;
    }
  ) => (
    <HTabGroup
      defaultIndex={props.defaultIndex}
      vertical={props.vertical}
      className={twMerge(
        "flex flex-col gap-3 max-w-full w-full",
        props.className
      )}
    >
      {props.children}
    </HTabGroup>
  ),
  Panels: HTabPanels,
  Panel: HTabPanel,
  Button: (props: { key?: string | number; name: string }) => (
    <HTab
      key={props.key ?? props.name}
      className="px-4 py-1.5 ui-selected:bg-orange-400 rounded-full ui-not-selected:hover:bg-button-focus duration-500 outline-none"
    >
      <div className="text-center text-primary text-xl font-medium leading-tight">
        {props.name}
      </div>
    </HTab>
  ),
  TabList: (props: { list: string[]; underline?: boolean }) => (
    <div className="flex flex-col justify-start items-start gap-1 max-w-fit">
      <HTabList className="justify-start items-center inline-flex flex-wrap gap-1">
        {props.list.map((e, i) => {
          return <TabV2.Button key={i} name={e} />;
        })}
      </HTabList>
      {!!props.underline && (
        <div className="self-stretch h-px border border-boundary"></div>
      )}
    </div>
  ),
};

const TabGroup = {
  Vertical: TabGroupVertical,
  Stacked: TabGroupVertical,
};

const Rating = ({
  startEmptyColor = "#c2c2c2",
  ...props
}: {
  size?: number;
  rating: number;
  startEmptyColor?: string;
  onChange?: (value: number) => void;
}) => {
  var showHalfStar = (props.rating * 10) % 10 > 0;
  var fullStarRating = props.rating | 0;
  var remainingStar = 5 - fullStarRating - (showHalfStar ? 1 : 0);

  const size = props.size ?? 20;

  return (
    <StarRatings
      changeRating={props.onChange}
      rating={props.rating}
      starDimension={`${size}px`}
      starEmptyColor={startEmptyColor}
      starRatedColor="orange"
      starHoverColor="orange"
      starSpacing="1px"
    />
  );

  // TODO: We should probably get rid of the code below. But we need better color management

  return (
    <div className="flex gap-1 w-fit">
      {[...Array(fullStarRating)].map((_, i) => {
        return (
          <FaStar key={i} className="text-star" size={size} />
          // <img key={i} src={Paths.ICONS.FULL_STAR} alt={`Star ${i + 1}`} />
        );
      })}
      {showHalfStar && (
        <FaStarHalfAlt
          className="text-star"
          key={fullStarRating + 1}
          size={size}
        />
      )}
      {[...Array(remainingStar)].map((_, i) => {
        return (
          <FaRegStar key={i} className="text-star" size={size} />
          // <img key={i} src={Paths.ICONS.FULL_STAR} alt={`Star ${i + 1}`} />
        );
      })}
    </div>
  );
};

const Hero2 = (
  props: { className?: string; bgUrl: string } & PropsWithChildren
) => {
  return (
    <div
      className={twMerge(
        "min-h-[170px] content-center w-screen p-5 font-bold text-center justify-center",
        props.className
      )}
      style={{
        background: "url(" + props.bgUrl + ")",
      }}
    >
      <div className="max-w-content-width w-full m-auto flex flex-col gap-3">
        {props.children}
      </div>
    </div>
  );
};

const Banner = (props: {
  src: string;
  alt: string;
  onClick?: () => void | Promise<void>;
  className?: string;
}) => {
  return (
<div
  className={twMerge("w-full flex justify-center", props.className)}
  onClick={props.onClick}
>
  <div className="relative max-w-full xl:max-w-[70%] md:max-w-[90%] w-full">
    <Image
      src={props.src}
      alt={props.alt}
      fill
      sizes="(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 70vw"
      className="object-contain"
    />
  </div>
</div>
  );
};

const CategorySection = ({
  countSuffix = "Tools",
  type = "v1",
  ...props
}: {
  countSuffix?: "Tools" | "Courses";
  title: string;
  subtitle?: ReactElement | string;
  categories: CategoryV2[];
  className?: string;
  type?: "v1" | "v2";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const Card = type === "v1" ? CategoryCard : CategoryCardV2;
  const grid = twMerge(
    type === "v1"
      ? "w-full grid 2xl:grid-cols-5 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 gap-4 2xl:max-w-[95%]"
      : "w-fit grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 gap-x-32"
  );

  return (
    <Section
      id={props.title}
      title={props.title}
      subtitle={props.subtitle}
      className={twMerge("w-full items-center", props.className)}
    >
      <div
        ref={ref}
        className={twMerge("p-4 justify-items-center gap-4", grid)}
      >
        {props.categories.map((e, i) => (
          <Card
            className={"anim-card"}
            key={i}
            category={e}
            toolCount={e.products_count}
            countSuffix={countSuffix}
          />
        ))}
      </div>
    </Section>
  );
};

const SearchBox = (props: {
  className?: string;
  onSearch?: (query: string) => void;
  redirectTo?: string;
}) => {
  // TODO: Search functionality will probably require some/lot-of refactoring
  // because the way it's handling so much logic internally & then also providing onSearch callback
  // is counterintuitive
  const input = createRef<HTMLInputElement>();
  const router = useRouter();
  const query = useRef<string>("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = decodeURIComponent(searchParams.get("q") ?? "");
    if (searchQuery) {
      input.current!.value = searchQuery;
      query.current = searchQuery;
      if (searchQuery !== "") props.onSearch?.(query.current);
    }
  }, []);

  const handleSearch = () => {
    if (!!props.redirectTo) {
      let url = props.redirectTo + "?q=" + encodeURIComponent(query.current);
      router.push(url);
      return;
    }
    window.history.pushState(
      null,
      "",
      "?q=" + encodeURIComponent(query.current)
    );
    props.onSearch?.(query.current);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  return (
    <div
      className={twMerge(
        "flex-col justify-center items-center flex relative w-full",
        props.className
      )}
    >
      <div className="md:pb-16 pb-10 flex-col justify-center items-center md:gap-8 gap-5 flex w-full">
        <span className="w-full h-full sm:max-w-8/10 max-w-9/10">
          <div className="flex w-full justify-between items-center border border-boundary rounded-3xl bg-white">
            {/* TODO: The text & the placeholder are not alinged vertically center */}
            <input
              ref={input}
              type="search"
              placeholder="Search any AI Tools"
              className={twMerge(
                "w-full",
                "md:px-6 px-4 md:py-3 py-1",
                "rounded-l-3xl justify-between  placeholder:text-slate-400 text-xl font-medium focus:outline-none"
              )}
              onChange={(e) => {
                query.current = e.target.value;
              }}
              onKeyDown={handleKeyDown}
            />
            <IoIosSearch
              className="size-11 mr-2 p-2 hover:bg-button-focus rounded-full cursor-pointer"
              onClick={handleSearch}
            />
          </div>
        </span>
      </div>
    </div>
  );
};

const CustomLink = ({
  as: Component = Link,
  ...props
}: PropsWithChildren<{
  href: string;
  className?: string;
  noUnderline?: boolean;
  ariaLabel?: string;
  as?: ElementType;
}>) => {
  const appOrigin = new URL(Paths.Frontend.HOME.href).origin;
  const browserOrigin =
    typeof window !== "undefined" ? window.location.origin : undefined;

  let href = (props.href ?? "").trim();
  let external = false;

  if (href.startsWith(Paths.Frontend.HOME.href)) {
    href = href.replace(Paths.Frontend.HOME.href, "");
  }

  if (!href) {
    href = "/";
  } else if (href.startsWith("/")) {
    external = false;
  } else {
    try {
      const parsed = new URL(href, appOrigin);
      const isInternalOrigin =
        parsed.origin === appOrigin ||
        (!!browserOrigin && parsed.origin === browserOrigin);

      if (isInternalOrigin) {
        href = `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
      } else {
        external = true;
      }
    } catch {
      external = true;
    }
  }

  if (external)
    return (
      <a
        target="_blank"
        href={href}
        rel="noopener noreferrer"
        aria-label={props.ariaLabel}
        className={twMerge(
          !!props.noUnderline ? "" : "hover:underline decoration-text-primary",
          props.className
        )}
      >
        {props.children}
      </a>
    );

  return (
    <Component
      href={href ?? ""}
      aria-label={props.ariaLabel}
      className={twMerge(
        !!props.noUnderline ? "" : "hover:underline decoration-text-primary",
        props.className
      )}
    >
      {props.children}
    </Component>
  );
};

// TODO: Afref should be either used universally, or should be replaced with <Link>
const Ahref = (props: any) => (
  <a className="text-tertiary hover:underline" {...props} />
);
const Iframe = (props: any) => (
  <iframe
    className="w-full max-w-screen-md aspect-video h-80 sm:h-auto m-auto rounded-xl"
    {...props}
  />
);

function UserMenu(props: {
  className?: string;
  user: User;
  menuOptions: { title: string; onClick?: () => void; icon?: IconType }[];
}) {
  return (
    <Menu>
      {(_) => (
        <>
          <MenuButton>
            <Avatar
              round={true}
              name={`${props.user.firstname} ${props.user.lastname}`}
              size="40"
            />
          </MenuButton>
          <MenuList>
            {props.menuOptions.map((e, i) => (
              <MenuItem as={"button"} key={i} onClick={e.onClick}>
                <Button.Text
                  as="p"
                  className="font-normal text-base"
                  text={e.title}
                  icon={e.icon}
                />
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
}

const SMIcons = (props: { urlList: string[]; className?: string }) => {
  // const filteredList = props.urlList
  //   .filter((e) => !!e)
  //   .filter((e) => e !== "")
  //   .filter((e) => e.startsWith("https:"));
  const filteredList = props.urlList
    .filter(Boolean)
    .map((e) => e.trim())
    .filter((e) => e.startsWith("http"));

  // const [yt, ig, fb, pin, threads, x, linkedin, tiktok] = [
  //   "you",
  //   "instagram.com",
  //   "facebook",
  //   "pinterest",
  //   "threads",
  //   "x.com",
  //   "linkedin",
  //   "tiktok",
  // ].map((e) => filteredList.find((f) => f.includes(e)));
  const [yt, ig, fb, pin, threads, x, linkedin, tiktok] = [
    "you",
    "instagram.com",
    "facebook",
    "pinterest",
    "threads",
    "x.com",
    "linkedin",
    "tiktok",
  ].map((e) => filteredList.find((f) => f.toLowerCase().includes(e)));

  // const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  //   <div className="w-12 h-12 flex items-center justify-center">{children}</div>
  // );

  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-12 h-12 flex items-center justify-center">{children}</div>
  );

  return (
    <div
      className={twMerge(
        "justify-start items-end gap-1 flex flex-wrap",
        props.className
      )}
    >
      {!!yt && (
        <IconWrapper>
          <Button.Icon
            size="small"
            icon={Paths.ICONS.YOUTUBE}
            url={yt}
            alt="Youtube"
          />
        </IconWrapper>
      )}
      {/* {!!ig && (
        <Button.Icon
          size="small"
          icon={Paths.ICONS.IG}
          url={ig}
          alt="Instagram"
        />
      )} */}
      {!!ig && (
        <IconWrapper>
          <Button.Icon
            size="small"
            icon={Paths.ICONS.IG}
            url={ig}
            alt="Instagram"
          />
        </IconWrapper>
      )}

      {!!fb && (
        <IconWrapper>
          <Button.Icon
            size="small"
            icon={Paths.ICONS.FB}
            url={fb}
            alt="Facebook"
          />
        </IconWrapper>
      )}
      {!!pin && (
        <IconWrapper>
          <Button.Icon
            size="small"
            icon={Paths.ICONS.PINTEREST}
            url={pin}
            alt="Pinterest"
          />
        </IconWrapper>
      )}
      {!!threads && (
        <IconWrapper>
          <Button.Icon
            size="small"
            icon={Paths.ICONS.THREADS}
            url={threads}
            alt="Threads"
          />
        </IconWrapper>
      )}
      {!!x && (
        <IconWrapper>
          <Button.Icon size="small" icon={Paths.ICONS.X} url={x} alt="X" />
        </IconWrapper>
      )}
      {!!linkedin && (
        <IconWrapper>
          <Button.Icon
            size="small"
            icon={Paths.ICONS.LINKEDIN}
            url={linkedin}
            alt="LinkedIn"
          />
        </IconWrapper>
      )}
      {!!tiktok && (
        <IconWrapper>
          <Button.Icon
            size="small"
            icon={Paths.ICONS.TIKTOK}
            url={tiktok}
            alt="Tiktok"
          />
        </IconWrapper>
      )}
    </div>
  );
};

import { NextSeo, NextSeoProps } from "next-seo";

const NextSeoWrapper = (props: NextSeoProps) => {
  const router = useRouter();
  return (
    <NextSeo
      {...{
        ...props,
        canonical:
          props.canonical ?? `${Paths.Frontend.HOME.href}/${router.asPath}`,
        description: props.description?.slice(0, 160),
      }}
    />
  );
};

const ErrorMessage = (props: {
  className?: string;
  text: string | string[];
}) => {
  const renderMsg = props.text instanceof Array ? props.text : [props.text];

  return (
    <div
      className={twMerge(
        "flex flex-wrap gap-1.5 items-center w-full p-2 rounded-lg outline outline-1 outline-boundary-light bg-gray-200",
        props.className
      )}
    >
      <CiCircleInfo color="red" size={25} />
      {renderMsg.map((e, i) => (
        <Text.Indicative key={i} className="text-red-500 font-medium">
          {e}
        </Text.Indicative>
      ))}
    </div>
  );
};

import Footer from "./generalComponents/Footer";
import Navbar from "./generalComponents/Navbar";
import GoogleAnalytics from "./GoogleAnalytics";
import Avatar from "react-avatar";
import { CiCircleInfo } from "react-icons/ci";
import { IconType } from "react-icons/lib";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
export {
  ErrorMessage,
  NextSeoWrapper as NextSeo,
  SMIcons,
  Avatar,
  UserMenu,
  Footer,
  Navbar,
  GoogleAnalytics,
  Ahref,
  Iframe,
  Banner,
  Hero2,
  Section,
  // ToolCard,
  ToolListing,
  TabGroup,
  Tab,
  TabV2,
  Button,
  // ArticleCard,
  BlogListing,
  Rating,
  Logo,
  ContentGrid,
  ImageWithFallback as Image,
  SlideIn,
  CategorySection,
  MediaDecorator,
  SearchBox,
  CustomLink as Link,
};

export * from "./horizontal_scroller";
export type { MediaDecoratorSrc };
export * from "./cards/cards";
export * from "./text";
export * from "./../dialog/dialog";
export * from "./forms/forms";
export * from "./domain_components";
export * from "./utils/utils";
export * from "./breadcrumb";
export * from "./pagination";
export * from "./faqs";
export * from "./compare_panel";
export * from "./tool_filter";

export { Menu };
export {
  CircularProgress,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

export { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
// TODO: Over time, we should get rid of Chakra
