import { notFound } from "next/navigation";
import Link from "next/link";
import { getDigestPosts, getDigestBySlug } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

export async function generateStaticParams() {
  const posts = getDigestPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getDigestBySlug(slug);
  if (!post) return { title: "Digest Not Found" };
  return {
    title: `${post.title} | VAIBREPORT`,
    description: `VaiBReport digest for ${post.date}. Curated repos, tools, and intelligence.`,
  };
}

export default async function DigestDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getDigestBySlug(slug);
  if (!post) notFound();

  const contentHtml = await markdownToHtml(post.content);

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          DIGEST // {post.date}
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        {/* Article — content is pipeline-generated markdown, not user input.
            Safe to render without extra sanitization (see CLAUDE.md). */}
        <article
          className="lg:col-span-3 prose prose-neutral max-w-none font-body text-on-surface
            prose-headings:font-display prose-headings:text-primary prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
            prose-li:text-on-surface-variant prose-li:leading-relaxed
            prose-p:text-on-surface-variant prose-p:leading-relaxed
            prose-code:font-mono prose-code:text-sm prose-code:bg-surface-container prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <SponsorCard />

          {/* Chaos Desktop Callout */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
              <p className="font-mono text-[10px] text-slate-gray uppercase">
                CHAOS_DESKTOP // ACTIVE
              </p>
            </div>
            <h3 className="font-display text-lg font-bold text-primary mb-2">
              Chaos Desktop
            </h3>
            <p className="font-body text-sm text-on-surface-variant mb-4">
              Run every tool from this digest locally. One-click install, zero
              config.
            </p>
            <Link
              href="https://chaosdesktop.com"
              className="inline-block bg-primary text-on-primary font-mono text-xs uppercase px-4 py-2 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all"
            >
              DOWNLOAD NOW
            </Link>
          </div>

          {/* Back to stream */}
          <Link
            href="/"
            className="font-mono text-xs text-secondary hover:underline uppercase"
          >
            &larr; BACK TO STREAM
          </Link>
        </aside>
      </div>

      {/* ─── Subscribe Strip ─────────────────────── */}
      <SubscribeStrip />
    </div>
  );
}
