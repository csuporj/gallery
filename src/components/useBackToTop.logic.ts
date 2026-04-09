import type { RefObject } from "react";

const MIN_SCROLL_DEPTH = 400;
const SCROLL_DELAY_MS = 300;
const SCROLL_DELTA = 10;

export function runScrollLogic(
  lastScrollY: RefObject<number>,
  isAtBottomRef: RefObject<boolean>,
  scrollTimeout: RefObject<number | null>,
  setVisible: (v: boolean) => void,
  setIsMoving: (v: boolean) => void,
) {
  setIsMoving(true);

  if (scrollTimeout.current) {
    window.clearTimeout(scrollTimeout.current);
  }

  scrollTimeout.current = window.setTimeout(function onScrollTimeout() {
    setIsMoving(false);
    if (isAtBottomRef.current && window.scrollY > MIN_SCROLL_DEPTH) {
      setVisible(true);
    }
  }, SCROLL_DELAY_MS);

  const currentY = window.scrollY;
  const lastY = lastScrollY.current ?? currentY;

  if (currentY < MIN_SCROLL_DEPTH) {
    setVisible(false);
  } else if (isAtBottomRef.current) {
    setVisible(true);
  } else if (currentY < lastY - SCROLL_DELTA) {
    setVisible(true);
  } else if (currentY > lastY + SCROLL_DELTA) {
    setVisible(false);
  }

  lastScrollY.current = currentY;
}

export function runIntersectionLogic(
  entry: IntersectionObserverEntry,
  isAtBottomRef: RefObject<boolean>,
  setVisible: (v: boolean) => void,
) {
  isAtBottomRef.current = entry.isIntersecting;
  if (entry.isIntersecting && window.scrollY > MIN_SCROLL_DEPTH) {
    setVisible(true);
  }
}
