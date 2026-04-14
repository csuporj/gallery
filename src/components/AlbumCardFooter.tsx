import { memo } from "react";
import { Card } from "react-bootstrap";
import type { Album } from "./Album";

function AlbumCardFooterComponent({ album }: { album: Album }) {
  return (
    <Card.Body
      className="d-flex justify-content-between align-items-center px-2 rounded-0 bg-white"
      style={{
        height: "48px",
        overflow: "hidden",
      }}
    >
      <span
        className="fs-4 text-dark text-truncate me-3"
        style={{
          flex: 1,
        }}
        title={album.LinkText}
      >
        {album.LinkText}
      </span>

      <small
        className="fs-5 text-muted"
        style={{
          flex: 0,
          whiteSpace: "nowrap",
        }}
      >
        {album.AlbumDate}
      </small>
    </Card.Body>
  );
}

export const AlbumCardFooter = memo(AlbumCardFooterComponent);
