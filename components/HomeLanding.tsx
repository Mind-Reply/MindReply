"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gauge,
  Globe2,
  HeartHandshake,
  Mail,
  ReceiptText,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import MRAgentChat from "@/components/MRAgentChat";

type LocaleKey = "en" | "es" | "fr" | "de" | "it" | "pt" | "nl" | "pl" | "uk" | "bg";

type LandingCopy = {
  languageName: string;
  nav: string[];
  websitePackage: string;
  tryAgent: string;
  eyebrow: string;
  h1: string;
  heroBody: string;
  primaryCta: string;
  invoiceCta: string;
  payCta: string;
  fullPackCta: string;
  firstOutputLabel: string;
  firstOutputValue: string;
  paidOfferLabel: string;
  paidOfferValue: string;
  paymentRouteLabel: string;
  packageRouteInvoice: string;
  packageRoutePayment: string;
  offerEyebrow: string;
  offerTitle: string;
  offerBody: string;
  packageTotal: string;
  packageTotalBody: string;
  packageRows: Array<{ title: string; value: string; copy: string }>;
  authorityEyebrow: string;
  authorityTitle: string;
  authorityBody: string;
  authoritySignals: Array<{ title: string; copy: string }>;
  closeEyebrow: string;
  closeTitle: string;
  closeBody: string;
  closeSteps: Array<{ step: string; title: string; copy: string }>;
  proofEyebrow: string;
  proofTitle: string;
  proofBody: string;
  proofItems: string[];
  demandEyebrow: string;
  demandTitle: string;
  demandBody: string;
  demandItems: Array<{ title: string; copy: string }>;
  finalEyebrow: string;
  finalTitle: string;
  footerTagline: string;
  languageLabel: string;
  detectedLabel: string;
  autoLabel: string;
};

const supportEmail = "info@mind-reply.com";

const localeOptions: Array<{ key: LocaleKey; label: string }> = [
  { key: "en", label: "EN" },
  { key: "es", label: "ES" },
  { key: "fr", label: "FR" },
  { key: "de", label: "DE" },
  { key: "it", label: "IT" },
  { key: "pt", label: "PT" },
  { key: "nl", label: "NL" },
  { key: "pl", label: "PL" },
  { key: "uk", label: "UA" },
  { key: "bg", label: "BG" },
];

const countryLocale: Record<string, LocaleKey> = {
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  IE: "en",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  FR: "fr",
  BE: "fr",
  DE: "de",
  AT: "de",
  CH: "de",
  IT: "it",
  PT: "pt",
  BR: "pt",
  NL: "nl",
  PL: "pl",
  UA: "uk",
  BG: "bg",
};

