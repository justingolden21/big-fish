const PERSONAL_SCALE_SIZE = 4;
const PERSONAL_SPRITE_SIZE = 24;
const PERSONAL_MIN_X = 0;
const PERSONAL_MAX_X = 500/PERSONAL_SCALE_SIZE - PERSONAL_SPRITE_SIZE;
const PERSONAL_MIN_Y = 0;
const PERSONAL_MAX_Y = 300/PERSONAL_SCALE_SIZE - PERSONAL_SPRITE_SIZE;

let all_emotions;

let personal_canvas, personal_ctx;

let current_tank = 0;
// let tank_counts = [0,0,0,0,0]; // num personal fish per tank
let tank_counts = [0]; // num personal fish per tank
const MAX_NUM_TANKS = 5;

const MAX_PER_TANK = 25; // 5 tanks with 25 per tank, 125 max fish

const MAX_STOMACH = 3;

$( ()=> {
	// testing
	setTimeout( ()=> $('#help-modal').modal('hide'), 500);
	$('#personal-modal').modal('show');

	$('#personal-fish-modal').on('shown.bs.modal', drawFishesToModal);

	personal_canvas = document.getElementById('personal-aquarium');
	personal_canvas.width = 500; // update in css
	personal_canvas.height = 300; // update in css
	personal_ctx = personal_canvas.getContext('2d');
	// personal_ctx.translate(0.5, 0.5);
	personal_ctx.scale(PERSONAL_SCALE_SIZE,PERSONAL_SCALE_SIZE);

	personal_canvas.onclick = (evt)=> placeFood(evt);

	//favorite species numbers 12, 36, 61, 90
	addRandFish(1);
	setInterval(updatePersonalFish, 250);
	setInterval(doPersonalFishShellProduction, 1000 * 3); // 1000 * 60 * 15

	$('.num-max-personal-per-tank').html(MAX_PER_TANK);
	updatePersonalFishCount();

	$('#tank-dots .dot').click( (evt)=> { // change tank
		let new_tank = $(evt.target).attr('id').split('-')[1]; // IDs are like "data-2", we want the "2"
		current_tank = new_tank;

		// update dot display
		$('#tank-dots .dot').removeClass('active');
		$(evt.target).addClass('active');

		removeAllFood();
		updatePersonalFishCount();
	});

	// hide unavailable dots
	for(let i=0; i<MAX_NUM_TANKS; i++) {
		if(i > tank_counts.length-1) {
			$('#dot-'+i).addClass('hidden');
		}
	}


	all_emotions = $('#all-emotions').attr('class').split(/\s+/); // get classes and split by whitespace
	let idx = all_emotions.indexOf('hungry');
	if(idx!=-1) all_emotions.splice(idx, 1);

});

function updatePersonalFish() {
	personal_ctx.clearRect(0, 0, personal_canvas.width, personal_canvas.height);
	for(let i=0; i<personal_fishes.length; i++) {
		if(personal_fishes[i] && (personal_fishes[i].tank == current_tank) ) {
			personal_fishes[i].update();
		}
	}

	updateFoods();

	// ----------------

	let gold_shell_rate = 0;
	for(let i=0; i<personal_fishes.length; i++) {
		if(personal_fishes[i]) {
			gold_shell_rate += getGoldShellRate(personal_fishes[i].species_num, personal_fishes[i].level);
		}
	}

	$('.player-level').html(player_level);
	$('.num-gold-shell').html(num_gold_shell);
	$('.num-gold-shell-rate').html(gold_shell_rate);
}

function updatePersonalFishCount() {
	$('#num-personal-fish').html(tank_counts[current_tank]);
}

function doPersonalFishShellProduction() {
	for(let i=0; i<personal_fishes.length; i++) {
		if(personal_fishes[i])
			personal_fishes[i].makeShell();
	}
}

