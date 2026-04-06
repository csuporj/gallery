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
import "../styles/App.css";

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

  return (
    <Container fluid className="px-0 min-vh-100">
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
          initialItemCount={24}
          scrollSeekConfiguration={false}
          overscan={{ main: 500, reverse: 500 }}
          increaseViewportBy={{ top: 1000, bottom: 1000 }}
          data={filteredAlbums}
          components={gridComponents}
          itemContent={(_index, album) => <AlbumCard album={album} />}
        />
      )}
    </Container>
  );
}

export default App;
