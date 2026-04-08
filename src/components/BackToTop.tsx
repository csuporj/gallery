import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const lastScrollY = useRef<number>(0);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Hide button immediately when any scroll movement starts
      setIsMoving(true);

      // Reset timer: button reappears only after 150ms of absolute stillness
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        setIsMoving(false);
      }, 150);

      const currentScrollY = window.scrollY;

      // Logic: Show if scrolled down > 400px AND scrolling up
      if (currentScrollY < 400) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    // Modern browsers fire 'scrollend' when momentum/inertia stops
    const handleScrollEnd = () => {
      setIsMoving(false);
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    };
  }, []);

  // The button is only interactive when deep enough AND the page is not gliding
  const active = visible && !isMoving;

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`rounded-2 shadow-sm position-fixed border-0 d-flex align-items-center justify-content-center bg-white text-black ${
        active ? "opacity-100" : "opacity-0"
      }`}
      style={{
        bottom: "8px",
        right: "4px",
        zIndex: 9999,
        width: "60px",
        height: "60px",
        transition: "all 0.2s ease-in-out",
        transform: active ? "translateY(0)" : "translateY(20px)",
        pointerEvents: active ? "auto" : "none",
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
