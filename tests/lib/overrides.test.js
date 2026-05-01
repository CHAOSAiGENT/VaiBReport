import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSlugs, mergeOverrides } from '../../scripts/lib/overrides.js';

test('validateSlugs drops unknown slugs', () => {
  const knownSlugs = new Set(['calcom--calcom', 'agent-browser']);
  const input = {
    'owner/foo': {
      replaces: [{ name: 'Notion', url: 'https://notion.so' }],
      similar_to: ['calcom--calcom', 'does-not-exist', 'agent-browser']
    }
  };
  const result = validateSlugs(input, knownSlugs);
  assert.deepEqual(result['owner/foo'].similar_to, ['calcom--calcom', 'agent-browser']);
});

test('validateSlugs leaves replaces untouched', () => {
  const knownSlugs = new Set([]);
  const replaces = [{ name: 'Notion', url: 'https://notion.so' }];
  const input = { 'x': { replaces, similar_to: ['nothing'] } };
  const result = validateSlugs(input, knownSlugs);
  assert.deepEqual(result['x'].replaces, replaces);
  assert.deepEqual(result['x'].similar_to, []);
});

test('validateSlugs handles missing similar_to gracefully', () => {
  const result = validateSlugs({ 'x': { replaces: [] } }, new Set());
  assert.deepEqual(result['x'].similar_to, []);
});

test('mergeOverrides replaces only the overridden field', () => {
  const generated = {
    'agent-browser': {
      blurb: 'Auto blurb',
      replaces: [{ name: 'Wrong', url: 'https://wrong.com' }],
      similar_to: ['x', 'y']
    }
  };
  const overrides = {
    'agent-browser': {
      replaces: [{ name: 'Browser Use', url: 'https://browser-use.com' }],
      compare_to_source: 'manual'
    }
  };
  const merged = mergeOverrides(generated, overrides);
  assert.equal(merged['agent-browser'].replaces[0].name, 'Browser Use');
  assert.deepEqual(merged['agent-browser'].similar_to, ['x', 'y']);
  assert.equal(merged['agent-browser'].compare_to_source, 'manual');
});

test('mergeOverrides leaves entries without overrides untouched', () => {
  const generated = { 'foo': { blurb: 'x', replaces: [], similar_to: [] } };
  const overrides = {};
  const merged = mergeOverrides(generated, overrides);
  assert.deepEqual(merged['foo'], { blurb: 'x', replaces: [], similar_to: [] });
});

test('mergeOverrides ignores override entries for unknown slugs', () => {
  const generated = { 'foo': { blurb: 'x' } };
  const overrides = { 'bar': { replaces: [{ name: 'Z', url: '' }] } };
  const merged = mergeOverrides(generated, overrides);
  assert.equal(merged['bar'], undefined);
  assert.deepEqual(merged['foo'], { blurb: 'x' });
});
