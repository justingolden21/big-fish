$( ()=> {
	// testing
	setTimeout( ()=> $('#help-modal').modal('hide'), 500);
	$('#personal-modal').modal('show');

	let size = 20, max = 300;
	let x = 0, y = 0;
	for(idx in FISH_SIZES) {
		for(color in FISH_COLORS) {
			for(color2 in FISH_COLORS) {
				drawFishToCanvas(FISH_SIZES[idx], 'right', color, color2, color2, color, x, y, size, size);
				x += size;
				if(x>max) {
					x=0;
					y += size;
				}
			}
		}
	}

});

const FISH_SIZES = 'small medium-1 medium-2 big-1 big-2'.split(' ');

const FISH_COLORS = {
	'pink': {
		'fin': '#c985d0',
		'front': '#d890e0',
		'back': '#e599ee',
		'eye': '#af75b6',
	},
	'blue': {
		'fin': '#2f8ac6',
		'front': '#37a5ee',
		'back': '#3498db',
		'eye': '#2c84bf',
	},
	'orange': {
		'fin': '#fcb245',
		'front': '#ec8d00',
		'back': '#ff9900',
		'eye': '#cd7b00',
	},
	'green': {
		'fin': '#2cc66d',
		'front': '#25a65b',
		'back': '#27ae60',
		'eye': '#1d8548',
	},
	'red': {
		'fin': '#bf3d31',
		'front': '#f5503f',
		'back': '#e74c3c',
		'eye': '#bf3d31',
	}
};

// size is str ('small', 'medium-1', 'medium-2', 'big-1' or 'big-2')
// direction is str ('left' or 'right')
// colors are color strings, for example 'red' or '#f00'
function drawPersonalFish(elm_id, size, direction, fin_color, front_color, back_color, eye_color) {
	let tmp = $('#'+size+'-fish-right').clone().appendTo('#'+elm_id).removeClass('hidden');
	tmp.find('.fin').css('fill', FISH_COLORS[fin_color].fin);
	tmp.find('.front').css('fill', FISH_COLORS[front_color].front);
	tmp.find('.back').css('fill', FISH_COLORS[back_color].back);
	tmp.find('.eye').css('fill', FISH_COLORS[eye_color].eye);
	if(direction=='left')
		tmp.css('transform', 'scale(-1,1)');
	return tmp;
}

function drawFishToCanvas(size, direction, fin_color, front_color, back_color, eye_color, x, y, width, height) {
	let fish = getPersonalFish(size,direction,fin_color,front_color,back_color,eye_color);
	drawSVGToCanvas(fish,document.getElementById('personal-aquarium'),x,y,width,height);
}

function getPersonalFish(size, direction, fin_color, front_color, back_color, eye_color) {
	let tmp = document.getElementById(size+'-fish-right').cloneNode(true);
	tmp.classList.remove('hidden');
	
	let fins = tmp.querySelectorAll('.fin');
	for(let i=0; i<fins.length; i++)
		fins[i].style.fill = FISH_COLORS[fin_color].fin;
	tmp.querySelectorAll('.front')[0].style.fill = FISH_COLORS[front_color].front;
	tmp.querySelectorAll('.back')[0].style.fill = FISH_COLORS[back_color].back;
	tmp.querySelectorAll('.eye')[0].style.fill = FISH_COLORS[eye_color].eye;
	if(direction=='left')
		tmp.style.transform = 'scale(-1,1)';
	return tmp;
}

// http://svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/
function drawSVGToCanvas(sourceSVG, target_canvas, x, y, width, height) {
	svg_xml = (new XMLSerializer() ).serializeToString(sourceSVG);
	let ctx = target_canvas.getContext('2d');

	let img = new Image();
	img.src = "data:image/svg+xml;base64," + btoa(svg_xml);

	img.onload = function() {
		ctx.drawImage(img, x, y, width, height);
	}
}