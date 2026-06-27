import { test } from "node:test";
import assert from "node:assert/strict";
import { itemSlug } from "../../src/lib/slug.ts";

test("itemSlug is stable, lowercased, and source-prefixed", () => {
  assert.equal(itemSlug("hf", "Qwen/Qwen3-0.6B"), "hf__qwen-qwen3-0-6b");
  assert.equal(
    itemSlug("github", "kriasoft/react-starter-kit"),
    "github__kriasoft-react-starter-kit",
  );
  assert.equal(
    itemSlug("launches", "showhn-48688700"),
    "launches__showhn-48688700",
  );
});

test("itemSlug collapses runs and trims separators (date-independent)", () => {
  assert.equal(itemSlug("npm", "@scope/pkg.name"), "npm__scope-pkg-name");
});
