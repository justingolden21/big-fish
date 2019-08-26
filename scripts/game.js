// Enums
const FOOD = -1;
const SMALL = 0;
const MEDIUM = 1;
const BIG = 2;

const PUFF = 3;
// const SHELL = 4;
// const STAR = 5;

// consts
const NUM_DRAWN_FISH = 20;

class Fish { // fish should go to class so they stay in school :)
	constructor(type) {
		this.type = type;
		this.hungry = false;
		// this.ticks = 0;
	
		// position
		// only assigned if necessary
		if(this.type == SMALL && small_fish.length <= NUM_DRAWN_FISH ||
			this.type == MEDIUM && medium_fish.length <= NUM_DRAWN_FISH ||
			this.type == BIG && big_fish.length <= NUM_DRAWN_FISH) {

			if(sprites_loaded) {
				this.x = random(Math.ceil(SPRITE_SIZE/2), Math.floor(canvas.width-(SPRITE_SIZE/2) ) );
				this.y = random(Math.ceil(SPRITE_SIZE/2), Math.floor(canvas.height-(SPRITE_SIZE/2) ) );
			} else {
				this.x = 160;
				this.y = 160;
			}
			this.facing_left = Math.random() >= 0.5;
		}
	}
	eat() { // attempts to eat
		if(this.type == SMALL) {
			if(num_food < 1) {
				this.hungry = true;
			} else {
				num_food--;
				stats['food_eaten']++;
				this.hungry = false;
			}
		} else if(this.type == MEDIUM) {
			if(small_fish.length < 1) {
				this.hungry = true;
			} else {
				small_fish.pop();
				stats['fish_eaten']++;
				this.hungry = false;
			}
		} else if(this.type == BIG) {
			if(medium_fish.length < 1) {
				this.hungry = true;
			} else {
				medium_fish.pop();
				stats['fish_eaten']++;
				this.hungry = false;
			}
		}
	}
	produce() { // attempt to produce shell
		if(!this.hungry) {
			let added_shell = FISH_SHELL[this.type] * num_star;
			 num_shell += added_shell;

			if(this.type==SMALL)
				stats['money_from_small_fish'] += added_shell;
			else if(this.type==MEDIUM)
				stats['money_from_medium_fish'] += added_shell;				
			else if(this.type==BIG)
				stats['money_from_big_fish'] += added_shell;
		}
	}
	move() { // move according to speed, random direction
		this.facing_left = Math.random() >= 0.1 ? this.facing_left : !this.facing_left;
		
		if(!this.facing_left)
			this.x += FISH_SPEEDS[this.type];
		else
			this.x -= FISH_SPEEDS[this.type];

		if(this.x <= MIN_X) {
			this.x = MIN_X;
			this.facing_left = !this.facing_left;
		}
		if(this.x >= MAX_X) {
			this.x = MAX_X;
			this.facing_left = !this.facing_left;
		}

	}
	draw() { // draws fish on canvas
		drawFish(this.type, this.x, this.y, this.facing_left);
	}
	update() {
		// this.ticks++;
		this.eat();
		this.produce();
	}
}

class Pufferfish {
	constructor() {
		// this.ticks = 0;
		this.hungry = false;
		this.stomach = 0;

		// position
		// only assigned if necessary
		if(pufferfishes.length <= NUM_DRAWN_FISH) {
			if(sprites_loaded) {
				this.x = random(Math.ceil(SPRITE_SIZE/2), Math.floor(canvas.width-(SPRITE_SIZE/2) ) );
				this.y = random(Math.ceil(SPRITE_SIZE/2), Math.floor(canvas.height-(SPRITE_SIZE/2) ) );
			}
			else {
				this.x = 160;
				this.y = 160;
			}

			this.facing_left = Math.random() >= 0.5;
		}
	}
	eat() { // attempts to eat 100 big fish
		if(big_fish.length >= PUFFERFISH_FOOD) {
			for(let i=0; i<PUFFERFISH_FOOD; i++) {
				big_fish.pop();
			}
			stats['fish_eaten'] += PUFFERFISH_FOOD;
			this.stomach++;
			this.hungry = false;
		} else {
			this.hungry = true;
		}
	}
	produce() { // attempt to produce star
		// 60s per min
		// every min of being full (not in a row) produce a star
		if(this.stomach >= 60) {
			num_star += PUFFERFISH_STAR; // 1
			stats['star_gained'] += PUFFERFISH_STAR;
			this.stomach -= 60;
		}
	}
	move() { // move according to speed, random direction
		if(Math.random() >= 0.5) {
			this.x += FISH_SPEEDS[PUFF];
			this.x = Math.min(this.x, canvas.width - ( Math.floor(SPRITE_SIZE/2) ) );
			this.facing_left = false;
		} else {
			this.x -= FISH_SPEEDS[PUFF];
			this.x = Math.max(this.x, Math.ceil(SPRITE_SIZE/2) );
			this.facing_left = true;
		}
	}
	draw() {
		drawFish(PUFF, this.x, this.y, this.facing_left);
	}
	update() {
		// this.ticks++;
		this.eat();
		this.produce();
	}
}

