// call getScores() on signin
// call setScores() every 5s

// make sure that we don't set scores before getting scores
let playerDataSet = false;

function getScores() {
	firebase.database().ref('users/'+user.uid).once('value').then( (snapshot)=> {
		let val = snapshot.val();
		if(val) {
			setPlayerData(val);
		}
		playerDataSet = true;
	});
}

function setScores() {
	if(!signedIn || !playerDataSet) return;

	let playerData = getPlayerData();
	// console.log(playerData);
	// playerData.user = user;

	// // remove undefined
	// let userInfo = JSON.parse( JSON.stringify({name: user.displayName, email: user.email, photoUrl: user.photoUrl}) );

	// // merge objects
	// for(let key in userInfo) {
	// 	playerData[key] = userInfo[key];
	// }

	firebase.database().ref('users/'+user.uid).update(playerData);
}

function deleteAllData() {
	let emptyData = getEmptyPlayerData();
	setPlayerData(emptyData);

	// setScores();
	firebase.database().ref('users/'+user.uid).set(emptyData);
}

function getPlayerData() {
	let player_data = {};

	player_data.num_shell = num_shell;
	player_data.num_food = num_food;
	player_data.num_aquarium = num_aquarium;

	player_data.num_farm = num_farm;
	player_data.num_small_hatchery = num_small_hatchery;
	player_data.num_medium_hatchery = num_medium_hatchery;
	player_data.num_big_hatchery = num_big_hatchery;
	player_data.num_pufferfish_hatchery = num_pufferfish_hatchery;
	player_data.num_aquarium_factory = num_aquarium_factory;
	player_data.num_bank = num_bank;
	player_data.num_star_bank = num_star_bank;
	player_data.num_star = num_star;

	player_data.num_small_fish = small_fish.length;
	player_data.num_medium_fish = medium_fish.length;
	player_data.num_big_fish = big_fish.length;
	player_data.num_pufferfish = pufferfishes.length;

	player_data.stats = stats;
	player_data.achievements = achievements;

	player_data.user = {};
	if(user.displayName)
		player_data.user.userName = user.displayName;
	if(user.email)
		player_data.user.email = user.email;
	if(user.photoUrl)
	player_data.user.photoUrl = user.photoUrl;

	return player_data;
}

function setPlayerData(player_data) {
	// console.log('player data:', player_data);
	if(!player_data) return;

	num_shell = player_data.num_shell;
	num_food = player_data.num_food;
	num_aquarium = player_data.num_aquarium;

	num_farm = player_data.num_farm;
	num_small_hatchery = player_data.num_small_hatchery;
	num_medium_hatchery = player_data.num_medium_hatchery;
	num_big_hatchery = player_data.num_big_hatchery;
	num_pufferfish_hatchery = player_data.num_pufferfish_hatchery;
	num_aquarium_factory = player_data.num_aquarium_factory;
	num_bank = player_data.num_bank;
	num_star_bank = player_data.num_star_bank;
	num_star = player_data.num_star;

	player_data.num_small_fish = small_fish.length;
	player_data.num_medium_fish = medium_fish.length;
	player_data.num_big_fish = big_fish.length;
	player_data.num_pufferfish = pufferfishes.length;

	small_fish = [];
	addFish(SMALL, player_data.num_small_fish);

	medium_fish = [];
	addFish(MEDIUM, player_data.num_medium_fish);

	big_fish = [];
	addFish(BIG, player_data.num_big_fish);

	pufferfishes = [];
	addFish(PUFF, player_data.num_pufferfish);

	stats = player_data.stats;
	achievements = player_data.achievements;
}

function getEmptyPlayerData() {
	let player_data = {};

	player_data.num_shell = 1;
	player_data.num_food = 0;
	player_data.num_aquarium = 1;

	player_data.num_farm = 0;
	player_data.num_small_hatchery = 0;
	player_data.num_medium_hatchery = 0;
	player_data.num_big_hatchery = 0;
	player_data.num_pufferfish_hatchery = 0;
	player_data.num_aquarium_factory = 0;
	player_data.num_bank = 0;
	player_data.num_star_bank = 0;
	player_data.num_star = 1;

	player_data.num_small_fish = 1;
	player_data.num_medium_fish = 0;
	player_data.num_big_fish = 0;
	player_data.num_pufferfish = 0;

	player_data.stats = getEmptyStats();

	player_data.achievements = achievements;
	for(key in player_data.achievements) {
		player_data.achievements[key][1] = -1;
	}

	return player_data;
}