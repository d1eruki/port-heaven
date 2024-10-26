// Получаем элементы
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const heightTarget = document.getElementById('height-target');

// Функция для установки высоты
const setHeight = () => {
    if (!header || !footer) return;

    const headerHeight = header.offsetHeight;
    footer.style.height = `${headerHeight}px`;

    const isScrollable = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) > window.innerHeight;

    console.log('Header Height:', headerHeight);
    console.log('Is Scrollable:', isScrollable);

    heightTarget.style.height = isScrollable
        ? 'auto'
        : `calc(100vh - ${headerHeight}px - ${headerHeight}px)`;

    // Показываем контент после установки высоты
    document.body.classList.add('loaded'); // Добавляем класс для отображения контента
};

// Функция для переключения контента
const toggleContent = (target) => {
    const $activeBlock = $("[data-open-block].active");
    const $activeContent = $("[data-content].is-active");
    const $targetContent = $(`[data-content="${target}"]`);

    // Проверяем, что целевой контент отличается от активного
    if (!$activeBlock.is($(`[data-open-block][data-open-block="${target}"]`))) {
        $activeBlock.removeClass("active");
        $activeContent.removeClass("is-active");

        // Добавляем активные классы
        $(`[data-open-block][data-open-block="${target}"]`).addClass("active");
        $targetContent.addClass("is-active");

        setHeight(); // Обновляем высоты после изменения контента
    }
};

// Инициализация высоты при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setHeight(); // Устанавливаем высоту при первой загрузке

    // Установка обработчика событий на кнопки переключения
    $("[data-open-block]").on("click", function () {
        const target = $(this).data("open-block");
        toggleContent(target); // Вызов функции переключения контента
    });
});

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

window.onscroll = function() {
    const progressBar = document.getElementById('progress-bar');
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100; // Процент прокрутки
    progressBar.style.width = progress + '%'; // Установка ширины прогресс-бара
};

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

jQuery(".qrc").qrcode({
    render: "table",
    text: "https://t.me/d1eruki"
});