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

const SAFE_PROTOCOLS = new Set(['http:', 'https:']);

export function sanitizeUrls(generated) {
  const out = {};
  for (const [key, entry] of Object.entries(generated)) {
    const cleanReplaces = (Array.isArray(entry.replaces) ? entry.replaces : []).map(r => {
      if (!r || typeof r !== 'object') return null;
      let safeUrl = '';
      if (typeof r.url === 'string') {
        try {
          const u = new URL(r.url);
          if (SAFE_PROTOCOLS.has(u.protocol)) safeUrl = r.url;
        } catch {
          safeUrl = '';
        }
      }
      return { ...r, url: safeUrl };
    }).filter(Boolean);
    out[key] = { ...entry, replaces: cleanReplaces };
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
