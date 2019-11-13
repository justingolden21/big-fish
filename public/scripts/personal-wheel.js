/* personal-wheel.js
for generating, spinning, and adding shells from daily login wheel in personal tank
*/

let wheel_canvas, wheel_ctx;

let wheel_slices = [10,5,10,25,10,5,10,50];
let wheel_colors = 'blue red blue green blue red blue green'.split(' ');
// wheel_slices = [0,1,2,3,4,5,6,7]; // for testing

let wheel_rotation = 0;

const WHEEL_COLOR = 'yellow';
const WHEEL_FONT = '20pt Helvetica';
const WHEEL_FONT_SIZE = 20;
const WHEEL_FONT_COLOR = 'white';

const WHEEL_RADIUS = 250;
const INNER_WHEEL_RADIUS = 220;
let wheel_rotate_rate = degreesToRadians(random(20,40) );
const WHEEL_SLOWDOWN_RATE = degreesToRadians(1);
let total_wheel_rotation = 0;
let done_spinning = false;

$( ()=> {
	// tmp, toggle comment for testing and prod
	$('#personal-wheel-modal').modal('show');
	setInterval(updateWheel, 100);

	wheel_canvas = document.getElementById('personal-wheel');
	wheel_ctx = wheel_canvas.getContext('2d');
	wheel_canvas.width = 500;
	wheel_canvas.height = 500;

	wheel_ctx.textAlign = 'center';
	wheel_ctx.font = WHEEL_FONT;

});

function updateWheel() {
	wheel_ctx.clearRect(0, 0, wheel_canvas.width, wheel_canvas.height);

	// draw wheel
	wheel_ctx.beginPath();
	wheel_ctx.arc(wheel_canvas.width/2, wheel_canvas.height/2, WHEEL_RADIUS, 0, 2*Math.PI);
	wheel_ctx.fillStyle = WHEEL_COLOR;
	wheel_ctx.fill();

	for(let i=0; i<wheel_slices.length; i++) {
		// draw slices
		let start_angle = (i * 2*Math.PI/wheel_slices.length);
		let end_angle = start_angle + 2*Math.PI/wheel_slices.length;
		wheel_ctx.beginPath();
		wheel_ctx.arc(wheel_canvas.width/2, wheel_canvas.height/2, INNER_WHEEL_RADIUS, start_angle, end_angle);
		wheel_ctx.lineTo(wheel_canvas.width/2, wheel_canvas.height/2);
		wheel_ctx.fillStyle = wheel_colors[i];
		wheel_ctx.fill();		
	}

	for(let i=0; i<wheel_slices.length; i++) {
		// draw numbers
		let start_angle = (i * 2*Math.PI/wheel_slices.length); // same as above, new loop so text on top
		let half_rotation = 2*Math.PI/wheel_slices.length/2;
		wheel_ctx.fillStyle = WHEEL_FONT_COLOR;
		let pos = rotate(wheel_canvas.width/2, wheel_canvas.height/2, wheel_canvas.width/2, WHEEL_FONT_SIZE+40, start_angle-half_rotation);
		wheel_ctx.fillText(wheel_slices[i], pos.x, pos.y);	
	}

	wheel_ctx.translate(wheel_canvas.width/2, wheel_canvas.width/2);
	wheel_ctx.rotate(wheel_rotate_rate);
	wheel_ctx.translate(-wheel_canvas.width/2, -wheel_canvas.width/2);

	total_wheel_rotation += wheel_rotate_rate;
	wheel_rotate_rate -= WHEEL_SLOWDOWN_RATE;
	if(wheel_rotate_rate <= 0) {
		wheel_rotate_rate = 0;
		if(!done_spinning) {
			done_spinning = true;

			let slice_num = getSliceNum(total_wheel_rotation, wheel_slices.length);
			winWheel(wheel_slices[slice_num]);
		}
	}
}

// get shell, open modal alert that you got shells
function winWheel(num_shell) {
	showAlert('Congrats!', 'Congratulations! You won ' + num_shell
		+ ' gold shells' + getImgStr('shell-gold.png','icon-sm') );
	num_gold_shell += num_shell;
}

function getSliceNum(rad, num_slices) {
	rad %= 2*Math.PI;

	let section_size = 2*Math.PI / num_slices;

	return Math.ceil(rad/section_size);
}

// https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
// angle in radians
function rotate(cx, cy, x, y, angle) {
	let cos = Math.cos(angle),
		sin = Math.sin(angle),
		nx = (cos * (x - cx) ) + (sin * (y - cy) ) + cx,
		ny = (cos * (y - cy) ) - (sin * (x - cx) ) + cy;
	return {x: nx, y: ny};
}


function degreesToRadians(deg) {
	return deg * Math.PI / 180;
}

