// scripts/build-en-dict.js
// Generates ../en-phonetic-dict.js — Spanish-readable phonetic transcriptions
// for every English word used in data.js, derived from the CMU Pronouncing
// Dictionary (BSD-2-licensed, http://www.speech.cs.cmu.edu/cgi-bin/cmudict).
//
//   Run:  node scripts/build-en-dict.js
//
// Output is committed to the repo so production never needs Node.

const fs = require('fs');
const path = require('path');

const CMUDICT_URL = 'https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict';
const CMUDICT_CACHE = path.join(__dirname, 'cmudict.dict');
const DATA_PATH = path.join(__dirname, '..', 'data.js');
const OUT_PATH  = path.join(__dirname, '..', 'en-phonetic-dict.js');

// ── ARPABET → Spanish-readable letters ────────────────────────────
// The mapping is tuned so a Spanish speaker reading the result aloud
// (using Spanish phonics) produces something close to the English word.
const ARPABET = {
  // Vowels (stress digit stripped before lookup)
  AA: 'a',   // father
  AE: 'a',   // cat (Spanish has no /æ/, closest is /a/)
  AH: 'a',   // but, cup (schwa also AH0)
  AO: 'o',   // thought, off
  AW: 'au',  // cow
  AY: 'ai',  // my, ride
  EH: 'e',   // red
  ER: 'er',  // her, bird
  EY: 'ei',  // say, eight
  IH: 'i',   // it, sit
  IY: 'i',   // see, fleece
  OW: 'ou',  // go, boat
  OY: 'oi',  // boy
  UH: 'u',   // book, foot
  UW: 'u',   // boot, food
  // Consonants
  B:  'b',
  CH: 'ch',
  D:  'd',
  DH: 'd',   // this — Spanish has no /ð/, "d" is closest
  F:  'f',
  G:  'g',
  HH: 'j',   // hello → jelou (Spanish j ≈ English h)
  JH: 'y',   // joy → yoi
  K:  'k',
  L:  'l',
  M:  'm',
  N:  'n',
  NG: 'n',   // sing → sin (collapse to n)
  P:  'p',
  R:  'r',
  S:  's',
  SH: 'sh',
  T:  't',
  TH: 't',   // think — Spanish-LatAm "z" merges with "s", "t" is more recognizable
  V:  'b',   // Spanish v = b sound
  W:  'u',   // window → uindou
  Y:  'i',
  Z:  's',   // LatAm: z → s
  ZH: 'y',   // measure
};

const VOWELS = new Set(['AA','AE','AH','AO','AW','AY','EH','ER','EY','IH','IY','OW','OY','UH','UW']);

// ── Fetch CMUdict (cached locally) ─────────────────────────────────
async function fetchCmudict() {
  if (fs.existsSync(CMUDICT_CACHE)) {
    const t = fs.readFileSync(CMUDICT_CACHE, 'utf8');
    console.log(`Using cached CMUdict: ${(t.length / 1024 / 1024).toFixed(1)} MB`);
    return t;
  }
  console.log(`Downloading CMUdict from ${CMUDICT_URL} ...`);
  const res = await fetch(CMUDICT_URL);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const text = await res.text();
  fs.writeFileSync(CMUDICT_CACHE, text);
  console.log(`Cached to ${CMUDICT_CACHE} (${(text.length / 1024 / 1024).toFixed(1)} MB)`);
  return text;
}

// ── Parse CMUdict format ────────────────────────────────────────────
//   Each line:  word PH1 PH2 PH3  [# optional comment]
//   Variants:   "word(2)" — alternate pronunciation; we keep the first only.
function parseCmudict(text) {
  const map = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith(';;;')) continue;
    const noComment = line.split('#')[0];
    const parts = noComment.trim().split(/\s+/);
    if (parts.length < 2) continue;
    const rawWord = parts[0].toLowerCase();
    if (/\(\d+\)$/.test(rawWord)) continue; // skip variants
    if (!map.has(rawWord)) map.set(rawWord, parts.slice(1));
  }
  return map;
}

