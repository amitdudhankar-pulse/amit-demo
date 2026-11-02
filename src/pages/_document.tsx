import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { getCssText } from "../../stitches.config";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" style={{ scrollBehavior: "smooth" }}>
        <Head>
          {/* ⚡ Load Google Tag Manager after page load */}
          <Script
            id="gtm-loader"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener("load", () => {
                  (function(w,d,s,l,i){
                    w[l]=w[l]||[];
                    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                    var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),
                        dl=l!='dataLayer'?'&l='+l:'';
                    j.async = true;
                    j.defer = true;
                    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                    f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-5K9Z9T3M');
                });
              `,
            }}
          />

          {/* ⚡ Google Fonts Preconnect */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

          {/* ⚡ Non-blocking Google Fonts */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto:wght@100;300;400;500;700;900&family=Rokkitt:ital,wght@0,100..900;1,100..900&family=Poppins:wght@100..900&family=Quicksand:wght@300..700&display=swap"
            media="print"
            onLoad={(e) => {
              const link = e.target as HTMLLinkElement;
              link.media = "all";
            }}
          />

          {/* ⚡ Stitches CSS */}
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>

        <body className="debug-screens" style={{ scrollBehavior: "smooth" }}>
          {/* GTM NoScript fallback */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-5K9Z9T3M"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>

          <Main />

          {/* ⚡ NextScript will use defer automatically if strategy is set */}
          <NextScript />
        </body>
      </Html>
    );
  }
}