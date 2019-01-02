// input is int

let places = 3;

// https://officespace.zendesk.com/hc/en-us/articles/115000593531-Scientific-Notation-Large-Numbers-Guide
let num_abrev = 'K M B T Qa Qi Sx Sp Oc No Dc Ud Td'.split(' ');

function prettyPrintNum(num) {
	if(num<1e3)
		return num.toString();

	// index of mangnitude of number
	// magnitude of 1 is thousands, 2 is millions, 3 is billions
	let num_mag = Math.floor( (numDigits(num)-1)/3);

	return round(num/Math.pow(10, num_mag*3), places) + num_abrev[num_mag-1];

	// console.log(num/Math.pow(10, num_mag*3) );
	// console.log(num_abrev[num_mag-1] );


/*

floor( (num-1)/3)+4

num digits: divide by 10**this
7: 6
8: 6
9: 6

10: 7
11: 7
12: 7

13: 8
14: 8
15: 8
*/
	if(num<1e6)
		return round(num/1e3, places).toString() + "K";
	if(num<1e9)
		return round(num/1e6, places).toString() + "M";
	if(num<1e12)
		return round(num/1e9, places).toString() + "B";
	if(num<1e15)
		return round(num/1e12, places).toString() + "T";
	if(num<1e18)
		return round(num/1e15, places).toString() + "Qa";
	if(num<1e21)
		return round(num/1e18, places).toString() + "Qi";
	if(num<1e24)
		return round(num/1e21, places).toString() + "Sx";
	if(num<1e27)
		return round(num/1e24, places).toString() + "Sp";
	if(num<1e30)
		return round(num/1e27, places).toString() + "Oc";
	if(num<1e33)
		return round(num/1e30, places).toString() + "No";
	if(num<1e36)
		return round(num/1e33, places).toString() + "Dc";
	if(num<1e39)
		return round(num/1e36, places).toString() + "Ud";
	if(num<1e42)
		return round(num/1e39, places).toString() + "Td";

	return round(num/1e39, places).toString() + "Td";



}

function round(num, places) {
	return Math.round(num * Math.pow(10,places) ) / Math.pow(10,places);
}

// https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
function numDigits(num) {
	return Math.max(Math.floor(Math.log10(Math.abs(num) ) ), 0) + 1;
}