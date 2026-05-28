// Cotidiano data — Latin American Spanish for Stu's actual day.
//
// Phonetic key (English-reader friendly):
//   CAPS  = stressed syllable
//   -     = syllable break
//   a→ah  e→eh  i→ee  o→oh  u→oo
//   ll→y  ñ→ny  j→h (strong)  g+e/i→h
//   z, c+e/i → s  (LATAM, no Spain "th")
//   h is silent.  rr is a rolled r.

// ── Family birthdays (Stephania's side) ─────────────────────
// date format: "MM-DD" (zero-padded). year optional.
// cohort drives the formality of the auto-generated birthday phrase:
//   wife        → "Feliz cumpleaños, mi amor"
//   elder-inlaw → formal usted: "Le deseo un feliz cumpleaños, suegro"
//   abuelo      → very formal usted: "Le deseo lo mejor, abuelo"
//   elder       → semi-formal: "Que cumpla muchos más"
//   peer        → casual tú: "Feliz cumple"
//   teen        → casual but warm
//   memoriam    → "Hoy recordamos a..."
const BIRTHDAYS = [
  { name: "Stephania",       date: "05-09", year: 1991, cohort: "wife",        relES: "esposa",            relEN: "wife" },
  { name: "Gwen",            date: "05-28",             cohort: "peer",        relES: "prima",             relEN: "cousin (Tía Giovanna's kid)" },
  { name: "Papá Jorge",      date: "05-10", year: 1967, cohort: "elder-inlaw", relES: "suegro",            relEN: "father-in-law" },
  { name: "Belén",           date: "05-12", year: 2010, cohort: "teen",        relES: "cuñada",            relEN: "sister-in-law" },
  { name: "Mamá Gladys",     date: "07-15", year: 1965, cohort: "elder-inlaw", relES: "suegra",            relEN: "mother-in-law (in LA)" },
  { name: "Chris",           date: "08-17", year: 1987, cohort: "peer",        relES: "cuñado",            relEN: "brother-in-law" },
  { name: "Jorge (hermano)", date: "02-08",             cohort: "peer",        relES: "cuñado",            relEN: "brother-in-law" },
  { name: "Tía Carmen",      date: "04-05",             cohort: "elder",       relES: "tía política",      relEN: "aunt-in-law" },
  { name: "Alejandra",       date: "04-20",             cohort: "peer",        relES: "prima política",    relEN: "cousin-in-law" },
  { name: "Tío Juan",        date: "02-28",             cohort: "elder",       relES: "tío político",      relEN: "uncle-in-law" },
  { name: "Marito",          date: "07-02",             cohort: "peer",        relES: "primo",             relEN: "cousin (Mario Jr)" },
  { name: "Abuelo Jorge",    date: "07-11",             cohort: "abuelo",      relES: "abuelo",            relEN: "grandfather-in-law" },
  { name: "Abuelo Julio",    date: "01-13",             cohort: "abuelo",      relES: "abuelo",            relEN: "grandfather-in-law" },
  { name: "Tía Giovanna",    date: "03-05",             cohort: "elder",       relES: "tía política",      relEN: "aunt-in-law" },
  { name: "Tía Sussie",      date: "03-12",             cohort: "elder",       relES: "tía política",      relEN: "aunt-in-law" },
  { name: "Andrew",          date: "08-15",             cohort: "peer",        relES: "primo",             relEN: "cousin (Tía Giovanna's kid)" },
  { name: "Paz",             date: "08-15", year: 2011, cohort: "teen",        relES: "sobrina",           relEN: "niece (Chris's daughter, ~14-15)" },
  { name: "Tío Mario",       date: "09-17",             cohort: "elder",       relES: "tío político",      relEN: "uncle-in-law (Carmen's husband)" },
  { name: "Cinthya",         date: "03-11",             cohort: "peer",        relES: "cuñada",            relEN: "sister-in-law (Chris's fiancée)" },
  { name: "Tío Fred",        date: "08-15",             cohort: "elder",       relES: "tío político",      relEN: "uncle-in-law (Sussie's husband)" },
  // En memoria · in memoriam
  { name: "Mamá Maruja",     date: "12-15",             cohort: "memoriam",    relES: "abuela (q.e.p.d.)", relEN: "grandmother (rest in peace)", memoriam: true },
  { name: "Mamá Tuta",       date: "12-19",             cohort: "memoriam",    relES: "abuela (q.e.p.d.)", relEN: "grandmother (rest in peace)", memoriam: true },
];

