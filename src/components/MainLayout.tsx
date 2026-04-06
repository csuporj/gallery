import type { ReactNode } from "react";
import { Container } from "react-bootstrap";
import BackToTop from "./BackToTop";

interface MainLayoutProps {
  children: ReactNode;
  headerContent: ReactNode;
  visible: boolean;
  showButton: boolean;
  onScrollToTop: () => void;
}

const MainLayout = ({
  children,
  headerContent,
  visible,
  showButton,
  onScrollToTop,
}: MainLayoutProps) => {
  return (
    <Container fluid className="px-0 min-vh-100 bg-light">
      {/* Sticky Header Wrapper */}
      <div
        className="fixed-top bg-white border-bottom shadow-sm transition-header"
        style={{
          zIndex: 1050,
          padding: "8px 0",
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* Inner Flex Container: Allows form and button to sit side-by-side */}
        <div className="d-flex align-items-center justify-content-center gap-2 px-3">
          <div className="filter-form-width flex-grow-1">{headerContent}</div>
          <BackToTop show={showButton} onClick={onScrollToTop} />
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div style={{ height: "70px" }} />

      {/* Main Content Area */}
      {children}

      {/* Bottom spacer */}
      <div style={{ height: "40px" }} />
    </Container>
  );
};

export default MainLayout;
