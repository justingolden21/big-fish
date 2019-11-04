let num_gold_shell = 0;

const SALE = 0.75;

const SHOP_BASE_COST = 20;

// stored just as species numbers
let shop_fish = [];

// idea: semirandom level and random name?

$( ()=> {
	$('#personal-shop-modal').on('shown.bs.modal', updateShopDisplay);

	addRandShopFish(15);
});

function updateShopDisplay() {
	$('#personal-shop-div').html('');
	for(idx in shop_fish) {
		if(!shop_fish[idx]) continue;

		let species_num = shop_fish[idx].species_num;
		let info = getSpeciesInfo(species_num);
		$('#personal-shop-div').append(
			'<div class="col-lg-4 col-md-6 fish-display-section" onclick="purcahsePersonalFish($(this),'+idx+')">'
			+ '<img src="'+getSVGData(getShopFish(idx) )+'" class="fish-display">'
			+ '<br>Species ' + species_num
			+ ' &mdash; ' + getSize(species_num)
			+ ' &mdash; ' + getRarity(species_num)
			+ '<br>Price: ' + shop_fish[idx].price + getImgStr('shell-gold.png', 'icon-sm')
			+ '<br>Level: ' + shop_fish[idx].level
			+ '<br>Gold Shell Rate: ' + getGoldShellRate(species_num, shop_fish[idx].level) + getImgStr('shell-gold.png', 'icon-sm')
			+ '</div>'
		);
	}

}

function addRandShopFish(num=1) {
	for(let i=0; i<num; i++) {
		let species_num = randSpeciesNum();
		let level = random(1,5);
		shop_fish.push({species_num: species_num, level: level, price: getPrice(species_num, level)});
	}
}

function getShopFish(idx) {
	let info = getSpeciesInfo(shop_fish[idx].species_num);
	return getPersonalFish(info.size, false, info.color1, info.color2, info.color2, info.color1, 0);
}

function getPrice(species_num, level) {
	let size = getSize(species_num);
	let rarity = getRarity(species_num);

	let multiplier = {'small': 1, 'medium': 2, 'big': 4}[size] * {'common': 1, 'uncommon': 5}[rarity] * (0.8+0.2*level);
	return Math.round(multiplier * SHOP_BASE_COST);
}

function purcahsePersonalFish(elm, idx) {
	// check cost
	if(num_gold_shell < shop_fish[idx].price) {
		showAlert('Not enough gold shells', 'Not enough gold shells for that item.');
		return;
	}

	elm.fadeOut(); // shop display
	num_gold_shell -= shop_fish[idx].price; // pay cost

	// add to fish
	addPersonalFish(shop_fish[idx].species_num, randPosition(), randName(), shop_fish[idx].level)

	// remove from shop
	shop_fish[idx] = undefined;
}