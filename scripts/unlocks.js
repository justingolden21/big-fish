let purchase_farm_unlocked = false;
let purchase_small_hatchery_unlocked = false;
let purchase_medium_hatchery_unlocked = false;
let purchase_big_hatchery_unlocked = false;

let sell_small_fish_unlocked = false;
let sell_medium_fish_unlocked = false;
let sell_big_fish_unlocked = false;

let medium_fish_unlocked = false;
let big_fish_unlocked = false;
let aquarium_unlocked = false;

function checkUnlocks() {
	if(!purchase_farm_unlocked && stats['food_purchased'] >= 250) {
		purchase_farm_unlocked = true;
		unlock($('#my-farm') );
		unlock($('#purchase-farm') );
		showSnackbar('Unlocked fish food farms', 'success');
	}
	if(!purchase_small_hatchery_unlocked && stats['small_fish_purchased'] >= 250) {
		purchase_small_hatchery_unlocked = true;
		unlock($('#my-small-hatchery') );
		unlock($('#purchase-small-hatchery') );
		showSnackbar('Unlocked small fish hatcheries', 'success');
	}
	if(!purchase_medium_hatchery_unlocked && stats['medium_fish_purchased'] >= 250) {
		purchase_medium_hatchery_unlocked = true;
		unlock($('#my-medium-hatchery') );
		unlock($('#purchase-medium-hatchery') );
		showSnackbar('Unlocked medium fish hatcheries', 'success');
	}
	if(!purchase_big_hatchery_unlocked && stats['big_fish_purchased'] >= 250) {
		purchase_big_hatchery_unlocked = true;
		unlock($('#my-big-hatchery') );
		unlock($('#purchase-big-hatchery') );
		showSnackbar('Unlocked big fish hatcheries', 'success');
	}

	if(!sell_small_fish_unlocked && small_fish.length >= 75) {
		sell_small_fish_unlocked = true;
		unlock($('#sell-small-fish') );
		// showHighlight($('#sell-small-fish') );
		showSnackbar('Unlocked ability to sell small fish', 'success');
	}
	if(!sell_medium_fish_unlocked && medium_fish.length >= 75) {
		sell_medium_fish_unlocked = true;
		unlock($('#sell-medium-fish') );
		// showHighlight($('#sell-medium-fish') );
		showSnackbar('Unlocked ability to sell medium fish', 'success');
	}
	if(!sell_big_fish_unlocked && big_fish.length >= 75) {
		sell_big_fish_unlocked = true;
		unlock($('#sell-big-fish') );
		// showHighlight($('#sell-big-fish') );
		showSnackbar('Unlocked ability to sell big fish', 'success');
	}

	if(!medium_fish_unlocked && small_fish.length >= 50) {
		medium_fish_unlocked = true;
		unlock($('#my-medium-fish') );
		unlock($('#purchase-medium-fish') );
		// showHighlight($('#my-medium-fish') );
		// showHighlight($('#purchase-medium-fish') );
		showSnackbar('Unlocked medium fish', 'success');	
	}
	if(!big_fish_unlocked && medium_fish.length >= 50) {
		big_fish_unlocked = true;
		unlock($('#my-big-fish') );
		unlock($('#purchase-big-fish') );
		// showHighlight($('#my-big-fish') );
		// showHighlight($('#purchase-big-fish') );
		showSnackbar('Unlocked big fish', 'success');
	}
	if(!aquarium_unlocked && num_aquarium_space_used >= AQUARIUM_SPACE/2) {
		aquarium_unlocked = true;
		unlock($('#my-aquarium') );
		unlock($('#purchase-aquarium') );
		unlock($('.aquarium-space') );
		// showHighlight($('#my-aquarium') );
		// showHighlight($('#purchase-aquarium') );
		showSnackbar('Unlocked purchase aquarium', 'success');
	}

}

function unlock(elm) {
	elm.css('display', 'inline');
}


