// WIP
// note: not linked in index.html yet
// onload function not called yet
let sprites_img;
let sprites_loaded = false;

const LEFT = 0;
const RIGHT = 1;

const SPRITE_SIZE = 64;

let sprite_coords = {
	[SMALL]: {
		1: {
			[LEFT]: {x:0, y:1},
			[RIGHT]: {x:0, y:0}
		},
		2: {
			[LEFT]: {x:0, y:1},
			[RIGHT]: {x:0, y:0}
		}
	},
	[MEDIUM]: {
		1: {
			[LEFT]: {x:1, y:1},
			[RIGHT]: {x:1, y:0}
		},
		2: {
			[LEFT]: {x:2, y:1},
			[RIGHT]: {x:2, y:0}
		}
	},
	[BIG]: {
		1: {
			[LEFT]: {x:3, y:1},
			[RIGHT]: {x:3, y:0}
		},
		2: {
			[LEFT]: {x:4, y:1},
			[RIGHT]: {x:4, y:0}
		}
	},
	[PUFF]: {
		1: {
			[LEFT]: {x:3, y:4},
			[RIGHT]: {x:2, y:4}
		}

	}
};

// call onload
function setupSprites() {

	sprites_img = new Image();
	sprites_img.onload = ()=> {
		sprites_loaded = true;
		afterImagesLoaded();
	}
	sprites_img.src = 'img/tilesheet.png';
}

// note: changed params and order
// function drawFish(type, x, y, facing_left) {
function drawFish(type, subtype, x, y, facing_left) {
	if(!sprites_loaded) return;

	// params x and y are img center, converted to img top left for canvas
	x -= Math.floor(SPRITE_SIZE/2);
	y -= Math.floor(SPRITE_SIZE/2);

	// example SMALL, 341, 422, LEFT
	let cur_sprite = sprite_coords[type][subtype][facing_left?LEFT:RIGHT];
	drawSprite(cur_sprite.x, cur_sprite.y, x, y);
}

function drawSprite(spriteX, spriteY, canvasX, canvasY) {
	ctx.drawImage(sprites_img, spriteX*64, spriteY*64, 64, 64, canvasX, canvasY, 64,64);
}


// values for fish minimum and maxiumum coords
let MIN_X;
let MAX_X;

function afterImagesLoaded() {
	// calculate now so we don't have to every time they move
	MIN_X = Math.ceil(SPRITE_SIZE/2);
	MAX_X = canvas.width - (Math.floor(SPRITE_SIZE/2) );
}

// --------------------------------

const NUM_DRAWN_FISH = 20;

class DrawnFish {
	constructor(type) {
		this.type = type;
		// position
		if(sprites_loaded) {
			this.x = random(Math.ceil(SPRITE_SIZE/2), Math.floor(canvas.width-(SPRITE_SIZE/2) ) );
			this.y = random(Math.ceil(SPRITE_SIZE/2), Math.floor(canvas.height-(SPRITE_SIZE/2) ) );
		} else {
			this.x = 160;
			this.y = 160;
		}
		this.facing_left = Math.random() >= 0.5;
		this.subtype = Math.random() >= 0.5 ? 1 : 2;
		if(this.type==PUFF)
			this.subtype = 1;
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
		drawFish(this.type, this.subtype, this.x, this.y, this.facing_left);
	}
}