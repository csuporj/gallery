import type { DateState } from "./types";

import { useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const query = searchParams.get("q") ?? "";
  const dateFilter = useMemo(
    () => parseDateFilter(searchParams),
    [searchParams],
  );

  const updateUrl = useCallback(
    (newParams: URLSearchParams) => {
      const newSearch = newParams.toString();
      const currentSearch = searchParams.toString();

      // Only move if the URL is actually different
      if (newSearch !== currentSearch) {
        navigate(
          {
            pathname: location.pathname,
            search: `?${newSearch}`,
          },
          {
            replace: true,
            state: { scroll: false }, // Prevents scroll jumps
          },
        );
      }
    },
    [location.pathname, navigate, searchParams],
  );

  const setQuery = useCallback(
    (newQuery: string) => {
      const currentDates = parseDateFilter(searchParams);
      updateUrl(buildSearchParams(newQuery, currentDates));
    },
    [searchParams, updateUrl],
  );

  const setDateFilter = useCallback(
    (newDate: DateState) => {
      const currentQuery = searchParams.get("q") ?? "";
      updateUrl(buildSearchParams(currentQuery, newDate));
    },
    [searchParams, updateUrl],
  );

  console.log(
    `useAlbumParams ${query} ${dateFilter?.y} ${dateFilter.m} ${dateFilter.d}`,
  );

  return { query, setQuery, dateFilter, setDateFilter };
}
