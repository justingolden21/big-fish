// Enums
const FOOD = -1;
const SMALL = 0;
const MEDIUM = 1;
const BIG = 2;

class Fish { // fish should go to class so they stay in school :)
	constructor(type, coin, space, food) {
		this.type = type;
		this.coin = coin;
		this.space = space;
		this.food = food;
		this.hungry = false;
		this.ticks = 0;
	
		// position
		if(imagesAreLoaded() ) {
			this.x = random(Math.ceil(img_arr[this.type].width/2), Math.floor(canvas.width-(img_arr[this.type].width/2) ) );
			this.y = random(Math.ceil(img_arr[this.type].height/2), Math.floor(canvas.height-(img_arr[this.type].height/2) ) );
		} else {
			this.x = 10;
			this.y = 9;
		}
		this.facing_left = Math.random() >= 0.5;
	}
	eat() { // attempts to eat
		if(this.food == FOOD) {
			if(num_food < 1) {
				this.hungry = true;
			} else {
				num_food--;
				stats['food_eaten']++;
				this.hungry = false;
			}
		} else if(this.food == SMALL) {
			if(small_fish.length < 1) {
				this.hungry = true;
			} else {
				small_fish.pop();
				stats['fish_eaten']++;
				this.hungry = false;
			}
		} else if(this.food == MEDIUM) {
			if(medium_fish.length < 1) {
				this.hungry = true;
			} else {
				medium_fish.pop();
				stats['fish_eaten']++;
				this.hungry = false;
			}
		}
	}
	produce() { // attempt to produce coin
		if(!this.hungry) {
			num_coin += this.coin * num_snowflake;

			if(this.type==SMALL) {
				stats['money_from_small_fish'] += this.coin;
			} else if(this.type==MEDIUM) {
				stats['money_from_medium_fish'] += this.coin;				
			} else if(this.type==BIG) {
				stats['money_from_big_fish'] += this.coin;
			}
		}
	}
	move() { // move according to speed, random direction
		if(Math.random() >= 0.5) {
			this.x += FISH_SPEEDS[this.type];
			this.x = Math.min(this.x, canvas.width - ( Math.floor(img_arr[this.type].width/2) ) );
			this.facing_left = false;
		} else {
			this.x -= FISH_SPEEDS[this.type];
			this.x = Math.max(this.x, Math.ceil(img_arr[this.type].width/2) );
			this.facing_left = true;
		}
	}
	draw() { // draws fish on canvas
		drawFish(this.type, this.x, this.y, this.hungry, this.facing_left);
	}
	update() {
		this.ticks++;
		this.eat();
		this.produce();

		this.move();
	}
}

// coin output
const SMALL_FISH_COIN = 1;
const MEDIUM_FISH_COIN = 30;
const BIG_FISH_COIN = 900;
const PENGUIN_SNOWFLAKE = 1;

// space in aquarium
const SMALL_FISH_SPACE = 1;
const MEDIUM_FISH_SPACE = 2;
const BIG_FISH_SPACE = 3;
const PENGUIN_SPACE = 10000;

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
const PENGUIN_HATCHERY_RATE = 1;
const AQUARIUM_FACTORY_RATE = 1;

// base costs will rise, but consts stay for reference
const BASE_PENGUIN_COST = 1;
const BASE_PENGUIN_HATCHERY_COST = 100;

// misc
const AQUARIUM_SPACE = 500;
const FOOD_UNIT = 10;
const BANK_ACTION_UNIT = 10;
const SELL_RETURN_VALUE = 0.5;
const FISH_SPEEDS = [5,10,15]; //[small, medium, big]
const PENGUIN_SPEEDS = [5,15]; // min and max speed
const PENGUIN_FOOD = 100; // 100 big fish/s

// player vals
let num_coin = 1;
let num_snowflake = 1;
let num_food = 0;
let num_aquarium = 1;
let num_farm = 0;
let num_small_hatchery = 0;
let num_medium_hatchery = 0;
let num_big_hatchery = 0;
let num_penguin_hatchery = 0;
let num_aquarium_factory = 0;
let num_bank = 0;

let small_fish = [];
let medium_fish = [];
let big_fish = [];
let penguins = [];

// game vals
let paused = false;
let draw_aquarium = true;
let canvas, ctx, penguinCanvas, penguinCtx;

// global vars from updateUI()
// so instead of recalcuating them we can use old ones from last tick()
// maybe we shouldn't do this?
let num_aquarium_space_used;
let num_coin_rate;
let num_hungry_fish;
let num_hungry_small_fish;
let num_hungry_medium_fish;
let num_hungry_big_fish;

