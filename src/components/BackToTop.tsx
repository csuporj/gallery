import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 400) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToTop = (e: React.PointerEvent<HTMLButtonElement>) => {
    // This stops the browser from eating the event during momentum
    // AND stops the "release" from cancelling the smooth scroll.
    if (e.cancelable) e.preventDefault();

    // Kill inertia and scroll to top
    window.scrollTo(0, window.scrollY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      // Unified event for Mouse, Touch, and Emulator
      onPointerDown={handleBackToTop}
      className={`rounded-2 shadow-sm position-fixed border-0 d-flex align-items-center justify-content-center bg-white text-black ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        bottom: "8px",
        right: "4px",
        zIndex: 9999,
        width: "60px",
        height: "60px",
        transition: "all 0.25s ease-in-out",
        transform: visible ? "translateY(0)" : "translateY(15px)",
        pointerEvents: visible ? "auto" : "none",
        // Critical: prevents the browser from taking over the gesture
        touchAction: "none",
        cursor: "pointer",
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
