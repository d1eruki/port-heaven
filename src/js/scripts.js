import '../css/styles.scss'; // ваш Sass файл

// Получаем элементы
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const heightTarget = document.getElementById('height-target');
const progressBar = document.getElementById('progress-bar');

// Функция для установки высоты
const setHeight = () => {
    if (!header || !footer) return;

    const headerHeight = header.offsetHeight;
    footer.style.height = `${headerHeight}px`;

    const isScrollable = document.body.scrollHeight > window.innerHeight;

    heightTarget.style.height = isScrollable
        ? 'auto'
        : `calc(100vh - ${headerHeight}px - ${headerHeight}px)`;

    // Показываем контент после установки высоты
    document.body.classList.add('loaded'); // Добавляем класс для отображения контента
};

// Функция для переключения контента
const toggleContent = (target) => {
    const activeBlock = document.querySelector("[data-open-block].active");
    const activeContent = document.querySelector("[data-content].is-active");
    const targetContent = document.querySelector(`[data-content="${target}"]`);

    if (!activeBlock || activeBlock.getAttribute('data-open-block') !== target) {
        if (activeBlock) {
            activeBlock.classList.remove("active");
        }
        if (activeContent) {
            activeContent.classList.remove("is-active");
        }

        const newActiveBlock = document.querySelector(`[data-open-block][data-open-block="${target}"]`);
        newActiveBlock.classList.add("active");
        targetContent.classList.add("is-active");

        setHeight();       // Обновляем высоты после изменения контента
        window.scrollTo(0, 0); // Сбрасываем прокрутку наверх

        requestAnimationFrame(updateProgressBar);
    }
};

// Функция для обновления прогресс-бара
const updateProgressBar = () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = totalHeight > 0
        ? `${(window.scrollY / totalHeight) * 100}%` // Рассчитываем ширину прогресс-бара
        : '0%'; // Сбрасываем, если нет прокрутки
};

// Инициализация высоты и прогресс-бара при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setHeight();         // Устанавливаем высоту при первой загрузке
    updateProgressBar(); // Обновляем прогресс-бар при первой загрузке

    // Установка обработчика событий на кнопки переключения
    document.querySelectorAll("[data-open-block]").forEach(button => {
        button.addEventListener("click", function () {
            toggleContent(this.getAttribute("data-open-block")); // Вызов функции переключения контента
        });
    });
});

// Обновление прогресс-бара при прокрутке
window.onscroll = updateProgressBar;

/////////////////////////////////////////////////////

// Находим элемент с классом сhess
const сhess = document.querySelector('.сhess');

// Создаем пустую строку для хранения всех div
let htmlContent = '';

// Переменная для отслеживания текущего цвета
let currentColor = 'white';

// Генерируем 324 div-ов
for (let i = 0; i < 324; i++) {
    // Каждые 18 строк нужно повторить предыдущий цвет
    if (i > 0 && i % 18 === 0) {
        // Повторяем предыдущий цвет
        htmlContent += `<div class="${currentColor}"></div>`;
    } else {
        // Чередуем цвета white и black
        if (currentColor === 'white') {
            currentColor = 'black';
        } else {
            currentColor = 'white';
        }
        htmlContent += `<div class="${currentColor}"></div>`;
    }
}

// Вставляем все div-ы за один раз
сhess.innerHTML = htmlContent;

/////////////////////////////////////////////////////

window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 25) { // Если прокрутка больше 50px
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

/////////////////////////////////////////////////////

// document.querySelectorAll(".item-iframe").forEach(container => {
//     const originalContent = container.innerHTML; // Сохраняем оригинальное содержимое контейнера
//
//     container.addEventListener("mouseenter", function () {
//         // Проверяем, есть ли уже iframe, чтобы избежать повторного создания
//         if (!this.querySelector("iframe")) {
//             const iframeSrc = this.getAttribute("data-src");
//             const iframe = document.createElement("iframe");
//             iframe.src = iframeSrc;
//             iframe.style.width = "100%";
//             iframe.style.height = "100%";
//             iframe.style.border = "none";
//             iframe.allowFullscreen = true; // Добавляем атрибут allowfullscreen
//             iframe.loading = "lazy"; // Добавляем атрибут loading="lazy"
//             this.innerHTML = ""; // Очищаем контейнер
//             this.appendChild(iframe); // Добавляем iframe
//         }
//     });
//
//     container.addEventListener("mouseleave", function () {
//         this.innerHTML = originalContent; // Восстанавливаем оригинальное содержимое при уходе курсора
//     });
// });

/////////////////////////////////////////////////////