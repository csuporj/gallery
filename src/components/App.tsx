import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";

import { getTimestamp, IS_DEBUG } from "./debug";
import { useFilter } from "./useFilter";
import { useTitle } from "./useTitle";
import { useFilteredAlbums } from "./useFilteredAlbums";
import { useIsTouch } from "./useIsTouch";
import { useResilientScroll } from "./useResilientScroll";
import { gridComponents } from "./gridComponents";

import { AlbumCard } from "./AlbumCard";
import { FilterForm } from "./FilterForm";
import { BackToTop } from "./BackToTop";

function getInitialGridCount(albumsLength: number) {
  const cols = Math.max(1, Math.floor(window.innerWidth / 608));
  const rows = Math.ceil(window.innerHeight / 456);
  return Math.min(cols * rows, albumsLength);
}

function removeLoadingClass() {
  document.body.classList.remove("loading");
  if (IS_DEBUG) console.log(getTimestamp(), "removeLoadingClass");
}

export function App() {
  const { filter, setS, setY, setM, setD } = useFilter();
  useTitle(filter);
  const filteredAlbums = useFilteredAlbums(filter);
  const isTouch = useIsTouch();
  const { virtuosoRef, gridWrapperRef } = useResilientScroll(
    filteredAlbums,
    isTouch,
  );
  const [isReady, setIsReady] = useState(false);
  const hasLoadingClass = useRef(true);
  const initialItemCount = getInitialGridCount(filteredAlbums.length);

  // scroll to top on reload, do not break bfcache
  useEffect(() => {
    const isReadyTimer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(isReadyTimer);
  }, []);

  return (
    <Container fluid className="px-0 pt-0 pb-1">
      <FilterForm
        filter={filter}
        setS={setS}
        setY={setY}
        setM={setM}
        setD={setD}
      />

      {!isReady ? null : filteredAlbums?.length === 0 ? (
        <div className="mt-1 text-center">No results found.</div>
      ) : (
        <div ref={gridWrapperRef}>
          <VirtuosoGrid
            ref={virtuosoRef}
            useWindowScroll
            increaseViewportBy={1000}
            components={gridComponents}
            data={filteredAlbums}
            itemContent={(_, album) => (
              <AlbumCard album={album} key={album.AlbumUrl} />
            )}
            initialItemCount={initialItemCount}
            readyStateChanged={(r) => {
              if (r && hasLoadingClass) {
                hasLoadingClass.current = false;
                setTimeout(() => {
                  removeLoadingClass();
                }, 100);
              }
            }}
          />
        </div>
      )}

      <BackToTop isTouch={isTouch} />
    </Container>
  );
}
