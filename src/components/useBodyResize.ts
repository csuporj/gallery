import { useEffect, useRef } from "react";
import { IS_DEBUG } from "./debug";

function getDesiredScrollY(lastInnerWidth: number, innerWidth: number, lastScrollHeight: number, scrollHeight: number, lastScrollY: number, scrollY: number) {
  return 0;
}

// todo fix scrolling when number of columns changes
export function useBodyResize() {
  const lastInnerWidth = useRef(window.innerWidth);
  const lastScrollHeight = useRef(document.body.scrollHeight);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.body.scrollHeight;
      const scrollY = window.scrollY;

      if (IS_DEBUG) {
        console.log(`lsh=${lastScrollHeight.current} sh=${scrollHeight} lsy=${lastScrollY.current} sy=${scrollY}`);
      }

      lastScrollHeight.current = scrollHeight;
      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      const innerWidth = window.innerWidth;
      if (IS_DEBUG) {
        console.log(`useBodyResize liw=${lastInnerWidth.current} iw=${window.innerWidth}`);
      }
      lastInnerWidth.current = innerWidth;
    });

    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);
}
