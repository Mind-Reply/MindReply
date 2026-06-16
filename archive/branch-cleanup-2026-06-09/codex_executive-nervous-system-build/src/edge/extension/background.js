const DEFAULT_ENDPOINT = "https://www.mind-reply.com/api/intake";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "mindreply-intake",
    title: "MindReply: clarify next move",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id || !info.selectionText) return;
  const decision = await requestDecision(info.selectionText);
  await chrome.tabs.sendMessage(tab.id, { type: "MINDREPLY_DECISION", decision });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "MINDREPLY_DECIDE" || !message.text) return false;
  requestDecision(message.text)
    .then((decision) => sendResponse({ ok: true, decision }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});

async function requestDecision(text) {
  const stored = await chrome.storage.sync.get("endpoint");
  const endpoint = stored.endpoint || DEFAULT_ENDPOINT;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: text,
      source: "extension",
      consentFullContent: false,
      devicePrivacyFlag: false
    })
  });
  if (!response.ok) {
    throw new Error(`MindReply request failed with ${response.status}`);
  }
  return response.json();
}
