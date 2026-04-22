import type { Album } from "./types";

import albumsData from "../albums.json";
import { getTimestamp, IS_DEBUG } from "./debug";

function sortWithKey<T>(
  array: T[],
  getSortKey: (item: T) => number,
  desc = false,
): T[] {
  return array
    .map((item) => ({ item, key: getSortKey(item) }))
    .sort((a, b) => (desc ? b.key - a.key : a.key - b.key))
    .map(({ item }) => item);
}

function getSortKey(album: Album): number {
  const { m, d, y } = parseDate(album.AlbumDate);
  const monthIdx = monthOrder.indexOf(m);

  if (monthIdx === -1 || !y) return 0;

  const mm = (monthIdx + 1).toString().padStart(2, "0");
  const dd = d.padStart(2, "0");

  return Number(`${y}${mm}${dd}`);
}

function sortAlbums(data: Album[]): Album[] {
  return sortWithKey(data, getSortKey, true);
}

function getDateOptions() {
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

export function parseDate(dateStr: string) {
  const match = dateStr.match(/([a-zA-Z]+)\s+(\d+),\s+(\d+)/);
  return match
    ? { m: match[1], d: match[2], y: match[3] }
    : { m: "", d: "", y: "" };
}

const monthOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

if (IS_DEBUG) {
  console.log(getTimestamp(), "albums.ts start");
}
export const albums: Album[] = sortAlbums(albumsData as Album[]);
if (IS_DEBUG) {
  console.log(getTimestamp(), "albums.ts middle");
}
export const dateOptions = getDateOptions();
if (IS_DEBUG) {
  console.log(getTimestamp(), "albums.ts end");
}
