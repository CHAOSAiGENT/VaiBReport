import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeSnapshot, toNumber } from "../../src/lib/normalize.ts";

test("toNumber parses plain, formatted, and bad values", () => {
  assert.equal(toNumber(1234), 1234);
  assert.equal(toNumber("116.2K"), 116200);
  assert.equal(toNumber("1.5M"), 1500000);
  assert.equal(toNumber("nope"), 0);
  assert.equal(toNumber(undefined), 0);
});

test("repos adapter maps github keys (full_name/html_url/stargazers_count)", () => {
  const snap = {
    repos: [
      {
        full_name: "a/b",
        html_url: "https://github.com/a/b",
        description: "d",
        stargazers_count: 1200,
        topics: ["x"],
        pushed_at: "2026-01-01",
      },
    ],
  };
  const [it] = normalizeSnapshot("repos", snap);
  assert.equal(it.id, "a/b");
  assert.equal(it.url, "https://github.com/a/b");
  assert.equal(it.source, "github");
  assert.equal(it.metricLabel, "stars");
  assert.equal(it.metricValue, 1200);
  assert.deepEqual(it.tags, ["x"]);
});

test("hf adapter flattens models+spaces+datasets", () => {
  const snap = {
    models: [{ id: "m1", url: "u1", description: "", downloads: 10, tags: [] }],
    spaces: [{ id: "s1", url: "u2", description: "", likes: 5, tags: [] }],
    datasets: [
      { id: "d1", url: "u3", description: "", downloads: 7, tags: [] },
    ],
  };
  const items = normalizeSnapshot("hf", snap);
  assert.equal(items.length, 3);
  assert.equal(items.find((i) => i.id === "s1").metricLabel, "likes");
});

test("ollama adapter parses string pull_count", () => {
  const [it] = normalizeSnapshot("ollama", {
    models: [
      {
        id: "llama",
        url: "u",
        description: "",
        pull_count: "116.2K",
        tags: [],
      },
    ],
  });
  assert.equal(it.metricValue, 116200);
});

test("unknown source and empty/missing arrays return []", () => {
  assert.deepEqual(normalizeSnapshot("nope", { x: 1 }), []);
  assert.deepEqual(normalizeSnapshot("paperswithcode", { papers: [] }), []);
  assert.deepEqual(normalizeSnapshot("gitlab", {}), []);
});
