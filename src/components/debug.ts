export const IS_DEBUG = import.meta.env.DEV;

export function getTimestamp(): string {
  const d = new Date();

  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  const ms = d.getMilliseconds().toString().padStart(3, "0");

  return "[" + hh + ":" + mm + ":" + ss + "." + ms + "]:";
}
