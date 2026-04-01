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

  // Most robust check: if it's null, undefined, "", or just whitespace
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
                ? "https://placehold.co/600x400?text=Image+Unavailable"
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

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) =>
      album.LinkText.toLowerCase().includes(deferredQuery.toLowerCase()),
    );
  }, [albums, deferredQuery]);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container fluid className="px-4 py-4 bg-light min-vh-100">
      <div className="mb-5 d-flex justify-content-center">
        <InputGroup style={{ maxWidth: "600px" }} className="shadow-sm">
          <Form.Control
            placeholder="Search albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="py-2 px-3 border-0"
          />
        </InputGroup>
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
