import { useState, useEffect, useRef } from "react";

import { getTimestamp, IS_DEBUG } from "./debug";

const MIN_SCROLL_DEPTH = 400;
const SCROLL_DELTA_UP = 5;
const SCROLL_DELTA_DOWN = 1;

export function useBackToTop(isTouch: boolean) {
  const [show, setShow] = useState(false);

  const lastScrollY = useRef(0);
  const isMovingRef = useRef(false);
  const wasScrollingUpRef = useRef(false);
  const lastShowRef = useRef(false);

  useEffect(() => {
    function updateShow() {
      const newShow =
        wasScrollingUpRef.current && (!isMovingRef.current || !isTouch);
      if (newShow === lastShowRef.current) {
        return;
      }

      lastShowRef.current = newShow;
      setShow(newShow);

      if (IS_DEBUG) console.log(getTimestamp(), `useBackToTop ${newShow}`);
    }

    function onScroll() {
      isMovingRef.current = true;
      const currentY = window.scrollY;
      const lastY = lastScrollY.current;

      if (currentY < MIN_SCROLL_DEPTH) {
        wasScrollingUpRef.current = false;
      } else if (currentY <= lastY - SCROLL_DELTA_UP) {
        wasScrollingUpRef.current = true;
      } else if (currentY >= lastY + SCROLL_DELTA_DOWN) {
        wasScrollingUpRef.current = false;
      }

      lastScrollY.current = currentY;
      updateShow();
    }

    function onScrollEnd() {
      isMovingRef.current = false;
      updateShow();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, [isTouch]);

  return show;
}
