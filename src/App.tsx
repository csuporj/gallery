import { useState, useEffect, useDeferredValue, useMemo, memo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Form,
  InputGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { thumbnailPlaceholderUrl } from "./Constants";

interface Album {
  LinkText: string;
  AlbumUrl: string;
  AlbumDate: string;
  ThumbnailFileName: string;
}

interface DateState {
  y: string;
  m: string;
  d: string;
}

interface DateOptions {
  years: string[];
  months: string[];
  days: string[];
}

const monthOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const parseDate = (dateStr: string) => {
  const match = dateStr.match(/([a-zA-Z]+)\s+(\d+),\s+(\d+)/);
  return match
    ? { m: match[1], d: match[2], y: match[3] }
    : { m: "", d: "", y: "" };
};

const DateSelectors = ({
  state,
  setState,
  options,
}: {
  state: DateState;
  setState: React.Dispatch<React.SetStateAction<DateState>>;
  options: DateOptions;
}) => (
  <Row className="g-2 mb-2">
    <Col md={4}>
      <Form.Select
        value={state.y}
        onChange={(e) => setState({ ...state, y: e.target.value })}
      >
        <option value="*">Year: *</option>
        {options.years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Form.Select>
    </Col>
    <Col md={4}>
      <Form.Select
        value={state.m}
        onChange={(e) => setState({ ...state, m: e.target.value })}
      >
        <option value="*">Month: *</option>
        {options.months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Form.Select>
    </Col>
    <Col md={4}>
      <Form.Select
        value={state.d}
        onChange={(e) => setState({ ...state, d: e.target.value })}
      >
        <option value="*">Day: *</option>
        {options.days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </Form.Select>
    </Col>
  </Row>
);

const AlbumCard = memo(({ album }: { album: Album }) => {
  const base = import.meta.env.BASE_URL;
  const hasNoImage =
    !album.ThumbnailFileName || album.ThumbnailFileName.trim() === "";

  return (
    <Col xs="auto" className="p-0 mb-4 me-4">
      <a
        href={album.AlbumUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
      >
        <Card
          className="border-0 overflow-hidden shadow-lg"
          style={{ width: "600px", borderRadius: "12px" }}
        >
          <Card.Img
            variant="top"
            src={
              hasNoImage
                ? thumbnailPlaceholderUrl
                : `${base}thumbnails/${album.ThumbnailFileName}`
            }
            style={{ width: "600px", height: "315px", objectFit: "cover" }}
          />
          <Card.Body className="p-4 bg-white">
            <Card.Title className="d-flex justify-content-between align-items-baseline mb-0">
              <span className="text-dark fw-bold fs-4 text-truncate me-2">
                {album.LinkText}
              </span>
              <small className="text-secondary fs-6 flex-shrink-0">
                {album.AlbumDate}
              </small>
            </Card.Title>
          </Card.Body>
        </Card>
      </a>
    </Col>
  );
});

function App() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateState>({
    y: "*",
    m: "*",
    d: "*",
  });

  const deferredQuery = useDeferredValue(query);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    fetch(`${base}albums.json`)
      .then((res) => res.json())
      .then((data: Album[]) => {
        const sortedData = [...data].sort((a, b) => {
          if (!a.AlbumDate || !b.AlbumDate) return 0;
          const dateA = new Date(a.AlbumDate).getTime();
          const dateB = new Date(b.AlbumDate).getTime();
          if (isNaN(dateA) || isNaN(dateB)) return 0;
          return dateB - dateA;
        });
        setAlbums(sortedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [base]);

  const dateOptions = useMemo(() => {
    const years = new Set<string>(),
      months = new Set<string>(),
      days = new Set<string>();
    albums.forEach((album) => {
      const { m, d, y } = parseDate(album.AlbumDate);
      if (y) years.add(y);
      if (m) months.add(m);
      if (d) days.add(d);
    });
    return {
      years: Array.from(years).sort((a, b) => b.localeCompare(a)),
      months: Array.from(months).sort(
        (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b),
      ),
      days: Array.from(days).sort((a, b) => parseInt(a) - parseInt(b)),
    };
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const matchesText = album.LinkText.toLowerCase().includes(
        deferredQuery.toLowerCase(),
      );
      if (!matchesText) return false;

      const { m: albM, d: albD, y: albY } = parseDate(album.AlbumDate);

      // Hide albums without valid dates
      if (!albM || !albD || !albY) return false;

      return (
        (dateFilter.y === "*" || albY === dateFilter.y) &&
        (dateFilter.m === "*" || albM === dateFilter.m) &&
        (dateFilter.d === "*" || albD === dateFilter.d)
      );
    });
  }, [albums, deferredQuery, dateFilter]);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container fluid className="px-4 py-4 bg-light min-vh-100">
      <div className="mb-5 mx-auto" style={{ maxWidth: "800px" }}>
        <InputGroup className="shadow-sm mb-3">
          <Form.Control
            placeholder="Search albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="py-2 px-3 border-0"
          />
        </InputGroup>

        <DateSelectors
          state={dateFilter}
          setState={setDateFilter}
          options={dateOptions}
        />
      </div>

      <Row className="g-5 justify-content-start w-100 m-0">
        {filteredAlbums.map((album, index) => (
          <AlbumCard key={index} album={album} />
        ))}
      </Row>
    </Container>
  );
}

export default App;
