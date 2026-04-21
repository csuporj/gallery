import type { Album, DateState } from "./types";

import { useMemo } from "react";

import { getTimestamp, IS_DEBUG } from "./debug";
import { albums, parseDate } from "./albums";

function isAlbumMatch(album: Album, query: string, filter: DateState) {
  const { m, d, y } = parseDate(album.AlbumDate);
  const q = query.toLowerCase();

  return (
    (filter.y === "*" || filter.y === y) &&
    (filter.m === "*" || filter.m === m) &&
    (filter.d === "*" || filter.d === d) &&
    album.LinkText.toLowerCase().includes(q)
  );
}

export function useFilteredAlbums(query: string, dateFilter: DateState) {
  const filteredAlbums = useMemo(() => {
    if (IS_DEBUG) {
      console.log(
        getTimestamp(),
        `useAlbumFilters start ${query} ${dateFilter?.y} ${dateFilter.m} ${dateFilter.d}`,
      );
    }

    const filtered = albums.filter((album) =>
      isAlbumMatch(album, query, dateFilter),
    );

    if (IS_DEBUG) {
      console.log(
        getTimestamp(),
        `useAlbumFilters end ${query} ${dateFilter?.y} ${dateFilter.m} ${dateFilter.d}`,
      );
    }

    return filtered;
  }, [query, dateFilter]);

  return { filteredAlbums };
}
