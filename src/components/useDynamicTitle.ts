import { useEffect } from "react";
import type { DateState } from "./DateState";

export function useDynamicTitle(query: string, dateFilter: DateState) {
  useEffect(() => {
    const { y, m, d } = dateFilter;

    let dateString = "";
    if (m !== "*" && d !== "*" && y !== "*") {
      dateString = `${m} ${d}, ${y}`;
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
