import { defaultLocale, normalizeLocale, type LocaleCode } from "./locales";

export const forbiddenPublicTerms = ["ai", "chatbot", "productivity", "automation", "options", "boost", "hack"] as const;

export const redirectedPublicPaths = [
  "/analytics",
  "/book",
  "/booking",
  "/bookings",
  "/case-studies",
  "/dashboard",
  "/enterprise",
  "/ethics",
  "/forgot-password",
  "/integrations",
  "/lexicons",
  "/login",
  "/memberships",
  "/orchestrator",
  "/premium",
  "/professionals",
  "/rescue",
  "/session",
  "/sign-in",
  "/sign-up",
  "/signup",
  "/solutions",
  "/subconscious",
  "/tasks",
  "/tools",
] as const;

export type IntakeSource = "manual" | "gmail" | "calendar" | "extension";
export type RecommendedActionKind = "reply" | "schedule" | "resolve" | "escalate";
export type RiskLevel = "low" | "medium" | "high";

export type IntakeRequest = {
  input: string;
  source: IntakeSource;
  locale?: LocaleCode;
  userId?: string;
};

export type DecisionResponse = {
  locale: LocaleCode;
  synthesis: string;
  mindRead: {
    reallyAbout: string;
    mindsetProtection: string;
    calmerMove: string;
  };
  recommendedAction: {
    kind: RecommendedActionKind;
    label: string;
    payload: Record<string, string | number | boolean | null>;
  };
  risk: {
    level: RiskLevel;
    reason: string;
  };
  memoryUpdate: {
    applied: boolean;
    summary: string;
  };
  receipt: {
    id: string;
    timestamp: string;
    source: IntakeSource;
    actionKind: RecommendedActionKind;
    riskLevel: RiskLevel;
    confidence: number;
    playbookVersion: string;
    locale: LocaleCode;
    inputHash: string;
    rawContentRedacted: boolean;
  };
};

const highRiskTerms = [
  "threat",
  "force",
  "blackmail",
  "harass",
  "illegal",
  "lawsuit",
  "regulator",
  "заплаха",
  "незакон",
  "иск",
  "регулатор",
  "chantaje",
  "illégal",
  "klage",
  "ilegal",
  "تهديد",
  "कानूनी",
  "訴訟",
  "违法",
  "погроза",
];
const mediumRiskTerms = [
  "complaint",
  "refund",
  "termination",
  "medical",
  "legal",
  "fire",
  "жалба",
  "възстановяване",
  "договор",
  "правен",
  "queja",
  "plainte",
  "beschwerde",
  "reclamação",
  "شكوى",
  "शिकायत",
  "苦情",
  "投诉",
  "скарга",
];
const playbookVersion = "mragent-mindread-v1";

