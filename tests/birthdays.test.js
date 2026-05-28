// tests/birthdays.test.js
// Birthday math + cohort-aware phrasing.

const test = require('node:test');
const assert = require('node:assert');
const { loadCotidiano } = require('./_setup');

const ctx = loadCotidiano();
const daysUntil = ctx.__daysUntilBirthday;
const ageOnNext = ctx.__ageOnNextBirthday;
const month = ctx.__spanishMonth;
const phraseFor = ctx.__birthdayPhraseFor;
const BIRTHDAYS = ctx.__BIRTHDAYS;

test('daysUntilBirthday: today → 0', () => {
  const today = new Date(2026, 4, 9); // May 9
  assert.strictEqual(daysUntil('05-09', today), 0);
});

test('daysUntilBirthday: tomorrow → 1', () => {
  const today = new Date(2026, 4, 9);
  assert.strictEqual(daysUntil('05-10', today), 1);
});

test('daysUntilBirthday: yesterday → ~364 (rolls to next year)', () => {
  const today = new Date(2026, 4, 9);
  const d = daysUntil('05-08', today);
  assert.ok(d >= 363 && d <= 365, `expected ~364, got ${d}`);
});

test('daysUntilBirthday: end of year wraps correctly', () => {
  const today = new Date(2026, 11, 31); // Dec 31
  assert.strictEqual(daysUntil('01-01', today), 1);
});

test('ageOnNextBirthday: Stephania (1991-05-09) on 2026-05-08 → 35', () => {
  const today = new Date(2026, 4, 8);
  assert.strictEqual(ageOnNext(1991, '05-09', today), 35);
});

test('ageOnNextBirthday: returns null when no birth year', () => {
  assert.strictEqual(ageOnNext(null, '05-09'), null);
  assert.strictEqual(ageOnNext(undefined, '05-09'), null);
});

test('spanishMonth: 1 → enero, 12 → diciembre', () => {
  assert.strictEqual(month(1), 'enero');
  assert.strictEqual(month(12), 'diciembre');
});

test('spanishMonth: 6 → junio', () => {
  assert.strictEqual(month(6), 'junio');
});

test('birthdayPhraseFor: wife cohort → mi amor', () => {
  const out = phraseFor({ name: 'Stephania', cohort: 'wife' });
  assert.match(out, /mi amor/);
});

test('birthdayPhraseFor: elder-inlaw cohort uses formal usted (Le deseo)', () => {
  const out = phraseFor({ name: 'Papá Jorge', cohort: 'elder-inlaw', relES: 'suegro' });
  assert.match(out, /Le deseo/);
});

test('birthdayPhraseFor: peer cohort uses casual "Feliz cumple"', () => {
  const out = phraseFor({ name: 'Gwen', cohort: 'peer' });
  assert.match(out, /Feliz cumple/);
});

test('BIRTHDAYS array has at least 20 entries', () => {
  assert.ok(Array.isArray(BIRTHDAYS));
  assert.ok(BIRTHDAYS.length >= 20, `expected >=20, got ${BIRTHDAYS.length}`);
});

test('BIRTHDAYS: every entry has name, date, cohort, relES, relEN', () => {
  for (const b of BIRTHDAYS) {
    assert.ok(b.name, `missing name on ${JSON.stringify(b)}`);
    assert.match(b.date, /^\d{2}-\d{2}$/, `bad date format: ${b.date}`);
    assert.ok(b.cohort, `missing cohort for ${b.name}`);
  }
});

test('BIRTHDAYS: Stephania exists and is wife cohort', () => {
  const steph = BIRTHDAYS.find((b) => b.name === 'Stephania');
  assert.ok(steph, 'Stephania should be in BIRTHDAYS');
  assert.strictEqual(steph.cohort, 'wife');
});

test('BIRTHDAYS: memoriam entries are flagged', () => {
  const memorial = BIRTHDAYS.filter((b) => b.memoriam);
  assert.ok(memorial.length >= 1, 'should have at least one memoriam entry');
  for (const m of memorial) {
    assert.match(m.relES, /q\.e\.p\.d/);
  }
});
