let firstUnpause = true;

// onload, button listeners
$(function() {
	// set up game
	window.setInterval(tick, 1000); //tick every s
	window.setInterval(setCookies, 5000); //save cookies every 5s; doesn't save unless user allowed it
	window.addEventListener('resize', handleResize);
	handleResize();

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	penguin_canvas = document.getElementById('penguin-canvas');
	penguin_ctx = penguin_canvas.getContext('2d');

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
	$('#num-small-fish-coin').html(FISH_COIN[SMALL]);
	$('#num-small-fish-food').html(1);
	$('#num-small-fish-space').html(FISH_SPACE[SMALL]);
	$('#num-medium-fish-coin').html(FISH_COIN[MEDIUM]);
	$('#num-medium-fish-food').html(1);
	$('#num-medium-fish-space').html(FISH_SPACE[MEDIUM]);
	$('#num-big-fish-coin').html(FISH_COIN[BIG]);
	$('#num-big-fish-food').html(1);
	$('#num-big-fish-space').html(FISH_SPACE[BIG]);
	$('#num-aquarium-space').html(AQUARIUM_SPACE);
	$('.sell-return-value').html(SELL_RETURN_VALUE);

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

	$('#num-penguin-snowflake').html(PENGUIN_SNOWFLAKE); // 1
	$('#num-penguin-food').html(PENGUIN_FOOD); // 100
	$('#num-penguin-space').html(getNum(PENGUIN_SPACE) ); // 10000
	
	$('#num-penguin-hatchery-penguins').html(PENGUIN_HATCHERY_RATE); // 1
	$('.num-base-penguin-cost').html(BASE_PENGUIN_COST); // 1
	$('.num-base-penguin-hatchery-cost').html(BASE_PENGUIN_HATCHERY_COST); // 100
	$('.num-base-snow-bank-cost').html(getNum(BASE_SNOW_BANK_COST) ); // 10000
	$('#coin-snowflake-exchange-rate').html(getNum(COIN_SNOW_EXCHANGE_RATE) ); // 100000

	// tick();

	setupCheckboxes();

	// button listeners

	// purchase fish stuff
	$('.btn.purchase-food').click( function() {
		let amount = parseInt($(this).val() );
		if(num_coin < FOOD_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else {
			stats['food_purchased'] += FOOD_UNIT*amount;
			num_coin -= FOOD_COST*amount;
			num_food += FOOD_UNIT*amount;
			showHighlight($('#num-food') );
			updateUI();
		}
	});
	$('.btn.purchase-small-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < SMALL_FISH_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (FISH_SPACE[SMALL] * amount) ) {
			showSnackbar('Not enough space in aquarium', 'error');
		} else {
			stats['small_fish_purchased'] += amount;
			num_coin -= SMALL_FISH_COST*amount;
			addFish(SMALL, amount);
			updateUI();
			showHighlight($('#num-small-fish') );
		}
	});
	$('.btn.purchase-medium-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < MEDIUM_FISH_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (FISH_SPACE[MEDIUM] * amount) ) {
			showSnackbar('Not enough space in aquarium', 'error');
		} else {
			stats['medium_fish_purchased'] += amount;
			num_coin -= MEDIUM_FISH_COST*amount;
			addFish(MEDIUM, amount);
			showHighlight($('#num-medium-fish') );
			updateUI();
		}
	});
	$('.btn.purchase-big-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < BIG_FISH_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (FISH_SPACE[MEDIUM] * amount) ) {
			showSnackbar('Not enough space in aquarium', 'error');
		} else {
			stats['big_fish_purchased'] += amount;
			num_coin -= BIG_FISH_COST*amount;
			addFish(BIG, amount);
			showHighlight($('#num-big-fish') );
			updateUI();
		}
	});
	$('.btn.purchase-penguin').click(function() {
		let amount = parseInt($(this).val() );
		let amount_penguins_cost = sumNumsBetween(penguins.length+1, penguins.length+amount+1) * BASE_PENGUIN_COST;
		if(num_snowflake < amount_penguins_cost) {
			showSnackbar('Not enough snowflakes', 'error');
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (PENGUIN_SPACE * amount) ) {
			showSnackbar('Not enough space in aquarium', 'error');
		} else {
			stats['penguin_purchased'] += amount;
			num_snowflake -= amount_penguins_cost;
			addPenguins(amount);
			showHighlight($('#num-penguin') );
			updateUI();
		}
	});
	$('.btn.purchase-aquarium').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < AQUARIUM_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else {
			stats['aquarium_purchased'] += amount;
			num_coin -= AQUARIUM_COST*amount;
			num_aquarium += amount;
			showHighlight($('#num-aquarium') );
			updateUI();
		}
	});

	// purchase producers
	$('.btn.purchase-farm').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < FARM_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else {
			num_coin -= FARM_COST*amount;
			num_farm += amount;
			showHighlight($('#num-farm') );
			updateUI();
		}
	});
	$('.btn.purchase-small-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < SMALL_HATCHERY_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else {
			num_coin -= SMALL_HATCHERY_COST*amount;
			num_small_hatchery += amount;
			showHighlight($('#num-small-hatchery') );
			updateUI();
		}
	});
	$('.btn.purchase-medium-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < MEDIUM_HATCHERY_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else {
			num_coin -= MEDIUM_HATCHERY_COST*amount;
			num_medium_hatchery += amount;
			showHighlight($('#num-medium-hatchery') );
			updateUI();
		}
	});
	$('.btn.purchase-big-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < BIG_HATCHERY_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else {
			num_coin -= BIG_HATCHERY_COST*amount;
			num_big_hatchery += amount;
			showHighlight($('#num-big-hatchery') );
			updateUI();
		}
	});
	$('.btn.purchase-penguin-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		// note: BASE_PENGUIN_HATCHERY_COST is 100
		let amount_penguin_hatcheries_cost = sumNumsBetween(num_penguin_hatchery+1, num_penguin_hatchery+amount+1) * BASE_PENGUIN_HATCHERY_COST;
		if(num_snowflake < amount_penguin_hatcheries_cost) {
			showSnackbar('Not enough snowflakes', 'error');
		} else {
			num_snowflake -= amount_penguin_hatcheries_cost;
			num_penguin_hatchery += amount;
			showHighlight($('#num-penguin-hatchery') );
			updateUI();
		}
	});
	$('.btn.purchase-aquarium-factory').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < AQUARIUM_FACTORY_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else {
			num_coin -= AQUARIUM_FACTORY_COST*amount;
			num_aquarium_factory += amount;
			showHighlight($('#num-aquarium-factory') );
			updateUI();
		}
	});
	$('.btn.purchase-bank').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < BANK_COST*amount) {
			showSnackbar('Not enough coins', 'error');
		} else {
			num_coin -= BANK_COST*amount;
			num_bank += amount;
			showHighlight($('#num-bank') );
			updateUI();
		}
	});
	$('.btn.purchase-snow-bank').click(function() {
		let amount = parseInt($(this).val() );
		// note: BASE_SNOW_BANK_COST is 10000
		let amountSnowBanksCost = sumNumsBetween(num_snow_bank+1, num_snow_bank+amount+1) * BASE_SNOW_BANK_COST;
		if(num_snowflake < amountSnowBanksCost) {
			showSnackbar('Not enough snowflakes', 'error');
		} else {
			num_snowflake -= amountSnowBanksCost;
			num_snow_bank += amount;
			showHighlight($('#num-snow-bank') );
			updateUI();
		}
	});

	// sell fish stuff
	$('.btn.sell-small-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(small_fish.length < amount) {
			showSnackbar('Not enough small fish', 'error');
		} else {
			stats['fish_sold'] += amount;
			num_coin += Math.round(SMALL_FISH_COST*amount*SELL_RETURN_VALUE);
			for(let i=0; i<amount; i++) {
				small_fish.pop();
			}
			showHighlight($('#num-small-fish') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});
	$('.btn.sell-medium-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(medium_fish.length < amount) {
			showSnackbar('Not enough medium fish', 'error');
		} else {
			stats['fish_sold'] += amount;
			num_coin += Math.round(MEDIUM_FISH_COST*amount*SELL_RETURN_VALUE);
			for(let i=0; i<amount; i++) {
				medium_fish.pop();
			}
			showHighlight($('#num-medium-fish') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});
	$('.btn.sell-big-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(big_fish.length < amount) {
			showSnackbar('Not enough big fish', 'error');
		} else {
			stats['fish_sold'] += amount;
			num_coin += Math.round(BIG_FISH_COST*amount*SELL_RETURN_VALUE);
			for(let i=0; i<amount; i++) {
				big_fish.pop();
			}
			showHighlight($('#num-big-fish') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});
	$('.btn.sell-penguin').click(function() {
		let amount = parseInt($(this).val() );
		if(penguins.length < amount) {
			showSnackbar('Not enough penguins', 'error');
		} else {
			num_snowflake += amount; // 1 snowflake per penguin returned
			for(let i=0; i<amount; i++) {
				penguins.pop();
			}
			showHighlight($('#num-penguin') );
			showHighlight($('#num-snowflake') );
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
			num_coin += Math.round(AQUARIUM_COST*amount*SELL_RETURN_VALUE);
			num_aquarium -= amount;
			showHighlight($('#num-aquarium') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});

	// sell producers
	$('.btn.sell-farm').click(function() {
		let amount = parseInt($(this).val() );
		if(num_farm < amount) {
			showSnackbar('Not enough farms', 'error');
		} else {
			num_coin += Math.round(FARM_COST*amount*SELL_RETURN_VALUE);
			num_farm -= amount;
			showHighlight($('#num-farm') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});
	$('.btn.sell-small-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_small_hatchery < amount) {
			showSnackbar('Not enough small hatcheries', 'error');
		} else {
			num_coin += Math.round(SMALL_HATCHERY_COST*amount*SELL_RETURN_VALUE);
			num_small_hatchery -= amount;
			showHighlight($('#num-small-hatchery') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});
	$('.btn.sell-medium-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_medium_hatchery < amount) {
			showSnackbar('Not enough medium hatcheries', 'error');
		} else {
			num_coin += Math.round(MEDIUM_HATCHERY_COST*amount*SELL_RETURN_VALUE);
			num_medium_hatchery -= amount;
			showHighlight($('#num-medium-hatchery') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});
	$('.btn.sell-big-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_big_hatchery < amount) {
			showSnackbar('Not enough big hatcheries', 'error');
		} else {
			num_coin += Math.round(BIG_HATCHERY_COST*amount*SELL_RETURN_VALUE);
			num_big_hatchery -= amount;
			showHighlight($('#num-big-hatchery') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});
	$('.btn.sell-penguin-hatchery').click(function() {
		let amount = parseInt($(this).val() );
		if(num_penguin_hatchery < amount) {
			showSnackbar('Not enough penguin hatcheries', 'error');
		} else {
			// note: BASE_PENGUIN_HATCHERY_COST is 100, snowflakes returned per penguin hatchery
			num_snowflake += amount * BASE_PENGUIN_HATCHERY_COST;
			num_penguin_hatchery -= amount;
			showHighlight($('#num-penguin-hatchery') );
			showHighlight($('#num-snowflake') );
			updateUI();
		}
	});
	$('.btn.sell-snow-bank').click(function() {
		let amount = parseInt($(this).val() );
		if(num_snow_bank < amount) { 
			showSnackbar('Not enough snow banks', 'error');
		} else {
			// note: BASE_SNOW_BANK_COST is 10000, snowflakes returned per snow bank
			num_snowflake += amount * BASE_SNOW_BANK_COST;
			num_snow_bank -= amount;
			showHighlight($('#num-snow-bank') );
			showHighlight($('#num-snowflake') );
			updateUI();
		}
	});
	$('.btn.sell-aquarium-factory').click(function() {
		let amount = parseInt($(this).val() );
		if(num_aquarium_factory < amount) {
			showSnackbar('Not enough aquarium factories', 'error');
		} else {
			num_coin += Math.round(AQUARIUM_FACTORY_COST*amount*SELL_RETURN_VALUE);
			num_aquarium_factory -= amount;
			showHighlight($('#num-aquarium-factory') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});

	$('#sell-all-food-farm-btn').click(function() {	
		num_coin += Math.round(FARM_COST*num_farm*SELL_RETURN_VALUE);
		num_farm = 0;
		showHighlight($('#num-farm') );
		showHighlight($('#num-coin') );
		updateUI();
	});
	$('#sell-all-small-hatchery-btn').click(function() {	
		num_coin += Math.round(SMALL_HATCHERY_COST*num_small_hatchery*SELL_RETURN_VALUE);
		num_small_hatchery = 0;
		showHighlight($('#num-small-hatchery') );
		showHighlight($('#num-coin') );
		updateUI();
	});
	$('#sell-all-medium-hatchery-btn').click(function() {	
		num_coin += Math.round(MEDIUM_HATCHERY_COST*num_medium_hatchery*SELL_RETURN_VALUE);
		num_medium_hatchery = 0;
		showHighlight($('#num-medium-hatchery') );
		showHighlight($('#num-coin') );
		updateUI();
	});
	$('#sell-all-big-hatchery-btn').click(function() {	
		num_coin += Math.round(BIG_HATCHERY_COST*num_big_hatchery*SELL_RETURN_VALUE);
		num_big_hatchery = 0;
		showHighlight($('#num-big-hatchery') );
		showHighlight($('#num-coin') );
		updateUI();
	});
	$('#sell-all-aquarium-factory-btn').click(function() {	
		num_coin += Math.round(AQUARIUM_FACTORY_COST*num_aquarium_factory*SELL_RETURN_VALUE);
		num_aquarium_factory = 0;
		showHighlight($('#num-aquarium-factory') );
		showHighlight($('#num-coin') );
		updateUI();
	});

	// pause
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
	$('.accept-cookies-btn').click(function() {
		savingCookies = true;
		$('#storing-cookies-para').html('Storing this game\'s cookies.');

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

		//message
		showSnackbar('Will save cookies this session. <br> Loaded any cookies from previous games.', 'info');
	});

	// text file export/import
	$('#download-data-btn').click(function() {
		downloadData();
	});

	$('#upload-data-btn').click(function() {
		$('#upload-data-input').click();
	});

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
		$(this).css('transform', 'scale(1.5)');
		// 1, 1.5, or 2 for small, medium, or big fish
		let scale_factor = random(2,5)*0.5;
		$(this).css('transform', 'scale(' + scale_factor + ')');
	});

	$('#audio-select').change(function() {
		changeAudioSetting($(this).val() );
	}).change(); // in case firefox saved previous input

	$('#volume-range').change(function() {
		setVolume($(this).val() );
	}).change(); // in case firefox saved previous input

	$('#background-music-select').change(function() {
		console.log($(this).val() );
		changeBackgroundMusic($(this).val() );
	});


	$('#aquarium-checkbox').change(function() {
		$('#canvas').css('display', $(this).is(':checked') ? '' : 'none');
		$('#penguin-canvas').css('display', $(this).is(':checked') ? '' : 'none');
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

});

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	if(key==27) { //esc
		togglePause();
	}
}
