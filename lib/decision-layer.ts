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

type Copy = {
  noInput: string;
  risk: Record<RiskLevel, string>;
  memory: string;
  synthesis: Record<RecommendedActionKind, string>;
  mind: Record<RecommendedActionKind, [string, string, string]>;
  actions: Record<RecommendedActionKind, [string, string]>;
};

const playbookVersion = "mragent-mindread-v2";

const highRiskTerms = [
  "threat",
  "force",
  "blackmail",
  "harass",
  "illegal",
  "lawsuit",
  "regulator",
  "\u0437\u0430\u043f\u043b\u0430\u0445\u0430",
  "\u043d\u0435\u0437\u0430\u043a\u043e\u043d",
  "\u0438\u0441\u043a",
  "\u0440\u0435\u0433\u0443\u043b\u0430\u0442\u043e\u0440",
  "chantaje",
  "ill\u00e9gal",
  "klage",
  "ilegal",
  "\u062a\u0647\u062f\u064a\u062f",
  "\u0915\u093e\u0928\u0942\u0928\u0940",
  "\u8a34\u8a1f",
  "\u8fdd\u6cd5",
  "\u043f\u043e\u0433\u0440\u043e\u0437\u0430",
];

const mediumRiskTerms = [
  "complaint",
  "refund",
  "termination",
  "medical",
  "legal",
  "fire",
  "\u0436\u0430\u043b\u0431\u0430",
  "\u0432\u044a\u0437\u0441\u0442\u0430\u043d\u043e\u0432\u044f\u0432\u0430\u043d\u0435",
  "\u0434\u043e\u0433\u043e\u0432\u043e\u0440",
  "\u043f\u0440\u0430\u0432\u0435\u043d",
  "queja",
  "plainte",
  "beschwerde",
  "reclama\u00e7\u00e3o",
  "\u0634\u0643\u0648\u0649",
  "\u0936\u093f\u0915\u093e\u092f\u0924",
  "\u82e6\u60c5",
  "\u6295\u8bc9",
  "\u0441\u043a\u0430\u0440\u0433\u0430",
];

