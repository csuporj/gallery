import type { RefObject } from "react";
import type { VirtuosoGridHandle } from "react-virtuoso";
import type { Album } from "./types";

import { useRef, useEffect, useState } from "react";

import { getTimestamp, IS_DEBUG } from "./debug";

function updateAnchor(
  anchorUrl: RefObject<string | null>,
  anchorDate: RefObject<string | null>,
) {
  if (window.scrollY < 42) {
    if (anchorUrl.current !== null) {
      anchorUrl.current = null;
      anchorDate.current = null;
      if (IS_DEBUG) console.log(getTimestamp(), "updateAnchor null");
    }

    return;
  }

  const albumLinks = document.querySelectorAll(".js-album-link");
  const viewportHeight = window.innerHeight;

  for (const albumLink of albumLinks) {
    const rect = albumLink.getBoundingClientRect();

    // allows for a small error due to scrollToIndex accumulating rounding errors on some zoom levels
    if (rect.height > 0 && rect.top >= -16 && rect.top < viewportHeight) {
      const url = albumLink.getAttribute("href");
      const albumInfo = albumLink.getAttribute("data-album-info");

      if (url !== anchorUrl.current) {
        anchorUrl.current = url;
        anchorDate.current = albumInfo;
        if (IS_DEBUG) console.log(getTimestamp(), `updateAnchor ${albumInfo}`);
      }
      return;
    }
  }
  if (IS_DEBUG)
    console.log(getTimestamp(), "updateAnchor no visible items found");
}

function scrollToAnchor(
  filteredAlbums: Album[],
  virtuosoRef: RefObject<VirtuosoGridHandle | null>,
  anchorUrl: RefObject<string | null>,
  anchorDate: RefObject<string | null>,
) {
  const targetIndex = filteredAlbums.findIndex(
    (album) => album.AlbumUrl === anchorUrl.current,
  );

  if (targetIndex === -1) {
    if (IS_DEBUG) {
      console.log(
        getTimestamp(),
        `scrollToAnchor found no index of ${anchorDate.current}`,
      );
    }
    return;
  }

  virtuosoRef.current?.scrollToIndex({
    index: targetIndex,
    align: "start",
    behavior: "auto",
  });

  if (IS_DEBUG) {
    console.log(
      getTimestamp(),
      `scrollToAnchor restored to ${anchorDate.current}`,
    );
  }
}

async function guardedScrollToAnchor(
  filteredAlbums: Album[],
  virtuosoRef: RefObject<VirtuosoGridHandle | null>,
  gridWrapperRef: RefObject<HTMLDivElement | null>,
  setIsResizing: (isResizing: boolean) => void,
  resizesInProgress: RefObject<number>,
  anchorUrl: RefObject<string | null>,
  anchorDate: RefObject<string | null>,
) {
  if (!anchorUrl.current) {
    if (IS_DEBUG)
      console.log(getTimestamp(), "guardedScrollToAnchor no anchor to restore");
    return;
  }

  resizesInProgress.current++;

  if (resizesInProgress.current === 1) {
    setIsResizing(true);
    document.documentElement.classList.add("scrollbar-resizing");
    gridWrapperRef.current?.classList.add("grid-resizing");
  }

  try {
    scrollToAnchor(filteredAlbums, virtuosoRef, anchorUrl, anchorDate);
    
    // waiting for all automatic resize handling to finish,
    // including the browser's own scroll restoration,
    // and the virtuoso card size calculation
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);

    scrollToAnchor(filteredAlbums, virtuosoRef, anchorUrl, anchorDate);
  } finally {
    
    // waiting for scrollToIndex to finish, to don't change the anchor
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);

    if (resizesInProgress.current === 1) {
      document.documentElement.classList.remove("scrollbar-resizing");
      gridWrapperRef.current?.classList.remove("grid-resizing");
      setIsResizing(false);
    }
    resizesInProgress.current--;
  }
}

export function useResilientScroll(filteredAlbums: Album[], isTouch: boolean) {
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);

  const [isResizing, setIsResizing] = useState(false);
  const resizesInProgress = useRef(0);
  const lastWidth = useRef(window.innerWidth);

  const anchorUrl = useRef<string | null>(null);
  const anchorDate = useRef<string | null>(null);

  useEffect(() => {
    function onScroll() {
      if (resizesInProgress.current === 0) {
        // delaying until after the resize event has set in progress,
        // in case it is a clamping scroll caused by the browser trying to restore scroll position after a resize
        requestAnimationFrame(() => {
          if (resizesInProgress.current === 0) {
            updateAnchor(anchorUrl, anchorDate);
          }
        });
      }
    }

    async function onResize() {
      const currentWidth = window.innerWidth;
      if (currentWidth === lastWidth.current) {
        return;
      }
      lastWidth.current = currentWidth;

      if (virtuosoRef.current !== null && !isTouch) {
        guardedScrollToAnchor(
          filteredAlbums,
          virtuosoRef,
          gridWrapperRef,
          setIsResizing,
          resizesInProgress,
          anchorUrl,
          anchorDate,
        );
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [filteredAlbums, isTouch, setIsResizing]);

  return { virtuosoRef, gridWrapperRef, isResizing };
}
