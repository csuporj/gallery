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
    fetch(`${base}albums.json`)
      .then((res) => res.json())
      .then((data: Album[]) => {
        setAlbums(sortAlbumsByDate(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [base]);

  return { albums, loading };
}
