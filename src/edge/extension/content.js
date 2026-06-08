document.addEventListener("mouseup", () => {
  const text = String(window.getSelection()?.toString() || "").trim();
  if (!text) return;
  chrome.storage.local.set({ mindreply_last_selection: text.slice(0, 1000) });
});
