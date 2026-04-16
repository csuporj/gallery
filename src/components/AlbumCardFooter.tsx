import type { Album } from "./types";

import "../styles/AlbumCardFooter.css";

import { memo } from "react";
import { Card } from "react-bootstrap";

function AlbumCardFooterComponent({ album }: { album: Album }) {
  return (
    <Card.Body
      className="d-flex align-items-center overflow-hidden bg-white rounded-0 p-0"
      style={{
        height: "48px",
      }}
    >
      <div
        className="d-inline-block text-truncate fs-4 text-dark"
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* the margin before the title, shrinks after the title disapeared */}
        <div className="album-margin" />

        {album.LinkText}
      </div>

      <div
        className="d-flex align-items-center overflow-hidden"
        style={{ minWidth: 0 }}
      >
        {/* half of the space after the title, shrinks after the title disapeared */}
        <div
          className="album-margin"
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        <div
          className="d-inline-block text-truncate px-2 fs-5 text-muted"
          style={{ minWidth: 0 }}
        >
          {album.AlbumDate}
        </div>
      </div>
    </Card.Body>
  );
}

export const AlbumCardFooter = memo(AlbumCardFooterComponent);
