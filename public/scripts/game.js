// Enums
const FOOD = -1;
const SMALL = 0;
const MEDIUM = 1;
const BIG = 2;

const PUFF = 3;
// const SHELL = 4;
// const STAR = 5;

// shell output
let FISH_SHELL = [];
FISH_SHELL[SMALL] = 1;
FISH_SHELL[MEDIUM] = 30;
FISH_SHELL[BIG] = 900;
FISH_SHELL[PUFF] = 0; // it's easier this way...
const PUFFERFISH_STAR = 1;

// space in aquarium
let FISH_SPACE = [];
FISH_SPACE[SMALL] = 1;
FISH_SPACE[MEDIUM] = 2;
FISH_SPACE[BIG] = 3;
FISH_SPACE[PUFF] = 10000;

// amount eaten
// let FISH_FOOD = [];
// FISH_FOOD[SMALL] = 1;
// FISH_FOOD[MEDIUM] = 1;
// FISH_FOOD[BIG] = 1;
// FISH_FOOD[PUFF] = 100;

// ticks before producing
// let FISH_STOMACH = [];
// FISH_STOMACH[SMALL] = 1;
// FISH_STOMACH[MEDIUM] = 1;
// FISH_STOMACH[BIG] = 1;
// FISH_STOMACH[PUFF] = 60;

// cost to purchase
const FOOD_COST = 1;
const SMALL_FISH_COST = 20;
const MEDIUM_FISH_COST = 400;
const BIG_FISH_COST = 8000;
const AQUARIUM_COST = 160000;

const FARM_COST = 100;
const SMALL_HATCHERY_COST = 1000;
const MEDIUM_HATCHERY_COST = 10000;
const BIG_HATCHERY_COST = 100000;
const AQUARIUM_FACTORY_COST = 1000000;
const BANK_COST = 10000000;

// producer rates
const FARM_FOOD_RATE = 5;
const SMALL_HATCHERY_RATE = 1;
const MEDIUM_HATCHERY_RATE = 1;
const BIG_HATCHERY_RATE = 1;
const PUFFERFISH_HATCHERY_RATE = 1;
const AQUARIUM_FACTORY_RATE = 1;

// base costs will rise, but consts stay for reference
const BASE_PUFFERFISH_COST = 1;
const BASE_PUFFERFISH_HATCHERY_COST = 100;
const BASE_STAR_BANK_COST = 1000;

// misc
const AQUARIUM_SPACE = 500;
const FOOD_UNIT = 10;
const BANK_ACTION_UNIT = 10;
const STAR_BANK_ACTION_UNIT = 10;
const SELL_RETURN_VALUE = 0.5;
const FISH_SPEEDS = [5,10,15,10]; // [small, medium, big, puff]
const PUFFERFISH_FOOD = 100; // 100 big fish/s
const SHELL_STAR_EXCHANGE_RATE = 100000;

// player vals
let num_shell = 1;
let num_star = 1;
let num_food = 0;
let num_aquarium = 1;
let num_farm = 0;
let num_small_hatchery = 0;
let num_medium_hatchery = 0;
let num_big_hatchery = 0;
let num_pufferfish_hatchery = 0;
let num_aquarium_factory = 0;
let num_bank = 0;
let num_star_bank = 0;

let drawn_fish = [];
drawn_fish[SMALL] = [];
drawn_fish[MEDIUM] = [];
drawn_fish[BIG] = [];
drawn_fish[PUFF] = [];

let fish = [];
fish[SMALL] = 0;
fish[MEDIUM] = 0;
fish[BIG] = 0;
fish[PUFF] = 0;

let hungry = [];
hungry[SMALL] = 0;
hungry[MEDIUM] = 0;
hungry[BIG] = 0;
hungry[PUFF] = 0;

let pufferfish_stomachs = [];

