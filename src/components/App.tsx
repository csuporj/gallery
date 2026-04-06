import { useState, useEffect, useRef } from "react";
import { Container, Spinner } from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";
import "bootstrap/dist/css/bootstrap.min.css";

import type { DateState } from "./DateState";
import AlbumCard from "./AlbumCard";
import FilterForm from "./FilterForm";
import MainLayout from "./MainLayout";
import { useAlbums } from "./useAlbums";
import { useAlbumFilters } from "./useAlbumFilters";
import { useScrollToTop } from "./useScrollToTop";
import { gridComponents } from "./gridComponents";
import "../styles/App.css";

function App() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const lastScrollY = useRef(0);

  const [dateFilter, setDateFilter] = useState<DateState>({
    y: "*",
    m: "*",
    d: "*",
  });

  const { albums, loading } = useAlbums();
  const { scrollToTop } = useScrollToTop();
  const { filteredAlbums, dateOptions } = useAlbumFilters(
    albums,
    query,
    dateFilter,
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Header Visibility
      if (currentScrollY < 100) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      // Button Visibility
      setShowButton(currentScrollY > 600);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MainLayout
      visible={visible}
      showButton={showButton}
      onScrollToTop={scrollToTop}
      headerContent={
        <FilterForm
          query={query}
          setQuery={(q) => {
            setQuery(q);
            window.scrollTo(0, 0);
          }}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          dateOptions={dateOptions}
        />
      }
    >
      {loading ? (
        <Container className="text-center mt-5">
          <Spinner animation="border" />
        </Container>
      ) : (
        <VirtuosoGrid
          useWindowScroll
          initialItemCount={24}
          data={filteredAlbums}
          components={gridComponents}
          itemContent={(_index, album) => <AlbumCard album={album} />}
        />
      )}
    </MainLayout>
  );
}

export default App;
