import type { FilterFormProps } from "./FilterFormProps";

import { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";

import { FilterDateSelects } from "./FilterDateSelects";

export function FilterForm({
  query,
  setQuery,
  dateFilter,
  setDateFilter,
  dateOptions,
}: FilterFormProps) {
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== query) {
        setQuery(localQuery);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [localQuery, setQuery, query]);

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  return (
    <div className="px-0 pt-2 pb-1 pt-md-1 pb-md-0">
      <Row className="gx-1 gy-2 gy-md-1 justify-content-center">
        <Col md={6} xs={12}>
          <Form.Control
            type="search"
            name="s"
            placeholder="Search..."
            spellCheck="false"
            value={localQuery}
            onChange={onQueryChange}
          />
        </Col>

        <FilterDateSelects
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          dateOptions={dateOptions}
        />
      </Row>
    </div>
  );
}
