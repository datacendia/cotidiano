// Cotidiano — app logic
// State persisted to localStorage. No backend, no tracking.

const STORE_KEY = 'cotidiano:v1';
const defaultState = {
  favorites: {},      // phraseId -> true
  learned: {},        // phraseId -> true
  streakDays: 0,
  lastVisit: null,
  practice: {},       // phraseId -> { dueAt: ms, interval: days, ease: 2.5, reps: int }
  customPhrases: [],  // [{ en, es, ph, note, createdAt }]
  captures: [],       // [{ id, ts, transcript, translation, speaker, note, linkedPhraseId, timesHeard }]
  settings: {
    userName: '',     // asked on first launch, used in the greeting
    speed: 0.85,
    voice: 'auto',
    hideLearned: false,
    phoneticFirst: false,
    showEnPhonetic: true, // show Spanish-readable English pronunciation under English
    viewerReads: 'both',  // 'en' = native English (hide en-ph), 'es' = native Spanish (hide es-ph), 'both' = show both
    direction: 'en-es',   // 'en-es' = English prompt, Spanish answer · 'es-en' = reversed
  },
  lastSection: null,    // { groupKey, sectionId, ts } — most recently opened section, for "continue where you left off"
};

let state = loadState();
let currentVoice = null;
let voicesReady = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      settings: { ...defaultState.settings, ...(parsed.settings || {}) },
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {}
}

// ── Streak tracking ────────────────────────────────────────
function tickStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastVisit === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (state.lastVisit === yesterday) state.streakDays += 1;
  else if (state.lastVisit !== today) state.streakDays = 1;
  state.lastVisit = today;
  saveState();
}

// ── Phrase ID + flattening helpers ────────────────────────
function phraseId(phrase) {
  // Stable id from Spanish text
  return 'p_' + phrase.es.toLowerCase().replace(/[^a-z0-9áéíóúñü]/g, '').slice(0, 32);
}

function allPhrases() {
  const out = [];
  for (const groupKey of Object.keys(DATA)) {
    const group = DATA[groupKey];
    for (const section of group.sections) {
      for (const p of section.phrases) {
        out.push({ ...p, _section: section.title, _group: groupKey, _id: phraseId(p) });
      }
    }
  }
  return out;
}

// ── TTS ────────────────────────────────────────────────────
// Score a Spanish voice by quality heuristics so we pick the best one the OS
// actually has installed. Higher = better. Lima-tuned: es-PE ranks above es-ES.
function voiceScore(v) {
  const langPriority = { 'es-PE': 100, 'es-MX': 95, 'es-CO': 90, 'es-419': 88, 'es-AR': 85, 'es-CL': 80, 'es-US': 75, 'es-ES': 60, 'es': 50 };
  let score = langPriority[v.lang] != null ? langPriority[v.lang] : (v.lang.startsWith('es') ? 40 : 0);
  const name = (v.name || '').toLowerCase();
  if (/(natural|neural|enhanced|premium|online|wavenet|studio)/.test(name)) score += 30;
  if (/(paulina|mónica|monica|juan|jorge|sofía|sofia|miguel|elena|laura|diego|isabel)/.test(name)) score += 15;
  if (/(espeak|compact|microsoft sabina)/.test(name)) score -= 20;
  if (v.localService) score += 5;
  if (v.default) score += 2;
  return score;
}

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  const sel = document.getElementById('voice-select');
  if (!voices.length) return;
  voicesReady = true;
  const spanishVoices = voices.filter((v) => v.lang.startsWith('es'));
  spanishVoices.sort((a, b) => voiceScore(b) - voiceScore(a));
  if (sel) {
    const best = spanishVoices[0];
    sel.innerHTML = '<option value="auto">Auto (best match)</option>' +
      spanishVoices.map((v) => `<option value="${v.name}">${v.lang} — ${v.name}${v === best ? ' ★' : ''}</option>`).join('');
    sel.value = state.settings.voice || 'auto';
  }
  pickVoice();
}

function pickVoice() {
  const voices = speechSynthesis.getVoices();
  const target = state.settings.voice;
  if (target && target !== 'auto') {
    currentVoice = voices.find((v) => v.name === target) || null;
    if (currentVoice) return;
  }
  const spanishVoices = voices.filter((v) => v.lang.startsWith('es'));
  spanishVoices.sort((a, b) => voiceScore(b) - voiceScore(a));
  currentVoice = spanishVoices[0] || null;
}

let playingBtn = null;
function speak(text, opts = {}) {
  if (!('speechSynthesis' in window)) {
    alert('Your browser does not support speech. Update to a recent Chrome or Safari.');
    return;
  }
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = currentVoice ? currentVoice.lang : 'es-MX';
  if (currentVoice) utter.voice = currentVoice;
  utter.rate = opts.slow ? Math.max(0.5, state.settings.speed - 0.2) : state.settings.speed;
  utter.pitch = 1.0;
  if (opts.btn) {
    playingBtn = opts.btn;
    opts.btn.classList.add('playing');
  }
  utter.onend = utter.onerror = () => {
    if (playingBtn) playingBtn.classList.remove('playing');
    playingBtn = null;
  };
  speechSynthesis.speak(utter);
}

// ── Rendering ──────────────────────────────────────────────
const el = (id) => document.getElementById(id);

// Inline SVG icon set — keeps the UI free of cheap-looking emoji
const ICONS = {
  play:    '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  speak:   '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  slow:    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  star:    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 6.2 6.7.6-5.1 4.5 1.6 6.6L12 17.5 6.1 20.9l1.6-6.6L2.6 9.8l6.7-.6z"/></svg>',
  starOn:  '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 3l2.7 6.2 6.7.6-5.1 4.5 1.6 6.6L12 17.5 6.1 20.9l1.6-6.6L2.6 9.8l6.7-.6z"/></svg>',
  check:   '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-11"/></svg>',
  voice:   '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-4.5-7-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-7 11-7 11"/></svg>',
  // Bottom nav
  navHome:     '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  navLive:     '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 12a10 10 0 0 1 20 0M5 12a7 7 0 0 1 14 0M9 12a3 3 0 0 1 6 0"/></svg>',
  navPractice: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
  navSaved:    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 6.2 6.7.6-5.1 4.5 1.6 6.6L12 17.5 6.1 20.9l1.6-6.6L2.6 9.8l6.7-.6z"/></svg>',
  navAdd:      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
};

function greetingForTime() {
  const h = new Date().getHours();
  if (h < 6)  return { greet: 'Buenas noches', hint: 'Late night. Try the bedroom section.' };
  if (h < 12) return { greet: 'Buenos días',  hint: 'Start the day right — morning + breakfast phrases below.' };
  if (h < 19) return { greet: 'Buenas tardes', hint: 'Try work or lunch phrases.' };
  return { greet: 'Buenas noches', hint: 'Family time. Try kids, dinner, or bedtime phrases.' };
}

function suggestForTime() {
  const h = new Date().getHours();
  // Personalise the suggestion text using saved name. If unset, fall back to neutral.
  const youHave = (msg) => msg; // placeholder for future name interpolation if needed
  if (h < 6) return { groupKey: 'daily', sectionId: 'bedroom', ttl: 'Right now', msg: youHave('Quiet talk with Stephania — bedroom phrases.') };
  if (h < 9) return { groupKey: 'daily', sectionId: 'waking', ttl: 'Morning routine', msg: youHave('Wake up Joaquín and Emiliano with the right phrases.') };
  if (h < 11) return { groupKey: 'daily', sectionId: 'breakfast', ttl: 'Breakfast time', msg: youHave('Breakfast with the boys — try the breakfast and kids-morning phrases.') };
  if (h < 13) return { groupKey: 'daily', sectionId: 'office', ttl: 'Office hours', msg: youHave('Office small talk and meetings at Datacendia.') };
  if (h < 15) return { groupKey: 'daily', sectionId: 'lunch', ttl: 'Almuerzo', msg: youHave('Lunch phrases — order, share, chat.') };
  if (h < 18) return { groupKey: 'work', sectionId: 'meetings', ttl: 'Work mode', msg: youHave('Tech meetings and client conversations.') };
  if (h < 20) return { groupKey: 'daily', sectionId: 'groceries', ttl: 'On the way home', msg: youHave('Groceries, bus, taxi — the run-home phrases.') };
  if (h < 22) return { groupKey: 'parenting', sectionId: 'bedtime-routine', ttl: 'Family evening', msg: youHave('Bath, story, lights out — the bedtime routine.') };
  return { groupKey: 'daily', sectionId: 'bedroom', ttl: 'Wind down', msg: youHave('Quiet phrases for after the kids are asleep.') };
}

// Pick a single "hero" phrase to surface today — deterministic per day, biased
// toward phrases the user has actually saved or those tied to upcoming birthdays.
function heroPhraseForToday() {
  if (typeof BIRTHDAYS !== 'undefined') {
    const today = new Date();
    for (const b of BIRTHDAYS) {
      if (b.memoriam) continue;
      const d = daysUntilBirthday(b.date, today);
      if (d === 0) {
        return { es: `¡Feliz cumpleaños, ${b.name}!`, en: `Happy birthday, ${b.name}!`, why: `It's ${b.name}'s birthday today.` };
      }
      if (d === 1) {
        return { es: `Mañana cumple ${b.name}`, en: `Tomorrow is ${b.name}'s birthday`, why: `${b.name}'s birthday is tomorrow — prep.` };
      }
    }
  }
  return null;
}

function renderHome() {
  const g = greetingForTime();
  el('greet-h1').textContent = `${g.greet}, ${state.settings.userName || 'amigo'}`;
  el('greet-hint').textContent = g.hint;
  el('streak-num').textContent = state.streakDays;

  // Suggestion
  const s = suggestForTime();
  el('suggest-box').innerHTML = `
    <div class="suggest" id="suggest-card">
      <div class="ttl">${s.ttl}</div>
      <div class="msg">${s.msg}</div>
      <button class="go" data-group="${s.groupKey}" data-section="${s.sectionId}">Open →</button>
    </div>
  `;
  el('suggest-card').querySelector('.go').addEventListener('click', (e) => {
    const g = e.currentTarget.dataset.group;
    const s = e.currentTarget.dataset.section;
    showSection(g, s);
  });

  // Birthdays widget
  renderBirthdaysBox();

  // "Heard at home" card — shows recent captures with deep link to feed
  renderCapturesHomeCard();

  // Weekly digest — quiet retention without gamification
  renderWeeklyDigest();

  // Hero phrase of the day (birthday, today's special, etc.)
  renderHeroPhrase();

  // "Continue where you left off" — last visited section within last 48h
  renderContinueCard();

  // Practice CTA — show count due
  el('due-count').textContent = countDuePhrases();

  // Render all groups in one scroll
  renderAllGroups();

  // Dialogues — show top 2 across all groups
  renderDialogues('daily');
}

// ── Family birthdays ───────────────────────────────────────
function daysUntilBirthday(mmdd, today = new Date()) {
  const [m, d] = mmdd.split('-').map(Number);
  const yr = today.getFullYear();
  let next = new Date(yr, m - 1, d);
  // zero out time on today
  const t = new Date(yr, today.getMonth(), today.getDate());
  if (next < t) next = new Date(yr + 1, m - 1, d);
  return Math.round((next - t) / 86400000);
}

function ageOnNextBirthday(birthYear, mmdd, today = new Date()) {
  if (!birthYear) return null;
  const [m, d] = mmdd.split('-').map(Number);
  const yr = today.getFullYear();
  const t = new Date(yr, today.getMonth(), today.getDate());
  const thisYearBday = new Date(yr, m - 1, d);
  const targetYear = thisYearBday < t ? yr + 1 : yr;
  return targetYear - birthYear;
}

function spanishMonth(num) {
  return ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][num - 1];
}

// Cohort-aware birthday phrase. Older relatives get formal usted, peers get casual tú.
function birthdayPhraseFor(b) {
  const name = b.name.replace(/\s*\(.*?\)\s*/g, '').trim();
  switch (b.cohort) {
    case 'wife':
      return '¡Feliz cumpleaños, mi amor!';
    case 'elder-inlaw':
      // Formal usted — for suegros (~60yo)
      return `Le deseo un feliz cumpleaños, ${b.relES}`;
    case 'abuelo':
      // Most formal — for grandparents
      return `¡Feliz cumpleaños, ${name}! Le deseo lo mejor.`;
    case 'elder':
      // Semi-formal — for tíos/tías of parents' generation
      return `¡Feliz cumpleaños, ${name}! Que cumpla muchos más.`;
    case 'teen':
      return `¡Feliz cumple, ${name}!`;
    case 'peer':
      return `¡Feliz cumple, ${name}!`;
    default:
      return `¡Feliz cumpleaños, ${name}!`;
  }
}

