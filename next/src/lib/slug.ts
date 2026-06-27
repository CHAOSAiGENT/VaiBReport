// Stable, date-independent slug for an item. Keyed on (source, id) so links
// never break as daily snapshots roll. Format: "<source>__<sanitized-id>".
export function itemSlug(source: string, id: string): string {
  const clean = id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${source}__${clean}`;
}
