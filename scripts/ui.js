
// account for banks buying and selling
let bank_differential = 0;
let snow_bank_differential = 0;

function updateUI() {
	num_aquarium_space_used = 0;
	num_coin_rate = 0;
	num_snowflake_rate = 0;
	num_hungry_fish = 0;
	
	num_hungry_small_fish = 0;
	num_hungry_medium_fish = 0;
	num_hungry_big_fish = 0;
	num_hungry_penguin = 0;

	// counting numbers for UI
	let all_fish = small_fish.concat(medium_fish, big_fish);
	for(let i=0, len=all_fish.length; i<len; i++) {
		num_aquarium_space_used += FISH_SPACE[all_fish[i].type];
		if(all_fish[i].hungry) {
			num_hungry_fish++;
		} else {
			num_coin_rate += FISH_COIN[all_fish[i].type] * num_snowflake;
		}
	}
	for(let i=0; i<penguins.length; i++) {
		if(penguins[i].hungry) {
			num_hungry_penguin++;
		} else {
			// note: rate is estimated, because penguins produce every min big fish eaten
			// and fish don't have to be eaten in a row
			num_snowflake_rate += PENGUIN_SNOWFLAKE; // 1
		}
	}
	num_aquarium_space_used += PENGUIN_SPACE * penguins.length;


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
	// save time instead of for loop
	num_hungry_big_fish = num_hungry_fish - num_hungry_small_fish - num_hungry_medium_fish;

	num_coin_rate += bank_differential;
	num_snowflake_rate += snow_bank_differential;
	
	// todo: use getNum() on more

	// display numbers on UI
	$('#num-coin').html(getNum(num_coin) );
	$('#num-snowflake').html(getNum(num_snowflake) );
	$('#num-food').html(getNum(num_food) );
	$('#num-fish').html(getNum(all_fish.length) );
	$('#num-coin-rate').html(getNum(num_coin_rate) );
	$('#num-snowflake-rate').html(getNum(num_snowflake_rate) );
	$('#num-penguin-snowflake-rate').html(getNum(num_snowflake_rate) ); // note: change if implementing more snowflake stuff
	$('#num-food-rate').html(getNum( (num_farm*FARM_FOOD_RATE) - (small_fish.length-num_hungry_small_fish) ) );
	$('#num-hungry-fish').html(getNum(num_hungry_fish) );
	highlightIf($('#num-hungry-fish'), num_hungry_fish>0);
	
	$('.num-small-fish').html(small_fish.length);
	$('#num-small-fish-food-rate').html(small_fish.length - num_hungry_small_fish);
	$('#num-small-fish-coin-rate').html( (small_fish.length - num_hungry_small_fish)*FISH_COIN[SMALL]);
	$('#num-small-fish-space-total').html(small_fish.length*FISH_SPACE[SMALL]);
	$('#num-small-fish-hungry').html(num_hungry_small_fish);
	highlightIf($('#num-small-fish-hungry'), num_hungry_small_fish>0);

	$('.num-medium-fish').html(medium_fish.length);
	$('#num-medium-fish-food-rate').html(medium_fish.length - num_hungry_medium_fish);
	$('#num-medium-fish-coin-rate').html( (medium_fish.length - num_hungry_medium_fish)*FISH_COIN[MEDIUM]);
	$('#num-medium-fish-space-total').html(medium_fish.length*FISH_SPACE[MEDIUM]);
	$('#num-medium-fish-hungry').html(num_hungry_medium_fish);
	highlightIf($('#num-medium-fish-hungry'), num_hungry_medium_fish>0);

	$('.num-big-fish').html(big_fish.length);
	$('#num-big-fish-food-rate').html(big_fish.length - num_hungry_big_fish);
	$('#num-big-fish-coin-rate').html( (big_fish.length - num_hungry_big_fish)*FISH_COIN[BIG]);
	$('#num-big-fish-space-total').html(big_fish.length*FISH_SPACE[BIG]);
	$('#num-big-fish-hungry').html(num_hungry_big_fish);
	highlightIf($('#num-big-fish-hungry'), num_hungry_big_fish>0);

	$('#num-penguin').html(penguins.length);
	$('#num-penguin-hungry').html(num_hungry_penguin);
	$('#num-penguin-food-rate').html( (penguins.length - num_hungry_penguin) * PENGUIN_FOOD);
	$('#num-penguin-space-total').html(penguins.length*PENGUIN_SPACE);

	// note: BASE_PENGUIN_COST is 1
	$('#num-penguin-cost').html(sumNumsBetween(penguins.length+1, penguins.length+1+1) * BASE_PENGUIN_COST);
	$('#num-penguin-cost-10').html(sumNumsBetween(penguins.length+1, penguins.length+10+1) * BASE_PENGUIN_COST);
	$('#num-penguin-cost-100').html(sumNumsBetween(penguins.length+1, penguins.length+100+1) * BASE_PENGUIN_COST);

	// note: BASE_PENGUIN_HATCHERY_COST is 100
	$('#num-penguin-hatchery-cost').html(sumNumsBetween(num_penguin_hatchery+1, num_penguin_hatchery+1+1) * BASE_PENGUIN_HATCHERY_COST);
	$('#num-penguin-hatchery-cost-10').html(sumNumsBetween(num_penguin_hatchery+1, num_penguin_hatchery+10+1) * BASE_PENGUIN_HATCHERY_COST);
	$('#num-penguin-hatchery-cost-100').html(sumNumsBetween(num_penguin_hatchery+1, num_penguin_hatchery+100+1) * BASE_PENGUIN_HATCHERY_COST);

	// note: BASE_SNOW_BANK_COST is 10000
	$('#num-snow-bank-cost').html(sumNumsBetween(num_snow_bank+1, num_snow_bank+1+1) * BASE_SNOW_BANK_COST);
	$('#num-snow-bank-cost-10').html(sumNumsBetween(num_snow_bank+1, num_snow_bank+10+1) * BASE_SNOW_BANK_COST);
	$('#num-snow-bank-cost-100').html(sumNumsBetween(num_snow_bank+1, num_snow_bank+100+1) * BASE_SNOW_BANK_COST);

	$('#num-aquarium').html(num_aquarium);
	$('.num-aquarium-space-total').html(getNum(num_aquarium * AQUARIUM_SPACE) );
	$('.num-aquarium-space-used').html(getNum(num_aquarium_space_used) );
	$('.aquarium-space-display-bar').css('width',num_aquarium_space_used/(num_aquarium*AQUARIUM_SPACE)*100+'%');

	$('#num-farm').html(num_farm);
	$('#num-farm-food-rate').html(num_farm*FARM_FOOD_RATE);
	$('#num-small-hatchery').html(num_small_hatchery);
	$('#num-small-hatchery-fish-rate').html(num_small_hatchery*SMALL_HATCHERY_RATE);
	$('#num-medium-hatchery').html(num_medium_hatchery);
	$('#num-medium-hatchery-fish-rate').html(num_medium_hatchery*MEDIUM_HATCHERY_RATE);
	$('#num-big-hatchery').html(num_big_hatchery);
	$('#num-big-hatchery-fish-rate').html(num_big_hatchery*BIG_HATCHERY_RATE);
	$('#num-penguin-hatchery').html(num_penguin_hatchery);
	$('#num-penguin-hatchery-penguin-rate').html(num_penguin_hatchery*PENGUIN_HATCHERY_RATE);
	$('#num-aquarium-factory').html(num_aquarium_factory);
	$('#num-aquarium-factory-aquarium-rate').html(num_aquarium_factory*AQUARIUM_FACTORY_RATE);

	$('#num-bank').html(num_bank);
	$('#num-bank-rate-total').html(num_bank*BANK_ACTION_UNIT);
	$('#num-snow-bank').html(num_snow_bank);
	$('#num-snow-bank-rate-total').html(num_snow_bank*SNOW_BANK_ACTION_UNIT);

	$('#penguin-progress').html('');
	// display at most 10 penguins, snowflake progress
	// 60s in a min
	for(let i=0; i<Math.min(penguins.length,10); i++) {
		$('#penguin-progress').append('<div class="progress-bar" style="width:' + 
			penguins[i].stomach/60 * 100 + '%;"></div>');
	}

	updateStats();
	checkUnlocks();
}

