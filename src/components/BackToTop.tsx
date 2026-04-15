import { Button } from "react-bootstrap";
import { ChevronUp } from "react-bootstrap-icons";

import { useBackToTop } from "./useBackToTop";

export const BackToTop = ({
  endRef,
}: {
  endRef: React.RefObject<HTMLElement | null>;
}) => {
  const isActive = useBackToTop(endRef);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const opacity = isActive ? "opacity-100" : "opacity-0";
  const transform = isActive ? "translateY(0)" : "translateY(20px)";
  const pointerEvents = isActive ? "auto" : "none";

  return (
    <Button
      onClick={scrollToTop}
      className={`rounded-2 shadow-sm position-fixed bottom-0 end-0 mb-2 me-1 border-0 d-flex align-items-center justify-content-center bg-white text-black ${opacity}`}
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
};
