$("[data-open-block]").on("click", function() {
	$("[data-open-block]").children().removeClass("active");
	$("[data-content]").removeClass("is-active");
	$(this).children().addClass("active");
	$(`[data-content="${$(this).data("open-block")}"`).addClass("is-active");
});

jQuery(".qrc").qrcode({
	render	: "table",
	text	: "https://t.me/d1eruki"
});

$(document).ready(function(){
	$(".cardBox").hover(function(){
		document.body.css("background-color","grey");
	});
	$(".cardBox").mouseleave(function(){
		document.body.css("background-color","white");
	});
});

function cheat() {
	var cheatCode = document.getElementById("cheat").value;
	var audio = new Audio("src/sounds/phonk.wav");
	audio.loop = true;
	if (cheatCode == "phonk") {
		audio.play();
	}
	if (cheatCode == "phonkstop") {
		audio.stop();
	}
	if (cheatCode == "cheats") {
		header.createElement("h1");
	}
}

$(document).keypress(function(e){
	if (e.which == 13){
		$(".cheatEnter").click();
		$(".cheatEnter").reset();
	}
});