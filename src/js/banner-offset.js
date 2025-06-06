function adjustOffsets() {
  const banner = document.getElementById('banner');
  const header = document.getElementById('header');
  const progress = document.getElementById('progress-bar');

  if (!banner || !header) return;

  const offset = banner.offsetHeight + 'px';

  header.style.top = offset;
  if (progress) progress.style.top = offset;
}

window.addEventListener('load', adjustOffsets);
window.addEventListener('resize', adjustOffsets); // если баннер может менять высоту
