/**
 * Global, multilingual workplace rants (named companies) + human-sounding comments.
 * Used by both the bots and the seed so the platform reads like a real, worldwide,
 * emotional venting community rather than a template generator.
 *
 * Tone note: comments are intentionally salty/sarcastic/frustrated (this is a venting
 * platform). Profanity is CENSORED with asterisks; no slurs or hate toward protected
 * groups. Categories match the CaseCategory enum in schema.prisma.
 */

export const MULTILINGUAL_WORKPLACE_TEMPLATES = [
  {
    category: 'JOB_SECURITY',
    templates: [
      { title: 'Infosys ने bench पर डाल दिया, ab resign करने को बोल रहे | Infosys benched me, now pushing me to resign', description: 'Maine Infosys join kiya tha campus se. 5 mahine se bench pe hoon, koi project nahi. Ab manager bol raha "voluntarily resign kar do warna performance issue lag jayega." Notice period ka paisa bhi clear nahi. Kya main legal jaa sakta hoon ya chup chaap nikal jaun?\n\nI joined Infosys from campus. Benched 5 months, no project. Now my manager says resign voluntarily or they\'ll log a performance issue. Should I fight this or just leave?' },
      { title: 'Amazon PIP\'d me 3 weeks after my manager changed', description: 'New manager inherits the team, and within 3 weeks I\'m on a PIP at Amazon with goals that are mathematically impossible to hit in 30 days. Everyone knows PIP = soft layoff here. Do I lawyer up, take the severance, or try to "pass" a rigged test?' },
    ],
  },
  {
    category: 'WORK_LIFE_BALANCE',
    templates: [
      { title: '楽天で毎晩終電、上司は「気合い」と言う | Last train every night at Rakuten, boss says "just push harder"', description: '楽天で働いています。毎晩終電、土曜も出社。残業代はみなし。体調を崩しても上司は「気合いが足りない」と言うだけ。これは普通ですか？辞めるべき？\n\nI work at Rakuten. Last train home every night, Saturdays too, overtime is "deemed" (unpaid). When I got sick my boss just said I lack spirit. Is this normal? Should I quit?' },
      { title: 'TCS expects 9.5 hours "logged" in office or HR calls you', description: 'TCS rolled out a rule: less than 9.5 hours badged in the building and HR emails you a warning. People literally sit doing nothing to hit the number. Productivity theatre at its finest. AITA for refusing to pad my hours?' },
    ],
  },
  {
    category: 'BAD_BOSS',
    templates: [
      { title: '¿Renuncio? Mi jefe en Accenture me llama en vacaciones | Should I quit? My Accenture boss calls me on vacation', description: 'Trabajo en Accenture. Pedí vacaciones aprobadas con meses de anticipación. Primer día y mi jefe me llama 3 veces por algo "urgente" que no lo era. Le contesté. Me odio por contestar. ¿Pongo límites o me busco otra cosa?\n\nI work at Accenture. Approved vacation, and day one my boss calls 3 times over fake "urgent" stuff. I answered. I hate that I answered.' },
      { title: 'Mein Chef bei SAP nimmt sich die Lorbeeren für meine Arbeit | My SAP boss takes credit for my work', description: 'Ich baue die Lösung, mein Chef bei SAP präsentiert sie dem Vorstand als seine. Im Vieraugengespräch sagt er, das sei "Teamarbeit". Dreimal jetzt. Eskalieren oder Schnauze halten?\n\nI build it, my SAP boss presents it to leadership as his own, calls it "teamwork" in private. Third time. Escalate or stay quiet?' },
    ],
  },
  {
    category: 'PAY_AND_PROMOTION',
    templates: [
      { title: 'Cognizant gave me a 4% raise after a 9/10 rating', description: 'Top rating, two extra projects, trained two juniors. Cognizant\'s "merit" increase: 4%. Inflation ate it before it hit my account. Meanwhile a new hire negotiated 20% above me. Loyalty tax is real. Do I just leave?' },
      { title: 'Na Stone, descobri que o júnior ganha mais que eu | At Stone, I found the junior earns more than me', description: 'Trabalho há 3 anos na Stone. Uma planilha vazou e o cara que entrou ano passado ganha 15% a mais que eu, com menos responsabilidade. Falo com meu gestor com a prova na mão ou começo a procurar emprego calado?\n\n3 years at Stone. A leaked sheet shows last year\'s hire earns 15% more than me with less scope. Confront my manager or quietly job hunt?' },
    ],
  },
  {
    category: 'RETURN_TO_OFFICE',
    templates: [
      { title: 'Dell RTO: 90-minute commute to sit on Zoom all day', description: 'Dell ended remote. My whole team is in other states. I drive 90 minutes each way to take the exact same video calls in a noisier room while fighting for a desk. How is this "collaboration"? Am I wrong to push back hard?' },
      { title: 'Foxconn 廠區宿舍規定越來越離譜 | Foxconn dorm rules are getting absurd', description: '在 Foxconn 上班，宿舍門禁、加班強制、請假要三層簽核。說好的彈性呢？我是不是該換工作了？\n\nWorking at Foxconn — dorm curfews, forced overtime, three layers of sign-off just to take leave. So much for flexibility. Should I be looking for a new job?' },
    ],
  },
  {
    category: 'HR_ISSUES',
    templates: [
      { title: 'HR ng Globe Telecom, ginawa akong problema | Globe Telecom HR made ME the problem', description: 'Nag-file ako ng complaint sa HR ng Globe tungkol sa manager ko. Dalawang linggo after, ako yung nasa "coaching session" kasi daw "negative" ako. HR talaga, para sa kompanya, hindi para sa\'yo. Ano gagawin ko?\n\nI filed an HR complaint at Globe Telecom about my manager. Two weeks later I\'m the one in a "coaching session" for being "negative." HR is for the company, not you. What do I do?' },
      { title: 'Deloitte HR scheduled my "confidential" complaint with my manager in the room', description: 'I raised something about my manager to Deloitte HR. They set up a "resolution meeting" and invited the manager. So much for confidential. I\'ve lost all trust. What are my actual options here?' },
    ],
  },
  {
    category: 'TOXIC_MANAGEMENT',
    templates: [
      { title: 'Wipro manager calls people out by name in the team group', description: 'My Wipro manager posts public call-outs in the team WhatsApp — names, mistakes, the lot. Morale is dead. HR says "give your manager direct feedback." How, when the manager IS the problem? Do I go to skip-level?' },
      { title: 'Mon manager chez Capgemini lit nos messages Teams | My Capgemini manager reads our Teams DMs', description: 'Mon manager chez Capgemini surveille nos statuts Teams et lit par-dessus l\'épaule. Si tu es "away" 5 minutes, t\'as un message. C\'est du flicage. Je dis quelque chose ou je cherche ailleurs ?\n\nMy Capgemini manager monitors our Teams status and reads over shoulders. 5 minutes "away" and you get pinged. It\'s surveillance. Speak up or look elsewhere?' },
    ],
  },
  {
    category: 'COWORKER_DRAMA',
    templates: [
      { title: 'Samsung 팀 동료가 내 아이디어를 회의에서 가로챘다 | A Samsung teammate stole my idea in the meeting', description: '삼성에서 일하는데, 옆자리 동료가 내가 말한 아이디어를 회의에서 자기 것처럼 발표했어요. 이번이 세 번째예요. 매니저한테 말해야 할까요, 아니면 제가 예민한 걸까요?\n\nI work at Samsung. The teammate next to me presented my idea in the meeting as his own. Third time now. Tell the manager or am I overreacting?' },
      { title: 'Coworker at PwC keeps booking the only quiet room "for the day"', description: 'One quiet room on the floor. The same PwC colleague books it 9-to-6 every day "for focus" and takes calls on speaker in it anyway. The rest of us get the noisy bullpen. Petty to report the room-hogging, or fair?' },
    ],
  },
  {
    category: 'WORK_CULTURE',
    templates: [
      { title: 'Startup mein "we are a family" bola, overtime pucha toh "business" ho gaya', description: 'Ek startup join kiya. Onboarding mein 10 baar bola "we are a family." Jaise hi maine overtime pay pucha, suddenly "yeh toh business hai, expectations samajho." Family ka drama sirf kaam nikalwane ke liye tha. Main galat hoon kya boundaries maangke?\n\nJoined a startup that said "we\'re a family" 10 times in onboarding. The moment I asked about overtime pay it became "this is business." Am I wrong for wanting boundaries?' },
      { title: 'Il mio CEO ha mandato una mail "lavorate di più" dalla sua terza casa al mare | My CEO emailed "work harder" from his third beach house', description: 'Il CEO ha mandato una mail a tutta l\'azienda su "fame" e "sacrificio", firmata da quella che è chiaramente una villa al mare. Il morale è a terra. Ho ragione a essere incavolato?\n\nThe CEO emailed the whole company about "hunger" and "sacrifice," signed off from what is visibly a beachfront villa. Morale tanked. Am I right to be annoyed?' },
    ],
  },
  {
    category: 'OFFICE_POLITICS',
    templates: [
      { title: 'Di Gojek, yang paling berisik di meeting yang dapat promosi | At Gojek, the loudest in meetings gets promoted', description: 'Di kantor (Gojek) yang penting itu "visibility". Yang paling banyak ngomong di meeting dianggap top performer; kami yang benar-benar ngerjain malah dilewat pas promosi. Aku belajar main politik atau cari tempat yang hargai hasil kerja?\n\nAt my office (Gojek), visibility is everything. Whoever talks most is the "top performer"; those of us who actually ship get skipped at promotion. Learn the game or leave?' },
      { title: 'Excluded from the meeting where my own project was decided (Oracle)', description: 'A "small group" at Oracle met about the project I lead and made the calls without me, then forwarded the notes. Third time this quarter. Am I being pushed out or am I paranoid?' },
    ],
  },
];

