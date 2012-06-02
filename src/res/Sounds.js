/**
 * @constructor
 * @param {null|string} soundFile
 * @param {null|string} subtitle
 * @param {number=} instances
 */
function SoundEntry(soundFile, subtitle, instances) {
	this.soundFile = soundFile;
	this.subtitle = subtitle;
	this.instances = instances;
}

/**
 * @enum {SoundEntry}
 */
var Sounds = {
		
	YAY:                             new SoundEntry("19446__totya__yeah", Strings.get("YAY")),
	BIKE_HORN:                       new SoundEntry("27882__stickinthemud__bike-horn-double-toot", null),
	TADA:                            new SoundEntry("60443__jobro__tada1", null),
	CLICK:                           new SoundEntry("406__tictacshutup__click-1-d", null, 4),
	NO_MY_TURN:                      new SoundEntry(null, Strings.get("NO_MY_TURN")),
	BUT_YOU_CAN_INTERRUPT:           new SoundEntry(null, Strings.get("BUT_YOU_CAN_INTERRUPT")),
	IM_GOING_TO_PICK_THIS_ONE:       new SoundEntry(null, Strings.get("IM_GOING_TO_PICK_THIS_ONE")),
	YES_I_THINK_THAT_ONE_IS_BETTER:  new SoundEntry(null, Strings.get("YES_I_THINK_THAT_ONE_IS_BETTER")),
	MAYBE_THAT_WORKS:                new SoundEntry(null, Strings.get("MAYBE_THAT_WORKS")),
	WHICH_ONE_DO_YOU_THINK_IT_IS:    new SoundEntry(null, Strings.get("WHICH_ONE_DO_YOU_THINK_IT_IS")),
	BETTER_BECAUSE_BIGGER:           new SoundEntry(null, Strings.get("BETTER_BECAUSE_BIGGER")),
	BETTER_BECAUSE_SMALLER:          new SoundEntry(null, Strings.get("BETTER_BECAUSE_SMALLER")),
	AGENT_PLAY_TOO_LOW:              new SoundEntry(null, Strings.get("AGENT_PLAY_TOO_LOW")),
	AGENT_PLAY_TOO_HIGH:             new SoundEntry(null, Strings.get("AGENT_PLAY_TOO_HIGH")),
	MONKEY_HMM:                      new SoundEntry(null, Strings.get("MONKEY_HMM")),
	MAGIC_CHIMES:                    new SoundEntry("51710__bristolstories__u-chimes3_short", null),
	LADDER_LOOKS_FUN:                new SoundEntry(null, Strings.get("LADDER_LOOKS_FUN")),
	LADDER_SHOW_ME:                  new SoundEntry(null, Strings.get("LADDER_SHOW_ME")),
	LADDER_MY_TURN:                  new SoundEntry(null, Strings.get("LADDER_MY_TURN")),
	LADDER_IS_IT_RIGHT:              new SoundEntry(null, Strings.get("LADDER_IS_IT_RIGHT")),
	LADDER_IT_WAS_RIGHT:             new SoundEntry(null, Strings.get("LADDER_IT_WAS_RIGHT")),
	LADDER_OOPS_TOO_HIGH:            new SoundEntry(null, Strings.get("LADDER_OOPS_TOO_HIGH")),
	LADDER_OOPS_TOO_LOW:             new SoundEntry(null, Strings.get("LADDER_OOPS_TOO_LOW")),
	LADDER_TRY_A_SMALLER_NUMBER:     new SoundEntry(null, Strings.get("LADDER_TRY_A_SMALLER_NUMBER")),
	LADDER_TRY_A_BIGGER_NUMBER:      new SoundEntry(null, Strings.get("LADDER_TRY_A_BIGGER_NUMBER")),
	LADDER_AGENT_SEE_CORRECT:        new SoundEntry(null, Strings.get("LADDER_AGENT_SEE_CORRECT")),
	LADDER_PLEASE_HELP_ME:           new SoundEntry(null, Strings.get("LADDER_PLEASE_HELP_ME")),
	LADDER_AGENT_HELP_IN_INTERRUPT:  new SoundEntry(null, Strings.get("LADDER_AGENT_HELP_IN_INTERRUPT")),
	LADDER_AGENT_SUGGEST_SOLUTION_1: new SoundEntry(null, Strings.get("LADDER_AGENT_SUGGEST_SOLUTION_1")),
	LADDER_AGENT_SUGGEST_SOLUTION_2: new SoundEntry(null, Strings.get("LADDER_AGENT_SUGGEST_SOLUTION_2")),

	"NUMBER_1":                      new SoundEntry(null, Strings.get("NUMBER_1")),
	"NUMBER_2":                      new SoundEntry(null, Strings.get("NUMBER_2")),
	"NUMBER_3":                      new SoundEntry(null, Strings.get("NUMBER_3")),
	"NUMBER_4":                      new SoundEntry(null, Strings.get("NUMBER_4")),
	"NUMBER_5":                      new SoundEntry(null, Strings.get("NUMBER_5")),
	"NUMBER_6":                      new SoundEntry(null, Strings.get("NUMBER_6")),
	"NUMBER_7":                      new SoundEntry(null, Strings.get("NUMBER_7")),
	"NUMBER_8":                      new SoundEntry(null, Strings.get("NUMBER_8")),
	"NUMBER_9":                      new SoundEntry(null, Strings.get("NUMBER_9")),
	"NUMBER_10":                     new SoundEntry(null, Strings.get("NUMBER_10"))
		
	,ARE_YOU_READY_TO_TEACH:
		new SoundEntry(null, Strings.get("ARE_YOU_READY_TO_TEACH")),

	GET_BANANA:
		new SoundEntry(null/*"60443__jobro__tada1"*/, null, 2),

	FISHING_FREE_WRONG_ONES:
		new SoundEntry(null, Strings.get("FISHING_FREE_WRONG_ONES")),
		
	FISHING_CATCH:
		new SoundEntry(null, Strings.get("FISHING_CATCH")),
		
	FISHING_NOT_THIS_ONE:
		new SoundEntry(null, Strings.get("FISHING_NOT_THIS_ONE")),
	
	FISHING_THERE_ARE_MORE:
		new SoundEntry(null, Strings.get("FISHING_THERE_ARE_MORE")),
		
	FISHING_KEEP_GOING:
		new SoundEntry(null, Strings.get("FISHING_KEEP_GOING")),
		
	FISHING_ARE_YOU_SURE:
		new SoundEntry(null, Strings.get("FISHING_ARE_YOU_SURE")),
		
	FISHING_COUNT_FISH:
		new SoundEntry(null, Strings.get("FISHING_COUNT_FISH")),

	FISHING_COUNT_TARGET_FISH:
		new SoundEntry(null, Strings.get("FISHING_COUNT_TARGET_FISH")),
		
	FISHING_WINDING:
		new SoundEntry(/*"34968__mike-campbell__f-s-1-fishing-reel"*/null, null), 

	FISHING_SPLASH:
		new SoundEntry(/*"water_movement_fast_002"*/null, null),

	FISHING_SWOSH:
		new SoundEntry(/*"60009__qubodup__swosh-22"*/ null, null),
		
	FISHING_ANGEL_CHOOSE_FISH:
		new SoundEntry(null, Strings.get("FISHING_ANGEL_CHOOSE_FISH")),
		
	FISHING_ANGEL_COUNT:
		new SoundEntry(null, Strings.get("FISHING_ANGEL_COUNT")),
	
	BUBBA_HI:
		new SoundEntry(null, Strings.get("BUBBA_HI")),
		
	BUBBA_HERE_TO_HELP:
		new SoundEntry(null, Strings.get("BUBBA_HERE_TO_HELP")),
		
	MONKEY_LEARNED_WELL:
		new SoundEntry(null, Strings.get("MONKEY_LEARNED_WELL")),
		
	MONKEY_DIDNT_LEARN_WELL:
		new SoundEntry(null, Strings.get("MONKEY_DIDNT_LEARN_WELL")),
		
	LETS_SHOW_HIM_AGAIN:
		new SoundEntry(null, Strings.get("LETS_SHOW_HIM_AGAIN")),
	
	THANK_YOU_FOR_HELPING:
		new SoundEntry(null, Strings.get("THANK_YOU_FOR_HELPING")),
		
	NOW_MONKEY_SHOW_YOU:
		new SoundEntry(null, Strings.get("NOW_MONKEY_SHOW_YOU"))
};
var soundSources = null;

