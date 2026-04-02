import { useState } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import type { DateState } from "./DateState";
import AlbumCard from "./AlbumCard";
import FilterForm from "./FilterForm";
import { useAlbums } from "./useAlbums";
import { useAlbumFilters } from "./useAlbumFilters";

function App() {
  // State for filters
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateState>({ y: "*", m: "*", d: "*" });

  // Custom Hooks
  const { albums, loading } = useAlbums();
  const { filteredAlbums, dateOptions } = useAlbumFilters(albums, query, dateFilter);

  if (loading) return (
    <Container className="text-center mt-5"><Spinner animation="border" /></Container>
  );

  return (
    <Container fluid className="px-0 bg-light min-vh-100">
      <div className="mx-auto px-3" style={{ maxWidth: "850px", paddingTop: "1.5rem" }}>
        <FilterForm 
          query={query} 
          setQuery={setQuery} 
          dateFilter={dateFilter} 
          setDateFilter={setDateFilter} 
          dateOptions={dateOptions} 
        />
      </div>

      <Row className="justify-content-center g-4 m-0 pb-4">
        {filteredAlbums.map((album, index) => (
          <AlbumCard key={index} album={album} />
        ))}
      </Row>
    </Container>
  );
}

export default App;
