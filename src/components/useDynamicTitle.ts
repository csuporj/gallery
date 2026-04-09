import { useEffect } from "react";
import type { DateState } from "./DateState";

export function useDynamicTitle(query: string, dateFilter: DateState) {
  useEffect(() => {
    const { y, m, d } = dateFilter;

    let dateString = "";
    if (d !== "*" && y !== "*") {
      const monthPart = m !== "*" ? `${m} ` : "MMM ";
      dateString = `${monthPart}${d}, ${y}`;
    } else if (d !== "*" && m === "*") {
      dateString = `MMM ${d}`;
    } else {
      dateString = [m, d, y].filter((v) => v !== "*").join(" ");
    }

    const titleParts = [];
    if (query) titleParts.push(query);
    if (dateString) titleParts.push(dateString);

    if (titleParts.length === 0) {
      document.title = "Gallery";
    } else if (query) {
      document.title = titleParts.join(" | ");
    } else {
      document.title = `${dateString} | Gallery`;
    }
  }, [query, dateFilter]);
}
