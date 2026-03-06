---
layout: page
title: Catalog
permalink: /repos/
---

<style>
  .catalog-controls {
    margin-bottom: 1.5rem;
  }
  .catalog-search {
    width: 100%;
    padding: 0.6rem 1rem;
    border: 1px solid #d0d7de;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 0.75rem;
    box-sizing: border-box;
  }
  .catalog-search:focus {
    outline: none;
    border-color: #0969da;
    box-shadow: 0 0 0 3px rgba(9,105,218,0.15);
  }
  .catalog-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .catalog-row label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #666;
    margin-right: 0.25rem;
  }
  .catalog-sort {
    padding: 0.4rem 0.6rem;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    font-size: 0.85rem;
    background: #fff;
  }
  .chip {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #d0d7de;
    background: #fff;
    color: #333;
    transition: all 0.15s;
  }
  .chip:hover { background: #f3f4f6; }
  .chip.active { background: #24292f; color: #fff; border-color: #24292f; }
  .result-count {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 0.75rem;
  }
  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
  @media (max-width: 900px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .card-grid { grid-template-columns: 1fr; } }
  .card {
    background: #fff;
    border: 1px solid #e1e4e8;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    transition: transform 0.15s, box-shadow 0.15s;
    display: flex;
    flex-direction: column;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .card-img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    background: #f6f8fa;
  }
  .card-placeholder {
    width: 100%;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
  }
  .card-body {
    padding: 0.75rem 1rem 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.35rem;
  }
  .card-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: #24292f;
    text-decoration: none;
    line-height: 1.3;
    flex: 1;
    margin-right: 0.5rem;
  }
  .card-name:hover { color: #0969da; }
  .card-source {
    display: inline-block;
    padding: 1px 7px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .card-desc {
    font-size: 0.8rem;
    color: #555;
    line-height: 1.4;
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
    gap: 0.5rem;
    font-size: 0.72rem;
    color: #666;
    align-items: center;
  }
  .card-stats .lang-pill {
    background: #e1e4e8;
    padding: 1px 6px;
    border-radius: 6px;
    font-weight: 500;
  }
  .card-stats .cat-pill {
    background: #dbeafe;
    padding: 1px 6px;
    border-radius: 6px;
    color: #1e40af;
  }
  .card-stats .streak-badge {
    background: #fef3c7;
    padding: 1px 6px;
    border-radius: 6px;
  }
  .card-date {
    font-size: 0.68rem;
    color: #999;
    margin-top: 0.35rem;
  }
  .src-github { background: #6e7681; }
  .src-huggingface-space, .src-huggingface-model, .src-huggingface-dataset { background: #f5a623; color: #333; }
  .src-replicate { background: #3b82f6; }
  .src-gitlab { background: #e24329; }
  .src-npm { background: #cb3837; }
  .src-pypi { background: #3572a5; }
  .src-ollama { background: #22c55e; }
  .src-paperswithcode { background: #14b8a6; }
  .src-launch { background: #8b5cf6; }

  .placeholder-github { background: linear-gradient(135deg, #24292f, #6e7681); }
  .placeholder-huggingface-space, .placeholder-huggingface-model, .placeholder-huggingface-dataset { background: linear-gradient(135deg, #f5a623, #fcd34d); }
  .placeholder-replicate { background: linear-gradient(135deg, #2563eb, #60a5fa); }
  .placeholder-gitlab { background: linear-gradient(135deg, #e24329, #fca326); }
  .placeholder-npm { background: linear-gradient(135deg, #cb3837, #fb7185); }
  .placeholder-pypi { background: linear-gradient(135deg, #3572a5, #60a5fa); }
  .placeholder-ollama { background: linear-gradient(135deg, #16a34a, #86efac); }
  .placeholder-paperswithcode { background: linear-gradient(135deg, #0d9488, #5eead4); }
  .placeholder-launch { background: linear-gradient(135deg, #7c3aed, #c4b5fd); }
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
let searchQuery = '';
let sortBy = 'last_featured';

function matchesSource(item, filter) {
  if (filter === 'all') return true;
  if (filter === 'huggingface') return item.source.startsWith('huggingface');
  return item.source === filter;
}

function getSearchText(item) {
  return [item.name, item.description, item.category, item.language, item.source, ...(item.tags || [])].join(' ').toLowerCase();
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
    document.querySelectorAll(`.chip[data-filter="${filterType}"]`).forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    renderCards();
  });
});

renderCards();
</script>
