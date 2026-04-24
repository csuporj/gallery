import type { FilterFormProps } from "./types";

import { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";

import { FilterDateSelects } from "./FilterDateSelects";

export function FilterForm({
  query,
  setQuery,
  dateFilter,
  setDateFilter,
}: FilterFormProps) {
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(
    function debounceQuery() {
      const queryTimeout = setTimeout(() => setQuery(localQuery), 500);
      return () => clearTimeout(queryTimeout);
    },
    [localQuery, setQuery],
  );

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
            value={localQuery}
            accessKey="s"
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </Col>

        <FilterDateSelects
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      </Row>
    </div>
  );
}
