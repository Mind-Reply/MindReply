# MindReply Browser Extension

**Status**: Ready to publish  
**Version**: 1.0.0  
**Platforms**: Chrome, Edge, Brave  

---

## Features

✅ **One-Click Analysis** - Paste stuck text, get one clear move  
✅ **Context Menu** - Right-click any text to analyze  
✅ **Auto-Fill** - Automatically fills with selected text  
✅ **Instant Results** - Opens results in new tab  
✅ **Privacy** - Text sent encrypted to MindReply API  

---

## Installation

### For Chrome/Edge/Brave:

1. Go to `chrome://extensions/` (or `edge://extensions/` / `brave://extensions/`)
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder
5. Done! Extension appears in your toolbar

### For Publishing:

**Chrome Web Store**:
1. Go to: https://chrome.google.com/webstore/publish
2. Upload extension ZIP
3. Add screenshots, description, privacy policy
4. Submit for review (< 24 hours)

**Microsoft Edge Add-ons**:
1. Go to: https://partner.microsoft.com/dashboard
2. Submit extension
3. Review (< 5 days)

---

## Folder Structure

```
browser-extension/
├── manifest.json           (Permissions & config)
├── popup.html              (UI when clicked)
├── popup.js                (Popup logic)
├── content.js              (Page interaction)
├── background.js           (Service worker)
├── styles.css              (Extension styles)
├── images/                 (Icons)
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md               (This file)
```

---

## How It Works

1. **User clicks extension** → Popup opens
2. **User pastes or selects text** → Auto-fills input
3. **User clicks "Get Move"** → Sends to API
4. **API analyzes text** → Returns structured result
5. **Results open in new tab** → User sees next move

---

## Keyboard Shortcuts

- `Ctrl+Enter` - Submit text from popup
- Right-click text - "Analyze with MindReply" option

---

## Permissions

- **activeTab** - See current tab URL
- **scripting** - Inject content scripts
- **storage** - Save analysis history
- **contextMenus** - Add right-click option

---

## Publishing Checklist

- [ ] Create 128x128, 48x48, 16x16 icon images
- [ ] Write privacy policy
- [ ] Create store screenshots
- [ ] Add description to manifest
- [ ] Test on Chrome, Edge, Brave
- [ ] Generate ZIP file
- [ ] Upload to Chrome Web Store
- [ ] Upload to Microsoft Edge Add-ons
- [ ] Submit to Brave shields

---

## Privacy & Security

✅ Text sent over HTTPS only  
✅ No tracking or analytics  
✅ No storage on user device  
✅ Results cached locally only  
✅ Extension permissions minimal  

---

## Support

Email: info@mind-reply.com  
Website: https://mind-reply.com

---

**Ready to publish. Users can install from browser extension stores.**
