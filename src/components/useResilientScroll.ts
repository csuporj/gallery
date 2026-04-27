import { useRef, useCallback, useEffect } from "react";
import type { VirtuosoGridHandle } from "react-virtuoso";
import type { Album } from "./types";

export const useResilientScroll = (albums: Album[]) => {
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const anchorUrl = useRef<string | null>(null);
  const isResizing = useRef(false);

  const updateAnchor = useCallback(() => {
    if (isResizing.current) return;

    const elements = document.querySelectorAll("a[href]");
    if (elements.length === 0) return;

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      // rect.bottom > 0 ensures we anchor to the first visible item
      if (rect.bottom > 0) {
        const url = el.getAttribute("href");
        if (url && url !== anchorUrl.current) {
          anchorUrl.current = url;
        }
        break;
      }
    }
  }, []);

  useEffect(() => {
    const onScroll = () => updateAnchor();

    const onResize = () => {
      if (!virtuosoRef.current || !anchorUrl.current) return;

      const targetIndex = albums.findIndex(
        (a) => a.AlbumUrl === anchorUrl.current,
      );

      if (targetIndex !== -1) {
        isResizing.current = true;

        // SOLUTION: The 'Triple-Frame' wait
        // 1. First rAF: Wait for window resize event to finish.
        // 2. Second rAF: Wait for CSS to apply the new 1-column responsive heights.
        // 3. setTimeout(0): Yield to Virtuoso's internal ResizeObserver so it can
        //    re-measure the cards before we ask it to scroll to them.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              virtuosoRef.current?.scrollToIndex({
                index: targetIndex,
                align: "start",
                behavior: "auto",
              });

              // Hold the lock long enough for the browser to settle (important for mobile)
              setTimeout(() => {
                isResizing.current = false;
              }, 300);
            }, 50); // A 50ms buffer is critical for mobile reflows
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
  }, [albums, updateAnchor]);

  return { virtuosoRef };
};
