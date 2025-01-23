export function generateSku(fromStr: string, ...others: string[]) {
  return fromStr
    .replaceAll('-', ' ')
    .split(' ')
    .filter(Boolean)
    .map((s) => s.slice(0, 3).toUpperCase())
    .concat(...others.map((o) => o.substring(0, 3).toUpperCase()))
    .join('-');
}
