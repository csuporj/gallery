import { useState } from "react";
import { Card } from "react-bootstrap";
import type { Album } from "./Album";
import { thumbnailPlaceholderUrl } from "./thumbnailPlaceholderUrl";

export const AlbumCardHeader = ({ album }: { album: Album }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const base = import.meta.env.BASE_URL;

  const hasImage =
    album.ThumbnailFileName && album.ThumbnailFileName.trim() !== "";

  const imageUrl = hasImage
    ? `${base}thumbnails/${album.ThumbnailFileName}`
    : thumbnailPlaceholderUrl;

  return (
    <Card.Img
      variant="top"
      className="rounded-2 w-100"
      onLoad={() => setIsLoaded(true)}
      src={imageUrl}
      style={{
        aspectRatio: "600 / 400",
        objectFit: "cover",
        visibility: isLoaded ? "visible" : "hidden",
      }}
    />
  );
};
