import type { FilterFormProps } from "./types";

import { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";

import { FilterDateSelects } from "./FilterDateSelects";

window.onkeydown = (e) => {
  if (e.altKey && ["KeyS", "KeyY", "KeyM"].includes(e.code)) {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
};

export function FilterForm({
  filter,
  setS,
  setY,
  setM,
  setD,
}: FilterFormProps) {
  const [localS, setLocalS] = useState(filter.s);

  useEffect(() => {
    const typingTimeout = setTimeout(() => setS(localS), 500);
    return () => clearTimeout(typingTimeout);
  }, [localS, setS]);

  return (
    <div className="mx-auto px-0 pt-2 pb-1 pt-md-1 pb-md-0 filter-form-width">
      <Row className="gx-1 gy-2 gy-md-1 justify-content-center">
        <Col md={6} xs={12}>
          <Form.Control
            id="search"
            type="search"
            name="s"
            placeholder="Search..."
            spellCheck="false"
            value={localS}
            accessKey="s"
            onChange={(e) => setLocalS(e.target.value)}
          />
        </Col>

        <FilterDateSelects
          filter={filter}
          setY={setY}
          setM={setM}
          setD={setD}
        />
      </Row>
    </div>
  );
}
