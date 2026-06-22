// MindReply Browser Extension - Background Service Worker

chrome.contextMenus.create({
    id: 'mindreply-analyze',
    title: 'Analyze with MindReply',
    contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'mindreply-analyze') {
        chrome.tabs.sendMessage(tab.id, {
            action: 'analyzeSelection',
            text: info.selectionText
        });
    }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Icon updates on page load
    }
});

// Handle badge updates
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.lastAnalysis) {
        chrome.action.setBadgeText({text: '✓'});
        chrome.action.setBadgeBackgroundColor({color: '#4CAF50'});
        
        setTimeout(() => {
            chrome.action.setBadgeText({text: ''});
        }, 3000);
    }
});
