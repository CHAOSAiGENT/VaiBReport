import Link from "next/link";

export function ChaosBlock() {
  return (
    <section className="relative bg-primary rounded-lg px-8 py-12 overflow-hidden">
      {/* Decorative blur sphere */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <span className="inline-block font-mono text-[10px] bg-tertiary-fixed-dim text-on-tertiary-fixed px-3 py-1 rounded-full uppercase mb-4">
          SYSTEM_NOMINAL
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-primary tracking-tight mb-3">
          Chaos Desktop
        </h2>
        <p className="font-body text-base text-on-primary/80 max-w-xl mb-6">
          Run every tool from this report locally. One-click install, zero
          config. The autonomous engineering workstation — built for teams that
          ship at the frontier.
        </p>
        <Link
          href="https://chaosdesktop.com"
          className="inline-block bg-secondary text-on-secondary font-mono text-sm uppercase px-6 py-3 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all"
        >
          GET CHAOS DESKTOP
        </Link>
      </div>
    </section>
  );
}
