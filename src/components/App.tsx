import { Container, Spinner } from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";
import "bootstrap/dist/css/bootstrap.min.css";

import { AlbumCard } from "./AlbumCard";
import { FilterForm } from "./FilterForm";
import { useAlbums } from "./useAlbums";
import { useAlbumFilters } from "./useAlbumFilters";
import { useAlbumParams } from "./useAlbumParams";
import { useDynamicTitle } from "./useDynamicTitle";
import { gridComponents } from "./gridComponents";
import { BackToTop } from "./BackToTop";
import "../styles/App.css";

function getInitialGridCount(totalItems: number) {
  const cols = Math.max(1, Math.floor(window.innerWidth / 608));
  const rows = Math.ceil(window.innerHeight / 456);
  return Math.min(cols * rows, totalItems);
}

export function App() {
  const { query, setQuery, dateFilter, setDateFilter } = useAlbumParams();
  const { albums, loading } = useAlbums();
  const { filteredAlbums, dateOptions } = useAlbumFilters(
    albums,
    query,
    dateFilter,
  );

  useDynamicTitle(query, dateFilter);

  const initialItemCount = getInitialGridCount(filteredAlbums.length);

  return (
    <Container fluid className="px-0 pb-1 min-vh-100 bg-light">
      <header className="mx-auto pt-1 pb-0 filter-form-width">
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
      ) : filteredAlbums.length > 0 ? (
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
      ) : (
        <div className="pt-1 text-center" role="status">
          No results found.
        </div>
      )}

      <div id="end" style={{ height: "66px" }} />
      <BackToTop />
    </Container>
  );
}