function renderBirthdaysBox() {
  const box = el('birthdays-box');
  if (!box || typeof BIRTHDAYS === 'undefined') return;
  const today = new Date();
  const enriched = BIRTHDAYS.map((b) => ({
    ...b,
    days: daysUntilBirthday(b.date, today),
    age: ageOnNextBirthday(b.year, b.date, today),
  })).sort((a, b) => a.days - b.days);

  // Today's celebrants (non-memoriam)
  const todays = enriched.filter((b) => b.days === 0 && !b.memoriam);
  // Memoriam today
  const memoriamToday = enriched.filter((b) => b.days === 0 && b.memoriam);
  // Next 3 non-memoriam, not today
  const upcoming = enriched.filter((b) => b.days > 0 && !b.memoriam).slice(0, 3);

  if (!todays.length && !memoriamToday.length && !upcoming.length) {
    box.innerHTML = '';
    return;
  }

  let html = '<div class="bday-card">';
  html += '<div class="bday-head">Cumpleaños</div>';

  if (todays.length) {
    html += '<div class="bday-today">';
    todays.forEach((b) => {
      const ageBit = b.age ? ` cumple <strong>${b.age}</strong>` : '';
      const phraseES = birthdayPhraseFor(b);
      html += `
        <div class="bday-today-row">
          <div class="bday-today-line"><span class="bday-today-pill">HOY</span> <strong>${b.name}</strong>${ageBit} <span class="bday-rel">· ${b.relES}</span></div>
          <div class="bday-today-phrase">
            <span class="bday-es">${phraseES}</span>
            <button class="bday-play" aria-label="Reproducir" data-text="${escapeAttr(phraseES)}">${ICONS.play}</button>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }

  if (memoriamToday.length) {
    memoriamToday.forEach((b) => {
      html += `<div class="bday-memoriam"><span class="bday-memoriam-dot"></span> Hoy recordamos a <strong>${b.name}</strong> · ${b.relES}</div>`;
    });
  }

  if (upcoming.length) {
    html += '<div class="bday-upcoming">';
    upcoming.forEach((b) => {
      const [m, d] = b.date.split('-').map(Number);
      const dateStr = `${d} de ${spanishMonth(m)}`;
      const dayLbl = b.days === 1 ? 'mañana' : `en ${b.days} días`;
      html += `
        <div class="bday-row">
          <div class="bday-name">${b.name} <span class="bday-rel">· ${b.relES}</span></div>
          <div class="bday-when">${dateStr} <span class="bday-days">${dayLbl}</span></div>
        </div>
      `;
    });
    html += '</div>';
  }

  html += '</div>';
  box.innerHTML = html;

  // Wire up speak buttons
  box.querySelectorAll('.bday-play').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      speak(b.dataset.text, { btn: b });
    });
  });
}

// ── Weekly digest ──────────────────────────────────────────
// Subtle, non-gamified retention. Counts what the user actually did this week
// from existing state (captures, learned, practice). Only renders when there
// is something to celebrate; otherwise stays out of the way.
// ── Hero phrase + Continue card ──────────────────────────
function renderHeroPhrase() {
  const slot = el('hero-phrase');
  if (!slot) return;
  const hero = heroPhraseForToday();
  if (!hero) { slot.innerHTML = ''; return; }
  const ph = (typeof spanishToPhonetic === 'function') ? spanishToPhonetic(hero.es) : '';
  slot.innerHTML = `
    <div class="hero-card">
      <div class="hero-eyebrow">Today</div>
      <div class="hero-why">${hero.why}</div>
      <div class="hero-es">${hero.es}</div>
      ${ph ? `<div class="hero-ph">${ph}</div>` : ''}
      <div class="hero-en">${hero.en}</div>
      <button class="hero-play act primary" type="button" aria-label="Play">
        ${ICONS.play}<span>Play</span>
      </button>
    </div>
  `;
  const btn = slot.querySelector('.hero-play');
  if (btn) btn.addEventListener('click', () => speak(hero.es, { btn }));
}

function renderContinueCard() {
  const slot = el('continue-card');
  if (!slot) return;
  const last = state.lastSection;
  // Show only if visited within the last 48 hours and section still exists
  if (!last || !last.groupKey || !last.sectionId) { slot.innerHTML = ''; return; }
  if (Date.now() - (last.ts || 0) > 48 * 3600 * 1000) { slot.innerHTML = ''; return; }
  const group = DATA[last.groupKey];
  if (!group) { slot.innerHTML = ''; return; }
  const section = group.sections.find((s) => s.id === last.sectionId);
  if (!section) { slot.innerHTML = ''; return; }
  slot.innerHTML = `
    <button class="continue-card" type="button" data-group="${last.groupKey}" data-section="${last.sectionId}">
      <div class="continue-eyebrow">Continue where you left off</div>
      <div class="continue-body">
        <span class="continue-icon">${section.icon || group.icon || ''}</span>
        <span class="continue-title">${group.title} → ${section.title}</span>
      </div>
      <div class="continue-arrow">→</div>
    </button>
  `;
  slot.querySelector('.continue-card').addEventListener('click', (e) => {
    showSection(e.currentTarget.dataset.group, e.currentTarget.dataset.section);
  });
}

function renderWeeklyDigest() {
  const slot = el('weekly-digest');
  if (!slot) return;
  const weekAgo = Date.now() - 7 * 86400000;

  // Captures this week (state.captures has ts on each)
  const capturesThisWeek = (state.captures || []).filter((c) => c && c.ts && c.ts > weekAgo).length;

  // Phrases marked "learned" this week (timestamp added in toggleLearned)
  const learnedThisWeek = Object.values(state.learned || {})
    .filter((v) => typeof v === 'number' && v > weekAgo).length;

  // Practice sessions this week (state.practice[id].lastAt added in ratePhrase)
  const practicedThisWeek = Object.values(state.practice || {})
    .filter((r) => r && r.lastAt && r.lastAt > weekAgo).length;

  if (!capturesThisWeek && !learnedThisWeek && !practicedThisWeek) {
    slot.innerHTML = '';
    return;
  }

  const bits = [];
  if (learnedThisWeek)   bits.push(`<strong>${learnedThisWeek}</strong> learned`);
  if (practicedThisWeek) bits.push(`<strong>${practicedThisWeek}</strong> practiced`);
  if (capturesThisWeek)  bits.push(`<strong>${capturesThisWeek}</strong> captured`);

  slot.innerHTML = `
    <div class="week-card">
      <div class="week-head">This week</div>
      <div class="week-body">${bits.join(' · ')}</div>
    </div>
  `;
}

function renderCapturesHomeCard() {
  const box = el('captures-card');
  if (!box) return;
  const list = (state.captures || []).slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
  if (!list.length) {
    box.innerHTML = `
      <div class="captures-home empty-state">
        <div class="captures-home-head">
          <span class="captures-home-eyebrow">Heard at home</span>
          <span class="captures-home-hint">Live notebook</span>
        </div>
        <div class="captures-home-body">
          <p>Tap the floating mic button when Stephania, the kids, or family say something you want to remember. The app records 30s, transcribes the Spanish, and saves it forever.</p>
        </div>
      </div>
    `;
    return;
  }
  const recent = list.slice(0, 3);
  const items = recent.map((c) => {
    const sp = CAPTURE_SPEAKERS.find((s) => s.id === c.speaker) || { emoji: '🗣', label: 'Other' };
    const when = formatCaptureRelative(c.ts);
    return `
      <div class="captures-home-item">
        <div class="captures-home-meta">${sp.emoji} ${sp.label} · ${when}</div>
        <div class="captures-home-es">${escapeHtml(c.transcript)}</div>
      </div>
    `;
  }).join('');
  const more = list.length > 3 ? `<button class="captures-home-more" id="captures-card-cta">View all ${list.length} →</button>`
                               : `<button class="captures-home-more" id="captures-card-cta">View feed →</button>`;
  box.innerHTML = `
    <div class="captures-home">
      <div class="captures-home-head">
        <span class="captures-home-eyebrow">Heard at home</span>
        <span class="captures-home-hint">${list.length} captured</span>
      </div>
      <div class="captures-home-body">
        ${items}
      </div>
      ${more}
    </div>
  `;
  const cta = el('captures-card-cta');
  if (cta) cta.addEventListener('click', () => { showView('captures'); renderCapturesFeed(); });
}

function formatCaptureRelative(ts) {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.round(hrs / 24);
  if (days < 7) return days + 'd ago';
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function renderAllGroups() {
  const container = el('all-groups');
  const order = ['daily', 'personal', 'work', 'extra', 'out', 'parenting', 'culture', 'family', 'kids', 'custom'];
  const html = order.map((groupKey) => {
    const group = DATA[groupKey];
    if (!group) return '';
    // Skip custom if empty
    if (groupKey === 'custom' && (!group.sections[0] || !group.sections[0].phrases.length)) return '';
    return `
      <div class="section group-block" data-group="${groupKey}">
        <div class="group-head">
          <span class="group-eyebrow">${String(group.title).toUpperCase()}</span>
        </div>
        <div class="cat-grid">
          ${group.sections.map((s) => `
            <button class="cat-card" data-group="${groupKey}" data-section="${s.id}">
              <div class="label">${s.title}</div>
              <div class="count">${s.phrases.length} phrases</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
  container.innerHTML = html;
  container.querySelectorAll('.cat-card').forEach((c) => {
    c.addEventListener('click', () => showSection(c.dataset.group, c.dataset.section));
  });
}

function renderCategories(groupKey) {
  // Legacy single-group view kept for showSection back navigation
  renderAllGroups();
}

function renderDialogues(groupKey) {
  const dlgList = el('dialogue-list');
  const dialogues = (DIALOGUES[groupKey] || []).slice(0, 2);
  if (!dialogues.length) { dlgList.innerHTML = ''; return; }
  dlgList.innerHTML = dialogues.map((d, i) => `
    <div class="dialogue">
      <div class="dialogue-title">${d.title}</div>
      ${d.lines.map((ln) => `
        <div class="dialogue-line">
          <div class="who">${ln.who}</div>
          <div class="es"><button class="mini-play" aria-label="Reproducir" data-text="${escapeAttr(ln.es)}">${ICONS.play}</button> ${ln.es}</div>
          <div class="ph">${ln.ph}</div>
          <div class="en">${ln.en}</div>
        </div>
      `).join('')}
    </div>
  `).join('');
  dlgList.querySelectorAll('.mini-play').forEach((b) => {
    b.addEventListener('click', (e) => { e.stopPropagation(); speak(b.dataset.text, { btn: b }); });
  });
}

function escapeAttr(s) {
  return s.replace(/"/g, '&quot;');
}

let currentSectionGroup = null;
let currentSectionId = null;

function showSection(groupKey, sectionId) {
  const group = DATA[groupKey];
  const section = group.sections.find((s) => s.id === sectionId);
  if (!section) return;
  currentSectionGroup = groupKey;
  currentSectionId = sectionId;
  // Persist for "continue where you left off" — used by renderHome on next launch
  state.lastSection = { groupKey, sectionId, ts: Date.now() };
  saveState();
  showView('list');
  el('crumb-cat').textContent = `${group.title} → ${section.title}`;
  renderPhrases(section.phrases);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPhrases(phrases) {
  const container = el('phrases');
  const ordered = state.settings.phoneticFirst
    ? phrases
    : phrases;
  const filtered = state.settings.hideLearned
    ? phrases.filter((p) => !state.learned[phraseId(p)])
    : phrases;
  if (!filtered.length) {
    container.innerHTML = `<div class="empty"><h3>All learned</h3><p>You've marked every phrase here as learned. Turn off “Hide learned” in settings to see them again.</p></div>`;
    return;
  }
  container.innerHTML = filtered.map((p) => renderPhraseCard(p)).join('');
  attachPhraseEvents(container);
}

function renderPhraseCard(p) {
  const id = phraseId(p);
  const isFav = !!state.favorites[id];
  const isLearned = !!state.learned[id];
  const phonFirst = state.settings.phoneticFirst;
  const esFirst = state.settings.direction === 'es-en';
  // Phonetic visibility — depends on viewer's native language
  // - 'en' reader natively reads English → needs Spanish phonetics, doesn't need English phonetics
  // - 'es' reader natively reads Spanish → needs English phonetics, doesn't need Spanish phonetics
  // - 'both' shows both lines (default — for mixed household or learners of both)
  const viewer = state.settings.viewerReads || 'both';
  const showEsPh = viewer !== 'es';
  const showEnPh = state.settings.showEnPhonetic !== false && viewer !== 'en';
  const enPh = showEnPh ? enPhonetic(p.en) : '';
  const enPhHtml = enPh ? `<div class="ph en-ph">${enPh}</div>` : '';
  const esPhHtml = showEsPh ? `<div class="ph">${p.ph}</div>` : '';
  const noteHtml = p.note ? `<div class="note">${p.note}</div>` : '';
  const hasVoice = !!voiceBankIndex[id];

  // Render order depends on direction
  let body;
  if (esFirst) {
    // Spanish-first: large Spanish on top, phonetic, English smaller below + en-phonetic for ES speakers
    body = `
      <div class="es">${p.es}</div>
      ${esPhHtml}
      <div class="en" style="margin-top:8px">${p.en}</div>
      ${enPhHtml}
    `;
  } else if (phonFirst) {
    const esPhBig = showEsPh ? `<div class="ph" style="font-size:1.3rem;margin-bottom:8px">${p.ph}</div>` : '';
    body = `
      <div class="en">${p.en}</div>
      ${enPhHtml}
      ${esPhBig}
      <div class="es" style="font-size:1.15rem;color:var(--mu)">${p.es}</div>
    `;
  } else {
    body = `
      <div class="en">${p.en}</div>
      ${enPhHtml}
      <div class="es">${p.es}</div>
      ${esPhHtml}
    `;
  }

  // Register variants — same phrase, different register/audience
  const registerHtml = renderRegisterChips(id);

  return `
    <div class="phrase ${isLearned ? 'learned' : ''}" data-id="${id}">
      ${body}
      ${registerHtml}
      ${noteHtml}
      <div class="phrase-actions">
        <button class="act primary play">${ICONS.play}<span>Play</span></button>
        <button class="act slow">${ICONS.slow}<span>Slow</span></button>
        <button class="act try">${ICONS.speak}<span>Speak</span></button>
        <button class="act voicebank ${hasVoice ? 'has-voice' : ''}">${ICONS.voice}<span>${hasVoice ? 'Family' : 'Voice'}</span></button>
        <button class="act star ${isFav ? 'on' : ''}">${isFav ? ICONS.starOn : ICONS.star}<span>${isFav ? 'Saved' : 'Save'}</span></button>
        <button class="act check ${isLearned ? 'on' : ''}">${isLearned ? ICONS.check : ''}<span>${isLearned ? 'Learned' : 'Got it'}</span></button>
      </div>
    </div>
  `;
}

function getRegisterVariants(phraseId) {
  if (typeof window !== 'undefined' && window.REGISTER_VARIANTS) {
    return window.REGISTER_VARIANTS[phraseId] || null;
  }
  return null;
}

function renderRegisterChips(phraseId) {
  const variants = getRegisterVariants(phraseId);
  if (!variants || !variants.length) return '';
  const chips = variants.map((v, i) => {
    const reg = v.reg || 'casual';
    return `<button type="button" class="register-chip" data-reg="${reg}" data-vi="${i}">${escapeHtml(v.label)}</button>`;
  }).join('');
  return `
    <div class="register-chips" data-pid="${phraseId}">
      <button type="button" class="register-chip active" data-reg="default" data-vi="-1">📋 default</button>
      ${chips}
    </div>
    <div class="register-when" data-for="${phraseId}" style="display:none"></div>
  `;
}

function attachRegisterEvents(card) {
  const chipsEl = card.querySelector('.register-chips');
  if (!chipsEl) return;
  const phraseId = chipsEl.dataset.pid;
  const variants = getRegisterVariants(phraseId);
  if (!variants) return;
  const esEl = card.querySelector('.es');
  const phEl = card.querySelector('.ph:not(.en-ph)');
  const whenEl = card.querySelector(`.register-when[data-for="${phraseId}"]`);
  // Save originals so we can restore on "default"
  const origEs = esEl ? esEl.textContent : '';
  const origPh = phEl ? phEl.textContent : '';

  chipsEl.querySelectorAll('.register-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      chipsEl.querySelectorAll('.register-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const idx = parseInt(chip.dataset.vi, 10);
      let activeEs, activePh;
      if (idx < 0) {
        activeEs = origEs; activePh = origPh;
        if (whenEl) whenEl.style.display = 'none';
      } else {
        const v = variants[idx];
        activeEs = v.es; activePh = v.ph;
        if (esEl) esEl.textContent = v.es;
        if (phEl) phEl.textContent = v.ph;
        if (whenEl) {
          whenEl.textContent = v.when ? '“' + v.when + '”' : '';
          whenEl.style.display = v.when ? '' : 'none';
        }
      }
      if (esEl) esEl.textContent = activeEs;
      if (phEl) phEl.textContent = activePh;
      // Speak the active variant immediately so the user hears the difference
      speak(activeEs, { btn: chip });
      // Stash on the card so play/slow buttons use the active variant
      card.dataset.activeEs = activeEs;
    });
  });
}

function attachPhraseEvents(container) {
  container.querySelectorAll('.phrase').forEach((card) => {
    const id = card.dataset.id;
    const allP = allPhrases();
    const phrase = allP.find((p) => p._id === id);
    if (!phrase) return;
    attachRegisterEvents(card);
    const playBtn = card.querySelector('.play');
    const slowBtn = card.querySelector('.slow');
    const tryBtn = card.querySelector('.try');
    const vbBtn = card.querySelector('.voicebank');
    const starBtn = card.querySelector('.star');
    const checkBtn = card.querySelector('.check');

    const activeText = () => card.dataset.activeEs || phrase.es;
    const playPhrase = (slow = false) => {
      const text = activeText();
      // Family voice only plays for the original phrase, not register variants
      if (voiceBankIndex[id] && !slow && text === phrase.es) {
        playFamilyVoice(id, playBtn);
      } else {
        speak(text, { btn: playBtn, slow });
      }
    };

    playBtn.addEventListener('click', () => playPhrase(false));
    slowBtn.addEventListener('click', () => speak(activeText(), { btn: slowBtn, slow: true }));

    if (tryBtn) tryBtn.addEventListener('click', () => openCoach(phrase));
    if (vbBtn) vbBtn.addEventListener('click', () => openVoiceBank(phrase));

    // Tap card body (not buttons or chips) = play
    card.addEventListener('click', (e) => {
      if (e.target.closest('.phrase-actions')) return;
      if (e.target.closest('.register-chips')) return;
      playPhrase(false);
    });

    starBtn.addEventListener('click', () => {
      if (state.favorites[id]) delete state.favorites[id];
      else state.favorites[id] = true;
      saveState();
      starBtn.classList.toggle('on');
      starBtn.innerHTML = (state.favorites[id] ? ICONS.starOn : ICONS.star) + '<span>' + (state.favorites[id] ? 'Saved' : 'Save') + '</span>';
    });

    checkBtn.addEventListener('click', () => {
      if (state.learned[id]) delete state.learned[id];
      else state.learned[id] = Date.now(); // timestamp powers "learned this week" digest
      saveState();
      checkBtn.classList.toggle('on');
      checkBtn.innerHTML = (state.learned[id] ? ICONS.check : '') + '<span>' + (state.learned[id] ? 'Learned' : 'Got it') + '</span>';
      card.classList.toggle('learned');
    });
  });
}

// ── Views ──────────────────────────────────────────────────
function showView(name) {
  const views = ['home', 'list', 'search', 'favorites', 'practice', 'add', 'live', 'captures'];
  views.forEach((v) => {
    const node = el('view-' + v);
    if (node) node.style.display = v === name ? '' : 'none';
  });
  // Hide stuck FAB inside Live view (it's redundant there)
  const stuckFab = el('stuck-fab');
  if (stuckFab) stuckFab.style.display = name === 'live' ? 'none' : '';
  // Capture FAB visible everywhere except inside the Capture sheet itself
  const capFab = el('cap-fab');
  if (capFab) capFab.style.display = name === 'live' ? 'none' : '';
}

// ── Search ─────────────────────────────────────────────────
let searchTimeout = null;
function handleSearch(q) {
  q = q.trim().toLowerCase();
  if (!q) { showView('home'); el('search-row').classList.add('hidden'); return; }
  showView('search');
  const all = allPhrases();
  const results = all.filter((p) =>
    p.en.toLowerCase().includes(q) ||
    p.es.toLowerCase().includes(q) ||
    p.ph.toLowerCase().includes(q)
  ).slice(0, 60);
  const container = el('search-results');
  if (!results.length) {
    container.innerHTML = `<div class="empty"><h3>No matches</h3><p>Try a different word or check spelling.</p></div>`;
    return;
  }
  container.innerHTML = `<div class="crumbs"><span>${results.length} matches for "<strong>${escapeAttr(q)}</strong>"</span></div>` +
    results.map((p) => renderPhraseCard(p)).join('');
  attachPhraseEvents(container);
}

// ── Favorites ──────────────────────────────────────────────
function renderFavorites() {
  const all = allPhrases();
  const favs = all.filter((p) => state.favorites[p._id]);
  const container = el('favorites-list');
  if (!favs.length) {
    container.innerHTML = `<div class="empty"><h3>No saved phrases yet</h3><p>Tap <strong>Save</strong> on any phrase to add it here.</p></div>`;
    return;
  }
  container.innerHTML = favs.map((p) => renderPhraseCard(p)).join('');
  attachPhraseEvents(container);
}

// ── Nav ────────────────────────────────────────────────────
function setTab(name) {
  document.querySelectorAll('.nav-item').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  if (name === 'home') { showView('home'); renderHome(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (name === 'favorites') { showView('favorites'); renderFavorites(); return; }
  if (name === 'practice') { showView('practice'); openPracticePicker(); return; }
  if (name === 'add') { showView('add'); openAddForm(); return; }
  if (name === 'live') { showView('live'); openLiveMode('eavesdrop'); return; }
  // fallback
  showView('home');
  renderHome();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Settings sheet ─────────────────────────────────────────
function openSheet() { el('sheet').classList.add('open'); el('backdrop').classList.add('open'); }
function closeSheet() { el('sheet').classList.remove('open'); el('backdrop').classList.remove('open'); }

function refreshCurrentView() {
  // Re-render whatever's actually visible so the EN/ES toggle takes effect immediately
  const isVisible = (id) => {
    const node = el(id);
    return node && node.style.display !== 'none';
  };
  if (isVisible('view-list') && currentSectionGroup && currentSectionId) {
    showSection(currentSectionGroup, currentSectionId);
    return;
  }
  if (isVisible('view-search')) {
    const q = el('search-input') ? el('search-input').value : '';
    if (q) { handleSearch(q); return; }
  }
  if (isVisible('view-favorites')) { renderFavorites(); return; }
  if (isVisible('view-home')) { renderHome(); return; }
  // Fallback: re-render via active tab
  const activeTab = document.querySelector('.nav-item.active')?.dataset.tab || 'home';
  setTab(activeTab);
}

function toggleDirection() {
  state.settings.direction = state.settings.direction === 'es-en' ? 'en-es' : 'es-en';
  saveState();
  syncDirectionBtn();
  refreshCurrentView();
}

function syncDirectionBtn() {
  const btn = el('btn-direction');
  if (!btn) return;
  const isES = state.settings.direction === 'es-en';
  btn.textContent = isES ? 'ES→EN' : 'EN→ES';
  btn.classList.toggle('active', isES);
  const sel = el('direction-select');
  if (sel) sel.value = state.settings.direction || 'en-es';
}

function bindSettings() {
  el('speed-select').value = String(state.settings.speed);
  el('speed-select').addEventListener('change', (e) => {
    state.settings.speed = parseFloat(e.target.value); saveState();
  });
  el('voice-select').addEventListener('change', (e) => {
    state.settings.voice = e.target.value; saveState(); pickVoice();
  });
  el('direction-select').value = state.settings.direction || 'en-es';
  el('direction-select').addEventListener('change', (e) => {
    state.settings.direction = e.target.value; saveState();
    refreshCurrentView();
  });
  const ht = el('hide-learned-toggle');
  if (state.settings.hideLearned) ht.classList.add('on');
  ht.addEventListener('click', () => {
    state.settings.hideLearned = !state.settings.hideLearned;
    ht.classList.toggle('on'); saveState();
  });
  const pf = el('phon-first-toggle');
  if (state.settings.phoneticFirst) pf.classList.add('on');
  pf.addEventListener('click', () => {
    state.settings.phoneticFirst = !state.settings.phoneticFirst;
    pf.classList.toggle('on'); saveState();
  });
  // Your name (editable from settings)
  const nameInput = el('name-edit');
  if (nameInput) {
    nameInput.value = state.settings.userName || '';
    nameInput.addEventListener('input', (e) => {
      state.settings.userName = e.target.value.trim();
      saveState();
      if (document.getElementById('greet-h1')) {
        const g = greetingForTime();
        el('greet-h1').textContent = `${g.greet}, ${state.settings.userName || 'amigo'}`;
      }
    });
  }
  // English-phonetic toggle
  const enph = el('en-ph-toggle');
  if (enph) {
    if (state.settings.showEnPhonetic !== false) enph.classList.add('on');
    enph.addEventListener('click', () => {
      state.settings.showEnPhonetic = !state.settings.showEnPhonetic;
      enph.classList.toggle('on');
      saveState();
      refreshCurrentView();
    });
  }
  // Viewer-language chips (who's reading the cards?)
  const vrGroup = el('viewer-reads-group');
  if (vrGroup) {
    const current = state.settings.viewerReads || 'both';
    vrGroup.querySelectorAll('.vr-chip').forEach((chip) => {
      if (chip.dataset.vr === current) chip.classList.add('on');
      chip.addEventListener('click', () => {
        state.settings.viewerReads = chip.dataset.vr;
        vrGroup.querySelectorAll('.vr-chip').forEach((c) => c.classList.toggle('on', c === chip));
        saveState();
        refreshCurrentView();
      });
    });
  }
  el('reset-btn').addEventListener('click', () => {
    if (!confirm('Reset everything? This clears favorites, learned status, streak, and your name.')) return;
    state = JSON.parse(JSON.stringify(defaultState));
    saveState();
    closeSheet();
    // Re-prompt for name on next interaction
    setTimeout(maybeAskName, 200);
    setTab('home');
  });
}

// ── First-launch name prompt ─────────────────────────────
function maybeAskName() {
  if (state.settings.userName) return;
  const sheet = el('name-sheet');
  const back  = el('name-backdrop');
  const input = el('name-input');
  const save  = el('name-save');
  if (!sheet || !back || !input || !save) return;
  back.classList.add('open');
  sheet.classList.add('open');
  setTimeout(() => input.focus(), 250);

  const commit = () => {
    const v = (input.value || '').trim();
    if (!v) { input.focus(); return; }
    state.settings.userName = v;
    saveState();
    sheet.classList.remove('open');
    back.classList.remove('open');
    // Refresh greeting + reflect in settings sheet
    const ne = el('name-edit'); if (ne) ne.value = v;
    if (document.getElementById('greet-h1')) {
      const g = greetingForTime();
      el('greet-h1').textContent = `${g.greet}, ${v}`;
    }
  };
  save.onclick = commit;
  input.onkeydown = (e) => { if (e.key === 'Enter') commit(); };
}

// ════════════════════════════════════════════════════════════
//  PRACTICE MODE — spaced repetition flashcards
// ════════════════════════════════════════════════════════════
//
// Algorithm (simplified SM-2):
//   First time:  rated → next due in {hard: 10min, good: 1d, easy: 3d}
//   Subsequent:  hard → interval * 0.5, good → interval * 2.0, easy → interval * 2.7
//   Minimum interval: 10 minutes. Maximum: 90 days.

const PRACTICE_INTERVALS = {
  firstHard: 10 / 1440, // 10 min in days
  firstGood: 1,
  firstEasy: 3,
};

function countDuePhrases() {
  const now = Date.now();
  let count = 0;
  for (const [id, rec] of Object.entries(state.practice)) {
    if (rec.dueAt && rec.dueAt <= now) count++;
  }
  return count;
}

function getPracticeRecord(phraseId) {
  return state.practice[phraseId] || { dueAt: 0, interval: 0, reps: 0 };
}

function ratePhrase(phraseId, rating) {
  const rec = getPracticeRecord(phraseId);
  const isFirst = rec.reps === 0;
  let newInterval;
  if (isFirst) {
    newInterval = rating === 'hard' ? PRACTICE_INTERVALS.firstHard
                : rating === 'good' ? PRACTICE_INTERVALS.firstGood
                :                       PRACTICE_INTERVALS.firstEasy;
  } else {
    const mult = rating === 'hard' ? 0.5 : rating === 'good' ? 2.0 : 2.7;
    newInterval = Math.max(rec.interval * mult, 10/1440);
  }
  newInterval = Math.min(newInterval, 90);
  state.practice[phraseId] = {
    dueAt: Date.now() + newInterval * 86400000,
    interval: newInterval,
    reps: rec.reps + 1,
    lastRating: rating,
    lastAt: Date.now(), // powers "practiced this week" digest
  };
  saveState();
}

let practiceQueue = [];
let practiceIdx = 0;
let practiceFlipped = false;
let practiceCardWrapHTML = ''; // preserved template for restore

function openPracticePicker() {
  // Restore card-wrap markup if completion screen overwrote it
  if (practiceCardWrapHTML && !el('practice-card')) {
    el('practice-card-wrap').innerHTML = practiceCardWrapHTML;
    rebindPracticeCard();
  }
  el('practice-card-wrap').style.display = 'none';
  el('practice-empty').style.display = 'none';
  el('practice-deck-picker').style.display = '';

  // Populate section list
  const list = el('practice-section-list');
  const html = [];
  for (const groupKey of ['daily', 'personal', 'work', 'extra', 'out', 'parenting', 'culture', 'family', 'kids', 'custom']) {
    const group = DATA[groupKey];
    if (!group) continue;
    for (const section of group.sections) {
      if (!section.phrases.length) continue;
      html.push(`<button class="deck-card" data-group="${groupKey}" data-section="${section.id}">
        ${section.icon} <span>${section.title} <em style="color:var(--mu);font-style:normal;font-weight:400;font-size:0.85em">(${section.phrases.length})</em></span>
      </button>`);
    }
  }
  list.innerHTML = html.join('');

  // Bind deck choices
  el('practice-deck-picker').querySelectorAll('.deck-card').forEach((c) => {
    c.addEventListener('click', () => {
      if (c.dataset.deck) startPracticeDeck(c.dataset.deck);
      else if (c.dataset.section) startPracticeSection(c.dataset.group, c.dataset.section);
    });
  });
}

function startPracticeDeck(deck) {
  const all = allPhrases();
  let queue = [];
  const now = Date.now();
  if (deck === 'due') {
    queue = all.filter((p) => {
      const rec = state.practice[p._id];
      return rec && rec.dueAt && rec.dueAt <= now;
    });
    // Add some never-practiced as filler if too few
    if (queue.length < 5) {
      const fresh = all.filter((p) => !state.practice[p._id]).slice(0, 10);
      queue = [...queue, ...fresh];
    }
  } else if (deck === 'favorites') {
    queue = all.filter((p) => state.favorites[p._id]);
  } else if (deck === 'all') {
    queue = [...all];
    // Shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    queue = queue.slice(0, 30);
  }
  startPracticeQueue(queue);
}

function startPracticeSection(groupKey, sectionId) {
  const section = DATA[groupKey].sections.find((s) => s.id === sectionId);
  if (!section) return;
  const queue = section.phrases.map((p) => ({ ...p, _id: phraseId(p) }));
  startPracticeQueue(queue);
}

function startPracticeQueue(queue) {
  if (!queue.length) {
    el('practice-deck-picker').style.display = 'none';
    el('practice-empty').style.display = '';
    el('practice-card-wrap').style.display = 'none';
    el('practice-pick-section').onclick = openPracticePicker;
    return;
  }
  practiceQueue = queue;
  practiceIdx = 0;
  el('practice-deck-picker').style.display = 'none';
  el('practice-empty').style.display = 'none';
  el('practice-card-wrap').style.display = '';
  showPracticeCard();
}

function showPracticeCard() {
  if (practiceIdx >= practiceQueue.length) {
    // Done
    el('practice-card-wrap').innerHTML = `
      <div class="empty" style="padding:80px 30px">
        <h3>Practice complete</h3>
        <p>${practiceQueue.length} phrases reviewed.</p>
        <button class="act primary" id="practice-again" style="margin-top:14px">Practice again</button>
      </div>
    `;
    el('practice-again').onclick = openPracticePicker;
    return;
  }
  practiceFlipped = false;
  const p = practiceQueue[practiceIdx];
  el('practice-counter').textContent = `${practiceIdx + 1} / ${practiceQueue.length}`;
  el('practice-bar-fill').style.width = `${(practiceIdx / practiceQueue.length) * 100}%`;

  const esFirst = state.settings.direction === 'es-en';
  if (esFirst) {
    // Spanish on front, English on back — for translating-INTO-English practice
    el('practice-front-text').textContent = p.es;
    el('practice-front-label').textContent = 'Spanish';
    el('practice-back-es').textContent = p.en;
    el('practice-back-ph').textContent = p.ph;
    el('practice-back-en').textContent = p.es;
  } else {
    el('practice-front-text').textContent = p.en;
    el('practice-front-label').textContent = 'English';
    el('practice-back-es').textContent = p.es;
    el('practice-back-ph').textContent = p.ph;
    el('practice-back-en').textContent = p.en;
  }
  // Phonetic visibility on practice back, by viewer language
  const viewer = state.settings.viewerReads || 'both';
  const esPhEl = el('practice-back-ph');
  if (esPhEl) esPhEl.style.display = (viewer === 'es') ? 'none' : '';
  const enphEl = el('practice-back-enph');
  if (enphEl) {
    const enPh = (state.settings.showEnPhonetic !== false && viewer !== 'en') ? enPhonetic(p.en) : '';
    enphEl.textContent = enPh;
    enphEl.style.display = enPh ? '' : 'none';
  }
  document.querySelector('.practice-front').style.display = '';
  document.querySelector('.practice-back').style.display = 'none';
  el('practice-actions').style.display = 'none';
}

function flipPracticeCard() {
  if (practiceFlipped || practiceIdx >= practiceQueue.length) return;
  practiceFlipped = true;
  document.querySelector('.practice-front').style.display = 'none';
  document.querySelector('.practice-back').style.display = '';
  el('practice-actions').style.display = '';
  // Auto-play the Spanish
  const p = practiceQueue[practiceIdx];
  setTimeout(() => speak(p.es, { btn: el('practice-play') }), 150);
}

function ratePracticeCard(rating) {
  if (!practiceFlipped) return;
  const p = practiceQueue[practiceIdx];
  ratePhrase(p._id, rating);
  practiceIdx++;
  setTimeout(showPracticeCard, 200);
}

function bindPractice() {
  el('practice-cta').addEventListener('click', () => setTab('practice'));
  el('practice-exit').addEventListener('click', () => setTab('home'));
  // Snapshot the card-wrap markup so we can restore after completion screen
  practiceCardWrapHTML = el('practice-card-wrap').innerHTML;
  rebindPracticeCard();
}

function rebindPracticeCard() {
  el('practice-card').addEventListener('click', flipPracticeCard);
  el('practice-play').addEventListener('click', (e) => {
    e.stopPropagation();
    if (practiceIdx < practiceQueue.length) {
      speak(practiceQueue[practiceIdx].es, { btn: el('practice-play') });
    }
  });
  document.querySelectorAll('.practice-act').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      ratePracticeCard(b.dataset.rating);
    });
  });
}

