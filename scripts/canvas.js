let num_imgs_loaded = 0;
let num_penguin_imgs_loaded = 0;

let img_arr = [];
let penguin_img_left, penguin_img_right;

let img_names = 'small-fish medium-fish big-fish small-fish-left medium-fish-left big-fish-left'.split(' ');

function loadImages() {
	for(let i=0; i<img_names.length; i++) {
		let tmp_img = new Image();
		tmp_img.src = 'img/' + img_names[i] + '.png';
		tmp_img.onload = ()=> {
			num_imgs_loaded++;
			afterImagesLoaded();
		}
		img_arr.push(tmp_img);
	}

	penguin_img_left = new Image();
	penguin_img_left.src = 'img/penguin-left.png';
	penguin_img_left.onload = ()=>num_penguin_imgs_loaded++;
	penguin_img_right = new Image();
	penguin_img_right.src = 'img/penguin.png';
	penguin_img_right.onload = ()=>num_penguin_imgs_loaded++;
}

function imagesAreLoaded() {
	return num_imgs_loaded==img_arr.length;
}
function penguinImagesAreLoaded() {
	return num_penguin_imgs_loaded==2;	
}

// values for fish minimum and maxiumum coords
let MIN_X = [];
let MAX_X = [];

function afterImagesLoaded() {
	if(!imagesAreLoaded() ) return;

	// calculate now so we don't have to every time they move
	MIN_X[SMALL] = Math.ceil(img_arr[SMALL].width/2);
	MIN_X[MEDIUM] = Math.ceil(img_arr[MEDIUM].width/2);
	MIN_X[BIG] = Math.ceil(img_arr[BIG].width/2);
	MAX_X[SMALL] = canvas.width - (Math.floor(img_arr[SMALL].width/2) );
	MAX_X[MEDIUM] = canvas.width - (Math.floor(img_arr[MEDIUM].width/2) );
	MAX_X[BIG] = canvas.width - (Math.floor(img_arr[BIG].width/2) );
}

function drawFishOld(type, x, y, facing_left) {
	// params x and y are img center, converted to img top left for canvas
	x -= Math.floor(img_arr[type].width/2);
	y -= Math.floor(img_arr[type].height/2);

	if(!facing_left)
		ctx.drawImage(img_arr[type], x, y);
	else
		ctx.drawImage(img_arr[type+3], x, y);

	// Bubbles
	// let num_bubble = random(0,2);
	// for(let i=0; i<num_bubble; i++) {
	// 	ctx.beginPath();
	// 	// cx, cy, r
	// 	ctx.arc(x+random(-5,5)+(facing_left?0:img_arr[type].width), y+random(-5,5), random(2,5), 0, 2*Math.PI, false);
	// 	ctx.fillStyle = '#fff';
	// 	ctx.fill();
	// }

}

function drawPenguin(x, facing_left) {
	let y = Math.floor(canvas.height-(penguin_img_right.height/2) );

	x -= Math.floor(penguin_img_right.width/2);
	y -= Math.floor(penguin_img_right.height/2);

	if(!facing_left)
		ctx.drawImage(penguin_img_right, x, y);
	else
		ctx.drawImage(penguin_img_left, x, y);
}

// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function updateCanvas() {
	// Lookup the size the browser is displaying the canvas.
	let display_width  = canvas.clientWidth;
	let display_height = canvas.clientHeight;

	// Check if the canvas is not the same size.
	if(canvas.width  != display_width ||
		canvas.height != display_height) {

		// Make the canvas the same size
		canvas.width  = display_width;
		canvas.height = display_height;
	}
}
