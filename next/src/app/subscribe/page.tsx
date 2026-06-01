import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

export const metadata = {
  title: "Subscribe | VAIBREPORT",
  description:
    "Stay connected — daily digest, research reports, and curated picks delivered to your inbox.",
};

export default function SubscribePage() {
  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          SUBSCRIBE // FEED_MANAGEMENT
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Stay Connected
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl">
          Get the signal without the noise. One email, every morning.
        </p>
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          {/* Subscribe form */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 mb-8">
            <h2 className="font-display text-2xl font-bold text-primary mb-4">
              Subscribe to VaiBReport
            </h2>
            <p className="font-body text-sm text-on-surface-variant mb-6 max-w-xl">
              Enter your email to receive the daily intelligence digest. We send
              one email per day with the latest repos, models, and tools
              surfaced by our 9-platform pipeline. Unsubscribe anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 bg-white border border-outline-variant rounded-[var(--radius-default)] px-4 py-3 font-mono text-sm text-on-surface placeholder:text-slate-gray focus:outline-none focus:border-secondary transition-colors"
              />
              <button className="bg-primary text-on-primary font-mono text-sm uppercase px-6 py-3 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all shrink-0">
                SUBSCRIBE
              </button>
            </div>
            <p className="font-mono text-[10px] text-slate-gray mt-3">
              Powered by Resend. No spam, no tracking pixels, no third-party
              data sharing.
            </p>
          </div>

          {/* What you get */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
              <span className="font-mono text-[10px] text-secondary uppercase">
                DAILY
              </span>
              <h3 className="font-display text-lg font-bold text-primary mt-1 mb-2">
                Intelligence Digest
              </h3>
              <p className="font-body text-sm text-on-surface-variant">
                Curated repos, models, and tools from across 9 platforms.
                Delivered every morning.
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
              <span className="font-mono text-[10px] text-secondary uppercase">
                WEEKLY
              </span>
              <h3 className="font-display text-lg font-bold text-primary mt-1 mb-2">
                Research Reports
              </h3>
              <p className="font-body text-sm text-on-surface-variant">
                Deep-dive analysis of emerging categories, technology shifts,
                and ecosystem trends.
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
              <span className="font-mono text-[10px] text-secondary uppercase">
                CURATED
              </span>
              <h3 className="font-display text-lg font-bold text-primary mt-1 mb-2">
                Peter&apos;s Picks
              </h3>
              <p className="font-body text-sm text-on-surface-variant">
                Hand-selected high-signal repos with editorial context and
                deployment notes.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <SponsorCard />
        </aside>
      </div>

      {/* ─── Subscribe Strip ─────────────────────── */}
      <SubscribeStrip />
    </div>
  );
}