// ════════════════════════════════════════════════════════════
//  SPANISH → PHONETIC GENERATOR
// ════════════════════════════════════════════════════════════
//
// Best-effort: handles common LATAM Spanish. Output is editable.
// Vowels mapped: a→ah e→eh i→ee o→oh u→oo
// ll→y, ñ→ny, h silent, j/g-before-e/i→h, c/z→s in LATAM,
// qu→k, gue/gui→g (silent u), rr→rr, ch→ch
// Stress: accent mark > default rule (penult if ends vowel/n/s, else last)

function spanishToPhonetic(text) {
  if (!text) return '';
  return text.split(/(\s+|[—–\-—…])/).map((part) => {
    if (/^[\s—–…]*$/.test(part)) return part;
    return part.replace(/[\w'áéíóúñüÁÉÍÓÚÑÜ]+/giu, (word) => phoneticWord(word.toLowerCase()));
  }).join('');
}

// ── English → Spanish-readable phonetic ──────────────────
// So a Spanish speaker (Stephania, family) can read English aloud correctly.
// Uses a dictionary of high-frequency words + a fallback rule engine.
const EN_OVERRIDES = {
  // pronouns / articles
  "i":"ai","a":"ei","an":"an","the":"de","this":"dis","that":"dat","these":"dis","those":"dous",
  "you":"iu","your":"ior","yours":"iors","he":"ji","she":"shi","it":"it","we":"ui","they":"dei",
  "me":"mi","my":"mai","mine":"main","him":"jim","his":"jis","her":"jer","us":"as","them":"dem","their":"der","theirs":"ders",
  // be / have / do / modals
  "am":"em","is":"is","are":"ar","was":"uos","were":"uer","be":"bi","been":"bin","being":"biing",
  "have":"jav","has":"jas","had":"jad","having":"javing",
  "do":"du","does":"dos","did":"did","doing":"duing","done":"don",
  "can":"ken","could":"cud","will":"uil","would":"uud","should":"shud","may":"mei","might":"mait","must":"most",
  "shall":"shal","ought":"ot",
  // common verbs
  "go":"gou","goes":"gous","going":"gouing","gone":"gon","went":"uent",
  "come":"com","comes":"coms","coming":"coming","came":"keim",
  "see":"si","saw":"so","seen":"sin","seeing":"siing","look":"luk","looks":"luks","looked":"lukd","looking":"luking",
  "make":"meik","makes":"meiks","made":"meid","making":"meiking",
  "take":"teik","takes":"teiks","took":"tuk","taken":"teiken","taking":"teiking",
  "get":"guet","gets":"guets","got":"got","getting":"gueting",
  "give":"guiv","gives":"guivs","gave":"gueiv","given":"guiven","giving":"guiving",
  "know":"nou","knows":"nous","knew":"niu","known":"noun","knowing":"nouing",
  "think":"zink","thinks":"zinks","thought":"zot","thinking":"zinking",
  "say":"sei","says":"ses","said":"sed","saying":"seiing",
  "tell":"tel","tells":"tels","told":"tould","telling":"teling",
  "want":"uant","wants":"uants","wanted":"uanted","wanting":"uanting",
  "need":"nid","needs":"nids","needed":"nided","needing":"niding",
  "love":"lov","loves":"lovs","loved":"lovd","loving":"loving",
  "like":"laik","likes":"laiks","liked":"laikd","liking":"laiking",
  "try":"trai","tries":"trais","tried":"traid","trying":"traiing",
  "use":"ius","uses":"iuses","used":"iusd","using":"iusing",
  "work":"uork","works":"uorks","worked":"uorkd","working":"uorking",
  "play":"plei","plays":"pleis","played":"pleid","playing":"pleiing",
  "eat":"it","eats":"its","ate":"eit","eaten":"iten","eating":"iting",
  "drink":"drink","drinks":"drinks","drank":"drenk","drinking":"drinking",
  "sleep":"slip","sleeps":"slips","slept":"slept","sleeping":"sliping",
  "wake":"ueik","wakes":"ueiks","woke":"uouk","waking":"ueiking",
  "open":"oupen","close":"clous","start":"start","stop":"stop","help":"jelp",
  "ask":"ask","answer":"anser","call":"col","read":"rid","write":"rait","wrote":"rout","written":"riten",
  "hear":"jir","heard":"jerd","hearing":"jiring","listen":"lisen",
  "speak":"spik","spoke":"spouk","spoken":"spouken","speaking":"spiking","talk":"tok","talks":"toks","talked":"tokd","talking":"toking",
  "show":"shou","shows":"shous","showed":"shoud","shown":"shoun",
  "find":"faind","finds":"fainds","found":"faund","finding":"fainding",
  "feel":"fil","feels":"fils","felt":"felt","feeling":"filing",
  "leave":"liv","leaves":"livs","left":"left","leaving":"living",
  "let":"let","lets":"lets","letting":"leting",
  "put":"put","puts":"puts","putting":"puting",
  "keep":"kip","keeps":"kips","kept":"kept","keeping":"kiping",
  "bring":"bring","brings":"brings","brought":"brot","bringing":"bringing",
  "buy":"bai","buys":"bais","bought":"bot","buying":"baiing",
  "pay":"pei","pays":"peis","paid":"peid","paying":"peiing",
  "hold":"jould","holds":"joulds","held":"jeld","holding":"joulding",
  "run":"ron","runs":"rons","ran":"ren","running":"roning",
  "walk":"uok","walks":"uoks","walked":"uokd","walking":"uoking",
  "stand":"stend","sit":"sit","sits":"sits","sat":"set","sitting":"siting",
  "live":"liv","lives":"livs","lived":"livd","living":"living",
  "die":"dai","died":"daid","dying":"daiing",
  // questions / connectors
  "what":"uat","when":"uen","where":"uer","why":"uai","who":"ju","whom":"jum","whose":"jus","which":"uich","how":"jau",
  "and":"end","or":"or","but":"bot","so":"sou","if":"if","then":"den","than":"den","because":"bicos","while":"uail",
  "as":"as","at":"at","by":"bai","for":"for","from":"from","in":"in","into":"intu","of":"ov","off":"of",
  "on":"on","onto":"ontu","out":"aut","over":"ouver","through":"zru","to":"tu","under":"onder","up":"op","upon":"opon","with":"uid","without":"uidaut",
  "about":"abaut","again":"aguen","against":"aguenst","before":"bifor","after":"after","between":"bituin",
  "yes":"ies","no":"nou","not":"not","never":"never","always":"olueis","sometimes":"somtaims",
  "ok":"okei","okay":"okei","please":"plis","thanks":"zenks","thank":"zenk","sorry":"sori",
  "hello":"jelou","hi":"jai","bye":"bai","goodbye":"gud-bai",
  // numbers
  "one":"uan","two":"tu","three":"zri","four":"for","five":"faiv","six":"siks","seven":"seven","eight":"eit","nine":"nain","ten":"ten",
  "eleven":"ileven","twelve":"tuelv","thirteen":"zertin","twenty":"tuenti","thirty":"zerti","fifty":"fifti","hundred":"jondred","thousand":"zausend","million":"milion",
  "first":"ferst","second":"sekend","third":"zerd",
  // time / days
  "today":"tudei","tomorrow":"tumorou","yesterday":"iesterdei","now":"nau","later":"leiter","soon":"sun",
  "morning":"morning","afternoon":"afternun","evening":"ivning","night":"nait","noon":"nun","midnight":"mid-nait",
  "monday":"mondei","tuesday":"tiusdei","wednesday":"uensdei","thursday":"zersdei","friday":"fraidei","saturday":"saterdei","sunday":"sondei",
  "minute":"minit","minutes":"minits","hour":"auer","hours":"auers","day":"dei","days":"deis","week":"uik","year":"ier","years":"iers",
  // family / people
  "kids":"kids","kid":"kid","child":"chaild","children":"children","baby":"beibi","mom":"mom","mommy":"momi","dad":"ded","daddy":"dedi",
  "wife":"uaif","husband":"jasbend","family":"femili","friend":"frend","friends":"frends","people":"pipol","person":"person",
  "name":"neim","stephania":"steh-fa-NIA",
  // common nouns
  "water":"uater","food":"fud","coffee":"kofi","tea":"ti","bread":"bred","milk":"milk","juice":"yus","beer":"bier",
  "house":"jaus","home":"joum","school":"skul","work":"uork","car":"kar","bus":"bos","taxi":"taksi",
  "phone":"foun","money":"moni","time":"taim","place":"pleis","thing":"zing","things":"zings",
  // common adjectives
  "good":"gud","great":"greit","nice":"nais","fine":"fain","big":"big","small":"smol","new":"niu","old":"old",
  "happy":"japi","sad":"sed","tired":"taird","hungry":"jongri","thirsty":"zersti","busy":"bisi","ready":"redi","sure":"shur",
  "hot":"jot","cold":"could","warm":"uorm","right":"rait","wrong":"rong","easy":"isi","hard":"jard",
  "more":"mor","less":"les","much":"moch","many":"meni","few":"fiu","little":"litel","every":"evri","all":"ol","some":"som","any":"eni",
  "very":"veri","really":"rili","just":"yost","also":"olsou","too":"tu","only":"onli","still":"stil","yet":"iet",
  "happy birthday":"japi BORDEI","birthday":"BORDEI",
  // courtesy
  "excuse":"eksquius","welcome":"uelcom","cheers":"chirs",
};

function enPhonetic(text) {
  if (!text) return '';
  // Walk the string, transforming each English word, keeping spaces and punctuation.
  return text.replace(/[A-Za-z][A-Za-z']*/g, (word) => enPhoneticWord(word));
}

function enPhoneticWord(word) {
  const key = word.toLowerCase().replace(/[\u2019']/g, '');
  // Helper: apply original-word capitalization to a phonetic output
  const matchCase = (out) => {
    if (!out) return out;
    if (word.length > 1 && word === word.toUpperCase()) return out.toUpperCase();
    if (/^[A-Z]/.test(word) && !/^[A-Z]/.test(out)) return out.charAt(0).toUpperCase() + out.slice(1);
    return out;
  };
  // 1) CMU-derived dictionary (best quality — has stress markers)
  if (typeof window !== 'undefined' && window.EN_DICT && window.EN_DICT[key]) {
    return matchCase(window.EN_DICT[key]);
  }
  // 2) Hand-curated overrides for words not in CMUdict (Spanish names, etc.)
  if (EN_OVERRIDES[key]) {
    return matchCase(EN_OVERRIDES[key]);
  }
  // 3) Heuristic rule engine for everything else (custom phrases, novel words)
  return matchCase(applyEnRules(word.toLowerCase()));
}

// Heuristic English → Spanish-readable transcription. Imperfect but readable.
function applyEnRules(w) {
  // Order matters — multi-letter patterns first.
  const rules = [
    // common endings
    [/tion\b/g, 'shon'],   [/sion\b/g, 'shon'],
    [/cious\b/g, 'shes'],  [/tious\b/g, 'shes'],
    [/ould\b/g, 'ud'],     [/ought\b/g, 'ot'],   [/aught\b/g, 'ot'],
    [/eigh/g, 'ei'],       [/igh/g, 'ai'],
    // digraphs
    [/tch/g, 'ch'],        [/dge/g, 'y'],
    [/wh/g, 'u'],          [/wr/g, 'r'],         [/kn/g, 'n'],
    [/ph/g, 'f'],          [/ck/g, 'k'],         [/qu/g, 'cu'],
    [/sh/g, 'sh'],         [/ch/g, 'ch'],
    [/th/g, 'd'],          // imperfect: voiced/unvoiced both → 'd'
    [/ng\b/g, 'ng'],
    // vowel teams
    [/ee/g, 'i'],   [/ea/g, 'i'],
    [/oo/g, 'u'],   [/ou/g, 'au'], [/ow\b/g, 'au'], [/ow/g, 'ou'],
    [/ai/g, 'ei'],  [/ay/g, 'ei'],
    [/oi/g, 'oi'],  [/oy/g, 'oi'],
    [/oa/g, 'ou'],  [/ie\b/g, 'ai'],
    // r-controlled
    [/are\b/g, 'er'], [/ar\b/g, 'ar'], [/er\b/g, 'er'], [/ir\b/g, 'er'],
    [/or\b/g, 'or'],  [/ur\b/g, 'er'],
    // single letters
    [/h/g, 'j'],     // hello → jelou
    [/j/g, 'y'],     // jam → yam
    [/y\b/g, 'i'],   // happy → japi
    [/y(?=[aeiou])/g, 'i'],
    [/v/g, 'b'],     // Spanish v ≈ b
    [/z/g, 's'],     // LatAm
    [/c(?=[ei])/g, 's'],
    [/c/g, 'k'],
    [/x/g, 'ks'],
    [/w/g, 'u'],
    // silent trailing e after consonant
    [/([bcdfgklmnprstvxy])e\b/g, '$1'],
    // collapse English doubled consonants (Spanish doesn't double)
    [/([bcdfgklmnprstv])\1/g, '$1'],
  ];
  for (const [pat, rep] of rules) w = w.replace(pat, rep);
  return w;
}

function phoneticWord(word) {
  if (!word || !/[a-záéíóúñü]/i.test(word)) return word;

  // Step 1: tokenize into context-aware sound units
  const units = [];
  let i = 0;
  while (i < word.length) {
    const ch = word[i];
    const next = word[i + 1] || '';
    const next2 = word[i + 2] || '';

    // Digraphs
    if (ch === 'c' && next === 'h') { units.push({ s: 'ch', v: false }); i += 2; continue; }
    if (ch === 'l' && next === 'l') { units.push({ s: 'y',  v: false }); i += 2; continue; }
    if (ch === 'r' && next === 'r') { units.push({ s: 'rr', v: false }); i += 2; continue; }
    if (ch === 'q' && next === 'u') { units.push({ s: 'k',  v: false }); i += 2; continue; }
    if (ch === 'g' && next === 'u' && /[eiéí]/.test(next2)) {
      units.push({ s: 'g', v: false }); i += 2; continue;
    }

    // Context-sensitive c, g, x
    if (ch === 'c' && /[eiéí]/.test(next)) { units.push({ s: 's', v: false }); i += 1; continue; }
    if (ch === 'g' && /[eiéí]/.test(next)) { units.push({ s: 'h', v: false }); i += 1; continue; }

    // Word-initial r is rolled (rr)
    if (ch === 'r' && i === 0) { units.push({ s: 'rr', v: false }); i += 1; continue; }

    // Vowels
    const vowelMap = { a: 'ah', e: 'eh', i: 'ee', o: 'oh', u: 'oo', á: 'ah', é: 'eh', í: 'ee', ó: 'oh', ú: 'oo', ü: 'oo' };
    if (vowelMap[ch] !== undefined) {
      units.push({ s: vowelMap[ch], v: true, accent: /[áéíóú]/.test(ch), letter: ch });
      i += 1; continue;
    }

    // Single consonants
    const consMap = {
      b: 'b', c: 'k', d: 'd', f: 'f', g: 'g', h: '',
      j: 'h', k: 'k', l: 'l', m: 'm', n: 'n', ñ: 'ny',
      p: 'p', q: 'k', r: 'r', s: 's', t: 't', v: 'v',
      w: 'w', x: 'ks', y: 'y', z: 's',
    };
    if (consMap[ch] !== undefined) {
      units.push({ s: consMap[ch], v: false });
      i += 1; continue;
    }

    units.push({ s: ch, v: false });
    i += 1;
  }

  // Step 2: collect vowel positions
  const vowelIdxs = units.map((u, idx) => (u.v ? idx : -1)).filter((x) => x >= 0);
  if (vowelIdxs.length === 0) return units.map((u) => u.s).join('');

  // Step 3: build nuclei (group adjacent vowels into diphthongs/triphthongs)
  const INSEPARABLE = new Set(['bl','br','cl','cr','dr','fl','fr','gl','gr','pl','pr','tr']);
  const isWeak = (u) => u && u.v && (u.letter === 'i' || u.letter === 'u' || u.letter === 'ü');
  const isStrong = (u) => u && u.v && (u.letter === 'a' || u.letter === 'e' || u.letter === 'o');
  const accentedWeak = (u) => u && u.v && u.accent && (u.letter === 'í' || u.letter === 'ú');
  const formsDiphthong = (u1, u2) => {
    if (!u1 || !u2 || !u1.v || !u2.v) return false;
    if (accentedWeak(u1) || accentedWeak(u2)) return false;
    if (isStrong(u1) && isStrong(u2)) return false; // hiatus
    return true; // at least one weak (unaccented) → diphthong
  };

  const nuclei = []; // each: { startVi, endVi }
  let vp = 0;
  while (vp < vowelIdxs.length) {
    const startVi = vowelIdxs[vp];
    let endVi = startVi;
    while (vp + 1 < vowelIdxs.length && vowelIdxs[vp + 1] === endVi + 1) {
      if (formsDiphthong(units[endVi], units[endVi + 1])) {
        endVi = endVi + 1;
        vp++;
      } else {
        break;
      }
    }
    nuclei.push({ startVi, endVi });
    vp++;
  }

  // Step 4: find stressed nucleus
  // First check for an accent mark in any nucleus
  let stressNuc = -1;
  for (let n = 0; n < nuclei.length; n++) {
    for (let u = nuclei[n].startVi; u <= nuclei[n].endVi; u++) {
      if (units[u].accent) { stressNuc = n; break; }
    }
    if (stressNuc >= 0) break;
  }
  if (stressNuc === -1) {
    // Default rule based on word ending
    const lastLetter = word[word.length - 1];
    const endsVowelNS = /[aeiouáéíóúns]/i.test(lastLetter);
    if (endsVowelNS && nuclei.length >= 2) {
      stressNuc = nuclei.length - 2;
    } else {
      stressNuc = nuclei.length - 1;
    }
  }

  // Step 5: build syllables based on consonants between nuclei
  const syllables = [];
  let start = 0;
  for (let n = 0; n < nuclei.length; n++) {
    const nuc = nuclei[n];
    let end;
    if (n === nuclei.length - 1) {
      end = units.length;
    } else {
      const nextNucStart = nuclei[n + 1].startVi;
      const between = nextNucStart - nuc.endVi - 1;
      if (between === 0) end = nuc.endVi + 1;
      else if (between === 1) end = nuc.endVi + 1;
      else if (between === 2) {
        const c1 = units[nuc.endVi + 1].s;
        const c2 = units[nuc.endVi + 2].s;
        const cluster = c1 + c2;
        if (INSEPARABLE.has(cluster) || c1 === 'y' || c1 === 'rr' || c1 === 'ch') {
          end = nuc.endVi + 1;
        } else {
          end = nuc.endVi + 2;
        }
      } else {
        end = nuc.endVi + 2;
      }
    }
    syllables.push({ start, end, hasStress: n === stressNuc });
    start = end;
  }

  // Step 4: render syllables, apply diphthong glides, uppercase stressed
  return syllables.map((syl) => {
    let text = units.slice(syl.start, syl.end).map((u) => u.s).join('');
    text = applyDiphthongGlides(text);
    return syl.hasStress ? text.toUpperCase() : text;
  }).join('-');
}

// Smooth out diphthongs into natural semivowel glides
// (ue → weh, ie → yeh, ua → wah, ai → ai, au → ow, etc.)
function applyDiphthongGlides(s) {
  return s
    // u-glides (oo + vowel → w-vowel)
    .replace(/ooeh/g, 'weh')
    .replace(/ooah/g, 'wah')
    .replace(/oooh/g, 'woh')
    .replace(/ooee/g, 'wee')
    // i-glides (ee + vowel → y-vowel)
    .replace(/eeeh/g, 'yeh')
    .replace(/eeah/g, 'yah')
    .replace(/eeoh/g, 'yoh')
    .replace(/eeoo/g, 'yoo')
    // falling diphthongs (vowel + i/u)
    .replace(/ahee/g, 'ai')
    .replace(/ehee/g, 'ay')
    .replace(/ohee/g, 'oy')
    .replace(/ahoo/g, 'ow')
    .replace(/ehoo/g, 'ehoo'); // keep — uncommon but readable
}

// ════════════════════════════════════════════════════════════
//  CUSTOM PHRASE — Add form with voice input + auto-phonetic
// ════════════════════════════════════════════════════════════

function loadCustomPhrasesIntoData() {
  if (!DATA.custom || !DATA.custom.sections[0]) return;
  DATA.custom.sections[0].phrases = state.customPhrases.map((p) => ({
    en: p.en, es: p.es, ph: p.ph, note: p.note,
  }));
}

function openAddForm() {
  el('add-en').value = '';
  el('add-es').value = '';
  el('add-ph').value = '';
  el('add-note').value = '';
  el('add-preview').style.display = 'none';
  setTimeout(() => el('add-en').focus(), 100);
}

let recognition = null;
function startDictation(targetInputId, lang) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert('Voice input is not supported on this browser. Type the phrase instead.');
    return;
  }
  const input = el(targetInputId);
  const btn = targetInputId === 'add-en' ? el('add-mic-en') : el('add-mic-es');
  if (recognition) { try { recognition.stop(); } catch {} }
  recognition = new SR();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = false;
  btn.classList.add('recording');
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    input.value = text;
    if (targetInputId === 'add-es') updateAutoPhonetic();
    updatePreview();
  };
  recognition.onerror = () => btn.classList.remove('recording');
  recognition.onend = () => btn.classList.remove('recording');
  try { recognition.start(); } catch {}
}

function updateAutoPhonetic() {
  const es = el('add-es').value.trim();
  if (!es) { el('add-ph').value = ''; return; }
  el('add-ph').value = spanishToPhonetic(es);
}

function updatePreview() {
  const en = el('add-en').value.trim();
  const es = el('add-es').value.trim();
  const ph = el('add-ph').value.trim();
  if (!en && !es) { el('add-preview').style.display = 'none'; return; }
  el('prev-en').textContent = en || '(no English)';
  el('prev-es').textContent = es || '(no Spanish)';
  el('prev-ph').textContent = ph || '(no phonetic)';
  el('add-preview').style.display = '';
}

function saveCustomPhrase() {
  const en = el('add-en').value.trim();
  const es = el('add-es').value.trim();
  const ph = el('add-ph').value.trim();
  const note = el('add-note').value.trim();
  if (!en || !es) {
    alert('Please fill in both English and Spanish.');
    return;
  }
  state.customPhrases.push({
    en, es, ph: ph || spanishToPhonetic(es), note: note || undefined, createdAt: Date.now(),
  });
  saveState();
  loadCustomPhrasesIntoData();
  alert('Saved! Find it under "My Phrases" on the Home screen.');
  setTab('home');
}

function bindAddForm() {
  el('add-exit').addEventListener('click', () => setTab('home'));
  el('add-cancel').addEventListener('click', () => setTab('home'));
  el('add-save').addEventListener('click', saveCustomPhrase);

  el('add-en').addEventListener('input', updatePreview);
  el('add-es').addEventListener('input', () => { updateAutoPhonetic(); updatePreview(); });
  el('add-ph').addEventListener('input', updatePreview);

  el('add-mic-en').addEventListener('click', () => startDictation('add-en', 'en-US'));
  el('add-mic-es').addEventListener('click', () => startDictation('add-es', 'es-MX'));
  el('add-regen').addEventListener('click', () => { updateAutoPhonetic(); updatePreview(); });

  el('prev-play').addEventListener('click', () => {
    const es = el('add-es').value.trim();
    if (es) speak(es, { btn: el('prev-play') });
  });
}

// ════════════════════════════════════════════════════════════
//  SPEECH RECOGNITION — shared manager (handles iOS quirks)
// ════════════════════════════════════════════════════════════
//
// iOS Safari requires SR to be triggered by user gesture and
// times out the session after ~60s. We auto-restart in continuous
// modes (Eavesdrop) when the session ends.

function createRecognition(lang, opts = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = lang;
  rec.continuous = !!opts.continuous;
  rec.interimResults = !!opts.interim;
  rec.maxAlternatives = 1;
  return rec;
}

function srSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// ════════════════════════════════════════════════════════════
//  FEATURE 1 — PRONUNCIATION COACH
// ════════════════════════════════════════════════════════════

let coachPhrase = null;
let coachRec = null;

function openCoach(phrase) {
  coachPhrase = phrase;
  el('coach-target-es').textContent = phrase.es;
  el('coach-target-ph').textContent = phrase.ph;
  el('coach-status').textContent = 'Ready when you are.';
  el('coach-result').style.display = 'none';
  el('coach-sheet').classList.add('open');
  el('coach-backdrop').classList.add('open');
}

function closeCoach() {
  if (coachRec) { try { coachRec.stop(); } catch {} coachRec = null; }
  el('coach-mic').classList.remove('listening');
  el('coach-sheet').classList.remove('open');
  el('coach-backdrop').classList.remove('open');
}

function startCoach() {
  if (!srSupported()) {
    el('coach-status').textContent = 'Voice input not supported on this browser. Update Chrome or use Safari 14.5+.';
    return;
  }
  if (coachRec) { try { coachRec.stop(); } catch {} }
  coachRec = createRecognition('es-MX', { continuous: false });
  el('coach-mic').classList.add('listening');
  el('coach-status').textContent = 'Listening… say it now.';
  coachRec.onresult = (e) => {
    const heard = (e.results[0] && e.results[0][0] && e.results[0][0].transcript) || '';
    gradeCoach(heard);
  };
  coachRec.onerror = (e) => {
    el('coach-mic').classList.remove('listening');
    el('coach-status').textContent = 'No audio detected. Try again.';
  };
  coachRec.onend = () => {
    el('coach-mic').classList.remove('listening');
  };
  try { coachRec.start(); } catch (e) {
    el('coach-status').textContent = 'Could not start microphone. Check permissions.';
  }
}

function normaliseForCompare(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[¿¡!?,.;:"']/g, '')
    .replace(/\s+/g, ' ').trim();
}

function gradeCoach(heard) {
  const target = coachPhrase.es;
  const tNorm = normaliseForCompare(target);
  const hNorm = normaliseForCompare(heard);

  // Word-level similarity using Levenshtein
  const tWords = tNorm.split(' ');
  const hWords = hNorm.split(' ');
  let wordScore;
  if (!hNorm) {
    wordScore = 0;
  } else {
    const dist = levenshtein(tNorm, hNorm);
    const maxLen = Math.max(tNorm.length, hNorm.length);
    wordScore = Math.max(0, Math.round(100 * (1 - dist / maxLen)));
  }

  // Phoneme-level similarity — reuses the existing Spanish phonetic engine.
  // Catches mispronunciations the orthographic compare misses (e.g. user said
  // "hola" but transcribed "ola" — same phonemes, similar score).
  let phonScore = wordScore;
  let tPhon = '', hPhon = '';
  if (hNorm) {
    try {
      tPhon = spanishToPhonetic(target).toLowerCase().replace(/[^a-z]/g, '');
      hPhon = spanishToPhonetic(heard).toLowerCase().replace(/[^a-z]/g, '');
      if (tPhon && hPhon) {
        const pDist = levenshtein(tPhon, hPhon);
        const pMax = Math.max(tPhon.length, hPhon.length);
        phonScore = Math.max(0, Math.round(100 * (1 - pDist / pMax)));
      }
    } catch (e) { /* fall back to wordScore */ }
  }

  // Combined score — average of both, but if either is high the user wins (we
  // care more about being understood than about exact spelling).
  const score = Math.max(wordScore, Math.round((wordScore + phonScore) / 2));

  // Visual word diff
  const diffHtml = renderWordDiff(tWords, hWords);

  // Render
  el('coach-result').style.display = '';
  const scoreEl = el('coach-score');
  scoreEl.textContent = score;
  scoreEl.className = 'coach-score-num ' + (score >= 85 ? 's-great' : score >= 60 ? 's-ok' : 's-poor');
  el('coach-grade').textContent =
    score >= 95 ? 'Spot on!' :
    score >= 85 ? 'Excellent' :
    score >= 70 ? 'Good — close' :
    score >= 50 ? 'Getting there' :
                  'Try again';
  el('coach-diff-target').innerHTML = tWords.map((w) => `<span class="ok">${w}</span>`).join(' ');
  el('coach-diff-got').innerHTML = diffHtml;

  // Phonetic diff line — hidden if either side is empty
  const phonEl = el('coach-phon-diff');
  if (phonEl) {
    if (tPhon && hPhon && tPhon !== hPhon) {
      const tShow = spanishToPhonetic(target);
      const hShow = spanishToPhonetic(heard);
      phonEl.style.display = '';
      phonEl.innerHTML = `<div class="coach-phon-row"><span class="coach-phon-lbl">Target sound:</span> <span class="coach-phon-tx">${tShow}</span></div>
        <div class="coach-phon-row"><span class="coach-phon-lbl">You said:</span> <span class="coach-phon-tx">${hShow}</span></div>
        <div class="coach-phon-meta">Phoneme match: <strong>${phonScore}%</strong></div>`;
    } else {
      phonEl.style.display = 'none';
      phonEl.innerHTML = '';
    }
  }

  let feedback;
  if (!hNorm) feedback = "Didn't catch anything. Speak a bit louder and closer to the mic.";
  else if (score >= 95) feedback = 'Perfect pronunciation. The speech engine recognised every word.';
  else if (score >= 85) feedback = 'Great — very close to native. One or two small word differences.';
  else if (score >= 60 && phonScore >= 80) feedback = 'Sounds were on target — a couple of words came out differently.';
  else if (score >= 60) feedback = 'On the right track. Listen to the target again and notice the stressed syllables.';
  else feedback = 'The speech engine heard something different from the target. Try slower and more deliberate.';
  el('coach-feedback').textContent = feedback;
  el('coach-status').textContent = 'Tap "Try again" to retry.';
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

function renderWordDiff(targetWords, gotWords) {
  // Mark each got-word as ok (in target) or miss (not in target)
  // and append any target words missing from got as "miss"
  const tSet = new Set(targetWords);
  const gSet = new Set(gotWords);
  const gotHtml = gotWords.map((w) => {
    const klass = tSet.has(w) ? 'ok' : 'miss';
    return `<span class="${klass}">${w}</span>`;
  }).join(' ');
  const missing = targetWords.filter((w) => !gSet.has(w));
  const missingHtml = missing.length ? ' ' + missing.map((w) => `<span class="add">+${w}</span>`).join(' ') : '';
  return gotHtml + missingHtml;
}

function bindCoach() {
  el('coach-close').addEventListener('click', closeCoach);
  el('coach-backdrop').addEventListener('click', closeCoach);
  el('coach-hear').addEventListener('click', () => {
    if (coachPhrase) speak(coachPhrase.es, { btn: el('coach-hear') });
  });
  el('coach-mic').addEventListener('click', startCoach);
  el('coach-retry').addEventListener('click', () => {
    el('coach-result').style.display = 'none';
    startCoach();
  });
}

// ════════════════════════════════════════════════════════════
//  LIVE TAB — sub-mode switcher
// ════════════════════════════════════════════════════════════

let currentLiveMode = 'eavesdrop';

function openLiveMode(mode) {
  currentLiveMode = mode;
  document.querySelectorAll('.live-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.mode === mode);
  });
  ['eavesdrop', 'mirror', 'stuck', 'verbs'].forEach((m) => {
    const node = el('mode-' + m);
    if (node) node.style.display = m === mode ? '' : 'none';
  });
  // Stop other modes when switching
  if (mode !== 'eavesdrop') stopEavesdrop();
  // Auto-focus the verb input when entering verbs mode
  if (mode === 'verbs') {
    setTimeout(() => { const i = el('verb-input'); if (i) i.focus(); }, 80);
  }
}

function bindLiveTabs() {
  document.querySelectorAll('.live-tab').forEach((t) => {
    t.addEventListener('click', () => openLiveMode(t.dataset.mode));
  });
  el('live-exit').addEventListener('click', () => { stopEavesdrop(); setTab('home'); });
}

// ════════════════════════════════════════════════════════════
//  VERB CONJUGATION MODE
// ════════════════════════════════════════════════════════════

const VERB_TENSES = [
  { key: 'present',     label: 'Present',          subtitle: 'yo hablo' },
  { key: 'preterite',   label: 'Preterite',        subtitle: 'yo hablé' },
  { key: 'imperfect',   label: 'Imperfect',        subtitle: 'yo hablaba' },
  { key: 'future',      label: 'Future',           subtitle: 'yo hablaré' },
  { key: 'conditional', label: 'Conditional',      subtitle: 'yo hablaría' },
  { key: 'presSubj',    label: 'Present Subjunctive', subtitle: 'que yo hable' },
  { key: 'imperative',  label: 'Imperative',       subtitle: '¡habla! / ¡hable!' },
];
const PERSON_LABELS = ['yo', 'tú', 'él/ella/Ud.', 'nosotros', 'vosotros', 'ellos/Uds.'];

function showVerbConjugation(verb) {
  if (!verb) return;
  const conj = (typeof window !== 'undefined' && window.conjugate) ? window.conjugate(verb) : null;
  const result = el('verb-result');
  if (!result) return;
  if (!conj) {
    result.style.display = '';
    result.innerHTML = `
      <div class="empty">
        <h3>Couldn't conjugate "${escapeHtml(verb)}"</h3>
        <p>Make sure it's a Spanish infinitive ending in <strong>-ar</strong>, <strong>-er</strong>, or <strong>-ir</strong>.</p>
      </div>
    `;
    return;
  }

  // Header card
  const header = `
    <div class="verb-header">
      <div class="verb-inf">${escapeHtml(conj.infinitive)}</div>
      ${conj.translation ? `<div class="verb-trans">${escapeHtml(conj.translation)}</div>` : ''}
      <div class="verb-tags">
        ${conj.irregular ? '<span class="verb-tag tag-irreg">irregular</span>' : ''}
        ${conj.stemChange ? `<span class="verb-tag tag-stem">stem ${escapeHtml(conj.stemChange)}</span>` : ''}
        ${!conj.irregular && !conj.stemChange ? '<span class="verb-tag tag-reg">regular</span>' : ''}
      </div>
      <div class="verb-nonfinite">
        <button class="verb-cell verb-nf" data-text="${escapeHtml(conj.gerund)}">
          <span class="verb-nf-lbl">gerund</span>
          <span class="verb-nf-form">${escapeHtml(conj.gerund)}</span>
          <span class="verb-nf-ph">${escapeHtml(spanishToPhonetic(conj.gerund))}</span>
        </button>
        <button class="verb-cell verb-nf" data-text="${escapeHtml(conj.participle)}">
          <span class="verb-nf-lbl">participle</span>
          <span class="verb-nf-form">${escapeHtml(conj.participle)}</span>
          <span class="verb-nf-ph">${escapeHtml(spanishToPhonetic(conj.participle))}</span>
        </button>
      </div>
    </div>
  `;

  // Tenses
  const tenseHtml = VERB_TENSES.map((t) => {
    const forms = conj.tenses[t.key];
    if (!forms) return '';
    const cells = forms.map((f, p) => {
      if (!f) {
        return `<div class="verb-cell verb-empty"><span class="verb-person">${PERSON_LABELS[p]}</span><span class="verb-form">—</span></div>`;
      }
      const ph = spanishToPhonetic(f);
      return `
        <button class="verb-cell" data-text="${escapeHtml(f)}">
          <span class="verb-person">${PERSON_LABELS[p]}</span>
          <span class="verb-form">${escapeHtml(f)}</span>
          <span class="verb-ph">${escapeHtml(ph)}</span>
        </button>
      `;
    }).join('');
    return `
      <div class="verb-tense">
        <div class="verb-tense-head">
          <span class="verb-tense-lbl">${t.label}</span>
          <span class="verb-tense-sub">${t.subtitle}</span>
        </div>
        <div class="verb-grid">${cells}</div>
      </div>
    `;
  }).join('');

  result.style.display = '';
  result.innerHTML = header + tenseHtml;
  // Wire click-to-speak on every cell
  result.querySelectorAll('.verb-cell[data-text]').forEach((cell) => {
    cell.addEventListener('click', () => {
      const txt = cell.dataset.text;
      speak(txt, { btn: cell });
    });
  });
}

function refreshVerbSuggestions() {
  const input = el('verb-input');
  const sugBox = el('verb-suggest');
  if (!input || !sugBox) return;
  const q = input.value.trim();
  if (!q) { sugBox.innerHTML = ''; sugBox.style.display = 'none'; return; }
  const list = (typeof window !== 'undefined' && window.lookupVerb) ? window.lookupVerb(q) : [];
  if (!list.length) { sugBox.innerHTML = ''; sugBox.style.display = 'none'; return; }
  sugBox.innerHTML = list.map((s) =>
    `<button type="button" class="verb-sugg" data-verb="${escapeHtml(s.verb)}">
       <span class="verb-sugg-v">${escapeHtml(s.verb)}</span>
       <span class="verb-sugg-m">${escapeHtml(s.meaning)}</span>
     </button>`
  ).join('');
  sugBox.style.display = '';
  sugBox.querySelectorAll('.verb-sugg').forEach((b) => {
    b.addEventListener('click', () => {
      const v = b.dataset.verb;
      input.value = v;
      sugBox.style.display = 'none';
      sugBox.innerHTML = '';
      showVerbConjugation(v);
    });
  });
}

function bindVerbMode() {
  const input = el('verb-input');
  const goBtn = el('verb-go');
  if (!input || !goBtn) return;
  input.addEventListener('input', refreshVerbSuggestions);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = input.value.trim();
      if (v) {
        el('verb-suggest').style.display = 'none';
        showVerbConjugation(v);
      }
    }
  });
  goBtn.addEventListener('click', () => {
    const v = input.value.trim();
    if (v) {
      el('verb-suggest').style.display = 'none';
      showVerbConjugation(v);
    }
  });
}

// ════════════════════════════════════════════════════════════
//  FEATURE 2 — EAVESDROP MODE (live captions)
// ════════════════════════════════════════════════════════════

let eavesdropRec = null;
let eavesdropActive = false;
let eavesdropLines = [];

function startEavesdrop() {
  if (!srSupported()) {
    el('eavesdrop-status').textContent = 'Voice input not supported on this browser.';
    return;
  }
  eavesdropActive = true;
  el('eavesdrop-status').textContent = 'Listening… speak Spanish near the phone.';
  el('eavesdrop-toggle').classList.add('listening');
  el('eavesdrop-toggle').querySelector('.lbb-icon').textContent = '⏸';
  el('eavesdrop-toggle').querySelector('.lbb-lbl').textContent = 'Stop listening';
  spinUpEavesdropRec();
}

function spinUpEavesdropRec() {
  if (!eavesdropActive) return;
  eavesdropRec = createRecognition('es-MX', { continuous: true, interim: true });
  if (!eavesdropRec) return;
  let interimLine = null;

  eavesdropRec.onresult = (e) => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      const text = r[0].transcript.trim();
      if (!text) continue;
      if (r.isFinal) {
        addEavesdropLine(text, false);
        interimLine = null;
      } else {
        if (!interimLine) {
          interimLine = document.createElement('div');
          interimLine.className = 'eavesdrop-line interim';
          el('eavesdrop-log').appendChild(interimLine);
        }
        interimLine.innerHTML = `
          <div class="eavesdrop-line-es">${escapeHtml(text)}…</div>
        `;
        el('eavesdrop-log').scrollTop = el('eavesdrop-log').scrollHeight;
      }
    }
  };
  eavesdropRec.onerror = (e) => {
    if (e.error === 'no-speech' || e.error === 'audio-capture' || e.error === 'aborted') {
      // benign — auto-restart
    } else {
      console.warn('Eavesdrop SR error:', e.error);
    }
  };
  eavesdropRec.onend = () => {
    // Auto-restart if still active (iOS will end sessions ~60s)
    if (eavesdropActive) {
      setTimeout(() => spinUpEavesdropRec(), 250);
    }
  };
  try { eavesdropRec.start(); }
  catch (err) {
    // If already started, ignore; otherwise alert
    setTimeout(() => spinUpEavesdropRec(), 500);
  }
}

