import Link from "next/link";
import { getRepoCount, getDigestCount } from "@/lib/content";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

const PLACEMENT_OPTIONS = [
  {
    title: "Core Stream Sponsor Card",
    code: "CORE_STREAM",
    description:
      "Persistent sponsor card in the sidebar of every catalog, search, leaderboard, and trending page. Your brand alongside the daily intelligence feed — visible to every visitor, every session.",
    price: "Contact",
  },
  {
    title: "Digest Integration",
    code: "DIGEST_INTEGRATION",
    description:
      "Native placement inside the daily digest email and post. Your tool or service featured in context — alongside the repos engineers are already evaluating.",
    price: "Contact",
  },
  {
    title: "Research Partner",
    code: "RESEARCH_PARTNER",
    description:
      "Co-branded deep-dive research reports. Full analysis of a category or technology area with your expertise and data included. Published to the full subscriber base.",
    price: "Contact",
  },
];

export const metadata = {
  title: "Sponsor | VAIBREPORT",
  description:
    "Reach AI engineers daily through VaiBReport sponsorship placements.",
};

export default function SponsorPage() {
  const repoCount = getRepoCount();
  const digestCount = getDigestCount();

  const stats = [
    { label: "Daily Readers", value: "12,400+" },
    { label: "Platform Sources", value: "9" },
    { label: "Repos Tracked", value: repoCount.toLocaleString() + "+" },
    { label: "Digests Published", value: digestCount.toLocaleString() + "+" },
  ];

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          PARTNER_INTEGRATION // SPONSOR
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Reach AI Engineers Daily
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl mb-6">
          VaiBReport delivers curated intelligence to engineering teams building
          at the autonomous frontier. Put your product in front of the people
          who evaluate, adopt, and deploy.
        </p>
        <Link
          href="mailto:sponsor@vaibos.com"
          className="inline-block bg-primary text-on-primary font-mono text-sm uppercase px-6 py-3 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all"
        >
          INQUIRE NOW
        </Link>
      </header>

      {/* ─── Stats ───────────────────────────────── */}
      <section className="mb-16">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-6">
          AUDIENCE_METRICS
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 text-center"
            >
              <p className="font-display text-3xl font-extrabold text-primary mb-1">
                {stat.value}
              </p>
              <p className="font-mono text-[10px] text-slate-gray uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Placement Options ───────────────────── */}
      <section className="mb-16">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-6">
          PLACEMENT_OPTIONS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLACEMENT_OPTIONS.map((option) => (
            <div
              key={option.code}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col"
            >
              <span className="font-mono text-[10px] text-secondary uppercase mb-2">
                {option.code}
              </span>
              <h3 className="font-display text-xl font-bold text-primary mb-2">
                {option.title}
              </h3>
              <p className="font-body text-sm text-on-surface-variant flex-1 mb-4">
                {option.description}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                <span className="font-mono text-sm font-bold text-primary">
                  {option.price}
                </span>
                <Link
                  href="mailto:sponsor@vaibos.com"
                  className="font-mono text-xs text-secondary hover:underline uppercase"
                >
                  Inquire &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Subscribe Strip ─────────────────────── */}
      <SubscribeStrip />
    </div>
  );
}
