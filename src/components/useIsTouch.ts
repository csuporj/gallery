import { useEffect, useState } from "react";

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    check();

    const mql = window.matchMedia("(pointer: coarse)");
    mql.addEventListener("change", check);
    return () => mql.removeEventListener("change", check);
  }, []);

  return isTouch;
}