class PersonalFish {
	constructor(species_num, position, name, level, tank) {
		this.species_num = species_num;
		let tmp = getSpeciesInfo(species_num);
		this.size = tmp.size;
		this.color1 = tmp.color1;
		this.color2 = tmp.color2;

		this.x = position.x;
		this.y = position.y;
		this.facing_left = Math.random() >= 0.5;
		this.rotation = 0;

		this.tank = tank;
		this.level = level;
		this.stomach = 0;
		this.name = name;
		this.favorite = false;

		this.emotion = 'neutral';
	}
	export() {
		// export only the data worth saving
		return {
			species_num: this.species_num,
			tank: this.tank,
			level: this.level,
			name: this.name,
			favorite: this.favorite
		};
	}
	import() {
		let tmp = getSpeciesInfo(species_num);
		this.size = tmp.size;
		this.color1 = tmp.color1;
		this.color2 = tmp.color2;

		let pos = randPosition();
		this.x = pos.x;
		this.y = pos.y;
		this.rotation = 0;

		this.facing_left = Math.random() >= 0.5;
	}
	move() { // move according to speed, random direction
		this.facing_left = Math.random() >= 0.1 ? this.facing_left : !this.facing_left;
		
		if(!this.facing_left)
			this.x += PERSONAL_FISH_SPEEDS[this.size];
		else
			this.x -= PERSONAL_FISH_SPEEDS[this.size];

		if(this.x <= PERSONAL_MIN_X) {
			this.x = PERSONAL_MIN_X;
			this.facing_left = !this.facing_left;
		}
		if(this.x >= PERSONAL_MAX_X) {
			this.x = PERSONAL_MAX_X;
			this.facing_left = !this.facing_left;
		}

		if(Math.random() > 0.8) {
			if(Math.random() > 0.5)
				this.rotation += 3;
			else
				this.rotation -= 3;
			if(this.rotation < -15)
				this.rotation = -15;
			if(this.rotation > 15)
				this.rotation = 15;			
		}
	}
	isHungry() {
		return this.stomach!=MAX_STOMACH;
	}
	feed() {
		this.stomach++;
		this.setEmotion('heart');
	}
	getEmotion() {
		if(this.isHungry() )
			return 'hungry';
		return this.emotion;
	}
	draw() {
		drawFishToCanvas(this.size, this.facing_left, this.color1, this.color2, this.x, this.y, this.rotation, this.getEmotion() );
	}
	getImg() {
		return getPersonalFish(this.size, false, this.color1, this.color2, this.color2, this.color1, 0);
	}
	drawAt(location) {
		$('#'+location).append(this.getImg() );
	}
	getSVG() {
		return getSVGData(this.getImg() );
	}
	update() {
		this.move();
		this.draw();
		this.updateEmotion();
	}
	updateEmotion() {
		if(this.emotion=='neutral' && Math.random() > 0.975) {
			let rand_emotion = all_emotions[random(0,all_emotions.length)];
			this.setEmotion(rand_emotion);
		}
	}
	setEmotion(new_emotion) {
		this.emotion = new_emotion;
		setTimeout( ()=> this.emotion = 'neutral', 5000);	
	}
	makeShell() {
		if(this.isHungry() ) return false;
		let new_shell = getGoldShellRate(this.species_num, this.level);
		num_gold_shell += new_shell;
		addExp(new_shell);
	}
	levelUp() {
		if(this.level < player_level) {
			this.level++;
		}
	}
}

let personal_fishes = [];

function toggleFavorite(idx) {
	personal_fishes[idx].favorite = !personal_fishes[idx].favorite;
}
function setName(idx, name) {
	personal_fishes[idx].name = name;
}

function drawFishesToModal() {
	$('#personal-fish-div').html(''); //test
	// let tmpHTML = '';
	for(let i=0; i<personal_fishes.length; i++) {
		if(personal_fishes[i]) {
			let species_num = personal_fishes[i].species_num;
			$('#personal-fish-div').append('<div class="col-lg-4 col-md-6 fish-display-section">'
				+ '<button class="btn btn-sm favorite-btn'+(personal_fishes[i].favorite?' active':'')+'" title="Toggle Favorite" '
				+ 'onclick="toggleFavorite('+i+'); $(this).toggleClass(\'active\');" ><i class="fas fa-star"></i></button>'
				+ ' Name: <input type="text" value="' + personal_fishes[i].name + '" onchange="setName('+i+', this.value);">'
				+ ' <button class="btn btn-sm" title="Sell" onclick="sellPersonalFish('+i+'); $(this).parent().fadeOut();">'
				+ 'Sell for '+  Math.floor(getPrice(species_num, personal_fishes[i].level)/2) + getImgStr('shell-gold.png', 'icon-sm')
				+ '</button>'
				// + ' <button class="btn btn-sm" title="Change Tanks"><i class="fas fa-arrow-right"></i></button>'
				+ '<br>Level ' + personal_fishes[i].level
				+ ' &mdash; Stomach: ' + personal_fishes[i].stomach + ' / ' + MAX_STOMACH
				+ '<br><img src="' + personal_fishes[i].getSVG() + '" class="fish-display">'
				+ '<br>Tank ' + personal_fishes[i].tank+1
				+ '<br>Species ' + species_num
				+ ' &mdash; ' + getSize(species_num)
				+ ' &mdash; ' + getRarity(species_num)
				+ '<br>'
				+ '<br>Gold Shell Rate: ' + getGoldShellRate(species_num, personal_fishes[i].level) + getImgStr('shell-gold.png', 'icon-sm')
				+ '</div>'
			);
		}
	}
	// $('#personal-fish-div').html(tmpHTML);
}

