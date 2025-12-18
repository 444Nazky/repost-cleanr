

// Message interface for type safety
interface MessageRequest {
  action: string;
}

// Service worker logic with TypeScript
chrome.runtime.onMessage.addListener(async function (
  request: MessageRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): Promise<void> {
  if (request.action === "removeRepostedVideos") {
    try {
      const tab = await chrome.tabs.create({
        url: "https://www.tiktok.com/",
        active: true,
      });




      chrome.tabs.onUpdated.addListener(function listener(tabId: number, changeInfo: any, tab: chrome.tabs.Tab) {
        if (tabId === tab.id && changeInfo.status === "complete") {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["script.js"],
          });
          chrome.tabs.onUpdated.removeListener(listener);
        }
      });
    } catch (error) {
      console.log({
        message: "Error opening TikTok or starting script.",
        error,
      });
    }
  }
});
