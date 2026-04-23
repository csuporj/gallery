export const IS_DEBUG = true;

export function getTimestamp(): string {
  return "[" + performance.now().toFixed(1) + "]";
}
