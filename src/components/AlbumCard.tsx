import { memo } from "react";
import { Card, Col } from "react-bootstrap";
import type { Album } from "./Album";
import { thumbnailPlaceholderUrl } from "./thumbnailPlaceholderUrl";

const AlbumCard = memo(({ album }: { album: Album }) => {
  const base = import.meta.env.BASE_URL;
  const hasNoImage =
    !album.ThumbnailFileName || album.ThumbnailFileName.trim() === "";

  return (
    <Col xs="auto">
      <a
        href={album.AlbumUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
      >
        <Card
          className="overflow-hidden mx-auto shadow-lg rounded-0 border-0"
          style={{ width: "600px", maxWidth: "calc(100vw - 32px)" }}
        >
          <Card.Img
            variant="top"
            className="rounded-0"
            src={
              hasNoImage
                ? thumbnailPlaceholderUrl
                : `${base}thumbnails/${album.ThumbnailFileName}`
            }
            style={{
              width: "600px",
              height: "400px",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Title and Date now below the photo */}
          <Card.Body className="bg-white d-flex justify-content-between align-items-center px-4 py-3">
            <span className="fw-bold fs-4 text-dark text-truncate me-3">
              {album.LinkText}
            </span>
            <small className="fs-5 text-muted flex-shrink-0">
              {album.AlbumDate}
            </small>
          </Card.Body>
        </Card>
      </a>
    </Col>
  );
});

export default AlbumCard;