// ── ARPABET phoneme sequence → Spanish-syllable string ─────────────
// Each vowel becomes a syllable nucleus; consonants attach as onset of the
// following vowel (or coda of the previous if no vowel follows). The
// primary-stressed syllable is uppercased so the reader knows where to
// put emphasis (matches the hand-authored Spanish style: "feh-LEES").
function arpaToSpanish(phs) {
  const syllables = []; // [{ txt, stress }]
  let onset = '';
  for (const ph of phs) {
    const m = /^([A-Z]+)(\d?)$/.exec(ph);
    if (!m) continue;
    const base = m[1];
    const stress = m[2] ? parseInt(m[2], 10) : 0;
    const mapped = ARPABET[base];
    if (mapped == null) continue;
    if (VOWELS.has(base)) {
      syllables.push({ txt: onset + mapped, stress });
      onset = '';
    } else {
      onset += mapped;
    }
  }
  // Trailing consonants attach to last syllable as coda
  if (onset) {
    if (syllables.length) syllables[syllables.length - 1].txt += onset;
    else syllables.push({ txt: onset, stress: 0 });
  }
  // Single-syllable words: capitalise to indicate stress (otherwise unstressed-looking)
  if (syllables.length === 1 && syllables[0].stress !== 0) {
    return syllables[0].txt.toUpperCase();
  }
  return syllables
    .map((s) => (s.stress === 1 ? s.txt.toUpperCase() : s.txt))
    .join('-');
}

// ── Extract every English word used in data.js ─────────────────────
function extractEnglishWords(dataPath) {
  const src = fs.readFileSync(dataPath, 'utf8');
  const words = new Set();
  // Match `en: "..."` and `en: '...'`
  const re = /\ben:\s*(["'])((?:\\.|(?!\1).)*)\1/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const en = m[2];
    const tokens = en.match(/[A-Za-z][A-Za-z'\u2019]*/g) || [];
    for (const w of tokens) {
      // Normalize curly apostrophes to ASCII so CMUdict matches; preserve "'" for contractions.
      const k = w.toLowerCase().replace(/[\u2019]/g, "'");
      if (k.length) words.add(k);
    }
  }
  return [...words].sort();
}

// ── Main ────────────────────────────────────────────────────────────
(async function main() {
  const cmuText = await fetchCmudict();
  const cmu = parseCmudict(cmuText);
  console.log(`Parsed CMUdict: ${cmu.size.toLocaleString()} entries`);

  const words = extractEnglishWords(DATA_PATH);
  console.log(`Unique English words in data.js: ${words.length.toLocaleString()}`);

  const dict = {};
  const missing = [];
  for (const w of words) {
    // Try the word as-is first (preserves contractions like "don't"), then a few
    // common rewrites (apostrophe stripped, "'s" → "s") so contractions still
    // resolve when the runtime strips apostrophes before lookup.
    const candidates = [w, w.replace(/'/g, ''), w.replace(/'s$/, 's')];
    let phs = null;
    for (const c of candidates) { if (c && cmu.has(c)) { phs = cmu.get(c); break; } }
    if (!phs) { missing.push(w); continue; }
    // Store under the apostrophe-stripped key so runtime (which strips) can find it.
    dict[w.replace(/'/g, '')] = arpaToSpanish(phs);
  }
  const hits = Object.keys(dict).length;
  const pct = ((hits / words.length) * 100).toFixed(1);
  console.log(`Coverage: ${hits}/${words.length} (${pct}%)`);
  if (missing.length) {
    console.log(`Missed (${missing.length}): ${missing.slice(0, 40).join(', ')}${missing.length > 40 ? ', ...' : ''}`);
  }

  const banner =
    `// AUTO-GENERATED — do not edit by hand.\n` +
    `// Source: CMU Pronouncing Dictionary (BSD-2)\n` +
    `// Run: node scripts/build-en-dict.js to regenerate.\n` +
    `// Coverage: ${hits}/${words.length} words from data.js (${pct}%)\n` +
    `// Generated: ${new Date().toISOString()}\n`;
  const js = banner + 'window.EN_DICT = ' + JSON.stringify(dict) + ';\n';
  fs.writeFileSync(OUT_PATH, js);
  console.log(`Wrote ${OUT_PATH} (${(js.length / 1024).toFixed(1)} KB)`);

  // Also dump the missing list so we can curate overrides for them.
  if (missing.length) {
    const missPath = path.join(__dirname, 'missing-words.txt');
    fs.writeFileSync(missPath, missing.join('\n') + '\n');
    console.log(`Missing words written to ${missPath}`);
  }
})().catch((e) => { console.error(e); process.exit(1); });
