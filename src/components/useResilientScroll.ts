import { useRef, useEffect } from "react";
import type { VirtuosoGridHandle } from "react-virtuoso";
import type { Album } from "./types";
import { getTimestamp, IS_DEBUG } from "./debug";

export const useResilientScroll = (
  filteredAlbums: Album[],
  isTouch: boolean,
) => {
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const anchorUrl = useRef<string | null>(null);
  const anchorDate = useRef<string | null>(null);
  const resizesInProgress = useRef(0);
  const lastWidth = useRef(window.innerWidth);

  useEffect(() => {
    function onScroll() {
      if (resizesInProgress.current > 0) return;

      // delaying until after the resize event has set in progress,
      // in case it is a clamp scroll caused by the browser trying to restore scroll position after a resize
      requestAnimationFrame(() => {
        if (resizesInProgress.current > 0) {
          return;
        }

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

          // allow for a small error due to scrollToIndex accumulating rounding errors on some zoom levels
          if (rect.height > 0 && rect.top >= -4 && rect.top < viewportHeight) {
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

    async function onResize() {
      function scrollToAnchor() {
        const targetIndex = filteredAlbums.findIndex(
          (a) => a.AlbumUrl === anchorUrl.current,
        );

        if (targetIndex !== -1) {
          virtuosoRef.current?.scrollToIndex({
            index: targetIndex,
            align: "start",
            behavior: "auto",
          });

          if (IS_DEBUG)
            console.log(
              getTimestamp(),
              `onResize restored to ${anchorDate.current}`,
            );
        } else {
          if (IS_DEBUG)
            console.log(
              getTimestamp(),
              `onResize found no index of ${anchorDate.current}`,
            );
        }
      }

      const lastW = lastWidth.current;
      const currentWidth = window.innerWidth;
      lastWidth.current = currentWidth;
      if (currentWidth === lastW) return;

      if (isTouch) return;

      if (!virtuosoRef.current || !anchorUrl.current) {
        if (IS_DEBUG)
          console.log(getTimestamp(), "onResize no anchor to restore");
        return;
      }

      resizesInProgress.current++;
      if (resizesInProgress.current === 1) {
        gridWrapperRef.current?.classList.add("resizing");
      }

      try {
        // waiting for all automatic resize handling to finish, including the browser's own scroll restoration
        await new Promise(requestAnimationFrame);
        scrollToAnchor();
      } finally {
        // waiting for scrollToIndex to finish, to don't change the anchor
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        if (resizesInProgress.current === 1) {
          gridWrapperRef.current?.classList.remove("resizing");
        }
        resizesInProgress.current--;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [filteredAlbums, isTouch]);

  return { virtuosoRef, gridWrapperRef };
};
