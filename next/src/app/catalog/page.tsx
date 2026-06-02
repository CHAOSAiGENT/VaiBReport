import { getRepos, getRepoCount } from "@/lib/content";
import { RepoCard } from "@/components/stream/repo-card";
import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

export const metadata = {
  title: "Catalog | VAIBREPORT",
  description:
    "Browse the living catalog — every repo, model, and tool tracked by VaiBReport.",
};

export default function CatalogPage() {
  const repos = getRepos(60);
  const repoCount = getRepoCount();

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          LIVING_CATALOG
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          {repoCount.toLocaleString()} repos tracked.
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl">
          The full index of repos, models, and tools surfaced by our 9-platform
          data pipeline. Updated daily.
        </p>
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        {/* Repo grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <RepoCard key={repo.slug} repo={repo} />
          ))}
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
