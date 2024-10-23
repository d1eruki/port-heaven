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

jQuery(".qrc").qrcode({
    render: "table",
    text: "https://t.me/d1eruki"
});