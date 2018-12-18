// onload, button listeners
$(function() {
	// set up game
	window.setInterval(tick, 1000); //tick every s
	window.addEventListener('resize', handleResize);
	handleResize();

	window.setTimeout( ()=> { if(num_food==0) showSnackbar('Hint: Purchase 10 Food', 'info')}, 3000);

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	// set up player	
	addFish(SMALL, 1); //starting fish

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

	// tick();

	// button listeners

	// purchase fish stuff
	$('.btn.purchase-food').click( function() {
		let amount = parseInt($(this).val() );
		if(num_coin < FOOD_COST*amount) {
			showSnackbar('Not enough coin', 'error');
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
			showSnackbar('Not enough coin', 'error');
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
			showSnackbar('Not enough coin', 'error');
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
			showSnackbar('Not enough coin', 'error');
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
	$('.btn.purchase-aquarium').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < AQUARIUM_COST*amount) {
			showSnackbar('Not enough coin', 'error');
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
			showSnackbar('Not enough coin', 'error');
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
			showSnackbar('Not enough coin', 'error');
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
			showSnackbar('Not enough coin', 'error');
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
			showSnackbar('Not enough coin', 'error');
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
			showSnackbar('Not enough coin', 'error');
		} else {
			num_coin -= AQUARIUM_FACTORY_COST*amount;
			num_aquarium_factory += amount;
			showHighlight($('#num-aquarium-factory') );
			updateUI();
		}
	});

	// sell fish stuff
	$('.btn.sell-small-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(small_fish.length < amount) {
			showSnackbar('Not enough small fish', 'error');
		} else {
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
			num_coin += Math.round(BIG_FISH_COST*amount*SELL_RETURN_VALUE);
			for(let i=0; i<amount; i++) {
				big_fish.pop();
			}
			showHighlight($('#num-big-fish') );
			showHighlight($('#num-coin') );
			updateUI();
		}
	});
	$('.btn.sell-aquarium').click(function() {
		let amount = parseInt($(this).val() );
		if(num_aquarium < amount) {
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
	$('#pause-btn').click(function() {
		if(!paused) {
			$(this).html('<i class="fas fa-play"></i>');
			showSnackbar('Game paused', 'info');
		} else {
			$(this).html('<i class="fas fa-pause"></i>');
			showSnackbar('Game resumed', 'info');
		}
		$('hr').toggleClass('paused');
		paused = !paused;
	});

	$('#copy-link').click(function() {
		let tmp = $('<input type="text">').appendTo(document.body);
		tmp.val(window.location.href);
		tmp.select();
		document.execCommand('copy');
		tmp.remove();

		showSnackbar('Copied link to clipboard', 'success');
	});
});