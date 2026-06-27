import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

export const dynamicParams = false;

// Next.js 16 output:export requires prerenderedRoutes.length > 0 for any dynamic
// route — an empty generateStaticParams return is treated as "missing". When
// _articles/ doesn't exist yet, emit a sentinel slug that will gracefully 404
// via notFound() below so the build succeeds with no linked article pages.
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  if (slugs.length === 0) return [{ slug: "__empty__" }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | VAIBREPORT`,
    description: article.newsletterCut,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const html = await markdownToHtml(article.content);

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
        ARTICLE // {article.source.toUpperCase()}
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-tight mb-6">
        {article.title}
      </h1>
      {article.imageUrls[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageUrls[0]}
          alt={article.title}
          className="rounded-lg border border-outline-variant mb-8 w-full"
        />
      ) : null}
      {/* Article content is pipeline-generated markdown, not user input.
          remark-html@16 sanitizes by default — no additional sanitizer needed. */}
      <article
        className="prose prose-slate max-w-none font-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="mt-16">
        <SubscribeStrip />
      </div>
    </div>
  );
}
