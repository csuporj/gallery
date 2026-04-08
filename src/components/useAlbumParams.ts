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

  const updateParams = (newQuery: string, newDate: DateState) => {
    const params = new URLSearchParams();

    if (newQuery) params.set("q", newQuery);

    if (newDate.y !== "*") params.set("y", newDate.y);
    if (newDate.m !== "*") params.set("m", newDate.m);
    if (newDate.d !== "*") params.set("d", newDate.d);

    setSearchParams(params, { replace: true });
  };

  const setQuery = (newQuery: string) => {
    updateParams(newQuery, dateFilter);
  };

  const setDateFilter = (newDate: DateState) => {
    updateParams(query, newDate);
  };

  return { query, setQuery, dateFilter, setDateFilter };
}
