# Cotidiano

> **Spanish for the day** — built for Stu, by Stu's pair-programmer.
> Latin-American Spanish. Phonetic spelling. Tap to hear. Works offline.

A Progressive Web App (PWA) you install on your phone like any other app — except there's nothing to download from a store, no account, no tracking, no subscription, and the data lives on your device.

## 🚀 What makes Cotidiano different

Most language apps are flashcard drills + scripted dialogues. Cotidiano has **five features no major app combines**:

| # | Feature | Why it matters |
|---|---|---|
| 1 | **👁️ Eavesdrop Mode** | Phone listens to the room. Spanish appears live on screen with phonetics. Like subtitles for real life — passive immersion learning. |
| 2 | **🎤 Pronunciation Coach** | Say any phrase, app listens, scores 0-100, shows word-by-word diff. Tells you which words you missed. |
| 3 | **🪞 Mirror Mode** | Speak Spanish freely. See exactly what came out of your mouth in writing. Catch your own mistakes (e.g. *embarazada* vs *avergonzado*). |
| 4 | **💕 Family Voice Bank** | Stephania or Joaquín records phrases in their actual voice. You practice the version your real wife actually says. |
| 5 | **🆘 Stuck Mode** | Mid-conversation, forgot a word. Tap floating 🆘 button → describe in English by voice → Spanish word comes out the speaker. No screen-glancing. |

No other app has the combo. All run **offline-first**, **no API keys**, **no accounts**.

---

## What's inside

- **~720 phrases** across 63 categories — see "Sections" below
- **🎂 Family birthday tracker** — knows 22 birthdays (Stephania, parents, siblings, cousins, in-laws, deceased grandmothers). Home page shows today's celebrant with the Spanish phrase ready to speak, plus the next 3 upcoming with day-counts.
- **EN ↔ ES toggle** — flip between English-first (translate to Spanish) and Spanish-first (translate to English) with the header button
- **8 mini-dialogues** — short realistic conversations
- **Phonetic spelling** for every phrase, written how it sounds in English (e.g. `BWEH-nohs DEE-ahs` for *Buenos días*)
- **🎯 Practice mode** — flashcards with **spaced repetition** (Hard / Got it / Easy)
- **➕ Add your own phrases** — type or dictate via voice, with auto-generated phonetics
- **Tap any phrase** → hear it spoken in a Latin-American voice
- **Slow mode** — 0.7× speed for learning
- **Favorites** — star phrases to come back to
- **"Got it" tracking** — mark phrases as learned, fade them out
- **Search** — across English, Spanish, and phonetics
- **Time-aware suggestions** — open the app at breakfast, see breakfast phrases
- **Streak counter** — tiny dopamine hit for daily practice
- **Works offline** after first load
- **No accounts, no servers, no tracking** — everything lives in your browser

### Sections mapped to your actual day

**🌅 Daily Life:** Waking up → Breakfast → Kids in the Morning → Stephania → Bus & Taxi → Arriving at Work → Office Chat → Lunch → Leaving Work → Groceries → Arriving Home → Feeding the Kids → Making & Eating Dinner → Family Time → Putting Kids to Bed → Getting Ready for Bed → Bedroom Talk

**💛 Personal:** Survival Phrases · Feelings & Moods · Health & Body · Numbers & Time · Money & Paying · Asking Questions

**💼 Work:** Greetings · Meetings · Tech & Dev · With Clients · Talking About the Studio · Pricing & Contracts

**🌎 More Scenarios:** Portero & Building · Parent-Teacher · In-Laws & Family · Weekend Plans · At the Doctor · Bank & Bureaucracy · Body & Pain · Weather · Restaurant (deep)

**📍 Out & About:** Apologies & Social Repair · Fútbol & Sports · Hair Salon & Barber · Markets & Haggling · Emergency & Police · Driving & Mechanic · WiFi & Tech Problems · Phone & Messages

**👨‍👩‍👧‍👦 Parenting:** Toddler (Emiliano) · Teen Talk (Joaquín) · Kid Birthdays & Parties

