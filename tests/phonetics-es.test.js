// tests/phonetics-es.test.js
// Verify the Spanish→phonetic engine renders predictable output for a Spanish
// reader's hardest cases: ñ, ll, rr, ge/gi, ce/ci, qu, accents, diphthongs.

const test = require('node:test');
const assert = require('node:assert');
const { loadCotidiano } = require('./_setup');

const ctx = loadCotidiano();
const stp = ctx.__spanishToPhonetic;

test('phonetics: empty input returns empty string', () => {
  assert.strictEqual(stp(''), '');
  assert.strictEqual(stp(null), '');
});

test('phonetics: "buenos días" produces stressed BWEH and DEE', () => {
  const out = stp('buenos días');
  assert.match(out, /BWEH/);
  assert.match(out, /DEE/);
});

test('phonetics: "qué tal" — qu→k, é stresses', () => {
  const out = stp('qué tal');
  assert.match(out, /KEH/i);
  assert.ok(!/qu/i.test(out), 'qu should not appear in output');
});

test('phonetics: "llamar" — ll renders as y', () => {
  const out = stp('llamar');
  assert.match(out, /^yah/i);
});

test('phonetics: "mañana" — ñ renders as ny', () => {
  const out = stp('mañana');
  assert.match(out, /ny/i);
});

test('phonetics: word-initial r is rolled (rr)', () => {
  const out = stp('rojo');
  assert.match(out, /^rr/i);
});

test('phonetics: rr inside word stays rr', () => {
  const out = stp('perro');
  assert.match(out, /rr/i);
});

test('phonetics: ge/gi → h sound', () => {
  const out = stp('gente');
  assert.match(out, /^h/i);
});

test('phonetics: ce/ci → s sound (LatAm)', () => {
  const out = stp('cinco');
  assert.match(out, /^s/i);
});

test('phonetics: hard c (before a/o/u) → k', () => {
  const out = stp('casa');
  assert.match(out, /^k/i);
});

test('phonetics: silent h ("hola" renders without an h consonant sound)', () => {
  const out = stp('hola');
  // Vowel mapping uses 'oh' for /o/. After stripping the vowel mappings
  // (oh, ah) case-insensitively, no standalone consonant 'h' should remain.
  const stripped = out.replace(/[OAEIU]H|oh|ah|eh|ih|uh/gi, '');
  assert.ok(!/h/i.test(stripped), `unexpected h consonant in: ${out}`);
});

test('phonetics: accent mark forces stress on that syllable', () => {
  // "café" — stress on FE because of the é
  const out = stp('café');
  assert.match(out, /FEH/);
});

test('phonetics: punctuation is preserved', () => {
  const out = stp('¿qué?');
  assert.match(out, /\?/);
  assert.match(out, /¿/);
});

test('phonetics: multi-word input preserves spaces', () => {
  const out = stp('hola mundo');
  assert.match(out, / /);
  assert.ok(out.split(' ').length >= 2);
});

test('phonetics: "feliz cumpleaños" hits the family birthday case', () => {
  const out = stp('feliz cumpleaños');
  assert.match(out, /feh-LEES/i);
  assert.match(out, /ny/);
});

test('phonetics: gue/gui → g (silent u)', () => {
  // "guerra" should start with g, not gu sound
  const out = stp('guerra');
  assert.match(out, /^g/i);
  assert.ok(!/gu/i.test(out.slice(0, 2)));
});

test('phonetics: trailing -ón gets stress on ON', () => {
  const out = stp('canción');
  assert.match(out, /OHN/);
});
