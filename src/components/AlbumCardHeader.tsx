import type { Album } from "./types";

import { useState, memo, useRef, useEffect } from "react";
import { Card } from "react-bootstrap";

import { thumbnailPlaceholderUrl } from "./thumbnailPlaceholderUrl";

function AlbumCardHeaderComponent({ album }: { album: Album }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const base = import.meta.env.BASE_URL;

  const imageUrl = album.ThumbnailFileName?.trim()
    ? `${base}thumbnails/${album.ThumbnailFileName}`
    : thumbnailPlaceholderUrl;

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [imageUrl]);

  const visibility = isLoaded ? "visible" : "hidden";

  return (
    <Card.Img
      ref={imgRef}
      className="rounded-0 w-100"
      onLoad={() => setIsLoaded(true)}
      src={imageUrl}
      style={{
        aspectRatio: "600 / 400",
        objectFit: "cover",
        visibility: visibility,
      }}
    />
  );
}

export const AlbumCardHeader = memo(AlbumCardHeaderComponent);
