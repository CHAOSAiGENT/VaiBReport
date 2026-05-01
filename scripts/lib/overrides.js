// scripts/lib/overrides.js
// Pure functions for validating slug references and merging overrides
// into LLM-generated compare-to data. No I/O, no logging.

export function validateSlugs(generated, knownSlugs) {
  const out = {};
  for (const [key, entry] of Object.entries(generated)) {
    const similar = Array.isArray(entry.similar_to) ? entry.similar_to : [];
    out[key] = {
      ...entry,
      similar_to: similar.filter(s => knownSlugs.has(s)),
    };
  }
  return out;
}

export function mergeOverrides(generated, overrides) {
  const out = {};
  for (const [key, entry] of Object.entries(generated)) {
    out[key] = { ...entry };
    const ov = overrides[key];
    if (ov && typeof ov === 'object') {
      for (const field of Object.keys(ov)) {
        out[key][field] = ov[field];
      }
    }
  }
  return out;
}
