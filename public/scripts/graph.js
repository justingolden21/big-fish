const GRAPH_QUEUE_SIZE = 30;

// queue
let shell_vals = [];
let shell_rate_vals = [];

// queue of max size 30
// called by ui.js
function updateShell() {
	if(shell_vals.length >= GRAPH_QUEUE_SIZE)
		shell_vals.shift();
	shell_vals.push(num_shell);
}
let prev_num_shell = 0;
function updateShellRate() {
	if(shell_rate_vals.length >= GRAPH_QUEUE_SIZE)
		shell_rate_vals.shift();
	shell_rate_vals.push(num_shell - prev_num_shell);
	prev_num_shell = num_shell;
}

let graph_w, graph_h, graph_width_unit;
function setupShellGraph() {
	graph_w = shell_graph_canvas.width; // shorter names
	graph_h = shell_graph_canvas.height; // shorter names
	graph_width_unit = shell_graph_canvas.width / GRAPH_QUEUE_SIZE;
}

// graph rate "pulse" to see how rate is changing
function updateShellGraph() {
	shell_graph_ctx.clearRect(0, 0, graph_w, graph_h);

	// y val is percentage of max
	let max_val = Math.max(...shell_vals);

	shell_graph_ctx.beginPath();
	shell_graph_ctx.moveTo(0, graph_h - (shell_vals[0]/max_val * graph_h) );

	for(let i=1; i<shell_vals.length; i++)
		shell_graph_ctx.lineTo(graph_width_unit*i, graph_h - (shell_vals[i]/max_val * graph_h) );
	shell_graph_ctx.stroke();

	// --------------------------------

	shell_rate_graph_ctx.clearRect(0, 0, graph_w, graph_h);

	// y val is percentage of max
	max_val = Math.max(...shell_rate_vals);

	shell_rate_graph_ctx.beginPath();
	shell_rate_graph_ctx.moveTo(0, graph_h - (shell_rate_vals[0]/max_val * graph_h) );

	for(let i=1; i<shell_rate_vals.length; i++)
		shell_rate_graph_ctx.lineTo(graph_width_unit*i, graph_h - (shell_rate_vals[i]/max_val * graph_h) );
	shell_rate_graph_ctx.stroke();
}
