import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef<number>(0);
  const isAtBottomRef = useRef<boolean>(false);

  // 1. Create a reference to the top of the page
  const topAnchorRef = useRef<HTMLDivElement>(null);

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

  const handleBackToTop = (e: React.PointerEvent) => {
    // 2. Kill the momentum engine immediately
    window.scrollTo({ top: window.scrollY, behavior: "instant" as any });

    // 3. Use scrollIntoView - the only method mobile Chrome respects mid-glide
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Target anchor at the top */}
      <div
        ref={topAnchorRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      <Button
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
          touchAction: "none", // Critical: prevents browser from taking the touch
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
    </>
  );
};

export default BackToTop;
