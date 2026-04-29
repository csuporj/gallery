import { useState, useEffect } from "react";
import { getTimestamp, IS_DEBUG } from "./debug";

export function useIsTouch() {
  const [monitor] = useState(() => window.matchMedia("(pointer: coarse)"));
  const [isTouch, setIsTouch] = useState(monitor.matches);

  useEffect(() => {
    function updateIsTouch(e: MediaQueryListEvent) {
      setIsTouch(e.matches);
      if (IS_DEBUG) console.log(getTimestamp(), `updateIsTouch ${e.matches}`);
    }

    monitor.addEventListener("change", updateIsTouch);
    return () => monitor.removeEventListener("change", updateIsTouch);
  }, [monitor]);

  return isTouch;
}
