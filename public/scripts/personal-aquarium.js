const PERSONAL_SPRITE_SIZE = 24;
const PERSONAL_MIN_X = 0;
const PERSONAL_MAX_X = 500/4 - 24;
const PERSONAL_MIN_Y = 0;
const PERSONAL_MAX_Y = 300/4 - 24;

let personal_canvas, personal_ctx;

$( ()=> {
	// testing
	setTimeout( ()=> $('#help-modal').modal('hide'), 500);
	$('#personal-modal').modal('show');

	$('#personal-fish-modal').on('shown.bs.modal', ()=> {
		drawFishesToModal();
	});

	personal_canvas = document.getElementById('personal-aquarium');
	personal_canvas.width=500; // update in css
	personal_canvas.height=300; // update in css
	personal_ctx = personal_canvas.getContext('2d');
	// personal_ctx.translate(0.5, 0.5);
	personal_ctx.scale(4,4);

	let size = PERSONAL_SPRITE_SIZE, max = PERSONAL_MAX_X;
	let x = 0, y = 0;
	for(idx in FISH_SIZES) {
		for(color1 in FISH_COLORS) {
			for(color2 in FISH_COLORS) {
				drawFishToCanvas(FISH_SIZES[idx], false, color1, color2, x, y);
				x += size;
				if(x>max) {
					x=0;
					y += size;
				}
			}
		}
	}

	//favorite species numbers 12, 36, 61, 90
	for(let i=0; i<5; i++)
		addRandFish();
	setInterval(updatePersonalFish, 250);

});

function updatePersonalFish() {
	personal_ctx.clearRect(0, 0, personal_canvas.width, personal_canvas.height);
	for(let i=0; i<personal_fishes.length; i++) {
		personal_fishes[i].update();
	}
}

class PersonalFish {
	constructor(species_num, position, name) {
		this.species_num = species_num;
		let tmp = getSpeciesInfo(species_num);
		this.size = tmp.size;
		this.color1 = tmp.color1;
		this.color2 = tmp.color2;

		this.x = position.x;
		this.y = position.y;
		this.facing_left = Math.random() >= 0.5;

		this.tank = 1;
		this.level = 1;
		this.stomach = 0;
		this.name = name;
		this.favorite = false;
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

		this.x = 100;
		this.y = 100;
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
	}
	draw() {
		drawFishToCanvas(this.size, this.facing_left, this.color1, this.color2, this.x, this.y);
	}
	getImg() {
		return getPersonalFish(this.size, false, this.color1, this.color2, this.color2, this.color1);
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
	}
}

let personal_fishes = [];


function drawFishesToModal() {
	$('#personal-fish-div').html(''); //test
	// let tmpHTML = '';
	for(let i=0; i<personal_fishes.length; i++) {
		$('#personal-fish-div').append('<div class="col-lg-4 col-md-6 fish-display-section">'
			+ '<button class="btn btn-sm" title="Favorite"><i class="fas fa-star"></i></button>'
			+ ' Name: <input type="text" value="' + personal_fishes[i].name + '">'
			+ ' <button class="btn btn-sm" title="Sell"><i class="fas fa-times"></i></button>'
			+ ' <button class="btn btn-sm" title="Change Tanks"><i class="fas fa-arrow-right"></i></button>'
			+ '<br>Level ' + personal_fishes[i].level
			+ ' &mdash; Stomach: ' + personal_fishes[i].stomach
			+ '<br><img src="' + personal_fishes[i].getSVG() + '" class="fish-display">'
			+ '<br>Species ' + personal_fishes[i].species_num
			+ ' &mdash; ' + getRarity(personal_fishes[i].species_num)
			+ '<br>'
		);
		// tmpHTML += '<div class="col-md-3 col-sm-6">'
		// + ''
		// + ''
		// + '</div>';
		// personal_fishes[i].drawAt('personal-fish-div'); //aaa

		$('#personal-fish-div').append('</div>');
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

function drawFishTypeToCanvas(species_num, facing_left, x, y) {
	let species_info = getSpeciesInfo(species_num);
	drawFishToCanvas(species_info.size, facing_left, species_info.color1, species_info.color2, x, y);
}

function drawFishToCanvas(size, facing_left, color1, color2, x, y) {
	let fish = getPersonalFish(size,facing_left,color1,color2,color2,color1);
	drawSVGToCanvas(fish,personal_ctx,x,y,PERSONAL_SPRITE_SIZE,PERSONAL_SPRITE_SIZE);
}



function getPersonalFish(size, facing_left, fin_color, front_color, back_color, eye_color) {
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

function addRandFish() {
	personal_fishes.push(new PersonalFish(RandSpeciesNum(), RandPosition(), RandName() ) );
}
function RandSpeciesNum() {
	return random(0, 124); // 124 = 5*5*5-1
}
function RandPosition() {
	return {
		x: random(PERSONAL_MIN_X, PERSONAL_MAX_X),
		y: random(PERSONAL_MIN_Y, PERSONAL_MAX_Y),
	};
}
function RandName() {
	let names = 'Mr.Speckles;FishyMcFishFace;Dr.Fish;Clowns;Prof.Swimmy;Cherry;Lemon;Blueberry;Apple;Lime;Spots;Waves;Smiles'.split(';');
	return names[random(0, names.length)];
}