// Human-sounding comments: frustrated, sarcastic, jokey, harsh, multilingual.
// Profanity is censored; no slurs / no hate toward protected groups.
export const HUMAN_COMMENTS = [
  // frustration / venting
  'absolutely not. that is unhinged behaviour and you know it.',
  'my blood pressure went up just reading this 😤',
  'this is the kind of thing that makes me wanna walk into the sea',
  'i would\'ve lost it. genuinely how are you this calm',
  'reading this physically hurt me. RUN.',
  // sarcasm
  'oh how GENEROUS of them 🙃 a whole 4% in this economy, buy yourself a coffee',
  'wow what a benevolent overlord, truly we are not worthy 👏👏',
  'ah yes, "we\'re a family" — the corporate love-bomb special 💀',
  'sure because YOUR weekend means nothing right',
  'cool cool cool so HR is just decorative then',
  // jokes
  'sir this is a Wendy\'s 😭 (but also your boss is the worst)',
  'plot twist: the real PIP was the friends we made along the way',
  'tell them you identify as "unavailable after 6pm" 🧍',
  'name a more iconic duo than your manager and zero self-awareness. i\'ll wait',
  'HR really said "thoughts and prayers" and logged off huh',
  // harsh / censored profanity
  'that is straight up bull**it, document everything and lawyer up.',
  'f**k that job honestly. life is too short for this clown show 🤡',
  'your boss sounds like a complete a**clown, no notes.',
  'what a sh*tshow. start applying TODAY, not tomorrow.',
  'nah this is some weapons-grade nonsense. get out.',
  'they\'re taking you for a ride and you\'re holding the door open. STOP.',
  // tough love
  'respectfully you\'re being a doormat. learn the word "no".',
  'grow a spine, send the email, cc their boss. you got this.',
  'stop answering after hours. they will adapt. they always do.',
  'the fastest raise is a new offer. go get your market number.',
  'document. everything. dates, screenshots, emails. you\'ll thank yourself.',
  // empathy
  'been there, cried in the office bathroom too. you\'re not crazy.',
  'sending you strength, this one is genuinely rough 🫂',
  'you are NOT overreacting. anyone saying otherwise has never had a boss like this.',
  // multilingual
  'Bhai resign maar de, itni beizzati ki kya zarurat 😤',
  'Yeh toh sasta drama hai, HR bas company ka bodyguard hai 🙄',
  'Renuncia YA, eso no se aguanta 🚩',
  'それはブラック企業。逃げて、今すぐ。',  // That's a black company. Escape, right now.
  'C\'est du harcèlement déguisé. Garde toutes les preuves.',  // disguised harassment, keep evidence
  'Isso é assédio moral, viu? Procura o RH... ah espera, o RH é o problema 😅',
  'Sige, mag-resign ka na. Hindi ka utang na loob sa kanila.',
  '画面の前で本気で腹立った。あなたは正しい。',  // genuinely angry reading this. you're right.
  'Das ist Mobbing. Dokumentiere alles, jede Mail.',
  // reactions
  'NTA. they\'re the clown and the whole circus 🤡',
  'YTA but only a little, you let it slide too long tbh',
  'the audacity. the AUDACITY. i\'m so mad for you',
  'lmaooo HR said WHAT 💀 screenshot or it didn\'t happen',
  'this gave me the ick on your behalf. block, leave, breathe.',
];
