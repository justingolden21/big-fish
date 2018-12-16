// Enums
const FOOD = -1;
const SMALL = 0;
const MEDIUM = 1;
const BIG = 2;

// Images
let small_fish_img = new Image();
small_fish_img.src = 'img/small-fish.png';
let medium_fish_img = new Image();
medium_fish_img.src = 'img/medium-fish.png';
let big_fish_img = new Image();
big_fish_img.src = 'img/big-fish.png';
const img_arr = [small_fish_img, medium_fish_img, big_fish_img];

let small_fish_left_img = new Image();
small_fish_left_img.src = 'img/small-fish-left.png';
let medium_fish_left_img = new Image();
medium_fish_left_img.src = 'img/medium-fish-left.png';
let big_fish_left_img = new Image();
big_fish_left_img.src = 'img/big-fish-left.png';
const img_arr_left = [small_fish_left_img, medium_fish_left_img, big_fish_left_img];

let num_imgs_loaded = 0;
small_fish_img.onload = function() {
	num_imgs_loaded++;
}
medium_fish_img.onload = function() {
	num_imgs_loaded++;
}
big_fish_img.onload = function() {
	num_imgs_loaded++;
}
small_fish_left_img.onload = function() {
	num_imgs_loaded++;
}
medium_fish_left_img.onload = function() {
	num_imgs_loaded++;
}
big_fish_left_img.onload = function() {
	num_imgs_loaded++;
}


// Classes
class Fish { //fish should go to class so they stay in school :)
	
	constructor(type, coin, space, food) {
		this.type = type;
		this.coin = coin;
		this.space = space;
		this.food = food;
		this.hungry = false;
		this.ticks = 0;
		

		// this.x = -1;
		// this.y = -1;
		// this.facing_left = false;
	}
	teleport() {
		if(num_imgs_loaded==img_arr.length+img_arr_left.length) {
			this.x = random(Math.ceil(img_arr[this.type].width/2), Math.floor(canvas.width-(img_arr[this.type].width/2) ) );
			this.y = random(Math.ceil(img_arr[this.type].height/2), Math.floor(canvas.height-(img_arr[this.type].height/2) ) );
			console.log(this.x);
		} else {
			console.log('hi');
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
		draw(this.type, this.x, this.y, this.facing_left);		
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
const AQUARIUM_SPACE = 100;
const FOOD_UNIT = 10;
const SELL_RETURN_VALUE = 0.5;

const FISH_SPEEDS = [5,5,5]; //small, medium, big

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

	window.setTimeout( ()=> {showSnackbar('Hint: Purchase 10 Food', 'info')}, 2000);

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	small_fish[0] = new Fish(SMALL, SMALL_FISH_COIN, SMALL_FISH_SPACE, FOOD); //start with 1 fish
	small_fish[0].teleport();
	
	$('.btn.purchase-food').click( function() {
		let amount = parseInt($(this).val() );
		console.log(amount);
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
			showSnackbar('Not enough fish', 'error');
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
	$('#num-food-rate').html(all_fish.length - num_hungry_fish);
	$('#num-hungry-fish').html(num_hungry_fish);
	
	$('#num-small-fish').html(small_fish.length);
	$('#num-small-fish-food-rate').html(small_fish.length - num_hungry_small_fish);
	$('#num-small-fish-coin-rate').html( (small_fish.length - num_hungry_small_fish)*SMALL_FISH_COIN);
	$('#num-small-fish-space-total').html(small_fish.length*SMALL_FISH_SPACE);
	$('#num-small-fish-hungry').html(num_hungry_small_fish);

	$('#num-medium-fish').html(medium_fish.length);
	$('#num-medium-fish-food-rate').html(medium_fish.length - num_hungry_medium_fish);
	$('#num-medium-fish-coin-rate').html( (medium_fish.length - num_hungry_medium_fish)*MEDIUM_FISH_COIN);
	$('#num-medium-fish-space-total').html(medium_fish.length*MEDIUM_FISH_SPACE);
	$('#num-medium-fish-hungry').html(num_hungry_medium_fish);

	$('#num-big-fish').html(big_fish.length);
	$('#num-big-fish-food-rate').html(big_fish.length - num_hungry_big_fish);
	$('#num-big-fish-coin-rate').html( (big_fish.length - num_hungry_big_fish)*BIG_FISH_COIN);
	$('#num-big-fish-space-total').html(big_fish.length*BIG_FISH_SPACE);
	$('#num-big-fish-hungry').html(num_hungry_big_fish);
	
	$('#num-aquarium').html(num_aquarium);
	$('#num-aquarium-space-total').html(num_aquarium * AQUARIUM_SPACE);
	$('#num-aquarium-space-used').html(num_aquarium_space_used);
}

// Util Functions
function showSnackbar(message, type) {
	if(type=='error') {
		message = '<i class="fas fa-exclamation-circle"></i> ' + message;
	} else if(type=='info') {
		message = '<i class="fas fa-info-circle"></i> ' + message;
	}
	$('#snackbar').addClass('show');
	$('#snackbar').html(message);
	// $('#snackbar').css('animation', 'fadein 0.5s, fadeout 0.5s 2.5s');
	setTimeout(()=> { $('#snackbar').removeClass('show') }, 3000);
}
function showHighlight(elm) {
	elm.addClass('highlight');
	setTimeout(()=> { elm.removeClass('highlight') }, 500);
}
function handleResize() {
	if(window.innerWidth <= 1024) {
		$('.btn-group').addClass('btn-group-vertical').removeClass('btn-group');
	} else {
		$('.btn-group-vertical').addClass('btn-group').removeClass('btn-group-vertical');
	}
}


//------------------------

//min is inclusive, max is exclusive, returns an int
function random(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min; 
}




//params x and y are img center, converted to img top left for canvas
function draw(type, x, y, facing_left) {
	x -= Math.floor(img_arr[type].width/2);
	y -= Math.floor(img_arr[type].height/2);

	if(!facing_left) {
		ctx.drawImage(img_arr[type], x, y);
	} else {
		ctx.drawImage(img_arr_left[type], x, y);
	}

}


function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	// let copy = obj.constructor();
	let copy = {};
	for(let attr in obj) {
		if(obj.hasOwnProperty(attr) ) {			
			copy[attr] = clone(obj[attr]);
		}
	}
	return copy;
}
