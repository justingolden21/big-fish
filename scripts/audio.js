// TODO: credit sounds from planet purple, howler.js in readme, info model
// TODO: stylize checkbox, range inputs

const DEFAULT_BACKGROUND_VOLUME = 0.25;
const DEFAULT_EFFECT_VOLUME = 1;

const BOTH = 3, BACKGROUND = 2, EFFECTS = 1, MUTED = 0;
let volume_setting = MUTED;
let volume_rate = 1;
let fish_sound_frequency = 3; // ticks per sound
let fish_sound_idx = 0;

let background_sound = new Howl({
	src: ['audio/background.mp3'],
	loop: true,
	volume: DEFAULT_BACKGROUND_VOLUME,
	rate: 1.25
});

let fish_lo_sound = new Howl({
	src: ['audio/fish-lo.m4a'],
	volume: DEFAULT_EFFECT_VOLUME,
	rate: 2
});
let fish_md_sound = new Howl({
	src: ['audio/fish-md.m4a'],
	volume: DEFAULT_EFFECT_VOLUME,
	rate: 2
});
let fish_hi_sound = new Howl({
	src: ['audio/fish-hi.m4a'],
	volume: DEFAULT_EFFECT_VOLUME,
	rate: 2
});

// called by game.js tick function
function updateFishSounds() {
	if(volume_setting==MUTED || volume_setting==BACKGROUND) return;

	let num_fish = small_fish.length+medium_fish.length+big_fish.length;

	fish_sound_frequency = calcFishSoundFrequency(num_fish);
	if(++fish_sound_idx % fish_sound_frequency != 0) return; // every fish_sound_frequency ticks play sound

	// play weighted random sound depending on number of each fish
	let fish_sound_selector = random(0, num_fish);
	if(fish_sound_selector < small_fish.length) { // small
		fish_hi_sound.play();
	} else if(fish_sound_selector < small_fish.length + medium_fish.length) { // medium
		fish_md_sound.play();
	} else { // big
		fish_lo_sound.play();
	}
}

// scale logarithmically for number of fish, between 5 and 1 (very unlikely to get to 1), returns int
function calcFishSoundFrequency(num_fish) {
	tmp = 5 - Math.floor(Math.log( (num_fish+20)/20)/Math.log(20) ); // log base 20 of fish/20
	return (tmp < 1 ? 1 : tmp);
}

// called by listener.js
function changeAudioSetting(new_volume_setting) {
	if(new_volume_setting==BACKGROUND || new_volume_setting==BOTH) {
		if(volume_setting!=BACKGROUND && volume_setting!=BOTH) {
			background_sound.play(); // play if setting changed from not playing to playing
		}
	} else {
		background_sound.pause(); // pause if setting is now off
	}
	volume_setting = new_volume_setting; // update setting
}

// called by listener.js
function setVolume(volume) {
	volume_rate = volume; // store it
	background_sound.volume(DEFAULT_BACKGROUND_VOLUME*volume);
	fish_hi_sound.volume(DEFAULT_EFFECT_VOLUME*volume);
	fish_md_sound.volume(DEFAULT_EFFECT_VOLUME*volume);
	fish_lo_sound.volume(DEFAULT_EFFECT_VOLUME*volume);
}

// called by game.js
function audioHandlePause(paused) {
	if(paused) {
		background_sound.pause();
	} else {
		if(volume_setting==BACKGROUND || volume_setting==BOTH) {
			background_sound.play();
		}
	}
}