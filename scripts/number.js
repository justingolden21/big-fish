// setting for numbers
let prefixes_enabled = true;

let places = 3;

// https://officespace.zendesk.com/hc/en-us/articles/115000593531-Scientific-Notation-Large-Numbers-Guide
let num_abrev = 'K M B T Qa Qi Sx Sp Oc No Dc Ud Td Qad Qid Sxd Spd Ocd Nod Vg Uvg'.split(' ');

function getNum(num) {
	if(prefixes_enabled)
		return prettyPrintNum(num);
	return num;
}

function prettyPrintNum(num) {
	if(num<1e3)
		return num.toString();

	// index of mangnitude of number
	// magnitude of 1 is thousands, 2 is millions, 3 is billions
	let num_mag = Math.floor( (numDigits(num)-1)/3);

	//max at length of abreviations, so that if above will just divide by smaller number and use that string
	num_mag = Math.min(num_mag, num_abrev.length);

	return round(num/Math.pow(10, num_mag*3), places) + ' ' + num_abrev[num_mag-1];
}
// Note: goes up to e244 Uvg in O(1) time, after that JS calls the number infinity

function round(num, places) {
	return Math.round(num * Math.pow(10,places) ) / Math.pow(10,places);
}

// https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
function numDigits(num) {
	return Math.max(Math.floor(Math.log10(Math.abs(num) ) ), 0) + 1;
}

function testPrintNums() {
	for(let i=0; i<100; i++) {
		console.log(prettyPrintNum(Math.random()*1e30) );
	}
	console.log('done');
}

// convert seconds to string of sec, min, hrs
function secToStr(sec) {
	if(sec < 60)
		return sec + 's';
	else if(sec < 3600) // 60*60
		return Math.floor(sec/60) + 'm ' + sec%60 + 's';
	return Math.floor(sec/3600) + 'h ' + Math.floor(sec/60)%60 + 'm ' + sec%60 + 's';
}
