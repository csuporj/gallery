import type { Album } from "./types";

import { memo } from "react";
import { Card } from "react-bootstrap";

import "../styles/AlbumCard.css";

import { AlbumCardHeader } from "./AlbumCardHeader";
import { AlbumCardFooter } from "./AlbumCardFooter";

function AlbumCardComponent({ album }: { album: Album }) {
  if (!album) return null;

  return (
    <div className="p-1">
      <a
        href={album.AlbumUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none focus-ring d-block rounded-0"
        style={{
          width: "600px",
          maxWidth: "calc(100vw - 8px)",
        }}
      >
        <Card className="rounded-0 border-0 shadow-sm">
          <AlbumCardHeader album={album} />
          <AlbumCardFooter album={album} />
        </Card>
      </a>
    </div>
  );
}

export const AlbumCard = memo(AlbumCardComponent);