function stopEavesdrop() {
  eavesdropActive = false;
  if (eavesdropRec) { try { eavesdropRec.stop(); } catch {} eavesdropRec = null; }
  const toggle = el('eavesdrop-toggle');
  if (toggle) {
    toggle.classList.remove('listening');
    toggle.querySelector('.lbb-icon').textContent = '▶';
    toggle.querySelector('.lbb-lbl').textContent = 'Start listening';
  }
  const status = el('eavesdrop-status');
  if (status) status.textContent = 'Stopped.';
  // Remove interim lines
  document.querySelectorAll('.eavesdrop-line.interim').forEach((n) => n.remove());
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function addEavesdropLine(text, saved) {
  // Hide empty placeholder
  const empty = el('eavesdrop-log').querySelector('.eavesdrop-empty');
  if (empty) empty.remove();
  // Remove interim
  document.querySelectorAll('.eavesdrop-line.interim').forEach((n) => n.remove());

  const ph = spanishToPhonetic(text);
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const lineId = 'ed-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
  const lineEl = document.createElement('div');
  lineEl.className = 'eavesdrop-line' + (saved ? ' saved' : '');
  lineEl.id = lineId;
  lineEl.innerHTML = `
    <div class="eavesdrop-line-es">${escapeHtml(text)}</div>
    <div class="eavesdrop-line-ph">${escapeHtml(ph)}</div>
    <div class="eavesdrop-line-time">
      <span>${timestamp}</span>
      <div class="eavesdrop-line-actions">
        <button data-action="play">Hear</button>
        <button data-action="translate">Translate</button>
        <button data-action="save">Save</button>
      </div>
    </div>
  `;
  lineEl.querySelector('[data-action="play"]').addEventListener('click', (e) => {
    e.stopPropagation();
    speak(text);
  });
  lineEl.querySelector('[data-action="translate"]').addEventListener('click', (e) => {
    e.stopPropagation();
    window.open('https://translate.google.com/?sl=es&tl=en&text=' + encodeURIComponent(text), '_blank');
  });
  lineEl.querySelector('[data-action="save"]').addEventListener('click', (e) => {
    e.stopPropagation();
    state.customPhrases.push({
      en: '(saved from Eavesdrop — translate to add English)',
      es: text, ph, note: 'Heard at ' + timestamp, createdAt: Date.now(),
    });
    saveState();
    loadCustomPhrasesIntoData();
    lineEl.classList.add('saved');
    e.currentTarget.textContent = 'Saved';
    e.currentTarget.classList.add('saved');
  });
  el('eavesdrop-log').appendChild(lineEl);
  el('eavesdrop-log').scrollTop = el('eavesdrop-log').scrollHeight;
  eavesdropLines.push({ text, ph, timestamp });
}

function bindEavesdrop() {
  el('eavesdrop-toggle').addEventListener('click', () => {
    if (eavesdropActive) stopEavesdrop(); else startEavesdrop();
  });
}

// ════════════════════════════════════════════════════════════
//  FEATURE 3 — MIRROR MODE
// ════════════════════════════════════════════════════════════

let mirrorRec = null;
let mirrorLastText = '';

function startMirror() {
  if (!srSupported()) {
    el('mirror-status').textContent = 'Voice input not supported on this browser.';
    return;
  }
  if (mirrorRec) { try { mirrorRec.stop(); } catch {} }
  mirrorRec = createRecognition('es-MX', { continuous: false });
  const btn = el('mirror-start');
  btn.classList.add('listening');
  btn.querySelector('.lbb-icon').textContent = '⏺️';
  btn.querySelector('.lbb-lbl').textContent = 'Listening… speak now';
  el('mirror-status').textContent = 'Speak Spanish freely…';
  el('mirror-result').style.display = 'none';

  mirrorRec.onresult = (e) => {
    const text = e.results[0][0].transcript;
    mirrorLastText = text;
    el('mirror-es').textContent = text;
    el('mirror-ph').textContent = spanishToPhonetic(text);
    el('mirror-translate').href = 'https://translate.google.com/?sl=es&tl=en&text=' + encodeURIComponent(text);
    el('mirror-result').style.display = '';
    el('mirror-status').textContent = 'Got it. Read what you actually said.';
  };
  mirrorRec.onerror = () => {
    el('mirror-status').textContent = 'No speech detected. Try again.';
    stopMirrorBtn();
  };
  mirrorRec.onend = () => stopMirrorBtn();
  try { mirrorRec.start(); }
  catch { el('mirror-status').textContent = 'Could not start microphone.'; stopMirrorBtn(); }
}

function stopMirrorBtn() {
  const btn = el('mirror-start');
  btn.classList.remove('listening');
  btn.querySelector('.lbb-icon').innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  btn.querySelector('.lbb-lbl').textContent = 'Tap and speak';
}

function bindMirror() {
  el('mirror-start').addEventListener('click', startMirror);
  el('mirror-play').addEventListener('click', () => {
    if (mirrorLastText) speak(mirrorLastText, { btn: el('mirror-play') });
  });
  el('mirror-save').addEventListener('click', () => {
    if (!mirrorLastText) return;
    const ph = spanishToPhonetic(mirrorLastText);
    state.customPhrases.push({
      en: '(from Mirror — what I said)', es: mirrorLastText, ph,
      note: 'Mirror Mode capture · ' + new Date().toLocaleString(),
      createdAt: Date.now(),
    });
    saveState();
    loadCustomPhrasesIntoData();
    el('mirror-status').textContent = 'Saved to My Phrases.';
  });
}

// ════════════════════════════════════════════════════════════
//  FEATURE 4 — FAMILY VOICE BANK (IndexedDB blob storage)
// ════════════════════════════════════════════════════════════

let db = null;
let voiceBankIndex = {}; // phraseId -> { speaker, blobKey }
let vbPhrase = null;
let vbSpeaker = 'stephania';
let vbMediaRecorder = null;
let vbChunks = [];
let vbBlobUrl = null;

function openVoiceBankDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('cotidiano-voices', 2);
    req.onupgradeneeded = (e) => {
      const dbb = e.target.result;
      if (!dbb.objectStoreNames.contains('voices')) {
        dbb.createObjectStore('voices', { keyPath: 'id' });
      }
      if (!dbb.objectStoreNames.contains('captures')) {
        // Capture audio blobs from "Heard at home" feature
        dbb.createObjectStore('captures', { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => { db = e.target.result; resolve(db); };
    req.onerror = (e) => reject(e);
  });
}

async function loadVoiceBankIndex() {
  if (!db) await openVoiceBankDB().catch(() => {});
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction('voices', 'readonly');
    const store = tx.objectStore('voices');
    const req = store.getAll();
    req.onsuccess = () => {
      voiceBankIndex = {};
      (req.result || []).forEach((rec) => {
        voiceBankIndex[rec.id] = { speaker: rec.speaker, hasBlob: !!rec.blob };
      });
      resolve();
    };
    req.onerror = () => resolve();
  });
}

