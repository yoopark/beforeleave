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
