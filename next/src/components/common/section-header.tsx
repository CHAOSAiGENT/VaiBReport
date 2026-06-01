import Link from "next/link";

interface SectionHeaderProps {
  label: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeader({
  label,
  actionLabel,
  actionHref,
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray">
        {label}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="font-mono text-xs text-secondary hover:underline uppercase"
        >
          {actionLabel} &rarr;
        </Link>
      )}
    </div>
  );
}
