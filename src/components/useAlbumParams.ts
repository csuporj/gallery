import { useSearchParams } from "react-router-dom";
import type { DateState } from "./DateState";

export function useAlbumParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const dateFilter: DateState = {
    y: searchParams.get("y") || "*",
    m: searchParams.get("m") || "*",
    d: searchParams.get("d") || "*",
  };

  const setQuery = (newQuery: string) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (!newQuery) params.delete("q");
        else params.set("q", newQuery);
        return params;
      },
      { replace: true },
    );
  };

  const setDateFilter = (newDate: DateState) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        (Object.keys(newDate) as Array<keyof DateState>).forEach((key) => {
          const value = newDate[key];
          if (value === "*") params.delete(key);
          else params.set(key, value);
        });
        return params;
      },
      { replace: true },
    );
  };

  return { query, setQuery, dateFilter, setDateFilter };
}
