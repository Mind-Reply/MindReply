const HIGH_RISK = /\b(legal|claim|breach|liability|termination|harassment)\b/i;
const CALENDAR = /\b(calendar|meeting|call|available|schedule|tomorrow)\b/i;
const RESOLVED = /\b(done|resolved|approved|complete|thank you|thanks)\b/i;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ mindreply_mode: "snippet-only" });
  chrome.contextMenus.create({
    id: "mindreply-intake",
    title: "MindReply: assess selection",
    contexts: ["selection"]
  });
});

function decide(text) {
  const cleaned = String(text || "").trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return {
      synthesis: "No usable signal was selected. Recommended action: resolve.",
      recommended_action: "resolve",
      risk: "low"
    };
  }

  let action = "reply";
  if (HIGH_RISK.test(cleaned)) action = "escalate";
  else if (CALENDAR.test(cleaned)) action = "schedule";
  else if (RESOLVED.test(cleaned)) action = "resolve";

  const risk = HIGH_RISK.test(cleaned) ? "high" : /\b(urgent|deadline|refund|angry)\b/i.test(cleaned) ? "medium" : "low";
  const short = cleaned.length > 132 ? `${cleaned.slice(0, 129).trim()}...` : cleaned;
  return {
    synthesis: `${short} Recommended action: ${action}.`,
    recommended_action: action,
    risk
  };
}

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== "mindreply-intake") return;
  chrome.storage.local.set({ mindreply_last_decision: decide(info.selectionText) });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "MINDREPLY_TRIAGE_SELECTION") return false;
  const result = decide(message.text);
  chrome.storage.local.set({ mindreply_last_decision: result });
  sendResponse(result);
  return true;
});
