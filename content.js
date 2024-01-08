'use strict';

(() => {
  const modal = document.getElementById('beforeleave-modal');

  if (modal === null) {
    return;
  }

  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
})();
