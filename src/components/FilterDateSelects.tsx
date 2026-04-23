import type { FilterFormProps } from "./types";

import { Col, Form } from "react-bootstrap";

import { dateOptions } from "./albums";

export function FilterDateSelects({
  dateFilter,
  setDateFilter,
}: Pick<FilterFormProps, "dateFilter" | "setDateFilter">) {
  const yearSelect = (
    <Col md={2} xs={4}>
      <Form.Select
        name="y"
        value={dateFilter.y}
        aria-label="year"
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
  );

  const monthSelect = (
    <Col md={2} xs={4}>
      <Form.Select
        name="m"
        value={dateFilter.m}
        aria-label="month"
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
  );

  const daySelect = (
    <Col md={2} xs={4}>
      <Form.Select
        name="d"
        value={dateFilter.d}
        aria-label="day"
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
  );

  return (
    <>
      {yearSelect}
      {monthSelect}
      {daySelect}
    </>
  );
}
