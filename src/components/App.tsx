import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";

import { useFilter } from "./useFilter";
import { useFilteredAlbums } from "./useFilteredAlbums";
import { useTitle } from "./useTitle";

import { AlbumCard } from "./AlbumCard";
import { FilterForm } from "./FilterForm";
import { BackToTop } from "./BackToTop";
import { gridComponents } from "./gridComponents";

function getInitialGridCount(albumsLength: number) {
  const cols = Math.max(1, Math.floor(window.innerWidth / 608));
  const rows = Math.ceil(window.innerHeight / 456);
  return Math.min(cols * rows, albumsLength);
}

export function App() {
  const { query, setQuery, dateFilter, setDateFilter } = useFilter();
  useTitle(query, dateFilter);
  const { filteredAlbums } = useFilteredAlbums(query, dateFilter);

  const initialItemCount = getInitialGridCount(filteredAlbums.length);

  const [isReady, setIsReady] = useState(false);

  // scroll to top on reload, dont break bfcache
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container fluid className="px-0 pt-0 pb-1">
      <FilterForm
        query={query}
        setQuery={setQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {!isReady ? null : filteredAlbums?.length === 0 ? (
        <div className="mt-1 text-center">No results found.</div>
      ) : (
        <VirtuosoGrid
          useWindowScroll
          increaseViewportBy={1000}
          components={gridComponents}
          data={filteredAlbums}
          itemContent={(_, album) => (
            <AlbumCard album={album} key={album.AlbumUrl} />
          )}
          initialItemCount={initialItemCount}
        />
      )}

      <BackToTop />
    </Container>
  );
}
