import Link from "next/link";

interface SponsorCardProps {
  name?: string;
  description?: string;
  href?: string;
}

export function SponsorCard({
  name = "Acme AI",
  description = "Enterprise inference at scale. 10x faster model serving.",
  href = "#",
}: SponsorCardProps) {
  return (
    <div className="border border-dashed border-muted-border rounded-lg p-4">
      <p className="font-mono text-[10px] text-slate-gray uppercase mb-2">
        SPONSORED
      </p>
      <h3 className="font-display text-lg font-bold text-primary mb-1">
        {name}
      </h3>
      <p className="font-body text-sm text-on-surface-variant mb-3">
        {description}
      </p>
      <Link
        href={href}
        className="font-mono text-xs text-secondary hover:underline uppercase"
      >
        Learn More &rarr;
      </Link>
    </div>
  );
}
