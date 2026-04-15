import { useRef } from "react";
import { Container, Spinner } from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";

import "../styles/App.css";

import { AlbumCard } from "./AlbumCard";
import { FilterForm } from "./FilterForm";
import { BackToTop } from "./BackToTop";

import { gridComponents } from "./gridComponents";

import { useAlbums } from "./useAlbums";
import { useAlbumParams } from "./useAlbumParams";
import { useAlbumFilters } from "./useAlbumFilters";
import { useDynamicTitle } from "./useDynamicTitle";

function getInitialGridCount(albumsLength: number) {
  const cols = Math.max(1, Math.floor(window.innerWidth / 608));
  const rows = Math.ceil(window.innerHeight / 456);
  return Math.min(cols * rows, albumsLength);
}

export function App() {
  const { query, setQuery, dateFilter, setDateFilter } = useAlbumParams();
  const { albums, loading } = useAlbums();
  const { filteredAlbums, dateOptions } = useAlbumFilters(
    albums,
    query,
    dateFilter,
  );

  const endRef = useRef<HTMLDivElement>(null);

  useDynamicTitle(query, dateFilter);

  const initialItemCount = getInitialGridCount(filteredAlbums.length);

  return (
    <Container fluid className="p-0 min-vh-100 bg-light">
      <header className="mx-auto filter-form-width">
        <FilterForm
          query={query}
          setQuery={setQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          dateOptions={dateOptions}
        />
      </header>

      {loading ? (
        <Container className="text-center mt-5">
          <Spinner animation="border" />
        </Container>
      ) : filteredAlbums.length === 0 ? (
        <div className="mt-1 text-center" role="status">
          No results found.
        </div>
      ) : (
        <VirtuosoGrid
          useWindowScroll
          initialItemCount={initialItemCount}
          increaseViewportBy={1000}
          data={filteredAlbums}
          components={gridComponents}
          itemContent={(_, album) => (
            <AlbumCard album={album} key={album.AlbumUrl} />
          )}
        />
      )}

      <div ref={endRef} style={{ height: "72px" }} />
      <BackToTop endRef={endRef} />
    </Container>
  );
}
