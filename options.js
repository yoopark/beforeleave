'use strict';

const stayTimeSelect = document.getElementById('stay-time');
const enableSitesSection = document.getElementById('enable-sites');
const commentsSection = document.getElementById('comments');

const restoreOptions = () => {
  chrome.storage.sync.get(['stayTime', 'enableSites', 'comments'], (items) => {
    stayTimeSelect.value = items.stayTime;

    const enableSitesList = document.createElement('ul');
    enableSitesList.className = 'enable-sites-list';

    const enableSites = JSON.parse(items.enableSites ?? '[]');
    enableSites.forEach((url) => {
      const li = document.createElement('li');
      li.className = 'enable-site-item';

      const enableSiteSpan = document.createElement('span');
      enableSiteSpan.textContent = url;

      const deleteBtn = document.createElement('span');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '×';
      deleteBtn.addEventListener('click', () => {
        const index = enableSites.indexOf(url);
        if (index > -1) {
          enableSites.splice(index, 1);
        }
        chrome.storage.sync.set({ enableSites: JSON.stringify(enableSites) });
        li.remove();
      });

      li.appendChild(enableSiteSpan);
      li.appendChild(deleteBtn);

      enableSitesList.appendChild(li);
    });

    enableSitesSection.appendChild(enableSitesList);

    const commentsList = document.createElement('ul');
    commentsList.className = 'comments-list';

    const comments = JSON.parse(items.comments ?? '{}');
    Object.entries(comments).forEach(([url, comment]) => {
      const li = document.createElement('li');
      li.className = 'comment-item';
      li.textContent = comment;
      commentsList.appendChild(li);
    });

    commentsSection.appendChild(commentsList);
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);

stayTimeSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ stayTime: stayTimeSelect.value });
});
