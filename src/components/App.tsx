import {
  useState,
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Container, Spinner } from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";
import "bootstrap/dist/css/bootstrap.min.css";

import type { DateState } from "./DateState";
import AlbumCard from "./AlbumCard";
import FilterForm from "./FilterForm";
import { useAlbums } from "./useAlbums";
import { useAlbumFilters } from "./useAlbumFilters";

const gridComponents = {
  List: forwardRef<
    HTMLDivElement,
    { style?: CSSProperties; children?: ReactNode }
  >(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingBottom: "2rem",
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }: { children?: ReactNode }) => (
    <div {...props} style={{ display: "flex" }}>
      {children}
    </div>
  ),
};

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

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid className="px-0 min-vh-100">
      <div
        className="mx-auto px-3"
        style={{
          maxWidth: "850px",
          paddingTop: "1.5rem",
          marginBottom: "1rem",
        }}
      >
        <FilterForm
          query={query}
          setQuery={setQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          dateOptions={dateOptions}
        />
      </div>

      <VirtuosoGrid
        useWindowScroll
        data={filteredAlbums}
        components={gridComponents}
        itemContent={(_index, album) => <AlbumCard album={album} />}
      />
    </Container>
  );
}

export default App;
