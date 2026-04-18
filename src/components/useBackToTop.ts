import { useState, useEffect, useRef } from "react";
import { useIsTouch } from "./useIsTouch";

const MIN_SCROLL_DEPTH = 400;
const SCROLL_DELAY_MS = 300;
const SCROLL_DELTA_UP = 10;
const SCROLL_DELTA_DOWN = 1;

export function useBackToTop() {
  const [shouldShow, setShouldShow] = useState(false);
  const isTouch = useIsTouch();

  const lastScrollY = useRef(0);
  const isMovingRef = useRef(false);
  const wasScrollingUpRef = useRef(false);
  const lastShouldShowRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function checkAndNotify() {
      const result =
        wasScrollingUpRef.current && (!isMovingRef.current || !isTouch);

      if (result === lastShouldShowRef.current) return;

      lastShouldShowRef.current = result;
      setShouldShow(result);
      console.log(`useBackToTop ${result}`);
    }

    function onScroll() {
      const currentY = window.scrollY;
      const lastY = lastScrollY.current;

      isMovingRef.current = true;

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        isMovingRef.current = false;
        checkAndNotify();
      }, SCROLL_DELAY_MS);

      if (currentY < MIN_SCROLL_DEPTH) {
        wasScrollingUpRef.current = false;
      } else if (currentY <= lastY - SCROLL_DELTA_UP) {
        wasScrollingUpRef.current = true;
      } else if (currentY >= lastY + SCROLL_DELTA_DOWN) {
        wasScrollingUpRef.current = false;
      }

      lastScrollY.current = currentY;
      checkAndNotify();
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isTouch]);

  return shouldShow;
}
