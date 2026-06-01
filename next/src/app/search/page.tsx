import { getRepos, getRepoCount } from "@/lib/content";
import { SearchClient } from "@/components/search/search-client";
import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

export const metadata = {
  title: "Search | VAIBREPORT",
  description:
    "Search the full VaiBReport catalog — filter by name, description, tags, or platform source.",
};

export default function SearchPage() {
  const repos = getRepos();
  const repoCount = getRepoCount();

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          SEARCH // FULL_CATALOG
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Find anything.
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl">
          Search across {repoCount.toLocaleString()} tracked repos, models, and
          tools. Filter by platform source or search by name, description, and
          tags.
        </p>
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          <SearchClient repos={repos} />
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <SponsorCard />
        </aside>
      </div>

      {/* ─── Subscribe Strip ─────────────────────── */}
      <SubscribeStrip />
    </div>
  );
}
