// tests/phrase-id.test.js
// phraseId() must be stable, deterministic, and short. It's used as the key
// for favorites, learned, voice bank, register variants — losing stability
// invalidates user data.

const test = require('node:test');
const assert = require('node:assert');
const { loadCotidiano } = require('./_setup');

const ctx = loadCotidiano();
const id = ctx.__phraseId;

test('phraseId: stable across calls with same input', () => {
  assert.strictEqual(
    id({ es: 'Buenos días, mi amor' }),
    id({ es: 'Buenos días, mi amor' })
  );
});

test('phraseId: differs for different Spanish text', () => {
  assert.notStrictEqual(id({ es: 'Buenos días' }), id({ es: 'Buenas tardes' }));
});

test('phraseId: starts with "p_"', () => {
  assert.match(id({ es: 'Hola' }), /^p_/);
});

test('phraseId: strips punctuation (¿, !, etc.)', () => {
  const a = id({ es: '¿Cómo estás?' });
  const b = id({ es: 'cómo estás' });
  assert.strictEqual(a, b);
});

test('phraseId: is length-bounded (≤ 34 chars including p_ prefix)', () => {
  const veryLong = id({ es: 'esta es una oración muy larga que debería ser truncada en algún punto razonable' });
  assert.ok(veryLong.length <= 34, `id too long: ${veryLong.length}`);
});

test('phraseId: lowercase normalised', () => {
  const a = id({ es: 'HOLA' });
  const b = id({ es: 'hola' });
  assert.strictEqual(a, b);
});

test('phraseId: preserves accented characters', () => {
  const out = id({ es: 'baño' });
  assert.match(out, /ñ/);
});
