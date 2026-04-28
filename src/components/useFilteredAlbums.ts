import type { Album, Filter } from "./types";

import { useMemo } from "react";

import { getTimestamp, IS_DEBUG } from "./debug";
import { albums, parseDate } from "./albums";

function isAlbumMatch(album: Album, filter: Filter) {
  const { m, d, y } = parseDate(album.AlbumDate);

  return (
    (filter.y === "*" || filter.y === y) &&
    (filter.m === "*" || filter.m === m) &&
    (filter.d === "*" || filter.d === d) &&
    album.LinkText.toLowerCase().includes(filter.s.toLowerCase())
  );
}

export function useFilteredAlbums(filter: Filter) {
  const filteredAlbums = useMemo(() => {
    const filtered = albums.filter((album) => isAlbumMatch(album, filter));

    if (IS_DEBUG)
      console.log(
        getTimestamp(),
        `useFilteredAlbums ${filter.s} ${filter.y} ${filter.m} ${filter.d}`,
      );

    return filtered;
  }, [filter]);

  return filteredAlbums;
}
