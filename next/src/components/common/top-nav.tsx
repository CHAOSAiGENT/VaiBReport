import Link from "next/link";

const navItems: { href: string; label: string; hasIndicator?: boolean }[] = [
  { href: "/catalog", label: "CATALOG" },
  { href: "/picks", label: "PETER'S PICKS" },
  { href: "/leaderboard", label: "LEADERBOARD" },
  { href: "/trending", label: "TRENDING" },
  { href: "https://chaosdesktop.com", label: "DESKTOP", hasIndicator: true },
  { href: "/about", label: "ABOUT" },
];

export function TopNav() {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-[var(--spacing-margin-desktop)] h-[var(--height-top-bar)] bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold tracking-tighter text-primary"
        >
          VAIBREPORT
        </Link>
        <nav className="hidden lg:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors focus-ring flex items-center gap-1.5"
            >
              {item.label}
              {item.hasIndicator && (
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse" />
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="QUERY_SYSTEM..."
            className="bg-surface-container-low border-none rounded-lg px-4 py-2 font-mono text-sm w-48 focus:w-64 focus:ring-1 focus:ring-secondary transition-all"
          />
        </div>
        <span className="flex items-center gap-1.5 text-xs font-mono text-tertiary-fixed-dim">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
          LIVE
        </span>
      </div>
    </header>
  );
}
