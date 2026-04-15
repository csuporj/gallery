import type { FilterFormProps } from "./types";

import { Col, Form } from "react-bootstrap";

type FilterDateSelectsProps = Pick<
  FilterFormProps,
  "dateOptions" | "dateFilter" | "setDateFilter"
>;

export function FilterDateSelects({
  dateOptions,
  dateFilter,
  setDateFilter,
}: FilterDateSelectsProps) {
  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter({ ...dateFilter, y: e.target.value });
  };

  const onMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter({ ...dateFilter, m: e.target.value });
  };

  const onDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter({ ...dateFilter, d: e.target.value });
  };

  const yearOptions = dateOptions.years.map((y) => (
    <option key={y} value={y}>
      {y}
    </option>
  ));

  const monthOptions = dateOptions.months.map((m) => (
    <option key={m} value={m}>
      {m}
    </option>
  ));

  const dayOptions = dateOptions.days.map((d) => (
    <option key={d} value={d}>
      {d}
    </option>
  ));

  return (
    <>
      <Col md={2} xs={4}>
        <Form.Select name="y" value={dateFilter.y} onChange={onYearChange}>
          <option value="*">Year</option>
          {yearOptions}
        </Form.Select>
      </Col>

      <Col md={2} xs={4}>
        <Form.Select name="m" value={dateFilter.m} onChange={onMonthChange}>
          <option value="*">Month</option>
          {monthOptions}
        </Form.Select>
      </Col>

      <Col md={2} xs={4}>
        <Form.Select name="d" value={dateFilter.d} onChange={onDayChange}>
          <option value="*">Day</option>
          {dayOptions}
        </Form.Select>
      </Col>
    </>
  );
}
