let unlocks = {
	'purchase_farm': false,
	'purchase_small_hatchery': false,
	'purchase_medium_hatchery': false,
	'purchase_big_hatchery': false,
	'purchase_aquarium_factory': false,
	'purchase_bank': false,

	'sell_small_fish': false,
	'sell_medium_fish': false,
	'sell_big_fish': false,

	'medium_fish': false,
	'big_fish': false,
	'aquarium': false,
	'penguins': false,
	'penguin_hatchery': false,
	'snow_bank': false
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
	'Food Glorious Food': ['Purchase 10,000 food', -1],
	'Big Banking': ['Have 1,000 banks', -1],
	'So Long and Thanks for all the Fish': ['Sell 1,000 fish', -1],

	'Tuxedo Time': ['Unlock penguins!', -1],
	'Special Snowflake': ['Have 10 snowflakes', -1],
	'Perfection': ['Have 100 penguins', -1]
	// 'Gonna Need Swimming Lessons': ['Purchase 100 aquarium factories', -1]
	// add have 100 penguin hatcheries achievement? have 100 snow banks achievement? 'let it snow'
};

function checkUnlocks() {
	// unlocks
	if(stats['food_purchased'] >= 250)
		checkUnlock('purchase_farm', '.farm-unlock .buildings-info', 'fish food farms');
	if(stats['small_fish_purchased'] >= 250)
		checkUnlock('purchase_small_hatchery', '.small-hatchery-unlock .buildings-info', 'small fish hatcheries');
	if(stats['medium_fish_purchased'] >= 250)
		checkUnlock('purchase_medium_hatchery', '.medium-hatchery-unlock .buildings-info', 'medium fish hatcheries');
	if(stats['big_fish_purchased'] >= 250)
		checkUnlock('purchase_big_hatchery', '.big-hatchery-unlock .buildings-info', 'big fish hatcheries');
	if(stats['aquarium_purchased'] >= 25)
		checkUnlock('purchase_aquarium_factory', '.aquarium-factory-unlock .buildings-info', 'aquarium factories');
	if(num_aquarium_factory >= 5 && num_farm+num_small_hatchery+num_medium_hatchery+num_big_hatchery >= 1000)
		checkUnlock('purchase_bank' , '.bank-unlock', 'banks');
	if(big_fish.length >= 10000) {
		checkUnlock('penguins', '.penguin-unlock', 'PENGUINS');
		checkAchievement('Tuxedo Time', false);
	}

	if(small_fish.length >= 75)
		checkUnlock('sell_small_fish', '.sell-small-fish-unlock #sell-info', 'ability to sell small fish');
	if(medium_fish.length >= 75)
		checkUnlock('sell_medium_fish', '.sell-medium-fish-unlock #sell-info', 'ability to sell medium fish');
	if(big_fish.length >= 75)
		checkUnlock('sell_big_fish', '.sell-big-fish-unlock #sell-info', 'ability to sell big fish');
	if(penguins.length >= 10)
		checkUnlock('penguin_hatchery', '.penguin-hatchery-unlock', 'penguin hatcheries');
	if(num_penguin_hatchery >= 100)
		checkUnlock('snow_bank', '.snow-bank-unlock', 'snow banks');

	if(small_fish.length >= 50)
		checkUnlock('medium_fish', '.medium-fish-unlock', 'medium fish');
	if(medium_fish.length >= 50)
		checkUnlock('big_fish', '.big-fish-unlock', 'big fish');
	if(num_aquarium_space_used >= AQUARIUM_SPACE/2)
		checkUnlock('aquarium', '.aquarium-unlock',  'purchase aquarium');

	// achievements
	if(small_fish.length>1)
		checkAchievement('One Fish Two Fish', false);
	if(medium_fish.length>=1)
		checkAchievement('Fish Sticks', false);
	if(big_fish.length>=1)
		checkAchievement('Bigger Fish to Fry', false);
	if(small_fish.length+medium_fish.length+big_fish.length>=100)
		checkAchievement('Always More Fish in the Sea', false);
	if(num_small_hatchery>0||num_medium_hatchery>0||num_big_hatchery>0)
		checkAchievement('Financially Responsible', false);
	if(num_small_hatchery+num_medium_hatchery+num_big_hatchery>=100)
		checkAchievement('Something Smells Fishy', false);
	if(num_aquarium>1)
		checkAchievement('Deep Sea Diving', false);
	if(num_aquarium>100)
		checkAchievement('Sea World', false);
	if(small_fish.length==0)
		checkAchievement('Disrupt the Food Chain', false);
	if(num_coin>=100) {
		checkAchievement('Lemonade Stand', false);
		if(num_coin>=10000) {
			checkAchievement('Minimum Wage', false);
			if(num_coin>=1000000) {
				checkAchievement('Monopoly Man', false);
			}
		}
	}
	if(stats['money_from_small_fish']+stats['money_from_medium_fish']+stats['money_from_big_fish']>=100000000)
		checkAchievement('Business Man', false);
	if(stats['food_purchased']>=10000)
		checkAchievement('Food Glorious Food', false);
	if(num_bank > 1000)
		checkAchievement('Big Banking', false);
	if(stats['fish_sold'] > 1000)
		checkAchievement('So Long and Thanks for all the Fish', false);
	if(num_snowflake > 10)
		checkAchievement('Special Snowflake', false);
	if(penguins.length > 100)
		checkAchievement('Perfection', false);
}


// params: unlockName is str idx in unlock object of the unlock bool
// parts are parts to unlock (html elements)
// message is displayed message in snackbar (will say "Unlocked " before it)
function checkUnlock(unlockName, parts, message) {
	if(!unlocks[unlockName]) {
		unlocks[unlockName] = true;
		parts = parts.split(' ');
		for(let i=0; i<parts.length; i++) {
			unlock($(parts[i]) );
		}
		showSnackbar('Unlocked ' + message, 'success');

		// special cases:
		if(unlockName=='penguins') {
			changeBackgroundMusic('snow');
			$('#background-music-select').val('snow');
			showSnackbar('Note: You can always change the music back in settings', 'info');
		}
	}
}

// called when achievement is earned, even if not the first time
function checkAchievement(achievement_name, loaded_from_cookies) {
	if(achievements[achievement_name][1] == -1 || loaded_from_cookies) { // wasn't already unlocked, or loaded from cookies
		achievements[achievement_name][1] = stats['total_ticks'];
		if(!loaded_from_cookies) {
			showSnackbar('Achievement unlocked: ' + achievement_name, 'achievement');			
		}

		$('#achievements-div').append('<p><i class="fas fa-trophy"></i> <b>' + achievement_name + '</b>	: ' + achievements[achievement_name][0] + ' (' + secToStr(achievements[achievement_name][1]) + ')</p>');

		// count completed achievements
		let num_achieved = 0;
		let num_achievements = Object.keys(achievements).length;
		for(key in achievements) {
			if(achievements[key][1] != -1) {
				num_achieved++;
			}
		}
		$('#num-achieve').html(num_achieved + ' / ' + num_achievements);
		unlock($('.achievement-unlock') );
	}
}

function unlock(elm) {
	elm.css('display', 'block');
	elm.css('animation', 'fadein 1s');
}
