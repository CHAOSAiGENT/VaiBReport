import { getRepoCount, getDigestCount } from "@/lib/content";
import { ChaosBlock } from "@/components/chaos-desktop/chaos-block";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

const PIPELINE_STAGES = [
  {
    step: "01",
    title: "Fetch",
    description:
      "Nine automated scrapers pull raw data from GitHub, HuggingFace, Replicate, Papers with Code, npm, PyPI, GitLab, Ollama, and launch platforms. Every source runs on a daily cron — zero manual intervention.",
  },
  {
    step: "02",
    title: "Evaluate",
    description:
      "A multi-tier LLM cascade (Local Qwen → NVIDIA NIM → Gemini → OpenRouter → Groq → Haiku) generates editorial blurbs. First success wins. When signal is weak, the pipeline stays silent — no filler, ever.",
  },
  {
    step: "03",
    title: "Publish",
    description:
      "Validated entries are committed to the repo catalog, a daily digest post is generated, and Jekyll deploys to GitHub Pages. The full pipeline runs in GitHub Actions — build artifacts are the only output.",
  },
];

const PLATFORM_SOURCES = [
  {
    name: "GitHub",
    description: "Trending repos, new releases, star velocity",
  },
  {
    name: "HuggingFace",
    description: "Model cards, datasets, Spaces activity",
  },
  {
    name: "Replicate",
    description: "Hosted model deployments and API access",
  },
  {
    name: "Papers with Code",
    description: "Research papers with linked implementations",
  },
  {
    name: "npm",
    description: "JavaScript/TypeScript package ecosystem",
  },
  {
    name: "PyPI",
    description: "Python package index and download metrics",
  },
  {
    name: "GitLab",
    description: "Alternative forge repos and CI/CD projects",
  },
  {
    name: "Ollama",
    description: "Local-first model library and runners",
  },
  {
    name: "Launch Platforms",
    description: "Product Hunt, DevHunt, HN, BetaList, Uneed",
  },
];

export const metadata = {
  title: "About | VAIBREPORT",
  description:
    "How VaiBReport works — the 9-platform intelligence pipeline explained.",
};

export default function AboutPage() {
  const repoCount = getRepoCount();
  const digestCount = getDigestCount();

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          ABOUT // THE_INTELLIGENCE_PIPELINE
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          How VaiBReport Works
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl">
          {repoCount.toLocaleString()} repos tracked.{" "}
          {digestCount.toLocaleString()} digests published. Nine platforms.
          Fully automated. Here&apos;s the architecture.
        </p>
      </header>

      {/* ─── Pipeline Stages ─────────────────────── */}
      <section className="mb-16">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-6">
          PIPELINE_STAGES
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PIPELINE_STAGES.map((stage) => (
            <div
              key={stage.step}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 border-l-4 border-l-secondary"
            >
              <span className="font-mono text-2xl font-bold text-secondary">
                {stage.step}
              </span>
              <h3 className="font-display text-xl font-bold text-primary mt-2 mb-2">
                {stage.title}
              </h3>
              <p className="font-body text-sm text-on-surface-variant">
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Platform Sources ────────────────────── */}
      <section className="mb-16">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-6">
          PLATFORM_SOURCES // {PLATFORM_SOURCES.length}_ACTIVE
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLATFORM_SOURCES.map((platform) => (
            <div
              key={platform.name}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex items-start gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim mt-1.5 shrink-0" />
              <div>
                <h4 className="font-mono text-sm font-bold text-primary uppercase">
                  {platform.name}
                </h4>
                <p className="font-body text-sm text-on-surface-variant mt-0.5">
                  {platform.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Chaos Block ─────────────────────────── */}
      <div className="mb-16">
        <ChaosBlock />
      </div>

      {/* ─── Subscribe Strip ─────────────────────── */}
      <SubscribeStrip />
    </div>
  );
}
