'use strict';

(() => {
  const startTime = Date.now();
  const MINUTE_TO_MILLISECOND = 60 * 1000;
  let stayTime = 0;

  let isEnable = false;

  chrome.storage.sync.get(['stayTime', 'enableSites'], (items) => {
    stayTime = items.stayTime;

    const enableSites = JSON.parse(items.enableSites ?? '[]');
    const url = window.location.host;
    isEnable = enableSites.includes(url);
  });

  const modal = document.getElementById('beforeleave-modal');

  window.addEventListener('beforeunload', (event) => {
    if (!isEnable) {
      return;
    }

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    if (elapsedTime < stayTime * MINUTE_TO_MILLISECOND) {
      return;
    }

    event.preventDefault();
    event.returnValue = '';
    modal.style.display = 'block';
  });

  window.addEventListener('unload', (event) => {
    modal.style.display = 'none';
  });
})();
