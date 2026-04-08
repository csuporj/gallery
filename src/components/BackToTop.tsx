import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef<number>(0);
  const isAtBottomRef = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      isAtBottomRef.current = entry.isIntersecting;
      if (entry.isIntersecting && window.scrollY > 400) setVisible(true);
    });

    const endElement = document.getElementById("end");
    if (endElement) observer.observe(endElement);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 400) {
        setVisible(false);
      } else if (
        isAtBottomRef.current ||
        currentScrollY < lastScrollY.current - 10
      ) {
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
  }, []);

  // Using React.UIEvent covers Mouse, Touch, and Pointer events safely
  const handleBackToTop = (e: React.UIEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    // Kill momentum instantly
    window.scrollTo(0, window.scrollY);

    // Start smooth scroll
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      // onPointerDown triggers before the 'release' can cancel the scroll
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
