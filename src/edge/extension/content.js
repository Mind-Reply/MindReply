chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "MINDREPLY_DECISION") return;
  renderDecision(message.decision);
});

document.addEventListener("mouseup", () => {
  const selection = window.getSelection()?.toString().trim();
  if (!selection || selection.length < 12) return;
  showInlineTrigger(selection);
});

function showInlineTrigger(text) {
  removeElement("mindreply-inline-trigger");
  const trigger = document.createElement("button");
  trigger.id = "mindreply-inline-trigger";
  trigger.type = "button";
  trigger.textContent = "MindReply";
  trigger.addEventListener("click", () => {
    trigger.disabled = true;
    chrome.runtime.sendMessage({ type: "MINDREPLY_DECIDE", text }, (response) => {
      trigger.remove();
      if (!response?.ok) {
        renderError(response?.error || "MindReply could not read that selection.");
        return;
      }
      renderDecision(response.decision);
    });
  });
  document.body.appendChild(trigger);
}

function renderDecision(decision) {
  removeElement("mindreply-inline-decision");
  const panel = document.createElement("aside");
  panel.id = "mindreply-inline-decision";

  const title = document.createElement("strong");
  title.textContent = "MindReply";
  panel.appendChild(title);

  const synthesis = document.createElement("p");
  synthesis.textContent = decision?.synthesis || "One synthesis is ready.";
  panel.appendChild(synthesis);

  const action = document.createElement("button");
  action.type = "button";
  action.textContent = decision?.recommendedAction?.label || "Proceed when ready";
  panel.appendChild(action);

  const details = document.createElement("small");
  const risk = decision?.risk?.level || "low";
  const receipt = decision?.receipt?.id || "pending";
  details.textContent = `Risk: ${risk} · Receipt: ${receipt}`;
  panel.appendChild(details);

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  close.setAttribute("aria-label", "Close MindReply panel");
  close.addEventListener("click", () => panel.remove());
  panel.appendChild(close);

  document.body.appendChild(panel);
}

function renderError(message) {
  renderDecision({
    synthesis: message,
    recommendedAction: { label: "Try again" },
    risk: { level: "low" },
    receipt: { id: "none" }
  });
}

function removeElement(id) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
}
