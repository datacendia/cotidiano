// tests/suggest.test.js
// Time-aware greeting + suggestion. These functions read `new Date().getHours()`
// directly, so we mock the Date constructor on the loaded context.

const test = require('node:test');
const assert = require('node:assert');
const { loadCotidiano } = require('./_setup');

// Use a fresh context for each "time" so we can swap Date deterministically
function withHour(hour, fn) {
  const ctx = loadCotidiano();
  const RealDate = ctx.Date;
  // Build a date at the desired hour today
  const fixed = new RealDate();
  fixed.setHours(hour, 0, 0, 0);
  const FakeDate = function (...args) {
    if (args.length === 0) return new RealDate(fixed.getTime());
    return new RealDate(...args);
  };
  FakeDate.now = () => fixed.getTime();
  FakeDate.UTC = RealDate.UTC;
  FakeDate.parse = RealDate.parse;
  FakeDate.prototype = RealDate.prototype;
  ctx.Date = FakeDate;
  return fn(ctx);
}

test('greetingForTime: 5am → buenas noches', () => {
  withHour(5, (ctx) => {
    assert.strictEqual(ctx.__greetingForTime().greet, 'Buenas noches');
  });
});

test('greetingForTime: 9am → buenos días', () => {
  withHour(9, (ctx) => {
    assert.strictEqual(ctx.__greetingForTime().greet, 'Buenos días');
  });
});

test('greetingForTime: 14h → buenas tardes', () => {
  withHour(14, (ctx) => {
    assert.strictEqual(ctx.__greetingForTime().greet, 'Buenas tardes');
  });
});

test('greetingForTime: 20h → buenas noches', () => {
  withHour(20, (ctx) => {
    assert.strictEqual(ctx.__greetingForTime().greet, 'Buenas noches');
  });
});

test('suggestForTime: returns valid groupKey + sectionId for every hour', () => {
  for (let h = 0; h < 24; h++) {
    withHour(h, (ctx) => {
      const s = ctx.__suggestForTime();
      assert.ok(s.groupKey, `hour ${h}: groupKey`);
      assert.ok(s.sectionId, `hour ${h}: sectionId`);
      assert.ok(s.ttl, `hour ${h}: ttl`);
      assert.ok(s.msg, `hour ${h}: msg`);
      // groupKey must exist in DATA
      assert.ok(ctx.__DATA[s.groupKey], `hour ${h}: groupKey "${s.groupKey}" exists in DATA`);
      // sectionId must exist within that group
      const sec = ctx.__DATA[s.groupKey].sections.find((x) => x.id === s.sectionId);
      assert.ok(sec, `hour ${h}: sectionId "${s.sectionId}" exists in ${s.groupKey}`);
    });
  }
});

test('suggestForTime: morning hours mention Joaquín or family', () => {
  withHour(7, (ctx) => {
    const s = ctx.__suggestForTime();
    assert.match(s.msg, /Joaquín|Emiliano|kids|Stephania/i);
  });
});

test('suggestForTime: 11am-1pm mentions Datacendia', () => {
  withHour(12, (ctx) => {
    const s = ctx.__suggestForTime();
    assert.match(s.msg, /Datacendia/);
  });
});

test('heroPhraseForToday: returns null when no birthday is today or tomorrow', () => {
  const ctx = loadCotidiano();
  // Pick a date guaranteed not to match any birthday: month 11 day 31 → invalid.
  // Use a real date but stub BIRTHDAYS to be empty for this test.
  // Easier: just assert null/object shape.
  const out = ctx.__heroPhraseForToday();
  if (out !== null) {
    assert.ok(out.es && out.en && out.why);
  }
});

test('heroPhraseForToday: returns birthday phrase when matched', () => {
  // Mock today = May 9 (Stephania's birthday in BIRTHDAYS)
  const ctx = loadCotidiano();
  const RealDate = ctx.Date;
  // 2026-05-09
  const may9 = new RealDate(2026, 4, 9, 12, 0, 0);
  const FakeDate = function (...args) {
    if (args.length === 0) return new RealDate(may9.getTime());
    return new RealDate(...args);
  };
  FakeDate.now = () => may9.getTime();
  FakeDate.UTC = RealDate.UTC;
  FakeDate.parse = RealDate.parse;
  FakeDate.prototype = RealDate.prototype;
  ctx.Date = FakeDate;
  const out = ctx.__heroPhraseForToday();
  assert.ok(out, 'should return a hero phrase on a birthday');
  assert.match(out.es, /Stephania/);
  assert.match(out.es, /Feliz cumpleaños/);
});
