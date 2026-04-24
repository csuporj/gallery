import type { FilterFormProps } from "./types";

import { Col, Form } from "react-bootstrap";

import { dateOptions } from "./albums";

export function FilterDateSelects({
  filter,
  setY,
  setM,
  setD,
}: Pick<FilterFormProps, "filter" | "setY" | "setM" | "setD">) {
  const yearSelect = (
    <Col md={2} xs={4}>
      <Form.Select
        name="y"
        value={filter.y}
        aria-label="year"
        accessKey="y"
        onChange={(e) => setY(e.target.value)}
      >
        <option value="*">Year</option>
        {dateOptions.years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Form.Select>
    </Col>
  );

  const monthSelect = (
    <Col md={2} xs={4}>
      <Form.Select
        name="m"
        value={filter.m}
        aria-label="month"
        accessKey="m"
        onChange={(e) => setM(e.target.value)}
      >
        <option value="*">Month</option>
        {dateOptions.months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Form.Select>
    </Col>
  );

  const daySelect = (
    <Col md={2} xs={4}>
      <Form.Select
        name="d"
        value={filter.d}
        aria-label="day"
        onChange={(e) => setD(e.target.value)}
      >
        <option value="*">Day</option>
        {dateOptions.days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </Form.Select>
    </Col>
  );

  return (
    <>
      {yearSelect}
      {monthSelect}
      {daySelect}
    </>
  );
}
