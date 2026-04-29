import { useRef, useEffect } from "react";
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

  useEffect(() => {
    function onScroll() {
      if (isResizing.current) return;

      requestAnimationFrame(() => {
        if (window.scrollY < 42) {
          if (anchorUrl.current !== null) {
            anchorUrl.current = null;
            anchorDate.current = null;
            if (IS_DEBUG) console.log(getTimestamp(), "updateAnchor null");
          }
          return;
        }

        const albumLinks = document.querySelectorAll(".js-album-link");
        const viewportHeight = window.innerHeight;

        for (const albumLink of albumLinks) {
          const rect = albumLink.getBoundingClientRect();

          if (rect.height > 0 && rect.top >= 0 && rect.top < viewportHeight) {
            const url = albumLink.getAttribute("href");
            const albumInfo = albumLink.getAttribute("data-album-info");

            if (url !== anchorUrl.current) {
              anchorUrl.current = url;
              anchorDate.current = albumInfo;
              if (IS_DEBUG)
                console.log(getTimestamp(), `updateAnchor ${albumInfo}`);
            }
            return;
          }
        }
        if (IS_DEBUG)
          console.log(getTimestamp(), "updateAnchor no visible items found");
      });
    }

    function onResize() {
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
        isResizing.current = true;

        if (IS_DEBUG)
          console.log(
            getTimestamp(),
            `onResize restoring to ${anchorDate.current}`,
          );

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
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [filteredAlbums, isTouch]);

  return { virtuosoRef };
};
