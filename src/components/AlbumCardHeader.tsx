import type { Album } from "./types";

import { useState, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";

export function AlbumCardHeader({ album }: { album: Album }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const imageUrl = album.ThumbnailFileName?.trim()
    ? `${import.meta.env.BASE_URL}thumbnails/${album.ThumbnailFileName}`
    : "https://placehold.co/1200x800?text=Image+Unavailable";

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
      alt={`${album.LinkText} ${album.AlbumDate}`}
      className="rounded-0 w-100"
      style={{
        aspectRatio: "600 / 400",
        objectFit: "cover",
        visibility: isLoaded ? "visible" : "hidden",
      }}
    />
  );
}
