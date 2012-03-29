/**
 * @constructor
 * @param {null|string} soundFile
 * @param {string} subtitle
 */
function SoundEntry(soundFile, subtitle) {
	this.soundFile = soundFile;
	this.subtitle = subtitle;
}

/**
 * @enum {SoundEntry}
 */
var Sounds = {
	YAY:          new SoundEntry(null, "Yay!"),
	FISHING_FREE: new SoundEntry(null, "Frige fiskarna!") 
}