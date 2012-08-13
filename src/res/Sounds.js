/**
 * @constructor
 * @param {null|string} soundFile
 * @param {null|string} subtitle
 * @param {number=} instances
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
	LETS_FILL_THE_BUCKET:            new MW.SoundEntry(null, "LETS_FILL_THE_BUCKET"),
	WHICH_ONE_DO_YOU_THINK_IT_IS:    new MW.SoundEntry(null, "WHICH_ONE_DO_YOU_THINK_IT_IS"),
	MONKEY_HMM:                      new MW.SoundEntry(null, "MONKEY_HMM"),
	MAGIC_CHIMES:                    new MW.SoundEntry("51710__bristolstories__u-chimes3_short", null),

	INTRO_1:                         new MW.SoundEntry(null, "INTRO_1"),
	INTRO_2:                         new MW.SoundEntry(null, "INTRO_2"),
	INTRO_3:                         new MW.SoundEntry(null, "INTRO_3"),
	INTRO_4:                         new MW.SoundEntry(null, "INTRO_4"),
	INTRO_5:                         new MW.SoundEntry(null, "INTRO_5"),
	INTRO_GARDEN_1:                  new MW.SoundEntry(null, "INTRO_GARDEN_1"),
	INTRO_GARDEN_2:                  new MW.SoundEntry(null, "INTRO_GARDEN_2"),

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
		
	,ARE_YOU_READY_TO_TEACH:
		new MW.SoundEntry(null, "ARE_YOU_READY_TO_TEACH"),

	GET_BANANA:
		new MW.SoundEntry(null/*"60443__jobro__tada1"*/, null, 2),

	FISHING_FREE_WRONG_ONES:
		new MW.SoundEntry(null, "FISHING_FREE_WRONG_ONES"),
		
	FISHING_CATCH:
		new MW.SoundEntry(null, "FISHING_CATCH"),
		
	FISHING_NOT_THIS_ONE:
		new MW.SoundEntry(null, "FISHING_NOT_THIS_ONE"),
	
	FISHING_THERE_ARE_MORE:
		new MW.SoundEntry(null, "FISHING_THERE_ARE_MORE"),
		
	FISHING_KEEP_GOING:
		new MW.SoundEntry(null, "FISHING_KEEP_GOING"),
		
	FISHING_ARE_YOU_SURE:
		new MW.SoundEntry(null, "FISHING_ARE_YOU_SURE"),
		
	FISHING_COUNT_FISH:
		new MW.SoundEntry(null, "FISHING_COUNT_FISH"),

	FISHING_COUNT_TARGET_FISH:
		new MW.SoundEntry(null, "FISHING_COUNT_TARGET_FISH"),
		
	FISHING_WINDING:
		new MW.SoundEntry(/*"34968__mike-campbell__f-s-1-fishing-reel"*/null, null), 

	FISHING_SPLASH:
		new MW.SoundEntry(/*"water_movement_fast_002"*/null, null),

	FISHING_SWOSH:
		new MW.SoundEntry(/*"60009__qubodup__swosh-22"*/ null, null),
		
	FISHING_ANGEL_CHOOSE_FISH:
		new MW.SoundEntry(null, "FISHING_ANGEL_CHOOSE_FISH"),
		
	FISHING_ANGEL_COUNT:
		new MW.SoundEntry(null, "FISHING_ANGEL_COUNT"),
	
	BUBBA_HI:
		new MW.SoundEntry(null, "BUBBA_HI"),
		
	BUBBA_HERE_TO_HELP:
		new MW.SoundEntry(null, "BUBBA_HERE_TO_HELP"),
		
	MONKEY_LEARNED_WELL:
		new MW.SoundEntry(null, "MONKEY_LEARNED_WELL"),
		
	MONKEY_DIDNT_LEARN_WELL:
		new MW.SoundEntry(null, "MONKEY_DIDNT_LEARN_WELL"),
		
	LETS_SHOW_HIM_AGAIN:
		new MW.SoundEntry(null, "LETS_SHOW_HIM_AGAIN"),
	
	THANK_YOU_FOR_HELPING:
		new MW.SoundEntry(null, "THANK_YOU_FOR_HELPING"),
		
	NOW_MONKEY_SHOW_YOU:
		new MW.SoundEntry(null, "NOW_MONKEY_SHOW_YOU")
};

MW.Sound = (function() {
	
	var sound = {};
	var stage = null;
	var subtitleLayer = null;
	var subtitles = new Array();
	var soundSources = null;
	
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
				var e = {
					id: key,
					src: "../res/sound/" + entry.soundFile + ".ogg|" + "../res/sound/" + entry.soundFile + ".mp3"
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
		
		if (entry.useSubtitle()) {
			var text = new Kinetic.Text({
				x: subtitleLayer.getParent().attrs.width / 2,
				y: subtitleLayer.getParent().attrs.height - 50,
				text: MW.Strings.get(str),
				fontSize: 26,
				fontFamily: "Nobile",
				textFill: "white",
				fill: "black",
				stroke: "black",
				strokeWidth: 15,
				textStroke: "black",
				align: "center",
				verticalAlign: "middle",
				textStrokeWidth: 1
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
	
	return sound;
})();
//var Sound = new _Sound();
