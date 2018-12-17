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

let small_coin_img = new Image();
small_coin_img.src = 'img/small-coin.png';
let medium_coin_img = new Image();
medium_coin_img.src = 'img/medium-coin.png';
let big_coin_img = new Image();
big_coin_img.src = 'img/big-coin.png';
const img_arr_coin = [small_coin_img, medium_coin_img, big_coin_img];

let num_imgs_loaded = 0;
small_fish_img.onload = incrementImagesLoaded;
medium_fish_img.onload = incrementImagesLoaded;
big_fish_img.onload = incrementImagesLoaded;
small_fish_left_img.onload = incrementImagesLoaded;
medium_fish_left_img.onload = incrementImagesLoaded;
big_fish_left_img.onload = incrementImagesLoaded;
small_coin_img.onload = incrementImagesLoaded;
medium_coin_img.onload = incrementImagesLoaded;
big_coin_img.onload = incrementImagesLoaded;

function incrementImagesLoaded() {
	num_imgs_loaded++;	
}

//params x and y are img center, converted to img top left for canvas
//todo: draw hungry?
function drawFish(type, x, y, hungry, facing_left) {
	x -= Math.floor(img_arr[type].width/2);
	y -= Math.floor(img_arr[type].height/2);

	if(!facing_left) {
		ctx.drawImage(img_arr[type], x, y);
	} else {
		ctx.drawImage(img_arr_left[type], x, y);
	}
}
function drawMoney(type, x, y, hungry) {
	if(hungry) return;
	x -= Math.floor(img_arr_coin[type].width/2);
	y += Math.floor(img_arr_coin[type].height/2);
	ctx.drawImage(img_arr_coin[type], x, y);
}
