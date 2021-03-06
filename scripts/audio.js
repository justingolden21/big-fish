const DEFAULT_BACKGROUND_VOLUME = 0.25;
const DEFAULT_EFFECT_VOLUME = 1;
const DEFAULT_QUIET_EFFECT_VOLUME = 0.25;

const BOTH = 3, BACKGROUND = 2, EFFECTS = 1, MUTED = 0;
let volume_setting = MUTED;
let volume_rate = 1;
let fish_sound_frequency = 3; // ticks per sound
let fish_sound_idx = 0;

// note: to update volume, update it in two places: here and setVolume()
let background_sound_default = new Howl({
	src: ['audio/background.mp3'],
	loop: true,
	volume: DEFAULT_BACKGROUND_VOLUME,
	rate: 1.25
});
let background_sound_snow = new Howl({
	src: ['audio/background-snow.mp3'],
	loop: true,
	volume: DEFAULT_BACKGROUND_VOLUME,
	rate: 1.25
});

let current_background_sound = background_sound_default;

let fish_lo_sound = new Howl({
	src: ['audio/fish-lo.mp3'],
	volume: DEFAULT_EFFECT_VOLUME,
	rate: 2
});
let fish_md_sound = new Howl({
	src: ['audio/fish-md.mp3'],
	volume: DEFAULT_EFFECT_VOLUME,
	rate: 2
});
let fish_hi_sound = new Howl({
	src: ['audio/fish-hi.mp3'],
	volume: DEFAULT_EFFECT_VOLUME,
	rate: 2
});
let hover_sound = new Howl({
	src: ['audio/hover.mp3'],
	volume: DEFAULT_QUIET_EFFECT_VOLUME,
	rate: 1
});
let notification_sound = new Howl({
	src: ['audio/notification.mp3'],
	volume: DEFAULT_EFFECT_VOLUME,
	rate: 1.5
});
let error_sound = new Howl({
	src: ['audio/error.mp3'],
	volume: DEFAULT_EFFECT_VOLUME,
	rate: 1.5
});
let success_sound = new Howl({
	src: ['audio/success.mp3'],
	volume: DEFAULT_EFFECT_VOLUME,
	rate: 1.5
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

// scale logarithmically for number of fish, between 5 and 2, returns int
function calcFishSoundFrequency(num_fish) {
	tmp = 5 - Math.floor(Math.log( (num_fish+20)/20)/Math.log(20) ); // log base 20 of fish/20
	return (tmp < 2 ? 2 : tmp);
}

// called by listener js on button/summary hover
function playHoverSound() { // doesn't work in chrome
	if(volume_setting==MUTED || volume_setting==BACKGROUND) return;
	hover_sound.play();
}

// called by ui.js
function playNotificationSound(type) {
	if(volume_setting==MUTED || volume_setting==BACKGROUND) return;
	if(type=='error')
		error_sound.play();
	else if(type=='success' || type=='achievement')
		success_sound.play();
	else
		notification_sound.play();
}

// called by listener.js
function changeAudioSetting(new_volume_setting) {
	if(new_volume_setting==BACKGROUND || new_volume_setting==BOTH) {
		// play if setting changed from not playing to playing
		if(volume_setting!=BACKGROUND && volume_setting!=BOTH) {
			if(!current_background_sound.playing() )
				current_background_sound.play();
		}
	} else {
		current_background_sound.pause(); // pause if setting is now off
	}
	volume_setting = new_volume_setting; // update setting
}

// called by listener.js
function setVolume(volume) {
	volume_rate = volume; // store it
	current_background_sound.volume(DEFAULT_BACKGROUND_VOLUME*volume);
	fish_hi_sound.volume(DEFAULT_EFFECT_VOLUME*volume);
	fish_md_sound.volume(DEFAULT_EFFECT_VOLUME*volume);
	fish_lo_sound.volume(DEFAULT_EFFECT_VOLUME*volume);
	hover_sound.volume(DEFAULT_QUIET_EFFECT_VOLUME*volume);
	notification_sound.volume(DEFAULT_EFFECT_VOLUME*volume);
	error_sound.volume(DEFAULT_EFFECT_VOLUME*volume);
	success_sound.volume(DEFAULT_EFFECT_VOLUME*volume);
}

function changeBackgroundMusic(name) {
	let wasPlaying = current_background_sound.playing();
	current_background_sound.pause();

	if(name=='default')
		current_background_sound = background_sound_default;
	else if(name=='snow')
		current_background_sound = background_sound_snow;

	if(wasPlaying)
		current_background_sound.play();
}

// called by game.js
function audioHandlePause(paused) {
	if(paused) {
		current_background_sound.pause();
	} else {
		if(volume_setting==BACKGROUND || volume_setting==BOTH) {
			if(!current_background_sound.playing() )
				current_background_sound.play();
		}
	}
}