const localized = {
  en: {
    noInput: "No usable input was provided.",
    risk: {
      high: "The pressure could push a move that deserves review before it leaves your hands.",
      medium: "The situation is sensitive enough to need slower language and firmer edges.",
      low: "No blocking risk detected; this can move with care.",
    },
    memory: "Memory note held until you approve it; raw text stays out of the receipt.",
    synthesis: {
      escalate: "This is not a wording problem yet; it is a restraint problem, and restraint is the wiser move.",
      reply: "The visible question is wording, but the real pressure is trust, timing, and not sounding smaller than you are.",
      schedule: "The feeling wants an answer now, but the steadier move is to give it a clean place in time.",
      resolve: "This is complete enough to be named, recorded, and released from your attention.",
    },
    mind: {
      escalate: ["This is about stopping pressure from borrowing your voice.", "Your mind wants command quickly; review is the cleaner command.", "Hold the response and return with a cleaner signal."],
      reply: ["This is about keeping warmth and authority in the same room.", "You are protecting the relationship and your position.", "Answer softly, keep the boundary visible, and name the next step."],
      schedule: ["This needs rhythm, not more rumination.", "Your attention is trying to keep the matter alive so nothing slips.", "Give it one follow-up moment, then release it."],
      resolve: ["This is asking to be closed, not enlarged.", "You are seeking certainty that is already sufficient.", "Name the decision, keep the receipt, and let it rest."],
    },
    actions: {
      reply: ["Send the warm clear reply", "Thank you for being direct. I understand the concern. The clean next step is to keep the decision point clear, protect the relationship, and agree the timing without turning this into more pressure."],
      schedule: ["Set one quiet follow-up", "MindReply follow-up"],
      escalate: ["Hold it for review", ""],
      resolve: ["Mark it resolved", ""],
    },
  },
  es: {
    noInput: "No se proporcionó una entrada utilizable.",
    risk: { high: "La presión puede empujar una acción que merece revisión antes de salir.", medium: "La situación requiere lenguaje más lento y límites más firmes.", low: "No se detecta un riesgo bloqueante; puede avanzar con cuidado." },
    memory: "La nota de memoria queda retenida hasta tu aprobación; el texto privado queda fuera del recibo.",
    synthesis: { escalate: "Esto todavía no es un problema de redacción; es un problema de contención.", reply: "La pregunta visible es el tono, pero la presión real es confianza, tiempo y autoridad.", schedule: "La respuesta no necesita prisa; necesita un lugar claro en el tiempo.", resolve: "Esto está listo para nombrarse, registrarse y salir de tu atención." },
    mind: { escalate: ["Se trata de impedir que la presión use tu voz.", "La urgencia busca control; la revisión da mejor control.", "Detén la respuesta y vuelve con una señal más limpia."], reply: ["Se trata de sostener calidez y autoridad juntas.", "Proteges la relación y tu posición.", "Responde con calma, deja visible el límite y nombra el siguiente paso."], schedule: ["Esto necesita ritmo, no más vueltas.", "Tu atención intenta evitar que algo se pierda.", "Dale un momento de seguimiento y suéltalo."], resolve: ["Esto pide cierre, no expansión.", "La certeza suficiente ya está presente.", "Nombra la decisión, guarda el recibo y descansa."] },
    actions: { reply: ["Enviar la respuesta clara y cálida", "Gracias por ser directo. Entiendo la preocupación. El siguiente paso limpio es mantener claro el punto de decisión, proteger la relación y acordar el momento sin añadir presión."], schedule: ["Fijar un seguimiento discreto", "Seguimiento MindReply"], escalate: ["Retener para revisión", ""], resolve: ["Marcar como resuelto", ""] },
  },
  fr: {
    noInput: "Aucune entrée exploitable n’a été fournie.",
    risk: { high: "La pression peut pousser une action qui mérite une revue avant envoi.", medium: "La situation demande un langage plus lent et des limites plus nettes.", low: "Aucun risque bloquant détecté; cela peut avancer avec soin." },
    memory: "La note mémoire reste en attente de votre accord; le texte privé reste hors du reçu.",
    synthesis: { escalate: "Ce n’est pas encore un problème de formulation; c’est un problème de retenue.", reply: "La question visible est la formulation, mais la pression réelle touche la confiance, le timing et l’autorité.", schedule: "La réponse ne demande pas de vitesse; elle demande une place claire dans le temps.", resolve: "C’est assez clair pour être nommé, enregistré et relâché." },
    mind: { escalate: ["Il s’agit d’empêcher la pression d’emprunter votre voix.", "L’urgence cherche le contrôle; la revue donne un meilleur contrôle.", "Retenez la réponse et revenez avec un signal plus propre."], reply: ["Il faut garder chaleur et autorité ensemble.", "Vous protégez la relation et votre position.", "Répondez calmement, gardez la limite visible et nommez la suite."], schedule: ["Cela demande du rythme, pas plus de rumination.", "Votre attention veut éviter qu’un point se perde.", "Donnez-lui un moment de suivi, puis relâchez."], resolve: ["Cela demande une clôture, pas une expansion.", "La certitude suffisante est déjà là.", "Nommez la décision, gardez le reçu et laissez reposer."] },
    actions: { reply: ["Envoyer la réponse claire et chaleureuse", "Merci pour votre franchise. Je comprends le point. La prochaine étape est de garder la décision claire, protéger la relation et fixer le bon moment sans ajouter de pression."], schedule: ["Définir un suivi discret", "Suivi MindReply"], escalate: ["Garder pour revue", ""], resolve: ["Marquer comme résolu", ""] },
  },
  de: {
    noInput: "Es wurde keine verwertbare Eingabe bereitgestellt.",
    risk: { high: "Der Druck könnte zu einem Schritt führen, der vor dem Senden geprüft werden sollte.", medium: "Die Situation braucht langsamere Sprache und klarere Kanten.", low: "Kein blockierendes Risiko erkannt; das kann vorsichtig weitergehen." },
    memory: "Die Notiz bleibt bis zur Freigabe zurückgehalten; Rohtext bleibt aus dem Beleg.",
    synthesis: { escalate: "Das ist noch kein Formulierungsproblem; es ist ein Problem der Zurückhaltung.", reply: "Sichtbar geht es um Worte, tatsächlich um Vertrauen, Timing und Autorität.", schedule: "Das braucht keine schnelle Antwort, sondern einen klaren Zeitpunkt.", resolve: "Das ist klar genug, um benannt, erfasst und losgelassen zu werden." },
    mind: { escalate: ["Es geht darum, Druck nicht Ihre Stimme leihen zu lassen.", "Dringlichkeit will Kontrolle; Prüfung ist die bessere Kontrolle.", "Halten Sie die Antwort zurück und kommen Sie sauberer zurück."], reply: ["Wärme und Autorität müssen zusammenbleiben.", "Sie schützen Beziehung und Position.", "Antworten Sie ruhig, halten Sie die Grenze sichtbar und nennen Sie den nächsten Schritt."], schedule: ["Das braucht Rhythmus, nicht mehr Grübeln.", "Ihre Aufmerksamkeit will verhindern, dass etwas entgleitet.", "Setzen Sie einen Folgetermin und lassen Sie es los."], resolve: ["Das will Abschluss, nicht Erweiterung.", "Genügend Sicherheit ist bereits da.", "Entscheidung benennen, Beleg behalten, ruhen lassen."] },
    actions: { reply: ["Die warme klare Antwort senden", "Danke für die direkte Rückmeldung. Ich verstehe den Punkt. Der klare nächste Schritt ist, den Entscheidungspunkt sichtbar zu halten, die Beziehung zu schützen und den Zeitpunkt ohne zusätzlichen Druck abzustimmen."], schedule: ["Eine ruhige Nachverfolgung setzen", "MindReply-Nachverfolgung"], escalate: ["Zur Prüfung halten", ""], resolve: ["Als erledigt markieren", ""] },
  },
  pt: {
    noInput: "Nenhuma entrada utilizável foi fornecida.",
    risk: { high: "A pressão pode empurrar uma ação que merece revisão antes de sair.", medium: "A situação pede linguagem mais lenta e limites mais firmes.", low: "Nenhum risco bloqueante detectado; pode avançar com cuidado." },
    memory: "A nota de memória fica retida até aprovação; o texto privado fica fora do recibo.",
    synthesis: { escalate: "Ainda não é um problema de redação; é um problema de contenção.", reply: "A questão visível é a redação, mas a pressão real é confiança, timing e autoridade.", schedule: "A resposta não precisa de pressa; precisa de um lugar claro no tempo.", resolve: "Isto já pode ser nomeado, registado e retirado da sua atenção." },
    mind: { escalate: ["Trata-se de impedir que a pressão use a sua voz.", "A urgência quer comando; a revisão comanda melhor.", "Segure a resposta e volte com um sinal mais limpo."], reply: ["É manter calor e autoridade no mesmo lugar.", "Está a proteger a relação e a sua posição.", "Responda com calma, mantenha o limite visível e indique o próximo passo."], schedule: ["Isto precisa de ritmo, não de mais ruminação.", "A sua atenção tenta garantir que nada se perca.", "Dê-lhe um momento de seguimento e solte."], resolve: ["Isto pede fecho, não expansão.", "A certeza suficiente já existe.", "Nomeie a decisão, guarde o recibo e deixe repousar."] },
    actions: { reply: ["Enviar a resposta clara e calorosa", "Obrigado pela clareza. Entendo a preocupação. O próximo passo limpo é manter o ponto de decisão claro, proteger a relação e combinar o momento sem transformar isto em mais pressão."], schedule: ["Definir um seguimento discreto", "Seguimento MindReply"], escalate: ["Reter para revisão", ""], resolve: ["Marcar como resolvido", ""] },
  },
  ar: {
    noInput: "لم يتم تقديم مدخل قابل للاستخدام.",
    risk: { high: "قد يدفع الضغط إلى خطوة تستحق المراجعة قبل الإرسال.", medium: "الموقف حساس ويحتاج لغة أبطأ وحدوداً أوضح.", low: "لم يظهر خطر مانع؛ يمكن التحرك بعناية." },
    memory: "تبقى ملاحظة الذاكرة بانتظار موافقتك؛ النص الخام لا يدخل في الإيصال.",
    synthesis: { escalate: "هذه ليست مشكلة صياغة بعد؛ إنها مسألة ضبط وحذر.", reply: "السؤال الظاهر هو الصياغة، لكن الضغط الحقيقي يتعلق بالثقة والتوقيت والسلطة.", schedule: "الأمر لا يحتاج جواباً سريعاً؛ يحتاج وقتاً واضحاً.", resolve: "هذا واضح بما يكفي لتسميته وتسجيله وتركه." },
    mind: { escalate: ["المقصود منع الضغط من استعارة صوتك.", "العجلة تطلب السيطرة؛ المراجعة سيطرة أنظف.", "أوقف الرد وعد بإشارة أوضح."], reply: ["المطلوب جمع الدفء والسلطة معاً.", "أنت تحمي العلاقة وموقعك.", "أجب بهدوء، وأبقِ الحد واضحاً، وسمِّ الخطوة التالية."], schedule: ["هذا يحتاج إيقاعاً لا مزيداً من الدوران.", "انتباهك يحاول منع سقوط شيء.", "ضع له متابعة واحدة ثم اتركه."], resolve: ["هذا يطلب إغلاقاً لا توسعاً.", "اليقين الكافي موجود.", "سمِّ القرار، احفظ الإيصال، ودعه يهدأ."] },
    actions: { reply: ["أرسل الرد الواضح الهادئ", "شكراً على الوضوح. أفهم القلق. الخطوة الأنظف هي إبقاء نقطة القرار واضحة، وحماية العلاقة، وتحديد التوقيت دون إضافة ضغط."], schedule: ["حدّد متابعة هادئة", "متابعة MindReply"], escalate: ["احتفظ به للمراجعة", ""], resolve: ["علّمه كمكتمل", ""] },
  },
  hi: {
    noInput: "कोई उपयोगी इनपुट नहीं दिया गया.",
    risk: { high: "दबाव ऐसा कदम करा सकता है जिसे भेजने से पहले समीक्षा चाहिए.", medium: "स्थिति संवेदनशील है; धीमी भाषा और स्पष्ट सीमा चाहिए.", low: "कोई रोकने वाला जोखिम नहीं दिखा; सावधानी से आगे बढ़ें." },
    memory: "मेमरी नोट आपकी मंज़ूरी तक रुका रहेगा; निजी पाठ रसीद से बाहर रहेगा.",
    synthesis: { escalate: "यह अभी शब्दों की समस्या नहीं; संयम की समस्या है.", reply: "ऊपर से सवाल शब्दों का है, असली दबाव भरोसे, समय और अधिकार का है.", schedule: "इसे तेज जवाब नहीं, समय में साफ जगह चाहिए.", resolve: "यह नाम देने, दर्ज करने और ध्यान से हटाने लायक पूरा है." },
    mind: { escalate: ["दबाव को आपकी आवाज़ लेने से रोकना है.", "जल्दी नियंत्रण चाहती है; समीक्षा बेहतर नियंत्रण है.", "जवाब रोकें और साफ संकेत के साथ लौटें."], reply: ["गरमाहट और अधिकार साथ रखने हैं.", "आप संबंध और अपनी स्थिति दोनों बचा रहे हैं.", "शांत उत्तर दें, सीमा दिखाएँ, अगला कदम कहें."], schedule: ["इसे लय चाहिए, और सोच नहीं.", "ध्यान चाहता है कि कुछ छूटे नहीं.", "एक फॉलो-अप रखें और छोड़ दें."], resolve: ["इसे बंद करना है, बढ़ाना नहीं.", "काफी निश्चितता मौजूद है.", "निर्णय लिखें, रसीद रखें, और छोड़ दें."] },
    actions: { reply: ["साफ और शांत उत्तर भेजें", "सीधे कहने के लिए धन्यवाद. मैं चिंता समझता हूँ. साफ अगला कदम है निर्णय-बिंदु स्पष्ट रखना, संबंध सुरक्षित रखना और समय तय करना बिना और दबाव बढ़ाए."], schedule: ["एक शांत फॉलो-अप रखें", "MindReply फॉलो-अप"], escalate: ["समीक्षा के लिए रोकें", ""], resolve: ["समाप्त चिह्नित करें", ""] },
  },
  ja: {
    noInput: "使用できる入力がありません。",
    risk: { high: "この圧力は、送る前に見直すべき動きへ押し出す可能性があります。", medium: "慎重な言葉と明確な境界が必要な状況です。", low: "止めるべきリスクは見当たりません。注意して進められます。" },
    memory: "記憶メモは承認まで保留されます。生の文面は記録に残しません。",
    synthesis: { escalate: "これはまだ文言の問題ではなく、抑制の問題です。", reply: "見えている問いは文言ですが、実際の圧力は信頼、タイミング、権威にあります。", schedule: "急ぐ答えではなく、明確な時間の置き場所が必要です。", resolve: "これは記録し、手放すだけの明確さがあります。" },
    mind: { escalate: ["圧力にあなたの声を使わせないことが本質です。", "急ぎは支配を求めますが、見直しの方が清潔です。", "返信を保留し、より澄んだ合図で戻ります。"], reply: ["温かさと権威を同じ場に保つことです。", "関係と立場の両方を守っています。", "静かに答え、境界を見せ、次の一手を示します。"], schedule: ["必要なのは反芻ではなくリズムです。", "注意は何かが落ちることを防ごうとしています。", "ひとつのフォロー時間を置き、手放します。"], resolve: ["広げるのではなく閉じる場面です。", "十分な確かさはすでにあります。", "決定を名付け、記録し、休ませます。"] },
    actions: { reply: ["温かく明確な返信を送る", "率直に伝えていただきありがとうございます。懸念は理解しています。次の一手は、判断点を明確にし、関係を守り、余計な圧力を加えずにタイミングを合わせることです。"], schedule: ["静かなフォローを設定する", "MindReply フォロー"], escalate: ["見直しのため保留する", ""], resolve: ["解決済みにする", ""] },
  },
  zh: {
    noInput: "未提供可用输入。",
    risk: { high: "压力可能推动一个发送前应先复核的动作。", medium: "这个情境需要更慢的语言和更清晰的边界。", low: "未发现阻断风险；可以谨慎推进。" },
    memory: "记忆备注会等你批准；原始私密文本不进入回执。",
    synthesis: { escalate: "这还不是措辞问题，而是克制问题。", reply: "表面是措辞，真实压力是信任、时机和权威。", schedule: "它不需要立刻回答，而需要一个明确的时间位置。", resolve: "这已经足够清楚，可以命名、记录并放下。" },
    mind: { escalate: ["重点是不要让压力借用你的声音。", "紧迫感想夺回控制；复核是更干净的控制。", "先按住回复，再用更清楚的信号回来。"], reply: ["要把温度和权威放在同一个房间里。", "你在保护关系，也在保护自己的位置。", "温和回答，边界可见，说清下一步。"], schedule: ["它需要节奏，不需要继续反复想。", "你的注意力在防止事情遗漏。", "给它一个跟进时间，然后放下。"], resolve: ["它需要收口，不需要扩大。", "足够的确定性已经存在。", "命名决定，保留回执，然后放下。"] },
    actions: { reply: ["发送温和清晰的回复", "谢谢你直接说明。我理解这个担忧。清晰的下一步是保持决策点明确，保护关系，并确定时间，而不是把它变成更多压力。"], schedule: ["设置一次安静跟进", "MindReply 跟进"], escalate: ["保留以便复核", ""], resolve: ["标记为已解决", ""] },
  },
  uk: {
    noInput: "Не надано придатного вводу.",
    risk: { high: "Тиск може підштовхнути до дії, яку варто переглянути перед відправленням.", medium: "Ситуація чутлива і потребує повільнішої мови та чіткіших меж.", low: "Блокувального ризику не виявлено; можна рухатися обережно." },
    memory: "Нотатка пам’яті утримується до вашого схвалення; сирий текст не входить у квитанцію.",
    synthesis: { escalate: "Це ще не питання формулювання; це питання стриманості.", reply: "Зовні це про слова, але справжній тиск стосується довіри, часу й авторитету.", schedule: "Це не потребує швидкої відповіді; цьому потрібне чітке місце в часі.", resolve: "Це достатньо ясно, щоб назвати, записати й відпустити." },
    mind: { escalate: ["Суть у тому, щоб не дати тиску позичити ваш голос.", "Терміновість хоче контролю; перегляд дає чистіший контроль.", "Утримайте відповідь і поверніться з яснішим сигналом."], reply: ["Потрібно втримати тепло й авторитет разом.", "Ви захищаєте стосунок і свою позицію.", "Відповідайте спокійно, покажіть межу й назвіть наступний крок."], schedule: ["Потрібен ритм, не більше прокручування.", "Увага намагається не дати чомусь випасти.", "Дайте цьому один момент продовження і відпустіть."], resolve: ["Це просить закриття, не розширення.", "Достатня певність уже є.", "Назвіть рішення, збережіть квитанцію і дайте спокій."] },
    actions: { reply: ["Надіслати теплу чітку відповідь", "Дякую за прямоту. Я розумію занепокоєння. Чистий наступний крок — зберегти ясною точку рішення, захистити стосунок і погодити час без додаткового тиску."], schedule: ["Поставити тихе продовження", "MindReply продовження"], escalate: ["Утримати для перегляду", ""], resolve: ["Позначити як вирішене", ""] },
  },
} satisfies Record<LocaleCode, {
  noInput: string;
  risk: Record<RiskLevel, string>;
  memory: string;
  synthesis: Record<RecommendedActionKind, string>;
  mind: Record<RecommendedActionKind, [string, string, string]>;
  actions: Record<RecommendedActionKind, [string, string]>;
}>;

