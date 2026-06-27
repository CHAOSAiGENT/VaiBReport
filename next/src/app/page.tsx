import Link from "next/link";
import {
  getDigestPosts,
  getRepoCount,
  getDigestCount,
  getTopItems,
  getItemsBySource,
  type DisplayItem,
} from "@/lib/content";
import { SOURCES } from "@/lib/normalize";

// Link target for an item: its article if enriched, else the source URL.
function itemHref(it: DisplayItem): string {
  return it.hasArticle ? `/articles/${it.slug}` : it.url;
}

export default function HomePage() {
  const recentDigests = getDigestPosts(5);
  const repoCount = getRepoCount();
  const digestCount = getDigestCount();

  const top = getTopItems(7);
  const hero = top[0]; // today's top-signal item (may be undefined on empty data)
  const picks = top.slice(1, 4); // next three as "picks"
  const releases = top.slice(4, 7); // following three as "fresh"

  // platform health = real presence + freshness per source
  const platforms = SOURCES.map((s) => {
    const items = getItemsBySource(s);
    return {
      source: s,
      label: items[0]?.platform ?? s,
      count: items.length,
      live: items.length > 0,
    };
  });

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Hero ──────────────────────────────────── */}
      <section className="mb-16">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          CORE_STREAM // LATEST_UPDATE
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Premium intelligence for the{" "}
          <span className="underline decoration-secondary decoration-2 underline-offset-4">
            autonomous frontier.
          </span>
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl mb-6">
          Synthesizing raw signal from the noise of 130+ data streams. Automated
          analysis for the next generation of high-frequency engineering teams —{" "}
          <span className="font-semibold text-secondary">
            built for Chaos Desktop.
          </span>
        </p>
        <div className="flex gap-4">
          <Link
            href={
              recentDigests[0] ? `/digest/${recentDigests[0].slug}` : "/catalog"
            }
            className="bg-primary text-on-primary font-mono text-sm uppercase px-6 py-3 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all"
          >
            VIEW LATEST DIGEST
          </Link>
          <Link
            href="/catalog"
            className="border-2 border-primary text-primary font-mono text-sm uppercase px-6 py-3 rounded-[var(--radius-default)] hover:bg-primary hover:text-on-primary transition-all"
          >
            BROWSE CATALOG
          </Link>
        </div>
      </section>

      {/* ─── Hero Stream Card + Platform Health ───── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-l-primary">
          {hero ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase bg-surface-container-high text-on-surface-variant">
                      {hero.platform}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase bg-tertiary-fixed text-on-tertiary-fixed">
                      {hero.metricValue.toLocaleString()} {hero.metricLabel}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-primary">
                    <Link
                      href={itemHref(hero)}
                      className="hover:text-secondary transition-colors"
                    >
                      {hero.name}
                    </Link>
                  </h2>
                  <p className="font-body text-sm text-on-surface-variant mt-1 line-clamp-2">
                    {hero.description}
                  </p>
                </div>
                <span className="font-mono text-3xl font-bold text-primary">
                  {hero.signal}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 font-mono text-[10px] text-slate-gray uppercase">
                <span>VAIBREPORT // PIPELINE_OK</span>
                <span>SOURCES: {platforms.filter((p) => p.live).length}</span>
                <span>REPOS: {repoCount.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <p className="font-mono text-xs text-slate-gray uppercase">
              AWAITING_TODAY_SIGNAL
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-3">
              PLATFORM_HEALTH
            </p>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => (
                <div
                  key={p.source}
                  className="flex flex-col items-center gap-1 p-2"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${p.live ? "bg-tertiary-fixed-dim" : "bg-muted-border"}`}
                  />
                  <span className="font-mono text-[9px] text-slate-gray uppercase">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-dashed border-muted-border rounded-lg p-4">
            <p className="font-mono text-[10px] text-slate-gray uppercase mb-2">
              SPONSORED
            </p>
            <h3 className="font-display text-lg font-bold text-primary mb-1">
              Acme AI
            </h3>
            <p className="font-body text-sm text-on-surface-variant mb-3">
              Enterprise inference at scale. 10x faster model serving.
            </p>
            <Link
              href="#"
              className="font-mono text-xs text-secondary hover:underline uppercase"
            >
              Learn More →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Chaos Releases ────────────────────────── */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray">
            CHAOS_ALERTS // ACTIVE
          </p>
          <Link
            href="https://chaosdesktop.com"
            className="font-mono text-xs text-secondary hover:underline uppercase"
          >
            VIEW ALL RELEASES →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {releases.map((r) => (
            <Link
              key={r.slug}
              href={itemHref(r)}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-mono text-sm font-bold text-primary uppercase truncate">
                  {r.name}
                </h3>
                <span className="font-mono text-[10px] text-slate-gray">
                  {r.platform}
                </span>
              </div>
              <p className="font-body text-sm text-on-surface-variant line-clamp-2">
                {r.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Peter's Picks ─────────────────────────── */}
      <section className="mb-16">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-6">
          PETER&apos;S PICKS // EDITOR_CURATED
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {picks.map((pick) => (
            <Link
              key={pick.slug}
              href={itemHref(pick)}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display text-xl font-bold text-primary truncate">
                  {pick.name}
                </h3>
                <span className="font-mono text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full uppercase">
                  PICK
                </span>
              </div>
              <p className="font-body text-sm text-on-surface-variant flex-1 line-clamp-2">
                {pick.description}
              </p>
              <p className="font-mono text-sm text-primary mt-3">
                SIGNAL: {pick.signal}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Subscribe Strip ───────────────────────── */}
      <section className="bg-primary rounded-lg px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-16">
        <p className="font-body text-base text-on-primary">
          Get the daily intelligence digest in your inbox.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="email"
            placeholder="you@company.com"
            className="bg-white text-primary rounded-[var(--radius-default)] px-4 py-2 font-mono text-sm w-64"
          />
          <button className="bg-secondary text-on-secondary font-mono text-xs uppercase px-5 py-2.5 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all">
            SUBSCRIBE
          </button>
        </div>
        <p className="font-mono text-[10px] text-slate-gray">
          Powered by Resend
        </p>
      </section>

      {/* ─── Recent Activity ───────────────────────── */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray">
            Recent Activity / LAST_{digestCount}_DIGESTS
          </p>
          <Link
            href="/catalog"
            className="font-mono text-xs text-secondary hover:underline uppercase"
          >
            VIEW ARCHIVE →
          </Link>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4">
                  DATE
                </th>
                <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4">
                  DIGEST TITLE
                </th>
                <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4 hidden md:table-cell">
                  SIGNAL
                </th>
                <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4 hidden md:table-cell">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {recentDigests.map((digest) => (
                <tr
                  key={digest.slug}
                  className="border-b border-outline-variant last:border-none hover:bg-surface-container-low transition-colors"
                >
                  <td className="font-mono text-sm text-slate-gray py-3 px-4">
                    {digest.date}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/digest/${digest.slug}`}
                      className="font-body text-sm text-primary hover:text-secondary transition-colors"
                    >
                      {digest.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className="w-2 h-4 bg-tertiary-fixed-dim rounded-sm"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="font-mono text-[10px] bg-tertiary-fixed/20 text-on-tertiary-container px-2 py-0.5 rounded-full uppercase">
                      ARCHIVED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
