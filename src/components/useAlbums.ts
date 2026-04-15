import { useState, useEffect } from "react";

import type { Album } from "./Album";

const sortAlbumsByDate = (data: Album[]) => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.AlbumDate).getTime();
    const dateB = new Date(b.AlbumDate).getTime();
    return isNaN(dateA) || isNaN(dateB) ? 0 : dateB - dateA;
  });
};

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const controller = new AbortController();

    const fetchAlbums = async () => {
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
    };

    fetchAlbums();

    return () => controller.abort();
  }, [base]);

  return { albums, loading };
}
