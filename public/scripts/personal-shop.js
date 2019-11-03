let num_gold_shell = 0;

const SALE = 0.75;

let SHOP_BASE_COST = 20;

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
		let species_num = shop_fish[idx].species_num;
		let info = getSpeciesInfo(species_num);
		$('#personal-shop-div').append(
			'<div class="col-lg-4 col-md-6 fish-display-section">'
			+ '<img src="'+getSVGData(getShopFish(idx) )+'" class="fish-display">'
			+ '<br>Species ' + species_num
			+ ' &mdash; ' + getSize(species_num)
			+ ' &mdash; ' + getRarity(species_num)
			+ '<br>Price: ' + shop_fish[idx].price
			+ '<br>Level: ' + shop_fish[idx].level
			+ '</div>'
		);		
	}

}

function addRandShopFish(num=1) {
	for(let i=0; i<num; i++) {
		let species_num = randSpeciesNum();
		let level = random(1,3);
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

	let multiplier = {'small': 1, 'medium': 2, 'big': 4}[size] * {'common': 1, 'uncommon': 5}[rarity] * level;
	return Math.round(multiplier * SHOP_BASE_COST);
}