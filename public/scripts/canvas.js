// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function updateCanvas() {
	// Lookup the size the browser is displaying the canvas.
	let display_width  = canvas.clientWidth;
	let display_height = canvas.clientHeight;

	// Check if the canvas is not the same size.
	if(canvas.width  != display_width ||
		canvas.height != display_height) {

		// Make the canvas the same size
		canvas.width  = display_width;
		canvas.height = display_height;
	}
}
