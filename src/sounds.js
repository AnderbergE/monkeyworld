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
		
	FISHING_NOT_THIS_ONE:
		new SoundEntry(null, Strings.get("FISHING_NOT_THIS_ONE")),
	
	FISHING_THERE_ARE_MORE:
		new SoundEntry(null, Strings.get("FISHING_THERE_ARE_MORE")),
		
	FISHING_ARE_YOU_SURE:
		new SoundEntry(null, Strings.get("FISHING_ARE_YOU_SURE")),
		
	FISHING_COUNT_FISH:
		new SoundEntry(null, Strings.get("FISHING_COUNT_FISH"))
}