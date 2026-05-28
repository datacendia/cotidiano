// ════════════════════════════════════════════════════════════
//  Spanish Conjugator — pure JS, runs in browser
// ════════════════════════════════════════════════════════════
//
// Covers ~95% of conjugation needs with rules + a curated set of
// fully-irregular verbs. Output shape:
//
//   conjugate('hablar') -> {
//     infinitive: 'hablar',
//     translation: 'to speak',
//     gerund: 'hablando',
//     participle: 'hablado',
//     tenses: {
//       present: ['hablo','hablas','habla','hablamos','habláis','hablan'],
//       preterite: [...],
//       imperfect: [...],
//       future: [...],
//       conditional: [...],
//       presSubj: [...],
//       imperative: [null, 'habla', 'hable', 'hablemos', 'hablad', 'hablen'],
//     },
//     irregular: false,
//     stemChange: null,
//   }
//
// Persons (always 6, in this order):
//   0 = yo
//   1 = tú
//   2 = él/ella/usted
//   3 = nosotros
//   4 = vosotros
//   5 = ellos/ellas/ustedes
//
// Imperative[0] is null because there's no first-person command.

(function () {
  // ── Regular endings ────────────────────────────────────────
  const ENDINGS = {
    ar: {
      present:    ['o','as','a','amos','áis','an'],
      preterite:  ['é','aste','ó','amos','asteis','aron'],
      imperfect:  ['aba','abas','aba','ábamos','abais','aban'],
      presSubj:   ['e','es','e','emos','éis','en'],
      imperative: [null,'a','e','emos','ad','en'],
      gerund:     'ando',
      participle: 'ado',
    },
    er: {
      present:    ['o','es','e','emos','éis','en'],
      preterite:  ['í','iste','ió','imos','isteis','ieron'],
      imperfect:  ['ía','ías','ía','íamos','íais','ían'],
      presSubj:   ['a','as','a','amos','áis','an'],
      imperative: [null,'e','a','amos','ed','an'],
      gerund:     'iendo',
      participle: 'ido',
    },
    ir: {
      present:    ['o','es','e','imos','ís','en'],
      preterite:  ['í','iste','ió','imos','isteis','ieron'],
      imperfect:  ['ía','ías','ía','íamos','íais','ían'],
      presSubj:   ['a','as','a','amos','áis','an'],
      imperative: [null,'e','a','amos','id','an'],
      gerund:     'iendo',
      participle: 'ido',
    },
  };

  // Future + Conditional use the full infinitive as the stem
  const FUT_ENDINGS  = ['é','ás','á','emos','éis','án'];
  const COND_ENDINGS = ['ía','ías','ía','íamos','íais','ían'];

  // ── Stem-changing verbs (the most common patterns) ─────────
  // Listed by infinitive → pattern.
  const STEM_CHANGE = {
    // e → ie (in stressed forms: yo, tú, él, ellos)
    pensar:'e>ie', querer:'e>ie', perder:'e>ie', sentir:'e>ie', preferir:'e>ie',
    despertar:'e>ie', recomendar:'e>ie', empezar:'e>ie', comenzar:'e>ie',
    entender:'e>ie', encender:'e>ie', defender:'e>ie', divertirse:'e>ie',
    hervir:'e>ie', mentir:'e>ie', cerrar:'e>ie', calentar:'e>ie',
    // o → ue
    poder:'o>ue', dormir:'o>ue', contar:'o>ue', volver:'o>ue', encontrar:'o>ue',
    mover:'o>ue', recordar:'o>ue', acostar:'o>ue', mostrar:'o>ue', costar:'o>ue',
    soñar:'o>ue', morir:'o>ue', oler:'o>ue', resolver:'o>ue', devolver:'o>ue',
    almorzar:'o>ue', llover:'o>ue',
    // e → i (only -ir verbs)
    pedir:'e>i', servir:'e>i', repetir:'e>i', seguir:'e>i', conseguir:'e>i',
    vestirse:'e>i', despedirse:'e>i', medir:'e>i', sonreír:'e>i', reír:'e>i',
    // u → ue (jugar is alone in its category)
    jugar:'u>ue',
  };

  // Stem changers that ALSO change in some preterite/subjunctive forms (-ir verbs)
  // pedir → pidió/pidieron, dormir → durmió/durmieron, sentir → sintió/sintieron
  // We handle this for any -ir stem-changer: 3rd person preterite shifts e→i or o→u.

  // ── Fully irregular verbs (hand-tabulated) ─────────────────
  // Each entry: complete tense tables. Persons: [yo, tú, él/usted, nosotros, vosotros, ellos]
  const IRREGULAR = {
    ser: {
      translation: 'to be (essence)',
      gerund: 'siendo', participle: 'sido',
      present:    ['soy','eres','es','somos','sois','son'],
      preterite:  ['fui','fuiste','fue','fuimos','fuisteis','fueron'],
      imperfect:  ['era','eras','era','éramos','erais','eran'],
      future:     ['seré','serás','será','seremos','seréis','serán'],
      conditional:['sería','serías','sería','seríamos','seríais','serían'],
      presSubj:   ['sea','seas','sea','seamos','seáis','sean'],
      imperative: [null,'sé','sea','seamos','sed','sean'],
    },
    estar: {
      translation: 'to be (state, location)',
      gerund: 'estando', participle: 'estado',
      present:    ['estoy','estás','está','estamos','estáis','están'],
      preterite:  ['estuve','estuviste','estuvo','estuvimos','estuvisteis','estuvieron'],
      imperfect:  ['estaba','estabas','estaba','estábamos','estabais','estaban'],
      future:     ['estaré','estarás','estará','estaremos','estaréis','estarán'],
      conditional:['estaría','estarías','estaría','estaríamos','estaríais','estarían'],
      presSubj:   ['esté','estés','esté','estemos','estéis','estén'],
      imperative: [null,'está','esté','estemos','estad','estén'],
    },
    ir: {
      translation: 'to go',
      gerund: 'yendo', participle: 'ido',
      present:    ['voy','vas','va','vamos','vais','van'],
      preterite:  ['fui','fuiste','fue','fuimos','fuisteis','fueron'],
      imperfect:  ['iba','ibas','iba','íbamos','ibais','iban'],
      future:     ['iré','irás','irá','iremos','iréis','irán'],
      conditional:['iría','irías','iría','iríamos','iríais','irían'],
      presSubj:   ['vaya','vayas','vaya','vayamos','vayáis','vayan'],
      imperative: [null,'ve','vaya','vayamos','id','vayan'],
    },
    haber: {
      translation: 'to have (auxiliary) / there is/are',
      gerund: 'habiendo', participle: 'habido',
      present:    ['he','has','ha','hemos','habéis','han'],
      preterite:  ['hube','hubiste','hubo','hubimos','hubisteis','hubieron'],
      imperfect:  ['había','habías','había','habíamos','habíais','habían'],
      future:     ['habré','habrás','habrá','habremos','habréis','habrán'],
      conditional:['habría','habrías','habría','habríamos','habríais','habrían'],
      presSubj:   ['haya','hayas','haya','hayamos','hayáis','hayan'],
      imperative: [null,'he','haya','hayamos','habed','hayan'],
    },
    tener: {
      translation: 'to have',
      gerund: 'teniendo', participle: 'tenido',
      present:    ['tengo','tienes','tiene','tenemos','tenéis','tienen'],
      preterite:  ['tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron'],
      imperfect:  ['tenía','tenías','tenía','teníamos','teníais','tenían'],
      future:     ['tendré','tendrás','tendrá','tendremos','tendréis','tendrán'],
      conditional:['tendría','tendrías','tendría','tendríamos','tendríais','tendrían'],
      presSubj:   ['tenga','tengas','tenga','tengamos','tengáis','tengan'],
      imperative: [null,'ten','tenga','tengamos','tened','tengan'],
    },
    hacer: {
      translation: 'to do / to make',
      gerund: 'haciendo', participle: 'hecho',
      present:    ['hago','haces','hace','hacemos','hacéis','hacen'],
      preterite:  ['hice','hiciste','hizo','hicimos','hicisteis','hicieron'],
      imperfect:  ['hacía','hacías','hacía','hacíamos','hacíais','hacían'],
      future:     ['haré','harás','hará','haremos','haréis','harán'],
      conditional:['haría','harías','haría','haríamos','haríais','harían'],
      presSubj:   ['haga','hagas','haga','hagamos','hagáis','hagan'],
      imperative: [null,'haz','haga','hagamos','haced','hagan'],
    },
    decir: {
      translation: 'to say / to tell',
      gerund: 'diciendo', participle: 'dicho',
      present:    ['digo','dices','dice','decimos','decís','dicen'],
      preterite:  ['dije','dijiste','dijo','dijimos','dijisteis','dijeron'],
      imperfect:  ['decía','decías','decía','decíamos','decíais','decían'],
      future:     ['diré','dirás','dirá','diremos','diréis','dirán'],
      conditional:['diría','dirías','diría','diríamos','diríais','dirían'],
      presSubj:   ['diga','digas','diga','digamos','digáis','digan'],
      imperative: [null,'di','diga','digamos','decid','digan'],
    },
    ver: {
      translation: 'to see',
      gerund: 'viendo', participle: 'visto',
      present:    ['veo','ves','ve','vemos','veis','ven'],
      preterite:  ['vi','viste','vio','vimos','visteis','vieron'],
      imperfect:  ['veía','veías','veía','veíamos','veíais','veían'],
      future:     ['veré','verás','verá','veremos','veréis','verán'],
      conditional:['vería','verías','vería','veríamos','veríais','verían'],
      presSubj:   ['vea','veas','vea','veamos','veáis','vean'],
      imperative: [null,'ve','vea','veamos','ved','vean'],
    },
    dar: {
      translation: 'to give',
      gerund: 'dando', participle: 'dado',
      present:    ['doy','das','da','damos','dais','dan'],
      preterite:  ['di','diste','dio','dimos','disteis','dieron'],
      imperfect:  ['daba','dabas','daba','dábamos','dabais','daban'],
      future:     ['daré','darás','dará','daremos','daréis','darán'],
      conditional:['daría','darías','daría','daríamos','daríais','darían'],
      presSubj:   ['dé','des','dé','demos','deis','den'],
      imperative: [null,'da','dé','demos','dad','den'],
    },
    saber: {
      translation: 'to know (a fact)',
      gerund: 'sabiendo', participle: 'sabido',
      present:    ['sé','sabes','sabe','sabemos','sabéis','saben'],
      preterite:  ['supe','supiste','supo','supimos','supisteis','supieron'],
      imperfect:  ['sabía','sabías','sabía','sabíamos','sabíais','sabían'],
      future:     ['sabré','sabrás','sabrá','sabremos','sabréis','sabrán'],
      conditional:['sabría','sabrías','sabría','sabríamos','sabríais','sabrían'],
      presSubj:   ['sepa','sepas','sepa','sepamos','sepáis','sepan'],
      imperative: [null,'sabe','sepa','sepamos','sabed','sepan'],
    },
    poder: {
      translation: 'to be able to / can',
      gerund: 'pudiendo', participle: 'podido',
      present:    ['puedo','puedes','puede','podemos','podéis','pueden'],
      preterite:  ['pude','pudiste','pudo','pudimos','pudisteis','pudieron'],
      imperfect:  ['podía','podías','podía','podíamos','podíais','podían'],
      future:     ['podré','podrás','podrá','podremos','podréis','podrán'],
      conditional:['podría','podrías','podría','podríamos','podríais','podrían'],
      presSubj:   ['pueda','puedas','pueda','podamos','podáis','puedan'],
      imperative: [null,'puede','pueda','podamos','poded','puedan'],
    },
    poner: {
      translation: 'to put',
      gerund: 'poniendo', participle: 'puesto',
      present:    ['pongo','pones','pone','ponemos','ponéis','ponen'],
      preterite:  ['puse','pusiste','puso','pusimos','pusisteis','pusieron'],
      imperfect:  ['ponía','ponías','ponía','poníamos','poníais','ponían'],
      future:     ['pondré','pondrás','pondrá','pondremos','pondréis','pondrán'],
      conditional:['pondría','pondrías','pondría','pondríamos','pondríais','pondrían'],
      presSubj:   ['ponga','pongas','ponga','pongamos','pongáis','pongan'],
      imperative: [null,'pon','ponga','pongamos','poned','pongan'],
    },
    salir: {
      translation: 'to leave / go out',
      gerund: 'saliendo', participle: 'salido',
      present:    ['salgo','sales','sale','salimos','salís','salen'],
      preterite:  ['salí','saliste','salió','salimos','salisteis','salieron'],
      imperfect:  ['salía','salías','salía','salíamos','salíais','salían'],
      future:     ['saldré','saldrás','saldrá','saldremos','saldréis','saldrán'],
      conditional:['saldría','saldrías','saldría','saldríamos','saldríais','saldrían'],
      presSubj:   ['salga','salgas','salga','salgamos','salgáis','salgan'],
      imperative: [null,'sal','salga','salgamos','salid','salgan'],
    },
    venir: {
      translation: 'to come',
      gerund: 'viniendo', participle: 'venido',
      present:    ['vengo','vienes','viene','venimos','venís','vienen'],
      preterite:  ['vine','viniste','vino','vinimos','vinisteis','vinieron'],
      imperfect:  ['venía','venías','venía','veníamos','veníais','venían'],
      future:     ['vendré','vendrás','vendrá','vendremos','vendréis','vendrán'],
      conditional:['vendría','vendrías','vendría','vendríamos','vendríais','vendrían'],
      presSubj:   ['venga','vengas','venga','vengamos','vengáis','vengan'],
      imperative: [null,'ven','venga','vengamos','venid','vengan'],
    },
    traer: {
      translation: 'to bring',
      gerund: 'trayendo', participle: 'traído',
      present:    ['traigo','traes','trae','traemos','traéis','traen'],
      preterite:  ['traje','trajiste','trajo','trajimos','trajisteis','trajeron'],
      imperfect:  ['traía','traías','traía','traíamos','traíais','traían'],
      future:     ['traeré','traerás','traerá','traeremos','traeréis','traerán'],
      conditional:['traería','traerías','traería','traeríamos','traeríais','traerían'],
      presSubj:   ['traiga','traigas','traiga','traigamos','traigáis','traigan'],
      imperative: [null,'trae','traiga','traigamos','traed','traigan'],
    },
    oír: {
      translation: 'to hear',
      gerund: 'oyendo', participle: 'oído',
      present:    ['oigo','oyes','oye','oímos','oís','oyen'],
      preterite:  ['oí','oíste','oyó','oímos','oísteis','oyeron'],
      imperfect:  ['oía','oías','oía','oíamos','oíais','oían'],
      future:     ['oiré','oirás','oirá','oiremos','oiréis','oirán'],
      conditional:['oiría','oirías','oiría','oiríamos','oiríais','oirían'],
      presSubj:   ['oiga','oigas','oiga','oigamos','oigáis','oigan'],
      imperative: [null,'oye','oiga','oigamos','oíd','oigan'],
    },
    querer: {
      translation: 'to want / to love',
      gerund: 'queriendo', participle: 'querido',
      present:    ['quiero','quieres','quiere','queremos','queréis','quieren'],
      preterite:  ['quise','quisiste','quiso','quisimos','quisisteis','quisieron'],
      imperfect:  ['quería','querías','quería','queríamos','queríais','querían'],
      future:     ['querré','querrás','querrá','querremos','querréis','querrán'],
      conditional:['querría','querrías','querría','querríamos','querríais','querrían'],
      presSubj:   ['quiera','quieras','quiera','queramos','queráis','quieran'],
      imperative: [null,'quiere','quiera','queramos','quered','quieran'],
    },
  };

  // ── Verbs whose yo-form gets a "g" inserted ────────────────
  // (not full irregulars, just yo-form irregularity)
  const YO_GO = {
    caer:'caigo', conocer:'conozco', traducir:'traduzco', conducir:'conduzco',
    producir:'produzco', parecer:'parezco', ofrecer:'ofrezco', agradecer:'agradezco',
    nacer:'nazco', crecer:'crezco', merecer:'merezco', obedecer:'obedezco',
    valer:'valgo',
  };

  // ── Orthographic rules (preserve sound across vowel changes) ─
  // -car → c becomes "qu" before e   (buscar → busqué, busque)
  // -gar → g becomes "gu" before e   (jugar → jugué, juegue)
  // -zar → z becomes "c"  before e   (empezar → empecé, empiece)
  // -guar → gu becomes "gü" before e (averiguar → averigüé)
  function fixOrthography(form, infinitive) {
    if (!form) return form;
    // Only matters when the next letter after the stem is 'e' or 'é' or 'í' (subj/pret-yo)
    // Use $ instead of \b because Spanish accented chars (é,á,í,ó,ú) aren't
    // \w in default JS regex, breaking word-boundary matching.
    if (infinitive.endsWith('car')) {
      return form.replace(/c(é|e|en|es|emos|éis)$/, (m, suf) => 'qu' + suf);
    }
    if (infinitive.endsWith('gar')) {
      return form.replace(/g(é|e|en|es|emos|éis)$/, (m, suf) => 'gu' + suf);
    }
    if (infinitive.endsWith('zar')) {
      return form.replace(/z(é|e|en|es|emos|éis)$/, (m, suf) => 'c' + suf);
    }
    if (infinitive.endsWith('guar')) {
      return form.replace(/gu(é|e|en|es|emos|éis)$/, (m, suf) => 'gü' + suf);
    }
    if (infinitive.endsWith('ger') || infinitive.endsWith('gir')) {
      return form.replace(/g(o|a|as|amos|áis|an)$/, (m, suf) => 'j' + suf);
    }
    if (infinitive.endsWith('guir')) {
      return form.replace(/gu(o|a|as|amos|áis|an)$/, (m, suf) => 'g' + suf);
    }
    return form;
  }

  // ── Stem change application ────────────────────────────────
  function applyStemChange(infinitive, stem, change) {
    if (!change) return stem;
    const [from, to] = change.split('>');
    // Replace the LAST occurrence of `from` in the stem (the stressed vowel)
    const idx = stem.lastIndexOf(from);
    if (idx < 0) return stem;
    return stem.slice(0, idx) + to + stem.slice(idx + from.length);
  }

  // Persons that take stem change in present indicative + imperative + present subj:
  //   yo, tú, él, ellos (positions 0, 1, 2, 5) — NOT nosotros (3) or vosotros (4)
  const STEM_PERSONS = new Set([0, 1, 2, 5]);

  // ── Conjugate ──────────────────────────────────────────────
  function conjugate(input) {
    if (!input || typeof input !== 'string') return null;
    const verb = input.toLowerCase().trim();

    // Hand-tabulated full irregular?
    if (IRREGULAR[verb]) {
      const irr = IRREGULAR[verb];
      return {
        infinitive: verb,
        translation: irr.translation,
        gerund: irr.gerund,
        participle: irr.participle,
        irregular: true,
        stemChange: null,
        tenses: {
          present: irr.present,
          preterite: irr.preterite,
          imperfect: irr.imperfect,
          future: irr.future,
          conditional: irr.conditional,
          presSubj: irr.presSubj,
          imperative: irr.imperative,
        },
      };
    }

    // Detect class
    const cls = verb.endsWith('ar') ? 'ar' : verb.endsWith('er') ? 'er' : verb.endsWith('ir') ? 'ir' : null;
    if (!cls) return null;
    const stem = verb.slice(0, -2);
    const ends = ENDINGS[cls];

    const change = STEM_CHANGE[verb] || null;
    const isIr = cls === 'ir';

    // Build present indicative
    const present = ends.present.map((suf, p) => {
      const useStem = STEM_PERSONS.has(p) ? applyStemChange(verb, stem, change) : stem;
      return useStem + suf;
    });
    if (YO_GO[verb]) present[0] = YO_GO[verb];

    // Preterite (regular for -ar/-er; -ir stem-changers shift in 3rd person)
    const preterite = ends.preterite.map((suf, p) => {
      let s = stem;
      if (isIr && change && (p === 2 || p === 5)) {
        // 3rd person sg + pl: stem change applies (e>i, o>u)
        const [from] = change.split('>');
        const to = from === 'e' ? 'i' : from === 'o' ? 'u' : null;
        if (to) s = applyStemChange(verb, stem, from + '>' + to);
      }
      return s + suf;
    });

    // Imperfect (always regular for -ar/-er/-ir)
    const imperfect = ends.imperfect.map((suf) => stem + suf);

    // Future + conditional use full infinitive as stem
    const future       = FUT_ENDINGS.map((suf) => verb + suf);
    const conditional  = COND_ENDINGS.map((suf) => verb + suf);

    // Present subjunctive
    // -ir stem-changers also shift in nosotros/vosotros (1st/2nd plural) — pidamos, durmamos
    const presSubj = ends.presSubj.map((suf, p) => {
      const stemChangeApplies = STEM_PERSONS.has(p) || (isIr && change && (p === 3 || p === 4));
      let s = stemChangeApplies ? applyStemChange(verb, stem, change) : stem;
      // -ir nosotros/vosotros use the secondary shift (e>i, o>u) like 3rd preterite
      if (isIr && change && (p === 3 || p === 4)) {
        const [from] = change.split('>');
        const to2 = from === 'e' ? 'i' : from === 'o' ? 'u' : null;
        if (to2) s = applyStemChange(verb, stem, from + '>' + to2);
      }
      // YO_GO verbs use the "g/zc" stem in subjunctive too
      if (YO_GO[verb]) {
        const yoStem = YO_GO[verb].replace(/o$/, '');
        s = yoStem;
      }
      return s + suf;
    });

    // Imperative (tú affirmative = 3rd person present indicative; usted = present subj)
    const tuStem = change ? applyStemChange(verb, stem, change) : stem;
    const imperative = [
      null,
      tuStem + (cls === 'ar' ? 'a' : 'e'),
      presSubj[2],   // usted
      presSubj[3],   // nosotros (let's...)
      stem + (cls === 'ar' ? 'ad' : cls === 'er' ? 'ed' : 'id'),
      presSubj[5],   // ustedes
    ];

    // Gerund (special for -ir stem-changers)
    let gerund = stem + ends.gerund;
    if (isIr && change) {
      const [from] = change.split('>');
      const to = from === 'e' ? 'i' : from === 'o' ? 'u' : null;
      if (to) gerund = applyStemChange(verb, stem, from + '>' + to) + ends.gerund;
    }

    // Past participle (regular)
    let participle = stem + ends.participle;
    // Common irregular participles even for "regular-looking" verbs
    const IRREG_PART = {
      escribir: 'escrito', describir: 'descrito',
      abrir: 'abierto', cubrir: 'cubierto', descubrir: 'descubierto',
      morir: 'muerto', romper: 'roto', resolver: 'resuelto',
      volver: 'vuelto', devolver: 'devuelto', envolver: 'envuelto',
      imprimir: 'impreso',
    };
    if (IRREG_PART[verb]) participle = IRREG_PART[verb];

    // Apply orthographic spelling rules across all generated forms
    const fix = (arr) => arr.map((f) => fixOrthography(f, verb));
    return {
      infinitive: verb,
      translation: '',  // unknown for non-irregulars; user can look up
      gerund: fixOrthography(gerund, verb),
      participle: fixOrthography(participle, verb),
      irregular: false,
      stemChange: change,
      tenses: {
        present:    fix(present),
        preterite:  fix(preterite),
        imperfect:  imperfect, // imperfect endings start with vowels — no orthographic conflict
        future:     future,    // future uses full infinitive — no conflict
        conditional: conditional,
        presSubj:   fix(presSubj),
        imperative: imperative.map((f) => f ? fixOrthography(f, verb) : null),
      },
    };
  }

  // ── Common verbs registry (for the lookup UI) ──────────────
  // Infinitive → English meaning. Used to auto-suggest in the input.
  const COMMON_VERBS = {
    // Top tier — most frequent
    ser:'to be (essence)', estar:'to be (state)', tener:'to have', haber:'have (aux)',
    hacer:'to do/make', decir:'to say', ir:'to go', ver:'to see', dar:'to give',
    saber:'to know (fact)', querer:'to want/love', poder:'can/be able',
    poner:'to put', salir:'to leave', traer:'to bring', venir:'to come',
    oír:'to hear',
    // High frequency
    hablar:'to speak', comer:'to eat', vivir:'to live', escribir:'to write',
    leer:'to read', estudiar:'to study', trabajar:'to work', llamar:'to call',
    pasar:'to pass/spend', llegar:'to arrive', llevar:'to take/wear',
    quedar:'to stay/remain', dejar:'to leave/let', creer:'to believe',
    encontrar:'to find', esperar:'to wait/hope', necesitar:'to need',
    pensar:'to think', preferir:'to prefer', sentir:'to feel',
    pedir:'to ask for', servir:'to serve', dormir:'to sleep', morir:'to die',
    abrir:'to open', cerrar:'to close', empezar:'to begin', comenzar:'to begin',
    terminar:'to finish', acabar:'to end/finish', volver:'to return',
    devolver:'to return (give back)', recordar:'to remember',
    olvidar:'to forget', perder:'to lose',
    // Family / daily
    amar:'to love', querer:'to want/love', cuidar:'to care for',
    ayudar:'to help', cocinar:'to cook', limpiar:'to clean', lavar:'to wash',
    levantarse:'to get up', acostarse:'to go to bed', vestirse:'to get dressed',
    ducharse:'to shower', desayunar:'to have breakfast', almorzar:'to have lunch',
    cenar:'to have dinner', descansar:'to rest', viajar:'to travel',
    caminar:'to walk', correr:'to run', manejar:'to drive', conducir:'to drive',
    aprender:'to learn', enseñar:'to teach', entender:'to understand',
    explicar:'to explain', preguntar:'to ask', responder:'to answer',
    contar:'to count/tell', cantar:'to sing', bailar:'to dance',
    jugar:'to play (game)', tocar:'to play (music)/touch',
    comprar:'to buy', vender:'to sell', pagar:'to pay',
    abrir:'to open', cerrar:'to close', romper:'to break', arreglar:'to fix',
    // Emotional / affective
    sentir:'to feel', alegrarse:'to be glad', enojarse:'to get angry',
    preocuparse:'to worry', tranquilizarse:'to calm down',
    extrañar:'to miss (someone)', perdonar:'to forgive', disculparse:'to apologize',
    agradecer:'to thank', bendecir:'to bless',
    // Movement
    subir:'to go up', bajar:'to go down', entrar:'to enter', salir:'to leave',
    cruzar:'to cross', regresar:'to return', volar:'to fly', nadar:'to swim',
    // Cognition
    pensar:'to think', creer:'to believe', conocer:'to know (someone)',
    saber:'to know (fact)', recordar:'to remember', olvidar:'to forget',
  };

  // Lookup by partial match — returns up to 12 suggestions
  function lookupVerb(query) {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    const results = [];
    for (const v of Object.keys(COMMON_VERBS)) {
      if (v.startsWith(q)) results.push({ verb: v, meaning: COMMON_VERBS[v] });
    }
    // Also include any verb in the IRREGULAR table
    for (const v of Object.keys(IRREGULAR)) {
      if (v.startsWith(q) && !results.find((r) => r.verb === v)) {
        results.push({ verb: v, meaning: IRREGULAR[v].translation });
      }
    }
    return results.slice(0, 12);
  }

  // Expose
  if (typeof window !== 'undefined') {
    window.conjugate = conjugate;
    window.lookupVerb = lookupVerb;
    window.COMMON_VERBS = COMMON_VERBS;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { conjugate, lookupVerb, COMMON_VERBS };
  }
})();
