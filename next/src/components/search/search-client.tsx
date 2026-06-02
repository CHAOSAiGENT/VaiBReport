"use client";

import { useState, useMemo } from "react";
import type { RepoEntry } from "@/lib/content";
import { RepoCard } from "@/components/stream/repo-card";

interface SearchClientProps {
  repos: RepoEntry[];
}

export function SearchClient({ repos }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);

  const sources = useMemo(() => {
    const set = new Set<string>();
    for (const repo of repos) {
      if (repo.source) set.add(repo.source);
    }
    return Array.from(set).sort();
  }, [repos]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return repos.filter((repo) => {
      if (sourceFilter && repo.source !== sourceFilter) return false;
      if (!q) return true;
      return (
        repo.name.toLowerCase().includes(q) ||
        repo.description.toLowerCase().includes(q) ||
        repo.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [repos, query, sourceFilter]);

  return (
    <div>
      {/* ─── Search Input ─────────────────────────── */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repos by name, description, or tags..."
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-[var(--radius-default)] px-4 py-3 font-mono text-sm text-on-surface placeholder:text-slate-gray focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      {/* ─── Source Filter Pills ──────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSourceFilter(null)}
          className={`font-mono text-[10px] px-3 py-1 rounded-full uppercase transition-colors ${
            sourceFilter === null
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
          }`}
        >
          ALL
        </button>
        {sources.map((src) => (
          <button
            key={src}
            onClick={() => setSourceFilter(sourceFilter === src ? null : src)}
            className={`font-mono text-[10px] px-3 py-1 rounded-full uppercase transition-colors ${
              sourceFilter === src
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {src}
          </button>
        ))}
      </div>

      {/* ─── Result Count ─────────────────────────── */}
      <p className="font-mono text-xs text-slate-gray uppercase mb-4">
        {filtered.length.toLocaleString()} result
        {filtered.length !== 1 ? "s" : ""}
        {query && <span> for &ldquo;{query}&rdquo;</span>}
        {sourceFilter && <span> in {sourceFilter}</span>}
      </p>

      {/* ─── Results Grid ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((repo) => (
          <RepoCard key={repo.slug} repo={repo} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="font-mono text-sm text-slate-gray text-center py-12">
          No repos match your search. Try a different query or clear the filter.
        </p>
      )}
    </div>
  );
}
