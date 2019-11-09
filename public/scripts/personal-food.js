let personal_foods = [];
const FOOD_SIZE = 4;
const FOOD_FALL_RATE = 10;
const MAX_FOODS = 10; // switching tank can be buggy?
const FOOD_WAIT_TIME = 500;

let last_click;

function placeFood(evt) {
	if(personal_foods.length < MAX_FOODS && 
		(evt.timeStamp - last_click >= FOOD_WAIT_TIME) || last_click==undefined) {
		
		let pos = getMousePosition(personal_canvas, evt);
		personal_foods.push(pos);
		last_click = evt.timeStamp;
	}
}

function updateFoods() {
	// draw
	for(let i=0; i<personal_foods.length; i++) {
		// draw
		let pos = personal_foods[i];
		personal_ctx.beginPath();
		personal_ctx.arc(pos.x/PERSONAL_SCALE_SIZE, pos.y/PERSONAL_SCALE_SIZE, FOOD_SIZE/2, 0, 2*Math.PI);
		// personal_ctx.fillStyle = '#ea6';
		personal_ctx.fillStyle = '#f90';
		personal_ctx.fill();		

		// move
		personal_foods[i].y += FOOD_FALL_RATE;
	}

	// removing food that falls below tank boundary
	// math confusing... 
	personal_foods = personal_foods.filter( food => food.y/PERSONAL_SCALE_SIZE - PERSONAL_SPRITE_SIZE < PERSONAL_MAX_Y);


	testFoodCollision();
}

function testFoodCollision() {
	for(let i=0; i<personal_fishes.length; i++) {
		for(let j=0; j<personal_foods.length; j++) {
			let fish_rect = {x: personal_fishes[i].x, y: personal_fishes[i].y, width: PERSONAL_SPRITE_SIZE, height: PERSONAL_SPRITE_SIZE};
			let food_rect = {x: personal_foods[j].x/PERSONAL_SCALE_SIZE, y:personal_foods[j].y/PERSONAL_SCALE_SIZE, width: FOOD_SIZE, height: FOOD_SIZE};
			if(testRectCollision(fish_rect, food_rect) ) {
				if(personal_fishes[i].isHungry() ) {
					personal_fishes[i].feed();
					personal_foods[j].y = 9999; // will be destroyed next update and won't collide anymore
				}
			}
		}
	}
}

function testRectCollision(rect1, rect2) {
	return (rect1.x < rect2.x + rect2.width &&
	rect1.x + rect1.width > rect2.x &&
	rect1.y < rect2.y + rect2.height &&
	rect1.y + rect1.height > rect2.y);
}


// https://www.geeksforgeeks.org/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
function getMousePosition(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	return {x:x, y:y};
} 