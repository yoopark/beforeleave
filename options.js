'use strict';

(() => {
  const stayTimeSelect = document.getElementById('stay-time');
  const enableSitesSection = document.getElementById('enable-sites');
  const commentsSection = document.getElementById('comments');

  const truncate = (str, n) => {
    return str.length > n ? str.slice(0, n - 1) + ' …' : str;
  };

  const restoreOptions = () => {
    chrome.storage.sync.get(
      ['stayTime', 'enableSites', 'comments'],
      (items) => {
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
            chrome.storage.sync.set({
              enableSites: JSON.stringify(enableSites),
            });
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
          const commentItem = document.createElement('li');
          commentItem.className = 'comment-item';

          const openGraph = document.createElement('div');
          openGraph.className = 'open-graph';

          fetch(url)
            .then((response) => response.text())
            .then((html) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const image = doc.querySelector('meta[property="og:image"]');
              const title = doc.querySelector('meta[property="og:title"]');
              const description = doc.querySelector(
                'meta[property="og:description"]'
              );

              const openGraphImage = document.createElement('img');
              openGraphImage.className = 'open-graph-image';
              openGraphImage.src = image ? image.content : '';

              const openGraphContent = document.createElement('div');
              openGraphContent.className = 'open-graph-content';

              const openGraphTitle = document.createElement('div');
              openGraphTitle.className = 'open-graph-title';
              openGraphTitle.innerText = title ? title.content : '';

              const openGraphDescription = document.createElement('div');
              openGraphDescription.className = 'open-graph-description';
              openGraphDescription.innerText = description
                ? truncate(description.content, 80)
                : '';

              openGraphContent.appendChild(openGraphTitle);
              openGraphContent.appendChild(openGraphDescription);

              openGraph.appendChild(openGraphImage);
              openGraph.appendChild(openGraphContent);
            });

          const commentText = document.createElement('div');
          commentText.className = 'comment-text';
          commentText.textContent = comment;

          commentItem.appendChild(openGraph);
          commentItem.appendChild(commentText);

          commentsList.appendChild(commentItem);
        });

        commentsSection.appendChild(commentsList);
      }
    );
  };

  document.addEventListener('DOMContentLoaded', restoreOptions);

  stayTimeSelect.addEventListener('change', () => {
    chrome.storage.sync.set({ stayTime: stayTimeSelect.value });
  });
})();
