import { CMS, Configuration } from "@/lib/lib";
import { ClassNameValue, twMerge } from "tailwind-merge";
import {
  Dialog,
  DialogProvider,
  Form,
  // NewsletterDialog,
  // ShareDialog,
  // UnderDev,
  Navbar,
  Footer,
  GoogleAnalytics,
  Hero2,
  Text,
  parseAMW,
  // LoginDialog,
  // Review,
  // CompareBottomPanel,
  // ErrorDialog,
  NextSeo,
  // ThankYouDialog,
} from "@/ui/components/components";
import { getAssetPathFromID, Paths } from "@/contants";
import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";


// Dynamic imports for all global dialogs/modals
const NewsletterDialog = dynamic(
  () => import("@/ui/dialog/dialog").then(mod => mod.NewsletterDialog),
  { ssr: false }
);
const ShareDialog = dynamic(
  () => import("@/ui/dialog/dialog").then(mod => mod.ShareDialog),
  { ssr: false }
);
const LoginDialog = dynamic(
  () => import("@/ui/dialog/dialog").then(mod => mod.LoginDialog),
  { ssr: false }
);
const UnderDev = dynamic(
  () => import("@/ui/dialog/dialog").then(mod => mod.UnderDev),
  { ssr: false }
);
const Review = dynamic(
  () => import("@/ui/dialog/dialog").then(mod => mod.Review.Dialog),
  { ssr: false }
);
const ErrorDialog = dynamic(
  () => import("@/ui/dialog/dialog").then(mod => mod.ErrorDialog.Dialog),
  { ssr: false }
);
const CompareBottomPanel = dynamic(
  () => import("@/ui/components/compare_panel").then(mod => mod.CompareBottomPanel),
  { ssr: false }
);
const ThankYouDialog = dynamic(
  () => import("@/ui/dialog/dialog").then(mod => mod.ThankYouDialog.Dialog),
  { ssr: false }
);


const Base = ({
  config,
  children,
  className,
}: {
  config: Configuration;
  children: any;
  className?: string;
}) => {
  const contentAreaClass = "md:px-14 px-4";

  // Delay non-critical visual work until after initial paint.
  const [showBg, setShowBg] = useState(false);
  const [mountOverlays, setMountOverlays] = useState(false);

  useEffect(() => {
    const onLoad = () => setShowBg(true);

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setMountOverlays(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <DialogProvider>
      <GoogleAnalytics id={config.google_analytics_id ?? ""} />
      <div
        className={twMerge(
          "flex flex-col p-0 m-0 h-fit min-h-screen flex-grow w-full overflow-x-clip font-roboto text-primary",
          "bg-center bg-contain"
        )}
      >
     {/* 🌈 GPU-friendly lazy background animation */}
        {showBg && (
          <>
          <div className="fixed inset-0 -z-30 pointer-events-none">
            {[
              "top-10 left-[100px] w-72 h-72 rounded-full",
              "top-28 right-[300px] w-96 h-96 rounded-full",
              "bottom-0 left-[250px] w-96 h-96 rounded-full",
              "bottom-0 right-[300px] w-72 h-72 rounded-full",
            ].map((e, i) => (
              <div
                key={i}
                className={twMerge(
                  "absolute",
                  "bg-primary-light-extra/40",
                  "blur-[80px]", // static blur only
                  e
                )}
              />
            ))}
          </div>
          {/* <div className="fixed inset-0 -z-30 pointer-events-none">
            {[
              "top-10 left-[100px] w-72 h-72 rounded-full",
              "top-28 right-[300px] w-96 h-96 rounded-full",
              "bottom-0 left-[250px] w-96 h-96 rounded-full",
              "bottom-0 right-[300px] w-72 h-72 rounded-full",
            ].map((e, i) => (
              <div
                key={i}
                className={twMerge(
                  "absolute",
                  "bg-primary-light-extra/40",
                  "blur-[80px]",              // reduced blur
                  "animate-bg-translate",
                  "will-change-transform",    // GPU hint
                  e
                )}
              />
            ))}
          </div> */}
          </>
        )}

        {mountOverlays && (
          <>
            <NewsletterDialog text={config.subscription_box_text} />
            <ShareDialog />
            <LoginDialog />
            <UnderDev />
            <Review />
            <ErrorDialog />
            <CompareBottomPanel />
            <ThankYouDialog />
          </>
        )}
        <Navbar config={config} className={twMerge(contentAreaClass)} />
        <div
          className={twMerge(
            "flex flex-col flex-grow w-full justify-center content-start mx-auto items-stretch",
            "lg:gap-10 gap-10",
            contentAreaClass,
            className
          )}
        >
          {children}
        </div>
        <Footer config={config} />
      </div>
    </DialogProvider>
  );
};

const General = (
  props: PropsWithChildren<{
    config: Configuration;
    meta?: { title?: string; description?: string };
    title: string;
    bgURL?: string;
    className?: string;
  }>
) => {
  return (
    <>
      <NextSeo
        title={props.meta?.title ?? ""}
        description={props.meta?.description ?? ""}
      />
      <Base config={props.config} className={props.className}>
        <Hero2 bgUrl={props.bgURL ?? ""}>{parseAMW(props.title)}</Hero2>
        {props.children}
      </Base>
    </>
  );
};

const Layout = {
  Base,
  General,
};

export { Layout };
