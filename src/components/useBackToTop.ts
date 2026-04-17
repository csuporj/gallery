import { useState, useEffect, useRef } from "react";
import { runScrollLogic, runIntersectionLogic } from "./useBackToTop.logic";
import { useIsTouch } from "./useIsTouch";

export function useBackToTop(endRef: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const isTouch = useIsTouch();

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);
  const isAtBottomRef = useRef(false);

  useEffect(() => {
    function onScroll() {
      runScrollLogic(
        lastScrollY,
        isAtBottomRef,
        scrollTimeout,
        setVisible,
        setIsMoving,
      );
    }

    function onScrollEnd() {
      setIsMoving(false);
    }

    function onIntersect([entry]: IntersectionObserverEntry[]) {
      runIntersectionLogic(entry, isAtBottomRef, setVisible);
    }

    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    const endElement = endRef.current;
    if (endElement) observer.observe(endElement);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);

    return function cleanupBackToTop() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      observer.disconnect();

      if (scrollTimeout.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        window.clearTimeout(scrollTimeout.current);
      }
    };
  }, [endRef]);

  return visible && (!isMoving || !isTouch);
}
