import albumsData from "../albums.json";
import { parseDate } from "./parseDate";
import { monthOrder } from "./monthOrder";
import type { Album } from "./types";

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

export const albums: Album[] = sortAlbumsByDate(albumsData as Album[]);
