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
	YAY:
		new SoundEntry(null, Strings.get("YAY")),

	FISHING_FREE_WRONG_ONES:
		new SoundEntry(null, Strings.get("FISHING_FREE_WRONG_ONES")),
		
	FISHING_CATCH:
		new SoundEntry(null, Strings.get("FISHING_CATCH")),

}