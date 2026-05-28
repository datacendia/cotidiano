// tests/_setup.js
// Shared test harness. Loads conjugator.js, data.js, register-variants.js,
// en-phonetic-dict.js, and app.js into a single vm context so that tests can
// exercise the same code paths the browser does — without a browser.
//
// app.js declares everything as top-level `function`/`const`/`let`. Those
// bindings are script-scoped (not added to globalThis), so the bundle ends
// with a bridge that publishes the symbols we want to test under
// globalThis.__<name>.
//
// Use:
//   const { loadCotidiano } = require('./_setup');
//   const ctx = loadCotidiano();
//   ctx.__phraseId({ es: 'Buenos días' });

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function makeContext() {
  const localStore = {};
  const ctx = {
    console,
    setTimeout, clearTimeout, setInterval, clearInterval,
    Date, Math, JSON,
    Array, Object, String, Number, Boolean, RegExp, Error,
    Map, Set, Symbol, Promise,
    URL, URLSearchParams,
    document: {
      addEventListener: () => {},
      removeEventListener: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      createElement: () => ({ style: {}, addEventListener: () => {}, classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false } }),
      body: { appendChild: () => {} },
    },
    localStorage: {
      _store: localStore,
      getItem: (k) => Object.prototype.hasOwnProperty.call(localStore, k) ? localStore[k] : null,
      setItem: (k, v) => { localStore[k] = String(v); },
      removeItem: (k) => { delete localStore[k]; },
      clear: () => { for (const k of Object.keys(localStore)) delete localStore[k]; },
    },
    speechSynthesis: { getVoices: () => [], cancel: () => {}, speak: () => {}, onvoiceschanged: null },
    SpeechSynthesisUtterance: function () {},
    fetch: () => Promise.reject(new Error('no fetch in tests')),
    indexedDB: undefined,
    location: { hash: '', pathname: '/' },
    navigator: { language: 'en-US', languages: ['en-US'], userAgent: 'node-tests' },
    alert: () => {},
    confirm: () => false,
  };
  ctx.window = ctx;
  ctx.self = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function loadCotidiano({ withEnDict = true } = {}) {
  const ctx = makeContext();
  const files = [
    'conjugator.js',
    'data.js',
    'register-variants.js',
  ];
  if (withEnDict) files.push('en-phonetic-dict.js');
  files.push('app.js');

  let combined = '';
  for (const f of files) {
    const full = path.join(ROOT, f);
    const src = fs.readFileSync(full, 'utf8');
    combined += `\n//=== ${f} ===\n${src}\n`;
  }

  // Bridge: expose script-scoped declarations under globalThis.__<name>
  // so tests can grab them as ctx.__name.
  combined += `
;Object.assign(globalThis, {
  __DATA: typeof DATA !== 'undefined' ? DATA : null,
  __BIRTHDAYS: typeof BIRTHDAYS !== 'undefined' ? BIRTHDAYS : null,
  __DIALOGUES: typeof DIALOGUES !== 'undefined' ? DIALOGUES : null,
  __spanishToPhonetic: typeof spanishToPhonetic !== 'undefined' ? spanishToPhonetic : null,
  __phoneticWord: typeof phoneticWord !== 'undefined' ? phoneticWord : null,
  __enPhonetic: typeof enPhonetic !== 'undefined' ? enPhonetic : null,
  __enPhoneticWord: typeof enPhoneticWord !== 'undefined' ? enPhoneticWord : null,
  __applyEnRules: typeof applyEnRules !== 'undefined' ? applyEnRules : null,
  __levenshtein: typeof levenshtein !== 'undefined' ? levenshtein : null,
  __voiceScore: typeof voiceScore !== 'undefined' ? voiceScore : null,
  __phraseId: typeof phraseId !== 'undefined' ? phraseId : null,
  __allPhrases: typeof allPhrases !== 'undefined' ? allPhrases : null,
  __greetingForTime: typeof greetingForTime !== 'undefined' ? greetingForTime : null,
  __suggestForTime: typeof suggestForTime !== 'undefined' ? suggestForTime : null,
  __heroPhraseForToday: typeof heroPhraseForToday !== 'undefined' ? heroPhraseForToday : null,
  __daysUntilBirthday: typeof daysUntilBirthday !== 'undefined' ? daysUntilBirthday : null,
  __ageOnNextBirthday: typeof ageOnNextBirthday !== 'undefined' ? ageOnNextBirthday : null,
  __spanishMonth: typeof spanishMonth !== 'undefined' ? spanishMonth : null,
  __birthdayPhraseFor: typeof birthdayPhraseFor !== 'undefined' ? birthdayPhraseFor : null,
  __normaliseForCompare: typeof normaliseForCompare !== 'undefined' ? normaliseForCompare : null,
  __defaultState: typeof defaultState !== 'undefined' ? defaultState : null,
  __EN_OVERRIDES: typeof EN_OVERRIDES !== 'undefined' ? EN_OVERRIDES : null,
  __REGISTER_VARIANTS: typeof window !== 'undefined' && window.REGISTER_VARIANTS ? window.REGISTER_VARIANTS : null,
  __EN_DICT: typeof window !== 'undefined' && window.EN_DICT ? window.EN_DICT : null,
});
`;

  vm.runInContext(combined, ctx, { filename: 'cotidiano-bundle.js' });
  return ctx;
}

module.exports = { loadCotidiano };
