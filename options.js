'use strict';

const stayTimeSelect = document.getElementById('stay-time');
const commentsSection = document.getElementById('comments');

const restoreOptions = () => {
  chrome.storage.sync.get(['stayTime', 'enableSites', 'comments'], (items) => {
    stayTimeSelect.value = items.stayTime;

    // document.getElementById('enable-sites').value = items.enableSites;

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

const saveOptions = () => {
  const stayTime = stayTimeSelect.value;
  // const enableSites = document.getElementById('enable-sites').value;
  // const comments = document.getElementById('comments').value;
  chrome.storage.sync.set({
    stayTime,
    // enableSites,
    // comments,
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);

const saveBtn = document.getElementById('save');
saveBtn.addEventListener('click', saveOptions);
