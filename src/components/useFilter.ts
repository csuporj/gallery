import type { DateState } from "./types";
import { useState } from "react";

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

export function useFilter() {
  const [query, setQuery] = useState(
    () => new URLSearchParams(window.location.search).get("q") ?? "",
  );

  const [dateFilter, setDateFilter] = useState(() =>
    parseDateFilter(new URLSearchParams(window.location.search)),
  );

  function replaceUrl(newQuery: string, newDate: DateState) {
    const params = buildSearchParams(newQuery, newDate).toString();
    const url = params ? `?${params}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }

  function updateQuery(newQuery: string) {
    setQuery(newQuery);
    replaceUrl(newQuery, dateFilter);
  }

  function updateDate(newDate: DateState) {
    setDateFilter(newDate);
    replaceUrl(query, newDate);
  }

  return {
    query,
    setQuery: updateQuery,
    dateFilter,
    setDateFilter: updateDate,
  };
}
