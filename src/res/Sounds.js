/**
 * @constructor
 * @param {null|string} soundFile - name of the sound file
 * @param {null|string} subtitle  - subtitle, potentially a stored string
 * @param {number=} instances     - number of times the sound can be played
 *                                  at the same time
 */
MW.SoundEntry = function(soundFile, subtitle, instances) {
	this.soundFile = soundFile;
	this.subtitle = subtitle;
	this._useSubtitle = subtitle != null;
	this.instances = instances;
	this.getSubtitle = function() { return this.subtitle; };
	this.useSubtitle = function() { return this._useSubtitle; };
};

/**
 * @enum {MW.SoundEntry}
 */
MW.Sounds = {
	CLICK:	new MW.SoundEntry("406__tictacshutup__click-1-d", null, 4),
};

MW.Sound = (function() {
	
	var sound = {};
	var stage = null;
	var subtitleLayer = null;
	var subtitles = new Array();
	var soundSources = null;
	var subtitlesOn = true;
	
	sound.setStage = function(s) {
		stage = s;
		subtitleLayer = stage._subtitleLayer;
	};
	
	function addSubtitle(text) {
		for (var i = 0; i < subtitles.length; i++) {
			subtitles[i].attrs.y -= 30; 
		}
		subtitles.push(text);
	};
	
	function removeSubtitle(text) {
		for (var i = 0; i < subtitles.length; i++) {
			if (subtitles[i] === text) {
				subtitles.splice(i, 1);
			}
		}
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
		var str = entry.getSubtitle();
		Log.notify("\"" + str + "\"", "sound");
		var mute = false;
		
		if (subtitlesOn && entry.useSubtitle()) {
			var text = new Kinetic.Text({
				x: 0,
				y: subtitleLayer.getParent().attrs.height - 50,
				text: MW.Strings.get(str),
				fontSize: 20,
				fontFamily: "Nobile",
				textFill: "white",
				textStroke: "black",
				align: "center",
				fontStyle: "bold",
				width: subtitleLayer.getParent().getWidth(),
				height: 50,
				verticalAlign: "middle",
				textStrokeWidth: 2
			});
			addSubtitle(text);
			subtitleLayer.add(text);
			stage.pleaseDrawOverlayLayer();
			setTimeout(function() {
				subtitleLayer.remove(text);
				stage.pleaseDrawOverlayLayer();
				removeSubtitle(text);
			}, 3000);
		}
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

	sound.triggerSubtitles = function () {
		if (subtitlesOn) {
			subtitlesOn = false;
			console.info("Turning off subtitles");
		} else {
			subtitlesOn = true;
			console.info("Turning on subtitles");
		}
	};

	return sound;
})();

