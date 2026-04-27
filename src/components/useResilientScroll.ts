import { useRef, useCallback, useEffect } from "react";
import type { VirtuosoGridHandle } from "react-virtuoso";
import type { Album } from "./types";

export const useResilientScroll = (albums: Album[]) => {
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const anchorUrl = useRef<string | null>(null);
  const isResizing = useRef(false);

  const updateAnchor = useCallback(() => {
    // CRITICAL: If we are in the middle of a resize/scroll restoration,
    // do not allow the anchor to be updated by the "jitter" scroll events.
    if (isResizing.current) return;

    const elements = document.querySelectorAll("a[href]");
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      // rect.bottom > 0 is the most stable check for "first visible"
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
        // Lock the anchor immediately to prevent "jump" events from corrupting it
        isResizing.current = true;

        // Sync with browser layout cycles
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // A tiny 50ms buffer allows Virtuoso's ResizeObserver
            // to update its internal column-math (3 -> 4)
            setTimeout(() => {
              virtuosoRef.current?.scrollToIndex({
                index: targetIndex,
                align: "start",
                behavior: "auto",
              });

              // Release lock once the layout has settled
              setTimeout(() => {
                isResizing.current = false;
              }, 150);
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
  }, [albums, updateAnchor]);

  return { virtuosoRef };
};