const DATA = {

  /* ════════════════════════════════════════════════════
     DAILY LIFE — mapped to Stu's actual day
     ════════════════════════════════════════════════════ */
  daily: {
    title: "Daily Life",
    icon: "🌅",
    sections: [

      { id: "waking", title: "Waking Up", icon: "☀️", phrases: [
        { en: "Good morning, my love", es: "Buenos días, mi amor", ph: "BWEH-nohs DEE-ahs, mee ah-MOHR", note: "To Stephania — the everyday wake-up." },
        { en: "Did you sleep well?", es: "¿Dormiste bien?", ph: "dohr-MEES-teh bee-EHN" },
        { en: "I slept terribly", es: "Dormí pésimo", ph: "dohr-MEE PEH-see-moh" },
        { en: "Five more minutes", es: "Cinco minutos más", ph: "SEEN-koh mee-NOO-tohs MAHS" },
        { en: "I'm getting up", es: "Ya me levanto", ph: "yah meh leh-VAHN-toh" },
        { en: "What time is it?", es: "¿Qué hora es?", ph: "keh OH-rah EHS" },
        { en: "It's still early", es: "Todavía es temprano", ph: "toh-dah-VEE-ah ehs tehm-PRAH-noh" },
        { en: "We're going to be late", es: "Vamos a llegar tarde", ph: "VAH-mohs ah yeh-GAHR TAR-deh" },
        { en: "Is the baby still asleep?", es: "¿Sigue dormido el bebé?", ph: "SEE-geh dohr-MEE-doh ehl beh-BEH", note: "About Emiliano." },
        { en: "I need coffee first", es: "Necesito café primero", ph: "neh-seh-SEE-toh kah-FEH pree-MEH-roh" },
        { en: "I'll shower quickly", es: "Me ducho rápido", ph: "meh DOO-choh RAH-pee-doh" },
      ]},

      { id: "breakfast", title: "Breakfast", icon: "🍳", phrases: [
        { en: "What do you want for breakfast?", es: "¿Qué quieres desayunar?", ph: "keh kee-EH-rehs deh-sah-yoo-NAHR" },
        { en: "I'll make eggs", es: "Voy a hacer huevos", ph: "VOY ah ah-SEHR WEH-vohs" },
        { en: "Scrambled or fried?", es: "¿Revueltos o fritos?", ph: "rreh-VWELL-tohs oh FREE-tohs" },
        { en: "Pass me the bread", es: "Pásame el pan", ph: "PAH-sah-meh ehl PAHN" },
        { en: "Do you want toast?", es: "¿Quieres tostadas?", ph: "kee-EH-rehs tohs-TAH-dahs" },
        { en: "The coffee is ready", es: "El café está listo", ph: "ehl kah-FEH ehs-TAH LEES-toh" },
        { en: "With milk and sugar?", es: "¿Con leche y azúcar?", ph: "kohn LEH-cheh ee ah-SOO-kahr" },
        { en: "Just black, please", es: "Solo, por favor", ph: "SOH-loh, pohr fah-VOHR", note: "'Café solo' = black coffee." },
        { en: "We're out of milk", es: "Se acabó la leche", ph: "seh ah-kah-BOH lah LEH-cheh" },
        { en: "I'm not hungry yet", es: "Todavía no tengo hambre", ph: "toh-dah-VEE-ah noh TEHN-goh AHM-breh" },
        { en: "It's delicious, thank you", es: "Está rico, gracias", ph: "ehs-TAH RREE-koh, GRAH-syahs" },
        { en: "I have to leave already", es: "Ya me tengo que ir", ph: "yah meh TEHN-goh keh EER" },
      ]},

      { id: "kids-morning", title: "Kids in the Morning", icon: "👶", phrases: [
        { en: "Good morning, my boy", es: "Buenos días, mi hijo", ph: "BWEH-nohs DEE-ahs, mee EE-hoh", note: "Use for both Joaquín and Emiliano." },
        { en: "Wake up, Joaquín", es: "Despiértate, Joaquín", ph: "dehs-pee-EHR-tah-teh, hwah-KEEN" },
        { en: "Time for school", es: "Es hora de ir al colegio", ph: "ehs OH-rah deh EER ahl koh-LEH-hyoh" },
        { en: "Hi, little one", es: "Hola, chiquito", ph: "OH-lah, chee-KEE-toh", note: "Sweet for Emiliano." },
        { en: "Did you sleep well, baby?", es: "¿Dormiste bien, bebé?", ph: "dohr-MEES-teh bee-EHN, beh-BEH" },
        { en: "Let me change your diaper", es: "Te cambio el pañal", ph: "teh KAHM-byoh ehl pah-NYAHL" },
        { en: "Are you hungry?", es: "¿Tienes hambre?", ph: "tee-EH-nehs AHM-breh" },
        { en: "Put on your shoes", es: "Ponte los zapatos", ph: "POHN-teh lohs sah-PAH-tohs" },
        { en: "Brush your teeth", es: "Lávate los dientes", ph: "LAH-vah-teh lohs dee-EHN-tehs" },
        { en: "Don't forget your backpack", es: "No olvides la mochila", ph: "noh ohl-VEE-dehs lah moh-CHEE-lah" },
        { en: "Give me a kiss", es: "Dame un beso", ph: "DAH-meh oon BEH-soh" },
        { en: "Have a good day at school", es: "Que te vaya bien en el colegio", ph: "keh teh VAH-yah bee-EHN ehn ehl koh-LEH-hyoh" },
      ]},

      { id: "wife", title: "With Stephania", icon: "💕", phrases: [
        { en: "I love you (deep)", es: "Te amo", ph: "teh AH-moh", note: "Strong romantic. For lighter daily use, 'Te quiero.'" },
        { en: "I love you (lighter)", es: "Te quiero", ph: "teh kee-EH-roh" },
        { en: "How was your day?", es: "¿Cómo te fue hoy?", ph: "KOH-moh teh FWEH oy" },
        { en: "What are your plans today?", es: "¿Qué planes tienes hoy?", ph: "keh PLAH-nehs tee-EH-nehs oy" },
        { en: "Do you need anything?", es: "¿Necesitas algo?", ph: "neh-seh-SEE-tahs AHL-goh" },
        { en: "Thanks for everything", es: "Gracias por todo", ph: "GRAH-syahs pohr TOH-doh" },
        { en: "What time will you be home?", es: "¿A qué hora llegas?", ph: "ah keh OH-rah YEH-gahs" },
        { en: "Be careful, please", es: "Cuídate, por favor", ph: "KWEE-dah-teh, pohr fah-VOHR" },
        { en: "I'm sorry, you're right", es: "Perdón, tienes razón", ph: "pehr-DOHN, tee-EH-nehs rrah-SOHN" },
        { en: "Can we talk later?", es: "¿Podemos hablar luego?", ph: "poh-DEH-mohs ah-BLAHR LWEH-goh" },
        { en: "Don't worry about it", es: "No te preocupes", ph: "noh teh preh-oh-KOO-pehs" },
        { en: "Have a good day, love", es: "Que tengas un buen día, amor", ph: "keh TEHN-gahs oon bwehn DEE-ah, ah-MOHR" },
      ]},

      { id: "commute", title: "Bus & Taxi", icon: "🚖", phrases: [
        { en: "Taxi!", es: "¡Taxi!", ph: "TAHK-see" },
        { en: "How much to Miraflores?", es: "¿Cuánto cuesta a Miraflores?", ph: "KWAHN-toh KWEHS-tah ah mee-rah-FLOH-rehs", note: "Always agree the price BEFORE getting in (Lima)." },
        { en: "Can you go via Javier Prado?", es: "¿Puede ir por Javier Prado?", ph: "PWEH-deh EER pohr hah-vee-EHR PRAH-doh" },
        { en: "I'm in a hurry", es: "Tengo prisa", ph: "TEHN-goh PREE-sah" },
        { en: "Stop here, please", es: "Pare aquí, por favor", ph: "PAH-reh ah-KEE, pohr fah-VOHR" },
        { en: "Keep the change", es: "Quédese con el vuelto", ph: "KEH-deh-seh kohn ehl VWELL-toh", note: "'Vuelto' = change in PE/CO." },
        { en: "Can you wait a minute?", es: "¿Me puede esperar un minuto?", ph: "meh PWEH-deh ehs-peh-RAHR oon mee-NOO-toh" },
        { en: "How long does it take?", es: "¿Cuánto demora?", ph: "KWAHN-toh deh-MOH-rah" },
        { en: "There's a lot of traffic", es: "Hay mucho tráfico", ph: "AH-ee MOO-choh TRAH-fee-koh" },
        { en: "Does this bus go to the center?", es: "¿Este bus va al centro?", ph: "EHS-teh BOOS vah ahl SEHN-troh" },
      ]},

      { id: "arriving-work", title: "Arriving at Work", icon: "🏢", phrases: [
        { en: "Good morning everyone", es: "Buenos días a todos", ph: "BWEH-nohs DEE-ahs ah TOH-dohs" },
        { en: "Sorry I'm late", es: "Disculpa la demora", ph: "dees-KOOL-pah lah deh-MOH-rah" },
        { en: "Traffic was terrible", es: "El tráfico estaba horrible", ph: "ehl TRAH-fee-koh ehs-TAH-bah oh-RREE-bleh" },
        { en: "How was your weekend?", es: "¿Cómo te fue el fin de semana?", ph: "KOH-moh teh FWEH ehl FEEN deh seh-MAH-nah" },
        { en: "Did you have a good weekend?", es: "¿Tuviste un buen fin de semana?", ph: "too-VEES-teh oon bwehn FEEN deh seh-MAH-nah" },
        { en: "Let's get to work", es: "Vamos a trabajar", ph: "VAH-mohs ah trah-bah-HAHR" },
        { en: "I have a lot to do today", es: "Tengo mucho que hacer hoy", ph: "TEHN-goh MOO-choh keh ah-SEHR oy" },
        { en: "Did the email arrive?", es: "¿Llegó el correo?", ph: "yeh-GOH ehl koh-RREH-oh" },
      ]},

      { id: "office", title: "Office Chat", icon: "💼", phrases: [
        { en: "Can we talk for a moment?", es: "¿Podemos hablar un momento?", ph: "poh-DEH-mohs ah-BLAHR oon moh-MEHN-toh" },
        { en: "I have a question", es: "Tengo una pregunta", ph: "TEHN-goh OO-nah preh-GOON-tah" },
        { en: "I don't understand", es: "No entiendo", ph: "noh ehn-tee-EHN-doh", note: "Your most useful phrase." },
        { en: "Could you repeat that?", es: "¿Puede repetir, por favor?", ph: "PWEH-deh rreh-peh-TEER, pohr fah-VOHR" },
        { en: "More slowly, please", es: "Más despacio, por favor", ph: "MAHS dehs-PAH-syoh, pohr fah-VOHR" },
        { en: "Sorry, my Spanish is bad", es: "Disculpa, mi español es malo", ph: "dees-KOOL-pah, mee ehs-pah-NYOHL ehs MAH-loh", note: "Honest opener — people respect it." },
        { en: "I'm still learning", es: "Todavía estoy aprendiendo", ph: "toh-dah-VEE-ah ehs-TOY ah-prehn-dee-EHN-doh" },
        { en: "How do you say…?", es: "¿Cómo se dice…?", ph: "KOH-moh seh DEE-seh" },
        { en: "Can you write it down?", es: "¿Puedes escribirlo?", ph: "PWEH-dehs ehs-kree-BEER-loh" },
        { en: "I think so", es: "Creo que sí", ph: "KREH-oh keh SEE" },
        { en: "I don't know yet", es: "Todavía no sé", ph: "toh-dah-VEE-ah noh SEH" },
        { en: "Let me think about it", es: "Déjame pensarlo", ph: "DEH-hah-meh pehn-SAHR-loh" },
        { en: "I'll send you the email", es: "Te mando el correo", ph: "teh MAHN-doh ehl koh-RREH-oh" },
        { en: "Let's talk after lunch", es: "Hablemos después del almuerzo", ph: "ah-BLEH-mohs dehs-PWEHS dehl ahl-MWEHR-soh" },
      ]},

      { id: "lunch", title: "Lunch", icon: "🍽️", phrases: [
        { en: "Should we go for lunch?", es: "¿Vamos a almorzar?", ph: "VAH-mohs ah ahl-mohr-SAHR", note: "'Almuerzo' = lunch in LATAM." },
        { en: "Where do you want to go?", es: "¿A dónde quieres ir?", ph: "ah DOHN-deh kee-EH-rehs EER" },
        { en: "I'm starving", es: "Me muero de hambre", ph: "meh MWEH-roh deh AHM-breh" },
        { en: "What's the menu of the day?", es: "¿Cuál es el menú del día?", ph: "KWAHL ehs ehl meh-NOO dehl DEE-ah" },
        { en: "I'll have the same", es: "Para mí lo mismo", ph: "PAH-rah MEE loh MEES-moh" },
        { en: "Without onion, please", es: "Sin cebolla, por favor", ph: "seen seh-BOH-yah, pohr fah-VOHR" },
        { en: "Is it spicy?", es: "¿Es picante?", ph: "ehs pee-KAHN-teh" },
        { en: "Can I have the check?", es: "¿Me trae la cuenta?", ph: "meh TRAH-eh lah KWEHN-tah" },
        { en: "Together or separate?", es: "¿Junto o separado?", ph: "HOON-toh oh seh-pah-RAH-doh" },
        { en: "I'll pay", es: "Yo invito", ph: "yoh een-VEE-toh", note: "'I invite' — means 'it's on me.'" },
      ]},

      { id: "leaving-work", title: "Leaving Work", icon: "🚪", phrases: [
        { en: "I'm leaving", es: "Ya me voy", ph: "yah meh VOY" },
        { en: "See you tomorrow", es: "Hasta mañana", ph: "AHS-tah mah-NYAH-nah" },
        { en: "Have a good evening", es: "Que tengas buena tarde", ph: "keh TEHN-gahs BWEH-nah TAR-deh" },
        { en: "Drive safe", es: "Maneja con cuidado", ph: "mah-NEH-hah kohn kwee-DAH-doh" },
        { en: "Until Monday", es: "Hasta el lunes", ph: "AHS-tah ehl LOO-nehs" },
        { en: "Have a great weekend", es: "Buen fin de semana", ph: "bwehn FEEN deh seh-MAH-nah" },
      ]},

      { id: "groceries", title: "Groceries on the Way Home", icon: "🛒", phrases: [
        { en: "Where is the bread?", es: "¿Dónde está el pan?", ph: "DOHN-deh ehs-TAH ehl PAHN" },
        { en: "Do you have whole milk?", es: "¿Tiene leche entera?", ph: "tee-EH-neh LEH-cheh ehn-TEH-rah" },
        { en: "I need diapers, size 3", es: "Necesito pañales, talla 3", ph: "neh-seh-SEE-toh pah-NYAH-lehs, TAH-yah TREHS", note: "For Emiliano." },
        { en: "How much is this?", es: "¿Cuánto cuesta esto?", ph: "KWAHN-toh KWEHS-tah EHS-toh" },
        { en: "That's too expensive", es: "Está muy caro", ph: "ehs-TAH MWEE KAH-roh" },
        { en: "Do you have a discount?", es: "¿Tiene descuento?", ph: "tee-EH-neh dehs-KWEHN-toh" },
        { en: "A kilo of chicken, please", es: "Un kilo de pollo, por favor", ph: "oon KEE-loh deh POH-yoh, pohr fah-VOHR" },
        { en: "Is it fresh?", es: "¿Está fresco?", ph: "ehs-TAH FREHS-koh" },
        { en: "I'll take it", es: "Me lo llevo", ph: "meh loh YEH-voh" },
        { en: "Do you accept cards?", es: "¿Aceptan tarjeta?", ph: "ah-SEHP-tahn tahr-HEH-tah" },
        { en: "Yape, please", es: "Por Yape, por favor", ph: "pohr YAH-peh, pohr fah-VOHR", note: "Yape = Peru's mobile payment app." },
        { en: "A bag, please", es: "Una bolsa, por favor", ph: "OO-nah BOHL-sah, pohr fah-VOHR" },
      ]},

      { id: "arriving-home", title: "Arriving Home", icon: "🏠", phrases: [
        { en: "I'm home!", es: "¡Ya llegué!", ph: "yah yeh-GEH" },
        { en: "How is everyone?", es: "¿Cómo están todos?", ph: "KOH-moh ehs-TAHN TOH-dohs" },
        { en: "Where's the baby?", es: "¿Dónde está el bebé?", ph: "DOHN-deh ehs-TAH ehl beh-BEH" },
        { en: "I brought groceries", es: "Traje las compras", ph: "TRAH-heh lahs KOHM-prahs" },
        { en: "Help me with this", es: "Ayúdame con esto", ph: "ah-YOO-dah-meh kohn EHS-toh" },
        { en: "I'm exhausted", es: "Estoy agotado", ph: "ehs-TOY ah-goh-TAH-doh" },
        { en: "It was a long day", es: "Fue un día largo", ph: "FWEH oon DEE-ah LAHR-goh" },
        { en: "What's for dinner?", es: "¿Qué hay de cena?", ph: "keh AH-ee deh SEH-nah" },
      ]},

      { id: "feeding-kids", title: "Feeding the Kids", icon: "🥄", phrases: [
        { en: "Open your mouth, baby", es: "Abre la boquita, bebé", ph: "AH-breh lah boh-KEE-tah, beh-BEH", note: "'Boquita' (little mouth) is sweet for Emiliano." },
        { en: "One more bite", es: "Una más", ph: "OO-nah MAHS" },
        { en: "It's good, taste it", es: "Está rico, prueba", ph: "ehs-TAH RREE-koh, PRWEH-bah" },
        { en: "Don't throw food", es: "No tires la comida", ph: "noh TEE-rehs lah koh-MEE-dah" },
        { en: "Are you done?", es: "¿Terminaste?", ph: "tehr-mee-NAHS-teh" },
        { en: "Drink some water", es: "Toma agua", ph: "TOH-mah AH-gwah" },
        { en: "Joaquín, come eat", es: "Joaquín, ven a comer", ph: "hwah-KEEN, vehn ah koh-MEHR" },
        { en: "Wash your hands first", es: "Lávate las manos primero", ph: "LAH-vah-teh lahs MAH-nohs pree-MEH-roh" },
        { en: "Sit at the table", es: "Siéntate en la mesa", ph: "see-EHN-tah-teh ehn lah MEH-sah" },
        { en: "Eat your vegetables", es: "Come tus verduras", ph: "KOH-meh toos vehr-DOO-rahs" },
        { en: "No phones at the table", es: "No celulares en la mesa", ph: "noh seh-loo-LAH-rehs ehn lah MEH-sah", note: "For Joaquín." },
        { en: "Can I have more, please?", es: "¿Me das más, por favor?", ph: "meh DAHS MAHS, pohr fah-VOHR" },
      ]},

      { id: "dinner", title: "Making & Eating Dinner", icon: "🍝", phrases: [
        { en: "What should we make?", es: "¿Qué hacemos de cena?", ph: "keh ah-SEH-mohs deh SEH-nah" },
        { en: "Something quick", es: "Algo rápido", ph: "AHL-goh RRAH-pee-doh" },
        { en: "I'll cook tonight", es: "Yo cocino esta noche", ph: "yoh koh-SEE-noh EHS-tah NOH-cheh" },
        { en: "Can you chop the onion?", es: "¿Puedes picar la cebolla?", ph: "PWEH-dehs pee-KAHR lah seh-BOH-yah" },
        { en: "Where's the salt?", es: "¿Dónde está la sal?", ph: "DOHN-deh ehs-TAH lah SAHL" },
        { en: "It needs more salt", es: "Le falta sal", ph: "leh FAHL-tah SAHL" },
        { en: "It's ready", es: "Ya está listo", ph: "yah ehs-TAH LEES-toh" },
        { en: "Set the table", es: "Pon la mesa", ph: "POHN lah MEH-sah" },
        { en: "Enjoy your meal", es: "Buen provecho", ph: "bwehn proh-VEH-choh", note: "Said before eating — the LATAM 'bon appétit.'" },
        { en: "This came out delicious", es: "Te quedó riquísimo", ph: "teh keh-DOH rree-KEE-see-moh" },
        { en: "I'm full", es: "Estoy lleno", ph: "ehs-TOY YEH-noh", note: "Women say 'llena.'" },
        { en: "Save me some for tomorrow", es: "Guárdame para mañana", ph: "GWAR-dah-meh PAH-rah mah-NYAH-nah" },
      ]},

      { id: "family-time", title: "Family Time", icon: "🛋️", phrases: [
        { en: "What do you want to watch?", es: "¿Qué quieres ver?", ph: "keh kee-EH-rehs VEHR" },
        { en: "Should we watch a movie?", es: "¿Vemos una película?", ph: "VEH-mohs OO-nah peh-LEE-koo-lah" },
        { en: "Come sit with us", es: "Ven a sentarte con nosotros", ph: "vehn ah sehn-TAR-teh kohn noh-SOH-trohs" },
        { en: "Pass me the remote", es: "Pásame el control", ph: "PAH-sah-meh ehl kohn-TROHL" },
        { en: "He's so cute", es: "Está tan lindo", ph: "ehs-TAH TAHN LEEN-doh", note: "About Emiliano." },
        { en: "Look how he laughs", es: "Mira cómo se ríe", ph: "MEE-rah KOH-moh seh RREE-eh" },
        { en: "Joaquín, tell me about your day", es: "Joaquín, cuéntame de tu día", ph: "hwah-KEEN, KWEHN-tah-meh deh too DEE-ah" },
        { en: "How was school?", es: "¿Cómo te fue en el colegio?", ph: "KOH-moh teh FWEH ehn ehl koh-LEH-hyoh" },
        { en: "Do you have homework?", es: "¿Tienes tarea?", ph: "tee-EH-nehs tah-REH-ah" },
        { en: "I love spending time with you", es: "Me encanta estar contigo", ph: "meh ehn-KAHN-tah ehs-TAHR kohn-TEE-goh" },
      ]},

      { id: "kids-bed", title: "Putting Kids to Bed", icon: "🌙", phrases: [
        { en: "Time for bed", es: "Es hora de dormir", ph: "ehs OH-rah deh dohr-MEER" },
        { en: "Put on your pajamas", es: "Ponte la pijama", ph: "POHN-teh lah pee-HAH-mah" },
        { en: "Did you brush your teeth?", es: "¿Te lavaste los dientes?", ph: "teh lah-VAHS-teh lohs dee-EHN-tehs" },
        { en: "Go to the bathroom first", es: "Primero al baño", ph: "pree-MEH-roh ahl BAH-nyoh" },
        { en: "Want a story?", es: "¿Quieres un cuento?", ph: "kee-EH-rehs oon KWEHN-toh" },
        { en: "One more story, then sleep", es: "Un cuento más y a dormir", ph: "oon KWEHN-toh MAHS ee ah dohr-MEER" },
        { en: "Close your eyes", es: "Cierra los ojos", ph: "see-EH-rrah lohs OH-hohs" },
        { en: "Sweet dreams", es: "Que sueñes con los angelitos", ph: "keh SWEH-nyehs kohn lohs ahn-heh-LEE-tohs", note: "Literally 'may you dream with little angels.' Classic LATAM bedtime." },
        { en: "I love you, sleep well", es: "Te amo, descansa", ph: "teh AH-moh, dehs-KAHN-sah" },
        { en: "I'm right here", es: "Aquí estoy", ph: "ah-KEE ehs-TOY" },
        { en: "Don't be afraid", es: "No tengas miedo", ph: "noh TEHN-gahs mee-EH-doh" },
        { en: "Sleep tight, baby", es: "Duerme bien, bebé", ph: "DWEHR-meh bee-EHN, beh-BEH" },
      ]},

      { id: "ready-bed", title: "Getting Ready for Bed", icon: "🛁", phrases: [
        { en: "I'm going to shower", es: "Me voy a duchar", ph: "meh VOY ah doo-CHAHR" },
        { en: "I'm exhausted", es: "Estoy muerto", ph: "ehs-TOY MWEHR-toh", note: "Literally 'I'm dead' — common slang for exhausted." },
        { en: "Let's go to bed", es: "Vamos a la cama", ph: "VAH-mohs ah lah KAH-mah" },
        { en: "Did you set the alarm?", es: "¿Pusiste la alarma?", ph: "poo-SEES-teh lah ah-LAHR-mah" },
        { en: "What time tomorrow?", es: "¿A qué hora mañana?", ph: "ah keh OH-rah mah-NYAH-nah" },
        { en: "Turn off the light", es: "Apaga la luz", ph: "ah-PAH-gah lah LOOS" },
        { en: "Lock the door", es: "Cierra la puerta con llave", ph: "see-EH-rrah lah PWEHR-tah kohn YAH-veh" },
        { en: "I'm getting in bed", es: "Ya me acuesto", ph: "yah meh ah-KWEHS-toh" },
      ]},

      { id: "bedroom", title: "Bedroom Talk", icon: "💛", phrases: [
        { en: "Come here, love", es: "Ven acá, amor", ph: "vehn ah-KAH, ah-MOHR" },
        { en: "You're so beautiful", es: "Estás tan hermosa", ph: "ehs-TAHS TAHN ehr-MOH-sah" },
        { en: "I missed you today", es: "Te extrañé hoy", ph: "teh ehks-trah-NYEH oy" },
        { en: "Hold me", es: "Abrázame", ph: "ah-BRAH-sah-meh" },
        { en: "I'm so happy with you", es: "Soy tan feliz contigo", ph: "soy TAHN feh-LEES kohn-TEE-goh" },
        { en: "Thank you for everything you do", es: "Gracias por todo lo que haces", ph: "GRAH-syahs pohr TOH-doh loh keh AH-sehs" },
        { en: "Goodnight, my love", es: "Buenas noches, mi amor", ph: "BWEH-nahs NOH-chehs, mee ah-MOHR" },
        { en: "I love you so much", es: "Te amo muchísimo", ph: "teh AH-moh moo-CHEE-see-moh" },
        { en: "Sleep well, beautiful", es: "Que descanses, hermosa", ph: "keh dehs-KAHN-sehs, ehr-MOH-sah" },
        { en: "See you in the morning", es: "Nos vemos en la mañana", ph: "nohs VEH-mohs ehn lah mah-NYAH-nah" },
      ]},

    ]
  },

  /* ════════════════════════════════════════════════════
     PERSONAL — survival, feelings, health, money, asking
     ════════════════════════════════════════════════════ */
  personal: {
    title: "Personal",
    icon: "💛",
    sections: [

      { id: "survival", title: "Survival Phrases", icon: "🆘", phrases: [
        { en: "I don't understand", es: "No entiendo", ph: "noh ehn-tee-EHN-doh", note: "Use this often. People will slow down." },
        { en: "Speak more slowly, please", es: "Más despacio, por favor", ph: "MAHS dehs-PAH-syoh, pohr fah-VOHR" },
        { en: "Can you repeat that?", es: "¿Puede repetir?", ph: "PWEH-deh rreh-peh-TEER" },
        { en: "I'm learning Spanish", es: "Estoy aprendiendo español", ph: "ehs-TOY ah-prehn-dee-EHN-doh ehs-pah-NYOHL" },
        { en: "Do you speak English?", es: "¿Habla inglés?", ph: "AH-blah een-GLEHS" },
        { en: "I'm sorry, I don't know", es: "Lo siento, no sé", ph: "loh see-EHN-toh, noh SEH" },
        { en: "Help, please", es: "Ayuda, por favor", ph: "ah-YOO-dah, pohr fah-VOHR" },
        { en: "Where is the bathroom?", es: "¿Dónde está el baño?", ph: "DOHN-deh ehs-TAH ehl BAH-nyoh" },
        { en: "How do you say…?", es: "¿Cómo se dice…?", ph: "KOH-moh seh DEE-seh" },
        { en: "What does this mean?", es: "¿Qué significa esto?", ph: "keh seeg-nee-FEE-kah EHS-toh" },
        { en: "Sorry to bother you", es: "Disculpe la molestia", ph: "dees-KOOL-peh lah moh-LEHS-tee-ah" },
        { en: "Could you help me?", es: "¿Me podría ayudar?", ph: "meh poh-DREE-ah ah-yoo-DAHR" },
      ]},

      { id: "feelings", title: "Feelings & Moods", icon: "😊", phrases: [
        { en: "I'm happy", es: "Estoy feliz", ph: "ehs-TOY feh-LEES" },
        { en: "I'm tired", es: "Estoy cansado", ph: "ehs-TOY kahn-SAH-doh" },
        { en: "I'm stressed", es: "Estoy estresado", ph: "ehs-TOY ehs-treh-SAH-doh" },
        { en: "I'm worried", es: "Estoy preocupado", ph: "ehs-TOY preh-oh-koo-PAH-doh" },
        { en: "I'm excited about this", es: "Estoy emocionado con esto", ph: "ehs-TOY eh-moh-syoh-NAH-doh kohn EHS-toh" },
        { en: "I'm frustrated", es: "Estoy frustrado", ph: "ehs-TOY froos-TRAH-doh" },
        { en: "I feel good today", es: "Me siento bien hoy", ph: "meh see-EHN-toh bee-EHN oy" },
        { en: "I don't feel well", es: "No me siento bien", ph: "noh meh see-EHN-toh bee-EHN" },
        { en: "I need a break", es: "Necesito un descanso", ph: "neh-seh-SEE-toh oon dehs-KAHN-soh" },
        { en: "I'm proud of you", es: "Estoy orgulloso de ti", ph: "ehs-TOY ohr-goo-YOH-soh deh TEE" },
        { en: "Don't worry", es: "No te preocupes", ph: "noh teh preh-oh-KOO-pehs" },
        { en: "Everything will be okay", es: "Todo va a estar bien", ph: "TOH-doh vah ah ehs-TAHR bee-EHN" },
      ]},

      { id: "health", title: "Health & Body", icon: "🏥", phrases: [
        { en: "I don't feel well", es: "No me siento bien", ph: "noh meh see-EHN-toh bee-EHN" },
        { en: "I have a headache", es: "Me duele la cabeza", ph: "meh DWEH-leh lah kah-BEH-sah" },
        { en: "My stomach hurts", es: "Me duele el estómago", ph: "meh DWEH-leh ehl ehs-TOH-mah-goh" },
        { en: "I have a fever", es: "Tengo fiebre", ph: "TEHN-goh fee-EH-breh" },
        { en: "I need a doctor", es: "Necesito un doctor", ph: "neh-seh-SEE-toh oon dohk-TOHR" },
        { en: "Where is the pharmacy?", es: "¿Dónde hay una farmacia?", ph: "DOHN-deh AH-ee OO-nah fahr-MAH-syah" },
        { en: "I'm allergic to…", es: "Soy alérgico a…", ph: "soy ah-LEHR-hee-koh ah" },
        { en: "It's an emergency", es: "Es una emergencia", ph: "ehs OO-nah eh-mehr-HEHN-syah" },
        { en: "Can you call an ambulance?", es: "¿Puede llamar una ambulancia?", ph: "PWEH-deh yah-MAHR OO-nah ahm-boo-LAHN-syah" },
        { en: "I'm okay, thank you", es: "Estoy bien, gracias", ph: "ehs-TOY bee-EHN, GRAH-syahs" },
        { en: "I take this medication", es: "Tomo esta medicina", ph: "TOH-moh EHS-tah meh-dee-SEE-nah" },
        { en: "The baby has a fever", es: "El bebé tiene fiebre", ph: "ehl beh-BEH tee-EH-neh fee-EH-breh" },
      ]},

      { id: "numbers-time", title: "Numbers & Time", icon: "🕐", phrases: [
        { en: "One, two, three", es: "Uno, dos, tres", ph: "OO-noh, DOHS, TREHS" },
        { en: "Four, five, six", es: "Cuatro, cinco, seis", ph: "KWAH-troh, SEEN-koh, SEH-ees" },
        { en: "Seven, eight, nine, ten", es: "Siete, ocho, nueve, diez", ph: "see-EH-teh, OH-choh, NWEH-veh, dee-EHS" },
        { en: "Twenty, thirty, forty, fifty", es: "Veinte, treinta, cuarenta, cincuenta", ph: "VEY-een-teh, TREYN-tah, kwah-REHN-tah, seen-KWEHN-tah" },
        { en: "One hundred", es: "Cien", ph: "see-EHN" },
        { en: "One thousand", es: "Mil", ph: "MEEL" },
        { en: "What time is it?", es: "¿Qué hora es?", ph: "keh OH-rah EHS" },
        { en: "It's three o'clock", es: "Son las tres", ph: "SOHN lahs TREHS" },
        { en: "Half past four", es: "Cuatro y media", ph: "KWAH-troh ee MEH-dyah" },
        { en: "Today, tomorrow, yesterday", es: "Hoy, mañana, ayer", ph: "OY, mah-NYAH-nah, ah-YEHR" },
        { en: "Monday, Tuesday, Wednesday", es: "Lunes, martes, miércoles", ph: "LOO-nehs, MAR-tehs, mee-EHR-koh-lehs" },
        { en: "Thursday, Friday, Saturday, Sunday", es: "Jueves, viernes, sábado, domingo", ph: "HWEH-vehs, vee-EHR-nehs, SAH-bah-doh, doh-MEEN-goh" },
      ]},

      { id: "money", title: "Money & Paying", icon: "💵", phrases: [
        { en: "How much is it?", es: "¿Cuánto cuesta?", ph: "KWAHN-toh KWEHS-tah" },
        { en: "How much in total?", es: "¿Cuánto es en total?", ph: "KWAHN-toh EHS ehn toh-TAHL" },
        { en: "It's too expensive", es: "Es muy caro", ph: "EHS MWEE KAH-roh" },
        { en: "Do you have something cheaper?", es: "¿Tiene algo más barato?", ph: "tee-EH-neh AHL-goh MAHS bah-RAH-toh" },
        { en: "Cash or card?", es: "¿Efectivo o tarjeta?", ph: "eh-fehk-TEE-voh oh tahr-HEH-tah" },
        { en: "By Yape", es: "Por Yape", ph: "pohr YAH-peh", note: "Peru's mobile money — say this and they'll show their QR." },
        { en: "I don't have change", es: "No tengo cambio", ph: "noh TEHN-goh KAHM-byoh" },
        { en: "Can you break a hundred?", es: "¿Tiene cambio de cien?", ph: "tee-EH-neh KAHM-byoh deh see-EHN" },
        { en: "Can I have a receipt?", es: "¿Me da un recibo?", ph: "meh DAH oon rreh-SEE-boh" },
        { en: "I'd like the bill", es: "Me trae la cuenta", ph: "meh TRAH-eh lah KWEHN-tah" },
      ]},

      { id: "asking", title: "Asking Questions", icon: "❓", phrases: [
        { en: "Where is it?", es: "¿Dónde está?", ph: "DOHN-deh ehs-TAH" },
        { en: "When?", es: "¿Cuándo?", ph: "KWAHN-doh" },
        { en: "Why?", es: "¿Por qué?", ph: "pohr KEH" },
        { en: "Because…", es: "Porque…", ph: "POHR-keh", note: "Same sound, different stress — '¿Por qué?' question, 'Porque' answer." },
        { en: "How?", es: "¿Cómo?", ph: "KOH-moh" },
        { en: "Who is it?", es: "¿Quién es?", ph: "kee-EHN EHS" },
        { en: "What is it?", es: "¿Qué es?", ph: "keh EHS" },
        { en: "Which one?", es: "¿Cuál?", ph: "KWAHL" },
        { en: "Is it far?", es: "¿Está lejos?", ph: "ehs-TAH LEH-hohs" },
        { en: "Is it open?", es: "¿Está abierto?", ph: "ehs-TAH ah-bee-EHR-toh" },
        { en: "Can I…?", es: "¿Puedo…?", ph: "PWEH-doh" },
        { en: "What's your name?", es: "¿Cómo te llamas?", ph: "KOH-moh teh YAH-mahs", note: "Informal (tú). Formal: '¿Cómo se llama?'" },
      ]},

    ]
  },

  /* ════════════════════════════════════════════════════
     WORK — Stu's actual context
     Datacendia · Sereno · Punta Lúcida · Rainey Laguna Studios
     ════════════════════════════════════════════════════ */
  work: {
    title: "Work",
    icon: "💼",
    sections: [

      { id: "greetings", title: "Work Greetings", icon: "🤝", phrases: [
        { en: "Pleased to meet you", es: "Mucho gusto", ph: "MOO-choh GOOS-toh" },
        { en: "The pleasure is mine", es: "El gusto es mío", ph: "ehl GOOS-toh ehs MEE-oh" },
        { en: "I'm Stu, nice to meet you", es: "Soy Stu, mucho gusto", ph: "soy STOO, MOO-choh GOOS-toh", note: "Stephania's husband — introduce yourself by the name people actually call you." },
        { en: "I run Rainey Laguna Studios", es: "Dirijo Rainey Laguna Studios", ph: "dee-REE-hoh RAY-nee lah-GOO-nah ehs-TOO-dyohs" },
        { en: "How can I help you?", es: "¿En qué le puedo ayudar?", ph: "ehn keh leh PWEH-doh ah-yoo-DAHR", note: "Formal (usted)." },
        { en: "Thanks for your time", es: "Gracias por tu tiempo", ph: "GRAH-syahs pohr too tee-EHM-poh" },
        { en: "Let's keep in touch", es: "Mantengámonos en contacto", ph: "mahn-tehn-GAH-moh-nohs ehn kohn-TAHK-toh" },
        { en: "Have a great day", es: "Que tenga un excelente día", ph: "keh TEHN-gah oon ehk-seh-LEHN-teh DEE-ah" },
      ]},

      { id: "meetings", title: "Meetings", icon: "📊", phrases: [
        { en: "Shall we start?", es: "¿Empezamos?", ph: "ehm-peh-SAH-mohs" },
        { en: "Let me share my screen", es: "Déjame compartir mi pantalla", ph: "DEH-hah-meh kohm-pahr-TEER mee pahn-TAH-yah" },
        { en: "Can you see my screen?", es: "¿Ven mi pantalla?", ph: "VEHN mee pahn-TAH-yah" },
        { en: "I'd like to show you something", es: "Quiero mostrarles algo", ph: "kee-EH-roh mohs-TRAR-lehs AHL-goh" },
        { en: "What do you think?", es: "¿Qué les parece?", ph: "keh lehs pah-REH-seh" },
        { en: "I agree", es: "Estoy de acuerdo", ph: "ehs-TOY deh ah-KWEHR-doh" },
        { en: "I disagree", es: "No estoy de acuerdo", ph: "noh ehs-TOY deh ah-KWEHR-doh" },
        { en: "Let me think about it", es: "Déjame pensarlo", ph: "DEH-hah-meh pehn-SAHR-loh" },
        { en: "Can we talk next week?", es: "¿Podemos hablar la próxima semana?", ph: "poh-DEH-mohs ah-BLAHR lah PROHK-see-mah seh-MAH-nah" },
        { en: "I'll send you a follow-up", es: "Les mando un seguimiento", ph: "lehs MAHN-doh oon seh-gee-mee-EHN-toh" },
        { en: "Any questions?", es: "¿Alguna pregunta?", ph: "ahl-GOO-nah preh-GOON-tah" },
        { en: "Thanks for your time today", es: "Gracias por su tiempo hoy", ph: "GRAH-syahs pohr soo tee-EHM-poh oy" },
      ]},

      { id: "tech", title: "Tech & Dev", icon: "💻", phrases: [
        { en: "The code is on GitHub", es: "El código está en GitHub", ph: "ehl KOH-dee-goh ehs-TAH ehn geet-HOB" },
        { en: "I'm working on the backend", es: "Estoy trabajando en el backend", ph: "ehs-TOY trah-bah-HAHN-doh ehn ehl BAHK-ehnd" },
        { en: "It's deployed on Railway", es: "Está desplegado en Railway", ph: "ehs-TAH dehs-pleh-GAH-doh ehn RAY-lway" },
        { en: "There's a bug", es: "Hay un error", ph: "AH-ee oon eh-RROHR" },
        { en: "Let me check the logs", es: "Déjame revisar los registros", ph: "DEH-hah-meh rreh-vee-SAHR lohs rreh-HEES-trohs" },
        { en: "The database is down", es: "La base de datos está caída", ph: "lah BAH-seh deh DAH-tohs ehs-TAH kah-EE-dah" },
        { en: "Did you receive the email?", es: "¿Recibiste el correo?", ph: "rreh-see-BEES-teh ehl koh-RREH-oh" },
        { en: "I'll send you the link", es: "Te mando el enlace", ph: "teh MAHN-doh ehl ehn-LAH-seh" },
        { en: "It needs more testing", es: "Necesita más pruebas", ph: "neh-seh-SEE-tah MAHS PRWEH-bahs" },
        { en: "Ready for production", es: "Listo para producción", ph: "LEES-toh PAH-rah proh-dook-SYOHN" },
        { en: "Let's do a quick call", es: "Hagamos una llamada rápida", ph: "ah-GAH-mohs OO-nah yah-MAH-dah RRAH-pee-dah" },
        { en: "I'll share my screen", es: "Comparto pantalla", ph: "kohm-PAHR-toh pahn-TAH-yah" },
      ]},

      { id: "clients", title: "With Clients", icon: "👔", phrases: [
        { en: "Thanks for trusting us", es: "Gracias por confiar en nosotros", ph: "GRAH-syahs pohr kohn-fee-AHR ehn noh-SOH-trohs" },
        { en: "How can we help?", es: "¿En qué los podemos ayudar?", ph: "ehn keh lohs poh-DEH-mohs ah-yoo-DAHR" },
        { en: "What is your main concern?", es: "¿Cuál es su principal preocupación?", ph: "KWAHL ehs soo preen-see-PAHL preh-oh-koo-pah-SYOHN" },
        { en: "I understand perfectly", es: "Entiendo perfectamente", ph: "ehn-tee-EHN-doh pehr-fehk-tah-MEHN-teh" },
        { en: "Give me a moment, please", es: "Un momento, por favor", ph: "oon moh-MEHN-toh, pohr fah-VOHR" },
        { en: "I'll send a proposal", es: "Les envío una propuesta", ph: "lehs ehn-VEE-oh OO-nah proh-PWEHS-tah" },
        { en: "When do you need it?", es: "¿Para cuándo lo necesitan?", ph: "PAH-rah KWAHN-doh loh neh-seh-SEE-tahn" },
        { en: "We can deliver in two weeks", es: "Lo entregamos en dos semanas", ph: "loh ehn-treh-GAH-mohs ehn DOHS seh-MAH-nahs" },
        { en: "Let's set up a meeting", es: "Agendemos una reunión", ph: "ah-hehn-DEH-mohs OO-nah rreh-oo-NYOHN" },
        { en: "I'll follow up with you", es: "Les hago seguimiento", ph: "lehs AH-goh seh-gee-mee-EHN-toh" },
      ]},

      { id: "studio", title: "Talking About the Studio", icon: "🏛️", phrases: [
        { en: "I run a creative studio", es: "Dirijo un estudio creativo", ph: "dee-REE-hoh oon ehs-TOO-dyoh kreh-ah-TEE-voh" },
        { en: "We are Rainey Laguna Studios", es: "Somos Rainey Laguna Studios", ph: "SOH-mohs RAY-nee lah-GOO-nah ehs-TOO-dyohs" },
        { en: "We build software for regulated industries", es: "Hacemos software para industrias reguladas", ph: "ah-SEH-mohs SOFT-wahr PAH-rah een-DOOS-tryahs rreh-goo-LAH-dahs" },
        { en: "Datacendia is our flagship platform", es: "Datacendia es nuestra plataforma principal", ph: "dah-tah-SEHN-dyah ehs NWEHS-trah plah-tah-FOHR-mah preen-see-PAHL" },
        { en: "It's a sovereign AI governance platform", es: "Es una plataforma de gobernanza de IA soberana", ph: "ehs OO-nah plah-tah-FOHR-mah deh goh-behr-NAHN-sah deh EE-ah soh-beh-RAH-nah", note: "IA = AI (pronounced 'EE-ah')." },
        { en: "Sereno is our competitive intelligence product", es: "Sereno es nuestro producto de inteligencia competitiva", ph: "seh-REH-noh ehs NWEHS-troh proh-DOOK-toh deh een-teh-lee-HEHN-syah kohm-peh-tee-TEE-vah" },
        { en: "Punta Lúcida is a literary venture", es: "Punta Lúcida es un proyecto literario", ph: "POON-tah LOO-see-dah ehs oon proh-YEHK-toh lee-teh-RAH-ryoh" },
        { en: "It's published in Spanish", es: "Se publica en español", ph: "seh poo-BLEE-kah ehn ehs-pah-NYOHL" },
        { en: "We work with clients across LATAM", es: "Trabajamos con clientes en toda Latinoamérica", ph: "trah-bah-HAH-mohs kohn klee-EHN-tehs ehn TOH-dah lah-tee-noh-ah-MEH-ree-kah" },
        { en: "I founded the studio in 2025", es: "Fundé el estudio en 2025", ph: "foon-DEH ehl ehs-TOO-dyoh ehn DOHS meel veyn-tee-SEEN-koh" },
        { en: "We're based in Lima", es: "Estamos en Lima", ph: "ehs-TAH-mohs ehn LEE-mah" },
        { en: "Visit our website", es: "Visita nuestro sitio web", ph: "vee-SEE-tah NWEHS-troh SEE-tyoh WEHB" },
      ]},

      { id: "negotiation", title: "Pricing & Contracts", icon: "📝", phrases: [
        { en: "Our price is…", es: "Nuestro precio es…", ph: "NWEHS-troh PREH-syoh ehs" },
        { en: "It includes…", es: "Incluye…", ph: "een-KLOO-yeh" },
        { en: "Do you have a budget?", es: "¿Tienen un presupuesto?", ph: "tee-EH-nehn oon preh-soo-PWEHS-toh" },
        { en: "We can adjust the scope", es: "Podemos ajustar el alcance", ph: "poh-DEH-mohs ah-hoos-TAHR ehl ahl-KAHN-seh" },
        { en: "Payment in two installments", es: "Pago en dos cuotas", ph: "PAH-goh ehn DOHS KWOH-tahs" },
        { en: "Fifty percent up front", es: "Cincuenta por ciento por adelantado", ph: "seen-KWEHN-tah pohr see-EHN-toh pohr ah-deh-lahn-TAH-doh" },
        { en: "We can sign a contract this week", es: "Podemos firmar contrato esta semana", ph: "poh-DEH-mohs feer-MAHR kohn-TRAH-toh EHS-tah seh-MAH-nah" },
        { en: "I'll send the invoice today", es: "Te envío la factura hoy", ph: "teh ehn-VEE-oh lah fahk-TOO-rah oy" },
      ]},

    ]
  },

  /* ════════════════════════════════════════════════════
     EXTRA — deeper scenarios
     ════════════════════════════════════════════════════ */
  extra: {
    title: "More Scenarios",
    icon: "🌎",
    sections: [

      { id: "portero", title: "Portero & Building", icon: "🛎️", phrases: [
        { en: "Good morning, sir", es: "Buenos días, señor", ph: "BWEH-nohs DEE-ahs, seh-NYOHR", note: "To the building portero — being polite earns favors." },
        { en: "Did anything arrive for me?", es: "¿Llegó algo para mí?", ph: "yeh-GOH AHL-goh PAH-rah MEE" },
        { en: "I'm expecting a package", es: "Estoy esperando un paquete", ph: "ehs-TOY ehs-peh-RAHN-doh oon pah-KEH-teh" },
        { en: "Please call me when it arrives", es: "Por favor, llámeme cuando llegue", ph: "pohr fah-VOHR, YAH-meh-meh KWAHN-doh YEH-geh" },
        { en: "I'm in apartment 503", es: "Estoy en el departamento 503", ph: "ehs-TOY ehn ehl deh-pahr-tah-MEHN-toh KEEN-yeh-toh-soh-toh-TREHS", note: "'Departamento' = apt in PE/CO/AR. 'Apartamento' elsewhere." },
        { en: "The water is out", es: "Se cortó el agua", ph: "seh kohr-TOH ehl AH-gwah" },
        { en: "There's no power", es: "No hay luz", ph: "noh AH-ee LOOS" },
        { en: "Could you let them up?", es: "¿Le puede dar pase?", ph: "leh PWEH-deh DAHR PAH-seh" },
        { en: "Thank you for your help", es: "Gracias por su ayuda", ph: "GRAH-syahs pohr soo ah-YOO-dah" },
        { en: "Have a good shift", es: "Buen turno", ph: "bwehn TOOR-noh" },
      ]},

      { id: "parent-teacher", title: "Parent-Teacher", icon: "🎓", phrases: [
        { en: "I'm Joaquín's father", es: "Soy el papá de Joaquín", ph: "soy ehl pah-PAH deh hwah-KEEN" },
        { en: "How is he doing in class?", es: "¿Cómo va en clase?", ph: "KOH-moh vah ehn KLAH-seh" },
        { en: "Is he behaving well?", es: "¿Se está portando bien?", ph: "seh ehs-TAH pohr-TAHN-doh bee-EHN" },
        { en: "What can we do at home to help?", es: "¿Qué podemos hacer en casa para ayudar?", ph: "keh poh-DEH-mohs ah-SEHR ehn KAH-sah PAH-rah ah-yoo-DAHR" },
        { en: "He's struggling with math", es: "Le cuesta matemáticas", ph: "leh KWEHS-tah mah-teh-MAH-tee-kahs" },
        { en: "Can we set up a tutor?", es: "¿Podemos buscar un tutor?", ph: "poh-DEH-mohs boos-KAHR oon too-TOHR" },
        { en: "When are the parent meetings?", es: "¿Cuándo son las reuniones de padres?", ph: "KWAHN-doh SOHN lahs rreh-oo-NYOH-nehs deh PAH-drehs" },
        { en: "Thanks for letting me know", es: "Gracias por avisarme", ph: "GRAH-syahs pohr ah-vee-SAHR-meh" },
        { en: "We'll talk to him at home", es: "Hablaremos con él en casa", ph: "ah-blah-REH-mohs kohn EHL ehn KAH-sah" },
        { en: "I appreciate your patience", es: "Aprecio su paciencia", ph: "ah-PREH-syoh soo pah-see-EHN-syah" },
      ]},

      { id: "in-laws", title: "In-Laws & Family", icon: "👵", phrases: [
        { en: "Hello, mother-in-law", es: "Hola, suegra", ph: "OH-lah, SWEH-grah" },
        { en: "How are you, sir?", es: "¿Cómo está, señor?", ph: "KOH-moh ehs-TAH, seh-NYOHR", note: "Formal — to your father-in-law." },
        { en: "Thanks for having us", es: "Gracias por recibirnos", ph: "GRAH-syahs pohr rreh-see-BEER-nohs" },
        { en: "The food was delicious", es: "La comida estuvo riquísima", ph: "lah koh-MEE-dah ehs-TOO-voh rree-KEE-see-mah" },
        { en: "Stephania sends regards", es: "Stephania les manda saludos", ph: "stehf-AH-nyah lehs MAHN-dah sah-LOO-dohs" },
        { en: "We came to visit", es: "Vinimos a visitarles", ph: "vee-NEE-mohs ah vee-see-TAR-lehs" },
        { en: "The kids miss you", es: "Los niños los extrañan", ph: "lohs NEE-nyohs lohs ehks-TRAH-nyahn" },
        { en: "Should we eat?", es: "¿Comemos ya?", ph: "koh-MEH-mohs YAH" },
        { en: "Let me help you", es: "Déjeme ayudarle", ph: "DEH-heh-meh ah-yoo-DAHR-leh", note: "Formal — for in-laws/elders." },
        { en: "Take care, see you Sunday", es: "Cuídense, nos vemos el domingo", ph: "KWEE-dehn-seh, nohs VEH-mohs ehl doh-MEEN-goh" },
      ]},

      { id: "weekend", title: "Weekend Plans", icon: "🎉", phrases: [
        { en: "What are we doing this weekend?", es: "¿Qué hacemos el fin de semana?", ph: "keh ah-SEH-mohs ehl FEEN deh seh-MAH-nah" },
        { en: "Should we go to the beach?", es: "¿Vamos a la playa?", ph: "VAH-mohs ah lah PLAH-yah" },
        { en: "Let's stay home and rest", es: "Quedémonos en casa a descansar", ph: "keh-DEH-moh-nohs ehn KAH-sah ah dehs-kahn-SAHR" },
        { en: "Want to invite friends?", es: "¿Invitamos amigos?", ph: "een-vee-TAH-mohs ah-MEE-gohs" },
        { en: "There's a kids' party", es: "Hay una fiesta infantil", ph: "AH-ee OO-nah fee-EHS-tah een-fahn-TEEL" },
        { en: "What time does it start?", es: "¿A qué hora empieza?", ph: "ah keh OH-rah ehm-pee-EH-sah" },
        { en: "Should we cook or order in?", es: "¿Cocinamos o pedimos?", ph: "koh-see-NAH-mohs oh peh-DEE-mohs" },
        { en: "Let's go for a walk", es: "Vamos a caminar", ph: "VAH-mohs ah kah-mee-NAHR" },
        { en: "I need a relaxed day", es: "Necesito un día tranquilo", ph: "neh-seh-SEE-toh oon DEE-ah trahn-KEE-loh" },
        { en: "We'll do it Sunday", es: "Lo hacemos el domingo", ph: "loh ah-SEH-mohs ehl doh-MEEN-goh" },
      ]},

      { id: "doctor-deep", title: "At the Doctor", icon: "🩺", phrases: [
        { en: "I have an appointment", es: "Tengo cita", ph: "TEHN-goh SEE-tah" },
        { en: "It's been hurting for three days", es: "Me duele desde hace tres días", ph: "meh DWEH-leh DEHS-deh AH-seh TREHS DEE-ahs" },
        { en: "It's a sharp pain", es: "Es un dolor agudo", ph: "ehs oon doh-LOHR ah-GOO-doh" },
        { en: "It's a dull pain", es: "Es un dolor sordo", ph: "ehs oon doh-LOHR SOHR-doh" },
        { en: "I'm dizzy", es: "Tengo mareo", ph: "TEHN-goh mah-REH-oh" },
        { en: "I have a cough", es: "Tengo tos", ph: "TEHN-goh TOHS" },
        { en: "I'm taking these pills", es: "Estoy tomando estas pastillas", ph: "ehs-TOY toh-MAHN-doh EHS-tahs pahs-TEE-yahs" },
        { en: "I'm allergic to penicillin", es: "Soy alérgico a la penicilina", ph: "soy ah-LEHR-hee-koh ah lah peh-nee-see-LEE-nah" },
        { en: "Do I need a prescription?", es: "¿Necesito receta?", ph: "neh-seh-SEE-toh rreh-SEH-tah" },
        { en: "When should I come back?", es: "¿Cuándo vuelvo?", ph: "KWAHN-doh VWEHL-voh" },
        { en: "Thank you, doctor", es: "Gracias, doctor", ph: "GRAH-syahs, dohk-TOHR" },
      ]},

      { id: "bank", title: "Bank & Bureaucracy", icon: "🏦", phrases: [
        { en: "I need to make a transfer", es: "Necesito hacer una transferencia", ph: "neh-seh-SEE-toh ah-SEHR OO-nah trahns-feh-REHN-syah" },
        { en: "Here's my ID", es: "Aquí está mi DNI", ph: "ah-KEE ehs-TAH mee deh-eh-neh-EE", note: "DNI = Peruvian ID. 'Carné' or 'cédula' elsewhere." },
        { en: "I'd like to open an account", es: "Quiero abrir una cuenta", ph: "kee-EH-roh ah-BREER OO-nah KWEHN-tah" },
        { en: "What documents do I need?", es: "¿Qué documentos necesito?", ph: "keh doh-koo-MEHN-tohs neh-seh-SEE-toh" },
        { en: "Can I withdraw cash?", es: "¿Puedo retirar efectivo?", ph: "PWEH-doh rreh-tee-RAHR eh-fehk-TEE-voh" },
        { en: "What are the fees?", es: "¿Cuáles son las comisiones?", ph: "KWAH-lehs SOHN lahs koh-mee-SYOH-nehs" },
        { en: "How long does it take?", es: "¿Cuánto se demora?", ph: "KWAHN-toh seh deh-MOH-rah" },
        { en: "I'll wait", es: "Espero", ph: "ehs-PEH-roh" },
        { en: "I lost my card", es: "Perdí mi tarjeta", ph: "pehr-DEE mee tahr-HEH-tah" },
        { en: "I need to block it", es: "Necesito bloquearla", ph: "neh-seh-SEE-toh bloh-keh-AHR-lah" },
      ]},

      { id: "body", title: "Body & Pain", icon: "💪", phrases: [
        { en: "Head, neck, shoulder", es: "Cabeza, cuello, hombro", ph: "kah-BEH-sah, KWEH-yoh, OHM-broh" },
        { en: "Arm, hand, finger", es: "Brazo, mano, dedo", ph: "BRAH-soh, MAH-noh, DEH-doh" },
        { en: "Back, leg, foot", es: "Espalda, pierna, pie", ph: "ehs-PAHL-dah, pee-EHR-nah, pee-EH" },
        { en: "Eye, ear, mouth, nose", es: "Ojo, oreja, boca, nariz", ph: "OH-hoh, oh-REH-hah, BOH-kah, nah-REES" },
        { en: "Heart, stomach, lung", es: "Corazón, estómago, pulmón", ph: "koh-rah-SOHN, ehs-TOH-mah-goh, pool-MOHN" },
        { en: "It hurts here", es: "Me duele acá", ph: "meh DWEH-leh ah-KAH" },
        { en: "I twisted my ankle", es: "Me torcí el tobillo", ph: "meh tohr-SEE ehl toh-BEE-yoh" },
        { en: "I cut myself", es: "Me corté", ph: "meh kohr-TEH" },
        { en: "I burned myself", es: "Me quemé", ph: "meh keh-MEH" },
        { en: "I can't move it", es: "No lo puedo mover", ph: "noh loh PWEH-doh moh-VEHR" },
      ]},

      { id: "weather", title: "Weather & Small Talk", icon: "☁️", phrases: [
        { en: "It's hot today", es: "Hace calor hoy", ph: "AH-seh kah-LOHR oy" },
        { en: "It's cold", es: "Hace frío", ph: "AH-seh FREE-oh" },
        { en: "It's a beautiful day", es: "Está lindo el día", ph: "ehs-TAH LEEN-doh ehl DEE-ah" },
        { en: "It's drizzling", es: "Está garuando", ph: "ehs-TAH gah-roo-AHN-doh", note: "'Garúa' = Lima's signature constant drizzle." },
        { en: "The fog is heavy", es: "Hay mucha neblina", ph: "AH-ee MOO-chah neh-BLEE-nah" },
        { en: "The sun is finally out", es: "Por fin salió el sol", ph: "pohr FEEN sah-LYOH ehl SOHL" },
        { en: "It's humid", es: "Está húmedo", ph: "ehs-TAH OO-meh-doh" },
        { en: "What a heat!", es: "¡Qué calor!", ph: "keh kah-LOHR" },
        { en: "Take an umbrella", es: "Lleva paraguas", ph: "YEH-vah pah-RAH-gwahs" },
        { en: "How is the weather there?", es: "¿Cómo está el clima por allá?", ph: "KOH-moh ehs-TAH ehl KLEE-mah pohr ah-YAH" },
      ]},

      { id: "restaurant-deep", title: "Restaurant (deep)", icon: "🍴", phrases: [
        { en: "A table for two, please", es: "Una mesa para dos, por favor", ph: "OO-nah MEH-sah PAH-rah DOHS, pohr fah-VOHR" },
        { en: "We have a reservation", es: "Tenemos reserva", ph: "teh-NEH-mohs rreh-SEHR-vah" },
        { en: "Could you bring the menu?", es: "¿Nos trae la carta?", ph: "nohs TRAH-eh lah KAR-tah", note: "'Carta' = menu. 'Menú' usually = set lunch deal." },
        { en: "What do you recommend?", es: "¿Qué nos recomienda?", ph: "keh nohs rreh-koh-mee-EHN-dah" },
        { en: "Is this dish spicy?", es: "¿Este plato es picante?", ph: "EHS-teh PLAH-toh ehs pee-KAHN-teh" },
        { en: "I'd like the ceviche", es: "Quiero el ceviche", ph: "kee-EH-roh ehl seh-VEE-cheh" },
        { en: "Without cilantro, please", es: "Sin culantro, por favor", ph: "seen koo-LAHN-troh, pohr fah-VOHR", note: "'Culantro' in PE = cilantro elsewhere." },
        { en: "More water, please", es: "Más agua, por favor", ph: "MAHS AH-gwah, pohr fah-VOHR" },
        { en: "Still or sparkling?", es: "¿Sin gas o con gas?", ph: "seen GAHS oh kohn GAHS" },
        { en: "Everything was excellent", es: "Todo estuvo excelente", ph: "TOH-doh ehs-TOO-voh ehk-seh-LEHN-teh" },
        { en: "The bill, please", es: "La cuenta, por favor", ph: "lah KWEHN-tah, pohr fah-VOHR" },
        { en: "Is service included?", es: "¿El servicio está incluido?", ph: "ehl sehr-VEE-syoh ehs-TAH een-kloo-EE-doh" },
      ]},

    ]
  },

  /* ════════════════════════════════════════════════════
     OUT & ABOUT — Lima life, social moments, errands
     ════════════════════════════════════════════════════ */
  out: {
    title: "Out & About",
    icon: "📍",
    sections: [

      { id: "apologies", title: "Apologies & Social Repair", icon: "🙏", phrases: [
        { en: "Sorry, my mistake", es: "Perdón, fue mi error", ph: "pehr-DOHN, FWEH mee eh-RROHR" },
        { en: "Excuse me (passing through)", es: "Permiso", ph: "pehr-MEE-soh", note: "What you say to squeeze past someone in a crowded combi." },
        { en: "Sorry to bother you", es: "Disculpa la molestia", ph: "dees-KOOL-pah lah moh-LEHS-tee-ah" },
        { en: "I didn't mean it", es: "No fue mi intención", ph: "noh FWEH mee een-tehn-SYOHN" },
        { en: "It was an accident", es: "Fue sin querer", ph: "FWEH seen keh-REHR" },
        { en: "Please forgive me", es: "Por favor, perdóname", ph: "pohr fah-VOHR, pehr-DOH-nah-meh" },
        { en: "I'm late, I'm sorry", es: "Llegué tarde, disculpa", ph: "yeh-GEH TAR-deh, dees-KOOL-pah" },
        { en: "I forgot", es: "Se me olvidó", ph: "seh meh ohl-vee-DOH" },
        { en: "I misunderstood", es: "Entendí mal", ph: "ehn-tehn-DEE MAHL" },
        { en: "Let's start over", es: "Empecemos de nuevo", ph: "ehm-peh-SEH-mohs deh NWEH-voh" },
        { en: "No worries", es: "No te preocupes", ph: "noh teh preh-oh-KOO-pehs" },
        { en: "All good", es: "Todo tranquilo", ph: "TOH-doh trahn-KEE-loh", note: "Very Peruvian — 'all chill, no problem.'" },
      ]},

      { id: "futbol", title: "Fútbol & Sports", icon: "⚽", phrases: [
        { en: "Did you see the match?", es: "¿Viste el partido?", ph: "VEES-teh ehl pahr-TEE-doh" },
        { en: "Who's playing?", es: "¿Quién juega?", ph: "kee-EHN HWEH-gah" },
        { en: "What's the score?", es: "¿Cómo van?", ph: "KOH-moh VAHN", note: "Lit. 'how are they going' — standard way to ask score." },
        { en: "We're winning", es: "Vamos ganando", ph: "VAH-mohs gah-NAHN-doh" },
        { en: "What a goal!", es: "¡Qué golazo!", ph: "keh goh-LAH-soh" },
        { en: "Who do you support?", es: "¿De qué equipo eres?", ph: "deh keh eh-KEE-poh EH-rehs" },
        { en: "I'm for the U", es: "Soy de la U", ph: "soy deh lah OO", note: "Universitario fan. Alianza Lima fans say 'soy de Alianza.'" },
        { en: "It was a tough match", es: "Estuvo difícil el partido", ph: "ehs-TOO-voh dee-FEE-seel ehl pahr-TEE-doh" },
        { en: "Peru plays tonight", es: "Perú juega esta noche", ph: "peh-ROO HWEH-gah EHS-tah NOH-cheh" },
        { en: "Come on Peru!", es: "¡Vamos Perú!", ph: "VAH-mohs peh-ROO" },
        { en: "That ref is blind", es: "El árbitro está ciego", ph: "ehl AHR-bee-troh ehs-TAH see-EH-goh" },
        { en: "We won!", es: "¡Ganamos!", ph: "gah-NAH-mohs" },
      ]},

      { id: "haircut", title: "Hair Salon & Barber", icon: "💇", phrases: [
        { en: "How much for a haircut?", es: "¿Cuánto por un corte?", ph: "KWAHN-toh pohr oon KOHR-teh" },
        { en: "Short on the sides", es: "Corto a los costados", ph: "KOHR-toh ah lohs kohs-TAH-dohs" },
        { en: "Longer on top", es: "Más largo arriba", ph: "MAHS LAHR-goh ah-RREE-bah" },
        { en: "Just a trim", es: "Solo un recorte", ph: "SOH-loh oon rreh-KOHR-teh" },
        { en: "Take off about an inch", es: "Quita como dos centímetros", ph: "KEE-tah KOH-moh DOHS sehn-TEE-meh-trohs", note: "LATAM uses cm not inches. ~2 cm." },
        { en: "Fade on the sides", es: "Degradado en los costados", ph: "deh-grah-DAH-doh ehn lohs kohs-TAH-dohs" },
        { en: "Trim my beard too", es: "Recórtame la barba también", ph: "rreh-KOHR-tah-meh lah BAHR-bah tahm-bee-EHN" },
        { en: "Not too short", es: "No muy corto", ph: "noh MWEE KOHR-toh" },
        { en: "That's perfect", es: "Así está perfecto", ph: "ah-SEE ehs-TAH pehr-FEHK-toh" },
        { en: "How much do I owe you?", es: "¿Cuánto te debo?", ph: "KWAHN-toh teh DEH-boh" },
      ]},

      { id: "haggling", title: "Markets & Haggling", icon: "🛍️", phrases: [
        { en: "How much for this?", es: "¿Cuánto cuesta esto?", ph: "KWAHN-toh KWEHS-tah EHS-toh" },
        { en: "That's too expensive", es: "Está muy caro", ph: "ehs-TAH MWEE KAH-roh" },
        { en: "Can you give it cheaper?", es: "¿Me lo da más barato?", ph: "meh loh DAH MAHS bah-RAH-toh" },
        { en: "What's your best price?", es: "¿Cuál es su mejor precio?", ph: "KWAHL ehs soo meh-HOHR PREH-syoh" },
        { en: "I'll take two", es: "Llevo dos", ph: "YEH-voh DOHS" },
        { en: "Throw in a discount?", es: "¿Me hace un descuentito?", ph: "meh AH-seh oon dehs-kwehn-TEE-toh", note: "'-ito' makes it small/cute — softens the ask." },
        { en: "Last price?", es: "¿Último precio?", ph: "OOL-tee-moh PREH-syoh" },
        { en: "I'll come back later", es: "Vuelvo más tarde", ph: "VWELL-voh MAHS TAR-deh", note: "Polite way to leave without buying." },
        { en: "Do you have it in another color?", es: "¿Lo tiene en otro color?", ph: "loh tee-EH-neh ehn OH-troh koh-LOHR" },
        { en: "Just looking, thanks", es: "Solo mirando, gracias", ph: "SOH-loh mee-RAHN-doh, GRAH-syahs" },
      ]},

      { id: "emergency", title: "Emergency & Police", icon: "🚨", phrases: [
        { en: "Help!", es: "¡Ayuda!", ph: "ah-YOO-dah" },
        { en: "Call the police", es: "Llama a la policía", ph: "YAH-mah ah lah poh-lee-SEE-ah" },
        { en: "Where's the nearest police station?", es: "¿Dónde está la comisaría más cercana?", ph: "DOHN-deh ehs-TAH lah koh-mee-sah-REE-ah MAHS sehr-KAH-nah", note: "'Comisaría' = local police station in PE." },
        { en: "I've been robbed", es: "Me robaron", ph: "meh rroh-BAH-rohn" },
        { en: "Someone took my phone", es: "Me quitaron el celular", ph: "meh kee-TAH-rohn ehl seh-loo-LAHR" },
        { en: "I lost my wallet", es: "Perdí mi billetera", ph: "pehr-DEE mee bee-yeh-TEH-rah" },
        { en: "Call an ambulance", es: "Llama una ambulancia", ph: "YAH-mah OO-nah ahm-boo-LAHN-syah" },
        { en: "I need help, urgent", es: "Necesito ayuda, urgente", ph: "neh-seh-SEE-toh ah-YOO-dah, oor-HEHN-teh" },
        { en: "My child is missing", es: "Mi hijo está perdido", ph: "mee EE-hoh ehs-TAH pehr-DEE-doh" },
        { en: "What's the emergency number?", es: "¿Cuál es el número de emergencia?", ph: "KWAHL ehs ehl NOO-meh-roh deh eh-mehr-HEHN-syah", note: "Peru: 105 police, 116 fire, 117 ambulance." },
      ]},

      { id: "driving", title: "Driving & Mechanic", icon: "🚗", phrases: [
        { en: "I have a flat tire", es: "Tengo una llanta pinchada", ph: "TEHN-goh OO-nah YAHN-tah peen-CHAH-dah" },
        { en: "The car won't start", es: "El carro no enciende", ph: "ehl KAH-rroh noh ehn-see-EHN-deh" },
        { en: "There's a strange noise", es: "Hace un ruido raro", ph: "AH-seh oon RRWEE-doh RRAH-roh" },
        { en: "Can you take a look?", es: "¿Puede revisarlo?", ph: "PWEH-deh rreh-vee-SAHR-loh" },
        { en: "How long will it take?", es: "¿Cuánto se demora?", ph: "KWAHN-toh seh deh-MOH-rah" },
        { en: "How much will it cost?", es: "¿Cuánto va a costar?", ph: "KWAHN-toh vah ah kohs-TAHR" },
        { en: "Fill it up, please", es: "Lleno, por favor", ph: "YEH-noh, pohr fah-VOHR", note: "At gas station — 'fill the tank.'" },
        { en: "Can I park here?", es: "¿Puedo estacionar aquí?", ph: "PWEH-doh ehs-tah-syoh-NAHR ah-KEE" },
        { en: "Where can I park?", es: "¿Dónde puedo estacionar?", ph: "DOHN-deh PWEH-doh ehs-tah-syoh-NAHR" },
        { en: "Is parking free?", es: "¿El estacionamiento es gratis?", ph: "ehl ehs-tah-syoh-nah-mee-EHN-toh ehs GRAH-tees" },
      ]},

      { id: "wifi", title: "WiFi & Tech Problems", icon: "📶", phrases: [
        { en: "The internet isn't working", es: "No funciona el internet", ph: "noh foon-SYOH-nah ehl een-tehr-NEHT" },
        { en: "What's the WiFi password?", es: "¿Cuál es la clave del WiFi?", ph: "KWAHL ehs lah KLAH-veh dehl WEE-fee", note: "'Clave' = password in PE/CO. 'Contraseña' is more formal." },
        { en: "The signal is weak", es: "La señal está débil", ph: "lah seh-NYAHL ehs-TAH DEH-beel" },
        { en: "I need to reset the router", es: "Necesito reiniciar el router", ph: "neh-seh-SEE-toh rreh-ee-nee-SYAHR ehl ROO-tehr" },
        { en: "When will it be fixed?", es: "¿Cuándo lo van a arreglar?", ph: "KWAHN-doh loh VAHN ah ah-rreh-GLAHR" },
        { en: "I'm calling about my service", es: "Llamo por mi servicio", ph: "YAH-moh pohr mee sehr-VEE-syoh" },
        { en: "My account number is…", es: "Mi número de cuenta es…", ph: "mee NOO-meh-roh deh KWEHN-tah ehs" },
        { en: "Could you send a technician?", es: "¿Pueden mandar un técnico?", ph: "PWEH-dehn mahn-DAHR oon TEHK-nee-koh" },
        { en: "Sorry, the line cut out", es: "Perdón, se cortó la llamada", ph: "pehr-DOHN, seh kohr-TOH lah yah-MAH-dah" },
        { en: "I'll call back", es: "Te vuelvo a llamar", ph: "teh VWELL-voh ah yah-MAHR" },
      ]},

      { id: "phone-calls", title: "Phone & Messages", icon: "📞", phrases: [
        { en: "Hello? (on the phone)", es: "¿Aló?", ph: "ah-LOH", note: "Standard phone greeting in PE/CL. 'Bueno' is Mexican, 'Diga' Colombian." },
        { en: "Who's this?", es: "¿Quién habla?", ph: "kee-EHN AH-blah" },
        { en: "It's me, Stu", es: "Soy yo, Stu", ph: "soy YOH, STOO" },
        { en: "Can I speak with…?", es: "¿Puedo hablar con…?", ph: "PWEH-doh ah-BLAHR kohn" },
        { en: "He's not here right now", es: "No está en este momento", ph: "noh ehs-TAH ehn EHS-teh moh-MEHN-toh" },
        { en: "I'll call you back", es: "Te llamo de vuelta", ph: "teh YAH-moh deh VWELL-tah" },
        { en: "Can you call later?", es: "¿Me puedes llamar después?", ph: "meh PWEH-dehs yah-MAHR dehs-PWEHS" },
        { en: "I'm in a meeting", es: "Estoy en una reunión", ph: "ehs-TOY ehn OO-nah rreh-oo-NYOHN" },
        { en: "Send me a WhatsApp", es: "Mándame un WhatsApp", ph: "MAHN-dah-meh oon WAHTS-ahp", note: "Lima runs on WhatsApp. Verb 'whatsappear' is real." },
        { en: "Did you get my message?", es: "¿Te llegó mi mensaje?", ph: "teh yeh-GOH mee mehn-SAH-heh" },
      ]},

    ]
  },

  /* ════════════════════════════════════════════════════
     PARENTING — toddler + teenager + family events
     ════════════════════════════════════════════════════ */
  parenting: {
    title: "Parenting",
    icon: "👨‍👩‍👧‍👦",
    sections: [

      { id: "toddler", title: "Toddler (Emiliano)", icon: "👶", phrases: [
        { en: "No, don't touch", es: "No, no toques", ph: "noh, noh TOH-kehs" },
        { en: "Careful!", es: "¡Cuidado!", ph: "kwee-DAH-doh" },
        { en: "Don't run", es: "No corras", ph: "noh KOH-rrahs" },
        { en: "Share with mommy", es: "Comparte con mamá", ph: "kohm-PAHR-teh kohn mah-MAH" },
        { en: "Calm down", es: "Cálmate", ph: "KAHL-mah-teh" },
        { en: "Use your words", es: "Dime con palabras", ph: "DEE-meh kohn pah-LAH-brahs" },
        { en: "It's okay, I'm here", es: "Tranquilo, papá está aquí", ph: "trahn-KEE-loh, pah-PAH ehs-TAH ah-KEE" },
        { en: "Are you hurt?", es: "¿Te duele?", ph: "teh DWEH-leh" },
        { en: "What's wrong, baby?", es: "¿Qué pasa, bebé?", ph: "keh PAH-sah, beh-BEH" },
        { en: "Good job!", es: "¡Muy bien!", ph: "MWEE bee-EHN" },
        { en: "Don't put that in your mouth", es: "No te metas eso a la boca", ph: "noh teh MEH-tahs EH-soh ah lah BOH-kah" },
        { en: "Show me with your finger", es: "Muéstrame con el dedito", ph: "MWEHS-trah-meh kohn ehl deh-DEE-toh", note: "'Dedito' (little finger) — sweet diminutive for Emiliano." },
      ]},

      { id: "teen", title: "Teen Talk (Joaquín)", icon: "🎧", phrases: [
        { en: "How was school?", es: "¿Cómo te fue en el cole?", ph: "KOH-moh teh FWEH ehn ehl KOH-leh", note: "'Cole' = casual short for 'colegio.'" },
        { en: "Did you finish your homework?", es: "¿Terminaste la tarea?", ph: "tehr-mee-NAHS-teh lah tah-REH-ah" },
        { en: "Off the phone, please", es: "Suelta el celular, por favor", ph: "SWELL-tah ehl seh-loo-LAHR, pohr fah-VOHR" },
        { en: "What time will you be home?", es: "¿A qué hora regresas?", ph: "ah keh OH-rah rreh-GREH-sahs" },
        { en: "Be home by ten", es: "A las diez en casa", ph: "ah lahs dee-EHS ehn KAH-sah" },
        { en: "Who are you going with?", es: "¿Con quién vas?", ph: "kohn kee-EHN VAHS" },
        { en: "Send me a message when you arrive", es: "Mándame mensaje cuando llegues", ph: "MAHN-dah-meh mehn-SAH-heh KWAHN-doh YEH-gehs" },
        { en: "We need to talk", es: "Tenemos que hablar", ph: "teh-NEH-mohs keh ah-BLAHR" },
        { en: "I trust you", es: "Confío en ti", ph: "kohn-FEE-oh ehn TEE" },
        { en: "I'm proud of you, son", es: "Estoy orgulloso de ti, hijo", ph: "ehs-TOY ohr-goo-YOH-soh deh TEE, EE-hoh" },
        { en: "Whatever you need, I'm here", es: "Cualquier cosa, aquí estoy", ph: "kwahl-kee-EHR KOH-sah, ah-KEE ehs-TOY" },
        { en: "Don't get in trouble", es: "No te metas en problemas", ph: "noh teh MEH-tahs ehn proh-BLEH-mahs" },
      ]},

      { id: "kid-parties", title: "Kid Birthdays & Parties", icon: "🎂", phrases: [
        { en: "Happy birthday!", es: "¡Feliz cumpleaños!", ph: "feh-LEES koom-pleh-AH-nyohs" },
        { en: "We're invited to a birthday", es: "Estamos invitados a un cumple", ph: "ehs-TAH-mohs een-vee-TAH-dohs ah oon KOOM-pleh", note: "'Cumple' = casual for 'cumpleaños.'" },
        { en: "What should we bring?", es: "¿Qué llevamos?", ph: "keh yeh-VAH-mohs" },
        { en: "We'll bring a present", es: "Llevamos un regalo", ph: "yeh-VAH-mohs oon rreh-GAH-loh" },
        { en: "What time does it start?", es: "¿A qué hora empieza?", ph: "ah keh OH-rah ehm-pee-EH-sah" },
        { en: "Where's the party?", es: "¿Dónde es la fiesta?", ph: "DOHN-deh ehs lah fee-EHS-tah" },
        { en: "Is there a piñata?", es: "¿Hay piñata?", ph: "AH-ee pee-NYAH-tah" },
        { en: "Thanks for inviting us", es: "Gracias por la invitación", ph: "GRAH-syahs pohr lah een-vee-tah-SYOHN" },
        { en: "Everything was lovely", es: "Estuvo todo precioso", ph: "ehs-TOO-voh TOH-doh preh-SYOH-soh" },
        { en: "Let's go, we're tired", es: "Vámonos, estamos cansados", ph: "VAH-moh-nohs, ehs-TAH-mohs kahn-SAH-dohs" },
      ]},

    ]
  },

  /* ════════════════════════════════════════════════════
     PERU CULTURE — slang, religion, food, holidays
     ════════════════════════════════════════════════════ */
  culture: {
    title: "Peru Culture",
    icon: "🇵🇪",
    sections: [

      { id: "money-slang", title: "Money & Lima Slang", icon: "💰", phrases: [
        { en: "It cost me five lucas", es: "Me costó cinco lucas", ph: "meh kohs-TOH SEEN-koh LOO-kahs", note: "'Luca' = 1000 soles in Peru. Five lucas = S/5,000." },
        { en: "Got any work going on?", es: "¿Tienes chamba?", ph: "tee-EH-nehs CHAHM-bah", note: "'Chamba' = work / gig. Universal across LATAM." },
        { en: "I'm heading home", es: "Me voy al jato", ph: "meh VOY ahl HAH-toh", note: "'Jato' = house/home in PE slang. 'J' sounds like English 'h'." },
        { en: "He's a good guy", es: "Es buena gente", ph: "ehs BWEH-nah HEHN-teh" },
        { en: "What's up, dude?", es: "¿Qué tal, causa?", ph: "keh TAHL, KOW-sah", note: "'Causa' = bro/dude in PE. Also a famous potato dish — context decides." },
        { en: "That's so cool", es: "Está bacán", ph: "ehs-TAH bah-KAHN", note: "'Bacán' = awesome. Very Peruvian." },
        { en: "Right away", es: "Al toque", ph: "ahl TOH-keh", note: "Means immediately / on the spot. Use it everywhere." },
        { en: "Throw in a little extra?", es: "¿Me das una yapa?", ph: "meh DAHS OO-nah YAH-pah", note: "Quechua loanword — 'yapa' is the bonus the market vendor adds." },
        { en: "That party was awesome", es: "Ese tono estuvo bacán", ph: "EH-seh TOH-noh ehs-TOO-voh bah-KAHN", note: "'Tono' = party in Peru. 'Fiesta' is more general." },
        { en: "Watch your stuff", es: "Cuidado con tus cosas", ph: "kwee-DAH-doh kohn toos KOH-sahs", note: "Says 'pickpockets exist.' Less direct than 'choros' (thieves)." },
        { en: "How embarrassing!", es: "¡Qué palta!", ph: "keh PAHL-tah", note: "'Palta' = avocado AND embarrassment. 'Me paltié' = I got embarrassed." },
        { en: "I'm broke", es: "Estoy misio", ph: "ehs-TOY MEE-syoh", note: "PE slang for broke. 'No tengo plata' is the standard version." },
        { en: "Let's go for a drink", es: "Vamos a chupar", ph: "VAH-mohs ah choo-PAHR", note: "'Chupar' literally = to suck, slang = to drink alcohol." },
        { en: "Cool!", es: "¡Chévere!", ph: "CHEH-veh-reh", note: "Cool / nice. Pan-LATAM but very common in Peru." },
      ]},

      { id: "religion", title: "Religion & Blessings", icon: "🙏", phrases: [
        { en: "God bless you", es: "Que Dios te bendiga", ph: "keh dee-OHS teh behn-DEE-gah" },
        { en: "Thank God", es: "Gracias a Dios", ph: "GRAH-syahs ah dee-OHS" },
        { en: "God willing", es: "Si Dios quiere", ph: "see dee-OHS kee-EH-reh", note: "Said when planning something — like 'fingers crossed.'" },
        { en: "Hopefully", es: "Ojalá", ph: "oh-hah-LAH", note: "From Arabic 'in shā' Allāh' — 'if God wills.' Used constantly." },
        { en: "Good luck", es: "Mucha suerte", ph: "MOO-chah SWEHR-teh" },
        { en: "Knock on wood", es: "Toca madera", ph: "TOH-kah mah-DEH-rah" },
        { en: "God forbid", es: "Dios no lo permita", ph: "dee-OHS noh loh pehr-MEE-tah" },
        { en: "Rest in peace", es: "Que en paz descanse", ph: "keh ehn PAHS dehs-KAHN-seh" },
        { en: "It was meant to be", es: "Estaba escrito", ph: "ehs-TAH-bah ehs-KREE-toh", note: "Literally 'it was written.' Fatalistic but warm." },
        { en: "Bless this food", es: "Bendice estos alimentos", ph: "behn-DEE-seh EHS-tohs ah-lee-MEHN-tohs", note: "Common opening to family meal blessing." },
        { en: "Let's say a prayer", es: "Vamos a rezar", ph: "VAH-mohs ah rreh-SAHR" },
        { en: "Have faith", es: "Ten fe", ph: "TEHN FEH" },
        { en: "Bless you (sneeze)", es: "Salud", ph: "sah-LOOD", note: "After a sneeze. Same word as 'cheers' and 'health.'" },
        { en: "I'll pray for you", es: "Voy a rezar por ti", ph: "VOY ah rreh-SAHR pohr TEE" },
      ]},

      { id: "cooking", title: "Peruvian Cooking", icon: "🍲", phrases: [
        { en: "Should we make lomo saltado?", es: "¿Hacemos lomo saltado?", ph: "ah-SEH-mohs LOH-moh sahl-TAH-doh", note: "Beef stir-fry with onion, tomato, soy sauce, fries — Peru's national dish." },
        { en: "Do we have ají amarillo?", es: "¿Tenemos ají amarillo?", ph: "teh-NEH-mohs ah-HEE ah-mah-REE-yoh", note: "Yellow chili paste — the soul of Peruvian cooking." },
        { en: "I love ají de gallina", es: "Me encanta el ají de gallina", ph: "meh ehn-KAHN-tah ehl ah-HEE deh gah-YEE-nah", note: "Creamy chicken in yellow chili sauce over potato." },
        { en: "Let's make aguadito tonight", es: "Hagamos aguadito esta noche", ph: "ah-GAH-mohs ah-gwah-DEE-toh EHS-tah NOH-cheh", note: "Cilantro chicken soup — cures hangovers and colds." },
        { en: "Can you cut the onion?", es: "¿Puedes picar la cebolla?", ph: "PWEH-dehs pee-KAHR lah seh-BOH-yah" },
        { en: "The ceviche needs more lime", es: "Al ceviche le falta limón", ph: "ahl seh-VEE-cheh leh FAHL-tah lee-MOHN", note: "PE 'limón' = small green lime, not the yellow lemon." },
        { en: "Add a bit more salt", es: "Échale un poco más de sal", ph: "EH-chah-leh oon POH-koh MAHS deh SAHL" },
        { en: "Does it taste spicy?", es: "¿Está picoso?", ph: "ehs-TAH pee-KOH-soh", note: "'Pica' (it stings) is also common." },
        { en: "Stir slowly", es: "Remueve despacito", ph: "rreh-MWEH-veh dehs-pah-SEE-toh" },
        { en: "What's the recipe?", es: "¿Cuál es la receta?", ph: "KWAHL ehs lah rreh-SEH-tah" },
        { en: "It needs more cilantro", es: "Le falta culantro", ph: "leh FAHL-tah koo-LAHN-troh", note: "In PE, 'culantro' = cilantro. 'Cilantro' the word is rarely used here." },
        { en: "Let me taste", es: "Déjame probar", ph: "DEH-hah-meh proh-BAHR" },
        { en: "It's delicious, my love", es: "Está riquísimo, amor", ph: "ehs-TAH rree-KEE-see-moh, ah-MOHR" },
        { en: "Let's order anticuchos", es: "Pidamos anticuchos", ph: "pee-DAH-mohs ahn-tee-KOO-chohs", note: "Grilled beef heart skewers — Lima street food classic." },
      ]},

      { id: "holidays", title: "Peruvian Holidays & Events", icon: "🎉", phrases: [
        { en: "Happy Fiestas Patrias!", es: "¡Feliz Fiestas Patrias!", ph: "feh-LEES fee-EHS-tahs PAH-tree-ahs", note: "July 28-29 — Peru's independence days. Huge celebration." },
        { en: "Are we doing a barbecue?", es: "¿Hacemos parrillada?", ph: "ah-SEH-mohs pah-rree-YAH-dah", note: "Standard 28th-of-July plan." },
        { en: "Long live Peru!", es: "¡Viva el Perú!", ph: "VEE-vah ehl peh-ROO" },
        { en: "Tonight is Día de la Canción Criolla", es: "Esta noche es el Día de la Canción Criolla", ph: "EHS-tah NOH-cheh ehs ehl DEE-ah deh lah kahn-SYOHN kree-OH-yah", note: "October 31 — Peru's answer to Halloween, celebrating Afro-Peruvian music." },
        { en: "Let's go to the procession", es: "Vamos a la procesión", ph: "VAH-mohs ah lah proh-seh-SYOHN", note: "October's Señor de los Milagros — massive Lima religious procession." },
        { en: "Merry Christmas, my love", es: "Feliz Navidad, amor", ph: "feh-LEES nah-vee-DAHD, ah-MOHR" },
        { en: "Happy New Year!", es: "¡Feliz Año Nuevo!", ph: "feh-LEES AH-nyoh NWEH-voh" },
        { en: "Did you buy the panetón?", es: "¿Compraste el panetón?", ph: "kohm-PRAHS-teh ehl pah-neh-TOHN", note: "Peruvian Christmas bread — non-negotiable December tradition." },
        { en: "Twelve grapes at midnight", es: "Doce uvas a la medianoche", ph: "DOH-seh OO-vahs ah lah meh-dee-ah-NOH-cheh", note: "Eat 12 grapes on NYE — one wish per month." },
        { en: "Happy Mother's Day, my love", es: "Feliz Día de la Madre, amor", ph: "feh-LEES DEE-ah deh lah MAH-dreh, ah-MOHR", note: "Second Sunday of May in Peru." },
        { en: "Happy Father's Day", es: "Feliz Día del Padre", ph: "feh-LEES DEE-ah dehl PAH-dreh" },
        { en: "Are the kids going trick-or-treating?", es: "¿Los chicos van a pedir dulces?", ph: "lohs CHEE-kohs VAHN ah peh-DEER DOOL-sehs", note: "Halloween is observed in Peru, especially among kids in Lima." },
        { en: "Best wishes for the new year", es: "Mis mejores deseos para el año nuevo", ph: "mees meh-HOH-rehs deh-SEH-ohs PAH-rah ehl AH-nyoh NWEH-voh" },
      ]},

    ]
  },

  /* ════════════════════════════════════════════════════
     FAMILY NETWORK — Stephania + her parents, siblings,
     Chris+Cyn+Paz, and Aunt Carmen's branch
     ════════════════════════════════════════════════════ */
  family: {
    title: "Family Network",
    icon: "👪",
    sections: [

      { id: "stephania-deep", title: "With Stephania (deep)", icon: "💕", phrases: [
        { en: "We need to talk about us", es: "Tenemos que hablar de nosotros", ph: "teh-NEH-mohs keh ah-BLAHR deh noh-SOH-trohs" },
        { en: "Are you okay, my love?", es: "¿Estás bien, amor?", ph: "ehs-TAHS bee-EHN, ah-MOHR" },
        { en: "I'm proud of the family we've built", es: "Estoy orgulloso de la familia que construimos", ph: "ehs-TOY ohr-goo-YOH-soh deh lah fah-MEE-lyah keh kohn-stroo-EE-mohs" },
        { en: "What are you thinking?", es: "¿En qué piensas?", ph: "ehn keh pee-EHN-sahs" },
        { en: "Let's plan something just us two", es: "Planeemos algo solo nosotros dos", ph: "plah-neh-EH-mohs AHL-goh SOH-loh noh-SOH-trohs DOHS" },
        { en: "Thank you for everything you do", es: "Gracias por todo lo que haces", ph: "GRAH-syahs pohr TOH-doh loh keh AH-sehs" },
        { en: "I couldn't do this without you", es: "No podría hacer esto sin ti", ph: "noh poh-DREE-ah ah-SEHR EHS-toh seen TEE" },
        { en: "Let's decide together", es: "Decidamos juntos", ph: "deh-see-DAH-mohs HOON-tohs" },
        { en: "Sorry I was distracted earlier", es: "Disculpa que estaba distraído", ph: "dees-KOOL-pah keh ehs-TAH-bah dees-trah-EE-doh" },
        { en: "How did your day really go?", es: "¿Cómo te fue, en serio?", ph: "KOH-moh teh FWEH, ehn SEH-ree-oh" },
        { en: "Should we save more this month?", es: "¿Deberíamos ahorrar más este mes?", ph: "deh-beh-REE-ah-mohs ah-oh-RRAHR MAHS EHS-teh MEHS" },
        { en: "I love you more every day", es: "Te amo más cada día", ph: "teh AH-moh MAHS KAH-dah DEE-ah" },
        { en: "You're the best mom", es: "Eres la mejor mamá", ph: "EH-rehs lah meh-HOHR mah-MAH" },
        { en: "Let's go to bed early", es: "Vamos a dormir temprano", ph: "VAH-mohs ah dohr-MEER tehm-PRAH-noh" },
      ]},

      { id: "suegros-formal", title: "Suegros — formal usted (Jorge & Gladys)", icon: "👔", phrases: [
        { en: "Hello Jorge, how are you?", es: "Hola Jorge, ¿cómo está?", ph: "OH-lah HOHR-heh, KOH-moh ehs-TAH", note: "Formal usted — safer default with father-in-law until he says 'tutéame.'" },
        { en: "Hi Gladys, how have you been?", es: "Hola Gladys, ¿cómo ha estado?", ph: "OH-lah GLAH-dees, KOH-moh AH ehs-TAH-doh", note: "Usted form for mother-in-law in LA." },
        { en: "Father-in-law, how are you?", es: "Suegro, ¿cómo está usted?", ph: "SWEH-groh, KOH-moh ehs-TAH oos-TEHD" },
        { en: "Mother-in-law, how is your health?", es: "Suegra, ¿cómo está su salud?", ph: "SWEH-grah, KOH-moh ehs-TAH soo sah-LOOD" },
        { en: "Would you like more, Gladys?", es: "¿Le sirvo más, Gladys?", ph: "leh SEER-voh MAHS, GLAH-dees", note: "Le = formal indirect object." },
        { en: "Take care, Jorge", es: "Cuídese mucho, Jorge", ph: "KWEE-deh-seh MOO-choh, HOHR-heh", note: "Cuídese (usted) vs cuídate (tú)." },
        { en: "Thank you for everything, suegro", es: "Gracias por todo, suegro", ph: "GRAH-syahs pohr TOH-doh, SWEH-groh" },
        { en: "I wish you a happy birthday, suegro", es: "Le deseo un feliz cumpleaños, suegro", ph: "leh deh-SEH-oh oon feh-LEES koom-pleh-AH-nyohs, SWEH-groh", note: "Le deseo = I wish you (formal)." },
        { en: "Do you need anything, suegra?", es: "¿Necesita algo, suegra?", ph: "neh-seh-SEE-tah AHL-goh, SWEH-grah" },
        { en: "It was a pleasure, suegros", es: "Ha sido un placer, suegros", ph: "AH SEE-doh oon plah-SEHR, SWEH-grohs" },
        { en: "Say hi to the family", es: "Salúdeme a la familia", ph: "sah-LOO-deh-meh ah lah fah-MEE-lyah", note: "Salúdeme (usted) vs salúdame (tú)." },
        { en: "It's good to see you, suegra", es: "Me alegra verla, suegra", ph: "meh ah-LEH-grah VEHR-lah, SWEH-grah", note: "Verla (her, formal) vs verte (you, informal)." },
        { en: "Rest well, suegro", es: "Que descanse, suegro", ph: "keh dehs-KAHN-seh, SWEH-groh" },
        { en: "Thank you for having us in your home", es: "Gracias por recibirnos en su casa", ph: "GRAH-syahs pohr rreh-see-BEER-nohs ehn soo KAH-sah", note: "Su casa = your house (formal)." },
        { en: "I hope to see you soon", es: "Espero verlos pronto", ph: "ehs-PEH-roh VEHR-lohs PROHN-toh" },
        { en: "Please, call me tú", es: "Por favor, tutéeme", ph: "pohr fah-VOHR, too-TEH-eh-meh", note: "Asking THEM to use tú with you. Useful when reversing the relationship." },
      ]},

      { id: "in-laws-parents", title: "Jorge (Dad) & Gladys — informal (after tutéame)", icon: "👴", phrases: [
        { en: "Hi Jorge, how are you?", es: "Hola Jorge, ¿cómo estás?", ph: "OH-lah HOHR-heh, KOH-moh ehs-TAHS", note: "Stephania's dad — uses tú (informal) since you're family." },
        { en: "Hi Gladys, how's Los Angeles?", es: "Hola Gladys, ¿cómo está Los Ángeles?", ph: "OH-lah GLAH-dees, KOH-moh ehs-TAH lohs AHN-heh-lehs", note: "Stephania's mom — lives in LA. Video calls only." },
        { en: "When are you coming to visit?", es: "¿Cuándo nos vienen a visitar?", ph: "KWAHN-doh nohs vee-EH-nehn ah vee-see-TAHR" },
        { en: "The kids miss you", es: "Los niños te extrañan", ph: "lohs NEE-nyohs teh ehks-TRAH-nyahn" },
        { en: "Emiliano just learned to walk", es: "Emiliano acaba de aprender a caminar", ph: "eh-mee-lee-AH-noh ah-KAH-bah deh ah-prehn-DEHR ah kah-mee-NAHR" },
        { en: "Thanks for the gift", es: "Gracias por el regalo", ph: "GRAH-syahs pohr ehl rreh-GAH-loh" },
        { en: "How's the weather in LA?", es: "¿Cómo está el clima en Los Ángeles?", ph: "KOH-moh ehs-TAH ehl KLEE-mah ehn lohs AHN-heh-lehs" },
        { en: "Take care of yourself", es: "Cuídate mucho", ph: "KWEE-dah-teh MOO-choh" },
        { en: "Say hi to Belen", es: "Saludos a Belen", ph: "sah-LOO-dohs ah beh-LEHN" },
        { en: "We'll video call Sunday", es: "Hacemos videollamada el domingo", ph: "ah-SEH-mohs vee-deh-oh-yah-MAH-dah ehl doh-MEEN-goh" },
        { en: "Let us know when you arrive", es: "Avísanos cuando llegues", ph: "ah-VEE-sah-nohs KWAHN-doh YEH-gehs" },
        { en: "We're thinking of you", es: "Estamos pensando en ti", ph: "ehs-TAH-mohs pehn-SAHN-doh ehn TEE" },
        { en: "Jorge, would you like a coffee?", es: "Jorge, ¿quieres un café?", ph: "HOHR-heh, kee-EH-rehs oon kah-FEH" },
        { en: "I'll pick you up from the airport", es: "Te recojo del aeropuerto", ph: "teh rreh-KOH-hoh dehl ah-eh-roh-PWEHR-toh" },
      ]},

      { id: "in-laws-siblings", title: "Belen, Jorge Jr & Chris", icon: "👫", phrases: [
        { en: "Hey Belen, how's LA going?", es: "Hola Belen, ¿cómo va Los Ángeles?", ph: "OH-lah beh-LEHN, KOH-moh VAH lohs AHN-heh-lehs", note: "Stephania's sister — also in LA. Call/text." },
        { en: "What's up, Jorgito?", es: "¿Qué tal, Jorgito?", ph: "keh TAHL, hohr-HEE-toh", note: "'Jorgito' (little Jorge) helps distinguish brother from dad." },
        { en: "Hey Chris, everything good?", es: "Oye Chris, ¿todo bien?", ph: "OH-yeh KREES, TOH-doh bee-EHN" },
        { en: "Want to come over for lunch?", es: "¿Vienes a almorzar?", ph: "vee-EH-nehs ah ahl-mohr-SAHR" },
        { en: "Let's all get together this weekend", es: "Reunámonos todos este fin de semana", ph: "rreh-oo-NAH-moh-nohs TOH-dohs EHS-teh FEEN deh seh-MAH-nah" },
        { en: "We're planning a family dinner", es: "Estamos planeando una cena familiar", ph: "ehs-TAH-mohs plah-neh-AHN-doh OO-nah SEH-nah fah-mee-lee-AHR" },
        { en: "How are the kids?", es: "¿Cómo están los chicos?", ph: "KOH-moh ehs-TAHN lohs CHEE-kohs" },
        { en: "Send my love to your family", es: "Saludos a tu familia", ph: "sah-LOO-dohs ah too fah-MEE-lyah" },
        { en: "Belen, when are you back in Peru?", es: "Belen, ¿cuándo vuelves al Perú?", ph: "beh-LEHN, KWAHN-doh VWELL-vehs ahl peh-ROO" },
        { en: "Let's chat later on WhatsApp", es: "Hablamos más tarde por WhatsApp", ph: "ah-BLAH-mohs MAHS TAR-deh pohr WAHTS-ahp" },
        { en: "Thanks for being there", es: "Gracias por estar ahí", ph: "GRAH-syahs pohr ehs-TAHR ah-EE" },
        { en: "Should we make a family group chat?", es: "¿Hacemos un grupo familiar?", ph: "ah-SEH-mohs oon GROO-poh fah-mee-lee-AHR" },
        { en: "Chris, how's work?", es: "Chris, ¿cómo va el trabajo?", ph: "KREES, KOH-moh VAH ehl trah-BAH-hoh" },
      ]},

      { id: "chris-cyn-paz", title: "Chris, Cyn & Paz (teen)", icon: "💒", phrases: [
        { en: "How's the wedding planning going?", es: "¿Cómo va el plan de la boda?", ph: "KOH-moh VAH ehl PLAHN deh lah BOH-dah" },
        { en: "When's the wedding?", es: "¿Cuándo es la boda?", ph: "KWAHN-doh ehs lah BOH-dah" },
        { en: "Congratulations again!", es: "¡Felicidades de nuevo!", ph: "feh-lee-see-DAH-dehs deh NWEH-voh" },
        { en: "Cyn, you look beautiful", es: "Cyn, te ves preciosa", ph: "SEEN, teh VEHS preh-SYOH-sah", note: "Cynthia's nickname. 'Preciosa' = gorgeous." },
        { en: "Hi Paz, how are you?", es: "Hola Paz, ¿cómo estás?", ph: "OH-lah PAHS, KOH-moh ehs-TAHS", note: "Tú is correct — she's a young niece, not an elder." },
        { en: "How's school going, Paz?", es: "¿Cómo te va en el cole, Paz?", ph: "KOH-moh teh VAH ehn ehl KOH-leh, PAHS", note: "'Cole' = casual short for 'colegio.'" },
        { en: "What grade are you in?", es: "¿En qué año estás?", ph: "ehn keh AH-nyoh ehs-TAHS", note: "Peruvian schools use 'año' (year), not 'grado.' E.g. '3ro de secundaria' = year 9." },
        { en: "Paz, you've grown so much!", es: "Paz, ¡cómo has crecido!", ph: "PAHS, KOH-moh AHS kreh-SEE-doh" },
        { en: "How are your friends?", es: "¿Cómo están tus amigas?", ph: "KOH-moh ehs-TAHN toos ah-MEE-gahs" },
        { en: "Are you on holiday?", es: "¿Estás de vacaciones?", ph: "ehs-TAHS deh vah-kah-SYOH-nehs" },
        { en: "Send my love to Paz", es: "Saludos a Paz", ph: "sah-LOO-dohs ah PAHS" },
        { en: "We brought something for Paz", es: "Trajimos algo para Paz", ph: "trah-HEE-mohs AHL-goh PAH-rah PAHS" },
        { en: "Welcome to the family, Cyn", es: "Bienvenida a la familia, Cyn", ph: "bee-ehn-veh-NEE-dah ah lah fah-MEE-lyah, SEEN" },
        { en: "Are we invited to the wedding?", es: "¿Estamos invitados a la boda?", ph: "ehs-TAH-mohs een-vee-TAH-dohs ah lah BOH-dah" },
        { en: "Chris, you should be proud of her", es: "Chris, debes estar orgulloso de ella", ph: "KREES, DEH-behs ehs-TAHR ohr-goo-YOH-soh deh EH-yah" },
      ]},

      { id: "birthdays-wishes", title: "Birthdays & Wishes", icon: "🎂", phrases: [
        { en: "When is your birthday?", es: "¿Cuándo es tu cumpleaños?", ph: "KWAHN-doh ehs too koom-pleh-AH-nyohs" },
        { en: "Happy birthday, my love (to Stephania, May 9)", es: "¡Feliz cumpleaños, amor!", ph: "feh-LEES koom-pleh-AH-nyohs, ah-MOHR", note: "Stephania's birthday is May 9, 1991." },
        { en: "How old are you turning?", es: "¿Cuántos años cumples?", ph: "KWAHN-tohs AH-nyohs KOOM-plehs" },
        { en: "I turned 35 today", es: "Cumplí 35 hoy", ph: "koom-PLEE TREHN-tah ee SEEN-koh OY" },
        { en: "Today is mom's birthday", es: "Hoy es el cumple de mamá", ph: "OY ehs ehl KOOM-pleh deh mah-MAH", note: "'Cumple' = casual short form of 'cumpleaños.'" },
        { en: "When's Belén's birthday?", es: "¿Cuándo es el cumple de Belén?", ph: "KWAHN-doh ehs ehl KOOM-pleh deh beh-LEHN" },
        { en: "I forgot it was your birthday, sorry", es: "Se me olvidó tu cumple, perdón", ph: "seh meh ohl-vee-DOH too KOOM-pleh, pehr-DOHN" },
        { en: "We need to get a gift", es: "Tenemos que comprar un regalo", ph: "teh-NEH-mohs keh kohm-PRAHR oon rreh-GAH-loh" },
        { en: "Should we throw a party?", es: "¿Hacemos una fiesta?", ph: "ah-SEH-mohs OO-nah fee-EHS-tah" },
        { en: "Let's bake a cake", es: "Hagamos una torta", ph: "ah-GAH-mohs OO-nah TOHR-tah", note: "In Peru 'torta' = cake. 'Pastel' is more for pies/savoury bakes." },
        { en: "Make a wish", es: "Pide un deseo", ph: "PEE-deh oon deh-SEH-oh" },
        { en: "Blow out the candles", es: "Sopla las velas", ph: "SOH-plah lahs VEH-lahs" },
        { en: "May all your wishes come true", es: "Que se cumplan todos tus deseos", ph: "keh seh KOOM-plahn TOH-dohs toos deh-SEH-ohs" },
        { en: "Many happy returns", es: "Que cumplas muchos más", ph: "keh KOOM-plahs MOO-chohs MAHS", note: "Lit. 'may you turn many more.' Standard birthday wish." },
        { en: "Gwen, happy birthday cousin!", es: "¡Feliz cumple, prima Gwen!", ph: "feh-LEES KOOM-pleh, PREE-mah GWEN", note: "Gwen (formerly Mathew) — Tía Giovanna's kid. 'Prima' = female cousin." },
        { en: "Happy birthday, Paz!", es: "¡Feliz cumple, sobri!", ph: "feh-LEES KOOM-pleh, soh-BREE", note: "'Sobri' = affectionate diminutive of sobrina (niece). Paz's birthday is Aug 15 — same day as Andrew & Tío Fred." },
        { en: "It's our anniversary today", es: "Hoy es nuestro aniversario", ph: "OY ehs NWEHS-troh ah-nee-vehr-SAH-ree-oh" },
        { en: "Today we remember Mamá Maruja", es: "Hoy recordamos a Mamá Maruja", ph: "OY rreh-kohr-DAH-mohs ah mah-MAH mah-ROO-hah", note: "Maruja's birthday — Dec 15. Saying her name keeps her present." },
      ]},

      { id: "carmen-family", title: "Aunt Carmen, Mario, Mario Jr, Alejandra", icon: "👨‍👩‍👧‍👦", phrases: [
        { en: "Hi Aunt Carmen", es: "Hola tía Carmen", ph: "OH-lah TEE-ah KAHR-mehn", note: "'Tía/Tío' (aunt/uncle) used warmly for older relatives." },
        { en: "Uncle Mario, great to see you", es: "Tío Mario, qué gusto verte", ph: "TEE-oh MAH-ree-oh, keh GOOS-toh VEHR-teh" },
        { en: "Hey cousin Mario", es: "Hola primo Mario", ph: "OH-lah PREE-moh MAH-ree-oh", note: "Mario Jr — Stephania's cousin. 'Primo' = male cousin." },
        { en: "Alejandra, you look great", es: "Alejandra, te ves muy bien", ph: "ah-leh-HAHN-drah, teh VEHS MWEE bee-EHN" },
        { en: "Thanks for having us over", es: "Gracias por recibirnos", ph: "GRAH-syahs pohr rreh-see-BEER-nohs" },
        { en: "What did you cook, tía?", es: "¿Qué cocinaste, tía?", ph: "keh koh-see-NAHS-teh, TEE-ah" },
        { en: "It's delicious, as always", es: "Está delicioso, como siempre", ph: "ehs-TAH deh-lee-SYOH-soh, KOH-moh see-EHM-preh" },
        { en: "How's work, Mario?", es: "¿Cómo va el trabajo, Mario?", ph: "KOH-moh VAH ehl trah-BAH-hoh, MAH-ree-oh" },
        { en: "Alejandra, how are your studies?", es: "Alejandra, ¿cómo van tus estudios?", ph: "ah-leh-HAHN-drah, KOH-moh VAHN toos ehs-TOO-dyohs" },
        { en: "Thanks for the invitation", es: "Gracias por la invitación", ph: "GRAH-syahs pohr lah een-vee-tah-SYOHN" },
        { en: "We need to do this more often", es: "Tenemos que hacer esto más seguido", ph: "teh-NEH-mohs keh ah-SEHR EHS-toh MAHS seh-GEE-doh" },
        { en: "Until next Sunday, tía", es: "Hasta el próximo domingo, tía", ph: "AHS-tah ehl PROHK-see-moh doh-MEEN-goh, TEE-ah" },
        { en: "Send Mario Jr our regards", es: "Saludos al primo Mario", ph: "sah-LOO-dohs ahl PREE-moh MAH-ree-oh" },
        { en: "Carmen, can I help with anything?", es: "Carmen, ¿en qué te ayudo?", ph: "KAHR-mehn, ehn keh teh ah-YOO-doh" },
      ]},

      { id: "abuelos-elders", title: "Abuelos & Elders (usted)", icon: "🕰️", phrases: [
        { en: "Bless me, abuelo", es: "Bendición, abuelo", ph: "behn-dee-SYOHN, ah-BWEH-loh", note: "Traditional Peruvian greeting to elders. Asks for their blessing — they reply 'Dios te bendiga.'" },
        { en: "Bless me, abuela", es: "Bendición, abuela", ph: "behn-dee-SYOHN, ah-BWEH-lah" },
        { en: "How are you feeling today, abuelo?", es: "¿Cómo se siente hoy, abuelo?", ph: "KOH-moh seh see-EHN-teh OY, ah-BWEH-loh" },
        { en: "How is your health?", es: "¿Cómo está su salud?", ph: "KOH-moh ehs-TAH soo sah-LOOD" },
        { en: "Have you taken your medicine?", es: "¿Ha tomado sus medicinas?", ph: "AH toh-MAH-doh soos meh-dee-SEE-nahs" },
        { en: "Can I help you with anything?", es: "¿Le ayudo con algo?", ph: "leh ah-YOO-doh kohn AHL-goh" },
        { en: "Would you like me to drive you?", es: "¿Quiere que lo lleve?", ph: "kee-EH-reh keh loh YEH-veh", note: "Lo lleve = drive him (formal masc). 'La lleve' for abuela." },
        { en: "Tell me a story, abuelo", es: "Cuénteme una historia, abuelo", ph: "KWEHN-teh-meh OO-nah ees-TOH-ryah, ah-BWEH-loh", note: "Cuénteme (usted) vs cuéntame (tú)." },
        { en: "I brought you a small gift", es: "Le traje un regalito", ph: "leh TRAH-heh oon rreh-gah-LEE-toh", note: "Diminutive 'regalito' softens — affectionate even in formal speech." },
        { en: "It's so good to see you", es: "Qué gusto verlo", ph: "keh GOOS-toh VEHR-loh", note: "Verlo (him) for abuelo · verla for abuela." },
        { en: "May God bless you", es: "Que Dios lo bendiga", ph: "keh dee-OHS loh behn-DEE-gah", note: "Standard farewell to elders." },
        { en: "I wish you the very best", es: "Le deseo lo mejor", ph: "leh deh-SEH-oh loh meh-HOHR" },
        { en: "Don't tire yourself out", es: "No se canse, abuelo", ph: "noh seh KAHN-seh, ah-BWEH-loh" },
        { en: "Thank you for everything you've done for the family", es: "Gracias por todo lo que ha hecho por la familia", ph: "GRAH-syahs pohr TOH-doh loh keh AH EH-choh pohr lah fah-MEE-lyah" },
        { en: "Take a seat, abuela", es: "Siéntese, abuela", ph: "see-EHN-teh-seh, ah-BWEH-lah", note: "Siéntese (usted) vs siéntate (tú)." },
        { en: "I'll come visit you soon", es: "Lo voy a visitar pronto", ph: "loh VOY ah vee-see-TAHR PROHN-toh" },
      ]},

      { id: "formality-switch", title: "Tú vs Usted — the switch", icon: "🔀", phrases: [
        { en: "Excuse me — should I use 'usted' or 'tú'?", es: "Disculpe, ¿le hablo de usted o de tú?", ph: "dees-KOOL-peh, leh AH-bloh deh oos-TEHD oh deh TOO", note: "The polite way to ask which register someone prefers." },
        { en: "Please, call me tú", es: "Por favor, tutéame", ph: "pohr fah-VOHR, too-TEH-ah-meh", note: "What you say when someone keeps calling you 'usted' and you want it casual." },
        { en: "Speak to me with tú", es: "Háblame de tú", ph: "AH-blah-meh deh TOO" },
        { en: "Don't call me 'usted' — say tú", es: "No me digas 'usted', dime tú", ph: "noh meh DEE-gahs oos-TEHD, DEE-meh TOO" },
        { en: "Would it bother you if I used tú?", es: "¿Le incomoda si la tuteo?", ph: "leh een-koh-MOH-dah see lah too-TEH-oh", note: "Asking permission to switch from usted to tú with a woman. Use 'lo tuteo' for a man." },
        { en: "Whichever you prefer", es: "Como prefiera", ph: "KOH-moh preh-fee-EH-rah" },
        { en: "Whatever makes you comfortable", es: "Como te sientas más cómodo", ph: "KOH-moh teh see-EHN-tahs MAHS KOH-moh-doh", note: "If they've already switched to tú with you." },
        { en: "Your trust honors me", es: "Tu confianza me honra", ph: "too kohn-fee-AHN-sah meh OHN-rah", note: "Said when they invite tú — gracious accept." },
        { en: "Sorry, force of habit", es: "Disculpa, es la costumbre", ph: "dees-KOOL-pah, ehs lah kohs-TOOM-breh", note: "Said when you slip back into usted by accident." },
        { en: "Old habits die hard", es: "Cuesta cambiar la costumbre", ph: "KWEHS-tah kahm-bee-AHR lah kohs-TOOM-breh" },
        { en: "I prefer to be respectful with elders", es: "Prefiero ser respetuoso con los mayores", ph: "preh-fee-EH-roh SEHR rrehs-peh-TWOH-soh kohn lohs mah-YOH-rehs", note: "Polite explanation if you want to keep using usted." },
      ]},

    ]
  },

  /* ════════════════════════════════════════════════════
     KIDS DEEP — Joaquín school + future, Emiliano bilingual
     ════════════════════════════════════════════════════ */
  kids: {
    title: "Kids Deep",
    icon: "🎒",
    sections: [

      { id: "joaquin-school", title: "Joaquín's School", icon: "📚", phrases: [
        { en: "How did the test go?", es: "¿Cómo te fue en el examen?", ph: "KOH-moh teh FWEH ehn ehl ehk-SAH-mehn" },
        { en: "What grade did you get?", es: "¿Qué nota sacaste?", ph: "keh NOH-tah sah-KAHS-teh", note: "Peru grades 0-20. 'Nota' = the mark; 'sacar nota' = to get a grade." },
        { en: "Show me your homework", es: "Muéstrame la tarea", ph: "MWEHS-trah-meh lah tah-REH-ah" },
        { en: "Did you study?", es: "¿Estudiaste?", ph: "ehs-too-dee-AHS-teh" },
        { en: "I need to meet your teacher", es: "Tengo que reunirme con tu profesor", ph: "TEHN-goh keh rreh-oo-NEER-meh kohn too proh-feh-SOHR" },
        { en: "Pack your backpack", es: "Arma tu mochila", ph: "AHR-mah too moh-CHEE-lah" },
        { en: "It's time for class", es: "Es hora de clase", ph: "ehs OH-rah deh KLAH-seh" },
        { en: "What did you learn today?", es: "¿Qué aprendiste hoy?", ph: "keh ah-prehn-DEES-teh OY" },
        { en: "Do you need help with that?", es: "¿Necesitas ayuda con eso?", ph: "neh-seh-SEE-tahs ah-YOO-dah kohn EH-soh" },
        { en: "Did you turn it in?", es: "¿Lo entregaste?", ph: "loh ehn-treh-GAHS-teh" },
        { en: "When's the parent meeting?", es: "¿Cuándo es la reunión de padres?", ph: "KWAHN-doh ehs lah rreh-oo-NYOHN deh PAH-drehs" },
        { en: "I'm proud of your effort", es: "Estoy orgulloso de tu esfuerzo", ph: "ehs-TOY ohr-goo-YOH-soh deh too ehs-FWEHR-soh" },
        { en: "How were your classmates today?", es: "¿Cómo estuvieron tus compañeros hoy?", ph: "KOH-moh ehs-too-vee-EH-rohn toos kohm-pah-NYEH-rohs OY" },
        { en: "Don't leave it for the last minute", es: "No lo dejes para último momento", ph: "noh loh DEH-hehs PAH-rah OOL-tee-moh moh-MEHN-toh" },
      ]},

      { id: "joaquin-future", title: "Joaquín's Future & University", icon: "🎓", phrases: [
        { en: "Have you thought about your career?", es: "¿Has pensado en tu carrera?", ph: "AHS pehn-SAH-doh ehn too kah-RREH-rah", note: "In LATAM 'carrera' = university degree/major, not a job-career." },
        { en: "Which university interests you?", es: "¿Qué universidad te interesa?", ph: "keh oo-nee-vehr-see-DAHD teh een-teh-REH-sah" },
        { en: "San Marcos or PUCP?", es: "¿San Marcos o la Católica?", ph: "sahn MAHR-kohs oh lah kah-TOH-lee-kah", note: "Peru's top two unis. PUCP is informally 'la Católica.'" },
        { en: "What do you want to study?", es: "¿Qué quieres estudiar?", ph: "keh kee-EH-rehs ehs-too-dee-AHR" },
        { en: "We'll support whatever you choose", es: "Te apoyaremos en lo que elijas", ph: "teh ah-poh-yah-REH-mohs ehn loh keh eh-LEE-hahs" },
        { en: "Let's look at scholarships", es: "Veamos becas", ph: "veh-AH-mohs BEH-kahs" },
        { en: "You still have time to decide", es: "Todavía tienes tiempo para decidir", ph: "toh-dah-VEE-ah tee-EH-nehs tee-EHM-poh PAH-rah deh-see-DEER" },
        { en: "What's your passion?", es: "¿Cuál es tu pasión?", ph: "KWAHL ehs too pah-SYOHN" },
        { en: "We can visit the campus", es: "Podemos visitar el campus", ph: "poh-DEH-mohs vee-see-TAHR ehl KAHM-poos" },
        { en: "Talk to the counselor", es: "Habla con el orientador", ph: "AH-blah kohn ehl oh-ree-ehn-tah-DOHR" },
        { en: "Don't stress too much", es: "No te estreses tanto", ph: "noh teh ehs-TREH-sehs TAHN-toh" },
        { en: "Whatever you decide, we're here", es: "Decidas lo que decidas, estamos contigo", ph: "deh-SEE-dahs loh keh deh-SEE-dahs, ehs-TAH-mohs kohn-TEE-goh" },
        { en: "Have you taken the admission exam?", es: "¿Diste el examen de admisión?", ph: "DEES-teh ehl ehk-SAH-mehn deh ahd-mee-SYOHN", note: "Peruvian unis have entrance exams ('examen de admisión')." },
        { en: "Your future is yours to build", es: "Tu futuro es tuyo para construir", ph: "too foo-TOO-roh ehs TOO-yoh PAH-rah kohn-stroo-EER" },
      ]},

      { id: "emiliano-english", title: "Teaching Emiliano English", icon: "🇬🇧", phrases: [
        { en: "Say 'apple', baby", es: "Di 'apple', bebé", ph: "DEE 'AH-pohl', beh-BEH", note: "Code-switching helps bilingual acquisition. Say English word clearly." },
        { en: "Look — a 'dog'", es: "Mira — un 'dog'", ph: "MEE-rah, oon DOG" },
        { en: "In English we say 'water'", es: "En inglés decimos 'water'", ph: "ehn een-GLEHS deh-SEE-mohs 'WAH-tehr'" },
        { en: "Repeat after daddy", es: "Repite después de papá", ph: "rreh-PEE-teh dehs-PWEHS deh pah-PAH" },
        { en: "Good job, baby!", es: "¡Muy bien, bebé!", ph: "MWEE bee-EHN, beh-BEH" },
        { en: "The cat says 'meow'", es: "El gato dice 'meow'", ph: "ehl GAH-toh DEE-seh 'mee-OW'" },
        { en: "Look! A 'butterfly'", es: "¡Mira! Una 'butterfly'", ph: "MEE-rah, OO-nah BUH-tehr-fly" },
        { en: "One, two, three", es: "Uno, dos, tres — one, two, three", ph: "OO-noh, DOHS, TREHS — wun, too, three" },
        { en: "That's mommy. Mommy.", es: "Esa es mamá. Mommy.", ph: "EH-sah ehs mah-MAH. MAH-mee", note: "Teach both labels for the same person." },
        { en: "Show me your hands", es: "Muéstrame tus 'hands'", ph: "MWEHS-trah-meh toos HANDS" },
        { en: "Are you sleepy, baby?", es: "¿Tienes sueño, baby?", ph: "tee-EH-nehs SWEH-nyoh, BAY-bee" },
        { en: "I love you so much, baby", es: "Te amo mucho, baby", ph: "teh AH-moh MOO-choh, BAY-bee" },
        { en: "Where's your nose?", es: "¿Dónde está tu 'nose'?", ph: "DOHN-deh ehs-TAH too NOHZ" },
        { en: "Yes, that's right!", es: "¡Sí, así es! Yes!", ph: "SEE, ah-SEE EHS. YEHS" },
      ]},

      { id: "emiliano-spanish", title: "Teaching Emiliano Spanish", icon: "🇪🇸", phrases: [
        { en: "Look at the little dog", es: "Mira al perrito", ph: "MEE-rah ahl peh-RREE-toh", note: "'-ito' diminutive — softer and warmer for babies." },
        { en: "That's a flower", es: "Eso es una flor", ph: "EH-soh ehs OO-nah FLOHR" },
        { en: "Where's mommy?", es: "¿Dónde está mamá?", ph: "DOHN-deh ehs-TAH mah-MAH" },
        { en: "Wave bye-bye", es: "Di chau con la manito", ph: "DEE CHOW kohn lah mah-NEE-toh", note: "'Chau' = bye in LATAM. 'Manito' = little hand." },
        { en: "Give kisses", es: "Da besitos", ph: "DAH beh-SEE-tohs" },
        { en: "What sound is that?", es: "¿Qué sonido es ese?", ph: "keh soh-NEE-doh ehs EH-seh" },
        { en: "Touch it gently", es: "Tócalo despacito", ph: "TOH-kah-loh dehs-pah-SEE-toh" },
        { en: "Look up there", es: "Mira arriba", ph: "MEE-rah ah-RREE-bah" },
        { en: "We're going for a walk", es: "Vamos a pasear", ph: "VAH-mohs ah pah-seh-AHR" },
        { en: "Smell the flower", es: "Huele la flor", ph: "WEH-leh lah FLOHR" },
        { en: "Your little hands are dirty", es: "Tienes las manitos sucias", ph: "tee-EH-nehs lahs mah-NEE-tohs SOO-syahs" },
        { en: "Time to clean up", es: "Hora de ordenar", ph: "OH-rah deh ohr-deh-NAHR" },
        { en: "Daddy's here", es: "Papá está aquí", ph: "pah-PAH ehs-TAH ah-KEE" },
        { en: "Open your little mouth", es: "Abre la boquita", ph: "AH-breh lah boh-KEE-tah", note: "'Boquita' = little mouth — feeding time." },
        { en: "Where are your little feet?", es: "¿Dónde están los piecitos?", ph: "DOHN-deh ehs-TAHN lohs pee-eh-SEE-tohs" },
      ]},

    ]
  },

  /* ════════════════════════════════════════════════════
     MY PHRASES — populated by user via custom recorder
     ════════════════════════════════════════════════════ */
  custom: {
    title: "My Phrases",
    icon: "✨",
    sections: [
      { id: "mine", title: "Saved by Me", icon: "📝", phrases: [] }
    ]
  },

};

