$("[data-open-block]").on("click", function () {
    const $this = $(this);
    const target = $this.data("open-block");

    // Кэшируем активные элементы
    const $activeBlock = $("[data-open-block].active");
    const $activeContent = $("[data-content].is-active");
    const $targetContent = $(`[data-content="${target}"]`);

    // Удаляем активные классы, только если активный элемент отличается
    if (!$this.is($activeBlock)) {
        $activeBlock.removeClass("active");
        $activeContent.removeClass("is-active");

        // Добавляем активные классы
        $this.addClass("active");
        $targetContent.addClass("is-active");
    }
});

// Находим элемент с классом kun
const сhess = document.querySelector('.сhess');

// Создаем пустую строку для хранения всех div
let htmlContent = '';

// Переменная для отслеживания текущего цвета
let currentColor = 'white';

// Генерируем 290 div-ов
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




jQuery(".qrc").qrcode({
    render: "table",
    text: "https://t.me/d1eruki"
});