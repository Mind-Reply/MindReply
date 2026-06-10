const chromeLabels = {
  en: { risk: "Risk", receipt: "Receipt" },
  es: { risk: "Riesgo", receipt: "Recibo" },
  fr: { risk: "Risque", receipt: "Reçu" },
  de: { risk: "Risiko", receipt: "Beleg" },
  pt: { risk: "Risco", receipt: "Recibo" },
  ar: { risk: "الخطر", receipt: "الإيصال" },
  hi: { risk: "जोखिम", receipt: "रसीद" },
  ja: { risk: "リスク", receipt: "記録" },
  zh: { risk: "风险", receipt: "回执" },
  uk: { risk: "Ризик", receipt: "Квитанція" },
  bg: { risk: "Риск", receipt: "Разписка" },
};

function labelSet(locale) {
  return chromeLabels[locale] || chromeLabels.en;
}

function appendText(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "MINDREPLY_DECISION") return;
  const decision = message.decision;
  const existing = document.getElementById("mindreply-inline-decision");
  if (existing) existing.remove();

  const labels = labelSet(decision.locale);
  const panel = document.createElement("aside");
  panel.id = "mindreply-inline-decision";
  panel.dir = decision.locale === "ar" ? "rtl" : "ltr";

  appendText(panel, "strong", "MindReply");
  appendText(panel, "p", decision.synthesis || "");
  appendText(panel, "button", decision.recommendedAction?.label || "");
  appendText(
    panel,
    "small",
    `${labels.risk}: ${decision.risk?.level || "low"} · ${labels.receipt}: ${decision.receipt?.id || "pending"}`,
  );

  document.body.appendChild(panel);
});
