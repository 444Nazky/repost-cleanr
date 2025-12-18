# Chrome Extension Debugging Guide

## Loading the Extension for Debugging

### 1. Open Chrome Extensions Page
```
chrome://extensions/
```

### 2. Enable Developer Mode
- Toggle the switch in the top-right corner to "Developer mode"

### 3. Load Unpacked Extension
- Click "Load unpacked" button
- Select the folder: `/Users/nazky/Documents/RPL/repost-cleanr/`
- The extension should appear in your list

### 4. Pin Extension (Optional)
- Click the puzzle piece icon in Chrome toolbar
- Find "TikTok All Reposted Videos Remover"
- Click the pin icon to keep it visible

## Debugging the Extension

### 1. Open Developer Tools for Extension Popup
- Right-click the extension icon in toolbar
- Select "Inspect popup"
- This opens Developer Tools for the popup interface

### 2. Debug Background Script
- Go to `chrome://extensions/`
- Find your extension
- Click "Service Worker" or "background page" link
- Opens Developer Tools for background script

### 3. Debug Content Script on TikTok
- Start the extension (it will open TikTok)
- Open Developer Tools in the TikTok tab (F12)
- Check Console for script.js output
- Look for the script injection and execution

## Common Debugging Steps

### Check Extension Permissions
1. Verify the extension has necessary permissions:
   - `scripting`
   - `tabs`
   - `https://*.tiktok.com/*` host permissions

### Check Console Logs
Look for these messages in order:
1. "Script started..." - from script.js
2. "Successfully clicked the 'Profile' button."
3. "Successfully opened the 'Reposts' tab."
4. "Successfully opened the first reposted video."

### If Script Stops Working
1. Check if TikTok has changed their selectors
2. Verify you're logged into TikTok
3. Wait for rate limiting (1 hour) if TikTok blocks actions
4. Check network connectivity

### Common Issues & Solutions

#### Issue: Profile button not found
- Solution: Make sure you're logged into TikTok first
- Check if TikTok's HTML structure changed

#### Issue: Reposts tab not found
- Solution: Verify you have reposted videos
- Check if the selector `[class*="PRepost"]` is still valid

#### Issue: No repost buttons found
- Solution: Process completed successfully
- Refresh the Reposts tab to confirm removal

#### Issue: Script stops mid-process
- Solution: Check console for error messages
- TikTok may be rate-limiting; wait 1 hour before retrying

## Testing Different Scenarios

### Test 1: Basic Functionality
1. Load extension
2. Open Developer Tools popup
3. Click "Start Removing Reposts"
4. Monitor console output

### Test 2: Error Handling
1. Disconnect internet
2. Try to run extension
3. Check error handling

### Test 3: TikTok Rate Limiting
1. Run extension with many reposts
2. If it stops, wait 1 hour
3. Run again to continue

## Extension File Structure for Debugging
```
/Users/nazky/Documents/RPL/repost-cleanr/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup script
├── background.js         # Background service worker
├── script.js             # Content script (injected into TikTok)
├── styles.css            # Popup styles
└── icon.png              # Extension icon
```

## Debug Commands

### Check Extension Status
```javascript
// In popup console
chrome.runtime.getContexts({}, (contexts) => {
  console.log('Extension contexts:', contexts);
});
```

### Test Messaging
```javascript
// In popup console
chrome.runtime.sendMessage({action: "removeRepostedVideos"}, (response) => {
  console.log('Background response:', response);
});
```

### Check TikTok Page State
```javascript
// In TikTok page console
console.log('Profile button:', document.querySelector('[data-e2e="nav-profile"]'));
console.log('Repost tab:', document.querySelector('[class*="PRepost"]'));
```

## Best Practices for Debugging

1. **Always test with Developer Tools open**
2. **Check console logs before reporting issues**
3. **Verify TikTok login status before running**
4. **Test with small number of reposts first**
5. **Monitor network requests if needed**
6. **Use Chrome's Network tab to check for failed requests**

## Reporting Bugs

When reporting issues, include:
- Chrome version
- Extension version
- Console error messages
- Steps to reproduce
- Expected vs actual behavior
