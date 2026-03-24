---
layout: page
title: Peter's Picks
permalink: /picks/
---

<p style="color:#555;margin-bottom:1.5rem;">Tools I've personally reviewed, tested, and think are worth your time — curated for solo founders, small teams, and non-technical builders.</p>

<style>
  .picks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
  }
  .pick-card {
    border: 1px solid #e1e4e8;
    border-radius: 10px;
    padding: 1.1rem 1.2rem;
    background: #fff;
    transition: box-shadow 0.15s;
  }
  .pick-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .pick-card h3 { margin: 0 0 0.4rem; font-size: 1rem; }
  .pick-card h3 a { color: #24292f; text-decoration: none; }
  .pick-card h3 a:hover { color: #0969da; }
  .pick-hook {
    font-size: 0.88rem;
    color: #555;
    line-height: 1.5;
    margin: 0.4rem 0 0.75rem;
  }
  .pick-status {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.75rem;
  }
  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 600;
    border: 1.5px solid;
  }
  .status-on  { background: #dafbe1; border-color: #2da44e; color: #1a7f37; }
  .status-off { background: #f6f8fa; border-color: #d0d7de; color: #aaa; }
  .icp-chip {
    display: inline-block;
    padding: 1px 7px;
    border-radius: 8px;
    font-size: 0.68rem;
    font-weight: 500;
    background: #ddf4ff;
    border: 1px solid #54aeff;
    color: #0550ae;
    margin-right: 0.25rem;
  }
  .picks-empty {
    color: #888;
    font-style: italic;
    padding: 2rem 0;
  }
</style>

{% assign public_picks = site.tools | where: "public", true %}

{% if public_picks.size == 0 %}
<p class="picks-empty">Nothing here yet — check back soon.</p>
{% else %}
<p style="font-size:0.85rem;color:#888;margin-bottom:0.5rem;">{{ public_picks.size }} tool{% if public_picks.size != 1 %}s{% endif %} reviewed</p>
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
