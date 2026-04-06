import { Button } from "react-bootstrap";

interface BackToTopProps {
  show: boolean;
  onClick: () => void;
}

const BackToTop = ({ show, onClick }: BackToTopProps) => {
  if (!show) return null;

  return (
    <Button
      variant="primary"
      onClick={onClick}
      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 align-self-center"
      style={{
        width: "40px",
        height: "40px",
        minWidth: "40px",
        padding: 0,
      }}
    >
      ↑
    </Button>
  );
};

export default BackToTop;
