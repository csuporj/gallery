import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";
import "bootstrap/dist/css/bootstrap.min.css";

import type { DateState } from "./DateState";
import AlbumCard from "./AlbumCard";
import FilterForm from "./FilterForm";
import { useAlbums } from "./useAlbums";
import { useAlbumFilters } from "./useAlbumFilters";
import "../styles/App.css";
import { gridComponents } from "./gridComponents";
import BackToTop from "./BackToTop";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Read values directly from URL (or use defaults)
  const query = searchParams.get("q") || "";
  const dateFilter: DateState = {
    y: searchParams.get("y") || "*",
    m: searchParams.get("m") || "*",
    d: searchParams.get("d") || "*",
  };

  // 2. Update functions that modify URL and replace history
  const setQuery = (newQuery: string) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery === "") {
      params.delete("q");
    } else {
      params.set("q", newQuery);
    }
    setSearchParams(params, { replace: true });
  };

  const setDateFilter = (newDate: DateState) => {
    const params = new URLSearchParams(searchParams);

    // Process y, m, d: if value is "*", remove it from URL
    (Object.keys(newDate) as Array<keyof DateState>).forEach((key) => {
      const value = newDate[key];
      if (value === "*") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    setSearchParams(params, { replace: true });
  };

  const { albums, loading } = useAlbums();
  const { filteredAlbums, dateOptions } = useAlbumFilters(
    albums,
    query,
    dateFilter,
  );

  const safeInitialCount = useMemo(() => {
    const cols = Math.max(1, Math.floor(window.innerWidth / 608));
    const rows = Math.ceil(window.innerHeight / 456);
    return Math.min(cols * rows);
  }, []);

  return (
    <Container fluid className="px-0 pb-1 min-vh-100 bg-light">
      <div className="mx-auto pt-1 pb-0 filter-form-width">
        <FilterForm
          query={query}
          setQuery={setQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          dateOptions={dateOptions}
        />
      </div>

      {loading ? (
        <Container className="text-center mt-5">
          <Spinner animation="border" />
        </Container>
      ) : filteredAlbums.length > 0 ? (
        <VirtuosoGrid
          useWindowScroll
          initialItemCount={Math.min(safeInitialCount, filteredAlbums.length)}
          increaseViewportBy={1000}
          scrollSeekConfiguration={false}
          data={filteredAlbums}
          components={gridComponents}
          itemContent={(_index, album) => (
            <AlbumCard album={album} key={album.AlbumUrl} />
          )}
        />
      ) : (
        <div className="pt-1 text-center">No results.</div>
      )}

      <div id="end" style={{ height: "66px" }} />

      <BackToTop />
    </Container>
  );
}

export default App;
