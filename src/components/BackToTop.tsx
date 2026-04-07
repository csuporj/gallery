import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
        if (entry.isIntersecting && window.scrollY > 400) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px 20px 0px" }, // 20px buffer via margin
    );

    const endElement = document.getElementById("end");
    if (endElement) observer.observe(endElement);

    // 2. Scroll logic for direction and top-offset
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 400) {
        setVisible(false);
      } else if (isAtBottom || currentScrollY < lastScrollY.current - 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isAtBottom]);

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`rounded-2 shadow-sm position-fixed border-0 d-flex align-items-center justify-content-center bg-white ${
        visible ? "opacity-100" : "opacity-75"
      }`}
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
        right: "4px",
        zIndex: 9999,
        width: "60px",
        height: "60px",
        color: "#000",
        transition: "all 0.25s ease-in-out",
        transform: visible ? "translateY(0)" : "translateY(15px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </Button>
  );
};

export default BackToTop;
