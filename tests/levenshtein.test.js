// tests/levenshtein.test.js
// Levenshtein powers Coach mode pronunciation scoring (both word-level and
// phoneme-level). Quick sanity tests across the classic edge cases.

const test = require('node:test');
const assert = require('node:assert');
const { loadCotidiano } = require('./_setup');

const ctx = loadCotidiano();
const lev = ctx.__levenshtein;

test('levenshtein: identical strings → 0', () => {
  assert.strictEqual(lev('hello', 'hello'), 0);
});

test('levenshtein: empty vs non-empty → length', () => {
  assert.strictEqual(lev('', 'hello'), 5);
  assert.strictEqual(lev('hello', ''), 5);
});

test('levenshtein: both empty → 0', () => {
  assert.strictEqual(lev('', ''), 0);
});

test('levenshtein: single insertion → 1', () => {
  assert.strictEqual(lev('cat', 'cats'), 1);
});

test('levenshtein: single deletion → 1', () => {
  assert.strictEqual(lev('cats', 'cat'), 1);
});

test('levenshtein: single substitution → 1', () => {
  assert.strictEqual(lev('cat', 'bat'), 1);
});

test('levenshtein: classic kitten/sitting → 3', () => {
  assert.strictEqual(lev('kitten', 'sitting'), 3);
});

test('levenshtein: case-sensitive', () => {
  assert.notStrictEqual(lev('Cat', 'cat'), 0);
});
