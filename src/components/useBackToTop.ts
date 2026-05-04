import { useState, useEffect, useRef } from "react";

import { getTimestamp, IS_DEBUG } from "./debug";

const MIN_SCROLL_DEPTH = 400;
const SCROLL_DELTA_UP = 5;
const SCROLL_DELTA_DOWN = 1;

export function useBackToTop(isTouch: boolean, isResizing: boolean) {
  const [show, setShow] = useState(false);

  const lastScrollY = useRef(0);
  const isMovingRef = useRef(false);
  const wasScrollingUpRef = useRef(false);
  const lastShowRef = useRef(false);

  useEffect(() => {
    function updateShow() {
      let newShow = wasScrollingUpRef.current;
      if (isMovingRef.current && isTouch) {
        newShow = false;
      }
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

      if (isResizing) {
        // zooming out moves the scroll position up,
        // don't want to show the button from that
        wasScrollingUpRef.current = false;
      } else {
        const lastY = lastScrollY.current;
        if (currentY < MIN_SCROLL_DEPTH) {
          wasScrollingUpRef.current = false;
        } else if (currentY <= lastY - SCROLL_DELTA_UP) {
          wasScrollingUpRef.current = true;
        } else if (currentY >= lastY + SCROLL_DELTA_DOWN) {
          wasScrollingUpRef.current = false;
        }
      }

      lastScrollY.current = currentY;
      updateShow();

      // not using onScrollEnd as it is supported on safari just from Dec 2025
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        isMovingRef.current = false;
        updateShow();
      }, 100);
    }

    let stopTimer = 0;
    if (isResizing) {
      wasScrollingUpRef.current = false;
      lastScrollY.current = window.scrollY;
      updateShow();
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(stopTimer);
    };
  }, [isTouch, isResizing]);

  return show;
}
