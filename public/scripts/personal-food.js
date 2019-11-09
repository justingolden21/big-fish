let personal_foods = [];
const FOOD_SIZE = 2;
const FOOD_FALL_RATE = 10;
const MAX_FOODS = 10; // switching tank can be buggy?

function placeFood(evt) {
	if(personal_foods.length < MAX_FOODS) {
		let pos = getMousePosition(personal_canvas, evt);
		personal_foods.push(pos);
	}
}

function updateFoods() {
	// draw
	for(let i=0; i<personal_foods.length; i++) {
		// draw
		let pos = personal_foods[i];
		personal_ctx.beginPath();
		personal_ctx.arc(pos.x/PERSONAL_SCALE_SIZE, pos.y/PERSONAL_SCALE_SIZE, FOOD_SIZE, 0, 2*Math.PI);
		personal_ctx.fillStyle = '#ea6';
		personal_ctx.fill();		

		// move
		personal_foods[i].y += FOOD_FALL_RATE;
	}

	// removing food that falls below tank boundary
	// math confusing... 
	personal_foods = personal_foods.filter( food => food.y/PERSONAL_SCALE_SIZE - PERSONAL_SPRITE_SIZE < PERSONAL_MAX_Y);
}


// https://www.geeksforgeeks.org/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
function getMousePosition(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	return {x:x, y:y};
} 