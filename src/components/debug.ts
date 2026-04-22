export const IS_DEBUG = true;

export function getTimestamp(): string {
  return "[" + performance.now().toString() + "]";
}
