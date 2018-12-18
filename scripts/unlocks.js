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

function checkUnlocks() {
	checkUnlock('purchase_farm', stats['food_purchased'] >= 250, '#my-farm #purchase-farm #producers-info', 'fish food farms');
	checkUnlock('purchase_small_hatchery', stats['small_fish_purchased'] >= 250, '#my-small-hatchery #purchase-small-hatchery #producers-info', 'small fish hatcheries');
	checkUnlock('purchase_medium_hatchery', stats['medium_fish_purchased'] >= 250, '#my-medium-hatchery #purchase-medium-hatchery #producers-info', 'medium fish hatcheries');
	checkUnlock('purchase_big_hatchery', stats['big_fish_purchased'] >= 250, '#my-big-hatchery #purchase-big-hatchery #producers-info', 'big fish hatcheries');
	checkUnlock('purchase_aquarium_factory', stats['aquarium_purchased'] >= 25, '#my-aquarium-factory #purchase-aquarium-factory #producers-info', 'aquarium factories');

	checkUnlock('sell_small_fish', small_fish.length >= 75, '#sell-small-fish #sell-info', 'ability to sell small fish');
	checkUnlock('sell_medium_fish', medium_fish.length >= 75, '#sell-medium-fish #sell-info', 'ability to sell medium fish');
	checkUnlock('sell_big_fish', big_fish.length >= 75, '#sell-big-fish #sell-info', 'ability to sell big fish');

	checkUnlock('medium_fish', small_fish.length >= 50, '#my-medium-fish #purchase-medium-fish #medium-fish-info', 'medium fish');
	checkUnlock('big_fish', medium_fish.length >= 50, '#my-big-fish #purchase-big-fish #big-fish-info', 'big fish');
	checkUnlock('aquarium', num_aquarium_space_used >= AQUARIUM_SPACE/2, '#my-aquarium #purchase-aquarium #aquarium-info .aquarium-space',  'purchase aquarium');
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

function unlock(elm) {
	elm.css('display', 'inline');
	elm.css('animation', 'fadein 1s');
}