const copy: Record<LocaleKey, LandingCopy> = {
  en: {
    languageName: "English",
    nav: ["Offer", "Authority", "Proof", "Pricing"],
    websitePackage: "Website Package",
    tryAgent: "Try MRagent",
    eyebrow: "Premium reply intelligence",
    h1: "Confident replies, clear decisions, and a cleaner website in 24 hours.",
    heroBody:
      "MindReply turns email pressure, Slack noise, follow-ups, and website confusion into one calm action queue or a send-ready message. The language is warm, precise, and easy to use.",
    primaryCta: "Try the Mind Read",
    invoiceCta: "Request invoice - GBP 600",
    payCta: "Pay GBP 600 package",
    fullPackCta: "View full package info",
    firstOutputLabel: "First output",
    firstOutputValue: "Action queue or send-ready message",
    paidOfferLabel: "Paid offer",
    paidOfferValue: "GBP 600 Website Completion Package",
    paymentRouteLabel: "Payment route",
    packageRouteInvoice: "Invoice request ready",
    packageRoutePayment: "Direct payment enabled",
    offerEyebrow: "Fixed-scope package",
    offerTitle: "Website Completion Package",
    offerBody:
      "A focused rescue for overloaded websites and communication queues: sharper offer language, ranked fixes, trust wording, and a buyer path that does not feel heavy.",
    packageTotal: "Package total",
    packageTotalBody: "Three concrete rows. One clear receipt. No long setup.",
    packageRows: [
      {
        title: "Website message diagnosis",
        value: "GBP 200",
        copy: "Your homepage, offer, and contact story are read as one commercial system, then tightened into buyer-ready language.",
      },
      {
        title: "Ranked action queue",
        value: "GBP 200",
        copy: "The next fixes are ordered by revenue impact: remove confusion, build trust, and push the visitor toward a clean action.",
      },
      {
        title: "Send-ready copy and receipt",
        value: "GBP 200",
        copy: "You receive usable website copy, a reply or next-step structure, consent wording, and a privacy-safe receipt.",
      },
    ],
    authorityEyebrow: "Authority layer",
    authorityTitle: "High-end language, plain enough to act on.",
    authorityBody:
      "MindReply positions above generic AI writing by combining emotional read, decision structure, risk control, and buyer-ready website language.",
    authoritySignals: [
      {
        title: "Communication discipline",
        copy: "The output is not more text. It is cleaner judgment, sharper phrasing, and a message that protects the relationship.",
      },
      {
        title: "Behavioral read",
        copy: "MRagent names what the pressure is really about, where the reflex is coming from, and which move is safest.",
      },
      {
        title: "Inspectable structure",
        copy: "Each response can show synthesis, action, risk, confidence, and receipt so the result is useful, not mystical.",
      },
      {
        title: "Consent first",
        copy: "Email, Slack, memory, and security lanes are only described as active when credentials, consent, and proof exist.",
      },
    ],
    closeEyebrow: "Assisted close",
    closeTitle: "The buyer path stays short and deliberate.",
    closeBody:
      "A visitor should feel the pressure loosen, understand the package, and know where to try MRagent, pay, or request an invoice.",
    closeSteps: [
      {
        step: "01",
        title: "Try the read",
        copy: "Paste the pressure into MRagent and receive one synthesis, one action, and a risk gate before paying.",
      },
      {
        step: "02",
        title: "Buy or request invoice",
        copy: "Use the configured payment link or request an invoice for the Website Completion Package.",
      },
      {
        step: "03",
        title: "Receive the queue",
        copy: "Delivery includes ranked fixes, send-ready copy, visible next steps, consent wording, and a receipt.",
      },
    ],
    proofEyebrow: "Trust proof",
    proofTitle: "Warm, premium, strict about evidence.",
    proofBody:
      "Serious buyers need a believable promise, a clear route, and claims that survive inspection.",
    proofItems: [
      "Public contact uses info@mind-reply.com only.",
      "MRagent is the first support route; contact is the assisted close when human follow-up is needed.",
      "Receipts stay narrow and avoid exposing raw private pressure in public reports.",
      "Revenue, deployment, and integration claims stay tied to real sources.",
    ],
    demandEyebrow: "Search demand focus",
    demandTitle: "Positioned where buyers are already looking.",
    demandBody:
      "The strongest lane is not generic AI writing. It is decision support, reply confidence, AI-search visibility, and website conversion rescue.",
    demandItems: [
      {
        title: "AI decision support",
        copy: "For founders and operators who need one recommended move, not a wall of options.",
      },
      {
        title: "AI email reply assistant",
        copy: "For teams that want warmer replies, cleaner escalation, and fewer delayed decisions.",
      },
      {
        title: "Website conversion rescue",
        copy: "For service businesses with unclear offers, weak proof, and heavy buying friction.",
      },
    ],
    finalEyebrow: "Next revenue move",
    finalTitle: "Start with MRagent. Escalate to the Website Completion Package when the queue needs a full rescue.",
    footerTagline: "Premium reply intelligence for pressure, decisions, and buyer-ready communication.",
    languageLabel: "Language",
    detectedLabel: "Detected",
    autoLabel: "Auto",
  },
  es: {
    languageName: "Espanol",
    nav: ["Oferta", "Autoridad", "Prueba", "Precio"],
    websitePackage: "Paquete web",
    tryAgent: "Probar MRagent",
    eyebrow: "Inteligencia premium de respuesta",
    h1: "Respuestas seguras, decisiones claras y una web mas limpia en 24 horas.",
    heroBody:
      "MindReply convierte presion de email, Slack, seguimientos y confusion web en una cola de acciones o un mensaje listo para enviar.",
    primaryCta: "Probar lectura",
    invoiceCta: "Pedir factura - GBP 600",
    payCta: "Pagar paquete GBP 600",
    fullPackCta: "Ver paquete completo",
    firstOutputLabel: "Primer resultado",
    firstOutputValue: "Cola de accion o mensaje listo",
    paidOfferLabel: "Oferta pagada",
    paidOfferValue: "Paquete web GBP 600",
    paymentRouteLabel: "Ruta de pago",
    packageRouteInvoice: "Factura lista",
    packageRoutePayment: "Pago directo activo",
    offerEyebrow: "Paquete cerrado",
    offerTitle: "Website Completion Package",
    offerBody: "Rescate enfocado para una web cargada: oferta mas clara, prioridades, confianza y camino de compra ligero.",
    packageTotal: "Total",
    packageTotalBody: "Tres partes concretas. Un recibo claro. Sin configuracion larga.",
    packageRows: [
      { title: "Diagnostico del mensaje", value: "GBP 200", copy: "La pagina, la oferta y el contacto se convierten en una historia comercial clara." },
      { title: "Cola priorizada", value: "GBP 200", copy: "Los arreglos se ordenan por impacto: claridad, confianza y accion." },
      { title: "Copy listo y recibo", value: "GBP 200", copy: "Recibes texto usable, siguiente paso, consentimiento y recibo privado." },
    ],
    authorityEyebrow: "Autoridad",
    authorityTitle: "Lenguaje de alto nivel, simple para actuar.",
    authorityBody: "MindReply sube por encima del copy generico con lectura emocional, decision, riesgo y lenguaje comercial.",
    authoritySignals: [
      { title: "Disciplina", copy: "No es mas texto; es mejor juicio y una frase que protege la relacion." },
      { title: "Lectura conductual", copy: "MRagent nombra la presion real y el movimiento mas seguro." },
      { title: "Estructura verificable", copy: "Sintesis, accion, riesgo, confianza y recibo." },
      { title: "Consentimiento primero", copy: "Email, Slack y memoria solo se anuncian cuando existen prueba y permiso." },
    ],
    closeEyebrow: "Cierre asistido",
    closeTitle: "El camino del comprador queda corto y claro.",
    closeBody: "La persona entiende el paquete, prueba MRagent y sabe si pagar o pedir factura.",
    closeSteps: [
      { step: "01", title: "Prueba", copy: "Pega la presion y recibe una sintesis, una accion y un control de riesgo." },
      { step: "02", title: "Paga o factura", copy: "Usa el enlace de pago o solicita factura." },
      { step: "03", title: "Recibe cola", copy: "Entrega con prioridades, copy listo, consentimiento y recibo." },
    ],
    proofEyebrow: "Prueba",
    proofTitle: "Calido, premium y estricto con evidencia.",
    proofBody: "Los compradores serios necesitan promesas creibles y ruta clara.",
    proofItems: [
      "Contacto publico: info@mind-reply.com.",
      "MRagent es la primera ruta de soporte.",
      "Los recibos evitan exponer presion privada.",
      "Las afirmaciones se atan a fuentes reales.",
    ],
    demandEyebrow: "Demanda SEO",
    demandTitle: "Posicionado donde ya hay intencion.",
    demandBody: "La oportunidad es decision, respuesta, busqueda AI y conversion web.",
    demandItems: [
      { title: "Decision AI", copy: "Una recomendacion clara para fundadores y operadores." },
      { title: "Email assistant", copy: "Respuestas mas calidas y menos retrasos." },
      { title: "Conversion web", copy: "Ofertas mas claras y menos friccion." },
    ],
    finalEyebrow: "Siguiente ingreso",
    finalTitle: "Empieza con MRagent. Sube al paquete cuando la cola necesite rescate completo.",
    footerTagline: "Inteligencia premium para presion, decisiones y comunicacion lista para comprar.",
    languageLabel: "Idioma",
    detectedLabel: "Detectado",
    autoLabel: "Auto",
  },
  fr: {
    languageName: "Francais",
    nav: ["Offre", "Autorite", "Preuve", "Prix"],
    websitePackage: "Pack site",
    tryAgent: "Essayer MRagent",
    eyebrow: "Intelligence de reponse premium",
    h1: "Reponses sures, decisions nettes et site plus clair en 24 heures.",
    heroBody: "MindReply transforme la pression email, Slack, relances et confusion web en une action claire ou un message pret a envoyer.",
    primaryCta: "Essayer la lecture",
    invoiceCta: "Demander facture - GBP 600",
    payCta: "Payer GBP 600",
    fullPackCta: "Voir le pack complet",
    firstOutputLabel: "Premier resultat",
    firstOutputValue: "File d'action ou message pret",
    paidOfferLabel: "Offre payante",
    paidOfferValue: "Pack site GBP 600",
    paymentRouteLabel: "Paiement",
    packageRouteInvoice: "Facture prete",
    packageRoutePayment: "Paiement direct actif",
    offerEyebrow: "Perimetre fixe",
    offerTitle: "Website Completion Package",
    offerBody: "Un sauvetage concentre: offre plus nette, priorites, confiance et chemin d'achat simple.",
    packageTotal: "Total",
    packageTotalBody: "Trois livrables. Un recu clair. Pas de longue installation.",
    packageRows: [
      { title: "Diagnostic message", value: "GBP 200", copy: "Page, offre et contact deviennent un systeme commercial lisible." },
      { title: "File priorisee", value: "GBP 200", copy: "Les actions suivent l'impact: clarte, preuve, conversion." },
      { title: "Texte pret", value: "GBP 200", copy: "Copie utilisable, prochaine etape, consentement et recu prive." },
    ],
    authorityEyebrow: "Autorite",
    authorityTitle: "Langage haut de gamme, simple a appliquer.",
    authorityBody: "MindReply va au-dela de l'ecriture AI generique avec lecture, decision, risque et conversion.",
    authoritySignals: [
      { title: "Discipline", copy: "Moins de volume, plus de jugement et de tact." },
      { title: "Lecture comportementale", copy: "MRagent nomme la vraie pression et l'action sure." },
      { title: "Structure verifiable", copy: "Synthese, action, risque, confiance et recu." },
      { title: "Consentement", copy: "Les integrations ne sont annoncees qu'avec preuve et permission." },
    ],
    closeEyebrow: "Cloture aidee",
    closeTitle: "Le parcours acheteur reste court.",
    closeBody: "Tester, comprendre le pack, payer ou demander facture.",
    closeSteps: [
      { step: "01", title: "Tester", copy: "Collez la pression et recevez synthese, action, risque." },
      { step: "02", title: "Payer ou facture", copy: "Lien de paiement ou demande de facture." },
      { step: "03", title: "Recevoir", copy: "Priorites, textes, consentement et recu." },
    ],
    proofEyebrow: "Preuve",
    proofTitle: "Chaud, premium, exigeant sur la preuve.",
    proofBody: "Une promesse credible et une route claire.",
    proofItems: ["Contact public: info@mind-reply.com.", "MRagent d'abord.", "Recus prives.", "Claims lies a des sources."],
    demandEyebrow: "Demande SEO",
    demandTitle: "Place la ou l'intention existe.",
    demandBody: "Decision, reponse email, visibilite AI-search et conversion web.",
    demandItems: [
      { title: "Decision AI", copy: "Une action recommandee au lieu de trop d'options." },
      { title: "Assistant email", copy: "Reponses plus humaines et plus rapides." },
      { title: "Conversion site", copy: "Offre plus claire et moins de friction." },
    ],
    finalEyebrow: "Prochaine action revenu",
    finalTitle: "Commencez avec MRagent. Passez au pack quand la file exige un sauvetage complet.",
    footerTagline: "Intelligence premium pour pression, decisions et communication achetable.",
    languageLabel: "Langue",
    detectedLabel: "Detecte",
    autoLabel: "Auto",
  },
  de: {
    languageName: "Deutsch",
    nav: ["Angebot", "Autoritat", "Beweis", "Preis"],
    websitePackage: "Website Paket",
    tryAgent: "MRagent testen",
    eyebrow: "Premium Antwortintelligenz",
    h1: "Sichere Antworten, klare Entscheidungen und eine bessere Website in 24 Stunden.",
    heroBody: "MindReply macht aus E-Mail-Druck, Slack-Rauschen, Follow-ups und Website-Unklarheit eine ruhige Aktionsliste oder sendefertige Nachricht.",
    primaryCta: "Mind Read testen",
    invoiceCta: "Rechnung anfragen - GBP 600",
    payCta: "GBP 600 Paket zahlen",
    fullPackCta: "Paketdetails ansehen",
    firstOutputLabel: "Erstes Ergebnis",
    firstOutputValue: "Aktionsliste oder Nachricht",
    paidOfferLabel: "Bezahltes Angebot",
    paidOfferValue: "Website Completion Package GBP 600",
    paymentRouteLabel: "Zahlung",
    packageRouteInvoice: "Rechnung bereit",
    packageRoutePayment: "Direktzahlung aktiv",
    offerEyebrow: "Fester Umfang",
    offerTitle: "Website Completion Package",
    offerBody: "Ein fokussierter Website-Rescue: klareres Angebot, Prioritaten, Vertrauen und kurzer Kaufweg.",
    packageTotal: "Gesamt",
    packageTotalBody: "Drei konkrete Teile. Ein klarer Beleg. Kein langes Setup.",
    packageRows: [
      { title: "Message Diagnose", value: "GBP 200", copy: "Homepage, Angebot und Kontakt werden als kaufbares System geschärft." },
      { title: "Priorisierte Queue", value: "GBP 200", copy: "Fixes nach Wirkung: Klarheit, Vertrauen, Handlung." },
      { title: "Fertiger Text", value: "GBP 200", copy: "Website-Text, Antwortstruktur, Consent und privater Beleg." },
    ],
    authorityEyebrow: "Autoritat",
    authorityTitle: "Gehobene Sprache, einfach genug zum Handeln.",
    authorityBody: "MindReply ist mehr als generisches Schreiben: emotionale Lesart, Entscheidung, Risiko und Conversion.",
    authoritySignals: [
      { title: "Disziplin", copy: "Nicht mehr Text, sondern bessere Entscheidung und Takt." },
      { title: "Verhaltenslesart", copy: "MRagent benennt Druck und sicheren Zug." },
      { title: "Prufbare Struktur", copy: "Synthese, Aktion, Risiko, Vertrauen, Beleg." },
      { title: "Consent zuerst", copy: "Integrationen nur mit Nachweis und Erlaubnis." },
    ],
    closeEyebrow: "Assistierter Abschluss",
    closeTitle: "Der Kaufweg bleibt kurz.",
    closeBody: "Testen, Paket verstehen, zahlen oder Rechnung anfragen.",
    closeSteps: [
      { step: "01", title: "Testen", copy: "Druck einfugen und Synthese, Aktion, Risiko erhalten." },
      { step: "02", title: "Zahlen oder Rechnung", copy: "Direktlink oder Rechnung." },
      { step: "03", title: "Queue erhalten", copy: "Prioritaten, Texte, Consent und Beleg." },
    ],
    proofEyebrow: "Beweis",
    proofTitle: "Warm, premium, beweisorientiert.",
    proofBody: "Kaufende brauchen klare Versprechen und klare Route.",
    proofItems: ["Kontakt: info@mind-reply.com.", "MRagent zuerst.", "Private Belege.", "Claims mit Quellen."],
    demandEyebrow: "SEO Nachfrage",
    demandTitle: "Dort positioniert, wo Absicht ist.",
    demandBody: "Decision Support, Reply Confidence, AI Search und Website Conversion.",
    demandItems: [
      { title: "AI Entscheidung", copy: "Eine klare Empfehlung statt Optionsflut." },
      { title: "E-Mail Assistent", copy: "Warmere Antworten und weniger Verzogerung." },
      { title: "Website Rescue", copy: "Klarere Angebote und weniger Reibung." },
    ],
    finalEyebrow: "Nachster Revenue Move",
    finalTitle: "Mit MRagent starten. Zum Paket wechseln, wenn die Queue voll gerettet werden muss.",
    footerTagline: "Premium Intelligenz fur Druck, Entscheidungen und kaufbare Kommunikation.",
    languageLabel: "Sprache",
    detectedLabel: "Erkannt",
    autoLabel: "Auto",
  },
  it: {
    languageName: "Italiano",
    nav: ["Offerta", "Autorita", "Prova", "Prezzo"],
    websitePackage: "Pacchetto sito",
    tryAgent: "Prova MRagent",
    eyebrow: "Intelligenza premium di risposta",
    h1: "Risposte sicure, decisioni chiare e un sito piu pulito in 24 ore.",
    heroBody: "MindReply trasforma pressione email, Slack, follow-up e confusione del sito in una coda d'azione o messaggio pronto.",
    primaryCta: "Prova la lettura",
    invoiceCta: "Richiedi fattura - GBP 600",
    payCta: "Paga GBP 600",
    fullPackCta: "Vedi pacchetto",
    firstOutputLabel: "Primo output",
    firstOutputValue: "Coda o messaggio pronto",
    paidOfferLabel: "Offerta pagata",
    paidOfferValue: "Pacchetto sito GBP 600",
    paymentRouteLabel: "Pagamento",
    packageRouteInvoice: "Fattura pronta",
    packageRoutePayment: "Pagamento diretto attivo",
    offerEyebrow: "Scope fisso",
    offerTitle: "Website Completion Package",
    offerBody: "Rescue mirato: offerta chiara, priorita, fiducia e acquisto leggero.",
    packageTotal: "Totale",
    packageTotalBody: "Tre parti concrete. Una ricevuta chiara. Nessun setup lungo.",
    packageRows: [
      { title: "Diagnosi messaggio", value: "GBP 200", copy: "Homepage, offerta e contatto diventano un sistema commerciale." },
      { title: "Coda prioritaria", value: "GBP 200", copy: "Fix ordinati per chiarezza, fiducia e azione." },
      { title: "Copy pronto", value: "GBP 200", copy: "Testo, risposta, consenso e ricevuta privata." },
    ],
    authorityEyebrow: "Autorita",
    authorityTitle: "Linguaggio alto, semplice da usare.",
    authorityBody: "Oltre la scrittura AI generica: lettura emotiva, decisione, rischio e conversione.",
    authoritySignals: [
      { title: "Disciplina", copy: "Meno testo, piu giudizio e tatto." },
      { title: "Lettura comportamentale", copy: "MRagent nomina pressione e mossa sicura." },
      { title: "Struttura", copy: "Sintesi, azione, rischio, fiducia, ricevuta." },
      { title: "Consenso", copy: "Integrazioni solo con prova e permesso." },
    ],
    closeEyebrow: "Chiusura assistita",
    closeTitle: "Percorso corto e chiaro.",
    closeBody: "Prova, capisci il pacchetto, paga o chiedi fattura.",
    closeSteps: [
      { step: "01", title: "Prova", copy: "Incolla la pressione e ricevi sintesi, azione, rischio." },
      { step: "02", title: "Paga o fattura", copy: "Link di pagamento o richiesta fattura." },
      { step: "03", title: "Ricevi", copy: "Priorita, copy, consenso e ricevuta." },
    ],
    proofEyebrow: "Prova",
    proofTitle: "Caldo, premium, verificabile.",
    proofBody: "Promessa credibile e strada chiara.",
    proofItems: ["Contatto: info@mind-reply.com.", "MRagent prima.", "Ricevute private.", "Claim verificabili."],
    demandEyebrow: "Domanda SEO",
    demandTitle: "Dove l'intento e gia forte.",
    demandBody: "Decisioni, email, AI search e conversione sito.",
    demandItems: [
      { title: "Decisione AI", copy: "Una raccomandazione chiara." },
      { title: "Assistente email", copy: "Risposte piu umane e veloci." },
      { title: "Conversione sito", copy: "Offerte chiare e meno attrito." },
    ],
    finalEyebrow: "Prossima mossa revenue",
    finalTitle: "Inizia con MRagent. Passa al pacchetto quando serve rescue completo.",
    footerTagline: "Intelligenza premium per pressione, decisioni e comunicazione pronta.",
    languageLabel: "Lingua",
    detectedLabel: "Rilevato",
    autoLabel: "Auto",
  },
  pt: {
    languageName: "Portugues",
    nav: ["Oferta", "Autoridade", "Prova", "Preco"],
    websitePackage: "Pacote site",
    tryAgent: "Testar MRagent",
    eyebrow: "Inteligencia premium de resposta",
    h1: "Respostas confiantes, decisoes claras e site mais limpo em 24 horas.",
    heroBody: "MindReply transforma pressao de email, Slack, follow-ups e confusao do site em uma fila de acao ou mensagem pronta.",
    primaryCta: "Testar leitura",
    invoiceCta: "Pedir fatura - GBP 600",
    payCta: "Pagar GBP 600",
    fullPackCta: "Ver pacote",
    firstOutputLabel: "Primeiro output",
    firstOutputValue: "Fila ou mensagem pronta",
    paidOfferLabel: "Oferta paga",
    paidOfferValue: "Pacote site GBP 600",
    paymentRouteLabel: "Pagamento",
    packageRouteInvoice: "Fatura pronta",
    packageRoutePayment: "Pagamento direto ativo",
    offerEyebrow: "Escopo fixo",
    offerTitle: "Website Completion Package",
    offerBody: "Resgate focado: oferta clara, prioridades, confianca e caminho de compra leve.",
    packageTotal: "Total",
    packageTotalBody: "Tres entregas. Um recibo claro. Sem setup longo.",
    packageRows: [
      { title: "Diagnostico", value: "GBP 200", copy: "Pagina, oferta e contato viram um sistema comercial claro." },
      { title: "Fila priorizada", value: "GBP 200", copy: "Acoes por impacto: clareza, confianca e acao." },
      { title: "Copy pronto", value: "GBP 200", copy: "Texto, proximo passo, consentimento e recibo privado." },
    ],
    authorityEyebrow: "Autoridade",
    authorityTitle: "Linguagem premium, simples para agir.",
    authorityBody: "Mais que escrita AI generica: leitura emocional, decisao, risco e conversao.",
    authoritySignals: [
      { title: "Disciplina", copy: "Menos texto, mais julgamento." },
      { title: "Leitura comportamental", copy: "MRagent identifica pressao e movimento seguro." },
      { title: "Estrutura", copy: "Sintese, acao, risco, confianca e recibo." },
      { title: "Consentimento", copy: "Integracoes so com prova e permissao." },
    ],
    closeEyebrow: "Fechamento assistido",
    closeTitle: "Caminho curto e claro.",
    closeBody: "Testar, entender o pacote, pagar ou pedir fatura.",
    closeSteps: [
      { step: "01", title: "Testar", copy: "Cole a pressao e receba sintese, acao e risco." },
      { step: "02", title: "Pagar ou fatura", copy: "Link de pagamento ou fatura." },
      { step: "03", title: "Receber", copy: "Prioridades, copy, consentimento e recibo." },
    ],
    proofEyebrow: "Prova",
    proofTitle: "Calido, premium e verificavel.",
    proofBody: "Promessa crivel e rota clara.",
    proofItems: ["Contato: info@mind-reply.com.", "MRagent primeiro.", "Recibos privados.", "Claims com fontes."],
    demandEyebrow: "Demanda SEO",
    demandTitle: "Onde a intencao ja existe.",
    demandBody: "Decisao, email, AI search e conversao web.",
    demandItems: [
      { title: "Decisao AI", copy: "Uma recomendacao clara." },
      { title: "Assistente email", copy: "Respostas melhores e mais rapidas." },
      { title: "Conversao web", copy: "Oferta clara e menos atrito." },
    ],
    finalEyebrow: "Proximo movimento",
    finalTitle: "Comece com MRagent. Suba para o pacote quando a fila precisar resgate completo.",
    footerTagline: "Inteligencia premium para pressao, decisoes e comunicacao pronta.",
    languageLabel: "Idioma",
    detectedLabel: "Detectado",
    autoLabel: "Auto",
  },
  nl: {
    languageName: "Nederlands",
    nav: ["Aanbod", "Autoriteit", "Bewijs", "Prijs"],
    websitePackage: "Website pakket",
    tryAgent: "Probeer MRagent",
    eyebrow: "Premium antwoordintelligentie",
    h1: "Zekere antwoorden, heldere besluiten en een betere website in 24 uur.",
    heroBody: "MindReply maakt van e-maildruk, Slack-ruis, follow-ups en websiteverwarring een rustige actielijst of verzendklare tekst.",
    primaryCta: "Probeer de read",
    invoiceCta: "Factuur vragen - GBP 600",
    payCta: "Betaal GBP 600",
    fullPackCta: "Bekijk pakket",
    firstOutputLabel: "Eerste output",
    firstOutputValue: "Actielijst of bericht",
    paidOfferLabel: "Betaald aanbod",
    paidOfferValue: "Website pakket GBP 600",
    paymentRouteLabel: "Betaling",
    packageRouteInvoice: "Factuur klaar",
    packageRoutePayment: "Direct betalen actief",
    offerEyebrow: "Vaste scope",
    offerTitle: "Website Completion Package",
    offerBody: "Gerichte rescue: duidelijker aanbod, prioriteiten, vertrouwen en korte kooproute.",
    packageTotal: "Totaal",
    packageTotalBody: "Drie concrete onderdelen. Een helder bewijs. Geen lang setup.",
    packageRows: [
      { title: "Message diagnose", value: "GBP 200", copy: "Homepage, aanbod en contact worden een helder commercieel systeem." },
      { title: "Prioriteitenlijst", value: "GBP 200", copy: "Acties op impact: duidelijkheid, vertrouwen, actie." },
      { title: "Tekst en receipt", value: "GBP 200", copy: "Bruikbare copy, vervolgstap, consent en prive receipt." },
    ],
    authorityEyebrow: "Autoriteit",
    authorityTitle: "Hoogwaardige taal, eenvoudig toepasbaar.",
    authorityBody: "Boven generieke AI writing: emotionele read, besluit, risico en conversie.",
    authoritySignals: [
      { title: "Discipline", copy: "Minder tekst, meer oordeel." },
      { title: "Gedragsread", copy: "MRagent benoemt druk en veilige stap." },
      { title: "Structuur", copy: "Synthese, actie, risico, vertrouwen, receipt." },
      { title: "Consent eerst", copy: "Integraties alleen met bewijs en toestemming." },
    ],
    closeEyebrow: "Assisted close",
    closeTitle: "De kooproute blijft kort.",
    closeBody: "Testen, pakket begrijpen, betalen of factuur vragen.",
    closeSteps: [
      { step: "01", title: "Test", copy: "Plak druk en krijg synthese, actie, risico." },
      { step: "02", title: "Betaal of factuur", copy: "Betaallink of factuur." },
      { step: "03", title: "Ontvang", copy: "Prioriteiten, copy, consent en receipt." },
    ],
    proofEyebrow: "Bewijs",
    proofTitle: "Warm, premium, bewijsbaar.",
    proofBody: "Een geloofwaardige belofte en duidelijke route.",
    proofItems: ["Contact: info@mind-reply.com.", "MRagent eerst.", "Private receipts.", "Claims met bronnen."],
    demandEyebrow: "SEO vraag",
    demandTitle: "Waar intentie al bestaat.",
    demandBody: "Besluiten, e-mail, AI search en websiteconversie.",
    demandItems: [
      { title: "AI besluit", copy: "Een heldere aanbeveling." },
      { title: "E-mail assistent", copy: "Warmere antwoorden, minder vertraging." },
      { title: "Website conversie", copy: "Helder aanbod, minder frictie." },
    ],
    finalEyebrow: "Volgende revenue stap",
    finalTitle: "Start met MRagent. Ga naar het pakket als de queue volledige rescue nodig heeft.",
    footerTagline: "Premium intelligentie voor druk, besluiten en koopklare communicatie.",
    languageLabel: "Taal",
    detectedLabel: "Gedetecteerd",
    autoLabel: "Auto",
  },
  pl: {
    languageName: "Polski",
    nav: ["Oferta", "Autorytet", "Dowod", "Cena"],
    websitePackage: "Pakiet strony",
    tryAgent: "Wyprobuj MRagent",
    eyebrow: "Premium inteligencja odpowiedzi",
    h1: "Pewne odpowiedzi, jasne decyzje i lepsza strona w 24 godziny.",
    heroBody: "MindReply zmienia presje email, Slack, follow-upy i chaos na stronie w spokojna kolejke dzialan albo gotowa wiadomosc.",
    primaryCta: "Wyprobuj odczyt",
    invoiceCta: "Popros o fakture - GBP 600",
    payCta: "Zaplac GBP 600",
    fullPackCta: "Zobacz pakiet",
    firstOutputLabel: "Pierwszy wynik",
    firstOutputValue: "Kolejka lub wiadomosc",
    paidOfferLabel: "Oferta platna",
    paidOfferValue: "Pakiet strony GBP 600",
    paymentRouteLabel: "Platnosc",
    packageRouteInvoice: "Faktura gotowa",
    packageRoutePayment: "Platnosc aktywna",
    offerEyebrow: "Staly zakres",
    offerTitle: "Website Completion Package",
    offerBody: "Skupiony rescue: jasniejsza oferta, priorytety, zaufanie i prosty zakup.",
    packageTotal: "Razem",
    packageTotalBody: "Trzy konkretne czesci. Jasny receipt. Bez dlugiego setupu.",
    packageRows: [
      { title: "Diagnoza komunikatu", value: "GBP 200", copy: "Strona, oferta i kontakt staja sie klarownym systemem sprzedazy." },
      { title: "Kolejka priorytetow", value: "GBP 200", copy: "Dzialania wedlug efektu: jasnosc, zaufanie, akcja." },
      { title: "Gotowy copy", value: "GBP 200", copy: "Tekst, nastepny krok, zgoda i prywatny receipt." },
    ],
    authorityEyebrow: "Autorytet",
    authorityTitle: "Wysoki jezyk, prosty do uzycia.",
    authorityBody: "Ponad zwykle AI writing: odczyt emocji, decyzja, ryzyko i konwersja.",
    authoritySignals: [
      { title: "Dyscyplina", copy: "Mniej tekstu, wiecej osadu." },
      { title: "Odczyt zachowania", copy: "MRagent nazywa presje i bezpieczny ruch." },
      { title: "Struktura", copy: "Synteza, akcja, ryzyko, pewnosc, receipt." },
      { title: "Zgoda najpierw", copy: "Integracje tylko z dowodem i zgoda." },
    ],
    closeEyebrow: "Wsparty zakup",
    closeTitle: "Sciezka kupna jest krotka.",
    closeBody: "Test, zrozumienie pakietu, platnosc albo faktura.",
    closeSteps: [
      { step: "01", title: "Test", copy: "Wklej presje i otrzymaj synteze, akcje, ryzyko." },
      { step: "02", title: "Platnosc lub faktura", copy: "Link albo faktura." },
      { step: "03", title: "Odbior", copy: "Priorytety, copy, zgoda i receipt." },
    ],
    proofEyebrow: "Dowod",
    proofTitle: "Cieplo, premium, z dowodem.",
    proofBody: "Wiarygodna obietnica i jasna droga.",
    proofItems: ["Kontakt: info@mind-reply.com.", "MRagent pierwszy.", "Prywatne receipts.", "Claims zrodlowe."],
    demandEyebrow: "Popyt SEO",
    demandTitle: "Tam, gdzie jest intencja.",
    demandBody: "Decyzje, email, AI search i konwersja strony.",
    demandItems: [
      { title: "AI decyzja", copy: "Jedna jasna rekomendacja." },
      { title: "Email assistant", copy: "Cieplejsze odpowiedzi, mniej opoznien." },
      { title: "Konwersja strony", copy: "Jasna oferta i mniej tarcia." },
    ],
    finalEyebrow: "Nastepny revenue move",
    finalTitle: "Zacznij od MRagent. Przejdz do pakietu, gdy kolejka wymaga pelnego rescue.",
    footerTagline: "Premium inteligencja dla presji, decyzji i komunikacji gotowej do zakupu.",
    languageLabel: "Jezyk",
    detectedLabel: "Wykryto",
    autoLabel: "Auto",
  },
  uk: {
    languageName: "Українська",
    nav: ["Пропозиція", "Авторитет", "Доказ", "Ціна"],
    websitePackage: "Пакет сайту",
    tryAgent: "Спробувати MRagent",
    eyebrow: "Преміальна інтелектуальна відповідь",
    h1: "Впевнені відповіді, ясні рішення і сильніший сайт за 24 години.",
    heroBody: "MindReply перетворює тиск у пошті, Slack, follow-up і плутанину на сайті в спокійну чергу дій або готове повідомлення.",
    primaryCta: "Спробувати читання",
    invoiceCta: "Запитати рахунок - GBP 600",
    payCta: "Оплатити GBP 600",
    fullPackCta: "Деталі пакету",
    firstOutputLabel: "Перший результат",
    firstOutputValue: "Черга дій або готове повідомлення",
    paidOfferLabel: "Платна пропозиція",
    paidOfferValue: "Пакет сайту GBP 600",
    paymentRouteLabel: "Оплата",
    packageRouteInvoice: "Рахунок готовий",
    packageRoutePayment: "Пряма оплата активна",
    offerEyebrow: "Фіксований обсяг",
    offerTitle: "Website Completion Package",
    offerBody: "Фокусне доопрацювання сайту: ясніша пропозиція, пріоритети, довіра і легкий шлях до покупки.",
    packageTotal: "Вартість пакету",
    packageTotalBody: "Три конкретні частини. Чіткий receipt. Без довгого налаштування.",
    packageRows: [
      { title: "Діагностика повідомлення", value: "GBP 200", copy: "Головна сторінка, офер і контакт стають зрозумілою комерційною системою." },
      { title: "Пріоритетна черга", value: "GBP 200", copy: "Дії йдуть за впливом: ясність, довіра, дія." },
      { title: "Готовий текст", value: "GBP 200", copy: "Текст сайту, наступний крок, згода і приватний receipt." },
    ],
    authorityEyebrow: "Авторитет",
    authorityTitle: "Високий стиль, простий для дії.",
    authorityBody: "MindReply вище за generic AI writing: емоційне читання, рішення, ризик і конверсія.",
    authoritySignals: [
      { title: "Дисципліна", copy: "Не більше тексту, а кращий суд і тон." },
      { title: "Поведінкове читання", copy: "MRagent називає справжній тиск і безпечний крок." },
      { title: "Структура", copy: "Синтез, дія, ризик, впевненість і receipt." },
      { title: "Згода першою", copy: "Інтеграції описуються як активні тільки з доказом і дозволом." },
    ],
    closeEyebrow: "Короткий шлях",
    closeTitle: "Шлях покупця простий і спокійний.",
    closeBody: "Спробувати, зрозуміти пакет, оплатити або запитати рахунок.",
    closeSteps: [
      { step: "01", title: "Спробувати", copy: "Встав тиск і отримай синтез, дію та ризик." },
      { step: "02", title: "Оплата або рахунок", copy: "Платіжне посилання або рахунок." },
      { step: "03", title: "Отримати чергу", copy: "Пріоритети, текст, згода і receipt." },
    ],
    proofEyebrow: "Доказ",
    proofTitle: "Тепло, premium, з доказами.",
    proofBody: "Потрібна реальна обіцянка, ясна дія і перевірні claims.",
    proofItems: ["Публічний контакт: info@mind-reply.com.", "MRagent - перший маршрут.", "Receipts залишаються приватними.", "Claims пов'язані з джерелами."],
    demandEyebrow: "SEO попит",
    demandTitle: "Позиція там, де вже є намір.",
    demandBody: "Рішення, відповіді, AI search і конверсія сайту.",
    demandItems: [
      { title: "AI decision support", copy: "Одна чітка рекомендація." },
      { title: "AI email assistant", copy: "Тепліші відповіді і менше затримок." },
      { title: "Website conversion", copy: "Ясна пропозиція і менше тертя." },
    ],
    finalEyebrow: "Наступна revenue дія",
    finalTitle: "Почати з MRagent. Перейти до пакету, коли черга потребує повного rescue.",
    footerTagline: "Premium інтелект для тиску, рішень і комунікації, готової до покупки.",
    languageLabel: "Мова",
    detectedLabel: "Виявлено",
    autoLabel: "Auto",
  },
  bg: {
    languageName: "Български",
    nav: ["Оферта", "Авторитет", "Доказ", "Цена"],
    websitePackage: "Пакет сайт",
    tryAgent: "Пробвай MRagent",
    eyebrow: "Премиум интелигентност за отговори",
    h1: "Уверени отговори, ясни решения и по-силен сайт за 24 часа.",
    heroBody: "MindReply превръща имейл напрежение, Slack шум, follow-up и неясен сайт в спокойна опашка от действия или готово съобщение.",
    primaryCta: "Пробвай прочита",
    invoiceCta: "Заяви фактура - GBP 600",
    payCta: "Плати GBP 600",
    fullPackCta: "Виж пакета",
    firstOutputLabel: "Първи резултат",
    firstOutputValue: "Опашка от действия или готов текст",
    paidOfferLabel: "Платена оферта",
    paidOfferValue: "Пакет сайт GBP 600",
    paymentRouteLabel: "Плащане",
    packageRouteInvoice: "Фактура готова",
    packageRoutePayment: "Директно плащане активно",
    offerEyebrow: "Фиксиран обхват",
    offerTitle: "Website Completion Package",
    offerBody: "Фокусиран rescue: по-ясна оферта, приоритети, доверие и лек път към покупка.",
    packageTotal: "Общо",
    packageTotalBody: "Три конкретни части. Ясен receipt. Без дълъг setup.",
    packageRows: [
      { title: "Диагностика на послание", value: "GBP 200", copy: "Начална страница, оферта и контакт стават ясна търговска система." },
      { title: "Приоритетна опашка", value: "GBP 200", copy: "Действия по влияние: яснота, доверие, действие." },
      { title: "Готов copy", value: "GBP 200", copy: "Текст, следваща стъпка, consent и частен receipt." },
    ],
    authorityEyebrow: "Авторитет",
    authorityTitle: "Висок стил, прост за действие.",
    authorityBody: "Над generic AI writing: емоционален прочит, решение, риск и конверсия.",
    authoritySignals: [
      { title: "Дисциплина", copy: "Не повече текст, а по-добра преценка." },
      { title: "Поведенчески прочит", copy: "MRagent назовава напрежението и безопасната стъпка." },
      { title: "Структура", copy: "Синтез, действие, риск, увереност, receipt." },
      { title: "Consent първо", copy: "Интеграции само с доказателство и разрешение." },
    ],
    closeEyebrow: "Кратък път",
    closeTitle: "Пътят към покупка остава кратък.",
    closeBody: "Проба, разбиране на пакета, плащане или фактура.",
    closeSteps: [
      { step: "01", title: "Проба", copy: "Постави напрежението и получи синтез, действие, риск." },
      { step: "02", title: "Плати или фактура", copy: "Линк за плащане или фактура." },
      { step: "03", title: "Получаване", copy: "Приоритети, copy, consent и receipt." },
    ],
    proofEyebrow: "Доказ",
    proofTitle: "Топло, premium, проверимо.",
    proofBody: "Реална обещана стойност и ясен маршрут.",
    proofItems: ["Контакт: info@mind-reply.com.", "MRagent първо.", "Частни receipts.", "Claims с източници."],
    demandEyebrow: "SEO търсене",
    demandTitle: "Позиция там, където има намерение.",
    demandBody: "Решения, email, AI search и conversion на сайт.",
    demandItems: [
      { title: "AI decision support", copy: "Една ясна препоръка." },
      { title: "AI email assistant", copy: "По-топли отговори, по-малко забавяне." },
      { title: "Website conversion", copy: "Ясна оферта и по-малко триене." },
    ],
    finalEyebrow: "Следващ revenue ход",
    finalTitle: "Започни с MRagent. Премини към пакета, когато опашката иска пълен rescue.",
    footerTagline: "Premium интелигентност за напрежение, решения и комуникация готова за покупка.",
    languageLabel: "Език",
    detectedLabel: "Открито",
    autoLabel: "Auto",
  },
};

