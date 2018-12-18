let num_imgs_loaded = 0;
let img_arr = [];

let img_names = 'small-fish medium-fish big-fish small-fish-left medium-fish-left big-fish-left'.split(' ');
for(let i=0; i<img_names.length; i++) {
	let tmpImg = new Image();
	tmpImg.src = 'img/' + img_names[i] + '.png';
	tmpImg.onload = ()=>num_imgs_loaded++;;
	img_arr.push(tmpImg);
}

function imagesAreLoaded() {
	return num_imgs_loaded==img_arr.length;
}

function drawFish(type, x, y, hungry, facing_left) {
	//params x and y are img center, converted to img top left for canvas
	x -= Math.floor(img_arr[type].width/2);
	y -= Math.floor(img_arr[type].height/2);

	if(!facing_left) {
		ctx.drawImage(img_arr[type], x, y);
	} else {
		ctx.drawImage(img_arr[type+3], x, y);
	}
}
