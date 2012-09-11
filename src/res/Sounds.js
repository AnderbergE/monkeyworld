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
	YAY:                             new MW.SoundEntry("19446__totya__yeah", "YAY"),
	BIKE_HORN:                       new MW.SoundEntry("27882__stickinthemud__bike-horn-double-toot", null),
	TADA:                            new MW.SoundEntry("60443__jobro__tada1", null),
	CLICK:                           new MW.SoundEntry("406__tictacshutup__click-1-d", null, 4),
	NO_MY_TURN:                      new MW.SoundEntry(null, "NO_MY_TURN"),
	CHOOSE_YOUR_FRIEND:              new MW.SoundEntry(null, "CHOOSE_YOUR_FRIEND"),
	THANKS_FOR_CHOOSING_ME:          new MW.SoundEntry(null, "THANKS_FOR_CHOOSING_ME"),
	BUT_YOU_CAN_INTERRUPT:           new MW.SoundEntry(null, "BUT_YOU_CAN_INTERRUPT"),
	IM_GOING_TO_PICK_THIS_ONE:       new MW.SoundEntry(null, "IM_GOING_TO_PICK_THIS_ONE"),
	YES_I_THINK_THAT_ONE_IS_BETTER:  new MW.SoundEntry(null, "YES_I_THINK_THAT_ONE_IS_BETTER"),
	MAYBE_THAT_WORKS:                new MW.SoundEntry(null, "MAYBE_THAT_WORKS"),
	YAY_HELPED_ME_GET_WATER_DROP_1:  new MW.SoundEntry(null, "YAY_HELPED_ME_GET_WATER_DROP_1"),
	YAY_HELPED_ME_GET_WATER_DROP_2:  new MW.SoundEntry(null, "YAY_HELPED_ME_GET_WATER_DROP_2"),
	YAY_HELPED_ME_GET_WATER:         new MW.SoundEntry(null, "YAY_HELPED_ME_GET_WATER"),
	LETS_FILL_THE_BUCKET:            new MW.SoundEntry(null, "LETS_FILL_THE_BUCKET"),
	WHICH_ONE_DO_YOU_THINK_IT_IS:    new MW.SoundEntry(null, "WHICH_ONE_DO_YOU_THINK_IT_IS"),
	MONKEY_HMM:                      new MW.SoundEntry(null, "MONKEY_HMM"),
	DRIP:                            new MW.SoundEntry("25879__acclivity__drip1", null),

	INTRO_1:                         new MW.SoundEntry(null, "INTRO_1"),
	INTRO_2:                         new MW.SoundEntry(null, "INTRO_2"),
	INTRO_3:                         new MW.SoundEntry(null, "INTRO_3"),
	INTRO_4:                         new MW.SoundEntry(null, "INTRO_4"),
	INTRO_5:                         new MW.SoundEntry(null, "INTRO_5"),
	INTRO_GARDEN_1:                  new MW.SoundEntry(null, "INTRO_GARDEN_1"),
	INTRO_GARDEN_2:                  new MW.SoundEntry(null, "INTRO_GARDEN_2"),

	SYSTEM_FIRST_YOU_PLAY:           new MW.SoundEntry(null, "SYSTEM_FIRST_YOU_PLAY"),
	SYSTEM_WELL_DONE:                new MW.SoundEntry(null, "SYSTEM_WELL_DONE"),
	SYSTEM_TIME_TO_TEACH_FRIEND:     new MW.SoundEntry(null, "SYSTEM_TIME_TO_TEACH_FRIEND"),
	
	AGENT_BUCKET_IS_FULL:            new MW.SoundEntry(null, "AGENT_BUCKET_IS_FULL"),
	AGENT_NEED_MORE_WATER:           new MW.SoundEntry(null, "AGENT_NEED_MORE_WATER"),
	AGENT_LETS_KEEP_PLAYING:         new MW.SoundEntry(null, "AGENT_LETS_KEEP_PLAYING"),

	LADDER_LOOKS_FUN:                new MW.SoundEntry(null, "LADDER_LOOKS_FUN"),
	LADDER_SHOW_ME:                  new MW.SoundEntry(null, "LADDER_SHOW_ME"),
	LADDER_MY_TURN:                  new MW.SoundEntry(null, "LADDER_MY_TURN"),
	LADDER_IS_IT_RIGHT:              new MW.SoundEntry(null, "LADDER_IS_IT_RIGHT"),
	LADDER_IT_WAS_RIGHT:             new MW.SoundEntry(null, "LADDER_IT_WAS_RIGHT"),
	LADDER_PLEASE_HELP_ME:           new MW.SoundEntry(null, "LADDER_PLEASE_HELP_ME"),
	LADDER_AGENT_HELP_IN_INTERRUPT:  new MW.SoundEntry(null, "LADDER_AGENT_HELP_IN_INTERRUPT"),
	
	LADDER_TREE_OOPS_TOO_HIGH:            new MW.SoundEntry(null, "LADDER_TREE_OOPS_TOO_HIGH"),
	LADDER_TREE_OOPS_TOO_LOW:             new MW.SoundEntry(null, "LADDER_TREE_OOPS_TOO_LOW"),
	LADDER_TREE_TRY_A_SMALLER_NUMBER:     new MW.SoundEntry(null, "LADDER_TREE_TRY_A_SMALLER_NUMBER"),
	LADDER_TREE_TRY_A_BIGGER_NUMBER:      new MW.SoundEntry(null, "LADDER_TREE_TRY_A_BIGGER_NUMBER"),
	LADDER_TREE_AGENT_SUGGEST_SOLUTION_1: new MW.SoundEntry(null, "LADDER_TREE_AGENT_SUGGEST_SOLUTION_1"),
	LADDER_TREE_AGENT_SUGGEST_SOLUTION_2: new MW.SoundEntry(null, "LADDER_TREE_AGENT_SUGGEST_SOLUTION_2"),
	LADDER_TREE_BETTER_BECAUSE_BIGGER:   new MW.SoundEntry(null, "LADDER_TREE_BETTER_BECAUSE_BIGGER"),
	LADDER_TREE_BETTER_BECAUSE_SMALLER:    new MW.SoundEntry(null, "LADDER_TREE_BETTER_BECAUSE_SMALLER"),
	LADDER_TREE_AGENT_PLAY_TOO_LOW:         new MW.SoundEntry(null, "LADDER_TREE_AGENT_PLAY_TOO_LOW"),
	LADDER_TREE_AGENT_PLAY_TOO_HIGH:   new MW.SoundEntry(null, "LADDER_TREE_AGENT_PLAY_TOO_HIGH"),
	LADDER_TREE_AGENT_SEE_CORRECT:        new MW.SoundEntry(null, "LADDER_TREE_AGENT_SEE_CORRECT"),
	LADDER_TREE_TONGUE:                    new MW.SoundEntry("34208__acclivity__tongueclick1", null),
	
	LADDER_MOUNTAIN_IM_DOWN_HERE:    new MW.SoundEntry(null, "LADDER_MOUNTAIN_IM_DOWN_HERE"),
	LADDER_MOUNTAIN_IM_UP_HERE:      new MW.SoundEntry(null, "LADDER_MOUNTAIN_IM_UP_HERE"),
	LADDER_MOUNTAIN_TRY_FEWER_BALLOONS: new MW.SoundEntry(null, "LADDER_MOUNTAIN_TRY_FEWER_BALLOONS"),
	LADDER_MOUNTAIN_TRY_MORE_BALLOONS: new MW.SoundEntry(null, "LADDER_MOUNTAIN_TRY_MORE_BALLOONS"),
	LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_1: new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_1"),
	LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_2: new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_2"),
	LADDER_MOUNTAIN_BETTER_BECAUSE_BIGGER: new MW.SoundEntry(null, "LADDER_MOUNTAIN_BETTER_BECAUSE_BIGGER"),
	LADDER_MOUNTAIN_BETTER_BECAUSE_SMALLER: new MW.SoundEntry(null, "LADDER_MOUNTAIN_BETTER_BECAUSE_SMALLER"),
	LADDER_MOUNTAIN_AGENT_PLAY_TOO_LOW: new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_PLAY_TOO_LOW"),
	LADDER_MOUNTAIN_AGENT_PLAY_TOO_HIGH: new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_PLAY_TOO_HIGH"),
	LADDER_MOUNTAIN_AGENT_SEE_CORRECT:        new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_SEE_CORRECT"),
	
	LADDER_MOUNTAIN_YOU_SAVED_ME:    new MW.SoundEntry(null, "LADDER_MOUNTAIN_YOU_SAVED_ME"),
	LADDER_MOUNTAIN_IM_HUNGRY:       new MW.SoundEntry(null, "LADDER_MOUNTAIN_IM_HUNGRY"),

	"NUMBER_1":                      new MW.SoundEntry(null, "NUMBER_1"),
	"NUMBER_2":                      new MW.SoundEntry(null, "NUMBER_2"),
	"NUMBER_3":                      new MW.SoundEntry(null, "NUMBER_3"),
	"NUMBER_4":                      new MW.SoundEntry(null, "NUMBER_4"),
	"NUMBER_5":                      new MW.SoundEntry(null, "NUMBER_5"),
	"NUMBER_6":                      new MW.SoundEntry(null, "NUMBER_6"),
	"NUMBER_7":                      new MW.SoundEntry(null, "NUMBER_7"),
	"NUMBER_8":                      new MW.SoundEntry(null, "NUMBER_8"),
	"NUMBER_9":                      new MW.SoundEntry(null, "NUMBER_9"),
	"NUMBER_10":                     new MW.SoundEntry(null, "NUMBER_10")
};

MW.Sound = (function() {
	
	var sound = {};
	var stage = null;
	var subtitleLayer = null;
	var subtitles = new Array();
	var soundSources = null;
	var subtitlesOn = true;
	
	sound.setStage = function(s) { stage = s; subtitleLayer = stage._subtitleLayer; };
	
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

