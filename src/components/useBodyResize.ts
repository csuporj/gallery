import { useEffect, useRef } from "react";
import { getTimestamp, IS_DEBUG } from "./debug";

function getDesiredScrollY(lastInnerWidth: number, innerWidth: number, lastScrollHeight: number, scrollHeight: number, lastScrollY: number) {
  // todo get the real height instead
  const searchHeight = 42;
  
  if (lastScrollY <= 42) {
    return lastScrollY;
  }
  
  if (lastScrollHeight === scrollHeight) {
    return lastScrollY;
  }

  if (lastInnerWidth === 0 || innerWidth === 0 ||
    lastScrollHeight === 0 || scrollHeight === 0 ||
    lastScrollY === 0) {
    return 0;
  }
  
  return searchHeight + (lastScrollY - searchHeight) * ((scrollHeight - searchHeight) / (lastScrollHeight - searchHeight));
}

// todo fix scrolling when number of columns changes, when there is no coercion
// todo flag a scroll as coerce scroll and rescroll if necessary (was not at the end)
export function useBodyResize() {
  const lastInnerWidth = useRef(window.innerWidth);
  const lastScrollHeight = useRef(document.body.scrollHeight);
  const lastScrollY = useRef(window.scrollY);
  const isCoerceScroll = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      if (lastScrollY.current > scrollHeight) {
        // todo flag as coerce scroll and don't do anything in the next resize
        // isCoerceScroll.current = true;
      }

      if (IS_DEBUG) {
        console.log(
          getTimestamp(),
          `handleScroll sh=${scrollHeight} lsy=${lastScrollY.current} sy=${scrollY}`);
      }

      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      // todo delay this so that the scrollHeight is updated when read (on ctrl + plus)
      const innerWidth = window.innerWidth;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      var desiredY = getDesiredScrollY(lastInnerWidth.current, innerWidth, lastScrollHeight.current, scrollHeight, lastScrollY.current);
      
      if (isCoerceScroll.current) {
        isCoerceScroll.current = false;
      }
      else if (lastScrollY.current !== desiredY) {
        window.scrollTo({top: desiredY, behavior: "instant"});
      }
      
      if (IS_DEBUG) {
        console.log(
          getTimestamp(),
          `useBodyResize liw=${lastInnerWidth.current} iw=${window.innerWidth} ` +
          `lsh=${lastScrollHeight.current} sh=${scrollHeight} lsy=${lastScrollY.current} desiredY=${desiredY}`);
      }
      
      lastInnerWidth.current = innerWidth;
      lastScrollHeight.current = scrollHeight;
    });

    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);
}