// game vals
let paused = false;
let draw_aquarium = true;
let canvas, ctx;
let shell_graph_canvas, shell_graph_ctx, shell_rate_graph_canvas, shell_rate_graph_ctx;

// global vars from updateUI()
// so instead of recalcuating them we can use old ones from last tick()
// maybe we shouldn't do this?
// let num_aquarium_space_used;
let num_shell_rate;
// let num_hungry_fish;
// let num_hungry_small_fish;
// let num_hungry_medium_fish;
// let num_hungry_big_fish;

// tick once per second
// this is when everything happens
function tick() {
	if(paused) return;

	stats['total_ticks']++;

	// producers produce
	num_food += num_farm * FARM_FOOD_RATE;
	num_aquarium += num_aquarium_factory * AQUARIUM_FACTORY_RATE;
	hatchFish(SMALL, num_small_hatchery);
	hatchFish(MEDIUM, num_medium_hatchery);
	hatchFish(BIG, num_big_hatchery);

	// every min (60 ticks)
	if(stats['total_ticks'] % 60 == 0)
		addFish(PUFF, num_pufferfish_hatchery);


	let fish_eating;
	
	fish_eating = Math.min(fish[SMALL], num_food);
	hungry[SMALL] = fish[SMALL] - fish_eating;
	addShell(FISH_SHELL[SMALL] * fish_eating * num_star, SMALL);
	num_food -= fish_eating;
	stats['food_eaten'] += fish_eating;

	fish_eating = Math.min(fish[MEDIUM], fish[SMALL]);
	hungry[MEDIUM] = fish[MEDIUM] - fish_eating;
	addShell(FISH_SHELL[MEDIUM] * fish_eating * num_star, MEDIUM);
	removeFish(SMALL, fish_eating, 'eat');

	fish_eating = Math.min(fish[BIG], fish[MEDIUM]);
	hungry[BIG] = fish[BIG] - fish_eating;
	addShell(FISH_SHELL[BIG] * fish_eating * num_star, BIG);
	removeFish(MEDIUM, fish_eating, 'eat');

	// PUFFERFISH_FOOD is big fish eaten per sec
	fish_eating = Math.min(fish[PUFF], fish[BIG]*PUFFERFISH_FOOD);
	hungry[PUFF] = fish[PUFF] - fish_eating;
	for(let i=0; i<fish_eating; i++) {
		pufferfish_stomachs[i]++;
		if(pufferfish_stomachs[i] >= 60) {
			num_star += PUFFERFISH_STAR; // 1
			stats['star_gained'] += PUFFERFISH_STAR;
			pufferfish_stomachs[i] -= 60;
		}
	}
	removeFish(BIG, fish_eating*PUFFERFISH_FOOD, 'eat');

	// fish update
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(type in drawn_fish) {
		for(let i=0; i<drawn_fish[type].length; i++) {
			drawn_fish[type][i].move();
			drawn_fish[type][i].draw();			
		}
	}

	bank_differential = 0;
	if(num_bank>0) { //check isn't necessary but saves cpu
		doSell();
		doBuy();
	}

	star_bank_differential = 0;
	if(num_star_bank>0) {
		if(stats['total_ticks']%60==0) {
			doStarSell();
			doStarBuy();
		}

	}

	updateUI();
	updateFishSounds();

	// for shell graphs
	updateShell();
	updateShellRate();
	updateShellGraph();
} // end tick()

