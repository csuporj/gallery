import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. Check if user is at the bottom (with a 20px buffer)
      const isAtBottom = currentScrollY + windowHeight >= documentHeight - 20;

      // 2. Hide at the top
      if (currentScrollY < 400) {
        setVisible(false);
      }
      // 3. Show if at the bottom OR scrolling UP
      else if (isAtBottom || currentScrollY < lastScrollY.current - 10) {
        setVisible(true);
      }
      // 4. Hide if scrolling DOWN (and not at the bottom yet)
      else if (currentScrollY > lastScrollY.current + 10) {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`rounded-2 shadow-sm position-fixed border-0 d-flex align-items-center justify-content-center bg-white ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        // Higher bottom value + safe area to clear mobile browser UI
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
        right: "24px",
        zIndex: 9999,
        width: "48px",
        height: "48px",
        color: "#000",
        transition: "all 0.25s ease-in-out",
        transform: visible ? "translateY(0)" : "translateY(15px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <svg
        width="20"
        height="20"
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
