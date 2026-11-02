"use client";

import { useEffect, useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { MdBookmarkBorder, MdOutlineBookmark } from "react-icons/md";
import { Paths } from "@/contants";
import { useDialogControls } from "@/ui/components/components";
import { useAuthState } from "@/ui/logic/auth";
import { useAPI } from "@/ui/logic/api";
import style_constants from "@/../style_constants";
import Image from "next/image";

interface ShareProps {
  url: string;
  type?: "tool" | "blog";
}

const Share = ({ url, type = "tool" }: ShareProps) => {
  const { openDialog } = useDialogControls({
    id: Paths.DIALOG_ID.SHARE_PRODUCT,
  });

  return (
    <div
      onClick={() => openDialog({ type, url })}
      className={twMerge(
        "size-8 p-1.5 rounded-md border border-black inline-flex justify-center items-center gap-1 outline outline-1 hover:bg-button-focus cursor-pointer"
      )}
    >
      <Image
        src={Paths.ICONS.SHARE}
        alt="Share icon"
        width={32}
        height={32}
      />
    </div>
  );
};

interface BookmarkProps {
  productId: number;
}

const Bookmark = ({ productId }: BookmarkProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthState();
  const { setBookmark, getBookmark } = useAPI();
  const { openDialog } = useDialogControls<void>({ id: Paths.DIALOG_ID.LOGIN });

  // Fetch bookmark state on mount or when user changes
  useEffect(() => {
    if (!user) {
      setIsBookmarked(false);
      setIsLoading(false);
      return;
    }

    let mounted = true;

    getBookmark({ productId })
      .then((state) => mounted && setIsBookmarked(state))
      .finally(() => mounted && setIsLoading(false));

    return () => {
      mounted = false;
    };
  }, [user, productId, getBookmark]);

  const handleClick = useCallback(() => {
    if (!user) {
      openDialog();
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setBookmark({ productId, state: !isBookmarked })
      .then(setIsBookmarked)
      .catch((err) => console.error("> Error occurred:", err))
      .finally(() => setIsLoading(false));
  }, [user, isBookmarked, isLoading, setBookmark, productId, openDialog]);

  const IconComponent = isBookmarked ? MdOutlineBookmark : MdBookmarkBorder;

  return (
    <IconComponent
      onClick={handleClick}
      className={twMerge(
        "outline outline-1 rounded-md p-1.5 size-8 transition-opacity duration-200",
        isLoading
          ? "opacity-30 cursor-not-allowed"
          : "opacity-100 cursor-pointer hover:bg-button-focus"
      )}
      color={isBookmarked ? style_constants.colors.primary : "black"}
      strokeWidth={0}
    />
  );
};

export { Share, Bookmark };
