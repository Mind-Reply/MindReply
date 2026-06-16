ll-site-i18n

type GeoLocaleResponse = {
  country?: string;
  recommendedLocale?: string;
  priorityMarkets?: string[];
  marketProfiles?: Array<{ country: string; locale: string }>;
}; 

const localeCodes = supportedLocales;
const rtlLocales = new Set<LocaleCode>(localeCodes.filter((code) => localeMeta[code].dir === "rtl"));

function isLocale(value: string): value is LocaleCode {
  return localeCodes.includes(value as LocaleCode);
}

function localeFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const queryLocale = params.get("lang") || "";
  return isLocale(queryLocale) ? queryLocale : null;
}

function localeFromPath() {
  const pathLocale = window.location.pathname.split("/").filter(Boolean)[0] || "";
  return isLocale(pathLocale) ? pathLocale : null;
}

function localeFromBrowser() {
  const browserLocale = navigator.language.split("-")[0];
  return isLocale(browserLocale) ? browserLocale : defaultLocale;
}

function publishLocale(nextLocale: LocaleCode) {
  document.documentElement.lang = localeMeta[nextLocale].htmlLang;
  document.documentElement.dir = rtlLocales.has(nextLocale) ? "rtl" : "ltr";
  window.dispatchEvent(new CustomEvent("mindreply:locale-change", { detail: { locale: nextLocale } }));
}

function resolveManualLocale() {
  const pathLocale = localeFromPath();
  if (pathLocale) return pathLocale;

  const queryLocale = localeFromQuery();
  if (queryLocale) return queryLocale;

  const saved = window.localStorage.getItem("mindreply-locale");
  if (saved && isLocale(saved)) return saved;

  return null;
}

function navigateToLocale(nextLocale: LocaleCode) {
  window.localStorage.setItem("mindreply-locale", nextLocale);
  publishLocale(nextLocale);

  const url = new URL(window.location.href);
  url.pathname = localizedPath(window.location.pathname, nextLocale);
  url.searchParams.delete("lang");
  window.location.assign(url.toString());
}

export default function LocaleAssist() {
  const [locale, setLocale] = useState<LocaleCode>(defaultLocale);

  useEffect(() => {
    const manualLocale = resolveManualLocale();
    const initialLocale = manualLocale || localeFromBrowser();
    setLocale(initialLocale);
    publishLocale(initialLocale);

    fetch("/api/geo-locale", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: GeoLocaleResponse | null) => {
        const detectedLocale = data?.recommendedLocale || "";
        const countryFallback = data?.country ? countryLocale[data.country] : undefined;
        const nextLocale = manualLocale || (isLocale(detectedLocale) ? detectedLocale : countryFallback || initialLocale);

        setMarketCount(data?.marketProfiles?.length || data?.priorityMarkets?.length || 11);
        setLocale(nextLocale);
        publishLocale(nextLocale);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    publishLocale(locale);
  }, [locale]);

  return (
    <section
      className="locale-assist-shell border-t border-white/10 bg-[#0d1729] px-4 py-2 text-[#f8f5f0] md:px-8"
      aria-label="Language"
      data-locale-count={localeCodes.length}
    >
      <div className="locale-assist-inner mx-auto flex max-w-7xl items-center justify-end gap-2 text-[11px] text-[#cdd8df]">
        <p className="sr-only">
          IP/browser matched. Country signal matched. Browser language matched. Full-site translation uses Google Translate.
        </p>
        <label className="flex items-center gap-2 font-semibold uppercase tracking-[0.14em] text-[#91d2c8]" htmlFor="mindreply-locale">
          <Globe2 aria-hidden className="h-3.5 w-3.5" />
          <span>Language</span>
          <span className="sr-only">IP/browser matched</span>
          <span className="sr-only">Country signal matched</span>
          <span className="sr-only">Browser language matched</span>
          <span className="sr-only">Full-site translation uses selected locale</span>
        </label>
        <select
          id="mindreply-locale"
          value={locale}
          onChange={(event) => {
            const nextLocale = event.target.value;
            if (!isLocale(nextLocale)) return;
            setLocale(nextLocale);
            navigateToLocale(nextLocale);
          }}
          className="max-w-44 rounded-md border border-white/10 bg-[#122033] px-2 py-1 text-[11px] font-semibold text-[#f8f5f0] outline-none transition focus:border-[#e2b757]"
          aria-label="Choose language"
        >
          {localeCodes.map((code) => (
            <option key={code} value={code}>
              {localeMeta[code].nativeLabel}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
