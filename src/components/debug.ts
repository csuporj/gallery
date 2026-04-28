export const IS_DEBUG = true;

export function getTimestamp(): string {
  const now = new Date();
  return `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}]`;
}
