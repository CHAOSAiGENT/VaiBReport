# How to Submit a Peter's Pick

**Last updated:** 2026-03-24

Submitting a tool takes about 2 minutes. The rest is automatic.

---

## Step 1 — Open a new issue

Go to:
```
https://github.com/CHAOSAiGENT/VaiBReport/issues/new/choose
```

You'll see one option: **"🛠 Peter's Pick — Submit a Tool"**. Click it.

> On mobile: open the GitHub app → CHAOSAiGENT/VaiBReport → Issues → New Issue

---

## Step 2 — Fill in the form

| Field | Required | Notes |
|-------|----------|-------|
| **Tool URL** | ✅ | Product homepage, GitHub repo, or demo — wherever you'd send someone first |
| **Tool Name** | ✅ | What you call it. This becomes the slug (`coolify` → `/picks/coolify/`) |
| **Your Hook** | ✅ | One sentence. Why did you find this interesting? What pain does it solve? This becomes your content hook. |
| **Primary ICP** | ✅ | Pick from the dropdown — who is this MOST useful for? |
| **Also relevant for** | ☐ | Check any other personas that apply |
| **Compare to** | ☐ | What does this compete with or replace? e.g. "vs. Vercel, vs. Railway" |
| **Honest take** | ☐ | What doesn't it do well? Who should NOT use it? |
| **Add to Peter's Picks public page?** | ✅ | `yes` = shows on public `/picks/` page. `no` = private library only. `later` = draft. |

---

## Step 3 — Submit

Click **"Submit new issue"**. That's it on your end.

---

## What happens automatically

Within ~60 seconds:

1. **Workflow fires** — `parse-submission.yml` detects the `peters-pick` label (auto-applied by the template)
2. **Tool entry created** — a new file is committed to `_tools/{slug}.md` with:
   - All your form data in frontmatter
   - ☑ **Peter's Pick** — checked (always true for submissions)
   - ☑ **Create Content** — checked (always true — all picks are content candidates)
   - ☐ **Content Created** — unchecked (you flip this when you've filmed/posted)
3. **Issue auto-closed** — with a comment showing the file path and next steps

---

## What you'll see in the issue comment

```
✅ Tool entry created: _tools/coolify.md

Next steps queued:
- 📸 Screenshot capture (run capture-tool-screenshots workflow with slug: coolify)
- 🤖 Script generation (run generate-tool-page workflow with slug: coolify)

View file on GitHub → [link]
```

---

## After submission — the content workflow

Once the tool entry exists, the enrichment workflows handle the rest (these are built in phases — see `me2/EXTENSIONS.md`):

| Step | How | Status |
|------|-----|--------|
| Screenshots captured | Run `capture-tool-screenshots` workflow with the slug | 🔜 Coming in E-03 |
| Video scripts generated | Run `generate-tool-page` workflow with the slug | 🔜 Coming in E-04 |
| Review + edit | Edit `_tools/{slug}.md` directly in GitHub or locally | Always available |
| Mark content done | Set `content_created: true` in the frontmatter | Manual for now |
| Make it public | Set `public: true` in the frontmatter | Manual for now |

---

## Updating a tool entry after submission

Edit `_tools/{slug}.md` directly:

- **GitHub web UI**: `github.com/CHAOSAiGENT/VaiBReport/blob/main/_tools/{slug}.md` → pencil icon
- **Locally**: open the file in any editor, edit, commit, push
- **Key fields to update over time**:
  - `content_created: true` — when you've filmed or published content
  - `public: true` — when you want it on the public `/picks/` page
  - `script_faceless` / `script_ugc` — paste in generated or edited scripts
  - `honest_take`, `compare_to` — refine after you've dug deeper

---

## Viewing your library

| View | URL | Shows |
|------|-----|-------|
| **Public Picks** | `/VaiBReport/picks/` | Tools marked `public: true` only |
| **My Picks (all)** | `/VaiBReport/my-picks/` | All tools, public + private, with status table |
| **Individual tool** | `/VaiBReport/picks/{slug}/` | Full detail page with scripts, screenshots, ICP notes |

Bookmark `/my-picks/` — that's your management dashboard.

---

## The status checkboxes

Every tool shows three status chips on both the card and detail page:

| Chip | What it means | Set by |
|------|--------------|--------|
| **☑ Peter's Pick** | You reviewed and endorsed this | Always true on submission |
| **☑ Create Content** | This is queued for content creation | Always true on submission |
| **☑ Content Created** | Content has been filmed/published | You flip manually |

To mark content as created: edit the tool's `.md` file and change `content_created: false` to `content_created: true`.

---

## Notes

- The `peters-pick` label (green) triggers the workflow. Don't remove it from an open issue.
- If the workflow fails (check Actions tab), you can re-run it or create `_tools/{slug}.md` manually using the schema in `me2/EXTENSIONS.md` E-02.
- Slug is derived from the Tool Name field. Keep names short and clean — "Coolify" not "Coolify - The Open Source Cloud Platform".
