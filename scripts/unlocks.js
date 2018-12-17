let sell_small_fish_unlocked = false;
let sell_medium_fish_unlocked = false;
let sell_big_fish_unlocked = false;
function checkUnlocks() {
	if(!sell_small_fish_unlocked && small_fish.length > 50) {
		sell_small_fish_unlocked = true;
		unlock($('#sell-small-fish') );
		showHighlight($('#sell-small-fish') );
		showSnackbar('Unlocked ability to sell small fish', 'success');
	}
	if(!sell_medium_fish_unlocked && medium_fish.length > 50) {
		sell_medium_fish_unlocked = true;
		unlock($('#sell-medium-fish') );
		showHighlight($('#sell-medium-fish') );
		showSnackbar('Unlocked ability to sell medium fish', 'success');
	}
	if(!sell_big_fish_unlocked && big_fish.length > 50) {
		sell_big_fish_unlocked = true;
		unlock($('#sell-big-fish') );
		showHighlight($('#sell-big-fish') );
		showSnackbar('Unlocked ability to sell big fish', 'success');
	}
}

function unlock(elm) {
	elm.css('display', 'inline');
}
