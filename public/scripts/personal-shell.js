/* personal-shell.js
for all things related to gaining shells
*/

const BASE_SHELL_RATE = 2;

function getGoldShellRate(species_num, level) {
	let size = getSize(species_num);
	let rarity = getRarity(species_num);

	let multiplier = {'small': 1, 'medium': 1.5, 'big': 2}[size] * {'common': 1, 'uncommon': 2}[rarity] * level;
	return Math.round(multiplier * BASE_SHELL_RATE);
}
