import { useState, useEffect } from "react";

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    function checkTouch() {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }

    const monitor = window.matchMedia("(pointer: coarse)");
    monitor.addEventListener("change", checkTouch);
    checkTouch();
    return () => monitor.removeEventListener("change", checkTouch);
  }, []);

  return isTouch;
}
