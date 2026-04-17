import { useState, useEffect, useRef } from "react";
import { useIsTouch } from "./useIsTouch";

const MIN_SCROLL_DEPTH = 400;
const SCROLL_DELAY_MS = 300;
const SCROLL_DELTA_UP = 10;
const SCROLL_DELTA_DOWN = 1;

export function useBackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const isTouch = useIsTouch();

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    function onScroll() {
      setIsMoving(true);

      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = window.setTimeout(function onScrollTimeout() {
        setIsMoving(false);
      }, SCROLL_DELAY_MS);

      const currentY = window.scrollY;
      const lastY = lastScrollY.current;

      if (currentY < MIN_SCROLL_DEPTH) {
        setIsVisible(false);
      } else if (currentY <= lastY - SCROLL_DELTA_UP) {
        setIsVisible(true);
      } else if (currentY >= lastY + SCROLL_DELTA_DOWN) {
        setIsVisible(false);
      }

      lastScrollY.current = currentY;
    }

    function onScrollEnd() {
      setIsMoving(false);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);

    return function cleanupBackToTop() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);

      if (scrollTimeout.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        window.clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return isVisible && (!isMoving || !isTouch);
}
