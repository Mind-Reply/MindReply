"use client";

import { useEffect, useMemo, useState } from "react";

type ActionKind = "reply" | "schedule" | "resolve" | "escalate";
type LocaleKey = "en" | "es" | "fr" | "de" | "it" | "pt" | "nl" | "pl" | "uk" | "ar";

type DecisionState = {
  synthesis: string;
  recommended_action: ActionKind;
  risk: "low" | "medium" | "high";
  importance: number;
  urgency: number;
  memory_update: string;
};

type LocaleResponse = {
  locale: LocaleKey;
  country: string;
};

const languages: { code: LocaleKey; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Espanol", short: "ES" },
  { code: "fr", label: "Francais", short: "FR" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "it", label: "Italiano", short: "IT" },
  { code: "pt", label: "Portugues", short: "PT" },
  { code: "nl", label: "Nederlands", short: "NL" },
  { code: "pl", label: "Polski", short: "PL" },
  { code: "uk", label: "Ukrainian", short: "UK" },
  { code: "ar", label: "Arabic", short: "AR" },
];

const sample = "Client is concerned about the revised timeline and wants a response before end of day.";

const initialDecision: DecisionState = {
  synthesis: "Client concern needs a same-day response. Recommended action: reply.",
  recommended_action: "reply",
  risk: "medium",
  importance: 76,
  urgency: 82,
  memory_update: "Tone and follow-up preference retained silently.",
};

const copy: Record<
  LocaleKey,
  {
    eyebrow: string;
    demand: string;
    h1: string;
    lead: string;
    primary: string;
    details: string;
    proof: string[];
    packTitle: string;
    packageIntro: string;
    packageItems: string[];
    intakeKicker: string;
    intakeTitle: string;
    privateLabel: string;
    inputLabel: string;
    assess: string;
    reading: string;
    synthesis: string;
    action: string;
    memory: string;
    ready: string;
    handled: string;
    visionTitle: string;
    visionBody: string;
    footerLine: string;
    footer: string[];
    language: string;
    country: string;
  }
