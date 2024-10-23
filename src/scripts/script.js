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

function cheat() {
    const cheatCode = $("#cheat").val()?.toLowerCase(); // Получаем значение и приводим к нижнему регистру
    if (!cheatCode) return; // Если cheatCode пустой, выходим из функции

    const audio = new Audio("src/sounds/phonk.wav");
    audio.loop = true;

    switch (cheatCode) {
        case "phonk":
            audio.play();
            break;
        case "phonkstop":
            audio.pause();
            audio.currentTime = 0; // Сбрасываем время воспроизведения
            break;
        case "cheats":
            if (!$("header h1").length) { // Проверяем, не добавлен ли уже заголовок
                $("header").append("<h1>Cheats Activated</h1>");
            }
            break;
        default:
            console.log("Unknown cheat code");
            break;
    }
}

jQuery(".qrc").qrcode({
    render: "table",
    text: "https://t.me/d1eruki"
});