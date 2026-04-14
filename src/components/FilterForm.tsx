import { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import type { FilterFormProps } from "./FilterFormProps";
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
    }, 100);

    return () => clearTimeout(handler);
  }, [localQuery, setQuery, query]);

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  return (
    <Row className="g-1 justify-content-center">
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
  );
}
