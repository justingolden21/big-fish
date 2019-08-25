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
		[LEFT]: {x:0, y:1},
		[RIGHT]: {x:0, y:0}
	},
	[MEDIUM]: {
		[LEFT]: {x:1, y:1},
		[RIGHT]: {x:1, y:0}
	},
	[BIG]: {
		[LEFT]: {x:3, y:1},
		[RIGHT]: {x:3, y:0}
	},
	[PUFF]: {
		[LEFT]: {x:3, y:4},
		[RIGHT]: {x:2, y:4}
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
function drawFish(type, x, y, facing_left) {
	if(!sprites_loaded) return;

	// params x and y are img center, converted to img top left for canvas
	x -= Math.floor(SPRITE_SIZE/2);
	y -= Math.floor(SPRITE_SIZE/2);

	// example SMALL, 341, 422, LEFT
	let cur_sprite = sprite_coords[type][facing_left?LEFT:RIGHT];
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