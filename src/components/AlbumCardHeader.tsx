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

  function handleRefAssignment(img: HTMLImageElement | null) {
    imgRef.current = img;
    if (img?.complete) {
      setIsLoaded(true);
    }
  }

  function handleImageLoad() {
    setIsLoaded(true);
  }

  useEffect(function setupCleanup() {
    function cancelImageDownload() {
      if (imgRef.current) {
        imgRef.current.src = "";
      }
    }

    return cancelImageDownload;
  }, []);

  const visibility = isLoaded ? "visible" : "hidden";

  return (
    <Card.Img
      ref={handleRefAssignment}
      onLoad={handleImageLoad}
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
