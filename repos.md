---
layout: page
title: Catalog
permalink: /repos/
---

<style>
  .catalog-controls { margin-bottom: 1.5rem; }

  .catalog-search {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    font-size: 0.75rem;
    font-family: var(--font-mono);
    letter-spacing: 0.04em;
    background: rgba(224, 228, 239, 0.04);
    color: var(--ink);
    margin-bottom: 0.75rem;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;
  }
  .catalog-search:focus { border-color: var(--ink); }
  .catalog-search::placeholder { color: var(--ink-muted); text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.08em; }
  [data-theme="light"] .catalog-search { background: rgba(18, 19, 26, 0.04); }

  .catalog-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .catalog-row label {
    font-size: 0.58rem;
    font-weight: 700;
    font-family: var(--font-mono);
    letter-spacing: 0.12em;
    color: var(--ink-muted);
    text-transform: uppercase;
    margin-right: 0.2rem;
  }

  .catalog-sort {
    padding: 0.3rem 0.5rem;
    border: 1px solid var(--border);
    font-size: 0.68rem;
    font-family: var(--font-mono);
    letter-spacing: 0.04em;
    background: var(--bg);
    color: var(--ink);
    text-transform: uppercase;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .catalog-sort:hover { border-color: var(--ink); }

  .chip {
    display: inline-block;
    padding: 2px 8px;
    font-size: 0.58rem;
    font-family: var(--font-mono);
    font-weight: 700;
    letter-spacing: 0.08em;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--ink-muted);
    text-transform: uppercase;
    transition: all 0.1s;
  }
  .chip:hover { border-color: var(--ink-dim); color: var(--ink); }
  .chip.active { background: var(--ink); color: var(--bg); border-color: var(--ink); }

  .result-count {
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    color: var(--ink-muted);
    text-transform: uppercase;
    font-family: var(--font-mono);
    margin-bottom: 0.75rem;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }
  @media (max-width: 900px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .card-grid { grid-template-columns: 1fr; } }

  .card {
    background: var(--bg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: background 0.15s;
  }
  .card:hover { background: var(--bg-raised); }

  .card-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    opacity: 0.65;
    filter: grayscale(25%);
    border-bottom: 1px solid var(--border);
  }
  .card-placeholder {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-dim);
    background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
    background-size: 12px 12px;
  }

  .card-body {
    padding: 0.75rem 0.9rem 0.9rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.3rem;
    gap: 0.5rem;
  }
  .card-name {
    font-family: var(--font-disp);
    font-size: 0.82rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ink);
    text-decoration: none;
    line-height: 1.2;
    flex: 1;
  }
  .card-name:hover { color: var(--ink-dim); }

  .card-source {
    display: inline-block;
    padding: 1px 5px;
    font-size: 0.55rem;
    font-family: var(--font-mono);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
    border: 1px solid var(--border);
    color: var(--ink-muted);
    background: var(--bg-raised);
  }
  /* Source accent: left border keeps brand identity */
  .src-github         { border-left: 2px solid #6e7681; }
  .src-huggingface-space, .src-huggingface-model, .src-huggingface-dataset { border-left: 2px solid #f5a623; }
  .src-replicate      { border-left: 2px solid #3b82f6; }
  .src-gitlab         { border-left: 2px solid #e24329; }
  .src-npm            { border-left: 2px solid #cb3837; }
  .src-pypi           { border-left: 2px solid #3572a5; }
  .src-ollama         { border-left: 2px solid #22c55e; }
  .src-paperswithcode { border-left: 2px solid #14b8a6; }
  .src-launch         { border-left: 2px solid #8b5cf6; }

  .card-desc {
    font-size: 0.72rem;
    color: var(--ink-dim);
    line-height: 1.45;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }
  .card-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    font-size: 0.62rem;
    font-family: var(--font-mono);
    color: var(--ink-muted);
    align-items: center;
  }
  .card-stats .lang-pill  { border: 1px solid var(--border); padding: 0 5px; }
  .card-stats .cat-pill   { border: 1px solid var(--border); padding: 0 5px; color: var(--ink-dim); }
  .card-stats .streak-badge { border: 1px solid var(--border); padding: 0 5px; color: var(--ink); }

  .card-date {
    font-size: 0.58rem;
    letter-spacing: 0.06em;
    color: var(--ink-muted);
    text-transform: uppercase;
    font-family: var(--font-mono);
    margin-top: 0.35rem;
  }

  /* All placeholder types use the same terminal dot-pattern */
  .placeholder-github, .placeholder-huggingface-space, .placeholder-huggingface-model,
  .placeholder-huggingface-dataset, .placeholder-replicate, .placeholder-gitlab,
  .placeholder-npm, .placeholder-pypi, .placeholder-ollama,
  .placeholder-paperswithcode, .placeholder-launch {
    background: var(--bg-dim);
    background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
    background-size: 12px 12px;
  }
</style>

<div class="catalog-controls">
  <input type="text" class="catalog-search" id="searchInput" placeholder="Search repos, models, packages...">
  <div class="catalog-row">
    <label>Sort:</label>
    <select class="catalog-sort" id="sortSelect">
      <option value="last_featured">Recently featured</option>
      <option value="stars">Most starred</option>
      <option value="downloads">Most downloaded</option>
      <option value="streak">Hottest streak</option>
      <option value="name">Alphabetical</option>
      <option value="first_featured">Oldest first</option>
    </select>
  </div>
  <div class="catalog-row">
    <label>Source:</label>
    <span class="chip active" data-filter="source" data-value="all">All</span>
    <span class="chip" data-filter="source" data-value="github">GitHub</span>
    <span class="chip" data-filter="source" data-value="huggingface">HuggingFace</span>
    <span class="chip" data-filter="source" data-value="replicate">Replicate</span>
    <span class="chip" data-filter="source" data-value="gitlab">GitLab</span>
    <span class="chip" data-filter="source" data-value="npm">npm</span>
    <span class="chip" data-filter="source" data-value="pypi">PyPI</span>
    <span class="chip" data-filter="source" data-value="ollama">Ollama</span>
    <span class="chip" data-filter="source" data-value="paperswithcode">Papers</span>
    <span class="chip" data-filter="source" data-value="launch">Launches</span>
  </div>
  <div class="catalog-row">
    <label>Category:</label>
    <span class="chip active" data-filter="category" data-value="all">All</span>
    <span class="chip" data-filter="category" data-value="SaaS starters and templates">SaaS starters</span>
    <span class="chip" data-filter="category" data-value="AI agents, LLM infra and RAG">AI/LLM</span>
    <span class="chip" data-filter="category" data-value="Ops, analytics and automation">Ops/analytics</span>
    <span class="chip" data-filter="category" data-value="Marketing, sales and GTM tools">Marketing/GTM</span>
    <span class="chip" data-filter="category" data-value="UGC, social media and creator tools">UGC/creator</span>
    <span class="chip" data-filter="category" data-value="Trending">Trending</span>
  </div>
  <div class="catalog-row">
    <label>For:</label>
    <span class="chip active" data-filter="icp" data-value="all">All</span>
    <span class="chip" data-filter="icp" data-value="founding-team">Founding team</span>
    <span class="chip" data-filter="icp" data-value="solopreneur">Solopreneur</span>
    <span class="chip" data-filter="icp" data-value="small-business">Small business</span>
    <span class="chip" data-filter="icp" data-value="pre-mvp">Pre-MVP</span>
    <span class="chip" data-filter="icp" data-value="entreprecurious">Entreprecurious</span>
    <span class="chip" data-filter="icp" data-value="non-technical">Non-technical</span>
  </div>
{%- if jekyll.environment == "compare_to_live" -%}
  <div class="catalog-row">
    <label>Replaces:</label>
    <span class="chip active" data-filter="replaces" data-value="all">All</span>
    <span id="replacesChips" style="display:contents;"></span>
  </div>
{%- endif -%}
</div>

<div class="result-count" id="resultCount"></div>
<div class="card-grid" id="cardGrid"></div>

<script>
const repoData = [
  {% for repo in site.repos %}
  {
    slug: {{ repo.slug | jsonify }},
    name: {{ repo.name | jsonify }},
    source: {{ repo.source | jsonify }},
    item_url: {{ repo.item_url | jsonify }},
    description: {{ repo.description | jsonify }},
    category: {{ repo.category | jsonify }},
    language: {{ repo.language | jsonify }},
    stars: {{ repo.stars | default: 0 }},
    downloads: {{ repo.downloads | default: 0 }},
    likes: {{ repo.likes | default: 0 }},
    og_image: {{ repo.og_image | jsonify }},
    first_featured: {{ repo.first_featured | jsonify }},
    last_featured: {{ repo.last_featured | jsonify }},
    times_featured: {{ repo.times_featured | default: 1 }},
    streak: {{ repo.streak | default: 0 }},
    appearances: {{ repo.appearances | default: 0 }},
    tags: {{ repo.tags | jsonify }},
    icp_tags: {{ repo.icp_tags | jsonify }},
    replaces: {{ repo.replaces | default: empty | jsonify }},
    page_url: "{{ repo.url }}"
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
];

const sourceColors = {
  'github': '#6e7681', 'huggingface-space': '#f5a623', 'huggingface-model': '#f5a623',
  'huggingface-dataset': '#f5a623', 'replicate': '#3b82f6', 'gitlab': '#e24329',
  'npm': '#cb3837', 'pypi': '#3572a5', 'ollama': '#22c55e',
  'paperswithcode': '#14b8a6', 'launch': '#8b5cf6'
};

const sourceIcons = {
  'github': '🐙', 'huggingface-space': '🤗', 'huggingface-model': '🧠',
  'huggingface-dataset': '📊', 'replicate': '🔄', 'gitlab': '🦊',
  'npm': '📦', 'pypi': '🐍', 'ollama': '🦙',
  'paperswithcode': '📄', 'launch': '🚀'
};

let activeSource = 'all';
let activeCategory = 'all';
let activeIcp = 'all';
let activeReplaces = 'all';
let searchQuery = '';
let sortBy = 'last_featured';

function matchesSource(item, filter) {
  if (filter === 'all') return true;
  if (filter === 'huggingface') return item.source.startsWith('huggingface');
  return item.source === filter;
}

function getSearchText(item) {
  return [item.name, item.description, item.category, item.language, item.source, ...(item.tags || []), ...(item.icp_tags || [])].join(' ').toLowerCase();
}

function sortItems(items) {
  const copy = [...items];
  switch (sortBy) {
    case 'stars': return copy.sort((a, b) => b.stars - a.stars);
    case 'downloads': return copy.sort((a, b) => b.downloads - a.downloads);
    case 'streak': return copy.sort((a, b) => b.streak - a.streak);
    case 'name': return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'first_featured': return copy.sort((a, b) => (a.first_featured || '').localeCompare(b.first_featured || ''));
    default: return copy.sort((a, b) => (b.last_featured || '').localeCompare(a.last_featured || ''));
  }
}

function renderCards() {
  let filtered = repoData.filter(item => {
    if (!matchesSource(item, activeSource)) return false;
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (activeIcp !== 'all' && !(item.icp_tags || []).includes(activeIcp)) return false;
    if (activeReplaces !== 'all') {
      const names = (item.replaces || []).map(r => r.name);
      if (!names.includes(activeReplaces)) return false;
    }
    if (searchQuery && !getSearchText(item).includes(searchQuery)) return false;
    return true;
  });
  filtered = sortItems(filtered);

  document.getElementById('resultCount').textContent = `Showing ${filtered.length} of ${repoData.length} items`;

  const grid = document.getElementById('cardGrid');
  grid.innerHTML = filtered.map(item => {
    const srcClass = 'src-' + item.source;
    const placeholderClass = 'placeholder-' + item.source;
    const icon = sourceIcons[item.source] || '📁';
    const imgHtml = item.og_image
      ? `<img class="card-img" src="${item.og_image}" alt="${item.name}" loading="lazy" onerror="this.outerHTML='<div class=\\'card-placeholder ${placeholderClass}\\'>${icon}</div>'">`
      : `<div class="card-placeholder ${placeholderClass}">${icon}</div>`;

    const mainStat = item.stars > 0 ? `⭐ ${item.stars.toLocaleString()}`
      : item.downloads > 0 ? `📦 ${item.downloads.toLocaleString()}`
      : item.likes > 0 ? `❤️ ${item.likes}` : '';

    const streakHtml = item.streak > 3 ? `<span class="streak-badge">🔥 ${item.streak}-day</span>` : '';
    const langHtml = item.language ? `<span class="lang-pill">${item.language}</span>` : '';
    const catHtml = item.category ? `<span class="cat-pill">${item.category.split(',')[0].split(' and ')[0]}</span>` : '';

    const pageUrl = `{{ '/repos/' | relative_url }}${item.slug}/`;

    return `<div class="card">
      ${imgHtml}
      <div class="card-body">
        <div class="card-top">
          <a href="${pageUrl}" class="card-name">${item.name}</a>
          <span class="card-source ${srcClass}">${item.source.replace('huggingface-', 'HF ').replace('paperswithcode', 'PwC')}</span>
        </div>
        <div class="card-desc">${item.description || ''}</div>
        <div class="card-stats">
          ${mainStat ? `<span>${mainStat}</span>` : ''}
          ${langHtml}${catHtml}${streakHtml}
        </div>
        <div class="card-date">First seen: ${item.first_featured || 'unknown'}</div>
      </div>
    </div>`;
  }).join('');
}

// Event listeners
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function(e) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderCards();
  }, 200);
});

document.getElementById('sortSelect').addEventListener('change', function(e) {
  sortBy = e.target.value;
  renderCards();
});

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function() {
    const filterType = this.dataset.filter;
    const value = this.dataset.value;
    if (filterType === 'source') activeSource = value;
    if (filterType === 'category') activeCategory = value;
    if (filterType === 'icp') activeIcp = value;
    document.querySelectorAll(`.chip[data-filter="${filterType}"]`).forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    renderCards();
  });
});

{% if jekyll.environment == "compare_to_live" %}
// Compute top-12 replaces names client-side from repoData.
// Use safe DOM APIs (no innerHTML) since names come from LLM output.
const nameCounts = new Map();
for (const item of repoData) {
  for (const r of (item.replaces || [])) {
    nameCounts.set(r.name, (nameCounts.get(r.name) || 0) + 1);
  }
}
const top12 = [...nameCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
const chipContainer = document.getElementById('replacesChips');
if (chipContainer) {
  for (const [name] of top12) {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.dataset.filter = 'replaces';
    chip.dataset.value = name;
    chip.textContent = name;
    chip.addEventListener('click', function() {
      activeReplaces = this.dataset.value;
      document.querySelectorAll('.chip[data-filter="replaces"]').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      renderCards();
    });
    chipContainer.appendChild(chip);
  }
  const allChip = document.querySelector('.chip[data-filter="replaces"][data-value="all"]');
  if (allChip) {
    allChip.addEventListener('click', function() {
      activeReplaces = 'all';
      document.querySelectorAll('.chip[data-filter="replaces"]').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      renderCards();
    });
  }
}
{% endif %}

renderCards();
</script>
