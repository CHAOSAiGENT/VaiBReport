---
layout: page
title: Leaderboard
permalink: /leaderboard/
---

<style>
  .lb-section { margin-bottom: 2.5rem; }
  .lb-section h2 {
    font-family: var(--font-disp);
    font-size: 1rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ink);
    margin-bottom: 0.5rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--border);
  }
  .lb-section > p {
    font-size: 0.72rem;
    color: var(--ink-muted);
    margin-bottom: 0.75rem;
    letter-spacing: 0.02em;
    font-family: var(--font-mono);
  }
  .lb-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75rem;
    font-family: var(--font-mono);
  }
  .lb-table th {
    text-align: left;
    padding: 0.4rem 0.6rem;
    border-bottom: 1px solid var(--ink);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }
  .lb-table td {
    padding: 0.4rem 0.6rem;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }
  .lb-table tr:hover td { background: var(--bg-raised); }
  .lb-rank {
    font-weight: 700;
    color: var(--ink-muted);
    width: 2.5rem;
    text-align: center;
    letter-spacing: 0.06em;
  }
  .lb-name a {
    font-family: var(--font-disp);
    font-size: 0.82rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ink);
    text-decoration: none;
  }
  .lb-name a:hover { color: var(--ink-dim); }
  .lb-badge {
    display: inline-block;
    padding: 1px 5px;
    font-size: 0.55rem;
    font-family: var(--font-mono);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid var(--border);
    color: var(--ink-muted);
    background: var(--bg-raised);
    margin-left: 0.4rem;
    vertical-align: middle;
  }
  /* Source accent: left border keeps brand identity */
  .bg-github         { border-left: 2px solid #6e7681; }
  .bg-huggingface-space, .bg-huggingface-model, .bg-huggingface-dataset { border-left: 2px solid #f5a623; }
  .bg-replicate      { border-left: 2px solid #3b82f6; }
  .bg-gitlab         { border-left: 2px solid #e24329; }
  .bg-npm            { border-left: 2px solid #cb3837; }
  .bg-pypi           { border-left: 2px solid #3572a5; }
  .bg-ollama         { border-left: 2px solid #22c55e; }
  .bg-paperswithcode { border-left: 2px solid #14b8a6; }
  .bg-launch         { border-left: 2px solid #8b5cf6; }
  .lb-stat {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
    color: var(--ink-dim);
  }
  .lb-empty {
    font-size: 0.7rem;
    color: var(--ink-muted);
    padding: 1.5rem 0;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-family: var(--font-mono);
  }
  @media (max-width: 600px) {
    .lb-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  }
</style>

<script>
const repoData = [
  {% for repo in site.repos %}
  {
    name: {{ repo.name | jsonify }},
    source: {{ repo.source | jsonify }},
    category: {{ repo.category | jsonify }},
    stars: {{ repo.stars | default: 0 }},
    downloads: {{ repo.downloads | default: 0 }},
    likes: {{ repo.likes | default: 0 }},
    streak: {{ repo.streak | default: 0 }},
    appearances: {{ repo.appearances | default: 0 }},
    times_featured: {{ repo.times_featured | default: 1 }},
    first_featured: {{ repo.first_featured | jsonify }},
    last_featured: {{ repo.last_featured | jsonify }},
    star_velocity: {{ repo.star_velocity | default: 0 }},
    slug: {{ repo.slug | jsonify }},
    url: "{{ repo.url }}"
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
];

function badge(source) {
  const label = source.replace('huggingface-', 'HF ').replace('paperswithcode', 'PwC');
  return `<span class="lb-badge bg-${source}">${label}</span>`;
}

function link(item) {
  const href = item.url || `{{ '/repos/' | relative_url }}${item.slug}/`;
  return `<a href="${href}">${item.name}</a>${badge(item.source)}`;
}

function renderTable(containerId, items, columns) {
  const el = document.getElementById(containerId);
  if (!items.length) {
    el.innerHTML = '<p class="lb-empty">No data yet — check back after a few days of data collection.</p>';
    return;
  }
  let html = '<div class="lb-table-wrap"><table class="lb-table"><thead><tr>';
  html += '<th>#</th>';
  for (const col of columns) html += `<th>${col.label}</th>`;
  html += '</tr></thead><tbody>';
  items.forEach((item, i) => {
    html += `<tr><td class="lb-rank">${i + 1}</td>`;
    for (const col of columns) html += `<td class="${col.cls || ''}">${col.render(item)}</td>`;
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  el.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hottest Right Now
  const hottest = repoData
    .filter(r => r.streak > 0)
    .sort((a, b) => b.streak - a.streak || b.appearances - a.appearances)
    .slice(0, 10);
  renderTable('hottest', hottest, [
    { label: 'Name', render: r => link(r), cls: 'lb-name' },
    { label: 'Streak', render: r => `🔥 ${r.streak} days`, cls: 'lb-stat' },
    { label: 'Last Featured', render: r => r.last_featured || '—' }
  ]);

  // 2. Rising Fast
  const rising = repoData
    .filter(r => r.star_velocity > 0)
    .sort((a, b) => b.star_velocity - a.star_velocity)
    .slice(0, 10);
  renderTable('rising', rising, [
    { label: 'Name', render: r => link(r), cls: 'lb-name' },
    { label: 'Velocity', render: r => `⚡ ${r.star_velocity}★/day`, cls: 'lb-stat' },
    { label: 'Stars', render: r => r.stars > 0 ? r.stars.toLocaleString() : '—', cls: 'lb-stat' }
  ]);

  // 3. Most Featured
  const mostFeatured = [...repoData]
    .sort((a, b) => b.times_featured - a.times_featured)
    .slice(0, 15);
  renderTable('most-featured', mostFeatured, [
    { label: 'Name', render: r => link(r), cls: 'lb-name' },
    { label: 'Featured', render: r => `${r.times_featured}×`, cls: 'lb-stat' },
    { label: 'First Seen', render: r => r.first_featured || '—' }
  ]);

  // 4. Most Appearances
  const mostAppearances = repoData
    .filter(r => r.appearances > 0)
    .sort((a, b) => b.appearances - a.appearances)
    .slice(0, 15);
  renderTable('most-appearances', mostAppearances, [
    { label: 'Name', render: r => link(r), cls: 'lb-name' },
    { label: 'Appearances', render: r => r.appearances.toLocaleString(), cls: 'lb-stat' },
    { label: 'Streak', render: r => r.streak > 0 ? `🔥 ${r.streak}` : '—', cls: 'lb-stat' }
  ]);

  // 5. Latest Discoveries
  const latest = [...repoData]
    .sort((a, b) => (b.first_featured || '').localeCompare(a.first_featured || ''))
    .slice(0, 10);
  renderTable('latest', latest, [
    { label: 'Name', render: r => link(r), cls: 'lb-name' },
    { label: 'Category', render: r => r.category || '—' },
    { label: 'First Seen', render: r => r.first_featured || '—' }
  ]);
});
</script>

<div class="lb-section">
<h2>🔥 Hottest Right Now</h2>
<p>Repos on the longest active streak — showing up in search results day after day.</p>
<div id="hottest"></div>
</div>

<div class="lb-section">
<h2>⚡ Rising Fast</h2>
<p>Repos gaining the most stars per day over the last week.</p>
<div id="rising"></div>
</div>

<div class="lb-section">
<h2>👑 Most Featured</h2>
<p>Items that have been selected for the daily digest the most times.</p>
<div id="most-featured"></div>
</div>

<div class="lb-section">
<h2>📈 Most Appearances</h2>
<p>Items that keep showing up in fetch results — a signal of sustained relevance.</p>
<div id="most-appearances"></div>
</div>

<div class="lb-section">
<h2>🆕 Latest Discoveries</h2>
<p>The most recently first-featured items in the catalog.</p>
<div id="latest"></div>
</div>
