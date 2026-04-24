import type { Filter } from "./types";

import { useEffect } from "react";

import { getTimestamp, IS_DEBUG } from "./debug";

function formatTitle(filter: Filter): string {
  const { s, y, m, d } = filter;

  const hasS = s !== "";
  const hasY = y !== "*";
  const hasM = m !== "*";
  const hasD = d !== "*";

  let date = "";
  if (hasY && hasM && hasD) date = `${m} ${d}, ${y}`;
  else if (hasY && !hasM && hasD) date = `MMM ${d}, ${y}`;
  else if (hasY && hasM && !hasD) date = `${m} ${y}`;
  else if (!hasY && hasM && hasD) date = `${m} ${d}`;
  else if (!hasY && !hasM && hasD) date = `MMM ${d}`;
  else if (hasY && !hasM && !hasD) date = `${y}`;
  else if (!hasY && hasM && !hasD) date = `${m}`;

  const hasDate = date !== "";

  if (hasS && hasDate) return `${s} | ${date}`;
  if (hasS && !hasDate) return s;
  if (!hasS && hasDate) return `${date} | Gallery`;
  return "Gallery";
}

export function useTitle(filter: Filter) {
  useEffect(() => {
    document.title = formatTitle(filter);
    if (IS_DEBUG) {
      console.log(getTimestamp(), `useTitle ${document.title}`);
    }
  }, [filter]);
}
