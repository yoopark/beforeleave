'use strict';

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith('chrome://')) {
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  });
});

// Ref. https://developer.chrome.com/docs/extensions/reference/api/tabs?hl=ko#get_the_current_tab
const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const { url } = await getCurrentTab();
    const { comment } = message;

    console.log(url, comment);
    chrome.storage.sync.set({ [url]: comment });

    const response = {
      message: 'Saved!',
    };
    sendResponse(response);
  })();

  // Important! Return true to indicate you want to send a response asynchronously
  // Ref. https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
  return true;
});
