let player_level = 1;
let player_exp = 0;

$( ()=> {
	updateLvlDisplay();
// 	setInterval(updateLvlDisplay, 5000);
});

function addExp(exp) {
	player_exp += exp;
	// updatePlayerLvl();
	updateLvlDisplay();
}

function updateLvlDisplay() {
	updatePlayerLvl();
	$('.player-level').html(player_level);

	$('.player-exp-progress').css('width', getExpPercentToNextLvl(player_exp)*100 + '%');
}

function updatePlayerLvl() {
	player_level = getPlayerLvl(player_exp);
}

function getExpPercentToNextLvl(exp) {
	let lvl = 1;
	while(exp >= getExp(lvl) ) {
		exp -= getExp(lvl);
		lvl++;
	}
	return exp/getExp(lvl);	
}

function getPlayerLvl(exp) {
	let lvl = 1;
	while(exp >= getExp(lvl) ) {
		exp -= getExp(lvl);
		lvl++;
	}
	return lvl;
}

function getExp(lvl) {
	return Math.round(Math.pow(lvl, 1.5)*20);
}