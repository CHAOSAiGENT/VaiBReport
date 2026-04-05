---
layout: page
title: Research
permalink: /research/
---

<style>
  .research-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-top: 1rem;
  }
  .research-card {
    padding: 1rem;
    text-decoration: none;
    color: var(--ink);
    display: block;
    background: var(--bg);
    transition: background 0.15s;
  }
  .research-card:hover { background: var(--bg-raised); text-decoration: none; }
  .rc-title {
    font-family: var(--font-disp);
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ink);
    margin-bottom: 0.4rem;
  }
  .rc-meta {
    font-size: 0.65rem;
    font-family: var(--font-mono);
    color: var(--ink-muted);
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    align-items: center;
    letter-spacing: 0.04em;
  }
  .depth-badge {
    display: inline-block;
    padding: 1px 6px;
    font-size: 0.6rem;
    font-family: var(--font-mono);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid var(--border);
    border-left: 2px solid var(--ink);
    color: var(--ink-dim);
    background: var(--bg-raised);
  }
  .icp-chip {
    display: inline-block;
    padding: 1px 6px;
    font-size: 0.6rem;
    font-family: var(--font-mono);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid var(--border);
    color: var(--ink-muted);
    background: var(--bg-raised);
  }
  .new-btn {
    display: inline-block;
    margin-bottom: 1.25rem;
    padding: 0.4rem 1rem;
    background: none;
    border: 1px solid var(--ink);
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    transition: background 0.1s, color 0.1s;
  }
  .new-btn:hover { background: var(--ink); color: var(--bg); text-decoration: none; }
</style>

<a class="new-btn" href="https://github.com/CHAOSAiGENT/VaiBReport/issues/new?template=research-request.yml">+ New research request</a>

{% assign all_research = site.research | sort: "date_added" | reverse %}
{% assign public_research = all_research | where: "public", true %}

{% if public_research.size == 0 %}
<p style="color:#888;font-style:italic;">No public research reports yet.</p>
{% else %}
<div class="research-grid">
{% for report in public_research %}
  <a href="{{ report.url }}" class="research-card">
    <div class="rc-title">{{ report.title }}</div>
    <div class="rc-meta">
      <span>{{ report.date_added }}</span>
      <span class="depth-badge">{{ report.depth }}</span>
      {% for icp in report.icps limit: 2 %}
        <span class="icp-chip">{{ icp }}</span>
      {% endfor %}
    </div>
  </a>
{% endfor %}
</div>
{% endif %}
