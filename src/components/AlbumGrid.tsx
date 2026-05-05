import type { RefObject } from "react";
import type { VirtuosoGridHandle } from "react-virtuoso";
import type { Album } from "./types";

import { memo, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { VirtuosoGrid } from "react-virtuoso";

import { getTimestamp, IS_DEBUG } from "./debug";
import { gridComponents } from "./gridComponents";
import { AlbumCard } from "./AlbumCard";

interface AlbumGridProps {
  filteredAlbums: Album[];
  virtuosoRef: RefObject<VirtuosoGridHandle | null>;
  gridWrapperRef: RefObject<HTMLDivElement | null>;
}

function getInitialGridCount(albumsLength: number) {
  const cols = Math.max(1, Math.floor(window.innerWidth / 608));
  const rows = Math.ceil(window.innerHeight / 456);
  return Math.min(cols * rows, albumsLength);
}

function removeLoadingClass() {
  document.body.classList.remove("loading");
  if (IS_DEBUG) console.log(getTimestamp(), "removeLoadingClass");
}

function renderAlbum(_index: number, album: Album) {
  return <AlbumCard album={album} />;
}

function AlbumGrid({
  filteredAlbums: filteredAlbums,
  virtuosoRef,
  gridWrapperRef,
}: AlbumGridProps) {
  const [isDelayReady, setIsDelayReady] = useState(false);
  const hasLoadingClass = useRef(true);

  const initialItemCount = useMemo(
    () => getInitialGridCount(filteredAlbums.length),
    [filteredAlbums.length],
  );

  useEffect(() => {
    const isDelayReadyTimer = setTimeout(() => setIsDelayReady(true), 100);
    return () => clearTimeout(isDelayReadyTimer);
  }, []);

  const onReadyStateChanged = useCallback((ready: boolean) => {
    if (ready && hasLoadingClass.current) {
      hasLoadingClass.current = false;
      setTimeout(removeLoadingClass, 100);
    }
  }, []);

  // Waits for the browser's automatic scroll restoration to finish.
  // Needed because the browser's scroll restoration sometimes happens just after loading the initial items,
  // thus the scrollbar gets almost to the top.
  if (!isDelayReady) return null;

  if (filteredAlbums.length === 0) {
    return <div className="mt-1 text-center">No results found.</div>;
  }

  return (
    <div ref={gridWrapperRef}>
      <VirtuosoGrid
        ref={virtuosoRef}
        useWindowScroll
        increaseViewportBy={1000}
        components={gridComponents}
        data={filteredAlbums}
        itemContent={renderAlbum}
        initialItemCount={initialItemCount}
        readyStateChanged={onReadyStateChanged}
      />
    </div>
  );
}

export const MemoAlbumGrid = memo(AlbumGrid);
