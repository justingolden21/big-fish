/*Data stored:
coins, food, aquariums, 
farms, small, medium, and large hatcheries, aquarium factories, banks
number of small, medium, big fish
stats, achievements
*/

// note: unlocks check stats and current fish and will be unlocked during the next tick anyway
// white it's true that some unlocks sould have once met a condition that they no longer meet, the user will simply have to meet that condition again

// note: if wondering why loadCookies() grants extra coins, it's because it doesn't remember if the fish are hungry, and they produce before they eat

let savingCookies = false;

function loadCookies() {
	console.log('loading cookies');

	num_coin = parseInt(Cookies.get('num_coin') || num_coin);
	num_food = parseInt(Cookies.get('num_food') || num_food);
	num_aquarium = parseInt(Cookies.get('num_aquarium') || num_aquarium);

	num_farm = parseInt(Cookies.get('num_farm') || num_farm);
	num_small_hatchery = parseInt(Cookies.get('num_small_hatchery') || num_small_hatchery);
	num_medium_hatchery = parseInt(Cookies.get('num_medium_hatchery') || num_medium_hatchery);
	num_big_hatchery = parseInt(Cookies.get('num_big_hatchery') || num_big_hatchery);
	num_penguin_hatchery = parseInt(Cookies.get('num_penguin_hatchery') || num_penguin_hatchery);
	num_aquarium_factory = parseInt(Cookies.get('num_aquarium_factory') || num_aquarium_factory);
	num_bank = parseInt(Cookies.get('num_bank') || num_bank);
	num_snow_bank = parseInt(Cookies.get('num_snow_bank') || num_snow_bank);
	num_snowflake = parseInt(Cookies.get('num_snowflake') || num_snowflake);

	let num_small_fish = parseInt(Cookies.get('num_small_fish') || small_fish.length);
	small_fish = [];
	addFish(SMALL, num_small_fish);
	let num_medium_fish = parseInt(Cookies.get('num_medium_fish') || medium_fish.length);
	medium_fish = [];
	addFish(MEDIUM, num_medium_fish);
	let num_big_fish = parseInt(Cookies.get('num_big_fish') || big_fish.length);
	big_fish = [];
	addFish(BIG, num_big_fish);
	let num_penguin = parseInt(Cookies.get('num_penguin') || penguins.length);
	penguins = [];
	addPenguins(num_penguin);

	stats = Cookies.getJSON('stats') || stats;
	achievements = Cookies.getJSON('achievements') || achievements;
	for(achievementName in achievements) {
		if(achievements[achievementName][1] != -1) { // if unlocked
			checkAchievement(achievementName, true);			
		}
	}

	updateUI();

}

function setCookies() {
	if(!savingCookies) {
		return;
	}
	console.log('setting cookies');

	Cookies.set('num_coin', num_coin);
	Cookies.set('num_food', num_food);
	Cookies.set('num_aquarium', num_aquarium);

	Cookies.set('num_farm', num_farm);
	Cookies.set('num_small_hatchery', num_small_hatchery);
	Cookies.set('num_medium_hatchery', num_medium_hatchery);
	Cookies.set('num_big_hatchery', num_big_hatchery);
	Cookies.set('num_penguin_hatchery', num_penguin_hatchery);
	Cookies.set('num_aquarium_factory', num_aquarium_factory);
	Cookies.set('num_bank', num_bank);
	Cookies.set('num_snow_bank', num_snow_bank);
	Cookies.set('num_snowflake', num_snowflake);

	Cookies.set('num_small_fish', small_fish.length);
	Cookies.set('num_medium_fish', medium_fish.length);
	Cookies.set('num_big_fish', big_fish.length);
	Cookies.set('num_penguin', penguins.length);

	Cookies.set('stats', stats);
	Cookies.set('achievements', achievements);
}

function clearCookies() {
	console.log('clearing cookies');

	Cookies.remove('num_coin');
	Cookies.remove('num_food');
	Cookies.remove('num_aquarium');

	Cookies.remove('num_farm');
	Cookies.remove('num_small_hatchery');
	Cookies.remove('num_medium_hatchery');
	Cookies.remove('num_big_hatchery');
	Cookies.remove('num_penguin_hatchery');
	Cookies.remove('num_aquarium_factory');
	Cookies.remove('num_bank');
	Cookies.remove('num_snow_bank');
	Cookies.remove('num_snowflake');

	Cookies.remove('num_small_fish');
	Cookies.remove('num_medium_fish');
	Cookies.remove('num_big_fish');
	Cookies.remove('num_penguin');

	Cookies.remove('stats');
	Cookies.remove('achievements');
}
