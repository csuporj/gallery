import { memo } from "react";
import { Card } from "react-bootstrap";
import type { Album } from "./Album";
import { AlbumCardHeader } from "./AlbumCardHeader";
import "../styles/AlbumCard.css";

export const AlbumCard = memo(({ album }: { album: Album }) => {
  if (!album) return null;

  return (
    <div className="p-1">
      <a
        href={album.AlbumUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none focus-ring d-block rounded-2"
        style={{
          width: "600px",
          maxWidth: "calc(100vw - 8px)",
        }}
      >
        <Card className="rounded-2 border-0 shadow-sm">
          <AlbumCardHeader album={album} />

          <Card.Body
            className="d-flex justify-content-between align-items-center px-2 rounded-2 bg-white"
            style={{ height: "48px", overflow: "hidden" }}
          >
            <span
              className="fs-4 text-dark text-truncate me-3"
              style={{ flex: 1 }}
              title={album.LinkText}
            >
              {album.LinkText}
            </span>
            <small
              className="fs-5 text-muted"
              style={{ flex: 0, whiteSpace: "nowrap" }}
            >
              {album.AlbumDate}
            </small>
          </Card.Body>
        </Card>
      </a>
    </div>
  );
});
