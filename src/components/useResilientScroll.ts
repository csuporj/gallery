import { useRef, useCallback, useEffect } from "react";
import type { VirtuosoGridHandle, GridStateSnapshot } from "react-virtuoso";

const ITEM_WIDTH = 608;
const BASE_ROW_HEIGHT = 456;
const THRESHOLD = 456;

export const useResilientScroll = () => {
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const lastGoodScroll = useRef(0);
  const lastCols = useRef(0);
  const isResizing = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCols = () => Math.max(1, Math.floor(window.innerWidth / ITEM_WIDTH));

  const handleStateChanged = useCallback((state: GridStateSnapshot) => {
    // Strict lock: prevents any browser-clamped values from corrupting our baseline
    if (!isResizing.current) {
      lastGoodScroll.current = state.scrollTop;
      lastCols.current = getCols();
    }
  }, []);

  useEffect(() => {
    const performRestoration = () => {
      if (!virtuosoRef.current) return;

      const dpr = window.devicePixelRatio || 1;
      const newCols = getCols();
      const oldCols = lastCols.current || newCols;

      const oldRowIndex = Math.round(lastGoodScroll.current / BASE_ROW_HEIGHT);
      const anchorItemIndex = oldRowIndex * oldCols;
      const newRowIndex = Math.floor(anchorItemIndex / newCols);

      let rowsPerPixel = 0;
      if (dpr > 1.08 && dpr < 1.12) rowsPerPixel = 45;
      if (dpr > 0.88 && dpr < 0.92) rowsPerPixel = 35;
      if (dpr > 0.78 && dpr < 0.82) rowsPerPixel = 22;
      if (dpr > 0.65 && dpr < 0.69) rowsPerPixel = 20;
      if (dpr > 0.31 && dpr < 0.35) rowsPerPixel = 18;

      const driftCorrection =
        rowsPerPixel > 0 ? Math.floor(newRowIndex / rowsPerPixel) * -1 : 0;

      let target = newRowIndex * BASE_ROW_HEIGHT + driftCorrection;
      target = Math.round(target * dpr) / dpr;

      // Force instant jump. behavior 'auto' is faster than default for zoom.
      virtuosoRef.current.scrollTo({ top: target, behavior: "auto" });

      lastGoodScroll.current = target;
      lastCols.current = newCols;
    };

    const onResize = () => {
      if (lastGoodScroll.current <= THRESHOLD) return;

      // 1. SYNC LOCK: Intercepts the very first clamped scroll event
      isResizing.current = true;

      // 2. IMMEDIATE SNAP: Fights the browser's native zoom jump instantly
      performRestoration();

      // 3. RAF SNAP: Catches the final layout after the browser stabilizes
      requestAnimationFrame(performRestoration);

      // 4. DEBOUNCED UNLOCK: Ensure all layout-related scroll events have finished
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isResizing.current = false;
      }, 300); // Increased buffer to ensure layout stability
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { virtuosoRef, handleStateChanged };
};
