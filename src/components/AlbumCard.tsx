import React, { memo } from "react";
import { Card } from "react-bootstrap";
import type { Album } from "./Album";
import { thumbnailPlaceholderUrl } from "./thumbnailPlaceholderUrl";

declare module "react" {
  interface ImgHTMLAttributes<T> extends React.HTMLAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = memo(({ album }: AlbumCardProps) => {
  const base = import.meta.env.BASE_URL;
  if (!album) return null;

  const hasNoImage =
    !album.ThumbnailFileName || album.ThumbnailFileName.trim() === "";

  return (
    /* 
       Padding 'p-3' provides space for the shadow to spread.
       Without this, virtualization or 'overflow: hidden' would cut the shadow off.
    */
    <div className="p-3">
      <a
        href={album.AlbumUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none d-block"
        style={{
          width: "600px",
          maxWidth: "calc(100vw - 32px)",
        }}
      >
        <Card className="rounded-0 border-0 shadow-lg">
          <Card.Img
            variant="top"
            className="rounded-0 w-100"
            src={
              hasNoImage
                ? thumbnailPlaceholderUrl
                : `${base}thumbnails/${album.ThumbnailFileName}`
            }
            style={{
              aspectRatio: "600 / 400",
              objectFit: "cover",
            }}
          />

          <Card.Body
            className="d-flex justify-content-between align-items-center px-3"
            style={{ height: "64px", overflow: "hidden" }}
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

export default AlbumCard;
