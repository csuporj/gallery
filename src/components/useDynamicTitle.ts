import { useEffect } from "react";

import type { DateState } from "./DateState";

function formatDate(dateFilter: DateState): string {
  const { y, m, d } = dateFilter;

  const hasY = y !== "*";
  const hasM = m !== "*";
  const hasD = d !== "*";

  if (hasY && hasM && hasD) return `${m} ${d}, ${y}`;
  if (hasY && !hasM && hasD) return `MMM ${d}, ${y}`;
  if (hasY && hasM && !hasD) return `${m} ${y}`;
  if (!hasY && hasM && hasD) return `${m} ${d}`;
  if (!hasY && !hasM && hasD) return `MMM ${d}`;
  if (hasY && !hasM && !hasD) return `${y}`;
  if (!hasY && hasM && !hasD) return `${m}`;

  return "";
}

function formatTitle(query: string, dateString: string): string {
  const hasQuery = query !== "";
  const hasDate = dateString !== "";

  if (hasQuery && hasDate) return `${query} | ${dateString}`;
  if (hasQuery && !hasDate) return query;
  if (!hasQuery && hasDate) return `${dateString} | Gallery`;

  return "Gallery";
}

export function useDynamicTitle(query: string, dateFilter: DateState) {
  useEffect(() => {
    const dateString = formatDate(dateFilter);
    document.title = formatTitle(query, dateString);
  }, [query, dateFilter]);
}
