---
layout: page
title: Peter's Picks
permalink: /picks/
---

<p style="font-size:0.78rem;color:var(--ink-dim);margin-bottom:1.5rem;line-height:1.55;">Tools I've personally reviewed, tested, and think are worth your time — curated for solo founders, small teams, and non-technical builders.</p>

<style>
  .picks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-top: 1.25rem;
  }
  .pick-card {
    padding: 1rem 1.1rem 1.1rem;
    background: var(--bg);
    transition: background 0.15s;
  }
  .pick-card:hover { background: var(--bg-raised); }
  .pick-card h3 {
    margin: 0 0 0.35rem;
    font-family: var(--font-disp);
    font-size: 0.88rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .pick-card h3 a { color: var(--ink); text-decoration: none; }
  .pick-card h3 a:hover { color: var(--ink-dim); }
  .pick-hook {
    font-size: 0.72rem;
    color: var(--ink-dim);
    line-height: 1.5;
    margin: 0.35rem 0 0.65rem;
  }
  .pick-status {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.65rem;
  }
  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 1px 7px;
    font-size: 0.6rem;
    font-family: var(--font-mono);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1px solid;
  }
  .status-on  { border-color: var(--ink); color: var(--ink); background: var(--accent-glow); }
  .status-off { border-color: var(--border); color: var(--ink-muted); background: transparent; }
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
    margin-right: 0.2rem;
    margin-bottom: 0.3rem;
  }
  .picks-empty {
    font-size: 0.7rem;
    color: var(--ink-muted);
    padding: 2rem 0;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: var(--font-mono);
  }
</style>

{% assign public_picks = site.tools | where: "public", true %}

{% if public_picks.size == 0 %}
<p class="picks-empty">Nothing here yet — check back soon.</p>
{% else %}
<p style="font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-muted);font-family:var(--font-mono);margin-bottom:0.5rem;">{{ public_picks.size }} tool{% if public_picks.size != 1 %}s{% endif %} reviewed</p>
<div class="picks-grid">
{% for tool in public_picks %}
  <div class="pick-card">
    <h3><a href="{{ tool.url | relative_url }}">{{ tool.name }}</a></h3>
    {% if tool.primary_icp and tool.primary_icp != "" %}
      <span class="icp-chip">{{ tool.primary_icp }}</span>
    {% endif %}
    {% if tool.hook and tool.hook != "" %}
      <p class="pick-hook">{{ tool.hook }}</p>
    {% elsif tool.one_liner and tool.one_liner != "" %}
      <p class="pick-hook">{{ tool.one_liner }}</p>
    {% endif %}
    <div class="pick-status">
      <span class="status-chip {% if tool.peters_pick %}status-on{% else %}status-off{% endif %}">
        {% if tool.peters_pick %}☑{% else %}☐{% endif %} Peter's Pick
      </span>
      <span class="status-chip {% if tool.create_content %}status-on{% else %}status-off{% endif %}">
        {% if tool.create_content %}☑{% else %}☐{% endif %} Create Content
      </span>
      <span class="status-chip {% if tool.content_created %}status-on{% else %}status-off{% endif %}">
        {% if tool.content_created %}☑{% else %}☐{% endif %} Content Created
      </span>
    </div>
  </div>
{% endfor %}
</div>
{% endif %}
