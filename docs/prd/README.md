# VaiBReport PRD Index
**Last updated:** 2026-04-01

## Me2 Extensions (Private Enrichment Layer)

| ID | Feature | Status | Priority | Effort |
|----|---------|--------|----------|--------|
| E-01 | Submission mechanism: GitHub Issue → tool entry | Built 2026-03-24 | Critical | ~2h |
| E-02 | Tool enrichment: full detail page generation | Depends on E-01 | Critical | ~3h |
| E-03 | Playwright screenshot capture for Me2 tools | Depends on E-02 | High | ~3h |
| E-04 | Video script generation (Claude API) | Depends on E-02 | High | ~2h |
| E-05 | ICP-specific use case generation (Claude API) | Depends on E-02 | High | ~1h |
| E-06 | Private/public toggle + Peter's Picks page | Depends on E-02 | Medium | ~1h |
| E-07 | Me2 private dashboard (local only) | Ideas phase | Low | ~3h |
| E-08 | Consulting context layer | Ideas phase | Medium | TBD |

## Public Platform Upgrades

| ID | Feature | Status | Priority | Effort |
|----|---------|--------|----------|--------|
| U-01 | Switch editorial blurbs to Claude Sonnet | Ready to build | High | ~1h |
| U-02 | README media extraction for catalog cards | Ready to build | High | ~3h |
| U-03 | Playwright screenshots for public catalog | Ready to build | Medium | ~4h |
| U-04 | ICP tagging in catalog and digest | Ready to build | Medium | ~2h |
| U-05 | RSS feed promotion | Ready to build | Low | ~30m |
| U-06 | Product Hunt data source | Blocked: PH API key | Medium | ~2h |
| U-07 | Custom domain | Blocked: domain decision | Low | ~1h |

## Build Order (Me2)
E-01 ✅ → E-02 → E-03, E-04, E-05 (parallel) → E-06 → E-07, E-08 (optional)

## Next Actions
- **Immediate (no blockers):** U-01, U-02, U-03, U-04, U-05
- **Ready (Me2):** E-02 (E-01 is done)
- **Blocked:** U-06 (PH API key), U-07 (domain decision), E-08 (Peter scope input)
