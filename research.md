---
layout: page
title: Research
permalink: /research/
---

<style>
  .research-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem; }
  .research-card {
    border: 1px solid #d0d7de; border-radius: 8px; padding: 1rem;
    text-decoration: none; color: inherit; display: block;
    transition: box-shadow 0.15s;
  }
  .research-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-decoration: none; }
  .rc-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.4rem; color: #24292f; }
  .rc-meta { font-size: 0.75rem; color: #888; display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center; }
  .depth-badge { display: inline-block; padding: 1px 7px; border-radius: 7px; font-size: 0.68rem; font-weight: 600; background: #ddf4ff; border: 1px solid #54aeff; color: #0550ae; }
  .icp-chip { display: inline-block; padding: 1px 6px; border-radius: 7px; font-size: 0.65rem; font-weight: 500; background: #fff3cd; border: 1px solid #e0c04a; color: #7a5700; }
  .new-btn { display: inline-block; margin-bottom: 1.25rem; padding: 0.45rem 1rem; background: #2da44e; color: #fff; border-radius: 7px; font-size: 0.88rem; font-weight: 600; text-decoration: none; }
  .new-btn:hover { background: #218838; text-decoration: none; color: #fff; }
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
