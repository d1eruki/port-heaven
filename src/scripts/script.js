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
};

// Функция для переключения контента
const toggleContent = (target) => {
    const $activeBlock = $("[data-open-block].active");
    const $activeContent = $("[data-content].is-active");
    const $targetContent = $(`[data-content="${target}"]`);

    if (!$activeBlock.is($(`[data-open-block][data-open-block="${target}"]`))) {
        $activeBlock.removeClass("active");
        $activeContent.removeClass("is-active");

        $(`[data-open-block][data-open-block="${target}"]`).addClass("active");
        $targetContent.addClass("is-active");

        setHeight(); // Обновляем высоты после изменения контента
    }
};

// Инициализация
document.addEventListener('DOMContentLoaded', setHeight);

// Обновляем высоту при изменении размера окна
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setHeight, 100);
});

// Обновляем высоту при переключении контента
$("[data-open-block]").on("click", function () {
    const target = $(this).data("open-block");
    toggleContent(target);
});

// Используем MutationObserver для отслеживания изменений в heightTarget
const observer = new MutationObserver(setHeight);
observer.observe(heightTarget, {
    childList: true,
    subtree: true
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

jQuery(".qrc").qrcode({
    render: "table",
    text: "https://t.me/d1eruki"
});