// Enums
const FOOD = 0;
const SMALL = 1;
const MEDIUM = 2;
const BIG = 3;

// Classes
class Fish {
	constructor(type, coin, space, food) {
		this.type = type;
		this.coin = coin;
		this.space = space;
		this.food = food;
		this.hungry = false;
		this.ticks = 0;
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
}

// Consts
const SMALLFISH = new Fish(SMALL, 1, 1, FOOD);
const MEDIUMFISH = new Fish(MEDIUM, 30, 2, SMALL);
const BIGFISH = new Fish(SMALL, 900, 3, MEDIUM);

const FOOD_COST = 1;
const SMALL_FISH_COST = 20;
const MEDIUM_FISH_COST = 400;
const BIG_FISH_COST = 8000;
const AQUARIUM_COST = 160000;

const AQUARIUM_SPACE = 100;
const FOOD_UNIT = 10;

// Player Vals
let num_coin = 0;
let num_food = 0;
let num_aquarium = 1;
let small_fish = [];
let medium_fish = [];
let big_fish = [];

// Global vars from updateUI()
// so instead of recalcuating them we can use old ones from last tick()
let num_aquarium_space_used;
let num_coin_rate;
let num_hungry_fish;
let num_hungry_small_fish;
let num_hungry_medium_fish;
let num_hungry_big_fish;

// Onload, Button Listeners
$(function() {
	tick();
	window.setInterval(tick, 1000); //tick every s
	window.addEventListener('resize', handleResize);
	handleResize();
	
	small_fish[0] = (SMALLFISH); //start with 1 fish
	
	$('.btn.purchase-food').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < FOOD_COST*amount) {
			showSnackbar('Not enough coin');
		} else {
			num_coin -= FOOD_COST*amount;
			num_food += FOOD_UNIT*amount;
			updateUI();
		}
	});
	$('.btn.purchase-small-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < SMALL_FISH_COST*amount) {
			showSnackbar('Not enough coin');
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (SMALLFISH.space * amount) ) {
			showSnackbar('Not enough space in aquarium');
		} else {
			num_coin -= SMALL_FISH_COST*amount;
			for(let i=0; i<amount; i++) {
				small_fish.push(SMALLFISH);
			}
			updateUI();
		}
	});
	$('.btn.purchase-medium-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < MEDIUM_FISH_COST*amount) {
			showSnackbar('Not enough coin');
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (MEDIUMFISH.space * amount) ) {
			showSnackbar('Not enough space in aquarium');
		} else {
			num_coin -= MEDIUM_FISH_COST*amount;
			for(let i=0; i<amount; i++) {
				medium_fish.push(MEDIUMFISH);
			}
			updateUI();
		}
	});
	$('.btn.purchase-big-fish').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < BIG_FISH_COST*amount) {
			showSnackbar('Not enough coin');
		} else if(num_aquarium*AQUARIUM_SPACE < num_aquarium_space_used + (BIGFISH.space * amount) ) {
			showSnackbar('Not enough space in aquarium');
		} else {
			num_coin -= BIG_FISH_COST*amount;
			for(let i=0; i<amount; i++) {
				big_fish.push(BIGFISH);
			}
			updateUI();
		}
	});
	$('.btn.purchase-aquarium').click(function() {
		let amount = parseInt($(this).val() );
		if(num_coin < AQUARIUM_COST*amount) {
			showSnackbar('Not enough coin');
		} else {
			num_coin -= AQUARIUM_COST*amount;
			num_aquarium += amount;
			updateUI();
		}
	});
	
});

// Game Functions
function tick() {
	let all_fish = small_fish.concat(medium_fish, big_fish);
	for(let i=0; i<all_fish.length; i++) {
		all_fish[i].ticks++;
		all_fish[i].produce();
		all_fish[i].eat();
	}
	updateUI();
}

function updateUI() {
	num_aquarium_space_used = 0;
	num_coin_rate = 0;
	num_hungry_fish = 0;
	
	num_hungry_small_fish = 0;
	num_hungry_medium_fish = 0;
	num_hungry_big_fish = 0;

	let all_fish = small_fish.concat(medium_fish, big_fish);
	for(let i=0; i<all_fish.length; i++) {
		num_aquarium_space_used += all_fish[i].space;
		if(all_fish[i].hungry) {
			num_hungry_fish++;
		} else {
			num_coin_rate += all_fish[i].coin;
		}
	}
	for(let i=0; i<small_fish.length; i++) {
		if(small_fish[i].hungry) {
			num_hungry_small_fish++;
		}
	}
	for(let i=0; i<medium_fish.length; i++) {
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
	$('#num-food-rate').html(all_fish.length - num_hungry_fish);
	$('#num-hungry-fish').html(num_hungry_fish);
	
	$('#num-small-fish').html(small_fish.length);
	$('#num-small-fish-food-rate').html(small_fish.length - num_hungry_small_fish);
	$('#num-small-fish-coin-rate').html( (small_fish.length - num_hungry_small_fish)*SMALLFISH.coin);
	$('#num-small-fish-space-total').html(small_fish.length*SMALLFISH.space);
	$('#num-small-fish-hungry').html(num_hungry_small_fish);

	$('#num-medium-fish').html(medium_fish.length);
	$('#num-medium-fish-food-rate').html(medium_fish.length - num_hungry_medium_fish);
	$('#num-medium-fish-coin-rate').html( (medium_fish.length - num_hungry_medium_fish)*MEDIUMFISH.coin);
	$('#num-medium-fish-space-total').html(medium_fish.length*MEDIUMFISH.space);
	$('#num-medium-fish-hungry').html(num_hungry_medium_fish);

	$('#num-big-fish').html(big_fish.length);
	$('#num-big-fish-food-rate').html(big_fish.length - num_hungry_big_fish);
	$('#num-big-fish-coin-rate').html( (big_fish.length - num_hungry_big_fish)*BIGFISH.coin);
	$('#num-big-fish-space-total').html(big_fish.length*BIGFISH.space);
	$('#num-big-fish-hungry').html(num_hungry_big_fish);
	
	$('#num-aquarium').html(num_aquarium);
	$('#num-aquarium-space-total').html(num_aquarium * AQUARIUM_SPACE);
	$('#num-aquarium-space-used').html(num_aquarium_space_used);
}

// Util Functions
function showSnackbar(message) {
	$('#snackbar').addClass('show');
	$('#snackbar').html(message);
	// $('#snackbar').css('animation', 'fadein 0.5s, fadeout 0.5s 2.5s');
	setTimeout(function(){ $('#snackbar').removeClass('show') }, 3000);
}
function handleResize() {
	if(window.innerWidth <= 1024) {
		$('.btn-group').addClass('btn-group-vertical').removeClass('btn-group');
	} else {
		$('.btn-group-vertical').addClass('btn-group').removeClass('btn-group-vertical');
	}
}