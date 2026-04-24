import { IS_DEBUG, getTimestamp } from "./debug";
import type { Filter } from "./types";
import { useState } from "react";

function urlToFilter(params: URLSearchParams): Filter {
  return {
    s: params.get("q") ?? "",
    y: params.get("y") ?? "*",
    m: params.get("m") ?? "*",
    d: params.get("d") ?? "*",
  };
}

function filterToUrl(filter: Filter): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.s) params.set("q", filter.s);
  if (filter.y !== "*") params.set("y", filter.y);
  if (filter.m !== "*") params.set("m", filter.m);
  if (filter.d !== "*") params.set("d", filter.d);

  return params;
}

function replaceUrl(filter: Filter) {
  const params = filterToUrl(filter).toString();
  const url = params ? `?${params}` : window.location.pathname;
  window.history.replaceState(null, "", url);
}

export function useFilter() {
  const initialFilter = urlToFilter(
    new URLSearchParams(window.location.search),
  );
  const [filter, setFilter] = useState(initialFilter);

  function setS(s: string) {
    setFilter((oldFilter) => {
      if (oldFilter.s === s) {
        return oldFilter;
      }

      if (IS_DEBUG) {
        console.log(getTimestamp(), `setS ${oldFilter.s} ${s}`);
      }

      const newFilter = { ...oldFilter, s };
      replaceUrl(newFilter);

      return newFilter;
    });
  }

  function setY(y: string) {
    setFilter((oldFilter) => {
      if (oldFilter.y === y) {
        return oldFilter;
      }

      const newFilter = { ...oldFilter, y };
      replaceUrl(newFilter);
      if (IS_DEBUG) {
        console.log(getTimestamp(), `setY ${oldFilter.y} ${y}`);
      }

      return newFilter;
    });
  }

  function setM(m: string) {
    setFilter((oldFilter) => {
      if (oldFilter.m === m) {
        return oldFilter;
      }
      const newFilter = { ...oldFilter, m };
      replaceUrl(newFilter);
      if (IS_DEBUG) {
        console.log(getTimestamp(), `setM ${oldFilter.m} ${m}`);
      }

      return newFilter;
    });
  }

  function setD(d: string) {
    setFilter((oldFilter) => {
      if (oldFilter.d === d) {
        return oldFilter;
      }

      const newFilter = { ...oldFilter, d };
      replaceUrl(newFilter);
      if (IS_DEBUG) {
        console.log(getTimestamp(), `setD ${oldFilter.d} ${d}`);
      }

      return newFilter;
    });
  }

  return {
    filter,
    setS,
    setY,
    setM,
    setD,
  };
}
