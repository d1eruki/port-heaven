window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 0;
  const screenHeight = window.innerHeight;

  const bodyChildren = Array.from(document.body.children).slice(1); // исключаем первый элемент

  bodyChildren.forEach(el => {
    if (el.id) {
      el.style.minHeight = (screenHeight - headerHeight) + 'px';
    }
  });
});