/* ════════════════════════════════════════════════════
   MINI-DIALOGUES — short realistic conversations
   ════════════════════════════════════════════════════ */
const DIALOGUES = {

  daily: [
    {
      title: "Morning with Stephania",
      icon: "☀️",
      lines: [
        { who: "You", es: "Buenos días, mi amor. ¿Dormiste bien?", ph: "BWEH-nohs DEE-ahs, mee ah-MOHR. dohr-MEES-teh bee-EHN", en: "Good morning, my love. Did you sleep well?" },
        { who: "Stephania", es: "Más o menos. El bebé despertó dos veces.", ph: "MAHS oh MEH-nohs. ehl beh-BEH dehs-pehr-TOH DOHS VEH-sehs", en: "So-so. The baby woke up twice." },
        { who: "You", es: "Lo siento. Yo me levanto con él hoy.", ph: "loh see-EHN-toh. yoh meh leh-VAHN-toh kohn EHL oy", en: "I'm sorry. I'll get up with him today." },
        { who: "Stephania", es: "Gracias, amor. Te quiero.", ph: "GRAH-syahs, ah-MOHR. teh kee-EH-roh", en: "Thank you, love. I love you." },
      ]
    },
    {
      title: "Taxi to the office",
      icon: "🚖",
      lines: [
        { who: "You", es: "Buenas, ¿cuánto a Miraflores?", ph: "BWEH-nahs, KWAHN-toh ah mee-rah-FLOH-rehs", en: "Hi, how much to Miraflores?" },
        { who: "Driver", es: "Veinticinco soles.", ph: "veyn-tee-SEEN-koh SOH-lehs", en: "Twenty-five soles." },
        { who: "You", es: "Le doy veinte.", ph: "leh DOY VEYN-teh", en: "I'll give you twenty." },
        { who: "Driver", es: "Ya, suba.", ph: "yah, SOO-bah", en: "Okay, get in." },
        { who: "You", es: "Por Javier Prado, por favor. Tengo prisa.", ph: "pohr hah-vee-EHR PRAH-doh, pohr fah-VOHR. TEHN-goh PREE-sah", en: "Via Javier Prado, please. I'm in a hurry." },
      ]
    },
    {
      title: "Bedtime with Emiliano",
      icon: "🌙",
      lines: [
        { who: "You", es: "Ven, chiquito. Es hora de dormir.", ph: "vehn, chee-KEE-toh. ehs OH-rah deh dohr-MEER", en: "Come, little one. Time for bed." },
        { who: "You", es: "¿Quieres un cuento corto?", ph: "kee-EH-rehs oon KWEHN-toh KOHR-toh", en: "Want a short story?" },
        { who: "You", es: "Cierra los ojitos. Papá está aquí.", ph: "see-EH-rrah lohs oh-HEE-tohs. pah-PAH ehs-TAH ah-KEE", en: "Close your little eyes. Papa is here." },
        { who: "You", es: "Que sueñes con los angelitos.", ph: "keh SWEH-nyehs kohn lohs ahn-heh-LEE-tohs", en: "Sweet dreams (with little angels)." },
      ]
    },
    {
      title: "Joaquín after school",
      icon: "🎒",
      lines: [
        { who: "You", es: "Hola, Joaquín. ¿Cómo te fue?", ph: "OH-lah, hwah-KEEN. KOH-moh teh FWEH", en: "Hi Joaquín. How did it go?" },
        { who: "Joaquín", es: "Bien. Tuve examen de mate.", ph: "bee-EHN. TOO-veh ehk-SAH-mehn deh MAH-teh", en: "Good. I had a math test." },
        { who: "You", es: "¿Cómo te salió?", ph: "KOH-moh teh sah-LYOH", en: "How did it go for you?" },
        { who: "Joaquín", es: "Más o menos. Después te cuento.", ph: "MAHS oh MEH-nohs. dehs-PWEHS teh KWEHN-toh", en: "So-so. I'll tell you later." },
        { who: "You", es: "Tranquilo. Estoy orgulloso de ti.", ph: "trahn-KEE-loh. ehs-TOY ohr-goo-YOH-soh deh TEE", en: "It's okay. I'm proud of you." },
      ]
    },
  ],

  personal: [
    {
      title: "Asking for help",
      icon: "🆘",
      lines: [
        { who: "You", es: "Disculpe, ¿me podría ayudar?", ph: "dees-KOOL-peh, meh poh-DREE-ah ah-yoo-DAHR", en: "Excuse me, could you help me?" },
        { who: "You", es: "Estoy aprendiendo español.", ph: "ehs-TOY ah-prehn-dee-EHN-doh ehs-pah-NYOHL", en: "I'm learning Spanish." },
        { who: "You", es: "¿Puede hablar más despacio, por favor?", ph: "PWEH-deh ah-BLAHR MAHS dehs-PAH-syoh, pohr fah-VOHR", en: "Could you speak more slowly, please?" },
        { who: "Person", es: "Claro, sin problema.", ph: "KLAH-roh, seen proh-BLEH-mah", en: "Of course, no problem." },
      ]
    },
    {
      title: "At the pharmacy",
      icon: "💊",
      lines: [
        { who: "You", es: "Buenos días. El bebé tiene fiebre.", ph: "BWEH-nohs DEE-ahs. ehl beh-BEH tee-EH-neh fee-EH-breh", en: "Good morning. The baby has a fever." },
        { who: "Pharmacist", es: "¿Qué edad tiene?", ph: "keh eh-DAHD tee-EH-neh", en: "How old is he?" },
        { who: "You", es: "Tiene quince meses.", ph: "tee-EH-neh KEEN-seh MEH-sehs", en: "He's fifteen months old." },
        { who: "Pharmacist", es: "Le doy paracetamol pediátrico.", ph: "leh DOY pah-rah-seh-tah-MOHL peh-dee-AH-tree-koh", en: "I'll give you pediatric paracetamol." },
        { who: "You", es: "Perfecto. ¿Cuánto es?", ph: "pehr-FEHK-toh. KWAHN-toh EHS", en: "Perfect. How much?" },
      ]
    },
  ],

  work: [
    {
      title: "Pitching the studio",
      icon: "💼",
      lines: [
        { who: "You", es: "Soy Stu, dirijo Rainey Laguna Studios.", ph: "soy STOO, dee-REE-hoh RAY-nee lah-GOO-nah ehs-TOO-dyohs", en: "I'm Stu, I run Rainey Laguna Studios." },
        { who: "You", es: "Hacemos software para industrias reguladas.", ph: "ah-SEH-mohs SOFT-wahr PAH-rah een-DOOS-tryahs rreh-goo-LAH-dahs", en: "We build software for regulated industries." },
        { who: "Client", es: "¿Y a qué se dedican exactamente?", ph: "ee ah keh seh deh-DEE-kahn ehk-sahk-tah-MEHN-teh", en: "And what exactly do you do?" },
        { who: "You", es: "Datacendia es nuestra plataforma de gobernanza de IA.", ph: "dah-tah-SEHN-dyah ehs NWEHS-trah plah-tah-FOHR-mah deh goh-behr-NAHN-sah deh EE-ah", en: "Datacendia is our AI governance platform." },
        { who: "Client", es: "Interesante. Cuéntame más.", ph: "een-teh-reh-SAHN-teh. KWEHN-tah-meh MAHS", en: "Interesting. Tell me more." },
      ]
    },
    {
      title: "Closing a meeting",
      icon: "🤝",
      lines: [
        { who: "You", es: "Gracias por su tiempo hoy.", ph: "GRAH-syahs pohr soo tee-EHM-poh oy", en: "Thanks for your time today." },
        { who: "You", es: "Les envío la propuesta esta semana.", ph: "lehs ehn-VEE-oh lah proh-PWEHS-tah EHS-tah seh-MAH-nah", en: "I'll send the proposal this week." },
        { who: "Client", es: "Perfecto. Quedamos atentos.", ph: "pehr-FEHK-toh. keh-DAH-mohs ah-TEHN-tohs", en: "Perfect. We'll be looking out for it." },
        { who: "You", es: "Cualquier duda, me escriben. Que tengan buen día.", ph: "kwahl-kee-EHR DOO-dah, meh ehs-KREE-behn. keh TEHN-gahn bwehn DEE-ah", en: "Any questions, write me. Have a good day." },
      ]
    },
  ],

};
