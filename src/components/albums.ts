import type { Album } from "./types";

import albumsData from "../albums.json";

import { parseDate } from "./parseDate";
import { monthOrder } from "./monthOrder";

function getSortKey(dateStr: string): number {
  const { m, d, y } = parseDate(dateStr);
  const monthIdx = monthOrder.indexOf(m);

  if (monthIdx === -1 || !y) return 0;

  const mm = (monthIdx + 1).toString().padStart(2, "0");
  const dd = d.padStart(2, "0");

  return Number(`${y}${mm}${dd}`);
}

function sortAlbumsByDate(data: Album[]): Album[] {
  return [...data].sort((a, b) => {
    return getSortKey(b.AlbumDate) - getSortKey(a.AlbumDate);
  });
}

function getUniqueDateParts() {
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
    years: Array.from(years).sort((a, b) => Number(b) - Number(a)),
    months: Array.from(months).sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b),
    ),
    days: Array.from(days).sort((a, b) => Number(a) - Number(b)),
  };
}

export const albums: Album[] = sortAlbumsByDate(albumsData as Album[]);
export const dateOptions = getUniqueDateParts();