const localized = {
  en: {
    noInput: "No usable input was provided.",
    risk: {
      high: "The message carries legal or reputational pressure; review before release.",
      medium: "The message is sensitive; slow the language and keep the boundary clear.",
      low: "No blocking risk detected; proceed with care.",
    },
    memory: "Memory note held for approval; raw text stays out of the receipt.",
    synthesis: {
      reply: "The pressure is trust, timing, and authority; answer warmly with one clear next step.",
      schedule: "This needs a clean follow-up moment, not more attention right now.",
      resolve: "This is clear enough to record and release from attention.",
      escalate: "This is not ready to send; restraint protects the decision.",
    },
    mind: {
      reply: ["The real issue is keeping authority without losing warmth.", "You are protecting the relationship and your position.", "Send one calm reply with the boundary visible."],
      schedule: ["The real issue is attention leakage.", "Your mind is trying to prevent a missed commitment.", "Set one follow-up and let the matter rest."],
      resolve: ["The real issue is closure.", "Enough certainty is already present.", "Name the decision and keep the receipt."],
      escalate: ["The real issue is risk before language.", "Speed would borrow your voice.", "Hold it for review before any message leaves."],
    },
    actions: {
      reply: ["Send clear reply", "Thank you for being direct. I understand the concern. The clean next step is to keep the decision point clear, protect the relationship, and agree timing without adding pressure."],
      schedule: ["Set one follow-up", "MindReply follow-up"],
      resolve: ["Mark resolved", ""],
      escalate: ["Hold for review", ""],
    },
  },
  es: {
    noInput: "No se proporcion\u00f3 una entrada utilizable.",
    risk: { high: "El mensaje tiene presi\u00f3n legal o reputacional; revisa antes de enviar.", medium: "El mensaje es sensible; usa lenguaje m\u00e1s lento y un l\u00edmite claro.", low: "No se detecta riesgo bloqueante; avanza con cuidado." },
    memory: "La nota de memoria queda retenida hasta aprobaci\u00f3n; el texto privado no entra en el recibo.",
    synthesis: { reply: "La presi\u00f3n es confianza, tiempo y autoridad; responde con calidez y un solo siguiente paso.", schedule: "Esto necesita un momento claro de seguimiento, no m\u00e1s atenci\u00f3n ahora.", resolve: "Esto est\u00e1 claro para registrarse y salir de tu atenci\u00f3n.", escalate: "Esto no est\u00e1 listo para enviarse; la contenci\u00f3n protege la decisi\u00f3n." },
    mind: { reply: ["El punto real es mantener autoridad sin perder calidez.", "Proteges la relaci\u00f3n y tu posici\u00f3n.", "Env\u00eda una respuesta tranquila con el l\u00edmite visible."], schedule: ["El punto real es fuga de atenci\u00f3n.", "Tu mente intenta evitar un compromiso perdido.", "Fija un seguimiento y deja descansar el tema."], resolve: ["El punto real es cierre.", "La certeza suficiente ya existe.", "Nombra la decisi\u00f3n y conserva el recibo."], escalate: ["El punto real es riesgo antes que redacci\u00f3n.", "La prisa tomar\u00eda tu voz prestada.", "Ret\u00e9nlo para revisi\u00f3n antes de enviar." ] },
    actions: { reply: ["Enviar respuesta clara", "Gracias por ser directo. Entiendo la preocupaci\u00f3n. El siguiente paso limpio es mantener claro el punto de decisi\u00f3n, proteger la relaci\u00f3n y acordar el momento sin a\u00f1adir presi\u00f3n."], schedule: ["Fijar un seguimiento", "Seguimiento MindReply"], resolve: ["Marcar resuelto", ""], escalate: ["Retener para revisi\u00f3n", ""] },
  },
  fr: {
    noInput: "Aucune entr\u00e9e exploitable n'a \u00e9t\u00e9 fournie.",
    risk: { high: "Le message porte une pression juridique ou r\u00e9putationnelle; relire avant envoi.", medium: "Le message est sensible; ralentir le langage et garder une limite nette.", low: "Aucun risque bloquant d\u00e9tect\u00e9; avancer avec soin." },
    memory: "La note m\u00e9moire reste en attente d'accord; le texte brut reste hors du re\u00e7u.",
    synthesis: { reply: "La pression touche confiance, timing et autorit\u00e9; r\u00e9pondez avec chaleur et une seule suite claire.", schedule: "Cela demande un moment de suivi net, pas plus d'attention maintenant.", resolve: "C'est assez clair pour \u00eatre enregistr\u00e9 puis rel\u00e2ch\u00e9.", escalate: "Ce n'est pas pr\u00eat \u00e0 partir; la retenue prot\u00e8ge la d\u00e9cision." },
    mind: { reply: ["Le vrai sujet est de garder l'autorit\u00e9 sans perdre la chaleur.", "Vous prot\u00e9gez la relation et votre position.", "Envoyez une r\u00e9ponse calme avec la limite visible."], schedule: ["Le vrai sujet est la fuite d'attention.", "Votre esprit tente d'\u00e9viter un engagement oubli\u00e9.", "Fixez un suivi et laissez reposer."], resolve: ["Le vrai sujet est la cl\u00f4ture.", "La certitude suffisante est d\u00e9j\u00e0 l\u00e0.", "Nommez la d\u00e9cision et gardez le re\u00e7u."], escalate: ["Le vrai sujet est le risque avant les mots.", "La vitesse emprunterait votre voix.", "Gardez-le pour revue avant tout envoi."] },
    actions: { reply: ["Envoyer la r\u00e9ponse claire", "Merci pour votre franchise. Je comprends le point. La prochaine \u00e9tape est de garder la d\u00e9cision claire, prot\u00e9ger la relation et fixer le bon moment sans ajouter de pression."], schedule: ["D\u00e9finir un suivi", "Suivi MindReply"], resolve: ["Marquer r\u00e9solu", ""], escalate: ["Garder pour revue", ""] },
  },
  de: {
    noInput: "Es wurde keine verwertbare Eingabe bereitgestellt.",
    risk: { high: "Die Nachricht tr\u00e4gt rechtlichen oder reputativen Druck; vor dem Senden pr\u00fcfen.", medium: "Die Nachricht ist sensibel; Sprache verlangsamen und Grenze klar halten.", low: "Kein blockierendes Risiko erkannt; mit Sorgfalt fortfahren." },
    memory: "Die Notiz bleibt bis zur Freigabe gehalten; Rohtext bleibt aus dem Beleg.",
    synthesis: { reply: "Der Druck betrifft Vertrauen, Timing und Autorit\u00e4t; antworten Sie warm mit einem klaren n\u00e4chsten Schritt.", schedule: "Das braucht einen klaren Folgemoment, nicht mehr Aufmerksamkeit jetzt.", resolve: "Das ist klar genug, um erfasst und losgelassen zu werden.", escalate: "Das ist noch nicht sendebereit; Zur\u00fcckhaltung sch\u00fctzt die Entscheidung." },
    mind: { reply: ["Es geht darum, Autorit\u00e4t ohne K\u00e4lte zu halten.", "Sie sch\u00fctzen Beziehung und Position.", "Senden Sie eine ruhige Antwort mit sichtbarer Grenze."], schedule: ["Es geht um austretende Aufmerksamkeit.", "Ihr Kopf will verhindern, dass etwas verloren geht.", "Setzen Sie eine Nachverfolgung und lassen Sie es ruhen."], resolve: ["Es geht um Abschluss.", "Genug Sicherheit ist bereits da.", "Benennen Sie die Entscheidung und behalten Sie den Beleg."], escalate: ["Es geht um Risiko vor Sprache.", "Tempo w\u00fcrde Ihre Stimme ausleihen.", "Zur Pr\u00fcfung halten, bevor etwas gesendet wird."] },
    actions: { reply: ["Klare Antwort senden", "Danke f\u00fcr die direkte R\u00fcckmeldung. Ich verstehe den Punkt. Der klare n\u00e4chste Schritt ist, den Entscheidungspunkt sichtbar zu halten, die Beziehung zu sch\u00fctzen und den Zeitpunkt ohne zus\u00e4tzlichen Druck abzustimmen."], schedule: ["Eine Nachverfolgung setzen", "MindReply-Nachverfolgung"], resolve: ["Als erledigt markieren", ""], escalate: ["Zur Pr\u00fcfung halten", ""] },
  },
  pt: {
    noInput: "Nenhuma entrada utiliz\u00e1vel foi fornecida.",
    risk: { high: "A mensagem carrega press\u00e3o legal ou reputacional; revise antes de enviar.", medium: "A mensagem \u00e9 sens\u00edvel; desacelere a linguagem e mantenha o limite claro.", low: "Nenhum risco bloqueante detectado; avance com cuidado." },
    memory: "A nota de mem\u00f3ria fica retida para aprova\u00e7\u00e3o; o texto bruto fica fora do recibo.",
    synthesis: { reply: "A press\u00e3o \u00e9 confian\u00e7a, timing e autoridade; responda com calor e um pr\u00f3ximo passo claro.", schedule: "Isto precisa de um momento claro de seguimento, n\u00e3o de mais aten\u00e7\u00e3o agora.", resolve: "Isto est\u00e1 claro para registar e retirar da aten\u00e7\u00e3o.", escalate: "Isto n\u00e3o est\u00e1 pronto para envio; a conten\u00e7\u00e3o protege a decis\u00e3o." },
    mind: { reply: ["O ponto real \u00e9 manter autoridade sem perder calor.", "Protege a rela\u00e7\u00e3o e a sua posi\u00e7\u00e3o.", "Envie uma resposta calma com o limite vis\u00edvel."], schedule: ["O ponto real \u00e9 fuga de aten\u00e7\u00e3o.", "A mente tenta evitar um compromisso perdido.", "Defina um seguimento e deixe repousar."], resolve: ["O ponto real \u00e9 fecho.", "A certeza suficiente j\u00e1 existe.", "Nomeie a decis\u00e3o e guarde o recibo."], escalate: ["O ponto real \u00e9 risco antes das palavras.", "A pressa tomaria a sua voz emprestada.", "Guarde para revis\u00e3o antes de enviar."] },
    actions: { reply: ["Enviar resposta clara", "Obrigado pela clareza. Entendo a preocupa\u00e7\u00e3o. O pr\u00f3ximo passo limpo \u00e9 manter o ponto de decis\u00e3o claro, proteger a rela\u00e7\u00e3o e combinar o momento sem transformar isto em mais press\u00e3o."], schedule: ["Definir seguimento", "Seguimento MindReply"], resolve: ["Marcar resolvido", ""], escalate: ["Reter para revis\u00e3o", ""] },
  },
  ar: {
    noInput: "\u0644\u0645 \u064a\u062a\u0645 \u062a\u0642\u062f\u064a\u0645 \u0645\u062f\u062e\u0644 \u0642\u0627\u0628\u0644 \u0644\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645.",
    risk: { high: "\u062a\u062d\u0645\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0636\u063a\u0637\u0627\u064b \u0642\u0627\u0646\u0648\u0646\u064a\u0627\u064b \u0623\u0648 \u0633\u0645\u0639\u064a\u0627\u064b\u061b \u0631\u0627\u062c\u0639\u0647\u0627 \u0642\u0628\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644.", medium: "\u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u062d\u0633\u0627\u0633\u0629\u061b \u0623\u0628\u0637\u0626 \u0627\u0644\u0644\u063a\u0629 \u0648\u0623\u0628\u0642 \u0627\u0644\u062d\u062f \u0648\u0627\u0636\u062d\u0627\u064b.", low: "\u0644\u0645 \u064a\u0638\u0647\u0631 \u062e\u0637\u0631 \u0645\u0627\u0646\u0639\u061b \u062a\u062d\u0631\u0643 \u0628\u0639\u0646\u0627\u064a\u0629." },
    memory: "\u062a\u0628\u0642\u0649 \u0645\u0644\u0627\u062d\u0638\u0629 \u0627\u0644\u0630\u0627\u0643\u0631\u0629 \u0628\u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629\u061b \u0627\u0644\u0646\u0635 \u0627\u0644\u062e\u0627\u0645 \u0644\u0627 \u064a\u062f\u062e\u0644 \u0641\u064a \u0627\u0644\u0625\u064a\u0635\u0627\u0644.",
    synthesis: { reply: "\u0627\u0644\u0636\u063a\u0637 \u0647\u0648 \u0627\u0644\u062b\u0642\u0629 \u0648\u0627\u0644\u062a\u0648\u0642\u064a\u062a \u0648\u0627\u0644\u0633\u0644\u0637\u0629\u061b \u0623\u062c\u0628 \u0628\u0647\u062f\u0648\u0621 \u0648\u062e\u0637\u0648\u0629 \u0648\u0627\u062d\u062f\u0629 \u0648\u0627\u0636\u062d\u0629.", schedule: "\u0647\u0630\u0627 \u064a\u062d\u062a\u0627\u062c \u0645\u0648\u0639\u062f \u0645\u062a\u0627\u0628\u0639\u0629 \u0648\u0627\u0636\u062d\u0627\u064b\u060c \u0644\u0627 \u0645\u0632\u064a\u062f\u0627\u064b \u0645\u0646 \u0627\u0644\u0627\u0646\u062a\u0628\u0627\u0647 \u0627\u0644\u0622\u0646.", resolve: "\u0647\u0630\u0627 \u0648\u0627\u0636\u062d \u0628\u0645\u0627 \u064a\u0643\u0641\u064a \u0644\u062a\u0633\u062c\u064a\u0644\u0647 \u0648\u062a\u0631\u0643\u0647.", escalate: "\u0647\u0630\u0627 \u0644\u064a\u0633 \u062c\u0627\u0647\u0632\u0627\u064b \u0644\u0644\u0625\u0631\u0633\u0627\u0644\u061b \u0627\u0644\u062a\u0631\u064a\u062b \u064a\u062d\u0645\u064a \u0627\u0644\u0642\u0631\u0627\u0631." },
    mind: { reply: ["\u0627\u0644\u0645\u0633\u0623\u0644\u0629 \u0647\u064a \u0627\u0644\u062d\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u0633\u0644\u0637\u0629 \u062f\u0648\u0646 \u0641\u0642\u062f\u0627\u0646 \u0627\u0644\u062f\u0641\u0621.", "\u0623\u0646\u062a \u062a\u062d\u0645\u064a \u0627\u0644\u0639\u0644\u0627\u0642\u0629 \u0648\u0645\u0648\u0642\u0639\u0643.", "\u0623\u0631\u0633\u0644 \u0631\u062f\u0627\u064b \u0647\u0627\u062f\u0626\u0627\u064b \u0648\u062d\u062f\u0627\u064b \u0648\u0627\u0636\u062d\u0627\u064b."], schedule: ["\u0627\u0644\u0645\u0633\u0623\u0644\u0629 \u0647\u064a \u062a\u0633\u0631\u0628 \u0627\u0644\u0627\u0646\u062a\u0628\u0627\u0647.", "\u0630\u0647\u0646\u0643 \u064a\u062d\u0627\u0648\u0644 \u0645\u0646\u0639 \u0627\u0644\u062a\u0632\u0627\u0645 \u0645\u0646\u0633\u064a.", "\u0636\u0639 \u0645\u062a\u0627\u0628\u0639\u0629 \u0648\u0627\u062d\u062f\u0629 \u0648\u0627\u062a\u0631\u0643 \u0627\u0644\u0623\u0645\u0631."], resolve: ["\u0627\u0644\u0645\u0633\u0623\u0644\u0629 \u0647\u064a \u0627\u0644\u0625\u063a\u0644\u0627\u0642.", "\u0627\u0644\u064a\u0642\u064a\u0646 \u0627\u0644\u0643\u0627\u0641\u064a \u0645\u0648\u062c\u0648\u062f.", "\u0633\u0645 \u0627\u0644\u0642\u0631\u0627\u0631 \u0648\u0627\u062d\u0641\u0638 \u0627\u0644\u0625\u064a\u0635\u0627\u0644."], escalate: ["\u0627\u0644\u0645\u0633\u0623\u0644\u0629 \u0647\u064a \u0627\u0644\u062e\u0637\u0631 \u0642\u0628\u0644 \u0627\u0644\u0644\u063a\u0629.", "\u0627\u0644\u0633\u0631\u0639\u0629 \u062a\u0633\u062a\u0639\u064a\u0631 \u0635\u0648\u062a\u0643.", "\u0627\u062d\u062a\u0641\u0638 \u0628\u0647 \u0644\u0644\u0645\u0631\u0627\u062c\u0639\u0629 \u0642\u0628\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644."] },
    actions: { reply: ["\u0625\u0631\u0633\u0627\u0644 \u0631\u062f \u0648\u0627\u0636\u062d", "\u0634\u0643\u0631\u0627\u064b \u0639\u0644\u0649 \u0627\u0644\u0648\u0636\u0648\u062d. \u0623\u0641\u0647\u0645 \u0627\u0644\u0642\u0644\u0642. \u0627\u0644\u062e\u0637\u0648\u0629 \u0627\u0644\u0623\u0646\u0638\u0641 \u0647\u064a \u0625\u0628\u0642\u0627\u0621 \u0646\u0642\u0637\u0629 \u0627\u0644\u0642\u0631\u0627\u0631 \u0648\u0627\u0636\u062d\u0629 \u0648\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0639\u0644\u0627\u0642\u0629 \u0648\u062a\u062d\u062f\u064a\u062f \u0627\u0644\u062a\u0648\u0642\u064a\u062a \u062f\u0648\u0646 \u0632\u064a\u0627\u062f\u0629 \u0627\u0644\u0636\u063a\u0637."], schedule: ["\u062a\u062d\u062f\u064a\u062f \u0645\u062a\u0627\u0628\u0639\u0629", "\u0645\u062a\u0627\u0628\u0639\u0629 MindReply"], resolve: ["\u062a\u0639\u0644\u064a\u0645\u0647 \u0643\u0645\u0643\u062a\u0645\u0644", ""], escalate: ["\u0627\u0644\u0627\u062d\u062a\u0641\u0627\u0638 \u0644\u0644\u0645\u0631\u0627\u062c\u0639\u0629", ""] },
  },
  hi: {
    noInput: "\u0915\u094b\u0908 \u0909\u092a\u092f\u094b\u0917\u0940 \u0907\u0928\u092a\u0941\u091f \u0928\u0939\u0940\u0902 \u0926\u093f\u092f\u093e \u0917\u092f\u093e.",
    risk: { high: "\u0938\u0902\u0926\u0947\u0936 \u092e\u0947\u0902 \u0915\u093e\u0928\u0942\u0928\u0940 \u092f\u093e \u092a\u094d\u0930\u0924\u093f\u0937\u094d\u0920\u093e \u0915\u093e \u0926\u092c\u093e\u0935 \u0939\u0948; \u092d\u0947\u091c\u0928\u0947 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0938\u092e\u0940\u0915\u094d\u0937\u093e \u0915\u0930\u0947\u0902.", medium: "\u0938\u0902\u0926\u0947\u0936 \u0938\u0902\u0935\u0947\u0926\u0928\u0936\u0940\u0932 \u0939\u0948; \u092d\u093e\u0937\u093e \u0927\u0940\u092e\u0940 \u0914\u0930 \u0938\u0940\u092e\u093e \u0938\u094d\u092a\u0937\u094d\u091f \u0930\u0916\u0947\u0902.", low: "\u0915\u094b\u0908 \u0930\u094b\u0915\u0928\u0947 \u0935\u093e\u0932\u093e \u091c\u094b\u0916\u093f\u092e \u0928\u0939\u0940\u0902; \u0938\u093e\u0935\u0927\u093e\u0928\u0940 \u0938\u0947 \u0906\u0917\u0947 \u092c\u0922\u093c\u0947\u0902." },
    memory: "\u092e\u0947\u092e\u0930\u0940 \u0928\u094b\u091f \u092e\u0902\u091c\u0942\u0930\u0940 \u0924\u0915 \u0930\u0941\u0915\u093e \u0939\u0948; \u0928\u093f\u091c\u0940 \u092a\u093e\u0920 \u0930\u0938\u0940\u0926 \u0938\u0947 \u092c\u093e\u0939\u0930 \u0930\u0939\u0924\u093e \u0939\u0948.",
    synthesis: { reply: "\u0926\u092c\u093e\u0935 \u092d\u0930\u094b\u0938\u093e, \u0938\u092e\u092f \u0914\u0930 \u0905\u0927\u093f\u0915\u093e\u0930 \u0939\u0948; \u0917\u0930\u094d\u092e\u093e\u0939\u091f \u0915\u0947 \u0938\u093e\u0925 \u090f\u0915 \u0938\u093e\u092b \u0905\u0917\u0932\u093e \u0915\u0926\u092e \u092d\u0947\u091c\u0947\u0902.", schedule: "\u0907\u0938\u0947 \u090f\u0915 \u0938\u093e\u092b \u092b\u0949\u0932\u094b-\u0905\u092a \u0938\u092e\u092f \u091a\u093e\u0939\u093f\u090f, \u0905\u092d\u0940 \u0914\u0930 \u0927\u094d\u092f\u093e\u0928 \u0928\u0939\u0940\u0902.", resolve: "\u092f\u0939 \u0930\u093f\u0915\u0949\u0930\u094d\u0921 \u0915\u0930\u0915\u0947 \u0927\u094d\u092f\u093e\u0928 \u0938\u0947 \u0939\u091f\u093e\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0915\u093e\u092b\u0940 \u0938\u094d\u092a\u0937\u094d\u091f \u0939\u0948.", escalate: "\u092f\u0939 \u092d\u0947\u091c\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0924\u0948\u092f\u093e\u0930 \u0928\u0939\u0940\u0902; \u0938\u0902\u092f\u092e \u0928\u093f\u0930\u094d\u0923\u092f \u0915\u094b \u092c\u091a\u093e\u0924\u093e \u0939\u0948." },
    mind: { reply: ["\u0905\u0938\u0932 \u092c\u093e\u0924 \u0917\u0930\u094d\u092e\u093e\u0939\u091f \u0916\u094b\u090f \u092c\u093f\u0928\u093e \u0905\u0927\u093f\u0915\u093e\u0930 \u0930\u0916\u0928\u093e \u0939\u0948.", "\u0906\u092a \u0938\u0902\u092c\u0902\u0927 \u0914\u0930 \u0905\u092a\u0928\u0940 \u0938\u094d\u0925\u093f\u0924\u093f \u092c\u091a\u093e \u0930\u0939\u0947 \u0939\u0948\u0902.", "\u0938\u0940\u092e\u093e \u0926\u093f\u0916\u093e\u0924\u0947 \u0939\u0941\u090f \u090f\u0915 \u0936\u093e\u0902\u0924 \u0909\u0924\u094d\u0924\u0930 \u092d\u0947\u091c\u0947\u0902."], schedule: ["\u0905\u0938\u0932 \u092c\u093e\u0924 \u0927\u094d\u092f\u093e\u0928 \u0915\u093e \u0930\u093f\u0938\u093e\u0935 \u0939\u0948.", "\u092e\u0928 \u091a\u093e\u0939\u0924\u093e \u0939\u0948 \u0915\u093f \u0915\u094b\u0908 \u0935\u093e\u0926\u093e \u0928 \u091b\u0942\u091f\u0947.", "\u090f\u0915 \u092b\u0949\u0932\u094b-\u0905\u092a \u0930\u0916\u0947\u0902 \u0914\u0930 \u092c\u093e\u0924 \u091b\u094b\u0921\u093c \u0926\u0947\u0902."], resolve: ["\u0905\u0938\u0932 \u092c\u093e\u0924 \u092c\u0902\u0926 \u0915\u0930\u0928\u093e \u0939\u0948.", "\u0915\u093e\u092b\u0940 \u0928\u093f\u0936\u094d\u091a\u093f\u0924\u0924\u093e \u092e\u094c\u091c\u0942\u0926 \u0939\u0948.", "\u0928\u093f\u0930\u094d\u0923\u092f \u0932\u093f\u0916\u0947\u0902 \u0914\u0930 \u0930\u0938\u0940\u0926 \u0930\u0916\u0947\u0902."], escalate: ["\u0905\u0938\u0932 \u092c\u093e\u0924 \u0936\u092c\u094d\u0926\u094b\u0902 \u0938\u0947 \u092a\u0939\u0932\u0947 \u091c\u094b\u0916\u093f\u092e \u0939\u0948.", "\u091c\u0932\u094d\u0926\u0940 \u0906\u092a\u0915\u0940 \u0906\u0935\u093e\u091c \u0909\u0927\u093e\u0930 \u0932\u0947\u0917\u0940.", "\u092d\u0947\u091c\u0928\u0947 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0938\u092e\u0940\u0915\u094d\u0937\u093e \u0915\u0947 \u0932\u093f\u090f \u0930\u094b\u0915\u0947\u0902."] },
    actions: { reply: ["\u0938\u093e\u092b \u0909\u0924\u094d\u0924\u0930 \u092d\u0947\u091c\u0947\u0902", "\u0938\u0940\u0927\u0947 \u0915\u0939\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0927\u0928\u094d\u092f\u0935\u093e\u0926. \u092e\u0948\u0902 \u091a\u093f\u0902\u0924\u093e \u0938\u092e\u091d\u0924\u093e \u0939\u0942\u0901. \u0938\u093e\u092b \u0905\u0917\u0932\u093e \u0915\u0926\u092e \u0939\u0948 \u0928\u093f\u0930\u094d\u0923\u092f-\u092c\u093f\u0902\u0926\u0941 \u0938\u094d\u092a\u0937\u094d\u091f \u0930\u0916\u0928\u093e, \u0938\u0902\u092c\u0902\u0927 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0930\u0916\u0928\u093e \u0914\u0930 \u0938\u092e\u092f \u0924\u092f \u0915\u0930\u0928\u093e \u092c\u093f\u0928\u093e \u0914\u0930 \u0926\u092c\u093e\u0935 \u092c\u0922\u093c\u093e\u090f."], schedule: ["\u090f\u0915 \u092b\u0949\u0932\u094b-\u0905\u092a \u0930\u0916\u0947\u0902", "MindReply \u092b\u0949\u0932\u094b-\u0905\u092a"], resolve: ["\u0938\u092e\u093e\u092a\u094d\u0924 \u091a\u093f\u0939\u094d\u0928\u093f\u0924 \u0915\u0930\u0947\u0902", ""], escalate: ["\u0938\u092e\u0940\u0915\u094d\u0937\u093e \u0915\u0947 \u0932\u093f\u090f \u0930\u094b\u0915\u0947\u0902", ""] },
  },
  ja: {
    noInput: "\u4f7f\u7528\u3067\u304d\u308b\u5165\u529b\u304c\u3042\u308a\u307e\u305b\u3093\u3002",
    risk: { high: "\u6cd5\u52d9\u307e\u305f\u306f\u8a55\u5224\u306e\u5727\u529b\u304c\u3042\u308a\u307e\u3059\u3002\u9001\u4fe1\u524d\u306b\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002", medium: "\u614e\u91cd\u306a\u6587\u9762\u3067\u3059\u3002\u8a00\u8449\u3092\u3086\u3063\u304f\u308a\u306b\u3057\u3001\u5883\u754c\u3092\u660e\u78ba\u306b\u3057\u3066\u304f\u3060\u3055\u3044\u3002", low: "\u6b62\u3081\u308b\u3079\u304d\u30ea\u30b9\u30af\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u6ce8\u610f\u3057\u3066\u9032\u3081\u307e\u3059\u3002" },
    memory: "\u8a18\u61b6\u30e1\u30e2\u306f\u627f\u8a8d\u307e\u3067\u4fdd\u7559\u3055\u308c\u307e\u3059\u3002\u751f\u306e\u6587\u9762\u306f\u8a18\u9332\u306b\u6b8b\u3057\u307e\u305b\u3093\u3002",
    synthesis: { reply: "\u5727\u529b\u306e\u672c\u8cea\u306f\u4fe1\u983c\u3001\u6642\u6a5f\u3001\u6a29\u5a01\u3067\u3059\u3002\u6e29\u304b\u304f\u4e00\u3064\u306e\u6b21\u624b\u3092\u793a\u3057\u307e\u3059\u3002", schedule: "\u4eca\u306f\u6ce8\u610f\u3092\u5897\u3084\u3059\u306e\u3067\u306f\u306a\u304f\u3001\u660e\u78ba\u306a\u30d5\u30a9\u30ed\u30fc\u6642\u9593\u304c\u5fc5\u8981\u3067\u3059\u3002", resolve: "\u8a18\u9332\u3057\u3066\u624b\u653e\u305b\u308b\u307b\u3069\u660e\u78ba\u3067\u3059\u3002", escalate: "\u307e\u3060\u9001\u4fe1\u3067\u304d\u307e\u305b\u3093\u3002\u6291\u5236\u304c\u5224\u65ad\u3092\u5b88\u308a\u307e\u3059\u3002" },
    mind: { reply: ["\u672c\u984c\u306f\u6e29\u304b\u3055\u3092\u5931\u308f\u305a\u6a29\u5a01\u3092\u4fdd\u3064\u3053\u3068\u3067\u3059\u3002", "\u95a2\u4fc2\u3068\u7acb\u5834\u3092\u5b88\u3063\u3066\u3044\u307e\u3059\u3002", "\u5883\u754c\u304c\u898b\u3048\u308b\u9759\u304b\u306a\u8fd4\u4fe1\u3092\u9001\u308a\u307e\u3059\u3002"], schedule: ["\u672c\u984c\u306f\u6ce8\u610f\u306e\u6f0f\u308c\u3067\u3059\u3002", "\u4f55\u304b\u304c\u6f0f\u308c\u306a\u3044\u3088\u3046\u306b\u3057\u3066\u3044\u307e\u3059\u3002", "\u4e00\u3064\u30d5\u30a9\u30ed\u30fc\u3092\u8a2d\u5b9a\u3057\u3001\u624b\u653e\u3057\u307e\u3059\u3002"], resolve: ["\u672c\u984c\u306f\u7d42\u4e86\u3067\u3059\u3002", "\u5341\u5206\u306a\u78ba\u304b\u3055\u304c\u3042\u308a\u307e\u3059\u3002", "\u5224\u65ad\u3092\u540d\u4ed8\u3051\u3001\u8a18\u9332\u3057\u307e\u3059\u3002"], escalate: ["\u672c\u984c\u306f\u8a00\u8449\u306e\u524d\u306e\u30ea\u30b9\u30af\u3067\u3059\u3002", "\u6025\u3050\u3068\u58f0\u304c\u501f\u308a\u3089\u308c\u307e\u3059\u3002", "\u9001\u4fe1\u524d\u306b\u4fdd\u7559\u3057\u3066\u78ba\u8a8d\u3057\u307e\u3059\u3002"] },
    actions: { reply: ["\u660e\u78ba\u306a\u8fd4\u4fe1\u3092\u9001\u308b", "\u7387\u76f4\u306b\u4f1d\u3048\u3066\u3044\u305f\u3060\u304d\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059\u3002\u61f8\u5ff5\u306f\u7406\u89e3\u3057\u3066\u3044\u307e\u3059\u3002\u6b21\u306e\u4e00\u624b\u306f\u3001\u5224\u65ad\u70b9\u3092\u660e\u78ba\u306b\u3057\u3001\u95a2\u4fc2\u3092\u5b88\u308a\u3001\u4f59\u8a08\u306a\u5727\u529b\u3092\u52a0\u3048\u305a\u306b\u6642\u6a5f\u3092\u5408\u308f\u305b\u308b\u3053\u3068\u3067\u3059\u3002"], schedule: ["\u4e00\u3064\u30d5\u30a9\u30ed\u30fc\u3092\u8a2d\u5b9a", "MindReply \u30d5\u30a9\u30ed\u30fc"], resolve: ["\u89e3\u6c7a\u6e08\u307f\u306b\u3059\u308b", ""], escalate: ["\u78ba\u8a8d\u306e\u305f\u3081\u4fdd\u7559", ""] },
  },
  zh: {
    noInput: "\u672a\u63d0\u4f9b\u53ef\u7528\u8f93\u5165\u3002",
    risk: { high: "\u8fd9\u6761\u4fe1\u606f\u5e26\u6709\u6cd5\u52a1\u6216\u58f0\u8a89\u538b\u529b\uff1b\u53d1\u51fa\u524d\u5148\u590d\u6838\u3002", medium: "\u8fd9\u6761\u4fe1\u606f\u8f83\u654f\u611f\uff1b\u653e\u6162\u8bed\u8a00\uff0c\u4fdd\u6301\u8fb9\u754c\u6e05\u695a\u3002", low: "\u672a\u53d1\u73b0\u963b\u65ad\u98ce\u9669\uff1b\u8c28\u614e\u63a8\u8fdb\u3002" },
    memory: "\u8bb0\u5fc6\u5907\u6ce8\u7b49\u5f85\u6279\u51c6\uff1b\u539f\u59cb\u6587\u672c\u4e0d\u8fdb\u5165\u56de\u6267\u3002",
    synthesis: { reply: "\u538b\u529b\u5173\u4e4e\u4fe1\u4efb\u3001\u65f6\u673a\u548c\u6743\u5a01\uff1b\u7528\u6e29\u548c\u7684\u4e00\u4e2a\u4e0b\u4e00\u6b65\u56de\u5e94\u3002", schedule: "\u8fd9\u9700\u8981\u4e00\u4e2a\u6e05\u6670\u8ddf\u8fdb\u65f6\u95f4\uff0c\u4e0d\u9700\u8981\u6b64\u523b\u7ee7\u7eed\u5360\u7528\u6ce8\u610f\u529b\u3002", resolve: "\u8fd9\u5df2\u8db3\u591f\u6e05\u695a\uff0c\u53ef\u4ee5\u8bb0\u5f55\u5e76\u653e\u4e0b\u3002", escalate: "\u8fd9\u8fd8\u4e0d\u9002\u5408\u53d1\u51fa\uff1b\u514b\u5236\u4fdd\u62a4\u5224\u65ad\u3002" },
    mind: { reply: ["\u771f\u6b63\u7684\u95ee\u9898\u662f\u4e0d\u5931\u6e29\u5ea6\u5730\u4fdd\u6301\u6743\u5a01\u3002", "\u4f60\u5728\u4fdd\u62a4\u5173\u7cfb\u548c\u4f4d\u7f6e\u3002", "\u53d1\u9001\u4e00\u6761\u5e73\u9759\u3001\u8fb9\u754c\u53ef\u89c1\u7684\u56de\u590d\u3002"], schedule: ["\u771f\u6b63\u7684\u95ee\u9898\u662f\u6ce8\u610f\u529b\u6d41\u5931\u3002", "\u4f60\u7684\u5927\u8111\u5728\u9632\u6b62\u9057\u6f0f\u627f\u8bfa\u3002", "\u8bbe\u4e00\u4e2a\u8ddf\u8fdb\uff0c\u7136\u540e\u653e\u4e0b\u3002"], resolve: ["\u771f\u6b63\u7684\u95ee\u9898\u662f\u6536\u5c3e\u3002", "\u8db3\u591f\u7684\u786e\u5b9a\u6027\u5df2\u7ecf\u5b58\u5728\u3002", "\u547d\u540d\u51b3\u5b9a\uff0c\u4fdd\u7559\u56de\u6267\u3002"], escalate: ["\u771f\u6b63\u7684\u95ee\u9898\u662f\u8bed\u8a00\u4e4b\u524d\u7684\u98ce\u9669\u3002", "\u901f\u5ea6\u4f1a\u501f\u7528\u4f60\u7684\u58f0\u97f3\u3002", "\u53d1\u51fa\u524d\u4fdd\u7559\u590d\u6838\u3002"] },
    actions: { reply: ["\u53d1\u9001\u6e05\u6670\u56de\u590d", "\u8c22\u8c22\u4f60\u76f4\u63a5\u8bf4\u660e\u3002\u6211\u7406\u89e3\u8fd9\u4e2a\u62c5\u5fe7\u3002\u6e05\u6670\u7684\u4e0b\u4e00\u6b65\u662f\u4fdd\u6301\u51b3\u7b56\u70b9\u660e\u786e\uff0c\u4fdd\u62a4\u5173\u7cfb\uff0c\u5e76\u786e\u5b9a\u65f6\u95f4\uff0c\u4e0d\u589e\u52a0\u538b\u529b\u3002"], schedule: ["\u8bbe\u7f6e\u4e00\u6b21\u8ddf\u8fdb", "MindReply \u8ddf\u8fdb"], resolve: ["\u6807\u8bb0\u5df2\u89e3\u51b3", ""], escalate: ["\u4fdd\u7559\u590d\u6838", ""] },
  },
  uk: {
    noInput: "\u041d\u0435 \u043d\u0430\u0434\u0430\u043d\u043e \u043f\u0440\u0438\u0434\u0430\u0442\u043d\u043e\u0433\u043e \u0432\u0432\u043e\u0434\u0443.",
    risk: { high: "\u041f\u043e\u0432\u0456\u0434\u043e\u043c\u043b\u0435\u043d\u043d\u044f \u043d\u0435\u0441\u0435 \u044e\u0440\u0438\u0434\u0438\u0447\u043d\u0438\u0439 \u0430\u0431\u043e \u0440\u0435\u043f\u0443\u0442\u0430\u0446\u0456\u0439\u043d\u0438\u0439 \u0442\u0438\u0441\u043a; \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u043d\u044c\u0442\u0435 \u043f\u0435\u0440\u0435\u0434 \u0432\u0456\u0434\u043f\u0440\u0430\u0432\u043a\u043e\u044e.", medium: "\u041f\u043e\u0432\u0456\u0434\u043e\u043c\u043b\u0435\u043d\u043d\u044f \u0447\u0443\u0442\u043b\u0438\u0432\u0435; \u0443\u043f\u043e\u0432\u0456\u043b\u044c\u043d\u0456\u0442\u044c \u043c\u043e\u0432\u0443 \u0456 \u0442\u0440\u0438\u043c\u0430\u0439\u0442\u0435 \u043c\u0435\u0436\u0443 \u0447\u0456\u0442\u043a\u043e\u044e.", low: "\u0411\u043b\u043e\u043a\u0443\u0432\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0438\u0437\u0438\u043a\u0443 \u043d\u0435\u043c\u0430\u0454; \u0440\u0443\u0445\u0430\u0439\u0442\u0435\u0441\u044f \u043e\u0431\u0435\u0440\u0435\u0436\u043d\u043e." },
    memory: "\u041d\u043e\u0442\u0430\u0442\u043a\u0430 \u043f\u0430\u043c'\u044f\u0442\u0456 \u0443\u0442\u0440\u0438\u043c\u0443\u0454\u0442\u044c\u0441\u044f \u0434\u043e \u0441\u0445\u0432\u0430\u043b\u0435\u043d\u043d\u044f; \u0441\u0438\u0440\u0438\u0439 \u0442\u0435\u043a\u0441\u0442 \u043d\u0435 \u0432\u0445\u043e\u0434\u0438\u0442\u044c \u0443 \u043a\u0432\u0438\u0442\u0430\u043d\u0446\u0456\u044e.",
    synthesis: { reply: "\u0422\u0438\u0441\u043a \u0441\u0442\u043e\u0441\u0443\u0454\u0442\u044c\u0441\u044f \u0434\u043e\u0432\u0456\u0440\u0438, \u0447\u0430\u0441\u0443 \u0439 \u0430\u0432\u0442\u043e\u0440\u0438\u0442\u0435\u0442\u0443; \u0434\u0430\u0439\u0442\u0435 \u0442\u0435\u043f\u043b\u0443 \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c \u0437 \u043e\u0434\u043d\u0438\u043c \u043d\u0430\u0441\u0442\u0443\u043f\u043d\u0438\u043c \u043a\u0440\u043e\u043a\u043e\u043c.", schedule: "\u0426\u0435 \u043f\u043e\u0442\u0440\u0435\u0431\u0443\u0454 \u0447\u0456\u0442\u043a\u043e\u0433\u043e \u0447\u0430\u0441\u0443 \u0434\u043b\u044f \u043f\u0440\u043e\u0434\u043e\u0432\u0436\u0435\u043d\u043d\u044f, \u0430 \u043d\u0435 \u0431\u0456\u043b\u044c\u0448\u0435 \u0443\u0432\u0430\u0433\u0438 \u0437\u0430\u0440\u0430\u0437.", resolve: "\u0426\u0435 \u0434\u043e\u0441\u0442\u0430\u0442\u043d\u044c\u043e \u044f\u0441\u043d\u043e, \u0449\u043e\u0431 \u0437\u0430\u043f\u0438\u0441\u0430\u0442\u0438 \u0456 \u0432\u0456\u0434\u043f\u0443\u0441\u0442\u0438\u0442\u0438.", escalate: "\u0426\u0435 \u0449\u0435 \u043d\u0435 \u0433\u043e\u0442\u043e\u0432\u0435 \u0434\u043e \u0432\u0456\u0434\u043f\u0440\u0430\u0432\u043a\u0438; \u0441\u0442\u0440\u0438\u043c\u0430\u043d\u0456\u0441\u0442\u044c \u0437\u0430\u0445\u0438\u0449\u0430\u0454 \u0440\u0456\u0448\u0435\u043d\u043d\u044f." },
    mind: { reply: ["\u0421\u043f\u0440\u0430\u0432\u0436\u043d\u0454 \u043f\u0438\u0442\u0430\u043d\u043d\u044f - \u0442\u0440\u0438\u043c\u0430\u0442\u0438 \u0430\u0432\u0442\u043e\u0440\u0438\u0442\u0435\u0442 \u0431\u0435\u0437 \u0432\u0442\u0440\u0430\u0442\u0438 \u0442\u0435\u043f\u043b\u0430.", "\u0412\u0438 \u0437\u0430\u0445\u0438\u0449\u0430\u0454\u0442\u0435 \u0441\u0442\u043e\u0441\u0443\u043d\u043e\u043a \u0456 \u0441\u0432\u043e\u044e \u043f\u043e\u0437\u0438\u0446\u0456\u044e.", "\u041d\u0430\u0434\u0456\u0448\u043b\u0456\u0442\u044c \u0441\u043f\u043e\u043a\u0456\u0439\u043d\u0443 \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c \u0437 \u0432\u0438\u0434\u0438\u043c\u043e\u044e \u043c\u0435\u0436\u0435\u044e."], schedule: ["\u0421\u043f\u0440\u0430\u0432\u0436\u043d\u0454 \u043f\u0438\u0442\u0430\u043d\u043d\u044f - \u0432\u0438\u0442\u0456\u043a \u0443\u0432\u0430\u0433\u0438.", "\u0412\u0430\u0448 \u0440\u043e\u0437\u0443\u043c \u043d\u0435 \u0445\u043e\u0447\u0435 \u043f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u0438 \u0437\u043e\u0431\u043e\u0432'\u044f\u0437\u0430\u043d\u043d\u044f.", "\u041f\u043e\u0441\u0442\u0430\u0432\u0442\u0435 \u043e\u0434\u043d\u0435 \u043f\u0440\u043e\u0434\u043e\u0432\u0436\u0435\u043d\u043d\u044f \u0456 \u0432\u0456\u0434\u043f\u0443\u0441\u0442\u0456\u0442\u044c."], resolve: ["\u0421\u043f\u0440\u0430\u0432\u0436\u043d\u0454 \u043f\u0438\u0442\u0430\u043d\u043d\u044f - \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043d\u044f.", "\u0414\u043e\u0441\u0442\u0430\u0442\u043d\u044f \u043f\u0435\u0432\u043d\u0456\u0441\u0442\u044c \u0443\u0436\u0435 \u0454.", "\u041d\u0430\u0437\u0432\u0456\u0442\u044c \u0440\u0456\u0448\u0435\u043d\u043d\u044f \u0456 \u0437\u0431\u0435\u0440\u0435\u0436\u0456\u0442\u044c \u043a\u0432\u0438\u0442\u0430\u043d\u0446\u0456\u044e."], escalate: ["\u0421\u043f\u0440\u0430\u0432\u0436\u043d\u0454 \u043f\u0438\u0442\u0430\u043d\u043d\u044f - \u0440\u0438\u0437\u0438\u043a \u043f\u0435\u0440\u0435\u0434 \u0441\u043b\u043e\u0432\u0430\u043c\u0438.", "\u0428\u0432\u0438\u0434\u043a\u0456\u0441\u0442\u044c \u043f\u043e\u0437\u0438\u0447\u0438\u0442\u044c \u0432\u0430\u0448 \u0433\u043e\u043b\u043e\u0441.", "\u0423\u0442\u0440\u0438\u043c\u0430\u0439\u0442\u0435 \u0434\u043b\u044f \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0443 \u0434\u043e \u0432\u0456\u0434\u043f\u0440\u0430\u0432\u043a\u0438."] },
    actions: { reply: ["\u041d\u0430\u0434\u0456\u0441\u043b\u0430\u0442\u0438 \u0447\u0456\u0442\u043a\u0443 \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c", "\u0414\u044f\u043a\u0443\u044e \u0437\u0430 \u043f\u0440\u044f\u043c\u043e\u0442\u0443. \u042f \u0440\u043e\u0437\u0443\u043c\u0456\u044e \u0437\u0430\u043d\u0435\u043f\u043e\u043a\u043e\u0454\u043d\u043d\u044f. \u0427\u0438\u0441\u0442\u0438\u0439 \u043d\u0430\u0441\u0442\u0443\u043f\u043d\u0438\u0439 \u043a\u0440\u043e\u043a - \u0437\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u044f\u0441\u043d\u0443 \u0442\u043e\u0447\u043a\u0443 \u0440\u0456\u0448\u0435\u043d\u043d\u044f, \u0437\u0430\u0445\u0438\u0441\u0442\u0438\u0442\u0438 \u0441\u0442\u043e\u0441\u0443\u043d\u043e\u043a \u0456 \u043f\u043e\u0433\u043e\u0434\u0438\u0442\u0438 \u0447\u0430\u0441 \u0431\u0435\u0437 \u0434\u043e\u0434\u0430\u0442\u043a\u043e\u0432\u043e\u0433\u043e \u0442\u0438\u0441\u043a\u0443."], schedule: ["\u041f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043f\u0440\u043e\u0434\u043e\u0432\u0436\u0435\u043d\u043d\u044f", "MindReply \u043f\u0440\u043e\u0434\u043e\u0432\u0436\u0435\u043d\u043d\u044f"], resolve: ["\u041f\u043e\u0437\u043d\u0430\u0447\u0438\u0442\u0438 \u044f\u043a \u0432\u0438\u0440\u0456\u0448\u0435\u043d\u0435", ""], escalate: ["\u0423\u0442\u0440\u0438\u043c\u0430\u0442\u0438 \u0434\u043b\u044f \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0443", ""] },
  },
} satisfies Record<LocaleCode, Copy>;

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
  if (/(follow up|check in|tomorrow|next week|calendar|later|wait|pause|\u043f\u0440\u043e\u0441\u043b\u0435\u0434|\u0443\u0442\u0440\u0435|\u0441\u0440\u0435\u0449\u0430|\u043a\u0430\u043b\u0435\u043d\u0434\u0430\u0440|\u043d\u0430\u0441\u0440\u043e\u0447\u0438|seguimiento|demain|termin|amanh\u00e3|\u0645\u062a\u0627\u0628\u0639\u0629|\u0915\u0932|\u30d5\u30a9\u30ed\u30fc|\u8ddf\u8fdb|\u0437\u0430\u0432\u0442\u0440\u0430)/.test(lower)) return "schedule";
  if (/(reply|client|email|message|fee|price|response|send|say|wording|\u043e\u0442\u0433\u043e\u0432\u043e\u0440|\u043a\u043b\u0438\u0435\u043d\u0442|\u0438\u043c\u0435\u0439\u043b|\u0441\u044a\u043e\u0431\u0449\u0435\u043d\u0438\u0435|\u0446\u0435\u043d\u0430|enviar|r\u00e9pondre|antwort|resposta|\u0631\u062f|\u0909\u0924\u094d\u0924\u0930|\u8fd4\u4fe1|\u56de\u590d|\u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434)/.test(lower)) return "reply";
  return "resolve";
}

function buildSynthesis(input: string, kind: RecommendedActionKind, locale: LocaleCode) {
  if (!input) return localized[locale].noInput;
  return localized[locale].synthesis[kind];
}

function buildMindRead(kind: RecommendedActionKind, locale: LocaleCode): DecisionResponse["mindRead"] {
  const [reallyAbout, mindsetProtection, calmerMove] = localized[locale].mind[kind];
  return { reallyAbout, mindsetProtection, calmerMove };
}

function buildAction(kind: RecommendedActionKind, synthesis: string, locale: LocaleCode): DecisionResponse["recommendedAction"] {
  const [label, text] = localized[locale].actions[kind];
  if (kind === "reply") {
    return { kind, label, payload: { draft: text } };
  }
  if (kind === "schedule") {
    return { kind, label, payload: { title: text, delayMinutes: 60 } };
  }
  if (kind === "escalate") {
    return { kind, label, payload: { reason: synthesis } };
  }
  return { kind, label, payload: { record: synthesis } };
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
