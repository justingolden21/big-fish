
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

// let purchase_farm_unlocked = false;
// let purchase_small_hatchery_unlocked = false;
// let purchase_medium_hatchery_unlocked = false;
// let purchase_big_hatchery_unlocked = false;
// let purchase_aquarium_factory_unlocked = false;

// let sell_small_fish_unlocked = false;
// let sell_medium_fish_unlocked = false;
// let sell_big_fish_unlocked = false;

// let medium_fish_unlocked = false;
// let big_fish_unlocked = false;
// let aquarium_unlocked = false;

function checkUnlocks() {
	// if(!purchase_farm_unlocked && stats['food_purchased'] >= 250) {
	// 	purchase_farm_unlocked = true;
	// 	unlock($('#my-farm') );
	// 	unlock($('#purchase-farm') );
	// 	showSnackbar('Unlocked fish food farms', 'success');
	// }
	// if(!purchase_small_hatchery_unlocked && stats['small_fish_purchased'] >= 250) {
	// 	purchase_small_hatchery_unlocked = true;
	// 	unlock($('#my-small-hatchery') );
	// 	unlock($('#purchase-small-hatchery') );
	// 	showSnackbar('Unlocked small fish hatcheries', 'success');
	// }
	// if(!purchase_medium_hatchery_unlocked && stats['medium_fish_purchased'] >= 250) {
	// 	purchase_medium_hatchery_unlocked = true;
	// 	unlock($('#my-medium-hatchery') );
	// 	unlock($('#purchase-medium-hatchery') );
	// 	showSnackbar('Unlocked medium fish hatcheries', 'success');
	// }
	// if(!purchase_big_hatchery_unlocked && stats['big_fish_purchased'] >= 250) {
	// 	purchase_big_hatchery_unlocked = true;
	// 	unlock($('#my-big-hatchery') );
	// 	unlock($('#purchase-big-hatchery') );
	// 	showSnackbar('Unlocked big fish hatcheries', 'success');
	// }
	// if(!purchase_aquarium_factory_unlocked && stats['aquarium_purchased'] >= 25) {
	// 	purchase_aquarium_factory_unlocked = true;
	// 	unlock($('#my-aquarium-factory') );
	// 	unlock($('#purchase-aquarium-factory') );
	// 	showSnackbar('Unlocked aquarium factories', 'success');
	// }

	checkUnlock('purchase_farm', stats['food_purchased'] >= 250, '#my-farm #purchase-farm', 'Unlocked fish food farms');
	checkUnlock('purchase_small_hatchery', stats['small_fish_purchased'] >= 250, '#my-small-hatchery #purchase-small-hatchery', 'Unlocked small fish hatcheries');
	checkUnlock('purchase_medium_hatchery', stats['medium_fish_purchased'] >= 250, '#my-medium-hatchery #purchase-medium-hatchery', 'Unlocked medium fish hatcheries');
	checkUnlock('purchase_big_hatchery', stats['big_fish_purchased'] >= 250, '#my-big-hatchery #purchase-big-hatchery', 'Unlocked big fish hatcheries');
	checkUnlock('purchase_aquarium_factory', stats['aquarium_purchased'] >= 25, '#my-aquarium-factory #purchase-aquarium-factory', 'Unlocked aquarium factories');

	// if(!sell_small_fish_unlocked && small_fish.length >= 75) {
	// 	sell_small_fish_unlocked = true;
	// 	unlock($('#sell-small-fish') );
	// 	showSnackbar('Unlocked ability to sell small fish', 'success');
	// }
	// if(!sell_medium_fish_unlocked && medium_fish.length >= 75) {
	// 	sell_medium_fish_unlocked = true;
	// 	unlock($('#sell-medium-fish') );
	// 	showSnackbar('Unlocked ability to sell medium fish', 'success');
	// }
	// if(!sell_big_fish_unlocked && big_fish.length >= 75) {
	// 	sell_big_fish_unlocked = true;
	// 	unlock($('#sell-big-fish') );
	// 	showSnackbar('Unlocked ability to sell big fish', 'success');
	// }

	checkUnlock('sell_small_fish', small_fish.length >= 75, '#sell-small-fish', 'Unlocked ability to sell small fish');
	checkUnlock('sell_medium_fish', medium_fish.length >= 75, '#sell-medium-fish', 'Unlocked ability to sell medium fish');
	checkUnlock('sell_big_fish', big_fish.length >= 75, '#sell-big-fish', 'Unlocked ability to sell big fish');

	// if(!medium_fish_unlocked && small_fish.length >= 50) {
	// 	medium_fish_unlocked = true;
	// 	unlock($('#my-medium-fish') );
	// 	unlock($('#purchase-medium-fish') );
	// 	showSnackbar('Unlocked medium fish', 'success');	
	// }
	// if(!big_fish_unlocked && medium_fish.length >= 50) {
	// 	big_fish_unlocked = true;
	// 	unlock($('#my-big-fish') );
	// 	unlock($('#purchase-big-fish') );
	// 	showSnackbar('Unlocked big fish', 'success');
	// }

	checkUnlock('medium_fish', small_fish.length >= 50, '#my-medium-fish #purchase-medium-fish', 'Unlocked medium fish');
	checkUnlock('big_fish', medium_fish.length >= 50, '#my-big-fish #purchase-big-fish', 'Unlocked big fish');

	// if(!aquarium_unlocked && num_aquarium_space_used >= AQUARIUM_SPACE/2) {
	// 	aquarium_unlocked = true;
	// 	unlock($('#my-aquarium') );
	// 	unlock($('#purchase-aquarium') );
	// 	unlock($('.aquarium-space') );
	// 	showSnackbar('Unlocked purchase aquarium', 'success');
	// }

	checkUnlock('aquarium', num_aquarium_space_used >= AQUARIUM_SPACE/2, '#my-aquarium #purchase-aquarium .aquarium-space',  'Unlocked purchase aquarium');


}

function checkUnlock(unlockName, requirement, parts, message) {
	if(!unlocks[unlockName] && requirement) {
		unlocks[unlockName] = true;
		parts = parts.split(' ');
		for(let i=0; i<parts.length; i++) {
			unlock($(parts[i]) );
		}
		showSnackbar(message, 'success');
	}

}

function unlock(elm) {
	elm.css('display', 'inline');
	elm.css('animation', 'fadein 1s');
}


