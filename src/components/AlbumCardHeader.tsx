import { useState, memo } from "react";
import { Card } from "react-bootstrap";
import type { Album } from "./Album";
import { thumbnailPlaceholderUrl } from "./thumbnailPlaceholderUrl";

function AlbumCardHeaderComponent({ album }: { album: Album }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const base = import.meta.env.BASE_URL;

  const hasImage =
    album.ThumbnailFileName && album.ThumbnailFileName.trim() !== "";

  const imageUrl = hasImage
    ? `${base}thumbnails/${album.ThumbnailFileName}`
    : thumbnailPlaceholderUrl;

  const visibility = isLoaded ? "visible" : "hidden";

  return (
    <Card.Img
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