function saveVoiceBlob(phraseId, speaker, blob) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('no-db');
    const tx = db.transaction('voices', 'readwrite');
    const store = tx.objectStore('voices');
    store.put({ id: phraseId, speaker, blob, savedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
}

function loadVoiceBlob(phraseId) {
  return new Promise((resolve) => {
    if (!db) return resolve(null);
    const tx = db.transaction('voices', 'readonly');
    const store = tx.objectStore('voices');
    const req = store.get(phraseId);
    req.onsuccess = () => resolve(req.result ? req.result.blob : null);
    req.onerror = () => resolve(null);
  });
}

async function playFamilyVoice(phraseId, btn) {
  const blob = await loadVoiceBlob(phraseId);
  if (!blob) return;
  if (btn) btn.classList.add('playing');
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.onended = audio.onerror = () => {
    if (btn) btn.classList.remove('playing');
    URL.revokeObjectURL(url);
  };
  audio.play();
}

function openVoiceBank(phrase) {
  vbPhrase = phrase;
  el('vb-target-es').textContent = phrase.es;
  el('vb-target-ph').textContent = phrase.ph;
  el('vb-status').textContent = 'Press and hold the button, say the phrase, release.';
  el('vb-playback').style.display = 'none';
  vbBlobUrl = null;
  el('vb-sheet').classList.add('open');
  el('vb-backdrop').classList.add('open');
}

function closeVoiceBank() {
  if (vbMediaRecorder && vbMediaRecorder.state !== 'inactive') {
    try { vbMediaRecorder.stop(); } catch {}
  }
  if (vbBlobUrl) { URL.revokeObjectURL(vbBlobUrl); vbBlobUrl = null; }
  el('vb-sheet').classList.remove('open');
  el('vb-backdrop').classList.remove('open');
}

async function startVoiceRecord() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    el('vb-status').textContent = 'Recording not supported on this browser.';
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    vbChunks = [];
    vbMediaRecorder = new MediaRecorder(stream);
    vbMediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) vbChunks.push(e.data); };
    vbMediaRecorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(vbChunks, { type: 'audio/webm' });
      if (vbBlobUrl) URL.revokeObjectURL(vbBlobUrl);
      vbBlobUrl = URL.createObjectURL(blob);
      el('vb-audio').src = vbBlobUrl;
      el('vb-playback').style.display = '';
      el('vb-status').textContent = 'Listen back, then save.';
      el('vb-rec').classList.remove('recording');
      el('vb-rec').dataset.blob = '1';
      el('vb-rec').querySelector('.lbb-lbl').textContent = 'Hold to record';
    };
    vbMediaRecorder.start();
    el('vb-rec').classList.add('recording');
    el('vb-rec').querySelector('.lbb-lbl').textContent = 'Recording…';
    el('vb-status').textContent = 'Recording — speak the phrase now.';
  } catch (err) {
    el('vb-status').textContent = 'Microphone permission denied or unavailable.';
  }
}

