
/// <reference types="chrome" />

// Type definitions for TikTok page elements
interface TikTokElement extends HTMLElement {
  'data-e2e'?: string;
}

interface StopScriptOptions {
  message: string;
  error?: string;
}

const initiateRepostsVideosRemoval = async (): Promise<void> => {
  const sleep = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));

  // Define stopScript first to avoid hoisting issues
  const stopScript = (message: string, error: string = ""): void => {
    let logMessage = `${message}. Reloading page...`;
    if (error) {
      console.log({ message: logMessage, error });
    } else {
      console.log(logMessage);
    }
    setTimeout(() => window.location.reload(), 1000);
  };

  const waitForElement = async (
    selector: string, 
    timeout: number = 10000, 
    interval: number = 200
  ): Promise<Element> => {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const check = (): void => {
        try {
          const element = document.querySelector(selector);
          if (element) return resolve(element);
          if (Date.now() - start >= timeout) {
            return reject(new Error(`Timeout: Element ${selector} not found`));
          }
          setTimeout(check, interval);
        } catch (err) {
          reject(err);
        }
      };
      check();
    });
  };

  const closeVideo = async (): Promise<void> => {
    try {
      const closeVideoButton = await waitForElement('[data-e2e="browse-close"]', 5000) as HTMLElement;
      closeVideoButton.click();
      console.log("Closed video view.");
      stopScript("All actions executed successfully");
    } catch (error) {
      console.log("Could not find the close video button, but continuing...");
      stopScript("Process completed - could not close video automatically");
    }
  };

  const clickProfileTab = async (): Promise<boolean> => {
    try {
      const profileButton = await waitForElement('[data-e2e="nav-profile"]') as HTMLElement;
      profileButton.click();
      console.log("Successfully clicked the 'Profile' button.");
      await sleep(5000);
      return true;
    } catch (error) {
      stopScript("The 'Profile' button was not found on the page in time", error as string);
      return false;
    }
  };

  const clickRepostTab = async (): Promise<void> => {
    try {
      const repostTab = await waitForElement('[class*="PRepost"]') as HTMLElement;
      repostTab.click();
      console.log("Successfully opened the 'Reposts' tab.");
      await sleep(5000);
    } catch (error) {
      stopScript("Error clicking the 'Reposts' tab", error as string);
    }
  };

  const clickRepostVideo = async (): Promise<void> => {
    try {
      const firstVideo = await waitForElement('[class*="DivPlayerContainer"]') as HTMLElement;
      firstVideo.click();
      console.log("Successfully opened the first reposted video.");
      await sleep(5000);
    } catch (error) {
      stopScript("No reposted videos found or unable to open", error as string);
    }
  };

  const clickNextRepostAndRemove = async (): Promise<void> => {
    try {
      const interval = setInterval(async () => {
        try {
          const nextVideoButton = document.querySelector('[data-e2e="arrow-right"]') as HTMLElement;
          const repostButton = document.querySelector('[data-e2e="video-share-repost"]') as HTMLElement;

          if (!repostButton) {
            clearInterval(interval);
            console.log("No more repost buttons found");
            await closeVideo();
            return;
          }

          repostButton.click();
          console.log("Removed repost from current video.");

          if (!nextVideoButton || (nextVideoButton as any).disabled) {
            clearInterval(interval);
            console.log("No next video button or it's disabled");
            await closeVideo();
            return;
          }

          nextVideoButton.click();
          console.log("Moved to next reposted video.");
        } catch (innerError) {
          console.log("Error in processing loop:", innerError);
          clearInterval(interval);
          stopScript("Error during reposted video removal", innerError as string);
        }
      }, 2000);
    } catch (error) {
      stopScript("Error during reposted video removal", error as string);
    }
  };

  try {
    console.log("Script started...");
    const wentToProfile = await clickProfileTab();
    if (!wentToProfile) return;
    await clickRepostTab();
    await clickRepostVideo();
    await clickNextRepostAndRemove();
  } catch (error) {
    stopScript("Unexpected error in main flow", error as string);
  }
};

// Initialize the script with error handling
try {
  initiateRepostsVideosRemoval();
} catch (error) {
  console.error("Failed to start the reposts removal script:", error);
}
