// input is int

let places = 3;

function prettyPrintNum(num) {
	if(num<1e6)
		return num.toLocaleString(); //adds commas

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

// https://officespace.zendesk.com/hc/en-us/articles/115000593531-Scientific-Notation-Large-Numbers-Guide

}

function round(num, places) {
	return Math.round(num * Math.pow(10,places) ) / Math.pow(10,places);
}
