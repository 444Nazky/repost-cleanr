// TikTok repost removal script with TypeScript

const initiateRepostsVideosRemoval = async (): Promise<void> => {
  const sleep = (ms: number): Promise<void> => 
    new Promise((resolve) => setTimeout(resolve, ms));

  const waitForElement = async (
    selector: string, 
    timeout: number = 10000, 
    interval: number = 200
  ): Promise<Element> => {
    const start: number = Date.now();
    return new Promise((resolve, reject) => {
      const check = (): void => {
        const element: Element | null = document.querySelector(selector);
        if (element) return resolve(element);
        if (Date.now() - start >= timeout) {
          return reject(new Error(`Timeout: Element ${selector} not found`));
        }
        setTimeout(check, interval);
      };
      check();
    });
  };


  const clickProfileTab = async (): Promise<boolean> => {
    try {
      const profileButton: HTMLElement = await waitForElement('[data-e2e="nav-profile"]') as HTMLElement;
      profileButton.click();
      console.log("Successfully clicked the 'Profile' button.");
      await sleep(5000);
      return true;
    } catch (error) {
      stopScript(
        "The 'Profile' button was not found on the page in time",
        error as Error
      );
      return false;
    }
  };


  const clickRepostTab = async (): Promise<void> => {
    try {
      const repostTab: HTMLElement = await waitForElement('[class*="PRepost"]') as HTMLElement;
      repostTab.click();
      console.log("Successfully opened the 'Reposts' tab.");
      await sleep(5000);
    } catch (error) {
      stopScript("Error clicking the 'Reposts' tab", error as Error);
    }
  };

  const clickRepostVideo = async (): Promise<void> => {
    try {
      const firstVideo: HTMLElement = await waitForElement('[class*="DivPlayerContainer"]') as HTMLElement;
      firstVideo.click();
      console.log("Successfully opened the first reposted video.");
      await sleep(5000);
    } catch (error) {
      stopScript("No reposted videos found or unable to open", error as Error);
    }
  };

  const clickNextRepostAndRemove = async (): Promise<void> => {
    try {
      const interval: number = setInterval(async () => {
        const nextVideoButton: HTMLElement | null = document.querySelector(
          '[data-e2e="arrow-right"]'
        ) as HTMLElement;
        const repostButton: HTMLElement | null = document.querySelector(
          '[data-e2e="video-share-repost"]'
        ) as HTMLElement;

        if (!repostButton) {
          clearInterval(interval);
          stopScript("Repost button not found");
          return;
        }

        repostButton.click();
        console.log("Removed repost from current video.");

        if (!nextVideoButton || (nextVideoButton as any).disabled) {
          clearInterval(interval);
          closeVideo();
          return;
        }

        nextVideoButton.click();
        console.log("Moved to next reposted video.");
      }, 2000);
    } catch (error) {
      stopScript("Error during reposted video removal", error as Error);
    }
  };

  const closeVideo = async (): Promise<void> => {
    try {
      const closeVideoButton: HTMLElement | null = document.querySelector(
        '[data-e2e="browse-close"]'
      ) as HTMLElement;
      if (closeVideoButton) {
        closeVideoButton.click();
        console.log("Closed video view.");
        stopScript("All actions executed successfully");
      } else {
        stopScript("Could not find the close video button");
      }
    } catch (error) {
      stopScript("Error closing the video", error as Error);
    }
  };

  const stopScript = (message: string, error: Error = new Error()): void => {
    let logMessage: string = `${message}. Reloading page...`;
    if (error.message) {
      console.log({ message: logMessage, error });
    } else {
      console.log(logMessage);
    }
    setTimeout(() => window.location.reload(), 1000);
  };

  try {
    console.log("Script started...");
    const wentToProfile: boolean = await clickProfileTab();
    if (!wentToProfile) return;
    await clickRepostTab();
    await clickRepostVideo();
    await clickNextRepostAndRemove();
  } catch (error) {
    stopScript("Unexpected error in main flow", error as Error);
  }
};

// Execute the script
initiateRepostsVideosRemoval();
