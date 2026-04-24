export interface Album {
  LinkText: string;
  AlbumUrl: string;
  AlbumDate: string;
  ThumbnailFileName: string;
}

export interface Filter {
  s: string;
  y: string;
  m: string;
  d: string;
}

export interface FilterFormProps {
  filter: Filter;
  setS: (s: string) => void;
  setY: (y: string) => void;
  setM: (m: string) => void;
  setD: (d: string) => void;
}
