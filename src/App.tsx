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

interface Album {
  LinkText: string;
  AlbumUrl: string;
  AlbumDate: string;
  ThumbnailFileName: string;
}

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
                ? "https://placehold.co"
                : `${base}thumbnails/${album.ThumbnailFileName}`
            }
            style={{ width: "600px", height: "375px", objectFit: "cover" }}
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
  const [year, setYear] = useState("*");
  const [month, setMonth] = useState("*");
  const [day, setDay] = useState("*");

  const deferredQuery = useDeferredValue(query);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    fetch(`${base}albums.json`)
      .then((res) => res.json())
      .then((data: Album[]) => {
        setAlbums(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [base]);

  const parseDate = (dateStr: string) => {
    const match = dateStr.match(/([a-zA-Z]+)\s+(\d+),\s+(\d+)/);
    return match
      ? { m: match[1], d: match[2], y: match[3] }
      : { m: "", d: "", y: "" };
  };

  const dateOptions = useMemo(() => {
    const years = new Set<string>();
    const months = new Set<string>();
    const days = new Set<string>();
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
      const { m, d, y } = parseDate(album.AlbumDate);
      return (
        album.LinkText.toLowerCase().includes(deferredQuery.toLowerCase()) &&
        (year === "*" || y === year) &&
        (month === "*" || m === month) &&
        (day === "*" || d === day)
      );
    });
  }, [albums, deferredQuery, year, month, day]);

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
        <Row className="g-2">
          <Col md={4}>
            <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="*">Year: *</option>
              {dateOptions.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="*">Month: *</option>
              {dateOptions.months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Select value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="*">Day: *</option>
              {dateOptions.days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
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