function getSpeciesNum(size, color1, color2) {
	return FISH_SIZES.findIndex( (a)=> a==size) * 25
		+ FISH_COLOR_NAMES.findIndex( (a)=> a==color1) * 5
		+ FISH_COLOR_NAMES.findIndex( (a)=> a==color2) * 1;
}
function getSpeciesInfo(species_num) {
	return {
		size: FISH_SIZES[Math.floor(species_num/25)],
		color1: FISH_COLOR_NAMES[Math.floor(species_num/5%5)],
		color2: FISH_COLOR_NAMES[Math.floor(species_num%5)]
	};
}
function getRarity(species_num) {
	if(Math.floor(species_num/5%5)==Math.floor(species_num%5) )
		return 'uncommon';
	return 'common';
}
function getSize(species_num) {
	// return getSpeciesInfo(species_num).size.split('-')[0];
	return FISH_SIZES[Math.floor(species_num/25)].split('-')[0];
}

function printTests() {
	for(idx in FISH_SIZES) {
		for(color1 in FISH_COLORS) {
			for(color2 in FISH_COLORS) {
				console.log(FISH_SIZES[idx], color1, color2);
				let species_num = getSpeciesNum(FISH_SIZES[idx], color1, color2);
				console.log(species_num);
				console.log(getSpeciesInfo(species_num) );
				console.log('-----');
			}
		}
	}
}

const FISH_SIZES = 'small medium-1 medium-2 big-1 big-2'.split(' ');
const FISH_COLOR_NAMES = 'pink blue orange green red'.split(' ');

const FISH_COLORS = {
	'pink': {
		'fin': '#c985d0',
		'front': '#d890e0',
		'back': '#e599ee',
		'eye': '#af75b6',
	},
	'blue': {
		'fin': '#2f8ac6',
		'front': '#37a5ee',
		'back': '#3498db',
		'eye': '#2c84bf',
	},
	'orange': {
		'fin': '#fcb245',
		'front': '#ec8d00',
		'back': '#ff9900',
		'eye': '#cd7b00',
	},
	'green': {
		'fin': '#2cc66d',
		'front': '#25a65b',
		'back': '#27ae60',
		'eye': '#1d8548',
	},
	'red': {
		'fin': '#bf3d31',
		'front': '#f5503f',
		'back': '#e74c3c',
		'eye': '#bf3d31',
	}
};

const PERSONAL_FISH_SPEEDS = {
	'small': 1,
	'medium-1': 2,
	'medium-2': 3,
	'big-1': 4,
	'big-2': 5
};

// size is str ('small', 'medium-1', 'medium-2', 'big-1' or 'big-2')
// facing_left is bool
// colors are color strings, for example 'red' or '#f00'

// function drawPersonalFish(elm_id, size, facing_left, fin_color, front_color, back_color, eye_color) {
// 	let tmp = $('#'+size+'-fish-right').clone().appendTo('#'+elm_id).removeClass('hidden');
// 	tmp.find('.fin').css('fill', FISH_COLORS[fin_color].fin);
// 	tmp.find('.front').css('fill', FISH_COLORS[front_color].front);
// 	tmp.find('.back').css('fill', FISH_COLORS[back_color].back);
// 	tmp.find('.eye').css('fill', FISH_COLORS[eye_color].eye);
// 	if(facing_left)
// 		tmp.css('transform', 'scale(-1,1)');
// 	return tmp;
// }

function drawFishToCanvas(size, facing_left, color1, color2, x, y, rotation, emotion) {
	let fish = getPersonalFish(size,facing_left,color1,color2,color2,color1,rotation,emotion);
	drawSVGToCanvas(fish,personal_ctx,x,y,PERSONAL_SPRITE_SIZE,PERSONAL_SPRITE_SIZE);
}

function getPersonalFish(size, facing_left, fin_color, front_color, back_color, eye_color, rotation=0, emotion='neutral') {
	let tmp = document.getElementById(size+'-fish-right').cloneNode(true);
	tmp.classList.remove('hidden');
	
	let fins = tmp.querySelectorAll('.fin');
	for(let i=0; i<fins.length; i++)
		fins[i].style.fill = FISH_COLORS[fin_color].fin;
	tmp.querySelectorAll('.front')[0].style.fill = FISH_COLORS[front_color].front;
	tmp.querySelectorAll('.back')[0].style.fill = FISH_COLORS[back_color].back;
	tmp.querySelectorAll('.eye')[0].style.fill = FISH_COLORS[eye_color].eye;
	// console.log(facing_left);
	if(facing_left)
		tmp.style.transform = 'scale(-1,1)';
	if(rotation!=0)
		tmp.style.transform += 'rotate('+rotation+'deg)';


	if(emotion!='neutral') {
		let thought = document.getElementById('thought').cloneNode(true);
		// select paths except those with class of given emotion (thought bubble has all emotion classes) and remove them
		thought.querySelectorAll('path:not(.'+emotion+')').forEach(e => e.parentNode.removeChild(e) );
		if(facing_left)
			thought.style.transform = 'scale(-1,1)'; // undo fish reflection
		tmp.appendChild(thought);
	}

	return tmp;
}

