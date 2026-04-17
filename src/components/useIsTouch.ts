import { useState, useEffect } from "react";

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    function checkTouch() {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }

    checkTouch();

    const monitor = window.matchMedia("(pointer: coarse)");
    monitor.addEventListener("change", checkTouch);

    return function cleanupIsTouch() {
      monitor.removeEventListener("change", checkTouch);
    };
  }, []);

  return isTouch;
}
