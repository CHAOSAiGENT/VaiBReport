import { SponsorCard } from "@/components/common/sponsor-card";
import { SubscribeStrip } from "@/components/common/subscribe-strip";
import { getItemsBySource } from "@/lib/content";

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

// platform page id → snapshot source key
const SOURCE_FOR: Record<string, string> = {
  github: "repos",
  huggingface: "hf",
  replicate: "replicate",
  paperswithcode: "paperswithcode",
  npm: "npm-pypi",
  pypi: "npm-pypi",
  gitlab: "gitlab",
  ollama: "ollama",
  launches: "launches",
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

  const items = getItemsBySource(SOURCE_FOR[id] ?? id).filter((it) =>
    id === "npm"
      ? it.source === "npm"
      : id === "pypi"
        ? it.source === "pypi"
        : true,
  );
  const avgSignal = items.length
    ? Math.round(items.reduce((a, it) => a + it.signal, 0) / items.length)
    : 0;
  const metrics = [
    {
      label: "ITEMS_TRACKED",
      value: items.length ? items.length.toLocaleString() : "--",
    },
    { label: "TOP_SIGNAL", value: items[0] ? String(items[0].signal) : "--" },
    { label: "AVG_SIGNAL", value: items.length ? String(avgSignal) : "--" },
    { label: "STATUS", value: items.length ? "LIVE" : "IDLE" },
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

          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 mt-8">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-3">
              TOP_ON_{id.toUpperCase()}
            </p>
            {items.length === 0 ? (
              <p className="font-mono text-xs text-slate-gray uppercase">
                NO_DATA_TODAY
              </p>
            ) : (
              <ul className="space-y-2">
                {items.slice(0, 10).map((it) => (
                  <li
                    key={it.slug}
                    className="flex justify-between items-center gap-3 py-1 border-b border-outline-variant last:border-none"
                  >
                    <a
                      href={it.hasArticle ? `/articles/${it.slug}` : it.url}
                      className="font-body text-sm text-primary hover:text-secondary truncate"
                    >
                      {it.name}
                    </a>
                    <span className="font-mono text-[10px] text-slate-gray whitespace-nowrap">
                      {it.metricValue.toLocaleString()} {it.metricLabel}
                    </span>
                  </li>
                ))}
              </ul>
            )}
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
