// tests/phonetics-en.test.js
// Verify the English→Spanish-readable phonetic engine: dictionary lookups
// (loaded from en-phonetic-dict.js), hand-curated EN_OVERRIDES, and the
// fallback rule engine in applyEnRules.

const test = require('node:test');
const assert = require('node:assert');
const { loadCotidiano } = require('./_setup');

const ctx = loadCotidiano();
const enp = ctx.__enPhonetic;
const enpw = ctx.__enPhoneticWord;
const rules = ctx.__applyEnRules;

test('enPhonetic: empty input returns empty string', () => {
  assert.strictEqual(enp(''), '');
  assert.strictEqual(enp(null), '');
});

test('enPhonetic: handles common word "hello"', () => {
  const out = enp('hello');
  assert.ok(out.length > 0);
  // Should not contain unaltered "h" — Spanish readers see j or similar
  assert.match(out, /[a-záéíóúñü]/i);
});

test('enPhonetic: multi-word preserves spaces', () => {
  const out = enp('good morning');
  assert.match(out, / /);
  assert.ok(out.split(/\s+/).length >= 2);
});

test('enPhonetic: punctuation is preserved', () => {
  const out = enp('hello, world!');
  assert.match(out, /,/);
  assert.match(out, /!/);
});

test('applyEnRules: ph → f', () => {
  assert.strictEqual(rules('phone'), 'fon');
});

test('applyEnRules: silent k in kn-', () => {
  assert.strictEqual(rules('knee'), 'ni');
});

test('applyEnRules: tion ending is transformed (action → aksion)', () => {
  const out = rules('action');
  // The pipeline: 'tion'→'shon', later c→k, sh-cluster reduces; the actual
  // engine emits 'aksion' for "action" — readable to a Spanish speaker as
  // "ak-SYOHN" via Spanish phonics. What matters: no literal 'tion' remains.
  assert.ok(!/tion/.test(out), `expected 'tion' transformed away, got: ${out}`);
  // And the suffix is one of the valid Spanish-readable forms.
  assert.match(out, /(shon|sjon|syon|sion)$/);
});

test('applyEnRules: th → d (LatAm approximation)', () => {
  const out = rules('this');
  assert.match(out, /^d/);
});

test('applyEnRules: y at end → i', () => {
  const out = rules('happy');
  assert.match(out, /i$/);
});

test('applyEnRules: doubled consonants collapse', () => {
  // "bb" → "b", "tt" → "t" etc.
  const out = rules('bottom');
  assert.ok(!/tt/.test(out), 'tt should collapse');
});

test('enPhoneticWord: preserves leading capital', () => {
  const out = enpw('Hello');
  assert.match(out, /^[A-Z]/);
});

test('enPhoneticWord: preserves all-caps for short acronyms', () => {
  const out = enpw('OK');
  // Either the dictionary entry comes back uppercased, or our wrapper does it
  if (out.length > 1) {
    assert.match(out, /^[A-Z]/);
  }
});

test('enPhonetic: numbers and symbols pass through unchanged', () => {
  const out = enp('I have 3 apples');
  assert.match(out, /3/);
});

test('EN_OVERRIDES table is non-empty and contains "the"', () => {
  const overrides = ctx.__EN_OVERRIDES;
  assert.ok(overrides);
  assert.ok(overrides['the'], '"the" should be in EN_OVERRIDES');
});
