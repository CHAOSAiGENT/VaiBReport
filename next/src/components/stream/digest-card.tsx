import Link from "next/link";

interface DigestCardProps {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  /** Optional excerpt / first line of content */
  excerpt?: string;
}

export function DigestCard({
  slug,
  title,
  date,
  tags,
  excerpt,
}: DigestCardProps) {
  return (
    <Link
      href={`/digest/${slug}`}
      className="block bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:border-secondary transition-colors group"
    >
      <p className="font-mono text-[10px] text-slate-gray uppercase mb-2">
        {date}
      </p>
      <h3 className="font-display text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-2">
        {title}
      </h3>
      {excerpt && (
        <p className="font-body text-sm text-on-surface-variant line-clamp-2 mb-3">
          {excerpt}
        </p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase"
            >
              {tag}
            </span>
          ))}
          {tags.length > 5 && (
            <span className="font-mono text-[10px] text-slate-gray">
              +{tags.length - 5}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
