'use strict';

(() => {
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

  const textArea = document.createElement('textarea');
  textArea.id = 'beforeleave-dialog-textarea';
  textArea.placeholder = 'Leave your thoughts before you leave...';

  dialogBody.appendChild(textArea);

  const dialogFooter = document.createElement('div');
  dialogFooter.id = 'beforeleave-dialog-footer';

  const submitBtn = document.createElement('button');
  submitBtn.id = 'beforeleave-dialog-submit';
  submitBtn.innerText = 'Submit';

  submitBtn.disabled = true;
  textArea.addEventListener('input', () => {
    submitBtn.disabled = textArea.value === '';
  });

  submitBtn.addEventListener('click', () => {
    const request = {
      comment: textArea.value,
    };

    chrome.runtime.sendMessage(request, (response) => {
      modal.style.display = 'none';
      console.log(response);
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
