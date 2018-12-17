// Enums
const FOOD = -1;
const SMALL = 0;
const MEDIUM = 1;
const BIG = 2;

// Classes
class Fish { //fish should go to class so they stay in school :)
	
	constructor(type, coin, space, food) {
		this.type = type;
		this.coin = coin;
		this.space = space;
		this.food = food;
		this.hungry = false;
		this.ticks = 0;
	}
	teleport() {
		if(num_imgs_loaded==img_arr.length+img_arr_left.length+img_arr_coin.length) {
			this.x = random(Math.ceil(img_arr[this.type].width/2), Math.floor(canvas.width-(img_arr[this.type].width/2) ) );
			this.y = random(Math.ceil(img_arr[this.type].height/2), Math.floor(canvas.height-(img_arr[this.type].height/2) ) );
		} else {
			this.x = 10;
			this.y = 9;
		}
		this.facing_left = Math.random() >= 0.5;
	}
	eat() {
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
	produce() {
		if(!this.hungry) {
			num_coin += this.coin;
		}
	}
	move() {
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
	draw() {
		drawFish(this.type, this.x, this.y, this.hungry, this.facing_left);
		drawMoney(this.type, this.x, this.y, this.hungry);
	}
}



// Consts

//coin output and space in tank
const SMALL_FISH_COIN = 1;
const MEDIUM_FISH_COIN = 30;
const BIG_FISH_COIN = 900;
const MEDIUM_FISH_SPACE = 2;
const SMALL_FISH_SPACE = 1;
const BIG_FISH_SPACE = 3;

//cost to purchase
const FOOD_COST = 1;
const SMALL_FISH_COST = 20;
const MEDIUM_FISH_COST = 400;
const BIG_FISH_COST = 8000;
const AQUARIUM_COST = 160000;

//misc
const AQUARIUM_SPACE = 500;
const FOOD_UNIT = 10;
const SELL_RETURN_VALUE = 0.5;

const FISH_SPEEDS = [5,10,15]; //[small, medium, big]

// Player Vals
let num_coin = 0;
let num_food = 0;
let num_aquarium = 1;
let small_fish = [];
let medium_fish = [];
let big_fish = [];

let paused = false;

// Global vars from updateUI()
// so instead of recalcuating them we can use old ones from last tick()
let num_aquarium_space_used;
let num_coin_rate;
let num_hungry_fish;
let num_hungry_small_fish;
let num_hungry_medium_fish;
let num_hungry_big_fish;

//global so we don't have to keep getting it
let canvas, ctx;


// Onload, Button Listeners
$(function() {
	// tick();
	window.setInterval(tick, 1000); //tick every s
	window.addEventListener('resize', handleResize);
	handleResize();

	window.setTimeout( ()=> { if(num_food==0) showSnackbar('Hint: Purchase 10 Food', 'info')}, 3000);

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	small_fish[0] = new Fish(SMALL, SMALL_FISH_COIN, SMALL_FISH_SPACE, FOOD); //start with 1 fish
	small_fish[0].teleport();


	//display game vals
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

	//buttons
	$('.btn.purchase-food').click( function() {
		let amount = parseInt($(this).val() );
		if(num_coin < FOOD_COST*amount) {
			showSnackbar('Not enough coin', 'error');
		} else {
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
			num_coin -= SMALL_FISH_COST*amount;
			for(let i=0; i<amount; i++) {
				small_fish.push(new Fish(SMALL, SMALL_FISH_COIN, SMALL_FISH_SPACE, FOOD) );
				small_fish[small_fish.length-1].teleport();
			}
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
			num_coin -= MEDIUM_FISH_COST*amount;
			for(let i=0; i<amount; i++) {
				medium_fish.push(new Fish(MEDIUM, MEDIUM_FISH_COIN, MEDIUM_FISH_SPACE, SMALL) );
				medium_fish[medium_fish.length-1].teleport();
			}
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
			num_coin -= BIG_FISH_COST*amount;
			for(let i=0; i<amount; i++) {
				big_fish.push(new Fish(BIG, BIG_FISH_COIN, BIG_FISH_SPACE, MEDIUM) );
				big_fish[big_fish.length-1].teleport();
			}
			showHighlight($('#num-big-fish') );
			updateUI();
		}
	});
	$('.btn.purchase-aquarium').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < AQUARIUM_COST*amount) {
			showSnackbar('Not enough coin', 'error');
		} else {
			num_coin -= AQUARIUM_COST*amount;
			num_aquarium += amount;
			showHighlight($('#num-aquarium') );
			updateUI();
		}
	});
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
	
});

// Game Functions
function tick() {
	if(paused) {
		return;
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let all_fish = [small_fish,medium_fish, big_fish];
	for(let i=0, len=all_fish.length; i<len; i++) {
		for(let j=0, ilen=all_fish[i].length; j<ilen; j++) {
			all_fish[i][j].ticks++;
			all_fish[i][j].produce();
			all_fish[i][j].eat();
			all_fish[i][j].move();
			all_fish[i][j].draw();
		}
	}

	updateUI();
}

// Utility Functions

//min is inclusive, max is exclusive, returns an int
function random(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min; 
}
