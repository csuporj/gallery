import type { DateState } from "./types";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

function parseDateFilter(params: URLSearchParams): DateState {
  return {
    y: params.get("y") ?? "*",
    m: params.get("m") ?? "*",
    d: params.get("d") ?? "*",
  };
}

function buildSearchParams(query: string, date: DateState): URLSearchParams {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (date.y !== "*") params.set("y", date.y);
  if (date.m !== "*") params.set("m", date.m);
  if (date.d !== "*") params.set("d", date.d);

  return params;
}

export function useAlbumParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const dateFilter = useMemo(
    () => parseDateFilter(searchParams),
    [searchParams],
  );

  const updateUrlSilently = useCallback(
    (newParams: URLSearchParams) => {
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;

      // Update the browser URL without triggering the loading indicator
      window.history.replaceState(null, "", newUrl);

      // Update React Router's internal state so the app re-renders
      setSearchParams(newParams, { replace: true });
    },
    [setSearchParams],
  );

  const setQuery = useCallback(
    (newQuery: string) => {
      const currentDates = parseDateFilter(searchParams);
      if (query === newQuery) return;
      updateUrlSilently(buildSearchParams(newQuery, currentDates));
    },
    [query, searchParams, updateUrlSilently],
  );

  const setDateFilter = useCallback(
    (newDate: DateState) => {
      if (
        dateFilter.y === newDate.y &&
        dateFilter.m === newDate.m &&
        dateFilter.d === newDate.d
      ) {
        return;
      }
      updateUrlSilently(buildSearchParams(query, newDate));
    },
    [query, dateFilter, updateUrlSilently],
  );

  console.log(
    `useAlbumParams ${query} ${dateFilter?.y} ${dateFilter.m} ${dateFilter.d}`,
  );

  return { query, setQuery, dateFilter, setDateFilter };
}