function stopVoiceRecord() {
  if (vbMediaRecorder && vbMediaRecorder.state === 'recording') {
    vbMediaRecorder.stop();
  }
}

async function commitVoice() {
  if (!vbPhrase || !vbChunks.length) return;
  const blob = new Blob(vbChunks, { type: 'audio/webm' });
  const id = phraseId(vbPhrase);
  try {
    if (!db) await openVoiceBankDB();
    await saveVoiceBlob(id, vbSpeaker, blob);
    voiceBankIndex[id] = { speaker: vbSpeaker, hasBlob: true };
    el('vb-status').textContent = 'Saved. ' + vbSpeaker + "'s voice is now linked to this phrase.";
    // Re-render any visible phrase cards
    setTimeout(() => {
      closeVoiceBank();
      // Refresh current view
      const activeTab = document.querySelector('.nav-item.active')?.dataset.tab || 'home';
      setTab(activeTab);
    }, 800);
  } catch (e) {
    el('vb-status').textContent = 'Save failed: ' + e;
  }
}

function bindVoiceBank() {
  el('vb-close').addEventListener('click', closeVoiceBank);
  el('vb-backdrop').addEventListener('click', closeVoiceBank);

  document.querySelectorAll('.vb-speaker').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.vb-speaker').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      vbSpeaker = b.dataset.speaker;
    });
  });

  const rec = el('vb-rec');
  // Press-and-hold (touch + mouse)
  let holdActive = false;
  const start = (e) => { e.preventDefault(); if (holdActive) return; holdActive = true; startVoiceRecord(); };
  const end = () => { if (!holdActive) return; holdActive = false; stopVoiceRecord(); };
  rec.addEventListener('mousedown', start);
  rec.addEventListener('mouseup', end);
  rec.addEventListener('mouseleave', end);
  rec.addEventListener('touchstart', start, { passive: false });
  rec.addEventListener('touchend', end);
  rec.addEventListener('touchcancel', end);

  el('vb-redo').addEventListener('click', () => {
    el('vb-playback').style.display = 'none';
    vbChunks = [];
  });
  el('vb-save').addEventListener('click', commitVoice);
}

