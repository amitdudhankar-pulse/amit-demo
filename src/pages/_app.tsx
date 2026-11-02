// import "@/styles/globals.css";
// import { AppStateProvider } from "@/ui/logic/logic";
// import type { AppProps } from "next/app";
// import Head from "next/head";
// import { Inter, Roboto, Rokkitt, Poppins } from "next/font/google";
// import React, { useEffect, useState } from "react";
// import Script from "next/script";

// // Fonts
// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   display: "swap",
//   preload: true,
// });
// const rokitt = Rokkitt({
//   variable: "--font-rokitt",
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   display: "swap",
//   preload: false,
// });
// const poppins = Poppins({
//   variable: "--font-poppins",
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   display: "swap",
//   preload: false,
// });
// const roboto = Roboto({
//   variable: "--font-roboto",
//   subsets: ["latin"],
//   weight: ["100", "300", "400", "500", "700", "900"],
//   display: "swap",
//   preload: false,
// });

// const fonts = [inter, rokitt, poppins, roboto];

// export default function App({ Component, pageProps }: AppProps) {
//   const [isClient, setIsClient] = useState(false);

//   // ✅ ensures that browser-only code runs only on client
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     // Render a static fallback to prevent hydration mismatch
//     return (
//       <main className={fonts.map((f) => f.className).join(" ")}>
//         <Head>
//           <meta
//             name="viewport"
//             content="width=device-width, initial-scale=1.0"
//           />
//         </Head>
//         <div style={{ visibility: "hidden" }}>Loading...</div>
//       </main>
//     );
//   }

//   return (
//     <>
//       <Head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       </Head>
//       <main className={fonts.map((f) => f.className).join(" ")}>
//         <AppStateProvider>
//           <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

//           <Component {...pageProps} />
//         </AppStateProvider>
//       </main>
//     </>
//   );
// }


import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";

import { AppStateProvider } from "@/ui/logic/logic";
import { AuthProvider } from "@/ui/logic/auth";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const win = window as Window & { __assetRecoveryDone?: boolean };
    if (win.__assetRecoveryDone) {
      return;
    }
    win.__assetRecoveryDone = true;
    let watchdog: number | undefined;
    let stopWatchdog: number | undefined;
    let lateCheck: number | undefined;

    const forceVisible = () => {
      const nodes: (HTMLElement | null)[] = [
        document.documentElement,
        document.body,
        document.getElementById("__next"),
        document.querySelector("main"),
      ];

      nodes.forEach((node) => {
        if (!node) return;
        node.style.visibility = "visible";
        node.style.opacity = "1";
      });
    };

    const reloadNextStyles = () => {
      const links = Array.from(
        document.querySelectorAll<HTMLLinkElement>(
          'link[rel="stylesheet"][href*="/_next/static/css/"]'
        )
      );

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;
        if (link.sheet) return;

        const retry = document.createElement("link");
        retry.rel = "stylesheet";
        retry.href = href.includes("?")
          ? `${href}&v=${Date.now()}`
          : `${href}?v=${Date.now()}`;
        retry.setAttribute("data-retry", "asset-recovery");
        link.parentNode?.insertBefore(retry, link.nextSibling);
      });
    };

    const recoverIfBlank = () => {
      const root = document.getElementById("__next");
      const stuck =
        !root ||
        root.childElementCount === 0 ||
        root.getBoundingClientRect().height < 40;

      if (stuck) {
        reloadNextStyles();
        forceVisible();
      }
    };

    const isHealthy = () => {
      const root = document.getElementById("__next");
      if (!root) return false;
      if (root.childElementCount === 0) return false;
      if (root.getBoundingClientRect().height < 40) return false;

      const bodyStyle = window.getComputedStyle(document.body);
      const rootStyle = window.getComputedStyle(root);
      if (bodyStyle.display === "none" || bodyStyle.visibility === "hidden") {
        return false;
      }
      if (rootStyle.display === "none" || rootStyle.visibility === "hidden") {
        return false;
      }

      return true;
    };

    const startWatchdog = () => {
      if (watchdog) return;
      watchdog = window.setInterval(() => {
        if (isHealthy()) {
          if (watchdog) window.clearInterval(watchdog);
          if (stopWatchdog) window.clearTimeout(stopWatchdog);
          return;
        }
        recoverIfBlank();
      }, 1500);

      stopWatchdog = window.setTimeout(() => {
        if (watchdog) window.clearInterval(watchdog);
      }, 15000);
    };

    const maybeRecover = () => {
      // Normal path: do absolutely nothing.
      if (isHealthy()) return;
      recoverIfBlank();
      startWatchdog();
    };

    if (document.readyState === "complete") {
      maybeRecover();
    } else {
      window.addEventListener("load", maybeRecover, { once: true });
      // Backup check if load event is delayed or missed.
      lateCheck = window.setTimeout(maybeRecover, 5000);
    }

    return () => {
      window.removeEventListener("load", maybeRecover);
      if (watchdog) window.clearInterval(watchdog);
      if (stopWatchdog) window.clearTimeout(stopWatchdog);
      if (lateCheck) window.clearTimeout(lateCheck);
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main>
        <AuthProvider>
          <AppStateProvider>
            <Component {...pageProps} />
          </AppStateProvider>
        </AuthProvider>
      </main>
    </>
  );
}
