// Smoke test for the phonetic generator
// Run with: node test-phonetic.js
const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8')
  .replace(/document\.addEventListener[^;]+;/g, '');
eval(code);

const tests = [
  ['Buenos días',    'BWEH-nohs DEE-ahs'],
  ['Hola',           'OH-lah'],
  ['Te amo',         'teh AH-moh'],
  ['Joaquín',        'hoh-ah-KEEN'],
  ['Emiliano',       'eh-mee-LYAH-noh'],
  ['mañana',         'mah-NYAH-nah'],
  ['agua',           'AH-gwah'],
  ['gracias',        'GRAH-syahs'],
  ['cuánto',         'KWAHN-toh'],
  ['perdón',         'pehr-DOHN'],
  ['llegué',         'yeh-GEH'],
  ['Cómo estás',     'KOH-moh ehs-TAHS'],
  ['quiero',         'kee-EH-roh'],
  ['ojos',           'OH-hohs'],
  ['baño',           'BAH-nyoh'],
  ['cabeza',         'kah-BEH-sah'],
  ['jueves',         'HWEH-vehs'],
  ['ciudad',         'syoo-DAHD'],
  ['rápido',         'RRAH-pee-doh'],
  ['Miraflores',     'mee-rah-FLOH-rehs'],
];

let pass = 0, fail = 0;
for (const [es, expected] of tests) {
  const got = spanishToPhonetic(es);
  const ok = got.toLowerCase() === expected.toLowerCase();
  if (ok) pass++; else fail++;
  console.log((ok ? 'OK ' : '!! '), es.padEnd(18), '->', got, ok ? '' : '  (expected ' + expected + ')');
}
console.log('');
console.log(pass + ' pass / ' + fail + ' fail');
