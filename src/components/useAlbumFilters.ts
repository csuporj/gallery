import type { Album, DateState } from "./types";

import { useMemo } from "react";

import { getTimestamp, IS_DEBUG } from "./debug";
import { albums, parseDate } from "./albums";

function isAlbumMatch(album: Album, query: string, filter: DateState) {
  const { m, d, y } = parseDate(album.AlbumDate);
  return (
    (filter.y === "*" || y === filter.y) &&
    (filter.m === "*" || m === filter.m) &&
    (filter.d === "*" || d === filter.d) &&
    album.LinkText.toLowerCase().includes(query.toLowerCase())
  );
}

export function useAlbumFilters(query: string, dateFilter: DateState) {
  const filteredAlbums = useMemo(
    () => albums.filter((album) => isAlbumMatch(album, query, dateFilter)),
    [query, dateFilter],
  );

  if (IS_DEBUG) {
    console.log(
      getTimestamp(),
      `useAlbumFilters ${query} ${dateFilter?.y} ${dateFilter.m} ${dateFilter.d}`,
    );
  }

  return { filteredAlbums };
}
