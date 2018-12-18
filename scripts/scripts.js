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
				this.hungry = false;
			}
		} else if(this.food == SMALL) {
			if(small_fish.length < 1) {
				this.hungry = true;
			} else {
				small_fish.pop();
				this.hungry = false;
			}
		} else if(this.food == MEDIUM) {
			if(medium_fish.length < 1) {
				this.hungry = true;
			} else {
				medium_fish.pop();
				this.hungry = false;
			}
		}
	}
	produce() { // attempt to produce coin
		if(!this.hungry) {
			num_coin += this.coin;
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
let num_ticks = 0;
let stats = {
	'food_purchased': 0,
	'small_fish_purchased': 0,
	'medium_fish_purchased': 0,
	'big_fish_purchased': 0,
	'aquarium_purchased': 0
};

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
// tick once per second
// this is when everything happens
function tick() {
	if(paused) return;

	num_ticks++;

	// producers produce
	num_food += num_farm * FARM_FOOD_RATE;
	num_aquarium += num_aquarium_factory * AQUARIUM_FACTORY_RATE;
	hatchFish(SMALL, num_small_hatchery, SMALL_FISH_SPACE);
	hatchFish(MEDIUM, num_medium_hatchery, MEDIUM_FISH_SPACE);
	hatchFish(BIG, num_big_hatchery, BIG_FISH_SPACE);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// fish update
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
