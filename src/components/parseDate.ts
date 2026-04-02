const parseDate = (dateStr: string) => {
  const match = dateStr.match(/([a-zA-Z]+)\s+(\d+),\s+(\d+)/);
  return match
    ? { m: match[1], d: match[2], y: match[3] }
    : { m: "", d: "", y: "" };
};

export default parseDate;
