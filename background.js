'use strict';

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith('chrome://')) {
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['onclick-badge.js'],
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-dialog') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      if (tab.url.startsWith('chrome://')) {
        return;
      }
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['onclick-badge.js'],
      });
    });
  }
});
