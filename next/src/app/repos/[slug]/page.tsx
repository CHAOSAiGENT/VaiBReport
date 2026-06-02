import { notFound } from "next/navigation";
import Link from "next/link";
import { getRepos, getRepoBySlug } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";
import { ChaosBlock } from "@/components/chaos-desktop/chaos-block";

export async function generateStaticParams() {
  const repos = getRepos();
  return repos.map((repo) => ({ slug: repo.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const repo = getRepoBySlug(slug);
  if (!repo) return { title: "Repo Not Found" };
  return {
    title: `${repo.name} | VAIBREPORT`,
    description: repo.description || `${repo.name} — tracked by VaiBReport.`,
  };
}

export default async function RepoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const repo = getRepoBySlug(slug);
  if (!repo) notFound();

  const contentHtml = repo.content ? await markdownToHtml(repo.content) : null;

  const stats = [
    { label: "STARS", value: repo.stars.toLocaleString() },
    { label: "DOWNLOADS", value: repo.downloads.toLocaleString() },
    { label: "LIKES", value: repo.likes.toLocaleString() },
    { label: "FEATURED", value: `${repo.timesFeatured}×` },
  ];

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="border-l-4 border-l-primary pl-6 mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          REPO // {repo.source.toUpperCase()}
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          {repo.name}
        </h1>
        {repo.description && (
          <p className="font-body text-base text-on-surface-variant max-w-2xl mb-4">
            {repo.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase">
            {repo.source}
          </span>
          {repo.language && (
            <span className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase">
              {repo.language}
            </span>
          )}
          {repo.category && (
            <span className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase">
              {repo.category}
            </span>
          )}
        </div>
        {repo.itemUrl && (
          <Link
            href={repo.itemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-on-primary font-mono text-xs uppercase px-5 py-2.5 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all"
          >
            VIEW ON {repo.source.toUpperCase()} &rarr;
          </Link>
        )}
      </header>

      {/* ─── Stats Row ───────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 text-center"
          >
            <p className="font-mono text-[10px] text-slate-gray uppercase mb-1">
              {stat.label}
            </p>
            <p className="font-display text-2xl font-bold text-primary">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Replaces / Similar To */}
          {repo.replaces && repo.replaces.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 mb-6">
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-3">
                REPLACES
              </p>
              <ul className="space-y-2">
                {repo.replaces.map((r) => (
                  <li key={r.name} className="flex items-center gap-2">
                    <Link
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-secondary hover:underline"
                    >
                      {r.name}
                    </Link>
                    {r.note && (
                      <span className="font-mono text-[10px] text-slate-gray">
                        — {r.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {repo.similarTo && repo.similarTo.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 mb-6">
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-3">
                SIMILAR_TO
              </p>
              <div className="flex flex-wrap gap-2">
                {repo.similarTo.map((name) => (
                  <span
                    key={name}
                    className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Markdown content — pipeline-generated, not user input.
              Safe to render without extra sanitization (see CLAUDE.md). */}
          {contentHtml && (
            <article
              className="prose prose-neutral max-w-none font-body text-on-surface
                prose-headings:font-display prose-headings:text-primary prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                prose-li:text-on-surface-variant prose-li:leading-relaxed
                prose-p:text-on-surface-variant prose-p:leading-relaxed
                prose-code:font-mono prose-code:text-sm prose-code:bg-surface-container prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <SponsorCard />

          {/* Metadata */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-3">
              METADATA
            </p>
            <dl className="space-y-2 font-mono text-xs text-on-surface-variant">
              {repo.firstFeatured && (
                <>
                  <dt className="text-slate-gray uppercase">FIRST_FEATURED</dt>
                  <dd className="mb-2">{repo.firstFeatured}</dd>
                </>
              )}
              {repo.lastFeatured && (
                <>
                  <dt className="text-slate-gray uppercase">LAST_FEATURED</dt>
                  <dd className="mb-2">{repo.lastFeatured}</dd>
                </>
              )}
              {repo.tags.length > 0 && (
                <>
                  <dt className="text-slate-gray uppercase">TAGS</dt>
                  <dd className="flex flex-wrap gap-1 mb-2">
                    {repo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </>
              )}
              {repo.icpTags.length > 0 && (
                <>
                  <dt className="text-slate-gray uppercase">ICP_TAGS</dt>
                  <dd className="flex flex-wrap gap-1">
                    {repo.icpTags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </>
              )}
            </dl>
          </div>

          {/* Back to catalog */}
          <Link
            href="/catalog"
            className="font-mono text-xs text-secondary hover:underline uppercase"
          >
            &larr; BACK TO CATALOG
          </Link>
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
