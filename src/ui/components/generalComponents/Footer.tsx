import React from "react";
import {
  Link,
  Logo,
  parseAMW,
  SMIcons,
  Text,
} from "@/ui/components/components";
import { Configuration, Product } from "@/lib/lib";
import { FaHeart } from "react-icons/fa";
import { Paths } from "@/contants";
import Image from "next/image";

const Footer = (props: { config: Configuration }) => {
  const normalizeFooterHref = (url: string) => {
    try {
      const target = new URL(url, Paths.Frontend.HOME.href);
      const app = new URL(Paths.Frontend.HOME.href);
      const browserOrigin =
        typeof window !== "undefined" ? window.location.origin : undefined;

      if (
        target.origin === app.origin ||
        (!!browserOrigin && target.origin === browserOrigin)
      ) {
        return `${target.pathname}${target.search}${target.hash}` || "/";
      }
      return url;
    } catch {
      return url;
    }
  };

  const socialConfig = {
    youtube: props.config.youtube,
    instagram: props.config.instagram,
    facebook: props.config.facebook,
    pinterest: props.config.pinterest,
    x: props.config.x ?? (props.config as any).X, // ✅ FIX
    linkedin: props.config.linkedin,
    tiktok: props.config.tiktok,
    threads: props.config.threads,
  };

  return (
    <div className="flex w-full bg-primary-light/70 pt-20 pb-5 justify-center">
      <div className="flex flex-col w-full max-w-content-width items-center justify-center px-3">
        <div className="flex w-full md:flex-nowrap flex-wrap gap-x-40 gap-y-5 pb-10">
          <div className="flex flex-col w-full gap-4 align-top">
            <Logo
              responsive
              mobileLogo={props.config.mobile_logo}
              desktopLogo={props.config.desktop_logo}
            />
            {!!props.config.footer_content &&
              parseAMW(props.config.footer_content)}

            {/* <SMIcons
              className="md:flex-nowrap flex-wrap"
              urlList={[
                props.config.youtube,
                props.config.instagram,
                props.config.facebook,
                props.config.pinterest,
                props.config.x,
                props.config.linkedin,
                props.config.tiktok,
                props.config.threads,
              ]}
            /> */}
            {/* START: uniform social icon boxes */}
            {/* <div className="flex gap-3 flex-wrap items-center md:flex-nowrap">
              {[
                {
                  url: props.config.youtube,
                  icon: Paths.ICONS.YOUTUBE,
                  alt: "YouTube",
                },
                {
                  url: props.config.instagram,
                  icon: Paths.ICONS.IG,
                  alt: "Instagram",
                },
                {
                  url: props.config.facebook,
                  icon: Paths.ICONS.FB,
                  alt: "Facebook",
                },
                {
                  url: props.config.pinterest,
                  icon: Paths.ICONS.PINTEREST,
                  alt: "Pinterest",
                },
                { url: props.config.x, icon: Paths.ICONS.X, alt: "X" },
                {
                  url: props.config.linkedin,
                  icon: Paths.ICONS.LINKEDIN,
                  alt: "LinkedIn",
                },
                {
                  url: props.config.tiktok,
                  icon: Paths.ICONS.TIKTOK,
                  alt: "TikTok",
                },
                {
                  url: props.config.threads,
                  icon: Paths.ICONS.THREADS,
                  alt: "Threads",
                },
              ]
                .filter((s) => !!s.url) // only render configured socials
                .map((s, i) => (
                  <a
                    key={`social-${i}`}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/95 outline outline-1 outline-boundary-light hover:shadow-button transition-shadow"
                    aria-label={s.alt}
                  >
                    <Image
                      src={s.icon}
                      alt={s.alt}
                      width={24}
                      height={24}
                      className="object-contain"
                      priority={false}
                    />
                  </a>
                ))}
            </div> */}
            <div className="flex gap-3 flex-wrap items-center md:flex-nowrap">
              {[
                {
                  url: socialConfig.youtube,
                  icon: Paths.ICONS.YOUTUBE,
                  alt: "YouTube",
                },
                {
                  url: socialConfig.instagram,
                  icon: Paths.ICONS.IG,
                  alt: "Instagram",
                },
                {
                  url: socialConfig.facebook,
                  icon: Paths.ICONS.FB,
                  alt: "Facebook",
                },
                {
                  url: socialConfig.pinterest,
                  icon: Paths.ICONS.PINTEREST,
                  alt: "Pinterest",
                },
                { 
                  url: socialConfig.x, 
                  icon: Paths.ICONS.X, 
                  alt: "X" 
                },
                {
                  url: socialConfig.linkedin,
                  icon: Paths.ICONS.LINKEDIN,
                  alt: "LinkedIn",
                },
                {
                  url: socialConfig.tiktok,
                  icon: Paths.ICONS.TIKTOK,
                  alt: "TikTok",
                },
                {
                  url: socialConfig.threads,
                  icon: Paths.ICONS.THREADS,
                  alt: "Threads",
                },
              ]
                .filter((s) => !!s.url)
                .map((s, i) => (
                  <a
                    key={`social-${i}`}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/95 outline outline-1 outline-boundary-light hover:shadow-button transition-shadow"
                    aria-label={s.alt}
                  >
                    <Image
                      src={s.icon}
                      alt={s.alt}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </a>
                ))}
            </div>

            {/* END: uniform social icon boxes */}
          </div>
          <div className="flex w-full justify-start flex-wrap gap-y-10 gap-x-28">
            {props.config.navigation?.slice(0, 2).map((e, i) => (
              <div className="flex flex-col gap-3" key={i}>
                <Text.H3>{e.group}</Text.H3>
                {e.link?.map((e, i) => (
                  <Link href={normalizeFooterHref(e.url)} key={i}>
                    {e.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full justify-start flex-wrap gap-y-10 gap-x-28">
          {props.config.navigation?.slice(2).map((e, i) => (
            <div className="flex flex-col gap-3" key={i}>
              <Text.H3>{e.group}</Text.H3>
              {e.link?.map((e, i) => (
                <Link href={normalizeFooterHref(e.url)} key={i}>
                  {e.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <hr className="border border-black w-full my-4" />
        <div className="flex flex-row flex-wrap gap-1.5 w-full md:text-center items-center justify-between">
          <div className="flex flex-row flex-wrap gap-1.5 items-center">
            Copyright © {new Date().getFullYear()} GroupifyAI.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
