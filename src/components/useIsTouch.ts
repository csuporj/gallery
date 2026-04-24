import { useState, useEffect } from "react";
import { getTimestamp, IS_DEBUG } from "./debug";

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    function updateIsTouch() {
      const m = monitor.matches;
      setIsTouch(m);
      if (IS_DEBUG) {
        console.log(getTimestamp(), `updateIsTouch ${m}`);
      }
    }

    const monitor = window.matchMedia("(pointer: coarse)");
    monitor.addEventListener("change", updateIsTouch);
    updateIsTouch();
    return () => monitor.removeEventListener("change", updateIsTouch);
  }, []);

  return isTouch;
}
