import { test } from "node:test";
import assert from "node:assert/strict";
import {
  rankBySource,
  topItems,
  type NormalizedItem,
} from "../../src/lib/normalize.ts";

const mk = (
  source: string,
  id: string,
  metricValue: number,
): NormalizedItem => ({
  id,
  name: id,
  url: "u/" + id,
  description: "",
  source,
  platform: source,
  metricLabel: "m",
  metricValue,
  date: "",
  tags: [],
  signal: 0,
});

test("rankBySource assigns 100 to the top item in each source", () => {
  const ranked = rankBySource([
    mk("github", "a", 10),
    mk("github", "b", 5),
    mk("npm", "c", 999),
  ]);
  const a = ranked.find((i) => i.id === "a");
  const b = ranked.find((i) => i.id === "b");
  const c = ranked.find((i) => i.id === "c");
  assert.equal(a.signal, 100);
  assert.equal(c.signal, 100);
  assert.ok(b.signal < a.signal);
});

test("topItems returns highest signal first", () => {
  const top = topItems(
    rankBySource([
      mk("github", "a", 10),
      mk("npm", "c", 999),
      mk("github", "b", 5),
    ]),
    2,
  );
  assert.equal(top.length, 2);
  assert.equal(top[0].signal, 100);
});
