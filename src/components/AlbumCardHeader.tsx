import type { Album } from "./types";

import { useState, memo, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";

import { thumbnailPlaceholderUrl } from "./thumbnailPlaceholderUrl";

function AlbumCardHeaderComponent({ album }: { album: Album }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const base = import.meta.env.BASE_URL;

  const imageUrl = album.ThumbnailFileName?.trim()
    ? `${base}thumbnails/${album.ThumbnailFileName}`
    : thumbnailPlaceholderUrl;

  useEffect(function scrollPastCancel() {
    return () => {
      if (imgRef.current) {
        imgRef.current.src = "";
      }
    };
  }, []);

  const visibility = isLoaded ? "visible" : "hidden";

  return (
    <Card.Img
      ref={(img) => {
        imgRef.current = img;
        if (img?.complete) {
          setIsLoaded(true);
        }
      }}
      onLoad={() => setIsLoaded(true)}
      src={imageUrl}
      className="rounded-0 w-100"
      style={{
        aspectRatio: "600 / 400",
        objectFit: "cover",
        visibility: visibility,
      }}
    />
  );
}

export const AlbumCardHeader = memo(AlbumCardHeaderComponent);
