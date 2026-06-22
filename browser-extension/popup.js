// MindReply Browser Extension - Popup Script

async function analyzeText() {
    const input = document.getElementById('input');
    const status = document.getElementById('status');
    const text = input.value.trim();
    
    if (!text) {
        status.textContent = '⚠️ Paste some text first';
        status.className = 'status error';
        return;
    }
    
    status.textContent = '⏳ Analyzing...';
    status.className = 'status';
    status.style.display = 'block';
    
    try {
        // Call MindReply API
        const response = await fetch('https://mind-reply.com/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                source: 'extension'
            })
        });
        
        if (!response.ok) {
            throw new Error('Analysis failed');
        }
        
        const result = await response.json();
        
        // Store result for later view
        chrome.storage.local.set({
            lastAnalysis: result,
            timestamp: Date.now()
        });
        
        status.textContent = '✅ Analysis ready! Opening results...';
        status.className = 'status success';
        
        // Open results in new tab
        setTimeout(() => {
            chrome.tabs.create({
                url: `https://mind-reply.com/extension/results?id=${result.id}`
            });
        }, 1000);
        
    } catch (error) {
        status.textContent = '❌ ' + error.message;
        status.className = 'status error';
    }
}

function openWeb() {
    chrome.tabs.create({
        url: 'https://mind-reply.com/agent'
    });
}

// Auto-fill from selected text
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getSelectedText'}, function(response) {
        if (response && response.selectedText) {
            document.getElementById('input').value = response.selectedText;
        }
    });
});

// Allow Enter to submit
document.getElementById('input').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        analyzeText();
    }
});
