// Images

// let small_fish_img = new Image();
// small_fish_img.src = 'img/small-fish.png';
// let medium_fish_img = new Image();
// medium_fish_img.src = 'img/medium-fish.png';
// let big_fish_img = new Image();
// big_fish_img.src = 'img/big-fish.png';
// const img_arr = [small_fish_img, medium_fish_img, big_fish_img];

// let small_fish_left_img = new Image();
// small_fish_left_img.src = 'img/small-fish-left.png';
// let medium_fish_left_img = new Image();
// medium_fish_left_img.src = 'img/medium-fish-left.png';
// let big_fish_left_img = new Image();
// big_fish_left_img.src = 'img/big-fish-left.png';
// const img_arr_left = [small_fish_left_img, medium_fish_left_img, big_fish_left_img];

let num_imgs_loaded = 0;
// small_fish_img.onload = imageLoaded;
// medium_fish_img.onload = imageLoaded;
// big_fish_img.onload = imageLoaded;
// small_fish_left_img.onload = imageLoaded;
// medium_fish_left_img.onload = imageLoaded;
// big_fish_left_img.onload = imageLoaded;
// small_coin_img.onload = imageLoaded;
// medium_coin_img.onload = imageLoaded;
// big_coin_img.onload = imageLoaded;

let img_arr = [];
let img_names = 'small-fish medium-fish big-fish small-fish-left medium-fish-left big-fish-left'.split(' ');
for(let i=0; i<img_names.length; i++) {
	let tmpImg = new Image();
	tmpImg.src = 'img/' + img_names[i] + '.png';
	tmpImg.onload = imageLoaded;
	img_arr.push(tmpImg);
}

function imageLoaded() {
	num_imgs_loaded++;	
}
function checkImagesLoaded() {
	return num_imgs_loaded==img_arr.length;
}

//params x and y are img center, converted to img top left for canvas
//todo: draw hungry?
function drawFish(type, x, y, hungry, facing_left) {
	x -= Math.floor(img_arr[type].width/2);
	y -= Math.floor(img_arr[type].height/2);

	if(!facing_left) {
		ctx.drawImage(img_arr[type], x, y);
	} else {
		ctx.drawImage(img_arr[type+3], x, y);
	}
}
