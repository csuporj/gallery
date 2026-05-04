import { Container } from "react-bootstrap";

import { useFilter } from "./useFilter";
import { useTitle } from "./useTitle";
import { useFilteredAlbums } from "./useFilteredAlbums";
import { useIsTouch } from "./useIsTouch";
import { useResilientScroll } from "./useResilientScroll";

import { MemoFilterForm } from "./FilterForm";
import { MemoAlbumGrid } from "./AlbumGrid";
import { MemoBackToTop } from "./BackToTop";

export function App() {
  const { filter, setS, setY, setM, setD } = useFilter();
  useTitle(filter);
  const filteredAlbums = useFilteredAlbums(filter);
  const isTouch = useIsTouch();
  const { virtuosoRef, gridWrapperRef, isResizing } = useResilientScroll(
    filteredAlbums,
    isTouch,
  );

  return (
    <Container fluid className="px-0 pt-0 pb-1">
      <MemoFilterForm
        filter={filter}
        setS={setS}
        setY={setY}
        setM={setM}
        setD={setD}
      />

      <MemoAlbumGrid
        filteredAlbums={filteredAlbums}
        virtuosoRef={virtuosoRef}
        gridWrapperRef={gridWrapperRef}
      />

      <MemoBackToTop isTouch={isTouch} isResizing={isResizing} />
    </Container>
  );
}
