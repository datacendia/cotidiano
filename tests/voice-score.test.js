// tests/voice-score.test.js
// voiceScore() picks the best Spanish voice the OS happens to have installed.
// Lima-tuned: es-PE > es-MX > es-ES.

const test = require('node:test');
const assert = require('node:assert');
const { loadCotidiano } = require('./_setup');

const ctx = loadCotidiano();
const score = ctx.__voiceScore;

const v = (lang, name, extras = {}) => ({ lang, name, localService: false, default: false, ...extras });

test('voiceScore: es-PE outranks es-MX', () => {
  assert.ok(score(v('es-PE', 'Plain')) > score(v('es-MX', 'Plain')));
});

test('voiceScore: es-MX outranks es-ES', () => {
  assert.ok(score(v('es-MX', 'Plain')) > score(v('es-ES', 'Plain')));
});

test('voiceScore: within same region, Natural boost wins over plain', () => {
  // Region bias intentionally outweighs the boost (Lima-tuning), so the
  // 'Natural' boost matters when comparing two voices in the same region.
  assert.ok(
    score(v('es-MX', 'Microsoft Dalia Online (Natural)')) > score(v('es-MX', 'Plain'))
  );
});

test('voiceScore: region trumps neural boost across regions (Lima-tuned)', () => {
  // es-PE plain (+100) should still beat es-ES Natural (+60+30=90)
  assert.ok(
    score(v('es-PE', 'Plain')) > score(v('es-ES', 'Microsoft Elvira (Natural)'))
  );
});

test('voiceScore: known good name (Paulina) gets a bonus', () => {
  assert.ok(score(v('es-MX', 'Paulina')) > score(v('es-MX', 'Plain')));
});

test('voiceScore: eSpeak voices are penalised', () => {
  assert.ok(score(v('es-MX', 'eSpeak Spanish')) < score(v('es-MX', 'Plain')));
});

test('voiceScore: localService bumps slightly', () => {
  assert.ok(score(v('es-MX', 'Plain', { localService: true })) > score(v('es-MX', 'Plain')));
});

test('voiceScore: non-Spanish lang scores 0', () => {
  assert.strictEqual(score(v('en-US', 'Samantha')), 0);
});

test('voiceScore: es (no region) still scores positive', () => {
  assert.ok(score(v('es', 'Generic')) > 0);
});
