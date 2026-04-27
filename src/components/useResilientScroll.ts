import { useRef, useCallback, useEffect } from "react";
import type { VirtuosoGridHandle, GridStateSnapshot } from "react-virtuoso";

const ITEM_WIDTH = 608;
const FIRST_ROW_THRESHOLD = 456;

export const useResilientScroll = () => {
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const lastGoodScroll = useRef(0);
  const lastColumnCount = useRef(0);
  const isResizing = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getColumnCount = () => {
    return Math.max(1, Math.floor(window.innerWidth / ITEM_WIDTH));
  };

  const handleStateChanged = useCallback((state: GridStateSnapshot) => {
    // If we are currently resizing, ignore the browser's "clamped" state updates
    if (!isResizing.current) {
      lastGoodScroll.current = state.scrollTop;
      lastColumnCount.current = getColumnCount();
    }
  }, []);

  useEffect(() => {
    const performRestoration = () => {
      if (!virtuosoRef.current) return;

      const newCols = getColumnCount();
      const oldCols = lastColumnCount.current || newCols;

      if (newCols !== oldCols) {
        const ratio = oldCols / newCols;
        const adjustedScroll = lastGoodScroll.current * ratio;

        virtuosoRef.current.scrollTo({ top: adjustedScroll });

        // Update baseline immediately so continuous drags stay synced
        lastGoodScroll.current = adjustedScroll;
        lastColumnCount.current = newCols;
      }
    };

    const onResize = () => {
      if (lastGoodScroll.current <= FIRST_ROW_THRESHOLD) {
        isResizing.current = false;
        return;
      }

      // Synchronous Lock: Blocks the very next 'stateChanged' (clamped) event
      isResizing.current = true;

      // Use rAF to snap the scroll in the same paint cycle as the resize/zoom
      requestAnimationFrame(performRestoration);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isResizing.current = false;
      }, 150);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { virtuosoRef, handleStateChanged };
};
