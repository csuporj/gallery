import { useMemo, useDeferredValue } from "react";

import { monthOrder } from "./monthOrder";
import { parseDate } from "./parseDate";

import type { Album } from "./types";
import type { DateState } from "./types";
import { albums } from "./useAlbums";

function sortYears(a: string, b: string) {
  return Number(b) - Number(a);
}

function sortMonths(a: string, b: string) {
  return monthOrder.indexOf(a) - monthOrder.indexOf(b);
}

function sortDays(a: string, b: string) {
  return Number(a) - Number(b);
}

function getUniqueDateParts(albums: Album[]) {
  const years = new Set<string>();
  const months = new Set<string>();
  const days = new Set<string>();

  albums.forEach((album) => {
    const { m, d, y } = parseDate(album.AlbumDate);
    if (y) years.add(y);
    if (m) months.add(m);
    if (d) days.add(d);
  });

  return {
    years: Array.from(years).sort(sortYears),
    months: Array.from(months).sort(sortMonths),
    days: Array.from(days).sort(sortDays),
  };
}

function isAlbumMatch(album: Album, query: string, filter: DateState) {
  const matchesText = album.LinkText.toLowerCase().includes(
    query.toLowerCase(),
  );
  if (!matchesText) return false;

  const { m: albM, d: albD, y: albY } = parseDate(album.AlbumDate);
  return (
    (filter.y === "*" || albY === filter.y) &&
    (filter.m === "*" || albM === filter.m) &&
    (filter.d === "*" || albD === filter.d)
  );
}

export function useAlbumFilters(query: string, dateFilter: DateState) {
  const dateOptions = useMemo(() => getUniqueDateParts(albums), []);

  const deferredQuery = useDeferredValue(query);

  const filteredAlbums = useMemo(
    () =>
      albums.filter((album) => isAlbumMatch(album, deferredQuery, dateFilter)),
    [deferredQuery, dateFilter],
  );

  console.log(
    `useAlbumFilters ${deferredQuery} ${dateFilter?.y} ${dateFilter.m} ${dateFilter.d}`,
  );

  return { dateOptions, filteredAlbums };
}
