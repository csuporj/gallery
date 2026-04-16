import { useState, useEffect } from "react";
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
  return data
    .map((album) => ({ album, key: getSortKey(album.AlbumDate) }))
    .sort((a, b) => b.key - a.key)
    .map((item) => item.album);
}

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAlbums() {
      try {
        const response = await fetch(`${base}albums.json`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Album[] = await response.json();
        setAlbums(sortAlbumsByDate(data));
        setLoading(false);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to load albums:", error);
          setLoading(false);
        }
      }
    }

    fetchAlbums();

    return function cleanupUseAlbums() {
      controller.abort();
    };
  }, [base]);

  return { albums, loading };
}
