---
layout: page
title: Leaderboard
permalink: /leaderboard/
---

<style>
  .lb-section { margin-bottom: 2.5rem; }
  .lb-section h2 { margin-bottom: 0.75rem; }
  .lb-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
  }
  .lb-table th {
    text-align: left;
    padding: 0.5rem 0.6rem;
    border-bottom: 2px solid #d0d7de;
    font-weight: 600;
    color: #555;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .lb-table td {
    padding: 0.45rem 0.6rem;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
  }
  .lb-table tr:hover td { background: #f6f8fa; }
  .lb-rank {
    font-weight: 700;
    color: #999;
    width: 2rem;
    text-align: center;
  }
  .lb-name a {
    font-weight: 600;
    color: #24292f;
    text-decoration: none;
  }
  .lb-name a:hover { color: #0969da; }
  .lb-badge {
    display: inline-block;
    padding: 1px 7px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    margin-left: 0.4rem;
    vertical-align: middle;
  }
  .bg-github { background: #6e7681; }
  .bg-huggingface-space, .bg-huggingface-model, .bg-huggingface-dataset { background: #f5a623; color: #333; }
  .bg-replicate { background: #3b82f6; }
  .bg-gitlab { background: #e24329; }
  .bg-npm { background: #cb3837; }
  .bg-pypi { background: #3572a5; }
  .bg-ollama { background: #22c55e; }
  .bg-paperswithcode { background: #14b8a6; }
  .bg-launch { background: #8b5cf6; }
  .lb-stat { font-variant-numeric: tabular-nums; }
  .lb-empty {
    color: #999;
    font-style: italic;
    padding: 1rem 0;
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
    slug: {{ repo.slug | jsonify }}
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
];

function badge(source) {
  const label = source.replace('huggingface-', 'HF ').replace('paperswithcode', 'PwC');
  return `<span class="lb-badge bg-${source}">${label}</span>`;
}

function link(item) {
  return `<a href="{{ '/repos/' | relative_url }}${item.slug}/">${item.name}</a>${badge(item.source)}`;
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