**🇵🇪 Peru Culture:** Money & Lima Slang (luca, chamba, bacán, palta) · Religion & Blessings (Dios te bendiga, ojalá) · Peruvian Cooking (lomo saltado, ají de gallina, aguadito, anticuchos) · Holidays & Events (Fiestas Patrias, Canción Criolla, panetón, doce uvas)

**👪 Family Network:** With Stephania (deep) · Jorge (Dad) & Gladys (in LA) · Belen, Jorge Jr & Chris · Chris, Cyn & baby Paz · Birthdays & Wishes · Aunt Carmen, Mario, Mario Jr, Alejandra

**🎒 Kids Deep:** Joaquín's School · Joaquín's Future & University · Teaching Emiliano English · Teaching Emiliano Spanish

**✨ My Phrases:** anything you add yourself appears here

The **Studio** section name-checks Datacendia, Sereno, Punta Lúcida, and Rainey Laguna Studios so when somebody asks what you do you have it ready.

### 🎯 How Practice mode works

1. Tap the **Practice** tab (or the big Practice card on Home)
2. Pick a deck: **Due now**, **My saved**, **All phrases mixed**, or a specific section
3. See the English → mentally translate → tap card to reveal the Spanish + audio
4. Rate yourself:
   - **🔁 Hard** — shows again in ~10 minutes
   - **👍 Got it** — shows again in ~3 days (doubles each correct review)
   - **⭐ Easy** — shows again in ~1 week (2.7× spacing)
5. Phrases you've never practiced show up first when you tap "Due now"

Simplified SM-2 algorithm. Caps at 90-day intervals.

### ➕ Adding your own phrases

When you encounter a phrase you want to remember, tap **Add** in the bottom nav:

