import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "ABOUT" },
  { href: "/feeds", label: "API_DOCS" },
  { href: "/settings", label: "SYSTEM_STATUS" },
] as const;

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 md:px-[var(--spacing-margin-desktop)] flex flex-col md:flex-row justify-between items-center gap-6 border-t border-outline-variant bg-surface">
      <p className="font-mono text-sm font-bold text-primary">
        VAIBREPORT TERMINAL
      </p>

      <div className="flex items-center gap-6">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-xs uppercase tracking-widest text-slate-gray hover:text-secondary transition-colors focus-ring"
          >
            {link.label}
          </Link>
        ))}
        <span className="h-4 w-px bg-outline-variant" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
          <span className="font-mono text-[10px] text-slate-gray uppercase">
            PIPELINE_OK
          </span>
        </div>
        <span className="h-4 w-px bg-outline-variant" />
        <Link
          href="https://chaosdesktop.com"
          className="font-mono text-xs uppercase tracking-widest text-tertiary-fixed-dim border border-tertiary-fixed-dim rounded-full px-3 py-1 hover:bg-tertiary-fixed-dim/10 transition-colors focus-ring"
        >
          DOWNLOAD CHAOS DESKTOP
        </Link>
      </div>

      <p className="font-mono text-[10px] text-slate-gray uppercase">
        &copy; {new Date().getFullYear()} VAIBREPORT. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
}
