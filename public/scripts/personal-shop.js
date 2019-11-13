/* personal-shop.js
for all things in personal shop
*/

let num_gold_shell = 0;
let shop_fish = []; // stored as species, level, price, and name

const SALE = 0.75; // todo: implement sale
const SHOP_BASE_COST = 20; // base cost for a fish without modifiers
const REROLL_COST = 20;
const NEW_TANK_COST = 200;

$( ()=> {
	$('#personal-shop-modal').on('shown.bs.modal', updateShopDisplay);

	$('#reroll-shop-btn').click(rerollShop);
	$('#new-tank-btn').click(newTank);
	if(tank_counts.length == MAX_NUM_TANKS) {
		$('#new-tank-btn').addClass('hidden');
	}

	addRandShopFish(3);
});

function rerollShop() {
	if(num_gold_shell < REROLL_COST) { // check cost
		showAlert('Not enough gold shells', 'Not enough gold shells to reroll shop.');
		return;
	}

	num_gold_shell -= REROLL_COST; // pay cost

	// do reroll and display it
	shop_fish = [];
	addRandShopFish(3);
	$('.shop-item').fadeOut('slow', updateShopDisplay);
}

function updateShopDisplay() {
	$('#personal-shop-div').html('');
	for(idx in shop_fish) {
		if(!shop_fish[idx]) continue;

		let species_num = shop_fish[idx].species_num; // it's easier this way
		$('#personal-shop-div').append(
			'<div class="col-lg-4 col-md-6 fish-display-section shop-item" onclick="purcahsePersonalFish($(this),'+idx+')">'
			+ '<img src="' + getShopFishSVG(idx) +'" class="fish-display">'
			+ '<br>Species ' + species_num
			+ ' &mdash; ' + getSize(species_num)
			+ ' &mdash; ' + getRarity(species_num)
			+ '<br>Price: ' + shop_fish[idx].price + getImgStr('shell-gold.png','icon-sm')
			+ '<br>Level: ' + shop_fish[idx].level
			+ '<br>Name: ' + shop_fish[idx].name
			+ '<br>Gold Shell Rate: ' + getGoldShellRate(species_num,shop_fish[idx].level) + getImgStr('shell-gold.png','icon-sm')
			+ '</div>'
		);
	}
}

function addRandShopFish(num=1) {
	for(let i=0; i<num; i++) {
		let species_num = randSpeciesNum();
		let level = random(1,5); // change? according to player level?
		shop_fish.push({species_num: species_num, level: level, price: getPrice(species_num, level), name: randName(species_num)});
	}
}

// gets svg data of shop fish at given index
function getShopFishSVG(idx) {
	let info = getSpeciesInfo(shop_fish[idx].species_num);
	return getSVGData(getPersonalFishImg(info.size, false, info.color1, info.color2, info.color2, info.color1, 0) );
}

function getPrice(species_num, level) {
	let size = getSize(species_num);
	let rarity = getRarity(species_num);
	let multiplier = {'small': 1, 'medium': 2, 'big': 4}[size] * {'common': 1, 'uncommon': 5}[rarity] * (0.8+0.2*level);
	return Math.round(multiplier * SHOP_BASE_COST);
}

function purcahsePersonalFish(elm, idx) {
	if(shop_fish[idx]==undefined) { // happens when they click the same fish twice quickly
		return;
	}
	if(num_gold_shell < shop_fish[idx].price) { // check cost
		showAlert('Not enough gold shells', 'Not enough gold shells for that item.');
		return;
	}
	if(!hasSpacePersonal() ) { // check space
		showAlert('Not enough tank space', 'Not enough space in your tank to add fish.');
		return;
	}

	// ----------------

	// pay cost
	num_gold_shell -= shop_fish[idx].price;
	// add to personal fish
	addPersonalFish(shop_fish[idx].species_num, shop_fish[idx].name, shop_fish[idx].level);
	// remove from shop
	shop_fish[idx] = undefined;
	// replace shop fish
	addRandShopFish(1);
	// display shop purchase, then callback to update shop display for new fish
	elm.fadeOut('slow', updateShopDisplay); 
}

function newTank() {
	if(num_gold_shell < NEW_TANK_COST) { // check cost
		showAlert('Not enough gold shells', 'Not enough gold shells for a new tank.');
		return;
	}
	
	num_gold_shell -= NEW_TANK_COST; // pay cost
	tank_counts.push(0); // add new tank
	$('#dot-'+ (tank_counts.length-1) ).removeClass('hidden'); // unhide circle for tank

	if(tank_counts.length == MAX_NUM_TANKS) { // hide btn if at max tanks
		$('#new-tank-btn').addClass('hidden');
	}
	$('#personal-shop-modal').modal('hide'); // hide shop modal to see new tank
}

function testDisplayAllColors() {
	shop_fish=[];
	for(let i=0; i<125; i++) {
		shop_fish.push({species_num: i, level:0, price:0, name:'test'});
	}
	updateShopDisplay();
}