// note: updates html input value with correct value
function doSell() {
	let num_sell_actions_remaining = num_bank * BANK_ACTION_UNIT;

	// get inputs
	let num_small_fish_to_sell = check(parseInt($('#sell-small-fish-input').val() ) );
	let num_medium_fish_to_sell = check(parseInt($('#sell-medium-fish-input').val() ) );
	let num_big_fish_to_sell = check(parseInt($('#sell-big-fish-input').val() ) );

	// make sure they have enough fish, and enough bank actions
	num_small_fish_to_sell = Math.min(fish[SMALL], num_small_fish_to_sell);
	num_small_fish_to_sell = Math.min(num_small_fish_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_small_fish_to_sell;

	num_medium_fish_to_sell = Math.min(fish[MEDIUM], num_medium_fish_to_sell);
	num_medium_fish_to_sell = Math.min(num_medium_fish_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_medium_fish_to_sell;

	num_big_fish_to_sell = Math.min(fish[BIG], num_big_fish_to_sell);
	num_big_fish_to_sell = Math.min(num_big_fish_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_big_fish_to_sell;

	// update input value displayed
	$('#sell-small-fish-input').val(num_small_fish_to_sell);		
	$('#sell-medium-fish-input').val(num_medium_fish_to_sell);
	$('#sell-big-fish-input').val(num_big_fish_to_sell);

	$('#num-current-selling-rate').html(
		num_small_fish_to_sell+num_medium_fish_to_sell+num_big_fish_to_sell
	);

	// perform sell actions
	removeFish(SMALL, num_small_fish_to_sell, 'sell');
	num_shell += SMALL_FISH_COST*SELL_RETURN_VALUE*num_small_fish_to_sell;
	bank_differential += SMALL_FISH_COST*SELL_RETURN_VALUE*num_small_fish_to_sell;

	removeFish(MEDIUM, num_medium_fish_to_sell, 'sell');
	num_shell += MEDIUM_FISH_COST*SELL_RETURN_VALUE*num_medium_fish_to_sell;
	bank_differential += MEDIUM_FISH_COST*SELL_RETURN_VALUE*num_medium_fish_to_sell;

	removeFish(BIG, num_big_fish_to_sell, 'sell');
	num_shell += BIG_FISH_COST*SELL_RETURN_VALUE*num_big_fish_to_sell;
	bank_differential += BIG_FISH_COST*SELL_RETURN_VALUE*num_big_fish_to_sell;
}

function doBuy() {
	// TODO: make less redundant with array of objects?
	let num_buy_actions_remaining = num_bank * BANK_ACTION_UNIT;

	// get inputs
	let num_food_farm_to_buy = check(parseInt($('#buy-food-farm-input').val() ) );
	let num_small_hatchery_to_buy = check(parseInt($('#buy-small-hatchery-input').val() ) );
	let num_medium_hatchery_to_buy = check(parseInt($('#buy-medium-hatchery-input').val() ) );
	let num_big_hatchery_to_buy = check(parseInt($('#buy-big-hatchery-input').val() ) );
	let num_aquarium_factory_to_buy = check(parseInt($('#buy-aquarium-factory-input').val() ) );

	// make sure they have enough money, and enough bank actions
	if(FARM_COST*num_food_farm_to_buy > num_shell) num_food_farm_to_buy = Math.floor(num_shell/FARM_COST);
	num_food_farm_to_buy = Math.min(num_food_farm_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_food_farm_to_buy;
	// update input value displayed
	$('#buy-food-farm-input').val(num_food_farm_to_buy);
	// perform buy actions
	num_shell -= FARM_COST * num_food_farm_to_buy;
	bank_differential -= FARM_COST * num_food_farm_to_buy;
	num_farm += num_food_farm_to_buy;

	if(SMALL_HATCHERY_COST*num_small_hatchery_to_buy > num_shell) num_small_hatchery_to_buy = Math.floor(num_shell/SMALL_HATCHERY_COST);
	num_small_hatchery_to_buy = Math.min(num_small_hatchery_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_small_hatchery_to_buy;
	$('#buy-small-hatchery-input').val(num_small_hatchery_to_buy);
	num_shell -= SMALL_HATCHERY_COST * num_small_hatchery_to_buy;
	bank_differential -= SMALL_HATCHERY_COST * num_small_hatchery_to_buy;
	num_small_hatchery += num_small_hatchery_to_buy;

	if(MEDIUM_HATCHERY_COST*num_medium_hatchery_to_buy > num_shell) num_medium_hatchery_to_buy = Math.floor(num_shell/MEDIUM_HATCHERY_COST);
	num_medium_hatchery_to_buy = Math.min(num_medium_hatchery_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_medium_hatchery_to_buy;
	$('#buy-medium-hatchery-input').val(num_medium_hatchery_to_buy);
	num_shell -= MEDIUM_HATCHERY_COST * num_medium_hatchery_to_buy;
	bank_differential -= MEDIUM_HATCHERY_COST * num_medium_hatchery_to_buy;
	num_medium_hatchery += num_medium_hatchery_to_buy;

	if(BIG_HATCHERY_COST*num_big_hatchery_to_buy > num_shell) num_big_hatchery_to_buy = Math.floor(num_shell/BIG_HATCHERY_COST);
	num_big_hatchery_to_buy = Math.min(num_big_hatchery_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_big_hatchery_to_buy;
	$('#buy-big-hatchery-input').val(num_big_hatchery_to_buy);
	num_shell -= BIG_HATCHERY_COST * num_big_hatchery_to_buy;
	bank_differential -= BIG_HATCHERY_COST * num_big_hatchery_to_buy;
	num_big_hatchery += num_big_hatchery_to_buy;

	if(AQUARIUM_FACTORY_COST*num_aquarium_factory_to_buy > num_shell) num_aquarium_factory_to_buy = Math.floor(num_shell/AQUARIUM_FACTORY_COST);
	num_aquarium_factory_to_buy = Math.min(num_aquarium_factory_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_aquarium_factory_to_buy;
	$('#buy-aquarium-factory-input').val(num_aquarium_factory_to_buy);
	num_shell -= AQUARIUM_FACTORY_COST * num_aquarium_factory_to_buy;
	bank_differential -= AQUARIUM_FACTORY_COST * num_aquarium_factory_to_buy;
	num_aquarium_factory += num_aquarium_factory_to_buy;

	$('#num-current-buying-rate').html(num_food_farm_to_buy+num_small_hatchery_to_buy+num_medium_hatchery_to_buy+num_big_hatchery_to_buy+num_aquarium_factory_to_buy);
}

function doStarSell() {
	let num_sell_actions_remaining = num_star_bank * STAR_BANK_ACTION_UNIT;

	// get inputs
	let num_pufferfish_to_sell = check(parseInt($('#sell-pufferfish-input').val() ) );
	let num_pufferfish_hatchery_to_sell = check(parseInt($('#sell-pufferfish-hatchery-input').val() ) );

	// make sure they have enough items, and enough bank actions
	num_pufferfish_to_sell = Math.min(fish[PUFF], num_pufferfish_to_sell);
	num_pufferfish_to_sell = Math.min(num_pufferfish_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_pufferfish_to_sell;

	num_pufferfish_hatchery_to_sell = Math.min(num_pufferfish_hatchery, num_pufferfish_hatchery_to_sell);
	num_pufferfish_hatchery_to_sell = Math.min(num_pufferfish_hatchery_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_pufferfish_hatchery_to_sell;

	// update input value displayed
	$('#sell-pufferfish-input').val(num_pufferfish_to_sell);		
	$('#sell-pufferfish-hatchery-input').val(num_pufferfish_hatchery_to_sell);

	$('#num-current-selling-rate-star-bank').html(num_pufferfish_to_sell+num_pufferfish_hatchery_to_sell);

	// perform sell actions
	removeFish(PUFF, num_pufferfish_to_sell, 'sell');
	num_star += BASE_PUFFERFISH_COST*num_pufferfish_to_sell;
	star_bank_differential += BASE_PUFFERFISH_COST*num_pufferfish_to_sell;

	num_pufferfish_hatchery -= num_pufferfish_hatchery_to_sell;
	num_star += BASE_PUFFERFISH_HATCHERY_COST*num_pufferfish_hatchery_to_sell;
	star_bank_differential += BASE_PUFFERFISH_HATCHERY_COST*num_pufferfish_hatchery_to_sell;
}
function doStarBuy() {
	let num_buy_actions_remaining = num_star_bank * STAR_BANK_ACTION_UNIT;

	// get inputs
	let num_pufferfish_to_buy = check(parseInt($('#buy-pufferfish-input').val() ) );
	// calculate val first time
	let amount_pufferfishes_cost = sumNumsBetween(fish[PUFF]+1, fish[PUFF]+num_pufferfish_to_buy+1) * BASE_PUFFERFISH_COST;
	// make sure they have enough money, and enough bank actions
	if(amount_pufferfishes_cost > num_star) num_pufferfish_to_buy = 0; // TODO: consider calculating most pufferfishes possible to buy? meh.
	num_pufferfish_to_buy = Math.min(num_pufferfish_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_pufferfish_to_buy;
	// update input value displayed
	$('#buy-pufferfish-input').val(num_pufferfish_to_buy);
	// calculate val second time
	amount_pufferfishes_cost = sumNumsBetween(fish[PUFF]+1, fish[PUFF]+num_pufferfish_to_buy+1) * BASE_PUFFERFISH_COST;
	// perform buy actions
	num_star -= amount_pufferfishes_cost;
	star_bank_differential -= amount_pufferfishes_cost;
	addFish(PUFF, num_pufferfish_to_buy);

	// get inputs
	let num_pufferfish_hatchery_to_buy = check(parseInt($('#buy-pufferfish-hatchery-input').val() ) );
	// calculate val first time
	let amount_pufferfish_hatcheries_cost = sumNumsBetween(num_pufferfish_hatchery+1, num_pufferfish_hatchery+num_pufferfish_hatchery_to_buy+1) * BASE_PUFFERFISH_HATCHERY_COST;
	// make sure they have enough money, and enough bank actions
	if(amount_pufferfish_hatcheries_cost > num_star) num_pufferfish_hatchery_to_buy = 0; // TODO: consider calculating most pufferfish hatcheries possible to buy? meh.
	num_pufferfish_hatchery_to_buy = Math.min(num_pufferfish_hatchery_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_pufferfish_hatchery_to_buy;
	// update input value displayed
	$('#buy-pufferfish-hatchery-input').val(num_pufferfish_hatchery_to_buy);
	// calculate val second time
	amount_pufferfish_hatcheries_cost = sumNumsBetween(num_pufferfish_hatchery+1, num_pufferfish_hatchery+num_pufferfish_hatchery_to_buy+1) * BASE_PUFFERFISH_HATCHERY_COST;
	// perform buy actions
	num_star -= amount_pufferfish_hatcheries_cost;
	star_bank_differential -= amount_pufferfish_hatcheries_cost;
	num_pufferfish_hatchery += num_pufferfish_hatchery_to_buy;

	// get inputs
	let num_times_to_exchange = check(parseInt($('#exchange-shell-star-input').val() ) );
	// make sure they have enough money, and enough bank actions
	if(num_times_to_exchange*SHELL_STAR_EXCHANGE_RATE > num_shell) num_times_to_exchange = 0; // TODO: consider changing?
	num_times_to_exchange = Math.min(num_times_to_exchange, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_times_to_exchange;
	// update input value displayed
	$('#exchange-shell-star-input').val(num_times_to_exchange);
	// perform buy actions
	num_shell -= num_times_to_exchange*SHELL_STAR_EXCHANGE_RATE;
	bank_differential -= num_times_to_exchange*SHELL_STAR_EXCHANGE_RATE;
	num_star += num_times_to_exchange;
	star_bank_differential += num_times_to_exchange;

	$('#num-current-buying-rate-star-bank').html(num_pufferfish_to_buy+num_pufferfish_hatchery_to_buy+num_times_to_exchange);
}

function check(num) {
	if(isNaN(num)||num<0)
		return 0;
	return num;
}

function togglePause(snackbar=true) {
	if(!paused) {
		$('#pause-btn').html('<i class="fas fa-play"></i>');
		if(snackbar)
			showSnackbar('Game paused', 'info');
	} else {
		$('#pause-btn').html('<i class="fas fa-pause"></i>');
		if(snackbar)
			showSnackbar('Game resumed', 'info');
	}
	$('hr').toggleClass('paused');
	$('.sticky-header').toggleClass('paused');
	paused = !paused;

	audioHandlePause(paused);
}

// utility functions
// hatch amount of fish if room, else hatch as much as there is room for
function hatchFish(type, amount) {
	let num_aquarium_space_used = getAquariumSpaceUsed();
	let space_per_fish = FISH_SPACE[type];
	if(num_aquarium*AQUARIUM_SPACE >= num_aquarium_space_used + (space_per_fish * amount) ) {
		addFish(type, amount);
	}
	else {
		addFish(type, ( (num_aquarium*AQUARIUM_SPACE)-num_aquarium_space_used) / space_per_fish);
		showHighlight($('.num-aquarium-space-used') );
		showHighlight($('.num-aquarium-space-total') );
	}
}
function addFish(type, amount) {
	let num_aquarium_space_used = getAquariumSpaceUsed();
	// if not enough room, only add as many as room for
	if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (FISH_SPACE[type] * amount) )
		amount = Math.floor( ( (num_aquarium*AQUARIUM_SPACE)-num_aquarium_space_used) / FISH_SPACE[type]);

	fish[type] += amount;

	if(drawn_fish[type].length < NUM_DRAWN_FISH) {
		// how many we have left, how many we're adding
		let num_to_add = Math.min(NUM_DRAWN_FISH - drawn_fish[type].length, amount);
		for(let i=0; i<num_to_add; i++)
			drawn_fish[type].push(new DrawnFish(type) );
	}

	if(type==PUFF)
		pufferfish_stomachs.push(0);
}

function removeFish(type, amount, action) {
	fish[type] -= amount;

	// NUM_DRAWN_FISH
	let amount_should_be_drawn = Math.min(fish[type], NUM_DRAWN_FISH);
	for(let i=0; i<drawn_fish[type].length-amount_should_be_drawn; i++) // amount missing
		drawn_fish[type].pop();

	if(action=='eat')
		stats['fish_eaten'] += amount;
	else if(action=='sell')
		stats['fish_sold'] += amount;

	if(type==PUFF)
		pufferfish_stomachs.pop();
}

function addShell(amount, action) {
	num_shell += amount;

	if(action==SMALL)
		stats['money_from_small_fish'] += amount;
	if(action==MEDIUM)
		stats['money_from_medium_fish'] += amount;
	if(action==BIG)
		stats['money_from_big_fish'] += amount;
}

function getAquariumSpaceUsed() {
	let tmp = 0;
	for(type in fish)
		tmp += fish[type] * FISH_SPACE[type];
	return tmp;
}
function getNumFish() {
	let tmp = 0;
	for(type in fish)
		tmp += fish[type];
	return tmp;	
}
function getNumHungryFish() {
	let tmp = 0;
	for(type in hungry)
		tmp += hungry[type];
	return tmp;
}
function getShellRate() {
	let tmp = 0;
	for(type in fish)
		tmp += (fish[type]-hungry[type]) * FISH_SHELL[type] * num_star;
	return tmp;
}
function getStarRate() {
	return (fish[PUFF] - hungry[PUFF]) * PUFFERFISH_STAR;
}

// min is inclusive, max is exclusive, returns an int, used for starting positions
function random(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min; 
}

// for star costs
function sumNumsBetween(start, end) {
	let sum = 0;
	for(let i=start; i<end; i++)
		sum += i;
	return sum;
}