// num items in queue, don't need to keep an actual queue
let snackbar_queue = 0;
let snackbar_time = 3000;
let snackbar_time_total = 3500;
let prev_message = '';
let icon_types = {
	'error': 'fas fa-exclamation-circle',
	'info': 'fas fa-info-circle',
	'success': 'fas fa-check-circle fa-2x',
	'achievement': 'fas fa-trophy fa-2x'
};

function showSnackbar(message, type) {
	if(message == 'Not enough coins')
		showHighlight($('#num-coin') );
	else if(message == 'Not enough snowflakes')
		showHighlight($('#num-snowflake') );
	else if(message == 'Not enough space in aquarium') {
		showHighlight($('.num-aquarium-space-used') );
		showHighlight($('.num-aquarium-space-total') );
	}

	playNotificationSound(type); // even if redundant

	if(message == prev_message)
		return;
	prev_message = message;

	if(type in icon_types)
		message = '<i class="' + icon_types[type] + '"></i> ' + message;

	snackbar_queue++;
	setTimeout( ()=> { createSnackbar(message); }, snackbar_time_total*(snackbar_queue-1) );
}
function createSnackbar(message) {
	prev_message = '';

	$('#snackbar').html(message);
	$('#snackbar').addClass('show');
	$('#history-log').prepend('<p>'+message+'</p>');

	setTimeout(()=> { $('#snackbar').removeClass('show'); snackbar_queue--; }, snackbar_time);
}

function showHighlight(elm, sec=0.5) {
	elm.addClass('highlight');
	setTimeout(()=> { elm.removeClass('highlight') }, sec*1000);
}
function highlightIf(elm, condition) {
	if(condition)
		elm.addClass('highlight');
	else
		elm.removeClass('highlight');
}
function handleResize() {
	if(window.innerWidth <= 1024)
		$('.btn-group').addClass('btn-group-vertical').removeClass('btn-group');
	else
		$('.btn-group-vertical').addClass('btn-group').removeClass('btn-group-vertical');
}
