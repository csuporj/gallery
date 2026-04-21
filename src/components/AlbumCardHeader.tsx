import type { Album } from "./types";

import { useState, memo, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";

function AlbumCardHeaderComponent({ album }: { album: Album }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const imageUrl = album.ThumbnailFileName?.trim()
    ? `${import.meta.env.BASE_URL}thumbnails/${album.ThumbnailFileName}`
    : "https://placehold.co/1200x800?text=Image+Unavailable";

  useEffect(function scrollPastCancel() {
    return () => {
      if (imgRef.current) {
        imgRef.current.src = "";
      }
    };
  }, []);

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
        visibility: isLoaded ? "visible" : "hidden",
      }}
    />
  );
}

export const AlbumCardHeader = memo(AlbumCardHeaderComponent);
