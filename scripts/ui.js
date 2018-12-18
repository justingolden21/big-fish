function updateUI() {
	num_aquarium_space_used = 0;
	num_coin_rate = 0;
	num_hungry_fish = 0;
	
	num_hungry_small_fish = 0;
	num_hungry_medium_fish = 0;
	num_hungry_big_fish = 0;

	let all_fish = small_fish.concat(medium_fish, big_fish);
	for(let i=0, len=all_fish.length; i<len; i++) {
		num_aquarium_space_used += all_fish[i].space;
		if(all_fish[i].hungry) {
			num_hungry_fish++;
		} else {
			num_coin_rate += all_fish[i].coin;
		}
	}
	for(let i=0, len=small_fish.length; i<len; i++) {
		if(small_fish[i].hungry) {
			num_hungry_small_fish++;
		}
	}
	for(let i=0, len=medium_fish.length; i<len; i++) {
		if(medium_fish[i].hungry) {
			num_hungry_medium_fish++;
		}
	}
	//save time instead of for loop
	num_hungry_big_fish = num_hungry_fish - num_hungry_small_fish - num_hungry_medium_fish;
	
	$('#num-coin').html(num_coin);
	$('#num-food').html(num_food);
	$('#num-fish').html(all_fish.length);
	$('#num-coin-rate').html(num_coin_rate);
	$('#num-food-rate').html( (num_farm*FARM_FOOD_RATE) - (small_fish.length-num_hungry_small_fish) );
	$('#num-hungry-fish').html(num_hungry_fish);
	if(num_hungry_fish>0) {
		$('#num-hungry-fish').addClass('highlight');
	} else {
		$('#num-hungry-fish').removeClass('highlight');
	}
	
	$('#num-small-fish').html(small_fish.length);
	$('#num-small-fish-food-rate').html(small_fish.length - num_hungry_small_fish);
	$('#num-small-fish-coin-rate').html( (small_fish.length - num_hungry_small_fish)*SMALL_FISH_COIN);
	$('#num-small-fish-space-total').html(small_fish.length*SMALL_FISH_SPACE);
	$('#num-small-fish-hungry').html(num_hungry_small_fish);
	if(num_hungry_small_fish>0) {
		$('#num-small-fish-hungry').addClass('highlight');
	} else {
		$('#num-small-fish-hungry').removeClass('highlight');
	}

	$('#num-medium-fish').html(medium_fish.length);
	$('#num-medium-fish-food-rate').html(medium_fish.length - num_hungry_medium_fish);
	$('#num-medium-fish-coin-rate').html( (medium_fish.length - num_hungry_medium_fish)*MEDIUM_FISH_COIN);
	$('#num-medium-fish-space-total').html(medium_fish.length*MEDIUM_FISH_SPACE);
	$('#num-medium-fish-hungry').html(num_hungry_medium_fish);
	if(num_hungry_medium_fish>0) {
		$('#num-medium-fish-hungry').addClass('highlight');
	} else {
		$('#num-medium-fish-hungry').removeClass('highlight');
	}

	$('#num-big-fish').html(big_fish.length);
	$('#num-big-fish-food-rate').html(big_fish.length - num_hungry_big_fish);
	$('#num-big-fish-coin-rate').html( (big_fish.length - num_hungry_big_fish)*BIG_FISH_COIN);
	$('#num-big-fish-space-total').html(big_fish.length*BIG_FISH_SPACE);
	$('#num-big-fish-hungry').html(num_hungry_big_fish);
	if(num_hungry_big_fish>0) {
		$('#num-big-fish-hungry').addClass('highlight');
	} else {
		$('#num-big-fish-hungry').removeClass('highlight');
	}

	$('#num-aquarium').html(num_aquarium);
	$('#num-aquarium-space-total').html(num_aquarium * AQUARIUM_SPACE);
	$('#num-aquarium-space-used').html(num_aquarium_space_used);

	$('#num-farm').html(num_farm);
	$('#num-farm-food-rate').html(num_farm*FARM_FOOD_RATE);
	$('#num-small-hatchery').html(num_small_hatchery);
	$('#num-small-hatchery-fish-rate').html(num_small_hatchery*SMALL_HATCHERY_RATE);
	$('#num-medium-hatchery').html(num_medium_hatchery);
	$('#num-medium-hatchery-fish-rate').html(num_medium_hatchery*MEDIUM_HATCHERY_RATE);
	$('#num-big-hatchery').html(num_big_hatchery);
	$('#num-big-hatchery-fish-rate').html(num_big_hatchery*BIG_HATCHERY_RATE);
	$('#num-aquarium-factory').html(num_aquarium_factory);
	$('#num-aquarium-factory-aquarium-rate').html(num_aquarium_factory*AQUARIUM_FACTORY_RATE);

	checkUnlocks();
}

// Util Functions
function showSnackbar(message, type) {
	if(type=='error') {
		message = '<i class="fas fa-exclamation-circle"></i> ' + message;
	} else if(type=='info') {
		message = '<i class="fas fa-info-circle"></i> ' + message;
	} else if(type='success') {
		message = '<i class="fas fa-check-circle"></i> ' + message;		
	}
	$('#snackbar').addClass('show');
	$('#snackbar').html(message);
	// $('#snackbar').css('animation', 'fadein 0.5s, fadeout 0.5s 2s');
	setTimeout(()=> { $('#snackbar').removeClass('show') }, 3000);
}
function showHighlight(elm, sec=0.5) {
	elm.addClass('highlight');
	setTimeout(()=> { elm.removeClass('highlight') }, sec*1000);
}
function handleResize() {
	if(window.innerWidth <= 1024) {
		$('.btn-group').addClass('btn-group-vertical').removeClass('btn-group');
	} else {
		$('.btn-group-vertical').addClass('btn-group').removeClass('btn-group-vertical');
	}
}
