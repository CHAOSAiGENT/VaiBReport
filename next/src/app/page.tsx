import Link from "next/link";
import { getDigestPosts, getRepoCount, getDigestCount } from "@/lib/content";

const HERO_REPO = {
  name: "Neural_Flow v2.4",
  signal: 98.4,
  description:
    "High-density inference clusters with optimized memory allocation",
  tags: ["CHAOS_DESKTOP_READY", "MIT"],
};

const CHAOS_RELEASES = [
  {
    name: "Stream_Monitor",
    desc: "Real-time pipeline observability",
    version: "v3.1",
  },
  { name: "Repo_Sync", desc: "Local repo pull aggregation", version: "v2.0" },
  {
    name: "Identity_Auth",
    desc: "Multi-platform token federation",
    version: "v1.4",
  },
];

const PETERS_PICKS = [
  {
    name: "Qwen3-Coder",
    blurb: "Code generation with 128K context",
    signal: 97.1,
  },
  {
    name: "Llama-Guard-4",
    blurb: "Safety classifier for LLM outputs",
    signal: 94.8,
  },
  { name: "DeepSite-R1", blurb: "One-click deployable AI apps", signal: 92.3 },
];

const PLATFORM_SOURCES = [
  "GitHub",
  "HuggingFace",
  "Replicate",
  "Papers",
  "npm",
  "PyPI",
  "GitLab",
  "Ollama",
  "Launches",
];

export default function HomePage() {
  const recentDigests = getDigestPosts(5);
  const repoCount = getRepoCount();
  const digestCount = getDigestCount();

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Hero ──────────────────────────────────── */}
      <section className="mb-16">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          CORE_STREAM // LATEST_UPDATE
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Premium intelligence for the{" "}
          <span className="underline decoration-secondary decoration-2 underline-offset-4">
            autonomous frontier.
          </span>
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl mb-6">
          Synthesizing raw signal from the noise of 130+ data streams. Automated
          analysis for the next generation of high-frequency engineering teams —{" "}
          <span className="font-semibold text-secondary">
            built for Chaos Desktop.
          </span>
        </p>
        <div className="flex gap-4">
          <Link
            href={
              recentDigests[0] ? `/digest/${recentDigests[0].slug}` : "/catalog"
            }
            className="bg-primary text-on-primary font-mono text-sm uppercase px-6 py-3 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all"
          >
            VIEW LATEST DIGEST
          </Link>
          <Link
            href="/catalog"
            className="border-2 border-primary text-primary font-mono text-sm uppercase px-6 py-3 rounded-[var(--radius-default)] hover:bg-primary hover:text-on-primary transition-all"
          >
            BROWSE CATALOG
          </Link>
        </div>
      </section>

      {/* ─── Hero Stream Card + Platform Health ───── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex gap-2 mb-2">
                {HERO_REPO.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase ${
                      tag.includes("CHAOS")
                        ? "bg-tertiary-fixed text-on-tertiary-fixed"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">
                {HERO_REPO.name}
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                {HERO_REPO.description}
              </p>
            </div>
            <span className="font-mono text-3xl font-bold text-primary">
              {HERO_REPO.signal}
            </span>
          </div>
          <div className="h-40 bg-surface-container rounded-lg flex items-center justify-center">
            <span className="font-mono text-xs text-slate-gray uppercase">
              VISUALIZATION_PLACEHOLDER
            </span>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 font-mono text-[10px] text-slate-gray uppercase">
            <span>VAIBREPORT // PIPELINE_OK</span>
            <span className="text-tertiary-fixed-dim flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" />{" "}
              STATUS: LIVE
            </span>
            <span>SOURCES: {PLATFORM_SOURCES.length}</span>
            <span>REPOS: {repoCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-3">
              PLATFORM_HEALTH
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORM_SOURCES.map((src) => (
                <div key={src} className="flex flex-col items-center gap-1 p-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                  <span className="font-mono text-[9px] text-slate-gray uppercase">
                    {src}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-dashed border-muted-border rounded-lg p-4">
            <p className="font-mono text-[10px] text-slate-gray uppercase mb-2">
              SPONSORED
            </p>
            <h3 className="font-display text-lg font-bold text-primary mb-1">
              Acme AI
            </h3>
            <p className="font-body text-sm text-on-surface-variant mb-3">
              Enterprise inference at scale. 10x faster model serving.
            </p>
            <Link
              href="#"
              className="font-mono text-xs text-secondary hover:underline uppercase"
            >
              Learn More →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Chaos Releases ────────────────────────── */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray">
            CHAOS_ALERTS // ACTIVE
          </p>
          <Link
            href="https://chaosdesktop.com"
            className="font-mono text-xs text-secondary hover:underline uppercase"
          >
            VIEW ALL RELEASES →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHAOS_RELEASES.map((release) => (
            <div
              key={release.name}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-mono text-sm font-bold text-primary uppercase">
                  {release.name}
                </h3>
                <span className="font-mono text-[10px] text-slate-gray">
                  {release.version}
                </span>
              </div>
              <p className="font-body text-sm text-on-surface-variant">
                {release.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Peter's Picks ─────────────────────────── */}
      <section className="mb-16">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-6">
          PETER&apos;S PICKS // EDITOR_CURATED
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PETERS_PICKS.map((pick) => (
            <div
              key={pick.name}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display text-xl font-bold text-primary">
                  {pick.name}
                </h3>
                <span className="font-mono text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full uppercase">
                  PICK
                </span>
              </div>
              <p className="font-body text-sm text-on-surface-variant flex-1">
                {pick.blurb}
              </p>
              <p className="font-mono text-sm text-primary mt-3">
                SIGNAL: {pick.signal}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Subscribe Strip ───────────────────────── */}
      <section className="bg-primary rounded-lg px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-16">
        <p className="font-body text-base text-on-primary">
          Get the daily intelligence digest in your inbox.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="email"
            placeholder="you@company.com"
            className="bg-white text-primary rounded-[var(--radius-default)] px-4 py-2 font-mono text-sm w-64"
          />
          <button className="bg-secondary text-on-secondary font-mono text-xs uppercase px-5 py-2.5 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all">
            SUBSCRIBE
          </button>
        </div>
        <p className="font-mono text-[10px] text-slate-gray">
          Powered by Resend
        </p>
      </section>

      {/* ─── Recent Activity ───────────────────────── */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray">
            Recent Activity / LAST_{digestCount}_DIGESTS
          </p>
          <Link
            href="/catalog"
            className="font-mono text-xs text-secondary hover:underline uppercase"
          >
            VIEW ARCHIVE →
          </Link>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4">
                  DATE
                </th>
                <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4">
                  DIGEST TITLE
                </th>
                <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4 hidden md:table-cell">
                  SIGNAL
                </th>
                <th className="text-left font-mono text-xs uppercase text-slate-gray py-3 px-4 hidden md:table-cell">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {recentDigests.map((digest) => (
                <tr
                  key={digest.slug}
                  className="border-b border-outline-variant last:border-none hover:bg-surface-container-low transition-colors"
                >
                  <td className="font-mono text-sm text-slate-gray py-3 px-4">
                    {digest.date}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/digest/${digest.slug}`}
                      className="font-body text-sm text-primary hover:text-secondary transition-colors"
                    >
                      {digest.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className="w-2 h-4 bg-tertiary-fixed-dim rounded-sm"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="font-mono text-[10px] bg-tertiary-fixed/20 text-on-tertiary-container px-2 py-0.5 rounded-full uppercase">
                      ARCHIVED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
