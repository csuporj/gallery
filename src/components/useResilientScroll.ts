import { useRef, useCallback, useEffect } from "react";
import type { VirtuosoGridHandle } from "react-virtuoso";
import type { Album } from "./types";
import { getTimestamp, IS_DEBUG } from "./debug";

export const useResilientScroll = (
  filteredAlbums: Album[],
  isTouch: boolean,
) => {
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const anchorUrl = useRef<string | null>(null);
  const anchorDate = useRef<string | null>(null);
  const isResizing = useRef(false);

  const updateAnchor = useCallback(() => {
    if (isResizing.current) return;

    requestAnimationFrame(() => {
      const currentScroll = window.scrollY;

      if (currentScroll < 42) {
        if (anchorUrl.current !== null) {
          anchorUrl.current = null;
          anchorDate.current = null;
          if (IS_DEBUG) console.log(getTimestamp(), "updateAnchor null");
        }
        return;
      }

      const elements = document.querySelectorAll("a[href]");
      const viewportHeight = window.innerHeight;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();

        if (rect.height > 0 && rect.top >= 0 && rect.top < viewportHeight) {
          const url = el.getAttribute("href");
          const title = el.getAttribute("title");

          if (url && url !== anchorUrl.current) {
            anchorUrl.current = url;
            anchorDate.current = title;
            if (IS_DEBUG) console.log(getTimestamp(), `updateAnchor ${title}`);
          }
          return;
        }
      }
      if (IS_DEBUG)
        console.log(getTimestamp(), "updateAnchor no visible items found");
    });
  }, []);

  useEffect(() => {
    const onScroll = () => updateAnchor();

    const onResize = () => {
      if (isTouch) return;
      if (!virtuosoRef.current || !anchorUrl.current) {
        if (IS_DEBUG)
          console.log(getTimestamp(), "onResize no anchor to restore");
        return;
      }

      const targetIndex = filteredAlbums.findIndex(
        (a) => a.AlbumUrl === anchorUrl.current,
      );

      if (targetIndex !== -1) {
        if (IS_DEBUG)
          console.log(
            getTimestamp(),
            `onResize restoring to ${anchorDate.current}`,
          );
        isResizing.current = true;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              virtuosoRef.current?.scrollToIndex({
                index: targetIndex,
                align: "start",
                behavior: "auto",
              });

              setTimeout(() => {
                isResizing.current = false;
              }, 50);
            }, 50);
          });
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [filteredAlbums, isTouch, updateAnchor]);

  return { virtuosoRef };
};
