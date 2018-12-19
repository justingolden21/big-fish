let unlocks = {
	'purchase_farm': false,
	'purchase_small_hatchery': false,
	'purchase_medium_hatchery': false,
	'purchase_big_hatchery': false,
	'purchase_aquarium_factory': false,

	'sell_small_fish': false,
	'sell_medium_fish': false,
	'sell_big_fish': false,

	'medium_fish': false,
	'big_fish': false,
	'aquarium': false
};

// name, description, ticks when completed, -1 if incomplete
let achievements = {
	'One Fish Two Fish': ['Purchase your first fish', -1],
	'Fish Sticks': ['Purchase a medium fish', -1],
	'Bigger Fish to Fry': ['Purchase a big fish', -1],
	'Always More Fish in the Sea': ['Have 100 total fish', -1],
	'Financially Responsible': ['Purchase a hatchery', -1],
	'Something Smells Fishy': ['Have 100 hatcheries', -1],
	'Deep Sea Diving': ['Purchase another aquarium', -1],
	'Sea World': ['Have 100 aquariums', -1],
	'Disrupt the Food Chain': ['Run out of small fish', -1],
	'Lemonade Stand': ['Have 100 coins', -1],
	'Minimum Wage': ['Have 10,000 coins', -1],
	'Monopoly Man': ['Have 1,000,000 coins', -1],
	'Business Man': ['Make a total of over 100,000,000 coins', -1],
	'Food Glorious Food': ['Purchase 10,000 food', -1]
	// 'Gonna Need Swimming Lessons': ['Purchase 100 aquarium factories', -1]
};

function checkUnlocks() {
	// unlocks
	checkUnlock('purchase_farm', stats['food_purchased'] >= 250, '.farm-unlock #producers-info', 'fish food farms');
	checkUnlock('purchase_small_hatchery', stats['small_fish_purchased'] >= 250, '.small-hatchery-unlock #producers-info', 'small fish hatcheries');
	checkUnlock('purchase_medium_hatchery', stats['medium_fish_purchased'] >= 250, '.medium-hatchery-unlock #producers-info', 'medium fish hatcheries');
	checkUnlock('purchase_big_hatchery', stats['big_fish_purchased'] >= 250, '.big-hatchery-unlock #producers-info', 'big fish hatcheries');
	checkUnlock('purchase_aquarium_factory', stats['aquarium_purchased'] >= 25, '.aquarium-factory-unlock #producers-info', 'aquarium factories');

	checkUnlock('sell_small_fish', small_fish.length >= 75, '.sell-small-fish-unlock #sell-info', 'ability to sell small fish');
	checkUnlock('sell_medium_fish', medium_fish.length >= 75, '.sell-medium-fish-unlock #sell-info', 'ability to sell medium fish');
	checkUnlock('sell_big_fish', big_fish.length >= 75, '.sell-big-fish-unlock #sell-info', 'ability to sell big fish');

	checkUnlock('medium_fish', small_fish.length >= 50, '.medium-fish-unlock', 'medium fish');
	checkUnlock('big_fish', medium_fish.length >= 50, '.big-fish-unlock', 'big fish');
	checkUnlock('aquarium', num_aquarium_space_used >= AQUARIUM_SPACE/2, '.aquarium-unlock',  'purchase aquarium');

	// achievements
	if(small_fish.length>1)
		checkAchievement('One Fish Two Fish');
	if(medium_fish.length>=1)
		checkAchievement('Fish Sticks');
	if(big_fish.length>=1)
		checkAchievement('Bigger Fish to Fry');
	if(small_fish.length+medium_fish.length+big_fish.length>=100)
		checkAchievement('Always More Fish in the Sea');
	if(num_small_hatchery>0||num_medium_hatchery>0||num_big_hatchery>0)
		checkAchievement('Financially Responsible');
	if(num_small_hatchery+num_medium_hatchery+num_big_hatchery>=100)
		checkAchievement('Something Smells Fishy');
	if(num_aquarium>1)
		checkAchievement('Deep Sea Diving');
	if(num_aquarium>100)
		checkAchievement('Sea World');
	if(small_fish.length==0)
		checkAchievement('Disrupt the Food Chain');
	if(num_coin>=100) {
		checkAchievement('Lemonade Stand');
		if(num_coin>=10000) {
			checkAchievement('Minimum Wage');
			if(num_coin>=1000000) {
				checkAchievement('Monopoly Man');
			}
		}
	}
	if(stats['money_from_small_fish']+stats['money_from_medium_fish']+stats['money_from_big_fish']>=100000000)
		checkAchievement('Business Man');
	if(stats['food_purchased']>=10000)
		checkAchievement('Food Glorious Food');
}


// params: unlockName is str idx in unlock object of the unlock bool
// requirement is true if met, false otherwise
// parts are parts to unlock (html elements)
// message is displayed message in snackbar (will say "Unlocked " before it)
function checkUnlock(unlockName, requirement, parts, message) {
	if(!unlocks[unlockName] && requirement) {
		unlocks[unlockName] = true;
		parts = parts.split(' ');
		for(let i=0; i<parts.length; i++) {
			unlock($(parts[i]) );
		}
		showSnackbar('Unlocked ' + message, 'success');
	}
}


// checkAchievement('One Fish Two Fish');

// called when achievement is earned, even if not the first time
function checkAchievement(achievementName) {
	if(achievements[achievementName][1] == -1) {
		achievements[achievementName][1] = stats['total_ticks'];
		showSnackbar('Achievement unlocked: ' + achievementName, 'achievement');
		$('#achievements-div').append('<p><i class="fas fa-trophy"></i> <b>' + achievementName + '</b>	: ' + achievements[achievementName][0] + ' (' + achievements[achievementName][1] + 's)</p>');

		// count completed achievements
		let num_achieved = 0;
		let num_achievements = Object.keys(achievements).length;
		for(key in achievements) {
			if(achievements[key][1] != -1) {
				num_achieved++;
			}
		}
		$('#num-achieve').html(num_achieved + ' / ' + num_achievements);
	}
}

function unlock(elm) {
	elm.css('display', 'block');
	elm.css('animation', 'fadein 1s');
}
