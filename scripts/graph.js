const GRAPH_QUEUE_SIZE = 30;

// queue
let coin_vals = [];
let coin_rate_vals = [];

// queue of max size 30
// called by ui.js
function updateCoin() {
	if(coin_vals.length >= GRAPH_QUEUE_SIZE)
		coin_vals.shift();
	coin_vals.push(num_coin);
}
let prev_num_coin = 0;
function updateCoinRate() {
	if(coin_rate_vals.length >= GRAPH_QUEUE_SIZE)
		coin_rate_vals.shift();
	coin_rate_vals.push(num_coin - prev_num_coin);
	prev_num_coin = num_coin;
}

let graph_w, graph_h, graph_width_unit;
function setupCoinGraph() {
	graph_w = coin_graph_canvas.width; // shorter names
	graph_h = coin_graph_canvas.height; // shorter names
	graph_width_unit = coin_graph_canvas.width / GRAPH_QUEUE_SIZE;
}

// graph rate "pulse" to see how rate is changing
function updateCoinGraph() {
	coin_graph_ctx.clearRect(0, 0, graph_w, graph_h);

	// y val is percentage of max
	let max_val = Math.max(...coin_vals);

	coin_graph_ctx.beginPath();
	coin_graph_ctx.moveTo(0, graph_h - (coin_vals[0]/max_val * graph_h) );

	for(let i=1; i<coin_vals.length; i++)
		coin_graph_ctx.lineTo(graph_width_unit*i, graph_h - (coin_vals[i]/max_val * graph_h) );
	coin_graph_ctx.stroke();

	// --------------------------------

	coin_rate_graph_ctx.clearRect(0, 0, graph_w, graph_h);

	// y val is percentage of max
	max_val = Math.max(...coin_rate_vals);

	coin_rate_graph_ctx.beginPath();
	coin_rate_graph_ctx.moveTo(0, graph_h - (coin_rate_vals[0]/max_val * graph_h) );

	for(let i=1; i<coin_rate_vals.length; i++)
		coin_rate_graph_ctx.lineTo(graph_width_unit*i, graph_h - (coin_rate_vals[i]/max_val * graph_h) );
	coin_rate_graph_ctx.stroke();

}

