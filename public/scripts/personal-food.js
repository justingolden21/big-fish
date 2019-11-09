function placeFood(evt) {
	let pos = getMousePosition(personal_canvas, evt);
	console.log(pos);
}


// https://www.geeksforgeeks.org/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
function getMousePosition(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	return {x:x, y:y};
} 