import Link from "next/link";
import type { RepoEntry } from "@/lib/content";

interface RepoCardProps {
  repo: RepoEntry;
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <Link
      href={`/repos/${repo.slug}`}
      className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col hover:border-primary/40 transition-colors group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-display text-lg font-bold text-primary group-hover:text-secondary transition-colors">
          {repo.name}
        </h3>
        {repo.stars > 0 && (
          <span className="font-mono text-xs text-slate-gray">
            ★ {repo.stars.toLocaleString()}
          </span>
        )}
      </div>
      <p className="font-body text-sm text-on-surface-variant flex-1 mb-3 line-clamp-2">
        {repo.description}
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase">
          {repo.source}
        </span>
        {repo.language && (
          <span className="font-mono text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase">
            {repo.language}
          </span>
        )}
      </div>
    </Link>
  );
}