// ════════════════════════════════════════════════════════════
//  FEATURE 4½ — CAPTURE & GROW ("Heard at home")
// ════════════════════════════════════════════════════════════
//
// Press the floating mic, record up to 30s of ambient Spanish, the app
// transcribes via Web Speech API, and you save the snippet — audio +
// transcript + speaker — to a personal feed. Captured phrases are
// auto-linked to the corpus when they fuzzy-match an existing phrase
// and otherwise become standalone entries you can review and practice.
//
// Audio lives in IndexedDB (`captures` store); metadata lives in
// state.captures so it survives across devices via export/import later.

const CAPTURE_SPEAKERS = [
  { id: 'stephania', label: 'Stephania', emoji: '💗' },
  { id: 'belen',     label: 'Belén',     emoji: '👧' },
  { id: 'paz',       label: 'Paz',       emoji: '🧒' },
  { id: 'marito',    label: 'Marito',    emoji: '👦' },
  { id: 'suegra',    label: 'Suegra',    emoji: '👵' },
  { id: 'suegro',    label: 'Suegro',    emoji: '👴' },
  { id: 'family',    label: 'Family',    emoji: '👨‍👩‍👧' },
  { id: 'other',     label: 'Other',     emoji: '🗣' },
];
const CAPTURE_MAX_MS = 30000;

let capRec = null;          // SpeechRecognition
let capRecorder = null;     // MediaRecorder
let capChunks = [];
let capStream = null;
let capStartedAt = 0;
let capTimer = null;
let capInterimText = '';
let capFinalText = '';
let capPendingBlob = null;
let capPendingId = null;
let capPlayUrl = null;

function openCapture() {
  // Reset any previous state, open the sheet, and start recording immediately.
  capInterimText = '';
  capFinalText = '';
  capPendingBlob = null;
  capPendingId = 'cap_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  if (capPlayUrl) { URL.revokeObjectURL(capPlayUrl); capPlayUrl = null; }
  el('cap-transcript').value = '';
  el('cap-translation').value = '';
  el('cap-note').value = '';
  el('cap-match').innerHTML = '';
  el('cap-match').style.display = 'none';
  el('cap-playback').style.display = 'none';
  el('cap-save').disabled = true;
  // Default speaker = Stephania
  setCaptureSpeaker('stephania');

  el('cap-backdrop').classList.add('open');
  el('cap-sheet').classList.add('open');
  startCaptureRec();
}

function closeCapture() {
  stopCaptureRec(true);
  el('cap-backdrop').classList.remove('open');
  el('cap-sheet').classList.remove('open');
  if (capPlayUrl) { URL.revokeObjectURL(capPlayUrl); capPlayUrl = null; }
}

function setCaptureSpeaker(id) {
  document.querySelectorAll('.cap-speaker').forEach((b) => {
    b.classList.toggle('active', b.dataset.speaker === id);
  });
}
function getCaptureSpeaker() {
  const active = document.querySelector('.cap-speaker.active');
  return active ? active.dataset.speaker : 'other';
}

function startCaptureRec() {
  capStartedAt = Date.now();
  el('cap-status').textContent = 'Listening… speak Spanish near the phone.';
  el('cap-rec-btn').classList.add('recording');
  el('cap-rec-btn').querySelector('.cap-rec-lbl').textContent = 'Stop';

  // 1) Speech recognition (best-effort; works without audio recording too)
  if (srSupported()) {
    try {
      capRec = createRecognition('es-MX', { continuous: true, interim: true });
      capRec.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          const t = r[0].transcript.trim();
          if (!t) continue;
          if (r.isFinal) {
            capFinalText = (capFinalText + ' ' + t).trim();
          } else {
            interim += ' ' + t;
          }
        }
        capInterimText = interim.trim();
        const merged = (capFinalText + ' ' + capInterimText).trim();
        el('cap-transcript').value = merged;
      };
      capRec.onerror = () => {};
      capRec.onend = () => {
        // Auto-restart while still recording (iOS ends sessions ~60s)
        if (capRecorder && capRecorder.state === 'recording') {
          try { capRec.start(); } catch {}
        }
      };
      capRec.start();
    } catch (err) { console.warn('Capture SR start failed:', err); }
  } else {
    el('cap-status').textContent = 'Voice transcription not supported here — type the phrase below.';
  }

  // 2) Audio recording — separate from SR so we always keep the source
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    capStream = stream;
    const mimeType = pickAudioMime();
    try {
      capRecorder = mimeType ? new MediaRecorder(stream, { mimeType })
                             : new MediaRecorder(stream);
    } catch (err) {
      console.warn('MediaRecorder unavailable:', err);
      return;
    }
    capChunks = [];
    capRecorder.ondataavailable = (e) => { if (e.data && e.data.size) capChunks.push(e.data); };
    capRecorder.onstop = () => {
      const type = (capChunks[0] && capChunks[0].type) || mimeType || 'audio/webm';
      capPendingBlob = new Blob(capChunks, { type });
      capChunks = [];
      if (capStream) { capStream.getTracks().forEach((t) => t.stop()); capStream = null; }
      // Show playback control
      if (capPlayUrl) URL.revokeObjectURL(capPlayUrl);
      capPlayUrl = URL.createObjectURL(capPendingBlob);
      el('cap-audio').src = capPlayUrl;
      el('cap-playback').style.display = '';
      el('cap-save').disabled = false;
    };
    capRecorder.start();
    // Auto-stop after CAPTURE_MAX_MS
    capTimer = setTimeout(() => {
      if (capRecorder && capRecorder.state === 'recording') stopCaptureRec(false);
    }, CAPTURE_MAX_MS);
  }).catch((err) => {
    console.warn('Mic permission denied:', err);
    el('cap-status').textContent = 'Microphone permission denied — type the phrase below.';
  });
}

function pickAudioMime() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  for (const c of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)) return c;
  }
  return '';
}

function stopCaptureRec(discard) {
  if (capTimer) { clearTimeout(capTimer); capTimer = null; }
  if (capRec) { try { capRec.stop(); } catch {} capRec = null; }
  if (capRecorder && capRecorder.state === 'recording') {
    try { capRecorder.stop(); } catch {}
  }
  capRecorder = null;
  if (capStream) { try { capStream.getTracks().forEach((t) => t.stop()); } catch {} capStream = null; }
  el('cap-rec-btn').classList.remove('recording');
  el('cap-rec-btn').querySelector('.cap-rec-lbl').textContent = 'Re-record';
  if (!discard) {
    el('cap-status').textContent = 'Stopped. Review and save below.';
    // Auto-suggest a corpus match based on the transcript
    suggestCaptureMatch();
  }
}

function toggleCaptureRec() {
  if (capRecorder && capRecorder.state === 'recording') {
    stopCaptureRec(false);
  } else {
    // Re-record: clear and restart
    capFinalText = '';
    capInterimText = '';
    capPendingBlob = null;
    el('cap-playback').style.display = 'none';
    el('cap-save').disabled = true;
    el('cap-match').style.display = 'none';
    startCaptureRec();
  }
}

