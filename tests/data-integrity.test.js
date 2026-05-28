// tests/data-integrity.test.js
// Structural invariants on the phrase corpus. If any of these fail, something
// drifted in data.js authoring.

const test = require('node:test');
const assert = require('node:assert');
const { loadCotidiano } = require('./_setup');

const ctx = loadCotidiano();
const DATA = ctx.__DATA;
const DIALOGUES = ctx.__DIALOGUES;
const phraseId = ctx.__phraseId;
const allPhrases = ctx.__allPhrases;

test('DATA: contains the expected top-level groups', () => {
  const expected = ['daily', 'work', 'extra', 'parenting', 'family', 'custom', 'bureaucracy', 'health'];
  for (const k of expected) {
    assert.ok(DATA[k], `missing group: ${k}`);
  }
});

test('DATA: every group has title + icon + sections array', () => {
  for (const [key, group] of Object.entries(DATA)) {
    assert.ok(group.title, `${key}: missing title`);
    assert.ok(group.icon, `${key}: missing icon`);
    assert.ok(Array.isArray(group.sections), `${key}: sections must be array`);
  }
});

test('DATA: every section has id, title, icon, phrases', () => {
  for (const [key, group] of Object.entries(DATA)) {
    for (const sec of group.sections) {
      assert.ok(sec.id, `${key}: section missing id`);
      assert.ok(sec.title, `${key}/${sec.id}: missing title`);
      assert.ok(Array.isArray(sec.phrases), `${key}/${sec.id}: phrases must be array`);
    }
  }
});

test('DATA: every phrase has en, es, ph (except empty user/custom)', () => {
  for (const [key, group] of Object.entries(DATA)) {
    if (key === 'custom') continue; // empty by design — populated at runtime
    for (const sec of group.sections) {
      for (const p of sec.phrases) {
        assert.ok(p.en, `${key}/${sec.id}: phrase missing en: ${JSON.stringify(p)}`);
        assert.ok(p.es, `${key}/${sec.id}: phrase missing es: ${JSON.stringify(p)}`);
        assert.ok(p.ph, `${key}/${sec.id}: phrase missing ph for "${p.es}"`);
      }
    }
  }
});

test('DATA: section ids are unique within their group', () => {
  for (const [key, group] of Object.entries(DATA)) {
    const ids = group.sections.map((s) => s.id);
    const seen = new Set();
    for (const id of ids) {
      assert.ok(!seen.has(id), `${key}: duplicate section id "${id}"`);
      seen.add(id);
    }
  }
});

test('DATA: bureaucracy domain has the expected sections', () => {
  const ids = DATA.bureaucracy.sections.map((s) => s.id);
  for (const expected of ['banking', 'dni-reniec', 'sunat-taxes', 'afp-pension', 'notary-permits']) {
    assert.ok(ids.includes(expected), `bureaucracy missing section: ${expected}`);
  }
});

test('DATA: health domain has the expected sections', () => {
  const ids = DATA.health.sections.map((s) => s.id);
  for (const expected of ['pharmacy', 'specialists', 'lab-tests', 'hospital-er', 'insurance']) {
    assert.ok(ids.includes(expected), `health missing section: ${expected}`);
  }
});

test('DATA: bureaucracy.banking includes a CCI phrase', () => {
  const banking = DATA.bureaucracy.sections.find((s) => s.id === 'banking');
  const cci = banking.phrases.find((p) => /CCI/.test(p.es));
  assert.ok(cci, 'expected a CCI phrase in banking');
});

test('DATA: health.pharmacy mentions InkaFarma or MiFarma in a note', () => {
  const ph = DATA.health.sections.find((s) => s.id === 'pharmacy');
  const found = ph.phrases.some((p) => p.note && /(InkaFarma|MiFarma)/.test(p.note));
  assert.ok(found, 'expected InkaFarma/MiFarma reference in pharmacy notes');
});

test('DATA: health.insurance mentions EPS providers', () => {
  const ins = DATA.health.sections.find((s) => s.id === 'insurance');
  const found = ins.phrases.some((p) => /(Pacífico|Rímac|Mapfre|EsSalud)/.test(p.es + (p.note || '')));
  assert.ok(found, 'expected mention of Pacífico / Rímac / Mapfre / EsSalud');
});

test('DATA: total phrase count is at least 1000', () => {
  const all = allPhrases();
  assert.ok(all.length >= 1000, `expected ≥1000 phrases, got ${all.length}`);
});

test('DATA: phraseId collisions are minimal and only between near-duplicates', () => {
  const all = allPhrases();
  const ids = new Map();
  const collisions = [];
  // Normalise like phraseId does: lowercase, strip non-alphanumeric.
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9áéíóúñü]/g, '');
  for (const p of all) {
    const id = phraseId(p);
    if (ids.has(id)) {
      const prev = ids.get(id);
      // OK: collision when the normalised text is identical (e.g. punctuation differs).
      if (norm(prev.es) !== norm(p.es)) {
        collisions.push({ id, a: prev.es, b: p.es });
      }
    } else {
      ids.set(id, p);
    }
  }
  // The 32-char truncation can produce a small number of acceptable
  // collisions for very long phrases sharing a prefix. Cap the budget low
  // so authoring drift gets caught.
  assert.ok(
    collisions.length <= 10,
    `too many phraseId collisions (${collisions.length}). Examples:\n` +
      collisions.slice(0, 5).map((c) => `  ${c.id}: "${c.a}" vs "${c.b}"`).join('\n')
  );
});

test('DIALOGUES: daily has at least one dialogue with lines', () => {
  assert.ok(DIALOGUES);
  assert.ok(Array.isArray(DIALOGUES.daily));
  assert.ok(DIALOGUES.daily.length >= 1);
  const first = DIALOGUES.daily[0];
  assert.ok(first.lines && first.lines.length >= 2);
});

test('DIALOGUES: every line has who, es, en, ph', () => {
  for (const [key, list] of Object.entries(DIALOGUES)) {
    for (const dlg of list) {
      for (const line of dlg.lines) {
        assert.ok(line.who, `${key}: line missing who`);
        assert.ok(line.es, `${key}: line missing es`);
        assert.ok(line.en, `${key}: line missing en`);
        assert.ok(line.ph, `${key}: line missing ph for "${line.es}"`);
      }
    }
  }
});

test('REGISTER_VARIANTS: every variant has reg, label, es, ph', () => {
  const rv = ctx.__REGISTER_VARIANTS;
  assert.ok(rv, 'REGISTER_VARIANTS should be loaded');
  for (const [pid, variants] of Object.entries(rv)) {
    assert.match(pid, /^p_/, `register variant key not a phraseId: ${pid}`);
    for (const v of variants) {
      assert.ok(v.reg, `${pid}: variant missing reg`);
      assert.ok(v.label, `${pid}: variant missing label`);
      assert.ok(v.es, `${pid}: variant missing es`);
      assert.ok(v.ph, `${pid}: variant missing ph`);
    }
  }
});

test('DATA: state.lastSection field exists in defaultState', () => {
  const ds = ctx.__defaultState;
  assert.ok(ds, 'defaultState should be exposed');
  assert.ok('lastSection' in ds, 'defaultState should declare lastSection');
});

test('DATA: viewerReads setting defaults to "both"', () => {
  const ds = ctx.__defaultState;
  assert.strictEqual(ds.settings.viewerReads, 'both');
});
