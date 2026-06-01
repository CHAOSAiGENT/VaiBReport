import { SponsorCard } from "@/components/common/sponsor-card";

export const metadata = {
  title: "Settings | VAIBREPORT",
  description: "Platform configuration and preferences for VaiBReport.",
};

const SETTINGS_SECTIONS = [
  {
    title: "Notification Preferences",
    code: "NOTIFICATIONS",
    description:
      "Control which alerts you receive — daily digests, research reports, breaking signal, and Peter's Picks notifications.",
    fields: ["Email Digest", "Research Alerts", "High-Signal Alerts"],
  },
  {
    title: "Data Sources",
    code: "DATA_SOURCES",
    description:
      "Configure which of the 9 platform sources appear in your personalized feed. Toggle individual platforms on or off.",
    fields: [
      "GitHub",
      "HuggingFace",
      "Replicate",
      "Papers with Code",
      "npm",
      "PyPI",
      "GitLab",
      "Ollama",
      "Launches",
    ],
  },
  {
    title: "Display Settings",
    code: "DISPLAY",
    description:
      "Customize how content is presented — card density, default sort order, and theme preferences.",
    fields: ["Card Density", "Default Sort", "Theme"],
  },
];

export default function SettingsPage() {
  return (
    <div className="px-4 md:px-[var(--spacing-margin-desktop)] max-w-[var(--width-container-max)] mx-auto py-12">
      {/* ─── Header ──────────────────────────────── */}
      <header className="mb-10">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-gray mb-4">
          SYSTEM // SETTINGS
        </p>
        <h1 className="font-display text-5xl md:text-[48px] font-extrabold tracking-tight text-primary leading-tight mb-4">
          Platform Configuration
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-2xl">
          Manage your notification preferences, data sources, and display
          settings. Changes take effect on your next session.
        </p>
      </header>

      {/* ─── Content Grid (3/4 + 1/4) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {SETTINGS_SECTIONS.map((section) => (
            <div
              key={section.code}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6"
            >
              <span className="font-mono text-[10px] text-secondary uppercase">
                {section.code}
              </span>
              <h3 className="font-display text-xl font-bold text-primary mt-1 mb-2">
                {section.title}
              </h3>
              <p className="font-body text-sm text-on-surface-variant mb-4">
                {section.description}
              </p>
              <div className="space-y-3">
                {section.fields.map((field) => (
                  <div
                    key={field}
                    className="flex justify-between items-center py-2 border-b border-outline-variant last:border-none"
                  >
                    <span className="font-mono text-sm text-on-surface">
                      {field}
                    </span>
                    <div className="w-10 h-5 bg-surface-container-high rounded-full relative">
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-slate-gray rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[10px] text-slate-gray mt-4 uppercase">
                AUTHENTICATION_REQUIRED — COMING_SOON
              </p>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <SponsorCard />
        </aside>
      </div>
    </div>
  );
}
