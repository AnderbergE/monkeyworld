/**
 * @constructor
 * @param {null|string} soundFile - name of the sound file
 * @param {number=} instances     - number of times the sound can be played
 *                                  at the same time
 */
MW.SoundEntry = function(soundFile, length, instances) {
	this.soundFile = soundFile;
	this.length = length;
	this.instances = instances;
	
	this.getLength = function () {
		return this.length;
	}
};

/**
 * @enum {MW.SoundEntry}
 */
MW.Sounds = {
	CLICK: new MW.SoundEntry("effects/click", 0.26, 4),
	CORRECT: new MW.SoundEntry("effects/correct", 2.22, 4),
	LIFT: new MW.SoundEntry("effects/lift", 0.91, 4),
	INTRO: new MW.SoundEntry("effects/intro", 18.94, 1),
	BG: new MW.SoundEntry("effects/loop", 18.94, 2),
	
	BIRD_HELP_US_HOME: new MW.SoundEntry("chick/help_us_home", 4.70, 1),
	BIRD_SCREAM: new MW.SoundEntry("chick/scream", 6.19, 1),
	BIRD_THANK: new MW.SoundEntry("chick/thank_you", 2.66, 1),
	BIRD_THIS_LEVEL: new MW.SoundEntry("chick/this_level_01", 3.94, 1),
	BIRD_WRONG_HIGHER: new MW.SoundEntry("chick/wrong_higher_up", 3.60, 1),
	BIRD_WRONG_LOWER: new MW.SoundEntry("chick/wrong_lower_down", 3.97, 1),
	
	AGENT_HELLO: new MW.SoundEntry("agent/hello", 12.02, 1),
	AGENT_I_TRY: new MW.SoundEntry("agent/i_try", 3.13, 1),
	AGENT_PICK_CONFIDENCE_LOW: new MW.SoundEntry("agent/asking_correct", 1.51, 1),
	AGENT_PICK_CONFIDENCE_MEDIUM: new MW.SoundEntry("agent/asking_this_one", 0.99, 1),
	AGENT_PICK_CONFIDENCE_HIGH: new MW.SoundEntry("agent/asking_has_to_be", 1.49, 1),
	AGENT_HELPED_OK: new MW.SoundEntry("agent/ah_ok", 3.84, 1),
	AGENT_TRY_AGAIN: new MW.SoundEntry("agent/woops", 2.51, 1),
	AGENT_WRONG_HIGHER: new MW.SoundEntry("chick/wrong_higher", 4.28, 1),
	AGENT_WRONG_LOWER: new MW.SoundEntry("chick/wrong_lower", 3.79, 1),
};

MW.Sound = (function() {
	
	var sound = {};
	var stage = null;
	var soundSources = null;
	
	sound.setStage = function(s) {
		stage = s;
	};
	
	function initiateSources() {
		soundSources = new Array();

		for (var key in MW.Sounds) {
			var entry = MW.Sounds[key];
			MW.Sounds[key]._key = key;
			if (entry.soundFile != null) {
				var soundPath = null;
				if (MW.resPath !== undefined) {
					soundPath = MW.resPath + "/sound/"
				} else {
					soundPath = "../res/sound/"
				}
				var e = {
					id: key,
					src: soundPath + entry.soundFile + ".ogg|" + "../res/sound/" + entry.soundFile + ".mp3"
				};
				if (entry.instances != undefined) {
					e.data = entry.instances;
				}
				soundSources.push(e);
			}
		}
	};
	
	sound.getSources = function() {
		if (soundSources === null) initiateSources();
		return soundSources;
	};
	
	/**
	 * @param {MW.SoundEntry} entry
	 */
	sound.play = function(entry) {
		var mute = false;
		
		if (!mute && entry.soundFile != null) {
			SoundJS.play(entry._key);
		}
	};
	
	/**
	 * @param {MW.SoundEntry} entry
	 */
	sound.stop = function(entry) {
		SoundJS.stop(entry._key);
	};

	return sound;
})();

