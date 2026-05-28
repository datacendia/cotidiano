# Cotidiano Corpus Roadmap

The Spanish phrasebook is a personal, curated resource — biased toward the
USER's daily life with Stephania, the kids, and the suegros in Lima. The goal
is not to be exhaustive; it is to be **useful**. Each domain expansion is one
focused authoring session.

## Status

| Domain | Section IDs | Phrases | Status |
|---|---|---|---|
| Daily life | `daily.*` | ~85 | ✅ baseline |
| Personal | `personal.*` | ~50 | ✅ baseline |
| Work | `work.*` | ~50 | ✅ baseline |
| Extra | `extra.*` | ~80 | ✅ baseline |
| Out & about | `out.*` | ~70 | ✅ baseline |
| **Parenting** | `parenting.*` | **~135** | ✅ baseline + **deep cuts** (B1) |
| Peru culture | `culture.*` | ~50 | ✅ baseline |
| Family | `family.*` | ~110 | ✅ baseline |
| Kids talk | `kids.*` | ~50 | ✅ baseline |
| Custom | `custom.*` | varies | user-added |
| **TOTAL** | | **~866** | |

Phrases baked: **~866** (up from 785).
English phonetics: **124,911 CMUdict entries** (covers any English word).
Spanish conjugator: **regular + 17 irregulars + stem-changers + orthography** (Verbs tab, Live).
Register variants: **19 phrases × 2-3 variants**.

---

## Pending domain batches

These are the 5 remaining domains identified as gaps in the current corpus.
Each is one focused session (~30 min). Trigger a batch by saying:

> *"Author the **In-Law Dynamics** domain"* (or any title below).

### B2 — In-Law Dynamics & Family Politics (~120 phrases)

Sections planned:
- **Suegros formal** — first-meeting, holidays, formal toasts
- **Suegra specific** — daily check-ins, asking about her health, food compliments
- **Suegro specific** — the male-bonding subset, sports, work updates
- **Family gatherings** — almuerzos, navidad, fiestas patrias
- **Boundary management** — politely declining, navigating opinions
- **Gift-giving etiquette** — birthdays, anniversaries, "no es nada"

### B3 — Tech Work Meetings & Industry (~150 phrases)

Sections planned:
- **Stand-ups & sprints** — yesterday/today/blockers, sprint planning
- **Code review** — "this PR needs", "let's pair on this", merge etiquette
- **Architecture discussions** — proposing, pushing back, agreeing
- **Client calls** — discovery, demos, scope conversations
- **One-on-ones** — feedback, career, raising concerns
- **Hiring & interviews** — running an interview in Spanish

### B4 — Difficult Emotional Conversations (~100 phrases)

Sections planned:
- **Repair after a fight** — apology with specificity, owning impact
- **Vulnerability** — admitting fear, asking for support
- **Mental health** — depression, anxiety, asking for help
- **Grief** — loss, condolences, sitting with someone
- **Conflict at work** — disagreements without burning bridges
- **Saying no** — to family, to work, to obligation

### B5 — Bureaucracy, Money & Officialdom (~150 phrases)

Sections planned:
- **Banking & Yape/Plin** — transfers, charges, disputes
- **DNI / Migraciones** — appointments, renewals, status updates
- **SUNAT (taxes)** — declaraciones, RUC, recibos
- **AFP & retirement** — withdrawals, statements, choosing fund
- **Insurance (seguros)** — health, car, home, claims
- **Real estate** — rent negotiations, buying, casero/casera relationships

### B6 — Health Deep Cuts (~100 phrases)

Sections planned:
- **Specialist visits** — cardio, dermatology, physio, psychology
- **Pharmacy** — asking for OTC, controlled medicines, generics
- **Lab tests** — ordering, picking up results, asking what they mean
- **Dental** — cleanings, cavities, orthodontia (for the kids)
- **Mental health professionals** — therapist, psychiatrist, neurologist
- **Hospital admission** — ER, surgery prep, recovery, billing

---

## Ongoing future ideas (not yet committed)

- **B7 — Travel within Peru** (Cusco, Arequipa, Iquitos, Mancora)
- **B8 — Driving & cars** (mechanic, brevete, SOAT, accidents)
- **B9 — Romantic / intimate** (hand-curated, private)
- **B10 — Spiritual / Catholic life** (mass, sacraments, prayers, Easter)

---

## How phrases are authored

Each entry uses this exact shape:

```js
{ en: "English phrase",
  es: "Spanish (Lima register)",
  ph: "PHO-neh-teek SPELL-ing",
  note: "Optional context, when, who, why" }
```

Rules:
1. **Spanish must be Lima Peruvian register**, not Mexican or Spaniard.
2. **Phonetic uses CAPS for stressed syllable**.
3. **Notes only when the phrase needs context** — don't pad with trivia.
4. **One phrase = one purpose**. Don't combine two ideas in one entry.
5. **Register variants** (formal/intimate/firm) go in `register-variants.js`,
   not as separate phrases here.

## How conjugations work

The Verbs tab (Live → Verbs) handles any infinitive. No manual authoring
needed for conjugations — the engine generates them rules-based.

To add a new fully-irregular verb, edit `IRREGULAR` in `@conjugator.js`.
To add a stem-changer, add it to `STEM_CHANGE`.

## How register variants work

Edit `@register-variants.js`. Each entry is keyed by `phraseId` (computed as
`p_` + lowercased Spanish, stripped of punctuation, first 32 chars). Variants
appear automatically as chips on the matching phrase card.

## Regenerating English phonetics

```powershell
node scripts/build-en-dict.js          # full bake (default, ~2.5 MB)
node scripts/build-en-dict.js --subset # only words in data.js (~14 KB)
```
