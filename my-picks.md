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
    font-size:0.72rem; text-transform:uppercase;
    letter-spacing:0.3px; color:#555; font-weight:600;
  }
  .mgmt-table td { padding:0.5rem 0.6rem; border-bottom:1px solid #eee; vertical-align:middle; }
  .mgmt-table tr:hover td { background:#f6f8fa; }

  /* Status chips */
  .sc { display:inline-flex; align-items:center; gap:0.2rem; padding:2px 6px;
        border-radius:9px; font-size:0.67rem; font-weight:600; border:1.5px solid; white-space:nowrap; }
  .sc-on  { background:#dafbe1; border-color:#2da44e; color:#1a7f37; }
  .sc-off { background:#f6f8fa; border-color:#d0d7de; color:#bbb; }
  .sc-warn{ background:#fff3cd; border-color:#e0c04a; color:#7a5700; }

  /* Visibility badges */
  .vb { display:inline-block; padding:1px 7px; border-radius:8px; font-size:0.68rem; font-weight:600; }
  .vb-pub { background:#ddf4ff; border:1px solid #54aeff; color:#0550ae; }
  .vb-prv { background:#f6f8fa; border:1px solid #d0d7de; color:#888; }

  /* ICP chip */
  .icp { display:inline-block; padding:1px 7px; border-radius:8px;
         font-size:0.68rem; font-weight:500;
         background:#fff3cd; border:1px solid #e0c04a; color:#7a5700; }

  /* Ready badge */
  .ready-yes { display:inline-block; padding:2px 9px; border-radius:9px;
               background:#dafbe1; border:1.5px solid #2da44e; color:#1a7f37;
               font-size:0.72rem; font-weight:700; }
  .ready-no  { display:inline-block; padding:2px 9px; border-radius:9px;
               background:#f6f8fa; border:1.5px solid #d0d7de; color:#888;
               font-size:0.72rem; font-weight:600; }
  .ready-filmed { display:inline-block; padding:2px 9px; border-radius:9px;
               background:#dbedff; border:1.5px solid #4493f8; color:#0a69da;
               font-size:0.72rem; font-weight:700; }

  /* Progress bar */
  .prog-bar { display:inline-block; width:60px; height:7px; background:#eee;
              border-radius:4px; vertical-align:middle; margin-right:5px; overflow:hidden; }
  .prog-fill { height:100%; border-radius:4px; background:#2da44e; }

  .section-header { margin:1.8rem 0 0.6rem; font-size:0.82rem; font-weight:700;
                    color:#24292f; border-bottom:1px solid #d0d7de; padding-bottom:0.4rem; }
  .tbl-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }

  .stat-row { display:flex; gap:1.2rem; flex-wrap:wrap; margin:0.75rem 0 1.25rem;
              font-size:0.82rem; }
  .stat-item { color:#555; }
  .stat-item strong { color:#24292f; font-size:1.0rem; }

  .action-link { font-size:0.8rem; display:inline-block; margin-top:0.25rem;
                 color:#0550ae; text-decoration:none; }
  .action-link:hover { text-decoration:underline; }
</style>

{% assign all_picks = site.tools | sort: "date_added" | reverse %}
{% assign public_count = site.tools | where: "public", true | size %}
{% assign content_done = site.tools | where: "content_created", true | size %}

{% assign ready_count = 0 %}
{% for t in site.tools %}
  {% assign has_shots  = false %}{% if t.screenshot_desktop and t.screenshot_desktop != "" %}{% assign has_shots = true %}{% endif %}
  {% assign has_fa     = false %}{% if t.script_faceless and t.script_faceless != "" %}{% assign has_fa = true %}{% endif %}
  {% assign has_ugc    = false %}{% if t.script_ugc and t.script_ugc != "" %}{% assign has_ugc = true %}{% endif %}
  {% if has_shots and has_fa and has_ugc %}{% assign ready_count = ready_count | plus: 1 %}{% endif %}
{% endfor %}

<div class="stat-row">
  <span class="stat-item"><strong>{{ all_picks.size }}</strong> tools</span>
  <span class="stat-item"><strong>{{ public_count }}</strong> public</span>
  <span class="stat-item"><strong>{{ ready_count }}</strong> ready to film</span>
  <span class="stat-item"><strong>{{ content_done }}</strong> filmed / done</span>
</div>

{% if all_picks.size == 0 %}
<p style="color:#888;font-style:italic;">No picks yet. <a href="https://github.com/CHAOSAiGENT/VaiBReport/issues/new?template=peters-pick.yml">Submit your first one →</a></p>
{% else %}

<p class="section-header">Pipeline status</p>
<div class="tbl-wrap">
<table class="mgmt-table">
  <thead>
    <tr>
      <th>Tool</th>
      <th>ICP</th>
      <th>Shot</th>
      <th>Use cases</th>
      <th>Script A</th>
      <th>Script B</th>
      <th>Progress</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
  {% for tool in all_picks %}
    {% assign has_desktop = false %}{% if tool.screenshot_desktop and tool.screenshot_desktop != "" %}{% assign has_desktop = true %}{% endif %}
    {% assign has_mobile  = false %}{% if tool.screenshot_mobile  and tool.screenshot_mobile  != "" %}{% assign has_mobile = true %}{% endif %}
    {% assign has_cases   = false %}{% if tool.use_cases.size > 0 %}{% assign has_cases = true %}{% endif %}
    {% assign has_fa      = false %}{% if tool.script_faceless and tool.script_faceless != "" %}{% assign has_fa = true %}{% endif %}
    {% assign has_ugc     = false %}{% if tool.script_ugc     and tool.script_ugc     != "" %}{% assign has_ugc = true %}{% endif %}

    {% assign steps_done = 0 %}
    {% if has_desktop %}{% assign steps_done = steps_done | plus: 1 %}{% endif %}
    {% if has_cases   %}{% assign steps_done = steps_done | plus: 1 %}{% endif %}
    {% if has_fa      %}{% assign steps_done = steps_done | plus: 1 %}{% endif %}
    {% if has_ugc     %}{% assign steps_done = steps_done | plus: 1 %}{% endif %}
    {% assign steps_total = 4 %}
    {% assign pct = steps_done | times: 100 | divided_by: steps_total %}

    {% assign ready = false %}
    {% if has_desktop and has_fa and has_ugc %}{% assign ready = true %}{% endif %}
    <tr>
      <td>
        <a href="{{ tool.url }}" target="_blank" style="font-weight:600;color:#24292f;text-decoration:none;">{{ tool.name }}</a>
        {% if tool.hook and tool.hook != "" %}<br><span style="font-size:0.76rem;color:#888;">{{ tool.hook | truncate: 55 }}</span>{% endif %}
        <br>
        <a class="action-link" href="https://github.com/CHAOSAiGENT/VaiBReport/actions/workflows/generate-tool-page.yml">run scripts</a> ·
        <a class="action-link" href="https://github.com/CHAOSAiGENT/VaiBReport/actions/workflows/capture-tool-screenshots.yml">run shots</a>
      </td>
      <td>{% if tool.primary_icp and tool.primary_icp != "" %}<span class="icp">{{ tool.primary_icp }}</span>{% else %}—{% endif %}</td>
      <td>
        <span class="sc {% if has_desktop %}sc-on{% else %}sc-off{% endif %}">{% if has_desktop %}☑{% else %}☐{% endif %} desk</span>
        <span class="sc {% if has_mobile %}sc-on{% else %}sc-off{% endif %}">{% if has_mobile %}☑{% else %}☐{% endif %} mob</span>
      </td>
      <td><span class="sc {% if has_cases %}sc-on{% else %}sc-off{% endif %}">{% if has_cases %}☑ {{ tool.use_cases.size }}{% else %}☐ 0{% endif %}</span></td>
      <td><span class="sc {% if has_fa %}sc-on{% else %}sc-off{% endif %}">{% if has_fa %}☑{% else %}☐{% endif %} faceless</span></td>
      <td><span class="sc {% if has_ugc %}sc-on{% else %}sc-off{% endif %}">{% if has_ugc %}☑{% else %}☐{% endif %} UGC</span></td>
      <td>
        <span class="prog-bar"><span class="prog-fill" style="width:{{ pct }}%"></span></span>
        <span style="font-size:0.72rem;color:#888;">{{ steps_done }}/{{ steps_total }}</span>
      </td>
      <td>
        {% if tool.content_created %}<span class="ready-filmed">filmed</span>
        {% elsif ready %}<span class="ready-yes">ready</span>
        {% else %}<span class="ready-no">{{ steps_total | minus: steps_done }} left</span>
        {% endif %}
      </td>
    </tr>
  {% endfor %}
  </tbody>
</table>
</div>

<p class="section-header">Flags & visibility</p>
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
      <td><a href="{{ tool.url }}" target="_blank" style="font-weight:600;color:#24292f;text-decoration:none;">{{ tool.name }}</a></td>
      <td>{% if tool.primary_icp and tool.primary_icp != "" %}<span class="icp">{{ tool.primary_icp }}</span>{% else %}—{% endif %}</td>
      <td><span class="sc {% if tool.peters_pick %}sc-on{% else %}sc-off{% endif %}">{% if tool.peters_pick %}☑{% else %}☐{% endif %} Pick</span></td>
      <td><span class="sc {% if tool.create_content %}sc-on{% else %}sc-off{% endif %}">{% if tool.create_content %}☑{% else %}☐{% endif %} Content</span></td>
      <td><span class="sc {% if tool.content_created %}sc-on{% else %}sc-off{% endif %}">{% if tool.content_created %}☑{% else %}☐{% endif %} Done</span></td>
      <td><span class="vb {% if tool.public %}vb-pub{% else %}vb-prv{% endif %}">{% if tool.public %}public{% else %}private{% endif %}</span></td>
      <td style="white-space:nowrap;color:#888;">{{ tool.date_added }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
</div>

{% endif %}

<p style="margin-top:1.5rem;font-size:0.85rem;">
  <a href="https://github.com/CHAOSAiGENT/VaiBReport/issues/new?template=peters-pick.yml">+ Submit a new pick</a> ·
  <a href="{{ '/picks/' | relative_url }}">Public picks page →</a>
</p>
