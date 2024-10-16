$("[data-open-block]").on("click", function() {
	var $this = $(this);
	var target = $this.data("open-block");

	// Удаляем активные классы только один раз
	$("[data-open-block].active").removeClass("active");
	$("[data-content].is-active").removeClass("is-active");

	// Добавляем активные классы
	$this.addClass("active");
	$(`[data-content="${target}"]`).addClass("is-active");
});

function cheat() {
	var cheatCode = $("#cheat").val(); // Получаем значение input с id "cheat"
	var audio = new Audio("src/sounds/phonk.wav");
	audio.loop = true;

	if (cheatCode === "phonk") {
		audio.play();
	} else if (cheatCode === "phonkstop") {
		audio.pause();
		audio.currentTime = 0; // Устанавливаем время воспроизведения на 0, если нужно остановить
	} else if (cheatCode === "cheats") {
		$("header").append("<h1>Cheats Activated</h1>");
	}
}

jQuery(".qrc").qrcode({
	render	: "table",
	text	: "https://t.me/d1eruki"
});