const langBtn = document.getElementById('lang-btn');
const greeting = document.getElementById('greeting');

let currentLang = 'ru';

langBtn.addEventListener('click', () => {
  if (currentLang === 'ru') {
    greeting.textContent = 'Hello!';
    langBtn.textContent = 'Русский';
    currentLang = 'en';
  } else {
    greeting.textContent = 'Привет!';
    langBtn.textContent = 'English';
    currentLang = 'ru';
  }
});