class Penguin {
	constructor() {
		this.ticks = 0;
		this.hungry = false;
		this.stomach = 0;

		// position
		if(penguinImagesAreLoaded() ) {
			this.x = random(Math.ceil(penguin_img_right.width/2), Math.floor(canvas.width-(penguin_img_right.width/2) ) );
		} else {
			this.x = 10;
		}

		this.facing_left = Math.random() >= 0.5;
	}
	eat() { // attempts to eat 100 big fish
		if(big_fish.length >= PENGUIN_FOOD) {
			for(let i=0; i<PENGUIN_FOOD; i++)
				big_fish.pop();
			stats['fish_eaten']++;
			this.stomach++;
			this.hungry = false;
		} else {
			this.hungry = true;
		}
	}
	produce() { // attempt to produce snowflake
		// 60s per min
		// every min of being full (not in a row) produce a snowflake
		if(this.stomach>60) {
			num_snowflake += PENGUIN_SNOWFLAKE; // 1
			stats['snowflake_gained'] += PENGUIN_SNOWFLAKE;
			this.stomach -= 60;
		}
	}
	move() { // move according to speed, random direction
		if(Math.random() >= 0.5) {
			this.x += parseInt(random(PENGUIN_SPEEDS[0], PENGUIN_SPEEDS[1]) );
			this.x = Math.min(this.x, canvas.width - ( Math.floor(penguin_img_right.width/2) ) );
			this.facing_left = false;
		} else {
			this.x -= parseInt(random(PENGUIN_SPEEDS[0], PENGUIN_SPEEDS[1]) );
			this.x = Math.max(this.x, Math.ceil(penguin_img_right.width/2) );
			this.facing_left = true;
		}
	}
	draw() {
		drawPenguin(this.x, this.facing_left);
	}
	update() {
		this.ticks++;
		this.eat();
		this.produce();
		this.move();
	}
}

