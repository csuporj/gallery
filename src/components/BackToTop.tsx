import { Button } from "react-bootstrap";
import { useBackToTop } from "./useBackToTop";

export const BackToTop = () => {
  const isActive = useBackToTop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const opacityClass = isActive ? "opacity-100" : "opacity-0";
  const buttonTransform = isActive ? "translateY(0)" : "translateY(20px)";
  const buttonPointerEvents = isActive ? "auto" : "none";

  return (
    <Button
      onClick={scrollToTop}
      className={`rounded-2 shadow-sm position-fixed border-0 d-flex align-items-center justify-content-center bg-white text-black ${opacityClass}`}
      style={{
        bottom: "8px",
        right: "4px",
        zIndex: 9999,
        width: "60px",
        height: "60px",
        transition: "all 0.2s ease-in-out",
        transform: buttonTransform,
        pointerEvents: buttonPointerEvents,
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
