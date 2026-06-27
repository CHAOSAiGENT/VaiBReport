import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  normalizeSnapshot,
  rankBySource,
  topItems,
  SOURCES,
  type NormalizedItem,
} from "./normalize";
import { itemSlug } from "./slug";

/**
 * Path to the Jekyll content root (_posts, _repos, data).
 * Defaults to the repo root (parent of next/) so builds work on any machine
 * and in CI; override with CONTENT_ROOT when content lives elsewhere.
 */
const CONTENT_ROOT =
  process.env.CONTENT_ROOT ?? path.resolve(process.cwd(), "..");

// ─── Digest Posts ──────────────────────────────────

export interface DigestPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export function getDigestPosts(limit?: number): DigestPost[] {
  const postsDir = path.join(CONTENT_ROOT, "_posts");
  if (!fs.existsSync(postsDir)) return [];

  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  const sliced = limit ? files.slice(0, limit) : files;

  return sliced.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ? String(data.date).slice(0, 10) : slug.slice(0, 10),
      tags: data.tags ?? [],
      content,
    };
  });
}

export function getDigestBySlug(slug: string): DigestPost | null {
  const postsDir = path.join(CONTENT_ROOT, "_posts");
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? String(data.date).slice(0, 10) : slug.slice(0, 10),
    tags: data.tags ?? [],
    content,
  };
}

// ─── Repo Catalog ──────────────────────────────────

export interface RepoEntry {
  slug: string;
  name: string;
  source: string;
  itemUrl: string;
  description: string;
  category: string;
  language: string;
  stars: number;
  downloads: number;
  likes: number;
  firstFeatured: string;
  lastFeatured: string;
  timesFeatured: number;
  tags: string[];
  icpTags: string[];
  content: string;
  replaces?: { name: string; url: string; note?: string }[];
  similarTo?: string[];
}

export function getRepos(limit?: number): RepoEntry[] {
  const reposDir = path.join(CONTENT_ROOT, "_repos");
  if (!fs.existsSync(reposDir)) return [];

  const files = fs
    .readdirSync(reposDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const sliced = limit ? files.slice(0, limit) : files;

  return sliced.map((file) => parseRepo(file));
}

export function getRepoBySlug(slug: string): RepoEntry | null {
  const reposDir = path.join(CONTENT_ROOT, "_repos");
  const filePath = path.join(reposDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseRepo(`${slug}.md`);
}

function parseRepo(filename: string): RepoEntry {
  const reposDir = path.join(CONTENT_ROOT, "_repos");
  const raw = fs.readFileSync(path.join(reposDir, filename), "utf-8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.md$/, "");
  return {
    slug,
    name: data.name ?? slug,
    source: data.source ?? "github",
    itemUrl: data.item_url ?? "",
    description: data.description ?? "",
    category: data.category ?? "",
    language: data.language ?? "",
    stars: data.stars ?? 0,
    downloads: data.downloads ?? 0,
    likes: data.likes ?? 0,
    firstFeatured: data.first_featured ?? "",
    lastFeatured: data.last_featured ?? "",
    timesFeatured: data.times_featured ?? 0,
    tags: data.tags ?? [],
    icpTags: data.icp_tags ?? [],
    content,
    replaces: data.replaces,
    similarTo: data.similar_to,
  };
}

// ─── Data Snapshots ────────────────────────────────

export function getLatestDataSnapshot(
  source: string,
): Record<string, unknown> | null {
  const dataDir = path.join(CONTENT_ROOT, "data");
  if (!fs.existsSync(dataDir)) return null;

  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.startsWith(source) && f.endsWith(".json"))
    .sort()
    .reverse();

  if (files.length === 0) return null;

  const raw = fs.readFileSync(path.join(dataDir, files[0]), "utf-8");
  return JSON.parse(raw);
}

// ─── Repo Stats ────────────────────────────────────

export function getRepoCount(): number {
  const reposDir = path.join(CONTENT_ROOT, "_repos");
  if (!fs.existsSync(reposDir)) return 0;
  return fs.readdirSync(reposDir).filter((f) => f.endsWith(".md")).length;
}

export function getDigestCount(): number {
  const postsDir = path.join(CONTENT_ROOT, "_posts");
  if (!fs.existsSync(postsDir)) return 0;
  return fs.readdirSync(postsDir).filter((f) => f.endsWith(".md")).length;
}

// ─── Articles (Plan 2 enrichment output; optional/graceful) ───

export interface Article {
  slug: string;
  title: string;
  source: string;
  itemId: string;
  imageUrls: string[];
  newsletterCut: string;
  content: string;
}

// Read one enrichment article if it exists; null otherwise. _articles/<source>/<slug>.md
export function getArticleBySlug(slug: string): Article | null {
  const sep = slug.indexOf("__");
  if (sep < 0) return null;
  const source = slug.slice(0, sep);
  const filePath = path.join(CONTENT_ROOT, "_articles", source, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    source: data.source ?? source,
    itemId: data.item_id ?? "",
    imageUrls: data.image_urls ?? [],
    newsletterCut: data.newsletter_cut ?? "",
    content,
  };
}

export function getAllArticleSlugs(): string[] {
  const dir = path.join(CONTENT_ROOT, "_articles");
  if (!fs.existsSync(dir)) return [];
  const slugs: string[] = [];
  for (const source of fs.readdirSync(dir)) {
    const sub = path.join(dir, source);
    if (!fs.statSync(sub).isDirectory()) continue;
    for (const f of fs.readdirSync(sub)) {
      if (f.endsWith(".md")) slugs.push(f.replace(/\.md$/, ""));
    }
  }
  return slugs;
}

// ─── Items (live snapshots) joined to slug + article presence ───

export interface DisplayItem extends NormalizedItem {
  slug: string;
  hasArticle: boolean;
}

function toDisplay(items: NormalizedItem[]): DisplayItem[] {
  return items.map((it) => {
    const slug = itemSlug(it.source, it.id);
    return { ...it, slug, hasArticle: getArticleBySlug(slug) !== null };
  });
}

export function getItemsBySource(source: string): DisplayItem[] {
  const snap = getLatestDataSnapshot(source);
  return snap ? toDisplay(rankBySource(normalizeSnapshot(source, snap))) : [];
}

export function getAllItems(): DisplayItem[] {
  const all = SOURCES.flatMap((s) => {
    const snap = getLatestDataSnapshot(s);
    return snap ? normalizeSnapshot(s, snap) : [];
  });
  return toDisplay(rankBySource(all));
}

export function getTopItems(limit = 12): DisplayItem[] {
  return topItems(getAllItems(), limit) as DisplayItem[];
}
