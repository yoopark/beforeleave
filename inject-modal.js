'use strict';

(() => {
  const truncate = (str, n) => {
    return str.length > n ? str.slice(0, n - 1) + ' …' : str;
  };

  const modal = document.createElement('div');
  modal.id = 'beforeleave-modal';

  const dimmer = document.createElement('div');
  dimmer.id = 'beforeleave-dimmer';
  dimmer.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  const dialog = document.createElement('div');
  dialog.id = 'beforeleave-dialog';

  const dialogHeader = document.createElement('div');
  dialogHeader.id = 'beforeleave-dialog-header';

  const dialogTitle = document.createElement('h2');
  dialogTitle.id = 'beforeleave-dialog-title';
  dialogTitle.innerText = 'Comment';

  const closeBtn = document.createElement('span');
  closeBtn.id = 'beforeleave-dialog-close';
  closeBtn.innerText = '×';
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  dialogHeader.appendChild(dialogTitle);
  dialogHeader.appendChild(closeBtn);

  const dialogBody = document.createElement('div');
  dialogBody.id = 'beforeleave-dialog-body';

  const openGraph = document.createElement('div');
  openGraph.id = 'beforeleave-dialog-open-graph';

  fetch(window.location.href)
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const image = doc.querySelector('meta[property="og:image"]');
      const title = doc.querySelector('meta[property="og:title"]');
      const description = doc.querySelector('meta[property="og:description"]');

      const openGraphImage = document.createElement('img');
      openGraphImage.id = 'beforeleave-dialog-open-graph-image';
      openGraphImage.src = image ? image.content : '';

      const openGraphContent = document.createElement('div');
      openGraphContent.id = 'beforeleave-dialog-open-graph-content';

      const openGraphTitle = document.createElement('div');
      openGraphTitle.id = 'beforeleave-dialog-open-graph-title';
      openGraphTitle.innerText = title ? title.content : '';

      const openGraphDescription = document.createElement('div');
      openGraphDescription.id = 'beforeleave-dialog-open-graph-description';
      openGraphDescription.innerText = description
        ? truncate(description.content, 80)
        : '';

      openGraphContent.appendChild(openGraphTitle);
      openGraphContent.appendChild(openGraphDescription);

      openGraph.appendChild(openGraphImage);
      openGraph.appendChild(openGraphContent);
    });

  dialogBody.appendChild(openGraph);

  const textArea = document.createElement('textarea');
  textArea.id = 'beforeleave-dialog-textarea';
  textArea.placeholder = 'Leave your thoughts before you leave...';
  chrome.storage.sync.get(['comments'], (items) => {
    const comments = JSON.parse(items.comments ?? '{}');
    const url = window.location.href;
    textArea.value = comments[url] ?? '';
  });

  dialogBody.appendChild(textArea);

  const dialogFooter = document.createElement('div');
  dialogFooter.id = 'beforeleave-dialog-footer';

  const enableSiteCheckbox = document.createElement('input');
  enableSiteCheckbox.id = 'beforeleave-dialog-enable-site';
  enableSiteCheckbox.type = 'checkbox';

  chrome.storage.sync.get(['enableSites'], (items) => {
    const enableSites = JSON.parse(items.enableSites ?? '[]');
    const url = window.location.host;
    enableSiteCheckbox.checked = enableSites.includes(url);
  });

  enableSiteCheckbox.addEventListener('change', (event) => {
    const url = window.location.host;
    chrome.storage.sync.get(['enableSites'], (items) => {
      const enableSites = JSON.parse(items.enableSites ?? '[]');
      if (event.target.checked) {
        enableSites.push(url);
      } else {
        const index = enableSites.indexOf(url);
        if (index > -1) {
          enableSites.splice(index, 1);
        }
      }
      chrome.storage.sync.set({ enableSites: JSON.stringify(enableSites) });
    });
  });

  const enableSiteLabel = document.createElement('label');
  enableSiteLabel.id = 'beforeleave-dialog-enable-site-label';
  enableSiteLabel.innerText = `Enable on ${window.location.host}`;

  enableSiteLabel.appendChild(enableSiteCheckbox);
  dialogFooter.appendChild(enableSiteLabel);

  const submitBtn = document.createElement('button');
  submitBtn.id = 'beforeleave-dialog-submit';
  submitBtn.innerText = 'Submit';

  submitBtn.disabled = true;
  textArea.addEventListener('input', () => {
    submitBtn.disabled = textArea.value === '';
  });

  submitBtn.addEventListener('click', () => {
    const url = window.location.href;
    const comment = textArea.value;

    chrome.storage.sync.get('comments', (items) => {
      const comments = JSON.parse(items.comments ?? '{}');

      comments[url] = comment;
      chrome.storage.sync.set({ comments: JSON.stringify(comments) });

      modal.style.display = 'none';
    });
  });

  dialogFooter.appendChild(submitBtn);

  dialog.appendChild(dialogHeader);
  dialog.appendChild(dialogBody);
  dialog.appendChild(dialogFooter);

  modal.appendChild(dimmer);
  modal.appendChild(dialog);

  document.body.appendChild(modal);
})();