function _produce_sounds() {

	soundSources = new Array();

	for (var key in Sounds) {
		var entry = Sounds[key];
		Sounds[key]._key = key;
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
}
_produce_sounds();

/**
 * @constructor
 */
function _Sound() {
	var stage = null;
	var subtitleLayer = null;
	var subtitles = new Array();
	this.setStage = function(s) { stage = s; subtitleLayer = stage._subtitleLayer; };
	
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
	
	/**
	 * @param {SoundEntry} entry
	 */
	this.play = function(entry) {
		Log.notify("\"" + entry.subtitle + "\"", "sound");
		var mute = false;
		if (!mute && entry.soundFile != null) {
			SoundJS.play(entry._key);
		}
		var str = Strings.get(entry._key);
		if (str != null)
			entry.subtitle = str;
		
		if (entry.subtitle != null) {
			var text = new Kinetic.Text({
				x: subtitleLayer.getParent().attrs.width / 2,
				y: subtitleLayer.getParent().attrs.height - 50,
				text: entry.subtitle,
				fontSize: 26,
				fontFamily: "Arial",
				textFill: "white",
				fill: "gray",
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
	};
	
	/**
	 * @param {SoundEntry} entry
	 */
	this.stop = function(entry) {
		SoundJS.stop(entry._key);
	};
}
var Sound = new _Sound();