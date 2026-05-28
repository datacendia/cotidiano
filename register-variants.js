// REGISTER VARIANTS — same phrase, different emotional/social register.
//
// Hand-authored for Peruvian/Lima Spanish. Each key matches the phraseId
// computed by phraseId() in app.js (p_ + lowercased Spanish, stripped of
// punctuation, first 32 chars).
//
// Each entry lists alternative ways to say the SAME thing in different
// situations. The original phrase remains the default; variants are
// surfaced as chips on the phrase card that swap text + speak when tapped.
//
// reg values map to chip colors:
//   casual   = green (light, friendly)
//   intimate = warm red (with Stephania, kids — affectionate)
//   formal   = blue (with suegros, work, elders — usted)
//   firm     = brown (boundary-setting with kids, urgency)

window.REGISTER_VARIANTS = {

  // ─── Affection ──────────────────────────────────────────
  'p_teamo': [
    { reg: 'casual',   label: '🌿 lighter',  es: 'Te quiero',                  ph: 'teh KYE-roh',                                       when: 'Less intense — works for family, friends, kids' },
    { reg: 'intimate', label: '❤️ deeper',    es: 'Te adoro, mi vida',          ph: 'teh ah-DOH-roh, mee BEE-dah',                       when: 'After a fight, anniversaries, vulnerable moments' },
    { reg: 'firm',     label: '💍 forever',  es: 'Te amo con todo mi corazón', ph: 'teh AH-moh kon TOH-doh mee koh-rah-SOHN',           when: 'Promises, vows, deeply meant' },
  ],

  'p_teamodescansa': [
    { reg: 'casual',   label: '🌿 nightly',  es: 'Que descanses, amor',                ph: 'keh des-KAHN-ses, ah-MOR',                  when: 'Routine "good night" to Stephania' },
    { reg: 'intimate', label: '❤️ tender',    es: 'Sueña conmigo, mi vida',             ph: 'SUEH-nyah kon-MEE-goh, mee BEE-dah',        when: 'Romantic, parting after a deep day' },
  ],

  // ─── Greetings ──────────────────────────────────────────
  'p_buenosdíasmiamor': [
    { reg: 'casual',   label: '🌿 plain',    es: 'Buenos días',                          ph: 'BWEH-nos DEE-as',                          when: 'Generic — anyone, any time before noon' },
    { reg: 'formal',   label: '🎩 to elders', es: 'Buenos días, ¿cómo amaneció?',         ph: 'BWEH-nos DEE-as, KOH-moh ah-mah-neh-SYOH', when: 'Suegros, abuelos, neighbours over 50' },
    { reg: 'firm',     label: '👶 to kids',  es: 'Buenos días, chiquito. ¡Arriba!',      ph: 'BWEH-nos DEE-as, chee-KEE-toh. ah-RREE-bah', when: 'Waking the kids up cheerfully' },
  ],

  'p_holasuegra': [
    { reg: 'casual',   label: '🌿 warm',     es: 'Hola, suegrita querida',               ph: 'OH-lah, sweh-GREE-tah keh-REE-dah',         when: 'Casual greeting if you have a close bond' },
    { reg: 'formal',   label: '🎩 first time', es: 'Buenos días, doña Gladys, ¿cómo está?', ph: 'BWEH-nos DEE-as, DOH-nyah GLAH-dees, KOH-moh es-TAH', when: 'When she comes to the door, formal occasion' },
  ],

  'p_buenasnochesmiamor': [
    { reg: 'casual',   label: '🌿 plain',     es: 'Buenas noches',                        ph: 'BWEH-nas NOH-ches',                         when: 'Generic — neighbours, anyone' },
    { reg: 'formal',   label: '🎩 polite',    es: 'Que tenga buena noche',                ph: 'keh TEN-gah BWEH-nah NOH-cheh',             when: 'Leaving suegros\' house at night, taxi driver, doorman' },
    { reg: 'firm',     label: '👶 to kids',   es: 'A dormir, chiquitos. Buenas noches.',   ph: 'ah dor-MEER, chee-KEE-tohs. BWEH-nas NOH-ches', when: 'Tucking the kids in, end of bedtime routine' },
  ],

  // ─── Bedtime / kids ─────────────────────────────────────
  'p_apagalaluz': [
    { reg: 'intimate', label: '❤️ to spouse', es: 'Apaga la luz, mi amor',               ph: 'ah-PAH-gah lah LUTH, mee ah-MOR',           when: 'Going to sleep together' },
    { reg: 'firm',     label: '😤 to kids',   es: '¡Apaga esa luz ya!',                  ph: 'ah-PAH-gah EH-sah LUTH yah',                when: 'Third time asking — you mean it' },
    { reg: 'casual',   label: '🌿 gentle',    es: 'Hora de apagar la luz, chiquito',      ph: 'OH-rah deh ah-pah-GAR lah LUTH, chee-KEE-toh', when: 'First ask, calm, end of bedtime story' },
  ],

  'p_vamosalacama': [
    { reg: 'intimate', label: '❤️ to spouse', es: 'Vamos a la cama, amor',               ph: 'BAH-mohs ah lah KAH-mah, ah-MOR',           when: 'End of the day, going to bed together' },
    { reg: 'casual',   label: '🌿 gentle',    es: 'Vamos chiquito, hora de cama',         ph: 'BAH-mohs chee-KEE-toh, OH-rah deh KAH-mah', when: 'First ask to the kids, calm voice' },
    { reg: 'firm',     label: '😤 final',     es: '¡A la cama ya!',                      ph: 'ah lah KAH-mah yah',                        when: 'Final warning, no more negotiation' },
  ],

  // ─── Apologies ──────────────────────────────────────────
  'p_losientonosé': [
    { reg: 'casual',   label: '🌿 plain',    es: 'Perdón, no tengo idea',                ph: 'per-DOHN, noh TEN-goh ee-DEH-ah',           when: 'Friends, peers, casual conversation' },
    { reg: 'formal',   label: '🎩 polite',    es: 'Discúlpeme, no tengo esa información', ph: 'dees-KOOL-peh-meh, noh TEN-goh EH-sah een-for-mah-SYOHN', when: 'Work, strangers, formal calls' },
    { reg: 'intimate', label: '❤️ to spouse', es: 'No sé, mi amor, lo averiguo',          ph: 'noh seh, mee ah-MOR, loh ah-veh-REE-gwoh', when: 'Stephania asks something you don\'t know' },
  ],

  // ─── Requests at the table / home ──────────────────────
  'p_pásameelpan': [
    { reg: 'intimate', label: '❤️ to spouse', es: '¿Me pasas el pan, amor?',             ph: 'meh PAH-sas el PAHN, ah-MOR',               when: 'Family dinner with Stephania' },
    { reg: 'formal',   label: '🎩 at suegros', es: '¿Me podría pasar el pan, por favor?',  ph: 'meh poh-DREE-ah pah-SAR el PAHN por fah-VOR', when: 'Sunday lunch at suegros, formal hosts' },
    { reg: 'firm',     label: '👶 to kids',   es: 'Pásame el pan, por favor',            ph: 'PAH-sah-meh el PAHN por fah-VOR',           when: 'Asking the kids — clear, calm, respectful' },
  ],

  'p_pásameelcontrol': [
    { reg: 'intimate', label: '❤️ to spouse', es: '¿Me pasas el control, amor?',         ph: 'meh PAH-sas el kon-TROL, ah-MOR',           when: 'Couch with Stephania' },
    { reg: 'firm',     label: '😤 to kids',   es: 'El control, ahora',                   ph: 'el kon-TROL, ah-OH-rah',                    when: 'When the kids are hogging the TV' },
  ],

  // ─── Gratitude ─────────────────────────────────────────
  'p_graciasportodo': [
    { reg: 'casual',   label: '🌿 light',    es: 'Mil gracias',                           ph: 'meel GRAH-syas',                            when: 'Casual thank-you, friends, taxi driver' },
    { reg: 'intimate', label: '❤️ heartfelt', es: 'Te lo agradezco un montón, amor',       ph: 'teh loh ah-grah-DES-koh oon mon-TON, ah-MOR', when: 'When Stephania does something thoughtful' },
    { reg: 'formal',   label: '🎩 deeply',    es: 'Le agradezco profundamente todo',      ph: 'leh ah-grah-DES-koh proh-foon-dah-MEN-teh TOH-doh', when: 'Suegros after a big help, work mentor' },
  ],

  'p_graciasportutiempo': [
    { reg: 'formal',   label: '🎩 to elders', es: 'Le agradezco mucho su tiempo',         ph: 'leh ah-grah-DES-koh MOO-choh soo TYEM-poh',  when: 'Suegros, doctors, formal meetings' },
    { reg: 'casual',   label: '🌿 to peers',  es: 'Gracias por hacerte un espacio',       ph: 'GRAH-syas por ah-SER-teh oon es-PAH-syoh',  when: 'Coworker, friend, casual' },
  ],

  // ─── Care / well-wishing ────────────────────────────────
  'p_cuídateporfavor': [
    { reg: 'intimate', label: '❤️ to spouse', es: 'Cuídate mucho, mi amor',              ph: 'KWEE-dah-teh MOO-choh, mee ah-MOR',         when: 'Stephania leaves for work / a trip' },
    { reg: 'formal',   label: '🎩 to elders', es: 'Cuídese mucho, por favor',            ph: 'KWEE-deh-seh MOO-choh por fah-VOR',         when: 'Suegros leaving, neighbour, anyone in usted' },
  ],

  'p_quedescanseshermosa': [
    { reg: 'casual',   label: '🌿 plain',    es: 'Que descanses',                         ph: 'keh des-KAHN-ses',                          when: 'Friend, family member, generic' },
    { reg: 'formal',   label: '🎩 to elders', es: 'Que descanse, señora',                 ph: 'keh des-KAHN-seh, seh-NYOR-ah',             when: 'Suegra heading to bed' },
  ],

  // ─── Help requests ──────────────────────────────────────
  'p_mepodríaayudar': [
    { reg: 'casual',   label: '🌿 to peers',  es: '¿Me ayudas con esto?',                 ph: 'meh ah-YOO-das kon ES-toh',                 when: 'Coworker, friend' },
    { reg: 'intimate', label: '❤️ to spouse', es: '¿Me ayudas, amor?',                   ph: 'meh ah-YOO-das, ah-MOR',                    when: 'Stephania' },
    { reg: 'firm',     label: '😤 urgent',    es: 'Necesito que me ayudes',              ph: 'neh-seh-SEE-toh keh meh ah-YOO-des',        when: 'When you really need it now' },
  ],

  // ─── Approach / "come here" ─────────────────────────────
  'p_venacáamor': [
    { reg: 'casual',   label: '🌿 plain',    es: 'Ven',                                   ph: 'BEN',                                       when: 'Quick, casual call' },
    { reg: 'firm',     label: '😤 to kids',   es: 'Ven acá ahora mismo',                  ph: 'BEN ah-KAH ah-OH-rah MEES-moh',             when: 'Kid is misbehaving — non-negotiable' },
    { reg: 'casual',   label: '👶 sweet',    es: 'Ven, chiquito',                         ph: 'BEN, chee-KEE-toh',                         when: 'Calling a child gently' },
  ],

  // ─── Vamos ──────────────────────────────────────────────
  'p_vamosallegartarde': [
    { reg: 'intimate', label: '❤️ to spouse', es: 'Amor, se nos hace tarde',              ph: 'ah-MOR, seh nos AH-seh TAR-deh',            when: 'Gentle nudge to Stephania' },
    { reg: 'firm',     label: '😤 urgent',    es: '¡Apúrense, ya!',                      ph: 'ah-POO-ren-seh, yah',                       when: 'Kids dawdling at the door' },
  ],

  // ─── Toasts ─────────────────────────────────────────────
  'p_salud': [
    { reg: 'casual',   label: '🌿 cheers',    es: '¡Salud!',                              ph: 'sah-LOOD',                                  when: 'Generic toast — bar, friends' },
    { reg: 'formal',   label: '🎩 family',    es: '¡Salud, por la familia!',              ph: 'sah-LOOD, por lah fah-MEE-lyah',            when: 'Sunday lunch at suegros, holidays' },
    { reg: 'intimate', label: '❤️ to spouse', es: 'Por nosotros, mi amor',               ph: 'por noh-SOH-tros, mee ah-MOR',              when: 'Date night, anniversary' },
  ],

  'p_buenprovecho': [
    { reg: 'formal',   label: '🎩 to guests', es: 'Que disfruten el almuerzo',            ph: 'keh dees-FROO-ten el al-MWEHR-soh',         when: 'Hosting, before others start eating' },
    { reg: 'intimate', label: '❤️ to spouse', es: 'A comer, amor',                       ph: 'ah koh-MER, ah-MOR',                        when: 'Just you and Stephania, casual' },
  ],

};
