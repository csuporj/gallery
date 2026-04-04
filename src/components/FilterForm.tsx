import { Row, Col, Form } from "react-bootstrap";
import type { FilterFormProps } from "./FilterFormProps";

export default function FilterForm({
  query,
  setQuery,
  dateFilter,
  setDateFilter,
  dateOptions,
}: FilterFormProps) {
  return (
    <Row className="g-2 justify-content-center">
      <Col md={6} xs={12} className="mb-2 mb-md-0">
        <Form.Control
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-1 rounded-0"
          style={{ height: "calc(2.25rem + 2px)" }}
        />
      </Col>
      <Col md={2} xs={4}>
        <Form.Select
          className="rounded-0"
          value={dateFilter.y}
          onChange={(e) => setDateFilter({ ...dateFilter, y: e.target.value })}
        >
          <option value="*">Year</option>
          {dateOptions.years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col md={2} xs={4}>
        <Form.Select
          className="rounded-0"
          value={dateFilter.m}
          onChange={(e) => setDateFilter({ ...dateFilter, m: e.target.value })}
        >
          <option value="*">Month</option>
          {dateOptions.months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col md={2} xs={4}>
        <Form.Select
          className="rounded-0"
          value={dateFilter.d}
          onChange={(e) => setDateFilter({ ...dateFilter, d: e.target.value })}
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
  );
}
