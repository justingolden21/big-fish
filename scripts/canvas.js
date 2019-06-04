let num_imgs_loaded = 0;
let img_arr = [];

let img_names = 'small-fish medium-fish big-fish small-fish-left medium-fish-left big-fish-left'.split(' ');
for(let i=0; i<img_names.length; i++) {
	let tmp_img = new Image();
	tmp_img.src = 'img/' + img_names[i] + '.png';
	tmp_img.onload = ()=>num_imgs_loaded++;
	img_arr.push(tmp_img);
}

let num_penguin_imgs_loaded = 0;
let penguin_img_left = new Image();
penguin_img_left.src = 'img/penguin-left.png';
penguin_img_left.onload = ()=>num_penguin_imgs_loaded++;
let penguin_img_right = new Image();
penguin_img_right.src = 'img/penguin.png';
penguin_img_right.onload = ()=>num_penguin_imgs_loaded++;

function imagesAreLoaded() {
	return num_imgs_loaded==img_arr.length;
}
function penguinImagesAreLoaded() {
	return num_penguin_imgs_loaded==2;	
}

function drawFish(type, x, y, facing_left) {
	//params x and y are img center, converted to img top left for canvas
	x -= Math.floor(img_arr[type].width/2);
	y -= Math.floor(img_arr[type].height/2);

	if(!facing_left)
		ctx.drawImage(img_arr[type], x, y);
	else
		ctx.drawImage(img_arr[type+3], x, y);
}

function drawPenguin(x, facing_left) {
	let y = Math.floor(penguin_canvas.height-(penguin_img_right.height/2) );

	x -= Math.floor(penguin_img_right.width/2);
	y -= Math.floor(penguin_img_right.height/2);

	if(!facing_left)
		penguin_ctx.drawImage(penguin_img_right, x, y);
	else
		penguin_ctx.drawImage(penguin_img_left, x, y);
}