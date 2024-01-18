<script setup>
	$('[data-open-block]').on('click', function() {
		$('[data-open-block]').children().removeClass('active');
		$('[data-content]').removeClass('is-active');
		$(this).children().addClass('active');
		$(`[data-content='${$(this).data('open-block')}'`).addClass('is-active');
	});

	jQuery('#qrc').qrcode({
		render	: 'table',
		text	: 'https://t.me/d1eruki'
	});

	$(document).ready(function(){
		$(".cardBox").hover(function(){
			document.body.css('background-color','grey');
		});
		$(".cardBox").mouseleave(function(){
			document.body.css('background-color','white');
		});
	});

	function cheat() {
		var cheatCode = document.getElementById('cheat').value;
		var audio = new Audio('./sounds/phonk.wav');
		audio.loop = true;
		if (cheatCode == 'phonk') {
			audio.play();
		}
		if (cheatCode == 'phonkstop') {
			audio.stop();
		}
		if (cheatCode == 'cheats') {
			header.createElement("h1");
		}
	}

	$(document).keypress(function(e){
		if (e.which == 13){
			$(".cheatEnter").click();
			$(".cheatEnter").reset();
		}
	});
</script>

<template>
	<div id='back-text'>
			dайруки
		</div>
		<header>
			<h1 data-open-block='about'>
				<div data-text='/about' class='active'>/about</div>
			</h1>
			<h1 data-open-block='stack'>
				<div data-text='/stack'>/stack</div>
			</h1>
			<h1 data-open-block='design'>
				<div data-text='/design'>/design</div>
			</h1>
			<h1 data-open-block='video'>
				<div data-text='/video'>/video</div>
			</h1>
			<h1 data-open-block='pic'>
				<div data-text='/pic'>/pic</div>
			</h1>
			<h1 data-open-block='dev'>
				<div data-text='/dev'>/dev</div>
			</h1>
		</header>
		<div id='main'>
			<fieldset id='left'>
				<legend><h1>Портфич⁠⁠</h1></legend>
				<div class='info'>
					<h3>
						<span>фотография</span>
					</h3>
						<div class='cardBox nocursor'>
							<div class='card'>
								<img src='./images/me.png' class='filterless'>
								<fieldset><legend>.похуй</legend></fieldset>
								<fieldset><legend>.гниль</legend></fieldset>
								<fieldset><legend>.серость</legend></fieldset>
								<fieldset><legend>.подлец</legend></fieldset>
							</div>
							<div class='shirt'>
								<!--<div id='qrc1' class='nocursor'></div>-->
								<img src='./images/dieruki.png' id='logo' class='shadowless'>
							</div>
						</div>
					<h3>
						<span>Имя</span>
					</h3>
					<p>
						артем
					</p>
					<h3>
						<span>Фамилия</span>
					</h3>
					<p>
						вредина
					</p>
					<h3>
						<span>Специализация</span>
					</h3>
					<p>
						аматор широкого профиля
					</p>
					<h3>
						<span>Компания</span>
					</h3>
					<p>
						варвин
					</p>
					<h3>
						<span>Микробио</span>
					</h3>
					<p>
						Прив, тут я выкладываю всякие придуманные и разработанные видео и дизайнерские штуки
					</p>
				</div>
			</fieldset>
			<fieldset class='content is-active' data-content='about'>
				<legend><h1>Нет цели, есть только путь⁠⁠</h1></legend>
				<p>Ну привет работодатель или кто ты там. Ты попал на страничку моего портфолио.</p>
				<marquee onmouseover='this.stop()' onmouseout='this.start()'>
					<h2>* * * important content * * * important content * * * important content * * * important content * * *</h2>
				</marquee>
			</fieldset>
			<fieldset class='content' data-content='stack'>
				<legend><h1>Чем я пользуюсь</h1></legend>
				<p>Я в своем познании настолько преисполнился, что я как будто бы уже сто триллионов миллиардов лет проживаю на триллионах и триллионах таких же планет, как эта Земля, мне этот мир абсолютно понятен, и я здесь ищу только одного - покоя, умиротворения и вот этой гармонии, от слияния с бесконечно вечным, от созерцания великого фрактального подобия и от вот этого замечательного всеединства существа, бесконечно вечного, куда ни посмотри, хоть вглубь - бесконечно малое, хоть ввысь - бесконечное большое, понимаешь? А ты мне опять со своим вот этим, иди суетись дальше, это твоё распределение, это твой путь и твой горизонт познания и ощущения твоей природы, он несоизмеримо мелок по сравнению с моим, понимаешь? Я как будто бы уже давно глубокий старец, бессмертный, ну или там уже почти бессмертный, который на этой планете от её самого зарождения, ещё когда только Солнце только-только сформировалось как звезда, и вот это газопылевое облако, вот, после взрыва, Солнца, когда оно вспыхнуло, как звезда, начало формировать вот эти коацерваты, планеты, понимаешь, я на этой Земле уже как будто почти пять миллиардов лет живу и знаю её вдоль и поперёк этот весь мир, а ты мне какие-то... мне не важно на твои тачки, на твои яхты, на твои квартиры, там, на твоё благо. Я был на этой планете бесконечным множеством, и круче Цезаря, и круче Гитлера, и круче всех великих, понимаешь, был, а где-то был конченым говном, ещё хуже, чем здесь. Я множество этих состояний чувствую. Где-то я был больше подобен растению, где-то я больше был подобен птице, там, червю, где-то был просто сгусток камня, это всё есть душа, понимаешь? Она имеет грани подобия совершенно многообразные, бесконечное множество. Но тебе этого не понять, поэтому ты езжай себе , мы в этом мире как бы живем разными ощущениями и разными стремлениями, соответственно, разное наше и место, разное и наше распределение. Тебе я желаю все самые крутые тачки чтоб были у тебя, и все самые лучше самки, если мало идей, обращайся ко мне, я тебе на каждую твою идею предложу сотню триллионов, как всё делать. Ну а я всё, я иду как глубокий старец,узревший вечное, прикоснувшийся к Божественному, сам стал богоподобен и устремлен в это бесконечное, и который в умиротворении, покое, гармонии, благодати, в этом сокровенном блаженстве пребывает, вовлеченный во всё и во вся, понимаешь, вот и всё, в этом наша разница. Так что я иду любоваться мирозданием, а ты идёшь преисполняться в ГРАНЯХ каких-то, вот и вся разница, понимаешь, ты не зришь это вечное бесконечное, оно тебе не нужно. Ну зато ты, так сказать, более активен, как вот этот дятел долбящий, или муравей, который очень активен в своей стезе, поэтому давай, наши пути здесь, конечно, имеют грани подобия, потому что всё едино, но я-то тебя прекрасно понимаю, а вот ты меня - вряд ли, потому что я как бы тебя в себе содержу, всю твою природу, она составляет одну маленькую там песчиночку, от того что есть во мне, вот и всё, поэтому давай, ступай, езжай, а я пошел наслаждаться прекрасным осенним закатом на берегу теплой южной реки. Всё, ступай, и я пойду.</p>
				<marquee behavior='scroll' scrollamount='10' onmouseover='this.stop()' onmouseout='this.start()'>
					<h2>* * * important content * * * important content * * * important content * * * important content * * *</h2>
				</marquee>
				<div id='stack-list'>
					<div id='item'>
						<div id='itemName'>
							<img src='./images/psd.svg' class='shadowless'>
							<h1>photoshop</h1>
							<p>mid</p>
							</div>
							<p>Увлекаюсь фотошопом со школьных лет, фотошопил друзей на аватарки вконтакте. Это баловство позволило в настоящее время крутить фотокарточками как захочется</p>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/ai.svg' class='shadowless'>
								<h1>illustrator</h1>
								<p>jun</p>
							</div>
							<p>С иллюстратором до сих пор сложные отношения, я пытаю его он пытает меня</p>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/pp.svg' class='shadowless'>
								<h1>premiere pro</h1>
								<p>mid</p>
							</div>
							<p>В студенческое время работал в сони вегасе, ленясь перекатываться на премьер, но приколы которые он умеет делать, особенно после вегаса, заставили восторгнуться</p>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/ae.svg' class='shadowless'>
								<h1>after effects</h1>
								<p>jun</p>
							</div>
							<p>Увлекание эффектиком появилось когда перекатился на премьер. В коллекции уже есть пара прикольных заставок (⌐■_■)</p>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/au.svg' class='shadowless'>
								<h1>audition</h1>
								<p>jun</p>
							</div>
							<p>этот продукт открываю крайне редко, только для рабочих целей, но навалить бассов, застрейчить диктора или почистить мусор могу</p>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/adobe.svg' class='shadowless'>
								<h1>adobe</h1>
								<p>middle</p>
							</div>
							▶ photoshop<br>
							▶ after effects<br>
							▶ premiere pro<br>
							▶ illustrator<br>
							▶ audition<br>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/figma.svg' class='shadowless'>
								<h1>figma</h1>
								<p>middle</p>
							</div>
							<p>В процессе полного изучения. Сейчас осваиваю компоненты и кнопку present</p>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/unity.svg' class='shadowless'>
								<h1>unity</h1>
								<p>jun</p>
							</div>
							<p>Ориентируюсь в интерфейсе, могу создать материал. Но в общем, есть опыт верстки игрового интерфейса на канвасах и uielements</p>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/css.svg' class='shadowless'>
								<h1>css</h1>
								<p>middle</p>
							</div>
							<p>Последний раз серьезно занимался созданием сайтов в учебные годы, наверстываю упущенной, обмазываясь флексами и гридами</p>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/html.svg' class='shadowless'>
								<h1>html</h1>
								<p>middle</p>
							</div>
							<p>Очень старый дядя, дай бог ему здоровья, шо тут можно еще сказати</p>
						</div>
						<div id='item'>
							<div id='itemName'>
								<img src='./images/sv.svg' class='shadowless'>
								<h1>Sony Vegas</h1>
								<p>middle</p>
							</div>
							<p>Делал на нем видосики в шараге</p>
						</div>
					</div>
			</fieldset>
			<fieldset class='content' data-content='design'>
					<legend><h1>Десигники</h1></legend>
					<p>Я, блять, в своем познании настолько преисполнился, что я как будто бы уже сто триллионов миллиардов лет, блять, проживаю на триллионах и триллионах таких же планет, понимаешь? Как эта Земля. Мне уже этот мир абсолютно понятен, и я здесь ищу только одного, блять: покоя, умиротворения и вот этой гармонии от слияния с бесконечно вечным.</p>
					<marquee behavior='scroll' scrollamount='10' onmouseover='this.stop()' onmouseout='this.start()'>
						<h2>* * * important content * * * important content * * * important content * * * important content * * *</h2>
					</marquee>
					<!--<div id='stack-list'>
						<iframe src='https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FPiDC9apwZ81lm4LBFT84dj%2FUntitled-(Copy)%3Fpage-id%3D165%253A24%26node-id%3D169%253A733%26viewport%3D-5%252C160%252C0.26%26scaling%3Dmin-zoom%26starting-point-node-id%3D165%253A25' allowfullscreen></iframe>
						<iframe style='border: 1px solid rgba(0, 0, 0, 0.1);' width='800' height='450' src='https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FIZW01pABQvbxNiZWueYGGs%2Fui-pause-2%3Fpage-id%3D169%253A627%26type%3Ddesign%26node-id%3D426-1777%26viewport%3D326%252C-145%252C0.07%26scaling%3Dscale-down%26starting-point-node-id%3D426%253A1777' allowfullscreen></iframe>
						<iframe src='https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FPiDC9apwZ81lm4LBFT84dj%2FUntitled-(Copy)%3Fpage-id%3D165%253A24%26node-id%3D169%253A733%26viewport%3D-5%252C160%252C0.26%26scaling%3Dmin-zoom%26starting-point-node-id%3D165%253A25' allowfullscreen></iframe>
						<iframe src='https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FPiDC9apwZ81lm4LBFT84dj%2FUntitled-(Copy)%3Fpage-id%3D165%253A24%26node-id%3D169%253A733%26viewport%3D-5%252C160%252C0.26%26scaling%3Dmin-zoom%26starting-point-node-id%3D165%253A25' allowfullscreen></iframe>
					</div>-->
			</fieldset>
			<fieldset class='content' data-content='video'>
					<legend><h1>видосвы</h1></legend>
					<p>От созерцания этого великого фрактального подобия и от вот этого вот замечательного всеединства существа бесконечно вечного – куда ни посмотри: хоть в глубь – бесконечно малое, хоть ввысь – бесконечно большое, понимаешь? А ты мне опять со своими там это. Иди суетись дальше, твое распределение – это твой путь и твой горизонт познания, ощущения и твоей природы. И он несоизмеримо мелок по сравнению с моим, понимаешь? Я как будто уже глубокий старец бессмертный или там уже почти бессмертный, который на этой планете от её самого зарождения, еще когда только солнце еще только-только сформировалось как звезда и вот это газопылевое облако… после взрыва Солнца, когда оно вспыхнуло, как звезда и начало формировать консерваты-планеты, понимаешь? Я на этой Земле уже как будто пять миллиардов лет, блять, живу и знаю её вдоль и поперек, этот весь мир. А ты мне там какие-то эти. Мне похуй на твои тачки, на твои, блять, нахуй, яхты, на твои квартиры там, на твое благо, понимаешь? Я был на этой планете или бесконечном множестве и круче Цезаря, и круче Гитлера, блять, и круче всех великих, понимаешь? А где-то был конченым говном, еще хуже, чем здесь. Потому что я множество этих состояний чувствую. Где-то я был больше подобен растению, где-то был больше подобен птице, там червю. Где-то просто был сгусток камня. Это все есть душа, понимаешь? Она вот имеет грани подобия совершенно многообразные, бесконечное множество. Но тебе этого не понять, поэтому ты езжай себе, блять. Мы в этом мире как бы живем разными ощущениями, разными стремлениями. Соответственно разное наше и место, разное наше распределение. Тебе я желаю, чтоб все самые крутые тачки были у тебя и все самые лучшие самки, чтобы раздвигали перед тобой ноги там, все свои щели шиворот-навыворот, блять, перед тобой, как ковер раскрывали и растлевали, растлали. И ты их чтоб ебал до посинения, до красна, как солнца закатного. Чтоб на лучших яхтах, на самолетах летал и кончал прямо с иллюминатора и все что только может в голову прийти или не прийти. Если мало идей – обращайся ко мне, я тебе на каждую твою идею еще сотни триллионов подскажу как, что делать. Ну а я, что? Я иду как глубокий старец, узревший вечное, прикоснувшийся к божественному, сам стал богоподобен и устремлен в это бесконечное. Который в умиротворении, покое, гармонии, благодати, в этом сокровенном блаженстве пребывает, вовлеченный во все и во вся, понимаешь? Вот и все. В этом наша разница, так сказать. Я иду любоваться мирозданием, а ты идешь какой-то преисполняться в гранях каких-то. Вот и вся разница, понимаешь? Ты не зришь это вечное бесконечное, оно тебе не нужно. Но зато ты, так сказать, более активен, как вот этот дятел долбящий или муравей, который вот очень активен в своей стезе, вот и все. Поэтому давай, наши пути здесь, так сказать, имеют, конечно, грани подобия, потому что все едино, но ты меня... Я-то тебя прекрасно понимаю, а вот ты – вряд ли, потому что как бы я, ты и как бы я тебя в себе содержу – всю твою природу. Она составляет одну маленькую там песчиночку от того, что есть во мне, понимаешь? Вот и все. Поэтому давай ступай, езжай, а я пошел наслаждаться, нахуй, блять, прекрасным осенним закатом, блять, на берегу теплой южной реки. Все, пиздуй-борозду и я попиздил нахуй.</p>
					<marquee behavior='scroll' scrollamount='10' onmouseover='this.stop()' onmouseout='this.start()'>
						<h2>* * * important content * * * important content * * * important content * * * important content * * *</h2>
					</marquee>
					<div id='stack-list'>
						<iframe width='560' height='315' src='https://www.youtube.com/embed/uLF0e0o2VN0' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>
						<iframe width='560' height='315' src='https://www.youtube.com/embed/MqbIweA8ISM' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>
						<iframe width='560' height='315' src='https://www.youtube.com/embed/ln-OxWhzVGE' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>
						<iframe width='560' height='315' src='https://www.youtube.com/embed/osFWI0nA_3M' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>
						<iframe width='560' height='315' src='https://www.youtube.com/embed/Wt1czyC4Wyk' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>
					</div>
			</fieldset>
			<fieldset class='content' data-content='pic'>
					<legend><h1>Пиктуресы</h1></legend>
					<p>От созерцания этого великого фрактального подобия и от вот этого вот замечательного всеединства существа бесконечно вечного – куда ни посмотри: хоть в глубь – бесконечно малое, хоть ввысь – бесконечно большое, понимаешь? А ты мне опять со своими там это. Иди суетись дальше, твое распределение – это твой путь и твой горизонт познания, ощущения и твоей природы. И он несоизмеримо мелок по сравнению с моим, понимаешь? Я как будто уже глубокий старец бессмертный или там уже почти бессмертный, который на этой планете от её самого зарождения, еще когда только солнце еще только-только сформировалось как звезда и вот это газопылевое облако… после взрыва Солнца, когда оно вспыхнуло, как звезда и начало формировать консерваты-планеты, понимаешь? Я на этой Земле уже как будто пять миллиардов лет, блять, живу и знаю её вдоль и поперек, этот весь мир. А ты мне там какие-то эти. Мне похуй на твои тачки, на твои, блять, нахуй, яхты, на твои квартиры там, на твое благо, понимаешь? Я был на этой планете или бесконечном множестве и круче Цезаря, и круче Гитлера, блять, и круче всех великих, понимаешь? А где-то был конченым говном, еще хуже, чем здесь. Потому что я множество этих состояний чувствую. Где-то я был больше подобен растению, где-то был больше подобен птице, там червю. Где-то просто был сгусток камня. Это все есть душа, понимаешь? Она вот имеет грани подобия совершенно многообразные, бесконечное множество. Но тебе этого не понять, поэтому ты езжай себе, блять. Мы в этом мире как бы живем разными ощущениями, разными стремлениями. Соответственно разное наше и место, разное наше распределение. Тебе я желаю, чтоб все самые крутые тачки были у тебя и все самые лучшие самки, чтобы раздвигали перед тобой ноги там, все свои щели шиворот-навыворот, блять, перед тобой, как ковер раскрывали и растлевали, растлали. И ты их чтоб ебал до посинения, до красна, как солнца закатного. Чтоб на лучших яхтах, на самолетах летал и кончал прямо с иллюминатора и все что только может в голову прийти или не прийти. Если мало идей – обращайся ко мне, я тебе на каждую твою идею еще сотни триллионов подскажу как, что делать. Ну а я, что? Я иду как глубокий старец, узревший вечное, прикоснувшийся к божественному, сам стал богоподобен и устремлен в это бесконечное. Который в умиротворении, покое, гармонии, благодати, в этом сокровенном блаженстве пребывает, вовлеченный во все и во вся, понимаешь? Вот и все. В этом наша разница, так сказать. Я иду любоваться мирозданием, а ты идешь какой-то преисполняться в гранях каких-то. Вот и вся разница, понимаешь? Ты не зришь это вечное бесконечное, оно тебе не нужно. Но зато ты, так сказать, более активен, как вот этот дятел долбящий или муравей, который вот очень активен в своей стезе, вот и все. Поэтому давай, наши пути здесь, так сказать, имеют, конечно, грани подобия, потому что все едино, но ты меня... Я-то тебя прекрасно понимаю, а вот ты – вряд ли, потому что как бы я, ты и как бы я тебя в себе содержу – всю твою природу. Она составляет одну маленькую там песчиночку от того, что есть во мне, понимаешь? Вот и все. Поэтому давай ступай, езжай, а я пошел наслаждаться, нахуй, блять, прекрасным осенним закатом, блять, на берегу теплой южной реки. Все, пиздуй-борозду и я попиздил нахуй.</p>
					<marquee behavior='scroll' scrollamount='10' onmouseover='this.stop()' onmouseout='this.start()'>
						<h2>* * * important content * * * important content * * * important content * * * important content * * *</h2>
					</marquee>
					<marquee behavior='scroll' scrollamount='20' onmouseover='this.stop()' onmouseout='this.start()'>
						<img src='./images/placeholder.svg'>
					</marquee>
			</fieldset>
			<fieldset class='content' data-content='dev'>
					<legend><h1>Разрабочески</h1></legend>
					<div for='toggle'>
						Mode
						<input type='checkbox' class='toggle' id ='toggle' checked>
					</div>
					<input type='color' value='#8888ff' id='colorPicker'/>
					<div id = 'cheatForm'>
						<p>Введите чит</p>
						<input type= 'text' id= 'cheat' placeholder='вводи'/>
						<button class='cheatEnter' onclick= 'cheat()'>ентер</button>
					</div>
					<div id='stack-list'>
						<div class='item-cardBox nocursor'>
							<div class='item-card'>
								photoshop
							</div>
							<div class='item-shirt'>
								<div id='item'>
									<div id='itemName'>
										<img src='./images/psd.svg' class='shadowless'>
										<h1>photoshop</h1>
										<p>mid</p>
									</div>
									<p>Увлекаюсь фотошопом со школьных лет, фотошопил друзей на аватарки вконтакте. Это баловство позволило в настоящее время крутить фотокарточками как захочется</p>
								</div>
							</div>
						</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/ai.svg' class='shadowless'>
									<h1>illustrator</h1>
									<p>jun</p>
								</div>
								<p>С иллюстратором до сих пор сложные отношения, я пытаю его он пытает меня</p>
							</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/pp.svg' class='shadowless'>
									<h1>premiere pro</h1>
									<p>mid</p>
								</div>
								<p>В студенческое время работал в сони вегасе, ленясь перекатываться на премьер, но приколы которые он умеет делать, особенно после вегаса, заставили восторгнуться</p>
							</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/ae.svg' class='shadowless'>
									<h1>after effects</h1>
									<p>jun</p>
								</div>
								<p>Увлекание эффектиком появилось когда перекатился на премьер. В коллекции уже есть пара прикольных заставок (⌐■_■)</p>
							</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/au.svg' class='shadowless'>
									<h1>audition</h1>
									<p>jun</p>
								</div>
								<p>этот продукт открываю крайне редко, только для рабочих целей, но навалить бассов, застрейчить диктора или почистить мусор могу</p>
							</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/adobe.svg' class='shadowless'>
									<h1>adobe</h1>
									<p>middle</p>
								</div>
								▶ photoshop<br>
								▶ after effects<br>
								▶ premiere pro<br>
								▶ illustrator<br>
								▶ audition<br>
							</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/figma.svg' class='shadowless'>
									<h1>figma</h1>
									<p>middle</p>
								</div>
								<p>В процессе полного изучения. Сейчас осваиваю компоненты и кнопку present</p>
							</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/unity.svg' class='shadowless'>
									<h1>unity</h1>
									<p>jun</p>
								</div>
								<p>Ориентируюсь в интерфейсе, могу создать материал. Но в общем, есть опыт верстки игрового интерфейса на канвасах и uielements</p>
							</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/css.svg' class='shadowless'>
									<h1>css</h1>
									<p>middle</p>
								</div>
								<p>Последний раз серьезно занимался созданием сайтов в учебные годы, наверстываю упущенной, обмазываясь флексами и гридами</p>
							</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/html.svg' class='shadowless'>
									<h1>html</h1>
									<p>middle</p>
								</div>
								<p>Очень старый дядя, дай бог ему здоровья, шо тут можно еще сказати</p>
							</div>
							<div id='item'>
								<div id='itemName'>
									<img src='./images/sv.svg' class='shadowless'>
									<h1>Sony Vegas</h1>
									<p>middle</p>
								</div>
								<p>Делал на нем видосики в шараге</p>
							</div>
						</div>
			</fieldset>
			<fieldset id='right'>
				<legend><h1>Нотис</h1></legend>
			</fieldset>
		</div>
		<div id='qrc' class='nocursor'>
			<h1>scamme!</h1>
		</div>
		<footer>
			<audio src='src/sounds/phonk.wav' controls preload loop autoplay></audio>
			ну я сделал да
		</footer>
</template>

<style scoped>

</style>