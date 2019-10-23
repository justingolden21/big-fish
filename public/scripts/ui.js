// account for banks buying and selling
let bank_differential = 0;
let star_bank_differential = 0;

function updateUI() {
	let num_aquarium_space_used = getAquariumSpaceUsed();
	let num_hungry_fish = getNumHungryFish();
	let num_fish = getNumFish();

	let num_shell_rate = getShellRate();
	let num_star_rate = getStarRate();

	num_shell_rate += bank_differential;
	num_star_rate += star_bank_differential;
	
	// todo: use getNum() on more

	// display numbers on UI
	$('#num-shell').html(getNum(num_shell) );
	$('#num-star').html(getNum(num_star) );
	$('#num-food').html(getNum(num_food) );
	$('#num-fish').html(getNum(num_fish) );
	$('#num-shell-rate').html(getNum(num_shell_rate) );
	$('#num-star-rate').html(getNum(num_star_rate) );
	$('#num-pufferfish-star-rate').html(getNum(num_star_rate) ); // note: change if implementing more star stuff
	$('#num-food-rate').html(getNum( (num_farm*FARM_FOOD_RATE) - (fish[SMALL]-hungry[SMALL]) ) );
	$('#num-hungry-fish').html(getNum(num_hungry_fish) );
	highlightIf($('#num-hungry-fish'), num_hungry_fish>0);
	
	$('.num-small-fish').html(fish[SMALL]);
	$('#num-small-fish-food-rate').html(fish[SMALL]-hungry[SMALL]);
	$('#num-small-fish-shell-rate').html( (fish[SMALL]-hungry[SMALL])*FISH_SHELL[SMALL]);
	$('#num-small-fish-space-total').html(fish[SMALL]*FISH_SPACE[SMALL]);
	$('#num-small-fish-hungry').html(Math.max(hungry[SMALL], fish[SMALL]) );
	highlightIf($('#num-small-fish-hungry'), hungry[SMALL]>0);

	$('.num-medium-fish').html(fish[MEDIUM]);
	$('#num-medium-fish-food-rate').html(fish[MEDIUM]-hungry[MEDIUM]);
	$('#num-medium-fish-shell-rate').html( (fish[MEDIUM]-hungry[MEDIUM])*FISH_SHELL[MEDIUM]);
	$('#num-medium-fish-space-total').html(fish[MEDIUM]*FISH_SPACE[MEDIUM]);
	$('#num-medium-fish-hungry').html(Math.max(hungry[MEDIUM], fish[MEDIUM]) );
	highlightIf($('#num-medium-fish-hungry'), hungry[MEDIUM]>0);

	$('.num-big-fish').html(fish[BIG]);
	$('#num-big-fish-food-rate').html(fish[BIG]-hungry[BIG]);
	$('#num-big-fish-shell-rate').html( (fish[BIG]-hungry[BIG])*FISH_SHELL[BIG]);
	$('#num-big-fish-space-total').html(fish[BIG]*FISH_SPACE[BIG]);
	$('#num-big-fish-hungry').html(Math.max(hungry[BIG], fish[BIG]) );
	highlightIf($('#num-big-fish-hungry'), hungry[BIG]>0);

	$('#num-pufferfish').html(fish[PUFF]);
	$('#num-pufferfish-hungry').html(hungry[PUFF]);
	$('#num-pufferfish-food-rate').html( (fish[PUFF]-hungry[PUFF])*PUFFERFISH_FOOD);
	$('#num-pufferfish-space-total').html(fish[PUFF]*FISH_SPACE[PUFF]);

	// note: BASE_PUFFERFISH_COST is 1
	$('#num-pufferfish-cost').html(sumNumsBetween(fish[PUFF]+1, fish[PUFF]+1+1) * BASE_PUFFERFISH_COST);
	$('#num-pufferfish-cost-10').html(sumNumsBetween(fish[PUFF]+1, fish[PUFF]+10+1) * BASE_PUFFERFISH_COST);
	$('#num-pufferfish-cost-100').html(sumNumsBetween(fish[PUFF]+1, fish[PUFF]+100+1) * BASE_PUFFERFISH_COST);

	// note: BASE_PUFFERFISH_HATCHERY_COST is 100
	$('#num-pufferfish-hatchery-cost').html(sumNumsBetween(num_pufferfish_hatchery+1, num_pufferfish_hatchery+1+1) * BASE_PUFFERFISH_HATCHERY_COST);
	$('#num-pufferfish-hatchery-cost-10').html(sumNumsBetween(num_pufferfish_hatchery+1, num_pufferfish_hatchery+10+1) * BASE_PUFFERFISH_HATCHERY_COST);
	$('#num-pufferfish-hatchery-cost-100').html(sumNumsBetween(num_pufferfish_hatchery+1, num_pufferfish_hatchery+100+1) * BASE_PUFFERFISH_HATCHERY_COST);

	// note: BASE_STAR_BANK_COST is 10000
	$('#num-star-bank-cost').html(sumNumsBetween(num_star_bank+1, num_star_bank+1+1) * BASE_STAR_BANK_COST);
	$('#num-star-bank-cost-10').html(sumNumsBetween(num_star_bank+1, num_star_bank+10+1) * BASE_STAR_BANK_COST);
	$('#num-star-bank-cost-100').html(sumNumsBetween(num_star_bank+1, num_star_bank+100+1) * BASE_STAR_BANK_COST);

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
	$('#num-pufferfish-hatchery').html(num_pufferfish_hatchery);
	$('#num-pufferfish-hatchery-pufferfish-rate').html(num_pufferfish_hatchery*PUFFERFISH_HATCHERY_RATE);
	$('#num-aquarium-factory').html(num_aquarium_factory);
	$('#num-aquarium-factory-aquarium-rate').html(num_aquarium_factory*AQUARIUM_FACTORY_RATE);

	$('#num-bank').html(num_bank);
	$('#num-bank-rate-total').html(num_bank*BANK_ACTION_UNIT);
	$('#num-star-bank').html(num_star_bank);
	$('#num-star-bank-rate-total').html(num_star_bank*STAR_BANK_ACTION_UNIT);

	$('#pufferfish-progress').html('');
	// display at most 10 pufferfishes, star progress
	// 60s in a min
	for(let i=0; i<Math.min(fish[PUFF],10); i++) {
		$('#pufferfish-progress').append('<div class="progress-bar" style="width:' + 
			pufferfish_stomachs[i]/60 * 100 + '%;"></div>');
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
	if(message == 'Not enough shells')
		showHighlight($('#num-shell') );
	else if(message == 'Not enough stars')
		showHighlight($('#num-star') );
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
