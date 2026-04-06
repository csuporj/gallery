import { useState, useEffect, useRef } from "react";
import { Container, Spinner } from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";
import "bootstrap/dist/css/bootstrap.min.css";

import type { DateState } from "./DateState";
import AlbumCard from "./AlbumCard";
import FilterForm from "./FilterForm";
import BackToTop from "./BackToTop";
import { useAlbums } from "./useAlbums";
import { useAlbumFilters } from "./useAlbumFilters";
import { useScrollToTop } from "./useScrollToTop";
import { gridComponents } from "./gridComponents";
import "../styles/App.css";

function App() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(true);
  const [showButton, setShowButton] = useState(false);

  // Use a ref to track scroll position without triggering re-renders
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

      // 1. Header Visibility Logic
      if (currentScrollY < 100) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false); // Scrolling Down
      } else {
        setVisible(true); // Scrolling Up
      }

      // 2. Back-to-Top Button Visibility Logic
      setShowButton(currentScrollY > 600);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container fluid className="px-0 min-vh-100 bg-light">
      {/* STICKY HEADER */}
      <div
        className="fixed-top bg-white border-bottom shadow-sm transition-header"
        style={{
          zIndex: 1050,
          padding: "8px 0",
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="mx-auto filter-form-width d-flex align-items-center gap-2 px-3">
          <div className="flex-grow-1">
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
          </div>

          <BackToTop show={showButton} onClick={scrollToTop} />
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div style={{ height: "70px" }} />

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

      {/* Bottom spacer */}
      <div style={{ height: "40px" }} />
    </Container>
  );
}

export default App;
