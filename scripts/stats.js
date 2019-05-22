let stats = {
	'total_ticks': 0,
	'food_eaten': 0,
	'fish_eaten': 0,

	'food_purchased': 0,
	'small_fish_purchased': 0,
	'medium_fish_purchased': 0,
	'big_fish_purchased': 0,
	'aquarium_purchased': 0,
	'penguin_purchased': 0,
	'snowflake_gained': 0,

	'money_from_small_fish': 0,
	'money_from_medium_fish': 0,
	'money_from_big_fish': 0,

	'fish_sold': 0 
};

function updateStats() {
	$('#total-ticks').html(stats['total_ticks']);
	$('#food-eaten').html(stats['food_eaten']);
	$('#fish-eaten').html(stats['fish_eaten']);

	$('#food-purchased').html(stats['food_purchased']);
	$('#small-fish-purchased').html(stats['small_fish_purchased']);
	$('#medium-fish-purchased').html(stats['medium_fish_purchased']);
	$('#big-fish-purchased').html(stats['big_fish_purchased']);
	$('#aquarium-purchased').html(stats['aquarium_purchased']);
	
	$('#money-from-small-fish').html(stats['money_from_small_fish']);
	$('#money-from-medium-fish').html(stats['money_from_medium_fish']);
	$('#money-from-big-fish').html(stats['money_from_big_fish']);

	$('#fish-sold').html(stats['fish_sold']);

	$('#penguin-purchased').html(stats['penguin_purchased']);
	$('#snowflake-gained').html(stats['snowflake_gained']);
}