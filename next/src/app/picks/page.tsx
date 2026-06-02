import Link from "next/link";
import { getRepos } from "@/lib/content";
import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

export const metadata = {
  title: "Peter's Picks | VAIBREPORT",
  description:
    "Hand-curated intelligence — high-signal repos selected by the editor.",
};

export default function PicksPage() {
  const allRepos = getRepos();
  const picks = allRepos
    .filter((r) => r.stars > 1000 && r.timesFeatured >= 2)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 12);

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          PETER&apos;S PICKS // EDITOR_CURATED
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Curated Intelligence
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl">
          Hand-selected from thousands of tracked repos. Every pick has earned
          its place through sustained signal — high star count, multiple digest
          features, and genuine engineering impact.
        </p>
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        {/* Picks grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {picks.map((repo) => (
            <Link
              key={repo.slug}
              href={`/repos/${repo.slug}`}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col border-l-4 border-l-secondary hover:border-l-primary transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                  {repo.name}
                </h3>
                <span className="font-mono text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full uppercase">
                  PICK
                </span>
              </div>
              <p className="font-body text-sm text-on-surface-variant flex-1 mb-3 line-clamp-2">
                {repo.description}
              </p>
              <div className="flex flex-wrap gap-3 font-mono text-[10px] text-slate-gray uppercase">
                <span className="bg-surface-container-high px-2 py-0.5 rounded-full">
                  {repo.source}
                </span>
                {repo.stars > 0 && <span>★ {repo.stars.toLocaleString()}</span>}
                <span>SIGNAL: {repo.timesFeatured}x</span>
              </div>
            </Link>
          ))}
          {picks.length === 0 && (
            <p className="font-mono text-sm text-slate-gray col-span-2">
              No picks yet — curated selections appear after sufficient data
              accumulates.
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
