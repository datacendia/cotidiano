// tests/conjugator.test.js
// Verify the Spanish conjugator covers regular -ar/-er/-ir, key irregular
// verbs, the four stem-change patterns, and orthographic spelling rules.

const test = require('node:test');
const assert = require('node:assert');
const { conjugate, lookupVerb, COMMON_VERBS } = require('../conjugator.js');

// ── Regular -ar: hablar ─────────────────────────────────────
test('regular -ar: hablar present', () => {
  const r = conjugate('hablar');
  assert.deepStrictEqual(r.tenses.present, ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan']);
});

test('regular -ar: hablar preterite', () => {
  const r = conjugate('hablar');
  assert.deepStrictEqual(r.tenses.preterite, ['hablé', 'hablaste', 'habló', 'hablamos', 'hablasteis', 'hablaron']);
});

test('regular -ar: hablar imperfect', () => {
  const r = conjugate('hablar');
  assert.deepStrictEqual(r.tenses.imperfect, ['hablaba', 'hablabas', 'hablaba', 'hablábamos', 'hablabais', 'hablaban']);
});

test('regular -ar: hablar future', () => {
  const r = conjugate('hablar');
  assert.deepStrictEqual(r.tenses.future, ['hablaré', 'hablarás', 'hablará', 'hablaremos', 'hablaréis', 'hablarán']);
});

test('regular -ar: hablar conditional', () => {
  const r = conjugate('hablar');
  assert.deepStrictEqual(r.tenses.conditional, ['hablaría', 'hablarías', 'hablaría', 'hablaríamos', 'hablaríais', 'hablarían']);
});

test('regular -ar: hablar gerund + participle', () => {
  const r = conjugate('hablar');
  assert.strictEqual(r.gerund, 'hablando');
  assert.strictEqual(r.participle, 'hablado');
});

// ── Regular -er: comer ───────────────────────────────────────
test('regular -er: comer present', () => {
  const r = conjugate('comer');
  assert.deepStrictEqual(r.tenses.present, ['como', 'comes', 'come', 'comemos', 'coméis', 'comen']);
});

test('regular -er: comer preterite', () => {
  const r = conjugate('comer');
  assert.deepStrictEqual(r.tenses.preterite, ['comí', 'comiste', 'comió', 'comimos', 'comisteis', 'comieron']);
});

test('regular -er: comer gerund + participle', () => {
  const r = conjugate('comer');
  assert.strictEqual(r.gerund, 'comiendo');
  assert.strictEqual(r.participle, 'comido');
});

// ── Regular -ir: vivir ───────────────────────────────────────
test('regular -ir: vivir present', () => {
  const r = conjugate('vivir');
  assert.deepStrictEqual(r.tenses.present, ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven']);
});

test('regular -ir: vivir preterite', () => {
  const r = conjugate('vivir');
  assert.deepStrictEqual(r.tenses.preterite, ['viví', 'viviste', 'vivió', 'vivimos', 'vivisteis', 'vivieron']);
});

test('regular -ir: vivir gerund + participle', () => {
  const r = conjugate('vivir');
  assert.strictEqual(r.gerund, 'viviendo');
  assert.strictEqual(r.participle, 'vivido');
});

// ── Irregular verbs ──────────────────────────────────────────
test('irregular: ser yo present is "soy"', () => {
  const r = conjugate('ser');
  assert.strictEqual(r.tenses.present[0], 'soy');
});

test('irregular: estar yo present is "estoy"', () => {
  const r = conjugate('estar');
  assert.strictEqual(r.tenses.present[0], 'estoy');
});

test('irregular: tener yo present is "tengo"', () => {
  const r = conjugate('tener');
  assert.strictEqual(r.tenses.present[0], 'tengo');
});

test('irregular: ir yo present is "voy"', () => {
  const r = conjugate('ir');
  assert.strictEqual(r.tenses.present[0], 'voy');
});

test('irregular: hacer yo present is "hago"', () => {
  const r = conjugate('hacer');
  assert.strictEqual(r.tenses.present[0], 'hago');
});

test('irregular: decir yo present is "digo"', () => {
  const r = conjugate('decir');
  assert.strictEqual(r.tenses.present[0], 'digo');
});

test('irregular: poder yo present is "puedo" (o→ue stem change)', () => {
  const r = conjugate('poder');
  assert.strictEqual(r.tenses.present[0], 'puedo');
});

test('irregular: hacer participle is "hecho"', () => {
  const r = conjugate('hacer');
  assert.strictEqual(r.participle, 'hecho');
});

test('irregular: decir participle is "dicho"', () => {
  const r = conjugate('decir');
  assert.strictEqual(r.participle, 'dicho');
});

test('irregular: escribir participle is "escrito"', () => {
  const r = conjugate('escribir');
  assert.strictEqual(r.participle, 'escrito');
});

// ── Stem changes ─────────────────────────────────────────────
test('stem change e→ie: querer yo present is "quiero"', () => {
  const r = conjugate('querer');
  assert.strictEqual(r.tenses.present[0], 'quiero');
});

test('stem change e→ie: querer nosotros present keeps stem ("queremos")', () => {
  const r = conjugate('querer');
  assert.strictEqual(r.tenses.present[3], 'queremos');
});

test('stem change e→i: pedir yo present is "pido"', () => {
  const r = conjugate('pedir');
  assert.strictEqual(r.tenses.present[0], 'pido');
});

test('stem change u→ue: jugar yo present is "juego"', () => {
  const r = conjugate('jugar');
  assert.strictEqual(r.tenses.present[0], 'juego');
});

// ── Orthographic spelling rules ──────────────────────────────
test('orthographic: jugar yo preterite is "jugué" (g→gu before e)', () => {
  const r = conjugate('jugar');
  assert.strictEqual(r.tenses.preterite[0], 'jugué');
});

test('orthographic: empezar yo preterite is "empecé" (z→c before e)', () => {
  const r = conjugate('empezar');
  assert.strictEqual(r.tenses.preterite[0], 'empecé');
});

test('orthographic: buscar yo preterite is "busqué" (c→qu before e)', () => {
  const r = conjugate('buscar');
  assert.strictEqual(r.tenses.preterite[0], 'busqué');
});

test('orthographic: proteger yo present is "protejo" (g→j before o)', () => {
  const r = conjugate('proteger');
  assert.strictEqual(r.tenses.present[0], 'protejo');
});

// ── Output shape ─────────────────────────────────────────────
test('conjugate output has all expected keys', () => {
  const r = conjugate('hablar');
  assert.ok(r.infinitive);
  assert.ok(r.gerund);
  assert.ok(r.participle);
  assert.ok(r.tenses);
  ['present', 'preterite', 'imperfect', 'future', 'conditional', 'presSubj', 'imperative'].forEach((t) => {
    assert.ok(Array.isArray(r.tenses[t]), `tense ${t} should be array`);
    assert.strictEqual(r.tenses[t].length, 6, `tense ${t} should have 6 forms`);
  });
});

test('imperative[0] (yo) is null — there is no first-person command', () => {
  const r = conjugate('hablar');
  assert.strictEqual(r.tenses.imperative[0], null);
});

// ── lookupVerb resolves common verbs ─────────────────────────
test('lookupVerb finds "ser"', () => {
  const r = lookupVerb('ser');
  assert.ok(r, 'lookupVerb should return matches for ser');
  assert.ok(Array.isArray(r) ? r.length > 0 : r.verb || r.infinitive, 'should produce a usable result');
  // Either array-of-matches or single object — accept either shape
  const first = Array.isArray(r) ? r[0] : r;
  assert.match(first.verb || first.infinitive || '', /^ser/);
});

test('lookupVerb is case-insensitive', () => {
  const r = lookupVerb('SER');
  assert.ok(r, 'should find ser regardless of case');
});

test('lookupVerb returns empty/null for unknown gibberish', () => {
  const r = lookupVerb('xyzqqq');
  // Empty array OR null — both signal "not found"
  const empty = r === null || r === undefined || (Array.isArray(r) && r.length === 0);
  assert.ok(empty, `expected empty/null, got ${JSON.stringify(r)}`);
});

test('COMMON_VERBS exports a non-empty collection', () => {
  assert.ok(COMMON_VERBS, 'COMMON_VERBS should exist');
  const size = Array.isArray(COMMON_VERBS) ? COMMON_VERBS.length : Object.keys(COMMON_VERBS).length;
  assert.ok(size > 10, `expected >10 entries, got ${size}`);
});
