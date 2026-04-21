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
  const urlParams = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(urlParams.get("q") ?? "");
  const [dateFilter, setDateFilter] = useState(parseDateFilter(urlParams));

  const searchParams = buildSearchParams(query, dateFilter);
  window.history.replaceState(null, "", "?" + searchParams.toString());
  return { query, setQuery, dateFilter, setDateFilter };
}
