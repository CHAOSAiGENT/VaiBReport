import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";

const PLATFORMS: Record<
  string,
  { name: string; description: string; status: string }
> = {
  github: {
    name: "GitHub",
    description:
      "Trending repositories, new releases, and star velocity across the world's largest code forge.",
    status: "OPERATIONAL",
  },
  huggingface: {
    name: "HuggingFace",
    description:
      "Model cards, datasets, and Spaces activity from the leading ML model hub.",
    status: "OPERATIONAL",
  },
  replicate: {
    name: "Replicate",
    description:
      "Hosted model deployments, API-accessible inference, and community model runs.",
    status: "OPERATIONAL",
  },
  paperswithcode: {
    name: "Papers with Code",
    description:
      "Research papers with linked implementations — bridging academia and production.",
    status: "OPERATIONAL",
  },
  npm: {
    name: "npm",
    description:
      "JavaScript and TypeScript package ecosystem — downloads, dependencies, and new releases.",
    status: "OPERATIONAL",
  },
  pypi: {
    name: "PyPI",
    description:
      "Python Package Index — download metrics, version activity, and ecosystem trends.",
    status: "OPERATIONAL",
  },
  gitlab: {
    name: "GitLab",
    description:
      "Alternative forge repositories, CI/CD projects, and self-hosted open-source activity.",
    status: "OPERATIONAL",
  },
  ollama: {
    name: "Ollama",
    description:
      "Local-first model library — quantized models, runners, and community contributions.",
    status: "OPERATIONAL",
  },
  launches: {
    name: "Launch Platforms",
    description:
      "Product Hunt, DevHunt, Hacker News, BetaList, and Uneed — new product launches and developer tools.",
    status: "OPERATIONAL",
  },
};

const PLATFORM_IDS = Object.keys(PLATFORMS);

export async function generateStaticParams() {
  return PLATFORM_IDS.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const platform = PLATFORMS[id];
  if (!platform) return { title: "Platform Not Found" };
  return {
    title: `${platform.name} | VAIBREPORT`,
    description: platform.description,
  };
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const platform = PLATFORMS[id];

  if (!platform) {
    return (
      <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
        <p className="font-mono text-sm text-slate-gray">
          PLATFORM_NOT_FOUND — {id}
        </p>
      </div>
    );
  }

  const metrics = [
    { label: "REPOS_TRACKED", value: "--" },
    { label: "DAILY_NEW", value: "--" },
    { label: "AVG_SIGNAL", value: "--" },
    { label: "UPTIME", value: "99.9%" },
  ];

  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          PLATFORM_INSIGHTS // {id.toUpperCase()}
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          {platform.name}
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl mb-4">
          {platform.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
          <span className="font-mono text-xs text-slate-gray uppercase">
            STATUS: {platform.status}
          </span>
        </div>
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 text-center"
              >
                <p className="font-display text-2xl font-bold text-primary mb-1">
                  {metric.value}
                </p>
                <p className="font-mono text-[10px] text-slate-gray uppercase">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          {/* Pipeline Info */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-3">
              PIPELINE_STATUS
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant">
                <span className="font-mono text-sm text-on-surface">
                  Scraper Schedule
                </span>
                <span className="font-mono text-xs text-slate-gray">
                  DAILY_CRON
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant">
                <span className="font-mono text-sm text-on-surface">
                  Last Successful Run
                </span>
                <span className="font-mono text-xs text-slate-gray">--</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant">
                <span className="font-mono text-sm text-on-surface">
                  Data Freshness
                </span>
                <span className="font-mono text-xs text-tertiary-fixed-dim">
                  CURRENT
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-mono text-sm text-on-surface">
                  Error Rate (30d)
                </span>
                <span className="font-mono text-xs text-slate-gray">0.0%</span>
              </div>
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
