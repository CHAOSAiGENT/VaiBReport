import Link from "next/link";
import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

const FEEDS = [
  {
    title: "RSS Feed",
    code: "RSS_XML",
    url: "/feed.xml",
    description:
      "Full daily digest delivered via standard RSS/Atom. Compatible with every feed reader — Feedly, Inoreader, NetNewsWire, and more.",
  },
  {
    title: "Repo Catalog",
    code: "API_REPOS",
    url: "/api/repos",
    description:
      "JSON endpoint returning the complete repo catalog. Every tracked repo with metadata, stats, and editorial fields. Ideal for custom dashboards.",
  },
  {
    title: "Daily Snapshot",
    code: "API_SNAPSHOT",
    url: "/api/snapshot",
    description:
      "Latest daily data snapshot across all 9 platforms. Raw signal before editorial processing — for teams that want to build their own analysis layer.",
  },
];

export const metadata = {
  title: "Feeds | VAIBREPORT",
  description:
    "RSS and API endpoints — consume VaiBReport data in your preferred format.",
};

export default function FeedsPage() {
  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          RSS &amp; API // DATA_ORCHESTRATION
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Data Feeds
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl">
          Consume VaiBReport data programmatically. RSS for reading, JSON APIs
          for building.
        </p>
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3 space-y-6">
          {FEEDS.map((feed) => (
            <div
              key={feed.code}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-mono text-[10px] text-secondary uppercase">
                    {feed.code}
                  </span>
                  <h3 className="font-display text-xl font-bold text-primary mt-1">
                    {feed.title}
                  </h3>
                </div>
                <Link
                  href={feed.url}
                  className="font-mono text-xs text-secondary hover:underline uppercase shrink-0"
                >
                  Open &rarr;
                </Link>
              </div>
              <p className="font-body text-sm text-on-surface-variant mb-3">
                {feed.description}
              </p>
              <code className="block bg-surface-container rounded-[var(--radius-default)] px-4 py-2 font-mono text-sm text-on-surface-variant">
                {feed.url}
              </code>
            </div>
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
