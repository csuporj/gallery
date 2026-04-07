import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      setVisible(isScrollingUp && currentScrollY > 400);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Button
      onClick={scrollToTop}
      className={`rounded-circle shadow-lg position-fixed border-0 d-flex align-items-center justify-content-center ${visible ? "opacity-100" : "opacity-0"}`}
      style={{
        bottom: "30px",
        right: "30px",
        zIndex: 2000,
        width: "56px",
        height: "56px",
        // Glassmorphism Fixes
        backgroundColor: "rgba(255, 255, 255, 0.3)", // Light transparent base
        border: "1px solid rgba(255, 255, 255, 0.2) !important",
        backdropFilter: "blur(12px)", // The actual glass effect
        WebkitBackdropFilter: "blur(12px)", // Required for Safari support
        color: "#000",
        // Smooth transitions
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: visible
          ? "scale(1) translateY(0)"
          : "scale(0.8) translateY(20px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </Button>
  );
};

export default BackToTop;
