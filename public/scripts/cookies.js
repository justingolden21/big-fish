/*Data stored:
shells, food, aquariums, 
farms, small, medium, and large hatcheries, aquarium factories, banks
number of small, medium, big fish
stats, achievements
*/

// note: unlocks check stats and current fish and will be unlocked during the next tick anyway
// white it's true that some unlocks sould have once met a condition that they no longer meet, the user will simply have to meet that condition again

// note: if wondering why loadCookies() grants extra shells, it's because it doesn't remember if the fish are hungry, and they produce before they eat

let savingCookies = false;

function loadCookies() {
	console.log('loading cookies');

	num_shell = parseInt(Cookies.get('num_shell') || num_shell);
	num_food = parseInt(Cookies.get('num_food') || num_food);
	num_aquarium = parseInt(Cookies.get('num_aquarium') || num_aquarium);

	num_farm = parseInt(Cookies.get('num_farm') || num_farm);
	num_small_hatchery = parseInt(Cookies.get('num_small_hatchery') || num_small_hatchery);
	num_medium_hatchery = parseInt(Cookies.get('num_medium_hatchery') || num_medium_hatchery);
	num_big_hatchery = parseInt(Cookies.get('num_big_hatchery') || num_big_hatchery);
	num_pufferfish_hatchery = parseInt(Cookies.get('num_pufferfish_hatchery') || num_pufferfish_hatchery);
	num_aquarium_factory = parseInt(Cookies.get('num_aquarium_factory') || num_aquarium_factory);
	num_bank = parseInt(Cookies.get('num_bank') || num_bank);
	num_star_bank = parseInt(Cookies.get('num_star_bank') || num_star_bank);
	num_star = parseInt(Cookies.get('num_star') || num_star);

	let num_small_fish = parseInt(Cookies.get('num_small_fish') || fish[SMALL]);
	fish[SMALL] = 0;
	drawn_fish[SMALL] = [];
	addFish(SMALL, num_small_fish);

	let num_medium_fish = parseInt(Cookies.get('num_medium_fish') || fish[MEDIUM]);
	fish[MEDIUM] = 0;
	drawn_fish[MEDIUM] = [];
	addFish(MEDIUM, num_medium_fish);

	let num_big_fish = parseInt(Cookies.get('num_big_fish') || fish[BIG]);
	fish[BIG] = 0;
	drawn_fish[BIG] = [];
	addFish(BIG, num_big_fish);

	let num_pufferfish = parseInt(Cookies.get('num_pufferfish') || fish[PUFF]);
	fish[PUFF] = 0;
	drawn_fish[PUFF] = [];
	addFish(PUFF, num_pufferfish);

	// in case any new stats/achievements have been added
	// combine the objects, if overlap take from previous, store in current stats/achievements
	let prev_stats = Cookies.getJSON('stats') || stats;
	Object.assign(stats, prev_stats);
	let prev_achievements = Cookies.getJSON('achievements') || achievements;
	Object.assign(achievements, prev_stats);
	for(achievement_name in achievements) {
		if(achievements[achievement_name][1] != -1) { // if unlocked
			checkAchievement(achievement_name, true);
		}
	}

	updateUI();

}

function setCookies() {
	if(!savingCookies)
		return;

	console.log('setting cookies');

	Cookies.set('num_shell', num_shell);
	Cookies.set('num_food', num_food);
	Cookies.set('num_aquarium', num_aquarium);

	Cookies.set('num_farm', num_farm);
	Cookies.set('num_small_hatchery', num_small_hatchery);
	Cookies.set('num_medium_hatchery', num_medium_hatchery);
	Cookies.set('num_big_hatchery', num_big_hatchery);
	Cookies.set('num_pufferfish_hatchery', num_pufferfish_hatchery);
	Cookies.set('num_aquarium_factory', num_aquarium_factory);
	Cookies.set('num_bank', num_bank);
	Cookies.set('num_star_bank', num_star_bank);
	Cookies.set('num_star', num_star);

	Cookies.set('num_small_fish', fish[SMALL]);
	Cookies.set('num_medium_fish', fish[MEDIUM]);
	Cookies.set('num_big_fish', fish[BIG]);
	Cookies.set('num_pufferfish', fish[PUFF]);

	Cookies.set('stats', stats);
	Cookies.set('achievements', achievements);
}

function clearCookies() {
	console.log('clearing cookies');

	Cookies.remove('num_shell');
	Cookies.remove('num_food');
	Cookies.remove('num_aquarium');

	Cookies.remove('num_farm');
	Cookies.remove('num_small_hatchery');
	Cookies.remove('num_medium_hatchery');
	Cookies.remove('num_big_hatchery');
	Cookies.remove('num_pufferfish_hatchery');
	Cookies.remove('num_aquarium_factory');
	Cookies.remove('num_bank');
	Cookies.remove('num_star_bank');
	Cookies.remove('num_star');

	Cookies.remove('num_small_fish');
	Cookies.remove('num_medium_fish');
	Cookies.remove('num_big_fish');
	Cookies.remove('num_pufferfish');

	Cookies.remove('stats');
	Cookies.remove('achievements');
}
