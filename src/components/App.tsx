import { useRef } from "react";
import { Container, Spinner } from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";

import { useAlbums } from "./useAlbums";
import { useAlbumParams } from "./useAlbumParams";
import { useAlbumFilters } from "./useAlbumFilters";
import { useDynamicTitle } from "./useDynamicTitle";

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
  const { albums, loading } = useAlbums();
  const { query, setQuery, dateFilter, setDateFilter } = useAlbumParams();
  const { filteredAlbums, dateOptions } = useAlbumFilters(
    albums,
    query,
    dateFilter,
  );
  useDynamicTitle(query, dateFilter);
  const endRef = useRef<HTMLDivElement>(null);

  const initialItemCount = getInitialGridCount(filteredAlbums.length);

  return (
    <Container fluid className="p-0">
      <FilterForm
        dateOptions={dateOptions}
        query={query}
        setQuery={setQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {loading ? (
        <Container className="text-center mt-5">
          <Spinner animation="border" />
        </Container>
      ) : filteredAlbums.length === 0 ? (
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

      <div ref={endRef} style={{ height: "72px" }} />
      <BackToTop endRef={endRef} />
    </Container>
  );
}