const packageIcons = [Brain, ClipboardList, ReceiptText];
const authorityIcons = [FileText, HeartHandshake, Gauge, ShieldCheck];
const demandIcons = [SearchCheck, Mail, Target];

function localeFromBrowser(language: string): LocaleKey | null {
  const normalized = language.toLowerCase();
  const direct = normalized.slice(0, 2);
  if (direct === "ua") return "uk";
  if (direct in copy) return direct as LocaleKey;
  return null;
}

function getStoredLocale(): LocaleKey | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem("mindreply-locale");
  return stored && stored in copy ? (stored as LocaleKey) : null;
}

export default function HomeLanding({ packagePaymentUrl = "" }: { packagePaymentUrl?: string }) {
  const [locale, setLocale] = useState<LocaleKey>("en");
  const [detected, setDetected] = useState<string>("browser");
  const packageCtaHref = packagePaymentUrl || "/contact?intent=website-completion";
  const isPaymentEnabled = Boolean(packagePaymentUrl);
  const t = copy[locale];

  useEffect(() => {
    const stored = getStoredLocale();
    if (stored) {
      setLocale(stored);
      setDetected("saved");
      return;
    }

    const browserLocale = localeFromBrowser(navigator.language);
    if (browserLocale) {
      setLocale(browserLocale);
      setDetected(navigator.language);
    }

    fetch("/api/geo", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { country?: string; language?: string } | null) => {
        if (!data) return;
        const country = data.country?.toUpperCase();
        const byCountry = country ? countryLocale[country] : null;
        const byLanguage = data.language ? localeFromBrowser(data.language) : null;
        const nextLocale = byCountry || byLanguage;
        if (nextLocale) {
          setLocale(nextLocale);
          setDetected(country || data.language || "auto");
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "uk" ? "uk" : locale;
    window.localStorage.setItem("mindreply-locale", locale);
  }, [locale]);

  const navItems = useMemo(
    () => [
      { label: t.nav[0], href: "#offer" },
      { label: t.nav[1], href: "#authority" },
      { label: t.nav[2], href: "#proof" },
      { label: t.nav[3], href: "/pricing" },
    ],
    [t.nav],
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f4ec] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-[#f8f4ec]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <a key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-[#4d5c6f] transition hover:bg-white hover:text-[#122033]">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-[#4d5c6f] transition hover:bg-white hover:text-[#122033]">
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className="hidden items-center gap-2 rounded-full border border-[#122033]/10 bg-white/70 px-3 py-2 text-xs font-semibold text-[#4d5c6f] md:inline-flex">
              <Globe2 aria-hidden className="h-4 w-4 text-[#2f6f72]" />
              <span className="sr-only">{t.languageLabel}</span>
              <select
                aria-label={t.languageLabel}
                value={locale}
                onChange={(event) => {
                  setLocale(event.target.value as LocaleKey);
                  setDetected("manual");
                }}
                className="bg-transparent text-xs font-bold text-[#122033] outline-none"
              >
                {localeOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Link href="/website-completion-package" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              {t.websitePackage}
            </Link>
            <Link href="/agent" className="hidden rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150] sm:inline-flex">
              {t.tryAgent}
            </Link>
          </div>
        </div>
      </header>

      <section
        className="bg-[#122033] bg-cover bg-center px-4 py-7 text-[#f8f5f0] md:px-8 md:py-10"
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(18,32,51,0.98), rgba(18,32,51,0.88) 48%, rgba(47,111,114,0.68)), url('/assets/images/hero-atmosphere.png')",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="min-w-0 py-2 max-[640px]:w-full max-[640px]:max-w-[22.25rem] md:py-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e2b757]">
              <Sparkles aria-hidden className="h-4 w-4" />
              {t.eyebrow}
            </div>
            <h1 className="mt-6 max-w-3xl break-words font-serif text-[2.45rem] font-bold leading-[1.02] sm:text-5xl md:text-6xl xl:text-7xl">
              {t.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              {t.heroBody}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/agent" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                {t.primaryCta} <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <a href={packageCtaHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                {isPaymentEnabled ? t.payCta : t.invoiceCta} <Target aria-hidden className="h-4 w-4" />
              </a>
              <Link href="/website-completion-package" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#91d2c8] hover:text-[#91d2c8]">
                {t.fullPackCta} <ReceiptText aria-hidden className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#91d2c8]">{t.firstOutputLabel}</p>
                <p className="mt-3 text-sm font-semibold">{t.firstOutputValue}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#91d2c8]">{t.paidOfferLabel}</p>
                <p className="mt-3 text-sm font-semibold">{t.paidOfferValue}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#91d2c8]">{t.paymentRouteLabel}</p>
                <p className="mt-3 text-sm font-semibold">{isPaymentEnabled ? t.packageRoutePayment : t.packageRouteInvoice}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#91d2c8] md:hidden">
              <Globe2 aria-hidden className="h-4 w-4" />
              <select
                aria-label={t.languageLabel}
                value={locale}
                onChange={(event) => {
                  setLocale(event.target.value as LocaleKey);
                  setDetected("manual");
                }}
                className="rounded-full border border-white/10 bg-[#122033] px-3 py-2 text-xs font-bold text-[#f8f5f0] outline-none"
              >
                {localeOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label} - {copy[option.key].languageName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="min-h-[34rem] min-w-0 max-w-full overflow-hidden rounded-lg border border-white/10 bg-[#0d1729] shadow-2xl shadow-black/20 max-[640px]:w-full max-[640px]:max-w-[22.25rem] sm:min-h-[38rem] lg:min-h-[43rem]">
            <MRAgentChat compact />
          </div>
        </div>
      </section>

      <section id="offer" className="border-b border-[#122033]/10 bg-white px-4 py-12 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f6f72]">{t.offerEyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">{t.offerTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">{t.offerBody}</p>
            <div className="mt-6 rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b7430]">{t.packageTotal}</p>
              <p className="mt-3 font-serif text-5xl font-bold">GBP 600</p>
              <p className="mt-3 text-sm leading-6 text-[#59687b]">{t.packageTotalBody}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={packageCtaHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#122033] px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:bg-[#1c3150]">
                  {isPaymentEnabled ? t.payCta : t.invoiceCta} <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
                <Link href="/website-completion-package" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#122033]/15 px-5 py-3 text-sm font-bold text-[#122033] transition hover:border-[#2f6f72]">
                  {t.fullPackCta} <ReceiptText aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {t.packageRows.map((row, index) => {
              const Icon = packageIcons[index] || Brain;
              return (
                <article key={row.title} className="rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5 shadow-sm shadow-[#122033]/5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#122033] text-[#e2b757]">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#2f6f72]">{row.value}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-bold leading-tight">{row.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#59687b]">{row.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="authority" className="px-4 py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9b7430]">{t.authorityEyebrow}</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">{t.authorityTitle}</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#59687b]">{t.authorityBody}</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {t.authoritySignals.map((signal, index) => {
              const Icon = authorityIcons[index] || ShieldCheck;
              return (
                <article key={signal.title} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#103b39] text-[#91d2c8]">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl font-bold leading-tight">{signal.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#59687b]">{signal.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#103b39] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#91d2c8]">{t.closeEyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">{t.closeTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-[#d3e5e2]">{t.closeBody}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {t.closeSteps.map((item) => (
              <article key={item.step} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e2b757]">{item.step}</span>
                <h3 className="mt-4 font-serif text-2xl font-bold leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#d3e5e2]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-b border-[#122033]/10 bg-[#fbfaf6] px-4 py-12 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f6f72]">{t.proofEyebrow}</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">{t.proofTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">{t.proofBody}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {t.proofItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-white p-4 text-sm leading-6 text-[#59687b]">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9b7430]">{t.demandEyebrow}</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">{t.demandTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">{t.demandBody}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {t.demandItems.map((item, index) => {
              const Icon = demandIcons[index] || SearchCheck;
              return (
                <article key={item.title} className="rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] text-[#e2b757]">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-bold leading-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#59687b]">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg bg-[#122033] p-6 text-[#f8f5f0] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#91d2c8]">{t.finalEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">{t.finalTitle}</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/agent" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
              {t.tryAgent} <Zap aria-hidden className="h-4 w-4" />
            </Link>
            <a href={packageCtaHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
              {isPaymentEnabled ? t.payCta : t.invoiceCta} <Mail aria-hidden className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#122033]/10 bg-[#f8f4ec] px-4 py-8 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#122033] font-serif text-base font-bold text-[#e2b757]">M</span>
              <span className="font-serif text-lg font-bold tracking-wide">MindReply</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#59687b]">{t.footerTagline}</p>
          </div>
          <div className="text-sm leading-7 text-[#59687b]">
            <p className="font-bold text-[#122033]">{t.websitePackage}</p>
            <Link href="/website-completion-package" className="block hover:text-[#2f6f72]">{t.fullPackCta}</Link>
            <Link href="/pricing" className="block hover:text-[#2f6f72]">{t.nav[3]}</Link>
            <a href={`mailto:${supportEmail}`} className="block hover:text-[#2f6f72]">{supportEmail}</a>
          </div>
          <div className="text-sm leading-7 text-[#59687b]">
            <p className="font-bold text-[#122033]">{t.languageLabel}</p>
            <p>{t.detectedLabel}: {detected}</p>
            <select
              aria-label={t.languageLabel}
              value={locale}
              onChange={(event) => {
                setLocale(event.target.value as LocaleKey);
                setDetected("manual");
              }}
              className="mt-2 rounded-full border border-[#122033]/15 bg-white px-3 py-2 text-xs font-bold text-[#122033] outline-none"
            >
              {localeOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label} - {copy[option.key].languageName}
                </option>
              ))}
            </select>
            <Link href="/privacy" className="mt-2 block hover:text-[#2f6f72]">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
