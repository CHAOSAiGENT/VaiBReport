# PRD: Custom Domain
**ID:** U-07  
**Status:** Blocked on domain decision  
**Priority:** Low  
**Effort:** ~1 hour  
**Last updated:** 2026-04-01

---

## Problem
VaiBReport is currently served at `chaosaigent.github.io/VaiBReport`, a URL that is tied to a GitHub username and project path. This makes the site harder to share, harder to brand, and harder to migrate later if the repo moves. No custom domain means no independent identity for the digest.

## Goal
Point a custom domain at the GitHub Pages site so VaiBReport is accessible at a clean, ownable URL with HTTPS enforced and the GitHub Pages subdomain redirecting to the custom domain automatically.

## Success Metrics
- The site loads correctly at the custom domain over HTTPS (Let's Encrypt cert auto-provisioned by GitHub)
- `chaosaigent.github.io/VaiBReport` redirects to the custom domain (GitHub Pages handles this automatically once configured)
- No broken internal links — all `baseurl` and `url` references in `_config.yml` updated to match the new domain
- HTTPS enforcement enabled in GitHub repo Pages settings

## Scope
### In
- Add `CNAME` file to repo root containing the chosen domain (e.g., `vaib.report` or `digest.example.com`)
- Update `_config.yml`: set `url` to `https://<custom-domain>` and `baseurl` to `""` (empty, since the site will be at the domain root)
- DNS configuration: add a CNAME record at the DNS provider pointing the chosen hostname to `chaosaigent.github.io`
- GitHub repo Settings → Pages → Custom domain field → enter domain → save
- Enable "Enforce HTTPS" toggle in GitHub Pages settings once the cert provisions (usually within minutes)
- Verify no hardcoded `chaosaigent.github.io/VaiBReport` links remain in templates or posts

### Out
- Email hosting or MX records on the same domain
- Subdirectory-based multi-site setup
- CDN layer (Cloudflare proxy, etc.) — out of scope for Phase 1; can be added later
- Purchasing the domain (that is Peter's action, not a code task)
- WWW redirect setup beyond what GitHub Pages provides natively

## Technical Spec

**CNAME file** (repo root):
```
<chosen-domain>
```
One line, no trailing slash, no `https://`. Example: `vaib.report` or `digest.peterw.dev`.

**`_config.yml` changes:**
```yaml
# Before
url: "https://chaosaigent.github.io"
baseurl: "/VaiBReport"

# After
url: "https://<chosen-domain>"
baseurl: ""
```

**DNS record** (at Peter's DNS provider):
```
Type:  CNAME
Host:  <subdomain or @>
Value: chaosaigent.github.io
TTL:   3600 (or provider default)
```
If using an apex domain (e.g., `vaib.report` with no subdomain), GitHub recommends four A records pointing to GitHub Pages IPs instead of a CNAME. If using a subdomain (e.g., `digest.example.com`), a CNAME to `chaosaigent.github.io` is correct.

**GitHub Pages settings** (manual step in UI):
1. Go to `github.com/chaosaigent/VaiBReport` → Settings → Pages
2. Under "Custom domain", enter the chosen domain and click Save
3. Wait for DNS check to pass (can take minutes to hours depending on DNS TTL)
4. Once the green checkmark appears, enable "Enforce HTTPS"

**Total engineering time once domain is chosen:** ~1 hour (15 min code changes, remainder is DNS propagation wait).

## Dependencies
- [BLOCKER] Peter must decide on a domain name — new purchase or subdomain of an existing property
- [BLOCKER] Peter must have DNS provider access to add the CNAME (or A records for apex domain)
- Domain must be purchased/registered before DNS can be configured
- GitHub Pages custom domain feature must remain available (it is free for public repos)

## Open Questions
- [TBD-PETER] What domain name should be used? Options: buy a new short domain (e.g., `vaib.report`, `vaib.dev`), or use a subdomain of an existing domain Peter owns.
- [TBD-PETER] Apex domain or subdomain? Apex (e.g., `vaib.report`) requires A records; subdomain (e.g., `digest.peterw.dev`) uses a CNAME — simpler setup.
- [TBD-PETER] Which DNS provider controls the chosen domain? (Namecheap, Cloudflare, Route53, etc.)
- [TBD-PETER] Should Cloudflare proxy be enabled from day one, or defer to a later infrastructure phase?
