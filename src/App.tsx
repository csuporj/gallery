import { useState, useEffect, useDeferredValue, useMemo, memo } from "react";
import { Container, Row, Col, Card, Spinner, Form } from "react-bootstrap";
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
  // Correctly mapping regex groups to strings
  return match
    ? { m: match[1], d: match[2], y: match[3] }
    : { m: "", d: "", y: "" };
};

const AlbumCard = memo(({ album }: { album: Album }) => {
  const base = import.meta.env.BASE_URL;
  const hasNoImage =
    !album.ThumbnailFileName || album.ThumbnailFileName.trim() === "";

  return (
    <Col xs="auto">
      <a
        href={album.AlbumUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
      >
        <Card
          className="border-0 overflow-hidden shadow-lg mx-auto rounded-0 position-relative"
          style={{ width: "600px", maxWidth: "calc(100vw - 32px)" }}
        >
          <Card.Img
            variant="top"
            className="rounded-0"
            src={
              hasNoImage
                ? thumbnailPlaceholderUrl
                : `${base}thumbnails/${album.ThumbnailFileName}`
            }
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "600/400",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            className="position-absolute bottom-0 start-0 w-100 p-4 d-flex justify-content-between align-items-end"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
              color: "white",
              textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            <span className="fw-bold fs-4 text-truncate me-2">
              {album.LinkText}
            </span>
            <small className="fs-6 flex-shrink-0 opacity-75">
              {album.AlbumDate}
            </small>
          </div>
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
          const dateA = new Date(a.AlbumDate).getTime();
          const dateB = new Date(b.AlbumDate).getTime();
          return isNaN(dateA) || isNaN(dateB) ? 0 : dateB - dateA;
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
    <Container fluid className="px-0 bg-white min-vh-100">
      <div
        className="mx-auto px-3"
        style={{
          maxWidth: "850px",
          paddingTop: "1.5rem",
          paddingBottom: "0", // Removed bottom padding to let the card's internal g-4 padding do the work
        }}
      >
        <Row className="g-2 justify-content-center flex-lg-nowrap">
          <Col lg={6} xs={12} className="mb-2 mb-lg-0">
            <Form.Control
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-1 rounded-0"
              style={{ height: "calc(2.25rem + 2px)" }}
            />
          </Col>
          <Col lg={2} xs={4}>
            <Form.Select
              className="rounded-0"
              value={dateFilter.y}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, y: e.target.value })
              }
            >
              <option value="*">Year</option>
              {dateOptions.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={2} xs={4}>
            <Form.Select
              className="rounded-0"
              value={dateFilter.m}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, m: e.target.value })
              }
            >
              <option value="*">Month</option>
              {dateOptions.months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={2} xs={4}>
            <Form.Select
              className="rounded-0"
              value={dateFilter.d}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, d: e.target.value })
              }
            >
              <option value="*">Day</option>
              {dateOptions.days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </div>

      <Row className="justify-content-center g-4 m-0 pb-4">
        {filteredAlbums.map((album, index) => (
          <AlbumCard key={index} album={album} />
        ))}
      </Row>
    </Container>
  );
}

export default App;
