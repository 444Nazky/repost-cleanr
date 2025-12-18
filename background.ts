


/// <reference types="chrome" />

// Message request interfaces
interface RemoveRepostedVideosRequest {
  action: 'removeRepostedVideos';
}

interface OpenExtensionsPageRequest {
  action: 'openExtensionsPage';
}

interface ChromeMessageResponse {
  success?: boolean;
  message?: string;
}

type ChromeMessageRequest = RemoveRepostedVideosRequest | OpenExtensionsPageRequest;


chrome.runtime.onMessage.addListener((
  request: ChromeMessageRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: ChromeMessageResponse) => void
): void | boolean => {
  if (request.action === 'removeRepostedVideos') {
    (async () => {
      try {
        const tab = await chrome.tabs.create({
          url: 'https://www.tiktok.com/',
          active: true,
        });

        chrome.tabs.onUpdated.addListener(function listener(tabId: number, info: any) {
          if (tabId === tab.id && info.status === 'complete') {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['script.js'],
            });
            chrome.tabs.onUpdated.removeListener(listener);
          }
        });
      } catch (error) {
        console.log({
          message: 'Error opening TikTok or starting script.',
          error,
        });
      }
    })();
  }
  
  if (request.action === 'openExtensionsPage') {
    (async () => {
      try {
        await chrome.tabs.create({
          url: 'chrome://extensions/',
          active: true,
        });
        sendResponse({ success: true, message: 'Opened Chrome extensions page' });
      } catch (error) {
        console.log({
          message: 'Error opening extensions page.',
          error,
        });
        sendResponse({ success: false, message: 'Failed to open extensions page' });
      }
    })();
    return true; // Will respond asynchronously
  }
});

// Check if extension is being debugged and redirect to extensions page
chrome.runtime.onInstalled.addListener(async (details: chrome.runtime.InstalledDetails) => {
  if (details.reason === 'install') {
    console.log('Extension installed successfully');
    // Optionally open extensions page on first install
    // await chrome.tabs.create({ url: 'chrome://extensions/' });
  }
});

// Detect debugging and redirect to extensions page
chrome.runtime.onStartup.addListener(async () => {
  // Check if we should redirect to extensions page for debugging
  const isDebugMode = await checkDebugMode();
  if (isDebugMode) {
    await chrome.tabs.create({
      url: 'chrome://extensions/',
      active: true,
    });
  }
});

// Function to check if debug mode should be enabled
async function checkDebugMode(): Promise<boolean> {
  try {
    // Check if there are any development tools open
    const tabs = await chrome.tabs.query({});
    const devToolsOpen = tabs.some((tab: chrome.tabs.Tab) => 
      tab.url && (tab.url.includes('chrome-extension://') || tab.url.includes('devtools'))
    );
    
    // Check if URL contains debug parameter
    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = currentTab[0]?.url || '';
    const hasDebugParam = currentUrl.includes('debug=true');
    
    return devToolsOpen || hasDebugParam;
  } catch (error) {
    console.log('Error checking debug mode:', error);
    return false;
  }
}
