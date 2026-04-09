import { useState, useEffect, useRef } from "react";
import { runScrollLogic, runIntersectionLogic } from "./useBackToTop.logic";

export const useBackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);
  const isAtBottomRef = useRef(false);

  useEffect(() => {
    const onScroll = () =>
      runScrollLogic(
        lastScrollY,
        isAtBottomRef,
        scrollTimeout,
        setVisible,
        setIsMoving,
      );

    const onIntersect = ([entry]: IntersectionObserverEntry[]) =>
      runIntersectionLogic(entry, isAtBottomRef, setVisible);

    const onScrollEnd = () => setIsMoving(false);

    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    const endElement = document.getElementById("end");
    if (endElement) observer.observe(endElement);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      observer.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    };
  }, []);

  return visible && !isMoving;
};
