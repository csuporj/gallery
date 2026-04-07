import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [log, setLog] = useState({});
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    // 1. Intersection Observer for the #end div
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px 20px 0px" }, // 20px buffer via margin
    );

    const endElement = document.getElementById("end");
    if (endElement) observer.observe(endElement);

    // 2. Scroll logic for direction and top-offset
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Logic: Show if (Scrolled down 400px AND (Scrolling Up OR At Bottom))
      if (currentScrollY < 400) {
        setVisible(false);
      } else if (isAtBottom || currentScrollY < lastScrollY.current - 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setVisible(false);
      }

      setLog({
        isAtBottom,
        currentScrollY,
        windowHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight,
      });

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isAtBottom]); // Re-run scroll logic when bottom state toggles

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`rounded-2 shadow-sm position-fixed border-0 d-flex align-items-center justify-content-center bg-white ${
        visible ? "opacity-100" : "opacity-75"
      }`}
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
        right: "24px",
        zIndex: 9999,
        width: "360px", // Adjusted from 348px for a standard button look
        height: "360px",
        color: "#000",
        transition: "all 0.25s ease-in-out",
        transform: visible ? "translateY(0)" : "translateY(15px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Debug Log - Optional */}
      <pre className="text-start fs-5" style={{ position: "absolute", right: "70px", background: "#fff" }}>
        {JSON.stringify(log, null, 2)}
      </pre>

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
