import { useBackToTop } from "./useBackToTop";

import { Button } from "react-bootstrap";
import { ChevronUp } from "react-bootstrap-icons";

function scrollToTop(isTouch: boolean) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (!isTouch) {
    document.getElementById("search")?.focus();
  }
}

export function BackToTop() {
  const { show, isTouch } = useBackToTop();

  const opacity = show ? "opacity-100" : "opacity-0";
  const transform = show ? "translateY(0)" : "translateY(20px)";
  const pointerEvents = show ? "auto" : "none";

  return (
    <Button
      onClick={() => scrollToTop(isTouch)}
      className={`position-fixed bottom-0 end-0 mb-1 me-1 rounded-2 border-0 shadow-sm
        d-flex align-items-center justify-content-center bg-white text-black ${opacity}`}
      aria-label="back to top"
      style={{
        zIndex: 9999,
        width: "60px",
        height: "60px",
        transition: "all 0.2s ease-in-out",
        transform: transform,
        pointerEvents: pointerEvents,
      }}
    >
      <ChevronUp size={24} />
    </Button>
  );
}
