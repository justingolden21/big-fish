let firstUnpause = true;

// onload, button listeners
$(function() {
	// set up game
	window.setInterval(tick, 1000); //tick every s
	window.setInterval(setCookies, 5000); //save cookies every 5s; doesn't save unless user allowed it
	window.addEventListener('resize', handleResize);
	handleResize();

	// window.setTimeout( ()=> { if(num_food==0) showSnackbar('Hint: Purchase 10 Food', 'info')}, 2000);

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

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
	$('#num-small-fish-coin').html(SMALL_FISH_COIN);
	$('#num-small-fish-food').html(1);
	$('#num-small-fish-space').html(SMALL_FISH_SPACE);
	$('#num-medium-fish-coin').html(MEDIUM_FISH_COIN);
	$('#num-medium-fish-food').html(1);
	$('#num-medium-fish-space').html(MEDIUM_FISH_SPACE);
	$('#num-big-fish-coin').html(BIG_FISH_COIN);
	$('#num-big-fish-food').html(1);
	$('#num-big-fish-space').html(BIG_FISH_SPACE);
	$('#sell-return-value').html(SELL_RETURN_VALUE);

	$('#num-penguin-snowflake').html(PENGUIN_SNOWFLAKE); // 1
	$('#num-penguin-food').html(100);
	$('#num-penguin-space').html(PENGUIN_SPACE); // 10000

	// tick();

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
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (SMALL_FISH_SPACE * amount) ) {
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
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (MEDIUM_FISH_SPACE * amount) ) {
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
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (BIG_FISH_SPACE * amount) ) {
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
		let amountPenguinsCost = sumNumsBetween(penguins.length+1, penguins.length+amount+1);
		if(num_snowflake < amountPenguinsCost) {
			showSnackbar('Not enough snowflakes', 'error');
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (PENGUIN_SPACE * amount) ) {
			showSnackbar('Not enough space in aquarium', 'error');
		} else {
			stats['penguin_purchased'] += amount;
			num_snowflake -= amountPenguinsCost;
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
			updateUI();
		}
	});
	$('.btn.sell-aquarium').click(function() {
		let amount = parseInt($(this).val() );
		if(num_aquarium < amount+1) { //must have 1 aquarium
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

});

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	if(key==27) { //esc
		togglePause();
	}
}
