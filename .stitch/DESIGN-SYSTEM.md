# VaiBReport Design System — Canonical Reference

**Source:** Stitch project `6458998332659659501`
**Name:** Sophisticated Technical
**Date:** 2026-05-31

## Files

| File                      | Purpose                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `tailwind.canonical.json` | Tailwind config (colors, spacing, fonts, radii) — import into `tailwind.config.ts`     |
| `base.canonical.css`      | Base styles (dot grid, focus rings, scrollbar, animations) — import into `globals.css` |
| `DESIGN-SYSTEM.md`        | This file — component patterns and reconciliation notes                                |

## Reconciliation Notes

Four Stitch template screens were compared. Key differences resolved:

| Token           | Desktop Accessible  | Others                                    | Canonical Decision                                                                     |
| --------------- | ------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `slate-gray`    | `#4B5563` (WCAG AA) | `#5E6780`                                 | **`#4B5563`** — accessibility wins                                                     |
| `outline`       | `#7e7576`           | `#77767c`                                 | **`#77767c`** — original design system value                                           |
| `primary`       | `#000000`           | `#000000`                                 | **`#000000`** — all agree (Stitch DESIGN.md says #12131a but templates use pure black) |
| `blueprint-dot` | not present         | `rgba(18, 19, 26, 0.08)`                  | **included** — canonical dot grid color                                                |
| mobile sizes    | not in desktop      | `display-lg-mobile`, `headline-lg-mobile` | **included** — needed for responsive                                                   |

## Typography Scale

| Token            | Font           | Size               | Weight | Use                                                    |
| ---------------- | -------------- | ------------------ | ------ | ------------------------------------------------------ |
| `display-lg`     | Chivo          | 48px (32px mobile) | 800    | Page titles, hero headlines                            |
| `headline-lg`    | Chivo          | 32px (24px mobile) | 700    | Section headings                                       |
| `section-header` | JetBrains Mono | 14px               | 700    | Section labels, nav items (UPPERCASE + 0.1em tracking) |
| `body-md`        | Inter          | 16px               | 400    | Prose, descriptions                                    |
| `mono-data`      | JetBrains Mono | 14px               | 400    | Data values, terminal output, button labels            |
| `label-md`       | JetBrains Mono | 12px               | 500    | Small labels, footer links                             |
| `micro-label`    | JetBrains Mono | 10px               | 400    | Metadata, sublabels                                    |

## Color Roles

| Role                     | Hex       | Use                                  |
| ------------------------ | --------- | ------------------------------------ |
| Primary                  | `#000000` | Headers, primary text, solid buttons |
| Secondary                | `#0052d0` | Links, active states, focus rings    |
| Tertiary (neon green)    | `#00e475` | LIVE/STABLE status indicators ONLY   |
| Error                    | `#ba1a1a` | Critical alerts, destructive actions |
| Slate Gray               | `#4B5563` | Metadata, labels, secondary text     |
| Surface                  | `#fafaf4` | Page background (warm off-white)     |
| Surface Container Lowest | `#ffffff` | Card backgrounds                     |
| Outline Variant          | `#c8c5cb` | Borders, dividers                    |
| Muted Border             | `#C4C6D0` | Structural borders                   |

## Component Patterns

### Buttons

- **Primary:** `bg-primary text-on-primary font-mono-data uppercase` + `active:scale-95`
- **Outline:** `border-2 border-primary text-primary` + `hover:bg-primary hover:text-white`
- **Ghost:** `text-slate-gray hover:text-primary font-mono-data`
- **Processing:** `bg-surface-container-high text-slate-gray cursor-wait` + spinner

### Cards

- **Standard:** `bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]`
- **Hero/Promo:** `bg-primary text-on-primary rounded-xl` + decorative blur sphere
- **With accent:** Add `border-l-2 border-primary` for significance

### Status Chips

- **Stable:** `bg-tertiary-fixed text-on-tertiary-fixed rounded-full px-3 py-1 font-mono-data text-xs`
- **Rising:** Green dot with `animate-pulse` + shadow glow
- **Critical:** Red dot with `animate-ping` + shadow glow

### Sponsor Card

- **Container:** `border border-dashed border-muted-border rounded-xl p-6`
- **Label:** `font-label-md text-slate-gray uppercase` reading "SPONSORED"
- **CTA:** `text-secondary hover:underline font-mono-data text-xs uppercase`

### Navigation

- **Top bar:** `fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant h-16`
- **Active link:** `text-secondary border-b-2 border-secondary`
- **Inactive link:** `text-on-surface-variant hover:text-primary`
- **Style:** `font-section-header text-section-header uppercase tracking-widest`

### Footer

- **Container:** `border-t border-outline-variant bg-surface py-8 px-margin-desktop`
- **Brand:** `font-mono-data text-mono-data font-bold text-primary`
- **Links:** `font-label-md text-label-md uppercase tracking-widest text-slate-gray hover:text-secondary`

### Layout

- **Desktop:** Sidebar 256px fixed + main content max-w-container-max with px-margin-desktop
- **Mobile:** No sidebar, px-margin-mobile, bottom nav bar
- **Grid:** 12-column with gap-gutter (24px)
- **Vertical rhythm:** 8px base unit, 64px+ between major sections
