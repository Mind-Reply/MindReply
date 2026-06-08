const input = document.getElementById("input");
const result = document.getElementById("result");
const assess = document.getElementById("assess");

chrome.storage.local.get(["mindreply_last_selection", "mindreply_last_decision"], (data) => {
  input.value = data.mindreply_last_selection || "";
  if (data.mindreply_last_decision) render(data.mindreply_last_decision);
});

function render(decision) {
  result.innerHTML = `
    <p class="eyebrow">Synthesis</p>
    <p>${decision.synthesis}</p>
    <p class="eyebrow">Action Layer</p>
    <strong>${decision.recommended_action}</strong>
  `;
}

assess.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "MINDREPLY_TRIAGE_SELECTION", text: input.value }, render);
});