// http://svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/
function drawSVGToCanvas(sourceSVG, target_ctx, x, y, width, height) {
	let svg_xml = (new XMLSerializer() ).serializeToString(sourceSVG);

	let img = new Image();
	img.onload = ()=> {
		target_ctx.drawImage(img, x, y, width, height);
	}
	img.src = 'data:image/svg+xml;base64,' + btoa(svg_xml);
}

function getSVGData(sourceSVG) {
	let svg_xml = (new XMLSerializer() ).serializeToString(sourceSVG);
	return 'data:image/svg+xml;base64,' + btoa(svg_xml);
}

function addRandFish(amount=1) {
	for(let i=0; i<amount; i++) {
		let species_num = randSpeciesNum(); 
		addPersonalFish(species_num, randPosition(), randName(species_num), 1);
	}
}

function hasSpacePersonal() {
	let fish_count = 0;
	for(let i=0; i<personal_fishes.length; i++) {
		if(personal_fishes[i]!=undefined) {
			fish_count++;
		}
	}
	return fish_count < tank_counts.length*MAX_PER_TANK;
}

function addPersonalFish(species_num, position, name, level) { // bottleneck that all added fish go through
	let tank = -1;
	if(tank_counts[current_tank]<MAX_PER_TANK) {
		tank = current_tank;
	}
	else {
		for(let i=0; i<tank_counts.length; i++) {
			if(tank_counts[i]<MAX_PER_TANK) {
				tank = i;
				break;
			}
		}
		if(tank == -1) {
			console.error('no space in tank');
			// shouldn't get here because we already check if has space in shop
			return false;
		}
	}
	tank_counts[tank]++;

	let new_fish = new PersonalFish(species_num, position, name, level, tank);
	for(let i=0; i<personal_fishes.length; i++) {
		if(personal_fishes[i]==undefined) {
			personal_fishes[i] = new_fish;
			updatePersonalFishCount();
			return true;
		}
	}
	personal_fishes.push(new_fish);
	updatePersonalFishCount();
	return true;
}
function sellPersonalFish(idx) {
	num_gold_shell += Math.floor(getPrice(personal_fishes[idx].species_num, personal_fishes[idx].level)/2);
	tank_counts[personal_fishes[idx].tank]--;
	personal_fishes[idx] = undefined;
	updatePersonalFishCount();
}
function randSpeciesNum() {
	return random(0, 124); // 124 = 5*5*5-1
}
function randPosition() {
	return {
		x: random(PERSONAL_MIN_X, PERSONAL_MAX_X),
		y: random(PERSONAL_MIN_Y, PERSONAL_MAX_Y),
	};
}

const GENERIC_FISH_NAMES = 'Mr.Speckles;FishyMcFishFace;Dr.Fish;Prof.Swimmy;Spots;Smiles;Flippy Flippy;Flippers;SwimSwim;Flops;Fin;Sushi;Atlantis;Neptune;Chips;Nibbles;Floaty Floats;Dr.Splashes;Reef Reef;Shipwreck;Captain;Tsunami;Hooks;Opal;Prof.Speckle;Bop Bop;Glup Glup;Glupples;Glubbles';

const FISH_NAMES = {
	'pink':   'Grapefruit;Strawberry;Nutmeg;Shells;Amethyst;Pearl;Moonlight;Pinky;Rose',
	'blue':   'Blueberry;Blue Corn;Sage;Waves;Topaz;Sapphire;Rain;Aqua;Azul',
	'orange': 'Pumpkin;Yam;Ginger;Clowns;Tiger\'s Eye;Amber;Sunset;Savannah;Giraffe',
	'green':  'Lime;Olive;Mint;Seaweed;Emerald;Jade;Forest;Clover;Frog',
	'red':    'Cherry;Apple;Chili;Crab;Ruby;Jasper;Magma;Valentine;Ladybug',

	'small':  'Nemo;Dory;Magikarp',
	'medium': 'Ariel',
	'big':    'Jaws;Colossal'
};

function randName(species_num) {
	let info = getSpeciesInfo(species_num);
	let fish_names = (GENERIC_FISH_NAMES + ';' + FISH_NAMES[info.color1] + ';' + FISH_NAMES[info.color2] + ';' + FISH_NAMES[getSize(species_num)]).split(';');

	return fish_names[random(0, fish_names.length)];
}

function getImgStr(src, classes) {
	return '<img src="img/'+src+'" class="'+classes+'">';
}