function cleanInput(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

function makeStableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function makeReceiptId(input: string, timestamp: string) {
  return `mr-${makeStableHash(`${timestamp}:${input}`)}`;
}

function makeInputHash(input: string) {
  return `mrh-${makeStableHash(input)}`;
}

function assessRisk(input: string, locale: LocaleCode): DecisionResponse["risk"] {
  const lower = input.toLowerCase();
  if (highRiskTerms.some((term) => lower.includes(term))) {
    return { level: "high", reason: localized[locale].risk.high };
  }
  if (mediumRiskTerms.some((term) => lower.includes(term))) {
    return { level: "medium", reason: localized[locale].risk.medium };
  }
  return { level: "low", reason: localized[locale].risk.low };
}

function assessConfidence(input: string, risk: DecisionResponse["risk"]) {
  if (!input) return 0.2;
  if (risk.level === "high") return 0.68;
  if (risk.level === "medium") return 0.76;
  return 0.84;
}

function chooseAction(input: string, risk: DecisionResponse["risk"]): RecommendedActionKind {
  if (risk.level === "high") return "escalate";
  const lower = input.toLowerCase();
  if (/(follow up|check in|tomorrow|next week|calendar|later|wait|pause|прослед|утре|среща|календар|насрочи|seguimiento|demain|termin|amanhã|متابعة|कल|フォロー|跟进|завтра)/.test(lower)) return "schedule";
  if (/(reply|client|email|message|fee|price|response|send|say|wording|отговор|клиент|имейл|съобщение|цена|enviar|répondre|antwort|resposta|رد|उत्तर|返信|回复|відповід)/.test(lower)) return "reply";
  return "resolve";
}

function buildSynthesis(input: string, kind: RecommendedActionKind, locale: LocaleCode) {
  if (!input) return localized[locale].noInput;
  return localized[locale].synthesis[kind];
}

function buildMindRead(kind: RecommendedActionKind, locale: LocaleCode): DecisionResponse["mindRead"] {
  const [reallyAbout, mindsetProtection, calmerMove] = localized[locale].mind[kind];
  return {
    reallyAbout,
    mindsetProtection,
    calmerMove,
  };
}

function buildAction(kind: RecommendedActionKind, synthesis: string, locale: LocaleCode): DecisionResponse["recommendedAction"] {
  const [label, text] = localized[locale].actions[kind];
  if (kind === "reply") {
    return {
      kind,
      label,
      payload: {
        draft: text,
      },
    };
  }
  if (kind === "schedule") {
    return {
      kind,
      label,
      payload: {
        title: text,
        delayMinutes: 60,
      },
    };
  }
  if (kind === "escalate") {
    return {
      kind,
      label,
      payload: {
        reason: synthesis,
      },
    };
  }
  return {
    kind,
    label,
    payload: {
      record: synthesis,
    },
  };
}

export function buildDecisionResponse(request: IntakeRequest): DecisionResponse {
  const input = cleanInput(request.input);
  const locale = normalizeLocale(request.locale || defaultLocale);
  const timestamp = new Date().toISOString();
  const risk = assessRisk(input, locale);
  const kind = chooseAction(input, risk);
  const synthesis = buildSynthesis(input, kind, locale);

  return {
    locale,
    synthesis,
    mindRead: buildMindRead(kind, locale),
    recommendedAction: buildAction(kind, synthesis, locale),
    risk,
    memoryUpdate: {
      applied: false,
      summary: localized[locale].memory,
    },
    receipt: {
      id: makeReceiptId(input, timestamp),
      timestamp,
      source: request.source,
      actionKind: kind,
      riskLevel: risk.level,
      confidence: assessConfidence(input, risk),
      playbookVersion,
      locale,
      inputHash: makeInputHash(input),
      rawContentRedacted: true,
    },
  };
}

export function isRedirectedPublicPath(pathname: string) {
  return redirectedPublicPaths.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
