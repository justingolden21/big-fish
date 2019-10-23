let firstUnpause = true;

// onload, button listeners
$(function() {
	// set up game
	window.setInterval(tick, 1000); //tick every s. note: maybe try 250?
	window.setInterval(setCookies, 5000); //save cookies every 5s; doesn't save unless user allowed it
	window.setInterval(setScores, 5000);
	window.addEventListener('resize', handleResize);
	handleResize();

	for(let i=0; i<60; i++) { // num is arbitrary, just has to be larger than screen
		if(Math.random() >= 0.6)
			$('#sea-items').append('<img src="img/sea-item-' + random(1,9) + '.png" class="sea-item">');
		else
			$('#sea-items').append('<img src="img/blank.png" class="sea-item">');
	}

	$('.modal').on('shown.bs.modal', (evt)=> {
		$(evt.target).find('.close').focus();
	});

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	setupSprites();

	updateCanvas();
	$(window).resize(updateCanvas);

	// shell graph
	shell_graph_canvas = document.getElementById('shell-graph-canvas');
	shell_graph_ctx = shell_graph_canvas.getContext('2d');
	shell_graph_ctx.strokeStyle = '#099';
	shell_graph_ctx.lineWidth = 5;
	shell_rate_graph_canvas = document.getElementById('shell-rate-graph-canvas');
	shell_rate_graph_ctx = shell_rate_graph_canvas.getContext('2d');
	shell_rate_graph_ctx.strokeStyle = '#099';
	shell_rate_graph_ctx.lineWidth = 5;

	setupShellGraph();
	setupCheckboxes();

	// start user on welcome/help modal
	$('#help-modal').modal('show');

	// set up player	
	addFish(SMALL, 1); //starting fish

	// pause on game start, close help modal to resume (first time only)
	togglePause(false);
	$('#help-modal').on('hidden.bs.modal', function () {
		if(firstUnpause) { // works once
			firstUnpause = false;
			togglePause(false);
				window.setTimeout( ()=> { if(num_food==0) showSnackbar('Hint: Purchase 10 Food', 'info')}, 2000);
		}
	});

	$('.btn').hover(playHoverSound);
	$('button.close').hover(playHoverSound);
	$('.nav-item').hover(playHoverSound);
	$('summary').hover(playHoverSound);
	$('input[type=range]').hover(playHoverSound);
	$('input[type=select]').hover(playHoverSound);
	$('a').hover(playHoverSound);

	// display game vals
	//todo: add more const values from aquarium, sell value, etc
	$('#num-small-fish-shell').html(FISH_SHELL[SMALL]);
	$('#num-small-fish-food').html(1);
	$('#num-small-fish-space').html(FISH_SPACE[SMALL]);
	$('#num-medium-fish-shell').html(FISH_SHELL[MEDIUM]);
	$('#num-medium-fish-food').html(1);
	$('#num-medium-fish-space').html(FISH_SPACE[MEDIUM]);
	$('#num-big-fish-shell').html(FISH_SHELL[BIG]);
	$('#num-big-fish-food').html(1);
	$('#num-big-fish-space').html(FISH_SPACE[BIG]);
	$('#num-aquarium-space').html(AQUARIUM_SPACE);
	$('.sell-return-value').html(SELL_RETURN_VALUE);

	$('#num-drawn-fish').html(NUM_DRAWN_FISH);

	$('#num-food-per-cost').html(FOOD_UNIT);
	$('#num-small-fish-cost').html(getNum(SMALL_FISH_COST) );
	$('#num-medium-fish-cost').html(getNum(MEDIUM_FISH_COST) );
	$('#num-big-fish-cost').html(getNum(BIG_FISH_COST) );
	$('#num-aquarium-cost').html(getNum(AQUARIUM_COST) );

	$('#num-farm-food').html(FARM_FOOD_RATE);
	
	$('#num-farm-cost').html(getNum(FARM_COST) );
	$('#num-small-hatchery-cost').html(getNum(SMALL_HATCHERY_COST) );
	$('#num-medium-hatchery-cost').html(getNum(MEDIUM_HATCHERY_COST) );
	$('#num-big-hatchery-cost').html(getNum(BIG_HATCHERY_COST) );
	$('#num-aquarium-factory-cost').html(getNum(AQUARIUM_FACTORY_COST) );
	$('#num-bank-cost').html(getNum(BANK_COST) );

	$('#num-pufferfish-star').html(PUFFERFISH_STAR); // 1
	$('#num-pufferfish-food').html(PUFFERFISH_FOOD); // 100
	$('#num-pufferfish-space').html(getNum(FISH_SPACE[PUFF]) ); // 10000
	
	$('#num-pufferfish-hatchery-pufferfishes').html(PUFFERFISH_HATCHERY_RATE); // 1
	$('.num-base-pufferfish-cost').html(BASE_PUFFERFISH_COST); // 1
	$('.num-base-pufferfish-hatchery-cost').html(BASE_PUFFERFISH_HATCHERY_COST); // 100
	$('.num-base-star-bank-cost').html(getNum(BASE_STAR_BANK_COST) ); // 10000
	$('#shell-star-exchange-rate').html(getNum(SHELL_STAR_EXCHANGE_RATE) ); // 100000

	// tick();

	// button listeners

	// purchase fish stuff
	$('.btn.purchase-food').click( function() {
		let amount = parseInt($(this).val() );
		if(num_shell < FOOD_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else {
			stats['food_purchased'] += FOOD_UNIT*amount;
			num_shell -= FOOD_COST*amount;
			num_food += FOOD_UNIT*amount;
			showHighlight($('#num-food') );
			updateUI();
		}
	});
	$('.btn.purchase-small-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < SMALL_FISH_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else if(num_aquarium*AQUARIUM_SPACE < getAquariumSpaceUsed() + (FISH_SPACE[SMALL] * amount) ) {
			showSnackbar('Not enough space in aquarium', 'error');
		} else {
			stats['small_fish_purchased'] += amount;
			num_shell -= SMALL_FISH_COST*amount;
			addFish(SMALL, amount);
			updateUI();
			showHighlight($('#num-small-fish') );
		}
	});
	$('.btn.purchase-medium-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < MEDIUM_FISH_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else if(num_aquarium*AQUARIUM_SPACE < getAquariumSpaceUsed() + (FISH_SPACE[MEDIUM] * amount) ) {
			showSnackbar('Not enough space in aquarium', 'error');
		} else {
			stats['medium_fish_purchased'] += amount;
			num_shell -= MEDIUM_FISH_COST*amount;
			addFish(MEDIUM, amount);
			showHighlight($('#num-medium-fish') );
			updateUI();
		}
	});
	$('.btn.purchase-big-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < BIG_FISH_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else if(num_aquarium*AQUARIUM_SPACE < getAquariumSpaceUsed() + (FISH_SPACE[MEDIUM] * amount) ) {
			showSnackbar('Not enough space in aquarium', 'error');
		} else {
			stats['big_fish_purchased'] += amount;
			num_shell -= BIG_FISH_COST*amount;
			addFish(BIG, amount);
			showHighlight($('#num-big-fish') );
			updateUI();
		}
	});
	$('.btn.purchase-pufferfish').click(function() {
		let amount = parseInt($(this).val() );
		let amount_pufferfishes_cost = sumNumsBetween(fish[PUFF]+1, fish[PUFF]+amount+1) * BASE_PUFFERFISH_COST;
		if(num_star < amount_pufferfishes_cost) {
			showSnackbar('Not enough stars', 'error');
		} else if(num_aquarium*AQUARIUM_SPACE < getAquariumSpaceUsed() + (FISH_SPACE[PUFF] * amount) ) {
			showSnackbar('Not enough space in aquarium', 'error');
		} else {
			stats['pufferfish_purchased'] += amount;
			num_star -= amount_pufferfishes_cost;
			addPufferfishes(amount);
			showHighlight($('#num-pufferfish') );
			updateUI();
		}
	});
	$('.btn.purchase-aquarium').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < AQUARIUM_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else {
			stats['aquarium_purchased'] += amount;
			num_shell -= AQUARIUM_COST*amount;
			num_aquarium += amount;
			showHighlight($('#num-aquarium') );
			updateUI();
		}
	});

	// purchase producers
	$('.btn.purchase-farm').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < FARM_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else {
			num_shell -= FARM_COST*amount;
			num_farm += amount;
			showHighlight($('#num-farm') );
			updateUI();
		}
	});
	$('.btn.purchase-small-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < SMALL_HATCHERY_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else {
			num_shell -= SMALL_HATCHERY_COST*amount;
			num_small_hatchery += amount;
			showHighlight($('#num-small-hatchery') );
			updateUI();
		}
	});
	$('.btn.purchase-medium-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < MEDIUM_HATCHERY_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else {
			num_shell -= MEDIUM_HATCHERY_COST*amount;
			num_medium_hatchery += amount;
			showHighlight($('#num-medium-hatchery') );
			updateUI();
		}
	});
	$('.btn.purchase-big-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < BIG_HATCHERY_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else {
			num_shell -= BIG_HATCHERY_COST*amount;
			num_big_hatchery += amount;
			showHighlight($('#num-big-hatchery') );
			updateUI();
		}
	});
	$('.btn.purchase-pufferfish-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		// note: BASE_PUFFERFISH_HATCHERY_COST is 100
		let amount_pufferfish_hatcheries_cost = sumNumsBetween(num_pufferfish_hatchery+1, num_pufferfish_hatchery+amount+1) * BASE_PUFFERFISH_HATCHERY_COST;
		if(num_star < amount_pufferfish_hatcheries_cost) {
			showSnackbar('Not enough stars', 'error');
		} else {
			num_star -= amount_pufferfish_hatcheries_cost;
			num_pufferfish_hatchery += amount;
			showHighlight($('#num-pufferfish-hatchery') );
			updateUI();
		}
	});
	$('.btn.purchase-aquarium-factory').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < AQUARIUM_FACTORY_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else {
			num_shell -= AQUARIUM_FACTORY_COST*amount;
			num_aquarium_factory += amount;
			showHighlight($('#num-aquarium-factory') );
			updateUI();
		}
	});
	$('.btn.purchase-bank').click(function() {
		let amount = parseInt($(this).val() );
		if(num_shell < BANK_COST*amount) {
			showSnackbar('Not enough shells', 'error');
		} else {
			num_shell -= BANK_COST*amount;
			num_bank += amount;
			showHighlight($('#num-bank') );
			updateUI();
		}
	});
	$('.btn.purchase-star-bank').click(function() {
		let amount = parseInt($(this).val() );
		// note: BASE_STAR_BANK_COST is 10000
		let amount_star_banks_cost = sumNumsBetween(num_star_bank+1, num_star_bank+amount+1) * BASE_STAR_BANK_COST;
		if(num_star < amount_star_banks_cost) {
			showSnackbar('Not enough stars', 'error');
		} else {
			num_star -= amount_star_banks_cost;
			num_star_bank += amount;
			showHighlight($('#num-star-bank') );
			updateUI();
		}
	});

	// sell fish stuff
	$('.btn.sell-small-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(fish[SMALL] < amount) {
			showSnackbar('Not enough small fish', 'error');
		} else {
			num_shell += Math.round(SMALL_FISH_COST*amount*SELL_RETURN_VALUE);
			removeFish(SMALL, amount, 'sell');

			showHighlight($('#num-small-fish') );
			showHighlight($('#num-shell') );
			updateUI();
		}
	});
	$('.btn.sell-medium-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(fish[MEDIUM].length < amount) {
			showSnackbar('Not enough medium fish', 'error');
		} else {
			num_shell += Math.round(MEDIUM_FISH_COST*amount*SELL_RETURN_VALUE);
			removeFish(MEDIUM, amount, 'sell');

			showHighlight($('#num-medium-fish') );
			showHighlight($('#num-shell') );
			updateUI();
		}
	});
	$('.btn.sell-big-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(fish[BIG] < amount) {
			showSnackbar('Not enough big fish', 'error');
		} else {
			num_shell += Math.round(BIG_FISH_COST*amount*SELL_RETURN_VALUE);
			removeFish(BIG, amount, 'sell');

			showHighlight($('#num-big-fish') );
			showHighlight($('#num-shell') );
			updateUI();
		}
	});
	$('.btn.sell-pufferfish').click(function() {
		let amount = parseInt($(this).val() );
		if(fish[PUFF] < amount) {
			showSnackbar('Not enough pufferfishes', 'error');
		} else {
			num_star += amount; // 1 star per pufferfish returned
			removeFish(PUFF, amount, 'sell');

			showHighlight($('#num-pufferfish') );
			showHighlight($('#num-star') );
			updateUI();
		}
	});
	$('.btn.sell-aquarium').click(function() {
		let amount = parseInt($(this).val() );
		if(num_aquarium < amount+1) { // must have 1 aquarium
			if(num_aquarium==amount)
				showSnackbar('Can\'t sell your last aquarium', 'error');
			else
				showSnackbar('Not enough aquariums', 'error');
		} else {
			num_shell += Math.round(AQUARIUM_COST*amount*SELL_RETURN_VALUE);
			num_aquarium -= amount;
			showHighlight($('#num-aquarium') );
			showHighlight($('#num-shell') );
			updateUI();
		}
	});

	// sell producers
	$('.btn.sell-farm').click(function() {
		let amount = parseInt($(this).val() );
		if(num_farm < amount) {
			showSnackbar('Not enough farms', 'error');
		} else {
			num_shell += Math.round(FARM_COST*amount*SELL_RETURN_VALUE);
			num_farm -= amount;
			showHighlight($('#num-farm') );
			showHighlight($('#num-shell') );
			updateUI();
		}
	});
	$('.btn.sell-small-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_small_hatchery < amount) {
			showSnackbar('Not enough small hatcheries', 'error');
		} else {
			num_shell += Math.round(SMALL_HATCHERY_COST*amount*SELL_RETURN_VALUE);
			num_small_hatchery -= amount;
			showHighlight($('#num-small-hatchery') );
			showHighlight($('#num-shell') );
			updateUI();
		}
	});
	$('.btn.sell-medium-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_medium_hatchery < amount) {
			showSnackbar('Not enough medium hatcheries', 'error');
		} else {
			num_shell += Math.round(MEDIUM_HATCHERY_COST*amount*SELL_RETURN_VALUE);
			num_medium_hatchery -= amount;
			showHighlight($('#num-medium-hatchery') );
			showHighlight($('#num-shell') );
			updateUI();
		}
	});
	$('.btn.sell-big-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_big_hatchery < amount) {
			showSnackbar('Not enough big hatcheries', 'error');
		} else {
			num_shell += Math.round(BIG_HATCHERY_COST*amount*SELL_RETURN_VALUE);
			num_big_hatchery -= amount;
			showHighlight($('#num-big-hatchery') );
			showHighlight($('#num-shell') );
			updateUI();
		}
	});
	$('.btn.sell-pufferfish-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_pufferfish_hatchery < amount) {
			showSnackbar('Not enough pufferfish hatcheries', 'error');
		} else {
			// note: BASE_PUFFERFISH_HATCHERY_COST is 100, stars returned per pufferfish hatchery
			num_star += amount * BASE_PUFFERFISH_HATCHERY_COST;
			num_pufferfish_hatchery -= amount;
			showHighlight($('#num-pufferfish-hatchery') );
			showHighlight($('#num-star') );
			updateUI();
		}
	});
	$('.btn.sell-star-bank').click(function() {
		let amount = parseInt($(this).val() );
		if(num_star_bank < amount) { 
			showSnackbar('Not enough star banks', 'error');
		} else {
			// note: BASE_STAR_BANK_COST is 10000, stars returned per star bank
			num_star += amount * BASE_STAR_BANK_COST;
			num_star_bank -= amount;
			showHighlight($('#num-star-bank') );
			showHighlight($('#num-star') );
			updateUI();
		}
	});
	$('.btn.sell-aquarium-factory').click(function() {
		let amount = parseInt($(this).val() );
		if(num_aquarium_factory < amount) {
			showSnackbar('Not enough aquarium factories', 'error');
		} else {
			num_shell += Math.round(AQUARIUM_FACTORY_COST*amount*SELL_RETURN_VALUE);
			num_aquarium_factory -= amount;
			showHighlight($('#num-aquarium-factory') );
			showHighlight($('#num-shell') );
			updateUI();
		}
	});

	$('#sell-all-food-farm-btn').click(function() {	
		num_shell += Math.round(FARM_COST*num_farm*SELL_RETURN_VALUE);
		num_farm = 0;
		showHighlight($('#num-farm') );
		showHighlight($('#num-shell') );
		updateUI();
	});
	$('#sell-all-small-hatchery-btn').click(function() {	
		num_shell += Math.round(SMALL_HATCHERY_COST*num_small_hatchery*SELL_RETURN_VALUE);
		num_small_hatchery = 0;
		showHighlight($('#num-small-hatchery') );
		showHighlight($('#num-shell') );
		updateUI();
	});
	$('#sell-all-medium-hatchery-btn').click(function() {	
		num_shell += Math.round(MEDIUM_HATCHERY_COST*num_medium_hatchery*SELL_RETURN_VALUE);
		num_medium_hatchery = 0;
		showHighlight($('#num-medium-hatchery') );
		showHighlight($('#num-shell') );
		updateUI();
	});
	$('#sell-all-big-hatchery-btn').click(function() {	
		num_shell += Math.round(BIG_HATCHERY_COST*num_big_hatchery*SELL_RETURN_VALUE);
		num_big_hatchery = 0;
		showHighlight($('#num-big-hatchery') );
		showHighlight($('#num-shell') );
		updateUI();
	});
	$('#sell-all-aquarium-factory-btn').click(function() {	
		num_shell += Math.round(AQUARIUM_FACTORY_COST*num_aquarium_factory*SELL_RETURN_VALUE);
		num_aquarium_factory = 0;
		showHighlight($('#num-aquarium-factory') );
		showHighlight($('#num-shell') );
		updateUI();
	});

	$('#pause-btn').click(togglePause);

	$('#copy-link').click(function() {
		let tmp = $('<input type="text">').appendTo(document.body);
		tmp.val(window.location.href);
		tmp.select();
		document.execCommand('copy');
		tmp.remove();

		showSnackbar('Copied link to clipboard', 'info');
	});

	// cookies
	$('.accept-cookies-btn').click(function(evt) {
		savingCookies = true;
		$('#storing-cookies-para').html('Storing this game\'s cookies.');

		if(evt.target.id == 'alert-cookie-btn')
			showSnackbar('Will save cookies this session. <br> Loaded any cookies from previous games.', 'info');
		else
			showSnackbar('Will save cookies this session.', 'info');

		$('#cookie-alert').alert('close');
	});
	$('.load-cookies-btn').click(function() {
		loadCookies();
		showSnackbar('Loaded any cookies from previous games.', 'info');
	});
	$('.delete-cookies-btn').click(function() {
		clearCookies();
		savingCookies = false;
		$('#storing-cookies-para').html('Not storing this game\'s cookies.');

		showSnackbar('Cleared all cookies. Click "Accept Cookies" to accept them.<br>Will not save any cookies this session.', 'info');
	});

	$('#alert-cookie-btn').click(function() {
		// save in future
		savingCookies = true;
		$('#storing-cookies-para').html('Storing this game\'s cookies.');
		$('#cookie-alert').alert('close');

		// load
		loadCookies();
	});

	// text file export/import
	$('#download-data-btn').click(downloadData);

	$('#upload-data-btn').click($('#upload-data-input').click);

	$("#upload-data-input").change(function() {
		if(!window.FileReader) {
			showSnackbar('browser not supported', 'error');
			return;
		}
		let input = $('#upload-data-input').get(0);
		let reader = new FileReader();
		if(input.files.length) { // file exists
			let textFile = input.files[0];
			reader.readAsText(textFile);
			$(reader).on('load', processFile);
		}
	});

	// scale icon to small, medium, or large fish on click
	$('#top-logo').hover(function() {
		let fish_type = 'small medium big'.split(' ')[random(0,3)];
		$(this).prop('src', 'img/' + fish_type + '-fish.png');
	});

	$('#audio-select').change(function() {
		changeAudioSetting($(this).val() );
	}).change(); // in case firefox saved previous input

	$('#volume-range').change(function() {
		setVolume($(this).val() );
	}).change(); // in case firefox saved previous input

	$('#background-music-select').change(function() {
		changeBackgroundMusic($(this).val() );
	});

	$('#shell-graph-select').change(function() {
		if($(this).val() == 'top') {
			$('#graph-div').appendTo($('#top-graph-div') );
			$('#graph-div').css('display', '');
		}
		else if($(this).val() == 'stat') {
			$('#graph-div').appendTo($('#stat-graph-div') );
			$('#graph-div').css('display', '');
		}
		else { // 'none'
			$('#graph-div').css('display', 'none');
		}
	});

	$('#aquarium-checkbox').change(function() {
		$('#canvas').css('display', $(this).is(':checked') ? '' : 'none');
		$('#pufferfish-canvas').css('display', $(this).is(':checked') ? '' : 'none');
		draw_aquarium = !draw_aquarium;
	});

	// $('#gradient-checkbox').change(function() {
	// 	$('#gradient-link').attr('href', $(this).is(':checked') ? 'css/gradient.css' : '');
	// });

	$('#top-fish-checkbox').change(function() {
		$('#top-fish-div').css('display', $(this).is(':checked') ? '' : 'none');
	});
	$('#top-fish-div').css('display', 'none');

	$('#number-prefix-checkbox').change(function() {
		prefixes_enabled = !prefixes_enabled;
		// updateUI();
	});

	$('#clear-notifications-btn').click(function() {
		$('#history-log').html('');
	});

	$('#open-summaries-btn').click(function() {
		$('details').prop('open','true');
	});
	$('#close-summaries-btn').click(function() {
		$('details').prop('open','');
	});

	$('#delete-all-btn').click(function() {
		$('#confirm-data').html('delete-all-data');
		$('#confirm-modal').modal('show');
	});

	$('#confirm-btn').click(function() {
		$('#confirm-modal').modal('hide');
		if($('#confirm-data').html()=='delete-all-data') {
			deleteAllData();
		}
	});

});

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	if(key==27) { //esc
		togglePause();
	}
}
