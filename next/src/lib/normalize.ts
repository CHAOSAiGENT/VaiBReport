export interface NormalizedItem {
  id: string;
  name: string;
  url: string;
  description: string;
  source: string; // canonical: github | hf | replicate | paperswithcode | npm | pypi | ollama | gitlab | launches
  platform: string; // display label
  metricLabel: string;
  metricValue: number;
  date: string; // best-available ISO date string
  tags: string[];
  signal: number; // 0..100 percentile within source; filled by rankBySource
}

const MULT: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9 };

export function toNumber(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const m = v
      .trim()
      .replace(/,/g, "")
      .match(/^([\d.]+)\s*([KMB])?/i);
    if (!m) return 0;
    return Math.round(
      parseFloat(m[1]) * (MULT[(m[2] || "").toUpperCase()] ?? 1),
    );
  }
  return 0;
}

type RawItem = Record<string, unknown>;
type Adapter = (snap: Record<string, unknown>) => NormalizedItem[];

function base(o: Partial<NormalizedItem>): NormalizedItem {
  return {
    id: "",
    name: "",
    url: "",
    description: "",
    source: "",
    platform: "",
    metricLabel: "",
    metricValue: 0,
    date: "",
    tags: [],
    signal: 0,
    ...o,
  };
}
const arr = (v: unknown): RawItem[] =>
  Array.isArray(v) ? (v as RawItem[]) : [];
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const tags = (v: unknown): string[] =>
  Array.isArray(v) ? (v as string[]) : [];

const adapters: Record<string, Adapter> = {
  repos: (s) =>
    arr(s.repos).map((r) =>
      base({
        id: str(r.full_name),
        name: str(r.full_name),
        url: str(r.html_url),
        description: str(r.description),
        source: "github",
        platform: "GitHub",
        metricLabel: "stars",
        metricValue: toNumber(r.stargazers_count),
        date: str(r.pushed_at) || str(r.created_at),
        tags: tags(r.topics),
      }),
    ),
  hf: (s) => [
    ...arr(s.models).map((m) =>
      base({
        id: str(m.id),
        name: str(m.id),
        url: str(m.url),
        description: str(m.description),
        source: "hf",
        platform: "HuggingFace",
        metricLabel: "downloads",
        metricValue: toNumber(m.downloads),
        date: str(m.created_at),
        tags: tags(m.tags),
      }),
    ),
    ...arr(s.spaces).map((m) =>
      base({
        id: str(m.id),
        name: str(m.id),
        url: str(m.url),
        description: str(m.description),
        source: "hf",
        platform: "HuggingFace",
        metricLabel: "likes",
        metricValue: toNumber(m.likes),
        date: str(m.created_at),
        tags: tags(m.tags),
      }),
    ),
    ...arr(s.datasets).map((m) =>
      base({
        id: str(m.id),
        name: str(m.id),
        url: str(m.url),
        description: str(m.description),
        source: "hf",
        platform: "HuggingFace",
        metricLabel: "downloads",
        metricValue: toNumber(m.downloads),
        date: str(m.created_at),
        tags: tags(m.tags),
      }),
    ),
  ],
  replicate: (s) =>
    arr(s.models).map((m) =>
      base({
        id: str(m.id),
        name: str(m.id),
        url: str(m.url),
        description: str(m.description),
        source: "replicate",
        platform: "Replicate",
        metricLabel: "runs",
        metricValue: toNumber(m.run_count),
        date: str(m.last_modified) || str(m.created_at),
        tags: tags(m.tags),
      }),
    ),
  paperswithcode: (s) =>
    arr(s.papers).map((p) =>
      base({
        id: str(p.id) || str(p.url),
        name: str(p.title) || str(p.id),
        url: str(p.url),
        description: str(p.description) || str(p.abstract),
        source: "paperswithcode",
        platform: "Papers with Code",
        metricLabel: "stars",
        metricValue: toNumber((p.stars ?? p.repo_stars) as unknown),
        date: str(p.published),
        tags: tags(p.tags),
      }),
    ),
  "npm-pypi": (s) => [
    ...arr(s.npm).map((p) =>
      base({
        id: str(p.id),
        name: str(p.id),
        url: str(p.url),
        description: str(p.description),
        source: "npm",
        platform: "npm",
        metricLabel: "weekly downloads",
        metricValue: toNumber(p.weekly_downloads),
        date: str(p.published),
        tags: tags(p.keywords),
      }),
    ),
    ...arr(s.pypi).map((p) =>
      base({
        id: str(p.id),
        name: str(p.id),
        url: str(p.url),
        description: str(p.description),
        source: "pypi",
        platform: "PyPI",
        metricLabel: "recent downloads",
        metricValue: toNumber(p.recent_downloads),
        date: str(p.published),
        tags: tags(p.keywords),
      }),
    ),
  ],
  ollama: (s) =>
    arr(s.models).map((m) =>
      base({
        id: str(m.id),
        name: str(m.id),
        url: str(m.url),
        description: str(m.description),
        source: "ollama",
        platform: "Ollama",
        metricLabel: "pulls",
        metricValue: toNumber(m.pull_count),
        date: str(m.updated),
        tags: tags(m.tags),
      }),
    ),
  gitlab: (s) =>
    arr(s.repos).map((r) =>
      base({
        id: str(r.id) || str(r.path_with_namespace) || str(r.name),
        name: str(r.name) || str(r.path_with_namespace),
        url: str(r.url) || str(r.web_url),
        description: str(r.description),
        source: "gitlab",
        platform: "GitLab",
        metricLabel: "stars",
        metricValue: toNumber((r.stars ?? r.star_count) as unknown),
        date: str(r.last_activity_at) || str(r.created_at),
        tags: tags(r.tags),
      }),
    ),
  launches: (s) =>
    arr(s.launches).map((l) =>
      base({
        id: str(l.id),
        name: str(l.name) || str(l.id),
        url: str(l.url),
        description: str(l.description),
        source: "launches",
        platform: str(l._platform) || "launches",
        metricLabel: "upvotes",
        metricValue: toNumber(l.upvotes),
        date: str(l.launch_date),
        tags: tags(l.tags),
      }),
    ),
};

export const SOURCES = [
  "repos",
  "hf",
  "replicate",
  "paperswithcode",
  "npm-pypi",
  "ollama",
  "gitlab",
  "launches",
];

export function normalizeSnapshot(
  source: string,
  snap: unknown,
): NormalizedItem[] {
  if (!snap || typeof snap !== "object") return [];
  const adapter = adapters[source];
  if (!adapter) return [];
  return adapter(snap as Record<string, unknown>).filter(
    (it) => it.id && it.url,
  );
}

// Percentile rank (0..100) of each item within its own source, by metricValue.
// "Signal" is cross-source comparable: 100 = the top item in its category.
export function rankBySource(items: NormalizedItem[]): NormalizedItem[] {
  const groups = new Map<string, NormalizedItem[]>();
  for (const it of items) {
    const g = groups.get(it.source);
    if (g) g.push(it);
    else groups.set(it.source, [it]);
  }
  for (const group of groups.values()) {
    const sorted = [...group].sort((a, b) => a.metricValue - b.metricValue);
    const n = sorted.length;
    sorted.forEach((it, i) => {
      it.signal = n <= 1 ? 100 : Math.round((i / (n - 1)) * 100);
    });
  }
  return items;
}

export function topItems(
  items: NormalizedItem[],
  limit: number,
): NormalizedItem[] {
  return [...items]
    .sort((a, b) => b.signal - a.signal || b.metricValue - a.metricValue)
    .slice(0, limit);
}
