import { useState, useEffect, useRef } from "react";
import { runScrollLogic } from "./useBackToTop.logic";
import { useIsTouch } from "./useIsTouch";

export function useBackToTop() {
  const [visible, setVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const isTouch = useIsTouch();

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    function onScroll() {
      runScrollLogic(
        lastScrollY,
        scrollTimeout,
        setVisible,
        setIsMoving,
      );
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

  return visible && (!isMoving || !isTouch);
}
