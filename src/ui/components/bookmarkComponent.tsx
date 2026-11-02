import React from "react";
import { CMS } from "@/lib/lib";
import { twMerge } from "tailwind-merge";

const BookmarkButton = ({
  productId,
  initialCount = 0,
}: {
  productId: number;
  initialCount?: number;
}) => {
  const [bookmarked, setBookmarked] = React.useState(false);
  const [count, setCount] = React.useState(initialCount);
  const [loading, setLoading] = React.useState(false);

  // Check if already bookmarked
  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const rows = await CMS.getBookmarkObjectForProduct({ productId });
        if (mounted && rows.length > 0) {
          setBookmarked(true);
        }
      } catch (e) {
        console.error("Bookmark check failed", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [productId]);

  const toggleBookmark = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (bookmarked) {
        await CMS.deleteBookmarkObjectForProduct({ productId });
        setBookmarked(false);
        setCount((c) => Math.max(0, c - 1));
      } else {
        await CMS.createBookmarkObjectForProduct({ productId });
        setBookmarked(true);
        setCount((c) => c + 1);
      }
    } catch (e) {
      console.error("Bookmark toggle failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={twMerge(
        "flex items-center gap-1 rounded-md px-1.5 py-1",
        "bg-white/70 backdrop-blur-sm shadow-sm",
        bookmarked ? "text-app-primary" : "text-gray-600 hover:bg-white"
      )}
      aria-label="Bookmark tool"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>

      <span className="text-xs font-medium">{count}</span>
    </button>
  );
};

export default BookmarkButton;
