import React, { memo } from "react";
import { Card } from "react-bootstrap";
import type { Album } from "./Album";
import { thumbnailPlaceholderUrl } from "./thumbnailPlaceholderUrl";

// 1. Fix the TS warning by augmenting the React interface
declare module "react" {
  interface ImgHTMLAttributes<T> extends React.HTMLAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}

interface AlbumCardProps {
  album: Album;
  priority?: boolean;
}

const AlbumCard = memo(({ album, priority }: AlbumCardProps) => {
  const base = import.meta.env.BASE_URL;
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
        className="text-decoration-none d-block shadow-lg"
        style={{
          width: "600px",
          maxWidth: "calc(100vw - 32px)",
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <Card className="rounded-0 border-0 overflow-hidden">
          {/* Strict Aspect Ratio Container for instant layout calculation */}
          <div
            style={{
              aspectRatio: "600 / 400",
              backgroundColor: "#eee",
              overflow: "hidden",
            }}
          >
            <Card.Img
              variant="top"
              className="rounded-0 w-100 h-100"
              loading={priority ? "eager" : "lazy"}
              fetchpriority={priority ? "high" : "low"}
              src={
                hasNoImage
                  ? thumbnailPlaceholderUrl
                  : `${base}thumbnails/${album.ThumbnailFileName}`
              }
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Strictly fixed height body to prevent browser "measuring" lag */}
          <Card.Body
            className="d-flex justify-content-between align-items-center px-4"
            style={{ height: "64px"  }}
          >
            <span
              className="fs-4 text-dark text-truncate me-3"
              style={{ flex: 1 }}
              title={album.LinkText}
            >
              {album.LinkText}
            </span>
            <small
              className="fs-5 text-muted flex-shrink-0"
              style={{ whiteSpace: "nowrap" }}
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