// tick once per second
// this is when everything happens
function tick() {
	if(paused) return;

	stats['total_ticks']++;

	// producers produce
	num_food += num_farm * FARM_FOOD_RATE;
	num_aquarium += num_aquarium_factory * AQUARIUM_FACTORY_RATE;
	hatchFish(SMALL, num_small_hatchery, SMALL_FISH_SPACE);
	hatchFish(MEDIUM, num_medium_hatchery, MEDIUM_FISH_SPACE);
	hatchFish(BIG, num_big_hatchery, BIG_FISH_SPACE);

	// every min (60 ticks)
	if(stats['total_ticks'] % 60 == 0)
		addPenguins(num_penguin_hatchery);

	// fish update
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let all_fish = [small_fish,medium_fish, big_fish];
	for(let i=0, len=all_fish.length; i<len; i++) {
		for(let j=0, ilen=all_fish[i].length; j<ilen; j++) {
			all_fish[i][j].update();
			if(j<20 && draw_aquarium) { // only draw first 20 of each size of fish
				all_fish[i][j].draw();
			}
		}
	}
	// penguin update
	penguinCtx.clearRect(0, 0, canvas.width, canvas.height);
	for(let i=0; i<penguins.length; i++) {
		penguins[i].update();
		if( i < 10 && draw_aquarium) { // only draw first 10 penguins
			penguins[i].draw();
		}
	}

	bank_differential = 0;
	if(num_bank>0) { //check isn't necessary but saves cpu
		doSell();
		doBuy();
	}

	updateUI();
	updateFishSounds();
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
	num_coin += SMALL_FISH_COST*SELL_RETURN_VALUE*num_small_fish_to_sell;
	bank_differential += SMALL_FISH_COST*SELL_RETURN_VALUE*num_small_fish_to_sell;

	medium_fish.splice(medium_fish.length-1-num_medium_fish_to_sell, num_medium_fish_to_sell);
	num_coin += MEDIUM_FISH_COST*SELL_RETURN_VALUE*num_medium_fish_to_sell;
	bank_differential += MEDIUM_FISH_COST*SELL_RETURN_VALUE*num_medium_fish_to_sell;

	big_fish.splice(big_fish.length-1-num_big_fish_to_sell, num_big_fish_to_sell);
	num_coin += BIG_FISH_COST*SELL_RETURN_VALUE*num_big_fish_to_sell;
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
	if(FARM_COST*num_food_farm_to_buy > num_coin) num_food_farm_to_buy = Math.floor(num_coin/FARM_COST);
	num_food_farm_to_buy = Math.min(num_food_farm_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_food_farm_to_buy;
	// update input value displayed
	$('#buy-food-farm-input').val(num_food_farm_to_buy);
	// perform buy actions
	num_coin -= FARM_COST * num_food_farm_to_buy;
	bank_differential -= FARM_COST * num_food_farm_to_buy;
	num_farm += num_food_farm_to_buy;

	if(SMALL_HATCHERY_COST*num_small_hatchery_to_buy > num_coin) num_small_hatchery_to_buy = Math.floor(num_coin/SMALL_HATCHERY_COST);
	num_small_hatchery_to_buy = Math.min(num_small_hatchery_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_small_hatchery_to_buy;
	$('#buy-small-hatchery-input').val(num_small_hatchery_to_buy);
	num_coin -= SMALL_HATCHERY_COST * num_small_hatchery_to_buy;
	bank_differential -= SMALL_HATCHERY_COST * num_small_hatchery_to_buy;
	num_small_hatchery += num_small_hatchery_to_buy;

	if(MEDIUM_HATCHERY_COST*num_medium_hatchery_to_buy > num_coin) num_medium_hatchery_to_buy = Math.floor(num_coin/MEDIUM_HATCHERY_COST);
	num_medium_hatchery_to_buy = Math.min(num_medium_hatchery_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_medium_hatchery_to_buy;
	$('#buy-medium-hatchery-input').val(num_medium_hatchery_to_buy);
	num_coin -= MEDIUM_HATCHERY_COST * num_medium_hatchery_to_buy;
	bank_differential -= MEDIUM_HATCHERY_COST * num_medium_hatchery_to_buy;
	num_medium_hatchery += num_medium_hatchery_to_buy;

	if(BIG_HATCHERY_COST*num_big_hatchery_to_buy > num_coin) num_big_hatchery_to_buy = Math.floor(num_coin/BIG_HATCHERY_COST);
	num_big_hatchery_to_buy = Math.min(num_big_hatchery_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_big_hatchery_to_buy;
	$('#buy-big-hatchery-input').val(num_big_hatchery_to_buy);
	num_coin -= BIG_HATCHERY_COST * num_big_hatchery_to_buy;
	bank_differential -= BIG_HATCHERY_COST * num_big_hatchery_to_buy;
	num_big_hatchery += num_big_hatchery_to_buy;

	if(AQUARIUM_FACTORY_COST*num_aquarium_factory_to_buy > num_coin) num_aquarium_factory_to_buy = Math.floor(num_coin/AQUARIUM_FACTORY_COST);
	num_aquarium_factory_to_buy = Math.min(num_aquarium_factory_to_buy, num_buy_actions_remaining);
	num_buy_actions_remaining -= num_aquarium_factory_to_buy;
	$('#buy-aquarium-factory-input').val(num_aquarium_factory_to_buy);
	num_coin -= AQUARIUM_FACTORY_COST * num_aquarium_factory_to_buy;
	bank_differential -= AQUARIUM_FACTORY_COST * num_aquarium_factory_to_buy;
	num_aquarium_factory += num_aquarium_factory_to_buy;

	$('#num-current-buying-rate').html(num_food_farm_to_buy+num_small_hatchery_to_buy+num_medium_hatchery_to_buy+num_big_hatchery_to_buy+num_aquarium_factory_to_buy);


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
function hatchFish(type, amount, spacePerFish) {
	if(num_aquarium*AQUARIUM_SPACE >= num_aquarium_space_used + (spacePerFish * amount) ) {
		addFish(type, amount);
	} else {
		addFish(type, ( (num_aquarium*AQUARIUM_SPACE)-num_aquarium_space_used) / spacePerFish);
	}
}
function addFish(type, amount) {
	if(type==SMALL) {
		for(let i=0; i<amount; i++) {
			small_fish.push(new Fish(SMALL, SMALL_FISH_COIN, SMALL_FISH_SPACE, FOOD) );
		}
	} else if(type==MEDIUM) {
		for(let i=0; i<amount; i++) {
			medium_fish.push(new Fish(MEDIUM, MEDIUM_FISH_COIN, MEDIUM_FISH_SPACE, SMALL) );
		}
	} else if(type==BIG) {
		for(let i=0; i<amount; i++) {
			big_fish.push(new Fish(BIG, BIG_FISH_COIN, BIG_FISH_SPACE, MEDIUM) );
		}
	}
}
function addPenguins(amount) {
	// if not enough room, only add as many as room for
	if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (PENGUIN_SPACE * amount) ) {
		amount = ( (num_aquarium*AQUARIUM_SPACE)-num_aquarium_space_used) / PENGUIN_SPACE;
	}

	for(let i=0; i<amount; i++) {
		penguins.push(new Penguin() );
	}

}
// min is inclusive, max is exclusive, returns an int
function random(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min; 
}

// for snowflake costs
function sumNumsBetween(start, end) {
	let sum = 0;
	for(let i=start; i<end; i++)
		sum += i;
	return sum;
}