import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickValidatorModel } from '../../scripts/lib/validator.js';

test('Llama generator routes to non-Llama validator', () => {
  const v = pickValidatorModel('meta/llama-3.3-70b-instruct');
  assert.ok(['mistralai/mixtral-8x22b-instruct-v0.1', 'qwen/qwen2.5-72b-instruct'].includes(v),
    `expected mixtral or qwen, got ${v}`);
});

test('405B Llama also routes away from Llama family', () => {
  const v = pickValidatorModel('meta/llama-3.1-405b-instruct');
  assert.ok(['mistralai/mixtral-8x22b-instruct-v0.1', 'qwen/qwen2.5-72b-instruct'].includes(v));
});

test('Mixtral generator routes to non-Mixtral validator', () => {
  const v = pickValidatorModel('mistralai/mixtral-8x22b-instruct-v0.1');
  assert.ok(['nvidia/llama-3.1-nemotron-70b-instruct', 'qwen/qwen2.5-72b-instruct'].includes(v));
});

test('Qwen generator routes to non-Qwen validator', () => {
  const v = pickValidatorModel('qwen/qwen2.5-72b-instruct');
  assert.ok(['meta/llama-3.3-70b-instruct', 'mistralai/mixtral-8x22b-instruct-v0.1'].includes(v));
});

test('Local Qwen generator routes to NIM Mixtral or Llama', () => {
  const v = pickValidatorModel('local/qwen3-14b');
  assert.ok(['mistralai/mixtral-8x22b-instruct-v0.1', 'meta/llama-3.3-70b-instruct'].includes(v));
});

test('Gemini generator routes to any NIM model', () => {
  const v = pickValidatorModel('gemini-2.5-flash');
  const nimModels = [
    'meta/llama-3.3-70b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'mistralai/mixtral-8x22b-instruct-v0.1',
    'qwen/qwen2.5-72b-instruct',
    'meta/llama-3.1-405b-instruct',
  ];
  assert.ok(nimModels.includes(v));
});

test('Unknown generator routes to first NIM model as safe default', () => {
  const v = pickValidatorModel('something-weird');
  assert.equal(v, 'meta/llama-3.3-70b-instruct');
});