> = {
  en: {
    eyebrow: "Reply Overload Cleanup",
    demand: "Missed replies, slow follow-ups, stale prospects, and client threads cost money before they look urgent.",
    h1: "Reclaim 2+ hours daily from the reply queue.",
    lead:
      "Paste one messy thread. MindReply returns the next action, a send-ready message, the risk flag, and a private receipt without a long setup.",
    primary: "Paste one messy thread",
    details: "See paid path",
    proof: ["Action queue", "Send-ready message", "Private receipt"],
    packTitle: "Paid Path",
    packageIntro:
      "Start with one output. Buy credits for occasional replies, a pack for a visible backlog, Growth when weekly overload repeats, and Pro when team handoffs or sensitive volume need receipts.",
    packageItems: [
      "Credits: occasional prospect replies, follow-ups, and message polish.",
      "Pack: clear multiple stale threads or same-day client follow-ups.",
      "Growth: repeated weekly overload, saved behavior, active prospects.",
      "Pro: team handoffs, higher volume, professional lexicons, private receipts.",
      "Trigger: upgrade only when the workload proves the next tier.",
    ],
    intakeKicker: "First Session",
    intakeTitle: "Thread in. Reply out.",
    privateLabel: "private by default",
    inputLabel: "Input",
    assess: "Assess intake",
    reading: "Reading signal",
    synthesis: "Synthesis",
    action: "Next Action",
    memory: "Private Receipt",
    ready: "Proceed when ready. ",
    handled: "This has been handled. ",
    visionTitle: "Receipt Example",
    visionBody: "Client renewal follow-up. Status: reply needed. Risk: medium. Recommended action: confirm owner, pricing follow-up, and response date. Excluded: full message body and private attachments.",
    footerLine: "Private by design for sensitive professional replies.",
    footer: ["Action queue", "Reply", "Risk flag", "Private receipt"],
    language: "Language",
    country: "Detected country",
  },
  es: {
    eyebrow: "Sistema nervioso ejecutivo",
    demand: "Alta demanda, pocos operadores confiables: los lideres necesitan un movimiento claro.",
    h1: "MindReply convierte la presion en la siguiente accion.",
    lead: "Infraestructura de decision para ejecutivos, fundadores y firmas expertas. Filtra senales y protege el criterio.",
    primary: "Abrir decision",
    details: "Ver paquete completo",
    proof: ["Una sintesis", "Una accion recomendada", "Memoria privada"],
    packTitle: "Paquete completo",
    packageIntro: "Paquete Web: posicionamiento premium, prueba de confianza, privacidad, telefono primero y reportes.",
    packageItems: ["Autoridad en portada.", "Metadatos y prueba clara.", "Telefono sin huecos.", "Cierre calmado.", "Reporte tras cada mejora."],
    intakeKicker: "Capa de entrada",
    intakeTitle: "Una sintesis. Una accion.",
    privateLabel: "privado por defecto",
    inputLabel: "Entrada",
    assess: "Evaluar",
    reading: "Leyendo senal",
    synthesis: "Sintesis",
    action: "Capa de accion",
    memory: "Capa de memoria",
    ready: "Proceda cuando este listo. ",
    handled: "Esto fue atendido. ",
    visionTitle: "La vision",
    visionBody: "MindReply reemplaza el espacio entre herramientas: menos duda, respuesta segura, seguimiento claro.",
    footerLine: "Infraestructura tranquila para decisiones ejecutivas modernas.",
    footer: ["Entrada", "Accion", "Memoria", "Prueba"],
    language: "Idioma",
    country: "Pais detectado",
  },
  fr: {
    eyebrow: "Systeme nerveux executif",
    demand: "Forte demande, peu d'operateurs fiables: les dirigeants veulent un mouvement clair.",
    h1: "MindReply transforme la pression en prochaine action.",
    lead: "Infrastructure de decision pour dirigeants, fondateurs et cabinets experts. Elle filtre le signal et protege le jugement.",
    primary: "Lancer la decision",
    details: "Voir le pack complet",
    proof: ["Une synthese", "Une action recommandee", "Memoire privee"],
    packTitle: "Pack complet",
    packageIntro: "Pack Site: positionnement premium, preuve de confiance, confidentialite, mobile d'abord et rapports.",
    packageItems: ["Autorite en accueil.", "Metadonnees et preuve claire.", "Mobile sans vide.", "Cloture calme.", "Rapport apres chaque progres."],
    intakeKicker: "Couche d'entree",
    intakeTitle: "Une synthese. Une action.",
    privateLabel: "prive par defaut",
    inputLabel: "Signal",
    assess: "Evaluer",
    reading: "Lecture du signal",
    synthesis: "Synthese",
    action: "Couche d'action",
    memory: "Couche memoire",
    ready: "Proceder quand c'est pret. ",
    handled: "C'est traite. ",
    visionTitle: "La vision",
    visionBody: "MindReply remplace l'espace entre outils: moins d'hesitation, reponse plus sure, suivi clair.",
    footerLine: "Infrastructure calme pour le travail executif moderne.",
    footer: ["Entree", "Action", "Memoire", "Preuve"],
    language: "Langue",
    country: "Pays detecte",
  },
  de: {
    eyebrow: "Executive Nervensystem",
    demand: "Hohe Nachfrage, wenige vertraute Operatoren: Fuehrung braucht einen klaren Schritt.",
    h1: "MindReply macht aus Druck die naechste Aktion.",
    lead: "Entscheidungsinfrastruktur fuer Fuehrung, Gruender und Expertenfirmen. Sie filtert Signale und schuetzt Urteilskraft.",
    primary: "Entscheidung starten",
    details: "Paketdetails ansehen",
    proof: ["Eine Synthese", "Eine empfohlene Aktion", "Private Erinnerung"],
    packTitle: "Komplettpaket",
    packageIntro: "Website Paket: Premium-Positionierung, Vertrauen, Datenschutzsprache, mobile Gestaltung und Berichte.",
    packageItems: ["Autoritaet auf der Startseite.", "Metadaten und Beweis.", "Mobil ohne Luecken.", "Ruhiger Abschluss.", "Bericht nach jeder Verbesserung."],
    intakeKicker: "Eingangsebene",
    intakeTitle: "Eine Synthese. Eine Aktion.",
    privateLabel: "standardmaessig privat",
    inputLabel: "Eingabe",
    assess: "Bewerten",
    reading: "Signal lesen",
    synthesis: "Synthese",
    action: "Aktionsebene",
    memory: "Gedaechtnisebene",
    ready: "Weiter wenn bereit. ",
    handled: "Dies wurde erledigt. ",
    visionTitle: "Die Vision",
    visionBody: "MindReply ersetzt den Raum zwischen Werkzeugen: weniger Zoegern, sichere Antwort, klare Nachverfolgung.",
    footerLine: "Ruhige Entscheidungsinfrastruktur fuer moderne Fuehrung.",
    footer: ["Eingang", "Aktion", "Gedaechtnis", "Nachweis"],
    language: "Sprache",
    country: "Erkanntes Land",
  },
  it: {
    eyebrow: "Sistema nervoso esecutivo",
    demand: "Domanda alta, pochi operatori fidati: serve una mossa chiara.",
    h1: "MindReply trasforma la pressione nella prossima azione.",
    lead: "Infrastruttura decisionale per dirigenti, founder e studi esperti. Filtra il segnale e protegge il giudizio.",
    primary: "Apri decisione",
    details: "Dettagli pacchetto",
    proof: ["Una sintesi", "Una azione consigliata", "Memoria privata"],
    packTitle: "Pacchetto completo",
    packageIntro: "Pacchetto Sito: posizionamento premium, fiducia, privacy, telefono prima e report.",
    packageItems: ["Autorita in homepage.", "Metadati e prova.", "Telefono senza vuoti.", "Chiusura calma.", "Report dopo ogni miglioramento."],
    intakeKicker: "Livello ingresso",
    intakeTitle: "Una sintesi. Una azione.",
    privateLabel: "privato di base",
    inputLabel: "Input",
    assess: "Valuta",
    reading: "Lettura segnale",
    synthesis: "Sintesi",
    action: "Livello azione",
    memory: "Livello memoria",
    ready: "Procedi quando pronto. ",
    handled: "Gestito. ",
    visionTitle: "La visione",
    visionBody: "MindReply sostituisce lo spazio tra strumenti: meno esitazione, risposta piu sicura, seguito chiaro.",
    footerLine: "Infrastruttura calma per decisioni moderne.",
    footer: ["Ingresso", "Azione", "Memoria", "Prova"],
    language: "Lingua",
    country: "Paese rilevato",
  },
  pt: {
    eyebrow: "Sistema nervoso executivo",
    demand: "Alta demanda, poucos operadores confiaveis: lideres precisam de uma acao clara.",
    h1: "MindReply transforma pressao na proxima acao.",
    lead: "Infraestrutura de decisao para executivos, fundadores e firmas especializadas. Filtra sinal e protege julgamento.",
    primary: "Abrir decisao",
    details: "Ver pacote completo",
    proof: ["Uma sintese", "Uma acao recomendada", "Memoria privada"],
    packTitle: "Pacote completo",
    packageIntro: "Pacote Web: posicionamento premium, confianca, privacidade, telefone primeiro e relatorios.",
    packageItems: ["Autoridade na pagina inicial.", "Metadados e prova.", "Telefone sem lacunas.", "Fechamento calmo.", "Relatorio apos cada melhoria."],
    intakeKicker: "Camada de entrada",
    intakeTitle: "Uma sintese. Uma acao.",
    privateLabel: "privado por padrao",
    inputLabel: "Entrada",
    assess: "Avaliar",
    reading: "Lendo sinal",
    synthesis: "Sintese",
    action: "Camada de acao",
    memory: "Camada de memoria",
    ready: "Prossiga quando pronto. ",
    handled: "Isso foi tratado. ",
    visionTitle: "A visao",
    visionBody: "MindReply substitui o espaco entre ferramentas: menos hesitacao, resposta segura, seguimento claro.",
    footerLine: "Infraestrutura calma para decisoes executivas modernas.",
    footer: ["Entrada", "Acao", "Memoria", "Prova"],
    language: "Idioma",
    country: "Pais detectado",
  },
  nl: {
    eyebrow: "Executief zenuwstelsel",
    demand: "Hoge vraag, weinig vertrouwde operators: leiders willen een duidelijke stap.",
    h1: "MindReply zet druk om in de volgende actie.",
    lead: "Beslissingsinfrastructuur voor leiders, oprichters en expertbedrijven. Het filtert signalen en beschermt oordeel.",
    primary: "Start besluit",
    details: "Volledig pakket",
    proof: ["Een synthese", "Een aanbevolen actie", "Prive geheugen"],
    packTitle: "Volledig pakket",
    packageIntro: "Website Pakket: premium positionering, vertrouwen, privacytaal, mobiel eerst en rapporten.",
    packageItems: ["Autoriteit op de homepage.", "Metadata en bewijs.", "Mobiel zonder gaten.", "Rustige sluiting.", "Rapport na elke verbetering."],
    intakeKicker: "Invoerlaag",
    intakeTitle: "Een synthese. Een actie.",
    privateLabel: "standaard prive",
    inputLabel: "Invoer",
    assess: "Beoordeel",
    reading: "Signaal lezen",
    synthesis: "Synthese",
    action: "Actielaag",
    memory: "Geheugenlaag",
    ready: "Ga verder wanneer klaar. ",
    handled: "Dit is afgehandeld. ",
    visionTitle: "De visie",
    visionBody: "MindReply vervangt de ruimte tussen tools: minder twijfel, veiligere reactie, duidelijke opvolging.",
    footerLine: "Rustige beslissingsinfrastructuur voor modern leiderschap.",
    footer: ["Invoer", "Actie", "Geheugen", "Bewijs"],
    language: "Taal",
    country: "Gedetecteerd land",
  },
  pl: {
    eyebrow: "System nerwowy lidera",
    demand: "Wysoki popyt, malo zaufanych operatorow: liderzy potrzebuja jednego jasnego kroku.",
    h1: "MindReply zmienia presje w nastepna akcje.",
    lead: "Infrastruktura decyzyjna dla liderow, founderow i firm eksperckich. Filtruje sygnal i chroni osad.",
    primary: "Uruchom decyzje",
    details: "Pelny pakiet",
    proof: ["Jedna synteza", "Jedna rekomendowana akcja", "Prywatna pamiec"],
    packTitle: "Pelny pakiet",
    packageIntro: "Pakiet Strony: premium pozycja, zaufanie, prywatnosc, telefon pierwszy i raporty.",
    packageItems: ["Autorytet na stronie glownej.", "Metadane i dowod.", "Telefon bez luk.", "Spokojne zamkniecie.", "Raport po kazdej poprawie."],
    intakeKicker: "Warstwa wejscia",
    intakeTitle: "Jedna synteza. Jedna akcja.",
    privateLabel: "prywatne domyslnie",
    inputLabel: "Wejscie",
    assess: "Ocen",
    reading: "Czytam sygnal",
    synthesis: "Synteza",
    action: "Warstwa akcji",
    memory: "Warstwa pamieci",
    ready: "Kontynuuj, gdy gotowe. ",
    handled: "To zostalo obsluzone. ",
    visionTitle: "Wizja",
    visionBody: "MindReply zastepuje przestrzen miedzy narzedziami: mniej zwloki, bezpieczniejsza odpowiedz, jasny ciag dalszy.",
    footerLine: "Spokojna infrastruktura decyzji dla nowoczesnej pracy liderow.",
    footer: ["Wejscie", "Akcja", "Pamiec", "Dowod"],
    language: "Jezyk",
    country: "Wykryty kraj",
  },
  uk: {
    eyebrow: "Vykonavcha nervova systema",
    demand: "Popyt vysokyi, nadiinykh operatoriv malo: kerivnykam potriben odyn yasnyi krok.",
    h1: "MindReply peretvoriuie tysk na nastupnu diiu.",
    lead: "Infrastruktura rishen dlia kerivnykiv, founderiv i ekspertnykh firm. Filtruie syhnal i zakhyshchaie sudzhennia.",
    primary: "Vidkryty rishennia",
    details: "Povnyi paket",
    proof: ["Odna synteza", "Odna rekomendovana diia", "Pryvatna pamiat"],
    packTitle: "Povnyi paket",
    packageIntro: "Paket Saitu: premium pozytsiia, dovira, pryvatnist, telephone-first layout, and owner reports.",
    packageItems: ["Avtorytet na holovnii.", "Metadani i dokaz.", "Phone layout bez prohalyn.", "Spokiine zakryttia.", "Zvit pislia kozhnoho pokrashchennia."],
    intakeKicker: "Shar vkhodu",
    intakeTitle: "Odna synteza. Odna diia.",
    privateLabel: "pryvatno za zamovchuvanniam",
    inputLabel: "Vkhid",
    assess: "Otsinyty",
    reading: "Chytaiu syhnal",
    synthesis: "Synteza",
    action: "Shar dii",
    memory: "Shar pamiati",
    ready: "Prodovzhujte, koly hotovo. ",
    handled: "Tse opratsiovano. ",
    visionTitle: "Bachennia",
    visionBody: "MindReply zaminuie prostir mizh zasobamy: menshe vahannia, bezpechnisha vidpovid, yasnyi nastupnyi krok.",
    footerLine: "Spokiina infrastruktura rishen dlia suchasnoi kerivnoi roboty.",
    footer: ["Vkhid", "Diia", "Pamiat", "Dokaz"],
    language: "Mova",
    country: "Vyiavlena kraina",
  },
  ar: {
    eyebrow: "Reply Overload Cleanup",
    demand: "Missed replies, slow follow-ups, stale prospects, and client threads cost money before they look urgent.",
    h1: "Reclaim 2+ hours daily from the reply queue.",
    lead: "Paste one messy thread. MindReply returns the next action, a send-ready message, the risk flag, and a private receipt without a long setup.",
    primary: "Paste one messy thread",
    details: "See paid path",
    proof: ["Action queue", "Send-ready message", "Private receipt"],
    packTitle: "Paid Path",
    packageIntro: "Start with one output. Buy credits for occasional replies, a pack for a visible backlog, Growth when weekly overload repeats, and Pro when team handoffs or sensitive volume need receipts.",
    packageItems: ["Credits: occasional replies.", "Pack: clear a visible backlog.", "Growth: weekly repeat overload.", "Pro: team handoffs, lexicons, receipts.", "Upgrade only when workload proves it."],
    intakeKicker: "First Session",
    intakeTitle: "Thread in. Reply out.",
    privateLabel: "private by default",
    inputLabel: "Input",
    assess: "Assess",
    reading: "Reading signal",
    synthesis: "Synthesis",
    action: "Next Action",
    memory: "Private Receipt",
    ready: "Proceed when ready. ",
    handled: "This has been handled. ",
    visionTitle: "Receipt Example",
    visionBody: "Client renewal follow-up. Status: reply needed. Risk: medium. Recommended action: confirm owner, pricing follow-up, and response date. Excluded: full message body and private attachments.",
    footerLine: "Private by design for sensitive professional replies.",
    footer: ["Action queue", "Reply", "Risk flag", "Private receipt"],
    language: "Language",
    country: "Detected country",
  },
};

