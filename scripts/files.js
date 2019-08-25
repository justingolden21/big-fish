//https://stackoverflow.com/questions/19038919/is-it-possible-to-upload-a-text-file-to-input-in-html-js?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

// TODO: encode data so can't be easily messed with

function processFile(e) {
	let file = e.target.result, results;
	if(file && file.length) {
		results = file.split('\r\n');
		//todo: error handling
		num_shell = parseInt(results[0]);
		num_food = parseInt(results[1]);
		num_aquarium = parseInt(results[2]);

		num_farm = parseInt(results[3]);
		num_small_hatchery = parseInt(results[4]);
		num_medium_hatchery = parseInt(results[5]);
		num_big_hatchery = parseInt(results[6]);
		num_aquarium_factory = parseInt(results[7]);
		num_bank = parseInt(results[8]);

		let num_small_fish = parseInt(results[9]);
		small_fish = [];
		addFish(SMALL, num_small_fish);
		let num_medium_fish = parseInt(results[10]);
		medium_fish = [];
		addFish(MEDIUM, num_medium_fish);
		let num_big_fish = parseInt(results[11]);
		big_fish = [];
		addFish(BIG, num_big_fish);

		stats = JSON.parse(results[12]);
		achievements = JSON.parse(results[13]);

		let num_pufferfish = parseInt(results[14]);
		pufferfishes = [];
		addFish(PUFF, num_pufferfish);

		num_star = parseInt(results[15]);
		num_pufferfish_hatchery = parseInt(results[16]);
		num_star_bank = parseInt(results[17]);

		console.log(results);
	}
}

function downloadData() {
	let str = '';
	str += num_shell + '\r\n';
	str += num_food + '\r\n';
	str += num_aquarium + '\r\n';

	str += num_farm + '\r\n';
	str += num_small_hatchery + '\r\n';
	str += num_medium_hatchery + '\r\n';
	str += num_big_hatchery + '\r\n';
	str += num_aquarium_factory + '\r\n';
	str += num_bank + '\r\n';

	str += small_fish.length + '\r\n';
	str += medium_fish.length + '\r\n';
	str += big_fish.length + '\r\n';

	str += JSON.stringify(stats) + '\r\n';
	str += JSON.stringify(achievements) + '\r\n';

	str += pufferfishes.length + '\r\n';
	str += num_star + '\r\n';
	str += num_pufferfish_hatchery + '\r\n';
	str += num_star_bank + '\r\n';

	downloadFile(str, 'big-fish-save-data', 'download-data-link');
}

function downloadFile(str, fileName, linkName) {
	let data = [str];
	let properties = {type: 'plain/text'};
	try {
		file = new File(data, fileName + '.txt', properties);
	}
	catch(e) {
		file = new Blob(data, properties);
	}
	document.getElementById(linkName).download = fileName + '.txt';
	document.getElementById(linkName).href = URL.createObjectURL(file);
	document.getElementById(linkName).click();
}
