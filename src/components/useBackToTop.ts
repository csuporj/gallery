import { useState, useEffect, useRef } from "react";

const MIN_SCROLL_DEPTH = 400;

export const useBackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const lastScrollY = useRef<number>(0);
  const scrollTimeout = useRef<number | null>(null);
  const isAtBottomRef = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isAtBottomRef.current = entry.isIntersecting;
        if (entry.isIntersecting && window.scrollY > MIN_SCROLL_DEPTH)
          setVisible(true);
      },
      { threshold: 0.1 },
    );

    const endElement = document.getElementById("end");
    if (endElement) observer.observe(endElement);

    const handleScroll = () => {
      setIsMoving(true);

      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        setIsMoving(false);
        if (isAtBottomRef.current && window.scrollY > MIN_SCROLL_DEPTH)
          setVisible(true);
      }, 150);

      const currentScrollY = window.scrollY;

      if (currentScrollY < MIN_SCROLL_DEPTH) {
        setVisible(false);
      } else if (isAtBottomRef.current) {
        setVisible(true);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", () => setIsMoving(false));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    };
  }, []);

  return visible && !isMoving;
};