// Fuzzy-match a transcript to the existing corpus so you can link to it.
function suggestCaptureMatch() {
  const t = (el('cap-transcript').value || '').trim().toLowerCase();
  const matchEl = el('cap-match');
  if (!t || t.length < 3) { matchEl.style.display = 'none'; return; }
  const norm = (s) => s.toLowerCase().replace(/[¿¡?!.,;:]/g, '').trim();
  const target = norm(t);
  const all = allPhrases();
  let best = null, bestScore = 0;
  for (const p of all) {
    const cand = norm(p.es);
    if (!cand) continue;
    // Score: shared word ratio
    const tWords = new Set(target.split(/\s+/));
    const cWords = cand.split(/\s+/);
    if (!cWords.length) continue;
    let hits = 0;
    for (const w of cWords) if (tWords.has(w)) hits++;
    const score = hits / Math.max(cWords.length, tWords.size);
    if (score > bestScore && score >= 0.6) { bestScore = score; best = p; }
  }
  if (best) {
    matchEl.style.display = '';
    matchEl.dataset.phraseId = best._id;
    matchEl.innerHTML = `
      <div class="cap-match-lbl">Looks like a phrase you've studied:</div>
      <div class="cap-match-card">
        <div class="cap-match-en">${escapeHtml(best.en)}</div>
        <div class="cap-match-es">${escapeHtml(best.es)}</div>
        <div class="cap-match-ph">${escapeHtml(best.ph)}</div>
      </div>
      <button class="act primary cap-match-link" type="button">Link to this phrase</button>
    `;
    const linkBtn = matchEl.querySelector('.cap-match-link');
    linkBtn.addEventListener('click', () => {
      matchEl.dataset.linked = 'true';
      linkBtn.textContent = 'Linked ✓';
      linkBtn.disabled = true;
      // Pre-fill translation from the linked phrase
      if (!el('cap-translation').value.trim()) {
        el('cap-translation').value = best.en;
      }
    });
  } else {
    matchEl.style.display = 'none';
  }
}

function saveCaptureBlob(id, blob) {
  return new Promise((resolve, reject) => {
    if (!db || !blob) return resolve();
    const tx = db.transaction('captures', 'readwrite');
    tx.objectStore('captures').put({ id, blob, savedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
}

function loadCaptureBlob(id) {
  return new Promise((resolve) => {
    if (!db) return resolve(null);
    const tx = db.transaction('captures', 'readonly');
    const req = tx.objectStore('captures').get(id);
    req.onsuccess = () => resolve(req.result ? req.result.blob : null);
    req.onerror = () => resolve(null);
  });
}

function deleteCaptureBlob(id) {
  return new Promise((resolve) => {
    if (!db) return resolve();
    const tx = db.transaction('captures', 'readwrite');
    tx.objectStore('captures').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

async function commitCapture() {
  // Stop recording if still going
  if (capRecorder && capRecorder.state === 'recording') stopCaptureRec(false);
  const transcript = el('cap-transcript').value.trim();
  if (!transcript) {
    el('cap-status').textContent = 'Please type or record at least the Spanish phrase.';
    return;
  }
  const translation = el('cap-translation').value.trim();
  const note = el('cap-note').value.trim();
  const speaker = getCaptureSpeaker();
  const matchEl = el('cap-match');
  const linkedPhraseId = matchEl.dataset.linked === 'true' ? matchEl.dataset.phraseId : null;

  // Persist audio blob (if we got one) to IDB
  if (capPendingBlob) {
    try { await saveCaptureBlob(capPendingId, capPendingBlob); } catch (err) { console.warn(err); }
  }

  // De-dupe: if the same transcript already exists, just bump timesHeard
  const existing = state.captures.find((c) => c.transcript.toLowerCase() === transcript.toLowerCase() && c.speaker === speaker);
  if (existing) {
    existing.timesHeard = (existing.timesHeard || 1) + 1;
    existing.lastHeardTs = Date.now();
    if (translation && !existing.translation) existing.translation = translation;
    if (note && !existing.note) existing.note = note;
    if (linkedPhraseId && !existing.linkedPhraseId) existing.linkedPhraseId = linkedPhraseId;
    // Discard the new blob — we already have one
    if (capPendingBlob) await deleteCaptureBlob(capPendingId);
  } else {
    state.captures.unshift({
      id: capPendingId,
      ts: Date.now(),
      transcript,
      translation,
      speaker,
      note,
      linkedPhraseId,
      timesHeard: 1,
      hasAudio: !!capPendingBlob,
    });
  }
  saveState();
  closeCapture();
  // If we're on home, refresh; if on captures view, refresh too
  if (isVisible('view-home')) renderHome();
  if (isVisible('view-captures')) renderCapturesFeed();
}

function isVisible(id) {
  const node = document.getElementById(id);
  return node && node.style.display !== 'none';
}

// ── "Heard at home" feed view ──────────────────────────────
function renderCapturesFeed() {
  const container = el('captures-list');
  if (!container) return;
  const list = (state.captures || []).slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
  if (!list.length) {
    container.innerHTML = `
      <div class="empty">
        <h3>Nothing captured yet</h3>
        <p>Tap the <strong>floating mic button</strong> when you hear Spanish you want to remember — Stephania, the kids, family at dinner. The app records ~30 seconds, transcribes, and saves it here forever.</p>
      </div>
    `;
    return;
  }
  // Group by day for readability
  const byDay = new Map();
  for (const c of list) {
    const d = new Date(c.ts);
    const key = d.toISOString().slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(c);
  }
  let html = '';
  for (const [day, items] of byDay) {
    const date = new Date(day);
    const lbl = formatCaptureDay(date);
    html += `<div class="cap-day-head">${lbl}</div>`;
    for (const c of items) html += renderCaptureCard(c);
  }
  container.innerHTML = html;
  attachCaptureCardEvents(container);
}

function formatCaptureDay(date) {
  const today = new Date(); today.setHours(0,0,0,0);
  const dCopy = new Date(date); dCopy.setHours(0,0,0,0);
  const diff = Math.round((today - dCopy) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return date.toLocaleDateString(undefined, { weekday: 'long' });
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function renderCaptureCard(c) {
  const sp = CAPTURE_SPEAKERS.find((s) => s.id === c.speaker) || CAPTURE_SPEAKERS[CAPTURE_SPEAKERS.length - 1];
  const time = new Date(c.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const ph = spanishToPhonetic(c.transcript);
  const heard = (c.timesHeard || 1) > 1 ? `<span class="cap-times">×${c.timesHeard}</span>` : '';
  const linked = c.linkedPhraseId ? '<span class="cap-linked">in your deck</span>' : '';
  const note = c.note ? `<div class="cap-note">${escapeHtml(c.note)}</div>` : '';
  const en = c.translation ? `<div class="cap-en">${escapeHtml(c.translation)}</div>` : '';
  return `
    <div class="cap-card" data-id="${c.id}">
      <div class="cap-card-head">
        <span class="cap-speaker-tag">${sp.emoji} ${sp.label}</span>
        <span class="cap-time">${time}</span>
        ${heard}${linked}
      </div>
      <div class="cap-es">${escapeHtml(c.transcript)}</div>
      <div class="cap-ph">${escapeHtml(ph)}</div>
      ${en}
      ${note}
      <div class="cap-actions">
        ${c.hasAudio ? `<button class="act cap-play">▶ Original audio</button>` : ''}
        <button class="act cap-tts">🔊 TTS</button>
        <button class="act cap-edit">Edit</button>
        <button class="act cap-delete">Delete</button>
      </div>
    </div>
  `;
}

function attachCaptureCardEvents(container) {
  container.querySelectorAll('.cap-card').forEach((card) => {
    const id = card.dataset.id;
    const c = state.captures.find((x) => x.id === id);
    if (!c) return;
    const playBtn  = card.querySelector('.cap-play');
    const ttsBtn   = card.querySelector('.cap-tts');
    const editBtn  = card.querySelector('.cap-edit');
    const delBtn   = card.querySelector('.cap-delete');
    if (playBtn) playBtn.addEventListener('click', async () => {
      const blob = await loadCaptureBlob(id);
      if (!blob) { playBtn.textContent = '(audio missing)'; return; }
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      playBtn.classList.add('playing');
      audio.onended = audio.onerror = () => { playBtn.classList.remove('playing'); URL.revokeObjectURL(url); };
      audio.play();
    });
    if (ttsBtn) ttsBtn.addEventListener('click', () => speak(c.transcript, { btn: ttsBtn }));
    if (editBtn) editBtn.addEventListener('click', () => openCaptureEditor(c));
    if (delBtn)  delBtn.addEventListener('click', async () => {
      if (!confirm('Delete this capture? The audio is also removed.')) return;
      state.captures = state.captures.filter((x) => x.id !== id);
      await deleteCaptureBlob(id);
      saveState();
      renderCapturesFeed();
    });
  });
}

function openCaptureEditor(c) {
  // Reuse the capture sheet but in "edit" mode (no recording).
  capPendingBlob = null;
  capPendingId = c.id;
  el('cap-transcript').value = c.transcript || '';
  el('cap-translation').value = c.translation || '';
  el('cap-note').value = c.note || '';
  setCaptureSpeaker(c.speaker || 'other');
  el('cap-match').style.display = 'none';
  el('cap-playback').style.display = 'none';
  el('cap-status').textContent = 'Editing capture from ' + new Date(c.ts).toLocaleString();
  el('cap-rec-btn').classList.remove('recording');
  el('cap-rec-btn').querySelector('.cap-rec-lbl').textContent = 'Re-record';
  el('cap-save').disabled = false;
  el('cap-backdrop').classList.add('open');
  el('cap-sheet').classList.add('open');
  // Save behavior: on save, mutate existing in place
  el('cap-save').onclick = () => {
    c.transcript = el('cap-transcript').value.trim();
    c.translation = el('cap-translation').value.trim();
    c.note = el('cap-note').value.trim();
    c.speaker = getCaptureSpeaker();
    saveState();
    closeCapture();
    renderCapturesFeed();
    // Restore default click handler
    el('cap-save').onclick = commitCapture;
  };
}

function bindCapture() {
  // Build speaker chips
  const chips = el('cap-speakers');
  if (chips) {
    chips.innerHTML = CAPTURE_SPEAKERS.map((s) =>
      `<button type="button" class="cap-speaker" data-speaker="${s.id}"><span>${s.emoji}</span> ${s.label}</button>`
    ).join('');
    chips.querySelectorAll('.cap-speaker').forEach((b) =>
      b.addEventListener('click', () => setCaptureSpeaker(b.dataset.speaker)));
  }
  el('cap-fab').addEventListener('click', openCapture);
  el('cap-close').addEventListener('click', closeCapture);
  el('cap-backdrop').addEventListener('click', closeCapture);
  el('cap-rec-btn').addEventListener('click', toggleCaptureRec);
  el('cap-save').addEventListener('click', commitCapture);
  el('cap-transcript').addEventListener('input', () => {
    capFinalText = el('cap-transcript').value;
    capInterimText = '';
    suggestCaptureMatch();
  });
  // Home card "View all" + tab
  const cardCta = el('captures-card-cta');
  if (cardCta) cardCta.addEventListener('click', () => { showView('captures'); renderCapturesFeed(); });
  const back = el('captures-back');
  if (back) back.addEventListener('click', () => setTab('home'));
}

function captureSummaryForHome() {
  const list = state.captures || [];
  if (!list.length) return null;
  const recent = list.slice(0, 3);
  return { count: list.length, recent };
}

// ════════════════════════════════════════════════════════════
//  FEATURE 5 — STUCK MODE (English in → Spanish out)
// ════════════════════════════════════════════════════════════

let stuckRec = null;
let stuckLastAnswer = null;

function startStuck() {
  if (!srSupported()) {
    el('stuck-status').textContent = 'Voice input not supported on this browser.';
    return;
  }
  if (stuckRec) { try { stuckRec.stop(); } catch {} }
  stuckRec = createRecognition('en-US', { continuous: false });
  el('stuck-btn').classList.add('recording');
  el('stuck-lbl').textContent = 'Listening…';
  el('stuck-status').textContent = 'Listening — describe in English.';
  el('stuck-result').style.display = 'none';

  stuckRec.onresult = (e) => {
    const heard = e.results[0][0].transcript;
    answerStuck(heard);
  };
  stuckRec.onerror = () => stopStuckBtn();
  stuckRec.onend = () => stopStuckBtn();
  try { stuckRec.start(); }
  catch { el('stuck-status').textContent = 'Could not start microphone.'; stopStuckBtn(); }
}

function stopStuckBtn() {
  el('stuck-btn').classList.remove('recording');
  el('stuck-lbl').textContent = 'Hold to ask';
}

function answerStuck(heard) {
  el('stuck-q').textContent = '"' + heard + '"';
  // Lookup against the entire phrase database
  const all = allPhrases();
  const heardNorm = heard.toLowerCase();
  const heardWords = heardNorm.split(/\W+/).filter(Boolean);

  // Score each phrase by overlap of words in its English text
  let best = null; let bestScore = 0;
  for (const p of all) {
    const enNorm = p.en.toLowerCase();
    let score = 0;
    for (const w of heardWords) {
      if (w.length >= 3 && enNorm.includes(w)) score += 1;
      if (w.length >= 4 && enNorm.split(/\W+/).includes(w)) score += 1;
    }
    // Substring boost
    if (enNorm.includes(heardNorm)) score += 5;
    if (heardNorm.includes(enNorm) && enNorm.length > 5) score += 3;
    if (score > bestScore) { bestScore = score; best = p; }
  }

  if (!best || bestScore === 0) {
    el('stuck-a').textContent = '(no match)';
    el('stuck-ph').textContent = '';
    el('stuck-en').textContent = 'Try describing it differently. Example: "the thing you spread on bread"';
    el('stuck-result').style.display = '';
    el('stuck-status').textContent = 'No match. Try a different way of saying it.';
    return;
  }

  stuckLastAnswer = best;
  el('stuck-a').textContent = best.es;
  el('stuck-ph').textContent = best.ph;
  el('stuck-en').textContent = best.en;
  el('stuck-result').style.display = '';
  el('stuck-status').textContent = 'Speaking through your speaker now.';
  // Speak the Spanish answer
  speak(best.es, { btn: null });
}

function bindStuck() {
  // Stuck big button — tap to start, mic auto-stops on silence
  el('stuck-btn').addEventListener('click', startStuck);
  el('stuck-repeat').addEventListener('click', () => {
    if (stuckLastAnswer) speak(stuckLastAnswer.es, { btn: el('stuck-repeat') });
  });
  // FAB — opens Live tab into Stuck mode
  el('stuck-fab').addEventListener('click', () => {
    setTab('live');
    setTimeout(() => openLiveMode('stuck'), 50);
  });
}

// ── Boot ───────────────────────────────────────────────────
async function boot() {
  loadCustomPhrasesIntoData();
  tickStreak();
  bindSettings();
  bindPractice();
  bindAddForm();
  bindCoach();
  bindLiveTabs();
  bindEavesdrop();
  bindMirror();
  bindVoiceBank();
  bindStuck();
  bindCapture();
  bindVerbMode();
  // Load voice bank index
  try { await openVoiceBankDB(); await loadVoiceBankIndex(); } catch {}

  // TTS voices
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    // iOS Safari sometimes loads voices late — retry once
    setTimeout(loadVoices, 500);
  }

  // Header buttons
  el('btn-search').addEventListener('click', () => {
    const row = el('search-row');
    row.classList.toggle('hidden');
    if (!row.classList.contains('hidden')) {
      el('search-input').focus();
    } else {
      el('search-input').value = ''; showView('home');
    }
  });
  el('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => handleSearch(e.target.value), 150);
  });
  el('btn-settings').addEventListener('click', openSheet);
  el('backdrop').addEventListener('click', closeSheet);
  el('btn-direction').addEventListener('click', toggleDirection);
  syncDirectionBtn();

  // Back button
  el('back-btn').addEventListener('click', () => {
    const activeTab = document.querySelector('.nav-item.active').dataset.tab;
    setTab(activeTab);
  });

  // Bottom nav
  document.querySelectorAll('.nav-item').forEach((b) => {
    b.addEventListener('click', () => setTab(b.dataset.tab));
  });

  renderHome();

  // First-launch onboarding (after the home view is ready, so the greeting refreshes cleanly)
  maybeAskName();
}

document.addEventListener('DOMContentLoaded', boot);
