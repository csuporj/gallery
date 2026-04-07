import { useState } from "react";
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
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateState>({
    y: "*",
    m: "*",
    d: "*",
  });

  const { albums, loading } = useAlbums();
  const { filteredAlbums, dateOptions } = useAlbumFilters(
    albums,
    query,
    dateFilter,
  );

  return (
    <Container fluid className="px-0 pb-1 min-vh-100 bg-light">
      <div className="mx-auto pt-2 pb-1 filter-form-width">
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
      ) : (
        <VirtuosoGrid
          useWindowScroll
          initialItemCount={120}
          scrollSeekConfiguration={false}
          data={filteredAlbums}
          components={gridComponents}
          itemContent={(_index, album) => <AlbumCard album={album} />}
        />
      )}
      <div id="end" style={{ height: "84px" }} />

      <BackToTop />
    </Container>
  );
}

export default App;
