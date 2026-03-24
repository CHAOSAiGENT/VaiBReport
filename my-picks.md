---
layout: page
title: My Picks (All)
permalink: /my-picks/
---

<p style="font-size:0.82rem;color:#888;margin-bottom:1.5rem;">Your full library — public and private. Not linked from public nav. <a href="{{ '/picks/' | relative_url }}">Public view →</a></p>

<style>
  .mgmt-table { width:100%; border-collapse:collapse; font-size:0.88rem; }
  .mgmt-table th {
    text-align:left; padding:0.5rem 0.6rem;
    border-bottom:2px solid #d0d7de;
    font-size:0.75rem; text-transform:uppercase;
    letter-spacing:0.3px; color:#555; font-weight:600;
  }
  .mgmt-table td { padding:0.5rem 0.6rem; border-bottom:1px solid #eee; vertical-align:middle; }
  .mgmt-table tr:hover td { background:#f6f8fa; }
  .status-chip {
    display:inline-flex; align-items:center; gap:0.25rem;
    padding:2px 7px; border-radius:10px;
    font-size:0.68rem; font-weight:600; border:1.5px solid;
    white-space:nowrap;
  }
  .status-on  { background:#dafbe1; border-color:#2da44e; color:#1a7f37; }
  .status-off { background:#f6f8fa; border-color:#d0d7de; color:#aaa; }
  .vis-badge {
    display:inline-block; padding:1px 7px; border-radius:8px;
    font-size:0.68rem; font-weight:600;
  }
  .vis-public  { background:#ddf4ff; border:1px solid #54aeff; color:#0550ae; }
  .vis-private { background:#f6f8fa; border:1px solid #d0d7de; color:#888; }
  .icp-chip {
    display:inline-block; padding:1px 7px; border-radius:8px;
    font-size:0.68rem; font-weight:500;
    background:#fff3cd; border:1px solid #e0c04a; color:#7a5700;
  }
  .tbl-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
</style>

{% assign all_picks = site.tools | sort: "date_added" | reverse %}

<p style="font-size:0.85rem;color:#888;margin-bottom:0.75rem;">
  {{ all_picks.size }} tool{% if all_picks.size != 1 %}s{% endif %} total ·
  {% assign public_count = site.tools | where: "public", true | size %}{{ public_count }} public ·
  {% assign content_done = site.tools | where: "content_created", true | size %}{{ content_done }} content created
</p>

{% if all_picks.size == 0 %}
<p style="color:#888;font-style:italic;">No picks yet. <a href="https://github.com/CHAOSAiGENT/VaiBReport/issues/new?template=peters-pick.yml">Submit your first one →</a></p>
{% else %}
<div class="tbl-wrap">
<table class="mgmt-table">
  <thead>
    <tr>
      <th>Tool</th>
      <th>ICP</th>
      <th>Peter's Pick</th>
      <th>Create Content</th>
      <th>Content Created</th>
      <th>Visibility</th>
      <th>Added</th>
    </tr>
  </thead>
  <tbody>
  {% for tool in all_picks %}
    <tr>
      <td><a href="{{ tool.url | relative_url }}" style="font-weight:600;color:#24292f;text-decoration:none;">{{ tool.name }}</a>
        {% if tool.hook and tool.hook != "" %}<br><span style="font-size:0.78rem;color:#888;">{{ tool.hook | truncate: 60 }}</span>{% endif %}
      </td>
      <td>{% if tool.primary_icp and tool.primary_icp != "" %}<span class="icp-chip">{{ tool.primary_icp }}</span>{% else %}—{% endif %}</td>
      <td><span class="status-chip {% if tool.peters_pick %}status-on{% else %}status-off{% endif %}">{% if tool.peters_pick %}☑{% else %}☐{% endif %} Pick</span></td>
      <td><span class="status-chip {% if tool.create_content %}status-on{% else %}status-off{% endif %}">{% if tool.create_content %}☑{% else %}☐{% endif %} Content</span></td>
      <td><span class="status-chip {% if tool.content_created %}status-on{% else %}status-off{% endif %}">{% if tool.content_created %}☑{% else %}☐{% endif %} Done</span></td>
      <td><span class="vis-badge {% if tool.public %}vis-public{% else %}vis-private{% endif %}">{% if tool.public %}public{% else %}private{% endif %}</span></td>
      <td style="white-space:nowrap;color:#888;">{{ tool.date_added }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
</div>
{% endif %}

<p style="margin-top:1.5rem;font-size:0.85rem;">
  <a href="https://github.com/CHAOSAiGENT/VaiBReport/issues/new?template=peters-pick.yml">+ Submit a new pick</a>
</p>
