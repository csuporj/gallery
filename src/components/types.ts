export interface Album {
  LinkText: string;
  AlbumUrl: string;
  AlbumDate: string;
  ThumbnailFileName: string;
}

export interface DateState {
  y: string;
  m: string;
  d: string;
}

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
