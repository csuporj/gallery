import type { DateState } from "./types";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Helper remains the same
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
  const [, setTick] = useState(0);

  // FORCE tablet to clear spinner on back/forward
  useEffect(() => {
    const handlePopState = () => {
      window.stop(); // Kills the stuck Chrome loading indicator
      setTick((t) => t + 1);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const query = searchParams.get("q") ?? "";
  const dateFilter = useMemo(
    () => parseDateFilter(searchParams),
    [searchParams],
  );

  const setQuery = useCallback(
    (newQuery: string) => {
      setSearchParams(
        (prev) => {
          if ((prev.get("q") ?? "") === newQuery) return prev;
          return buildSearchParams(newQuery, parseDateFilter(prev));
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setDateFilter = useCallback(
    (newDate: DateState) => {
      setSearchParams(
        (prev) => {
          const currentDates = parseDateFilter(prev);
          if (
            currentDates.y === newDate.y &&
            currentDates.m === newDate.m &&
            currentDates.d === newDate.d
          )
            return prev;
          return buildSearchParams(prev.get("q") ?? "", newDate);
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  console.log(
    `useAlbumParams ${query} ${dateFilter?.y} ${dateFilter.m} ${dateFilter.d}`,
  );

  return { query, setQuery, dateFilter, setDateFilter };
}
