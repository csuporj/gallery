import { useMemo, useDeferredValue } from "react";
import type { Album } from "./Album";
import type { DateState } from "./DateState";
import { monthOrder } from "./monthOrder";
import { parseDate } from "./parseDate";

export function useAlbumFilters(
  albums: Album[],
  query: string,
  dateFilter: DateState,
) {
  const deferredQuery = useDeferredValue(query);

  const dateOptions = useMemo(() => {
    const years = new Set<string>(),
      months = new Set<string>(),
      days = new Set<string>();

    albums.forEach((album) => {
      const { m, d, y } = parseDate(album.AlbumDate);
      if (y) years.add(y);
      if (m) months.add(m);
      if (d) days.add(d);
    });

    return {
      years: Array.from(years).sort((a, b) => b.localeCompare(a)),
      months: Array.from(months).sort(
        (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b),
      ),
      days: Array.from(days).sort((a, b) => parseInt(a) - parseInt(b)),
    };
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const matchesText = album.LinkText.toLowerCase().includes(
        deferredQuery.toLowerCase(),
      );
      if (!matchesText) return false;

      const { m: albM, d: albD, y: albY } = parseDate(album.AlbumDate);
      return (
        (dateFilter.y === "*" || albY === dateFilter.y) &&
        (dateFilter.m === "*" || albM === dateFilter.m) &&
        (dateFilter.d === "*" || albD === dateFilter.d)
      );
    });
  }, [albums, deferredQuery, dateFilter]);

  return { filteredAlbums, dateOptions };
}
