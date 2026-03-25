---
name: picks-status
description: Show content pipeline status for all Peter's Picks in _tools/ — screenshots, scripts, content done, visibility
disable-model-invocation: true
---

node --input-type=module << 'EOF'
import fs from 'fs';

if (!fs.existsSync('_tools')) {
  console.log('No _tools/ directory yet. Submit your first pick at:');
  console.log('https://github.com/CHAOSAiGENT/VaiBReport/issues/new/choose');
  process.exit(0);
}

const tools = fs.readdirSync('_tools').filter(f => f.endsWith('.md'));
if (tools.length === 0) {
  console.log('No picks yet.');
  process.exit(0);
}

const rows = tools.map(f => {
  const c = fs.readFileSync(`_tools/${f}`, 'utf8');
  const get = k => (c.match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, 'm')) || [])[1]?.trim();
  const bool = k => get(k) === 'true';
  return {
    name: (get('name') || f).slice(0, 28),
    slug: f.replace('.md', ''),
    screenshot: get('screenshot_desktop') ? '✅' : '⬜',
    script_f:   get('script_faceless')    ? '✅' : '⬜',
    script_u:   get('script_ugc')         ? '✅' : '⬜',
    done:       bool('content_created')   ? '✅' : '⬜',
    public:     bool('public')            ? '🌐' : '🔒',
    icp:        (get('primary_icp') || '—').slice(0, 14),
    date:       get('date_added') || '—',
  };
});

const col = (s, w) => String(s).padEnd(w);
console.log('\nPeter\'s Picks — Content Pipeline\n');
console.log(col('Tool', 30) + col('ICP', 16) + col('Shot', 6) + col('F', 4) + col('UGC', 6) + col('Done', 6) + col('Vis', 5) + 'Added');
console.log('─'.repeat(80));
rows.forEach(r => {
  console.log(col(r.name, 30) + col(r.icp, 16) + col(r.screenshot, 6) + col(r.script_f, 4) + col(r.script_u, 6) + col(r.done, 6) + col(r.public, 5) + r.date);
});

const pub   = rows.filter(r => r.public === '🌐').length;
const done  = rows.filter(r => r.done  === '✅').length;
const ready = rows.filter(r => r.script_f === '✅' && r.script_u === '✅' && r.done === '⬜').length;
console.log(`\n${rows.length} total · ${pub} public · ${done} content done · ${ready} ready to film`);
EOF
