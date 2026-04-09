import type DateState from "./DateState";

export interface FilterFormProps {
  query: string;
  setQuery: (val: string) => void;
  dateFilter: DateState;
  setDateFilter: (filter: DateState) => void;
  dateOptions: {
    years: string[];
    months: string[];
    days: string[];
  };
}
