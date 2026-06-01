import { getRepos } from "@/lib/content";
import { RepoCard } from "@/components/stream/repo-card";
import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

export const metadata = {
  title: "Trending | VAIBREPORT",
  description:
    "Trending Pulse — repos featured multiple times, sorted by momentum.",
};

export default function TrendingPage() {
  const allRepos = getRepos();
  const trending = allRepos
    .filter((r) => r.timesFeatured >= 2)
    .sort((a, b) => {
      if (b.timesFeatured !== a.timesFeatured)
        return b.timesFeatured - a.timesFeatured;
      return b.stars - a.stars;
    })
    .slice(0, 30);

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          TRENDING // PULSE
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Momentum signal.
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl">
          Repos that keep resurfacing — featured 2+ times across our daily
          digests. Sorted by recurrence, then star count.
        </p>
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        {/* Repo grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {trending.map((repo) => (
            <RepoCard key={repo.slug} repo={repo} />
          ))}
          {trending.length === 0 && (
            <p className="font-mono text-sm text-slate-gray col-span-2">
              No trending repos yet — check back after a few digest cycles.
            </p>
          )}
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