function isLocaleKey(value: string): value is LocaleKey {
  return languages.some((language) => language.code === value);
}

export default function Home() {
  const [locale, setLocale] = useState<LocaleKey>("en");
  const [country, setCountry] = useState("local");
  const [intake, setIntake] = useState(sample);
  const [decision, setDecision] = useState<DecisionState>(initialDecision);
  const [handled, setHandled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [packOpen, setPackOpen] = useState(false);

  const text = copy[locale];
  const isRtl = locale === "ar";
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "MindReply",
    url: "https://www.mind-reply.com",
    description:
      "Private decision support for high-stakes messages with one synthesis, one recommended action, quiet memory, and legal-grade privacy.",
    areaServed: ["US", "GB", "EU", "UA", "AE"],
    serviceType: [
      "Sensitive message review",
      "Executive communication support",
      "Reply overload cleanup",
      "Chief of staff support",
    ],
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("mindreply-locale");
    if (saved && isLocaleKey(saved)) {
      setLocale(saved);
      return;
    }

    fetch("/api/locale")
      .then((response) => response.json() as Promise<LocaleResponse>)
      .then((result) => {
        if (isLocaleKey(result.locale)) setLocale(result.locale);
        if (result.country) setCountry(result.country);
      })
      .catch(() => {
        const browserLocale = navigator.language.slice(0, 2);
        if (isLocaleKey(browserLocale)) setLocale(browserLocale);
      });
  }, []);

  const actionLabel = useMemo(() => {
    if (decision.recommended_action === "reply") return "Prepare reply";
    if (decision.recommended_action === "schedule") return "Set hold";
    if (decision.recommended_action === "resolve") return "Close thread";
    return "Escalate for review";
  }, [decision.recommended_action]);

  function changeLocale(value: string) {
    if (!isLocaleKey(value)) return;
    window.localStorage.setItem("mindreply-locale", value);
    setLocale(value);
  }

  async function assess() {
    setBusy(true);
    setHandled(false);
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input: intake, devicePrivacyFlag: true }),
      });
      const result = (await response.json()) as DecisionState;
      setDecision(result);
    } finally {
      setBusy(false);
    }
  }

  async function proceed() {
    setBusy(true);
    try {
      await fetch("/api/action", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ synthesis: decision.synthesis, recommended_action: decision.recommended_action }),
      });
      await fetch("/api/memory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ synthesis: decision.synthesis, recommended_action: decision.recommended_action, signal: intake }),
      });
      setHandled(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-[#0d1210] text-[#f5f1e8]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <section className="mx-auto grid min-h-[100dvh] w-full max-w-7xl gap-8 px-4 py-5 sm:px-6 md:px-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-10">
        <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col justify-between gap-8 lg:min-h-[720px]">
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#c9a95f]">{text.eyebrow}</p>
              <label className="flex items-center gap-2 rounded-full border border-[#343a35] bg-[#141a17] px-3 py-2 text-xs text-[#bfc7bd]">
                <span aria-hidden="true">{languages.find((language) => language.code === locale)?.short}</span>
                <select
                  aria-label={text.language}
                  value={locale}
                  onChange={(event) => changeLocale(event.target.value)}
                  className="max-w-[6.5rem] bg-transparent text-[#f5f1e8] outline-none"
                >
                  {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="mt-6 max-w-xl border-l border-[#c9a95f] pl-4 text-sm leading-6 text-[#d6c8aa]">{text.demand}</p>
            <h1 className="mt-6 text-[3rem] font-semibold leading-[0.94] tracking-normal sm:text-6xl md:text-7xl">{text.h1}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#c9d0c7] sm:text-lg">{text.lead}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={assess}
                disabled={busy}
                className="h-12 rounded-md bg-[#c9a95f] px-5 text-sm font-semibold text-[#0d1210] transition hover:bg-[#dfc578] disabled:cursor-wait disabled:opacity-70"
              >
                {busy ? text.reading : text.primary}
              </button>
              <button
                type="button"
                onClick={() => setPackOpen((open) => !open)}
                className="h-12 rounded-md border border-[#46504a] px-5 text-sm font-semibold text-[#f5f1e8] transition hover:border-[#c9a95f] hover:text-[#c9a95f]"
              >
                {text.details}
              </button>
            </div>

            <div className="mt-7 grid gap-2 text-xs text-[#d7ded4] sm:grid-cols-3">
              {text.proof.map((proof) => (
                <div key={proof} className="min-h-16 rounded-md border border-[#29302b] bg-[#121815] p-3">
                  {proof}
                </div>
              ))}
            </div>
          </div>

          <footer className="border-t border-[#29302b] pt-5 text-sm text-[#aeb8af]">
            <p>{text.footerLine}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.16em] text-[#c9a95f]">
              {text.footer.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#79857c]">
              {text.country}: {country}. MindReply keeps locale detection transient.
            </p>
          </footer>
        </div>

        <div className="grid gap-4 pb-6 lg:pb-0">
          {packOpen ? (
            <section className="rounded-lg border border-[#3d443e] bg-[#161d19] p-5 shadow-2xl shadow-black/30 md:p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#c9a95f]">Paid path</p>
              <h2 className="mt-2 text-2xl font-semibold">{text.packTitle}</h2>
              <p className="mt-4 leading-7 text-[#c9d0c7]">{text.packageIntro}</p>
              <ul className="mt-5 grid gap-3">
                {text.packageItems.map((item) => (
                  <li key={item} className="flex gap-3 rounded-md border border-[#29302b] bg-[#101613] p-3 text-sm leading-6 text-[#edf0e8]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a95f]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className="rounded-lg border border-[#3d443e] bg-[#161d19] p-4 shadow-2xl shadow-black/30 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#29302b] pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#c9a95f]">{text.intakeKicker}</p>
                  <h2 className="mt-1 text-xl font-semibold">{text.intakeTitle}</h2>
                </div>
                <span className="rounded-full border border-[#46504a] px-3 py-1 text-xs text-[#c9d0c7]">{text.privateLabel}</span>
              </div>

              <label className="block text-sm font-medium text-[#f5f1e8]" htmlFor="intake">
                {text.inputLabel}
              </label>
              <textarea
                id="intake"
                value={intake}
                onChange={(event) => setIntake(event.target.value)}
                className="mt-2 min-h-32 w-full resize-none rounded-md border border-[#3d443e] bg-[#0e1411] p-4 text-base leading-7 text-[#f5f1e8] outline-none transition focus:border-[#c9a95f]"
              />
              <button
                type="button"
                onClick={assess}
                disabled={busy}
                className="mt-4 h-11 rounded-md bg-[#c9a95f] px-5 text-sm font-semibold text-[#0d1210] transition hover:bg-[#dfc578] disabled:cursor-wait disabled:opacity-70"
              >
                {busy ? text.reading : text.assess}
              </button>

              <div className="mt-6 grid gap-4">
                <article className="rounded-md border border-[#29302b] bg-[#0e1411] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#c9a95f]">{text.synthesis}</p>
                  <p className="mt-2 leading-7 text-[#f5f1e8]">{decision.synthesis}</p>
                </article>
                <article className="rounded-md border border-[#29302b] bg-[#0e1411] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#c9a95f]">{text.action}</p>
                      <p className="mt-2 text-2xl font-semibold capitalize">{decision.recommended_action}</p>
                      <p className="mt-1 text-sm text-[#c9d0c7]">Risk: {decision.risk}</p>
                    </div>
                    <button
                      type="button"
                      onClick={proceed}
                      disabled={busy}
                      className="h-11 rounded-md border border-[#c9a95f] px-5 text-sm font-semibold text-[#f5f1e8] transition hover:bg-[#c9a95f] hover:text-[#0d1210] disabled:cursor-wait disabled:opacity-70"
                    >
                      {actionLabel}
                    </button>
                  </div>
                </article>
                <article className="rounded-md border border-[#29302b] bg-[#0e1411] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#c9a95f]">{text.memory}</p>
                  <p className="mt-2 leading-7 text-[#c9d0c7]">
                    {handled ? text.handled : text.ready}
                    {decision.memory_update}
                  </p>
                </article>
              </div>
            </section>
          )}

          <section className="rounded-lg border border-[#29302b] bg-[#101613] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9a95f]">{text.visionTitle}</p>
            <p className="mt-3 text-sm leading-7 text-[#c9d0c7]">{text.visionBody}</p>
          </section>
        </div>
      </section>
    </main>
  );
}