// shell output
let FISH_SHELL = [];
FISH_SHELL[SMALL] = 1;
FISH_SHELL[MEDIUM] = 30;
FISH_SHELL[BIG] = 900;
const PUFFERFISH_STAR = 1;

// space in aquarium
let FISH_SPACE = [];
FISH_SPACE[SMALL] = 1;
FISH_SPACE[MEDIUM] = 2;
FISH_SPACE[BIG] = 3;
FISH_SPACE[PUFF] = 10000;

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
const BANK_COST = 1000000;

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
const BASE_STAR_BANK_COST = 10000;

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

let small_fish = [];
let medium_fish = [];
let big_fish = [];
let pufferfishes = [];

// game vals
let paused = false;
let draw_aquarium = true;
let canvas, ctx;
let shell_graph_canvas, shell_graph_ctx, shell_rate_graph_canvas, shell_rate_graph_ctx;

// global vars from updateUI()
// so instead of recalcuating them we can use old ones from last tick()
// maybe we shouldn't do this?
let num_aquarium_space_used;
let num_shell_rate;
let num_hungry_fish;
let num_hungry_small_fish;
let num_hungry_medium_fish;
let num_hungry_big_fish;

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
		addPufferfishes(num_pufferfish_hatchery);

	// fish update
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let all_fish = [small_fish,medium_fish, big_fish];
	for(let i=0, len=all_fish.length; i<len; i++) {
		for(let j=0, ilen=all_fish[i].length; j<ilen; j++) {
			all_fish[i][j].update();
			// only draw first NUM_DRAWN_FISH (20) of each size of fish
			if(j<NUM_DRAWN_FISH && draw_aquarium) {
				all_fish[i][j].move();
				all_fish[i][j].draw();
			}
		}
	}
	// pufferfish update
	for(let i=0; i<pufferfishes.length; i++) {
		pufferfishes[i].update();
		// only draw first NUM_DRAWN_FISH (20) pufferfishes
		if( i < NUM_DRAWN_FISH && draw_aquarium) {
			pufferfishes[i].move();
			pufferfishes[i].draw();
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
}

// note: updates html input value with correct value
function doSell() {
	let num_sell_actions_remaining = num_bank * BANK_ACTION_UNIT;

	// get inputs
	let num_small_fish_to_sell = check(parseInt($('#sell-small-fish-input').val() ) );
	let num_medium_fish_to_sell = check(parseInt($('#sell-medium-fish-input').val() ) );
	let num_big_fish_to_sell = check(parseInt($('#sell-big-fish-input').val() ) );

	// make sure they have enough fish, and enough bank actions
	num_small_fish_to_sell = Math.min(small_fish.length, num_small_fish_to_sell);
	num_small_fish_to_sell = Math.min(num_small_fish_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_small_fish_to_sell;

	num_medium_fish_to_sell = Math.min(medium_fish.length, num_medium_fish_to_sell);
	num_medium_fish_to_sell = Math.min(num_medium_fish_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_medium_fish_to_sell;

	num_big_fish_to_sell = Math.min(big_fish.length, num_big_fish_to_sell);
	num_big_fish_to_sell = Math.min(num_big_fish_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_big_fish_to_sell;

	// update input value displayed
	$('#sell-small-fish-input').val(num_small_fish_to_sell);		
	$('#sell-medium-fish-input').val(num_medium_fish_to_sell);
	$('#sell-big-fish-input').val(num_big_fish_to_sell);

	let fish_sold = num_small_fish_to_sell+num_medium_fish_to_sell+num_big_fish_to_sell;
	$('#num-current-selling-rate').html(fish_sold);
	stats['fish_sold'] += fish_sold;

	// perform sell actions
	small_fish.splice(small_fish.length-1-num_small_fish_to_sell, num_small_fish_to_sell);
	num_shell += SMALL_FISH_COST*SELL_RETURN_VALUE*num_small_fish_to_sell;
	bank_differential += SMALL_FISH_COST*SELL_RETURN_VALUE*num_small_fish_to_sell;

	medium_fish.splice(medium_fish.length-1-num_medium_fish_to_sell, num_medium_fish_to_sell);
	num_shell += MEDIUM_FISH_COST*SELL_RETURN_VALUE*num_medium_fish_to_sell;
	bank_differential += MEDIUM_FISH_COST*SELL_RETURN_VALUE*num_medium_fish_to_sell;

	big_fish.splice(big_fish.length-1-num_big_fish_to_sell, num_big_fish_to_sell);
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
	num_pufferfish_to_sell = Math.min(pufferfishes.length, num_pufferfish_to_sell);
	num_pufferfish_to_sell = Math.min(num_pufferfish_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_pufferfish_to_sell;

	num_pufferfish_hatchery_to_sell = Math.min(num_pufferfish_hatchery, num_pufferfish_hatchery_to_sell);
	num_pufferfish_hatchery_to_sell = Math.min(num_pufferfish_hatchery_to_sell, num_sell_actions_remaining);
	num_sell_actions_remaining -= num_pufferfish_hatchery_to_sell;

	// update input value displayed
	$('#sell-pufferfish-input').val(num_pufferfish_to_sell);		
	$('#sell-pufferfish-hatchery-input').val(num_pufferfish_hatchery_to_sell);

	$('#num-current-selling-rate-star-bank').html(num_pufferfish_to_sell+num_pufferfish_hatchery_to_sell);
	stats['pufferfish_sold'] += num_pufferfish_to_sell;

	// perform sell actions
	pufferfishes.splice(pufferfishes.length-1-num_pufferfish_to_sell, num_pufferfish_to_sell);
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
	let amount_pufferfishes_cost = sumNumsBetween(pufferfishes.length+1, pufferfishes.length+num_pufferfish_to_buy+1) * BASE_PUFFERFISH_COST;
	// make sure they have enough money, and enough bank actions
	if(amount_pufferfishes_cost > num_star) num_pufferfish_to_buy = 0; // TODO: consider calculating most pufferfishes possible to buy? meh.
	num_pufferfish_to_buy = Math.min(num_pufferfish_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_pufferfish_to_buy;
	// update input value displayed
	$('#buy-pufferfish-input').val(num_pufferfish_to_buy);
	// calculate val second time
	amount_pufferfishes_cost = sumNumsBetween(pufferfishes.length+1, pufferfishes.length+num_pufferfish_to_buy+1) * BASE_PUFFERFISH_COST;
	// perform buy actions
	num_star -= amount_pufferfishes_cost;
	star_bank_differential -= amount_pufferfishes_cost;
	addPufferfishes(num_pufferfish_to_buy);

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
	paused = !paused;

	audioHandlePause(paused);
}

// utility functions
// hatch amount of fish if room, else hatch as much as there is room for
function hatchFish(type, amount) {
	num_aquarium_space_used = num_aquarium_space_used ? num_aquarium_space_used : 0;
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
	// check type outside of loop for computational efficiency

	if(type==SMALL) {
		for(let i=0; i<amount; i++)
			small_fish.push(new Fish(SMALL) );
	} else if(type==MEDIUM) {
		for(let i=0; i<amount; i++)
			medium_fish.push(new Fish(MEDIUM) );
	} else if(type==BIG) {
		for(let i=0; i<amount; i++)
			big_fish.push(new Fish(BIG) );
	}
}
function addPufferfishes(amount) {
	// if not enough room, only add as many as room for
	if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (FISH_SPACE[PUFF] * amount) )
		amount = ( (num_aquarium*AQUARIUM_SPACE)-num_aquarium_space_used) / FISH_SPACE[PUFF];

	for(let i=0; i<amount; i++)
		pufferfishes.push(new Pufferfish() );
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