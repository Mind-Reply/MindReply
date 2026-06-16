const DEFAULT_ENDPOINT = "https://www.mind-reply.com/api/intake";
const SUPPORTED_LOCALES = new Set(["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"]);

function resolveLocale() {
  const uiLocale = chrome.i18n.getUILanguage().toLowerCase().split("-")[0];
  return SUPPORTED_LOCALES.has(uiLocale) ? uiLocale : "en";
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "mindreply-intake",
    title: chrome.i18n.getMessage("contextClarifyNextMove") || "MindReply: clarify next move",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id || !info.selectionText) return;
  const endpoint = (await chrome.storage.sync.get("endpoint")).endpoint || DEFAULT_ENDPOINT;
  const locale = resolveLocale();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: info.selectionText, source: "extension", locale })
  });
  const decision = await response.json();
  await chrome.tabs.sendMessage(tab.id, { type: "MINDREPLY_DECISION", decision });
});
