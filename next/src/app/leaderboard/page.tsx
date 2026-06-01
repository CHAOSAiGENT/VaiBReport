import Link from "next/link";
import { getRepos } from "@/lib/content";
import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";
import { ChaosBlock } from "@/components/chaos-desktop/chaos-block";

export const metadata = {
  title: "Leaderboard | VAIBREPORT",
  description:
    "Hall of Fame — the top 50 repos by stars tracked by VaiBReport.",
};

export default function LeaderboardPage() {
  const allRepos = getRepos();
  const top50 = allRepos.sort((a, b) => b.stars - a.stars).slice(0, 50);

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          HALL_OF_FAME
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Leaderboard
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl">
          Top 50 repos by star count across all tracked platforms.
        </p>
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        {/* Table */}
        <div className="lg:col-span-3">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4 w-12">
                    #
                  </th>
                  <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4">
                    NAME
                  </th>
                  <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4 hidden md:table-cell">
                    SOURCE
                  </th>
                  <th className="text-right font-mono text-xs uppercase text-slate-gray py-3 px-4">
                    STARS
                  </th>
                  <th className="text-right font-mono text-xs uppercase text-slate-gray py-3 px-4 hidden md:table-cell">
                    FEATURED
                  </th>
                </tr>
              </thead>
              <tbody>
                {top50.map((repo, i) => (
                  <tr
                    key={repo.slug}
                    className="border-b border-outline-variant last:border-none hover:bg-surface-container-low transition-colors"
                  >
                    <td className="font-mono text-sm text-slate-gray py-3 px-4">
                      {i + 1}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/repos/${repo.slug}`}
                        className="font-body text-sm text-primary hover:text-secondary transition-colors"
                      >
                        {repo.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase">
                        {repo.source}
                      </span>
                    </td>
                    <td className="font-mono text-sm text-primary text-right py-3 px-4">
                      {repo.stars.toLocaleString()}
                    </td>
                    <td className="font-mono text-sm text-slate-gray text-right py-3 px-4 hidden md:table-cell">
                      {repo.timesFeatured}×
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <SponsorCard />
        </aside>
      </div>

      {/* ─── Chaos Block ─────────────────────────── */}
      <div className="mb-16">
        <ChaosBlock />
      </div>

      {/* ─── Subscribe Strip ─────────────────────── */}
      <SubscribeStrip />
    </div>
  );
}
