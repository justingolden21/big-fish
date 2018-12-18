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
			num_coin += this.coin;

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
		this.produce();
		this.eat();
		this.move();
		this.draw();
	}
}

// coin output
const SMALL_FISH_COIN = 1;
const MEDIUM_FISH_COIN = 30;
const BIG_FISH_COIN = 900;

// space in aquarium
const SMALL_FISH_SPACE = 1;
const MEDIUM_FISH_SPACE = 2;
const BIG_FISH_SPACE = 3;

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

// producer rates
const FARM_FOOD_RATE = 5;
const SMALL_HATCHERY_RATE = 1;
const MEDIUM_HATCHERY_RATE = 1;
const BIG_HATCHERY_RATE = 1;
const AQUARIUM_FACTORY_RATE = 1;

// misc
const AQUARIUM_SPACE = 500;
const FOOD_UNIT = 10;
const SELL_RETURN_VALUE = 0.5;
const FISH_SPEEDS = [5,10,15]; //[small, medium, big]

// player vals
let num_coin = 0;
let num_food = 0;
let num_aquarium = 1;
let num_farm = 0;
let num_small_hatchery = 0;
let num_medium_hatchery = 0;
let num_big_hatchery = 0;
let num_aquarium_factory = 0;

let small_fish = [];
let medium_fish = [];
let big_fish = [];

// game vals
let paused = false;
let canvas, ctx;

// global vars from updateUI()
// so instead of recalcuating them we can use old ones from last tick()
// maybe we shouldn't do this?
let num_aquarium_space_used;
let num_coin_rate;
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
	hatchFish(SMALL, num_small_hatchery, SMALL_FISH_SPACE);
	hatchFish(MEDIUM, num_medium_hatchery, MEDIUM_FISH_SPACE);
	hatchFish(BIG, num_big_hatchery, BIG_FISH_SPACE);

	// fish update
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let all_fish = [small_fish,medium_fish, big_fish];
	for(let i=0, len=all_fish.length; i<len; i++) {
		for(let j=0, ilen=all_fish[i].length; j<ilen; j++) {
			all_fish[i][j].ticks++;
			all_fish[i][j].update();
		}
	}

	updateUI();
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
// min is inclusive, max is exclusive, returns an int
function random(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min; 
}
