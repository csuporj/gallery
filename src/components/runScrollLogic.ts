import type { RefObject } from "react";

const MIN_SCROLL_DEPTH = 400;
const SCROLL_DELAY_MS = 300;
const SCROLL_DELTA_UP = 10;
const SCROLL_DELTA_DOWN = 1;

export function runScrollLogic(
  lastScrollY: RefObject<number>,
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
  }, SCROLL_DELAY_MS);

  const currentY = window.scrollY;
  const lastY = lastScrollY.current ?? currentY;

  if (currentY < MIN_SCROLL_DEPTH) {
    setVisible(false);
  } else if (currentY <= lastY - SCROLL_DELTA_UP) {
    setVisible(true);
  } else if (currentY >= lastY + SCROLL_DELTA_DOWN) {
    setVisible(false);
  }

  lastScrollY.current = currentY;
}