1. Type or **🎙️ dictate** the English (uses your phone's voice recognition)
2. Type or paste the Spanish (Google Translate if needed)
3. **Phonetic auto-fills** as you type Spanish — edit if it doesn't match how you'd say it
4. (Optional) Add a note — when/where to use it
5. **🔊 Test pronunciation** before saving
6. Saved phrases live under "My Phrases" on the Home screen, and they're available in Practice mode too

The phonetic generator handles 95% of common Spanish words correctly. For the rest, just tap **↻** to regenerate or edit by hand.

---

## Run it locally (right now)

PowerShell, from the project folder:

```powershell
# Python (probably already installed)
python -m http.server 5500
```

Then open <http://localhost:5500> in your browser.

Or with Node:

```powershell
npx serve .
```

---

## Deploy free on Netlify (recommended)

You already use Netlify for PANH. Same drill:

1. Go to <https://app.netlify.com/drop>
2. Drag the entire `cotidiano` folder onto the page
3. Netlify gives you a URL like `https://cotidiano-stu.netlify.app`
4. (Optional) Rename the site to something memorable in Site Settings

That's it. No build step, no config.

---

## Install on Stu's Android phone

1. Open the deployed URL in **Chrome**
2. Chrome will show "Install app" or "Add to Home screen" — tap it
3. Cotidiano now lives on your home screen like any app
4. Open it once with internet, after that it works offline

If no install prompt appears: tap the **⋮ menu → Install app**.

---

## Install on Stephania's iPhone

iOS Safari doesn't show an install prompt — you trigger it manually:

1. Open the deployed URL in **Safari** (not Chrome — must be Safari on iOS)
2. Tap the **Share** button (square with up-arrow)
3. Scroll down → **Add to Home Screen**
4. Tap **Add**

It now opens like a native app, full-screen, with offline support.

---

## How to use

### Daily basics
- **Tap a phrase card** → plays normal speed (or family voice if one is recorded)
- **🔊 Play** → same
- **🐢 Slow** → 0.7× for learning
- **🎤 Try** → opens Pronunciation Coach for that phrase
- **💕 Voice** → record a family member's voice for this phrase
- **☆ Save** → adds to your Saved tab
- **◯ Got it** → marks as learned (fades the card)
- **EN→ES / ES→EN (top right)** → flip translation direction
- **🔍 / ⚙️ (top right)** → search and settings

### EN ↔ ES direction toggle

Tap the **EN→ES** button in the header to flip:

- **EN→ES** (default) — English on top, Spanish below. Use when *you want to say something in Spanish*. Practice flashcards show English → you recall Spanish.
- **ES→EN** — Spanish on top, English below. Use when *someone said something to you and you want to look it up*. Practice flashcards show Spanish → you recall the English meaning.

The audio always plays the Spanish — what changes is which language is the "prompt." Setting persists across sessions.

### The five innovative features

**👁️ Eavesdrop — `Live tab → Listen`**
Press "Start listening." Hand someone the phone or set it on the table. Spanish is transcribed live with phonetics underneath. Tap any captured line to **🔊 hear it**, **🌐 translate** in Google Translate, or **⭐ save** to My Phrases. Auto-restarts when iOS Safari's session times out (every ~60s).

**🎤 Pronunciation Coach — `🎤 Try button on any phrase`**
Hear the target → tap mic → say it. Get a 0-100 score, color-coded. Shows word-by-word diff: green = correct, red strike-through = missed, yellow = extra. The speech engine is the judge — if it recognises your words, your pronunciation passed real-world muster.

**🪞 Mirror Mode — `Live tab → Mirror`**
Tap the mic. Say something in Spanish. App shows you exactly what your mouth produced, with phonetics. Spot moments like saying *estoy embarazada* (I'm pregnant) when you meant *estoy avergonzado* (I'm embarrassed). Tap **🌐 Translate** to confirm meaning, or **⭐ Save** to keep the corrected version.

**💕 Family Voice Bank — `💕 Voice button on any phrase`**
Tap the button → hand phone to Stephania (or Joaquín) → tap who's speaking → press-and-hold the record button while they say it → listen back → save. From then on, that phrase plays in *their* actual voice instead of the synthetic TTS. Stored locally in IndexedDB, never uploaded.

**🆘 Stuck Mode — floating 🆘 button on Home, or `Live tab → Stuck`**
Mid-conversation, forgot a word. Tap the floating 🆘 → say (in English) what you're trying to express → release. The closest matching Spanish phrase plays through your phone's speaker so you can repeat it without breaking eye contact. Works best for phrases already in the vault.

---

## Phonetic key

The phonetic spelling is designed for an English reader. Rules:

| Pattern | Sounds like | Example |
|---|---|---|
| `CAPS` | stressed syllable | `KOH-moh` |
| `-` | syllable break | `BWEH-nohs` |
| `ah, eh, ee, oh, oo` | a, e, i, o, u | `MAH-mah` |
| `y` | Spanish `ll` | `KAH-yeh` for *calle* |
| `ny` | Spanish `ñ` | `mah-NYAH-nah` for *mañana* |
| `h` | Spanish `j`, `g+e/i` | `hwah-KEEN` for *Joaquín* |
| `s` | Spanish `z`, `c+e/i` (LATAM) | `GRAH-syahs* |
| `rr` | rolled r | `RREE-koh* |

The Spanish `h` is silent. Always.

---

## Adding your own phrases

Open `data.js`. Each phrase looks like this:

```js
{ en: "I love you", es: "Te amo", ph: "teh AH-moh", note: "optional tip" },
```

Add new phrases anywhere inside a section's `phrases: [ … ]` array. Save. Refresh the app. Done.

To add a brand-new section, copy any existing section block and change the `id`, `title`, `icon`, and phrases.

---

## Tech (for the curious)

- Vanilla HTML/CSS/JS. No framework. No build.
- TTS via the browser's `SpeechSynthesis` API (free, native, works offline once voices are downloaded)
- Data persisted in `localStorage`
- Service worker (`sw.js`) caches everything for offline use
- Total size: ~80 KB gzipped

---

## Files

```
cotidiano/
├── index.html              # The app shell
├── styles.css              # Styling
├── app.js                  # All the interactivity (TTS, practice, add, phonetic gen)
├── data.js                 # All phrases + dialogues (edit this to add more)
├── sw.js                   # Service worker (offline cache)
├── manifest.webmanifest    # PWA manifest
├── icon.svg                # App icon
├── test-phonetic.js        # Sanity check for the auto-phonetic generator (Node)
└── README.md               # This file
```

Run `node test-phonetic.js` after editing the phonetic generator to make sure nothing broke. 19/20 known-good Spanish words pass.

---

Built May 2026. Suerte, Stu. 🇵🇪
