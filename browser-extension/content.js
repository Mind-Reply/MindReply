// MindReply Browser Extension - Content Script

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        const selectedText = window.getSelection().toString();
        sendResponse({selectedText: selectedText});
    }
});

// Add context menu for selected text
chrome.runtime.sendMessage({
    action: 'setContextMenu',
    text: 'Analyze with MindReply'
});

// Listen for context menu clicks
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeSelection') {
        const selectedText = window.getSelection().toString();
        chrome.runtime.sendMessage({
            action: 'analyzeText',
            text: selectedText
        });
    }
});
