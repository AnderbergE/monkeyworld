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
	YAY:
		new SoundEntry("19446__totya__yeah.wav", Strings.get("YAY")),
	
	ARE_YOU_READY_TO_TEACH:
		new SoundEntry(null, Strings.get("ARE_YOU_READY_TO_TEACH")),
		
	GET_BANANA:
		new SoundEntry("60443__jobro__tada1.wav", null, 2),

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
		new SoundEntry("34968__mike-campbell__f-s-1-fishing-reel.wav", null), 

	FISHING_SPLASH:
		new SoundEntry("water_movement_fast_002.wav", null),

	FISHING_SWOSH:
		new SoundEntry("60009__qubodup__swosh-22.wav", null),
		
	FISHING_ANGEL_CHOOSE_FISH:
		new SoundEntry(null, Strings.get("FISHING_ANGEL_CHOOSE_FISH")),
		
	FISHING_ANGEL_COUNT:
		new SoundEntry(null, Strings.get("FISHING_ANGEL_COUNT")),
	
	MONKEY_LEARNED_WELL:
		new SoundEntry(null, Strings.get("MONKEY_LEARNED_WELL")),
		
	MONKEY_DIDNT_LEARN_WELL:
		new SoundEntry(null, Strings.get("MONKEY_DIDNT_LEARN_WELL")),
		
	LETS_SHOW_HIM_AGAIN:
		new SoundEntry(null, Strings.get("LETS_SHOW_HIM_AGAIN")),
	
	THANK_YOU_FOR_HELPING:
		new SoundEntry(null, Strings.get("THANK_YOU_FOR_HELPING")),
		
	NOW_MONKEY_SHOW_YOU:
		new SoundEntry(null, Strings.get("NOW_MONKEY_SHOW_YOU")),
		
	MONKEY_HMM:
		new SoundEntry(null, Strings.get("MONKEY_HMM")),
		
	MAGIC_CHIMES:
		new SoundEntry("51710__bristolstories__u-chimes3_short.wav", null),
	
	"NUMBER_1":
		new SoundEntry(null, Strings.get("NUMBER_1")),
	
	"NUMBER_2":
		new SoundEntry(null, Strings.get("NUMBER_2")),

	"NUMBER_3":
		new SoundEntry(null, Strings.get("NUMBER_3")),
				
	"NUMBER_4":
		new SoundEntry(null, Strings.get("NUMBER_4")),

	"NUMBER_5":
		new SoundEntry(null, Strings.get("NUMBER_5")),
						
	"NUMBER_6":
		new SoundEntry(null, Strings.get("NUMBER_6")),
	
	"NUMBER_7":
		new SoundEntry(null, Strings.get("NUMBER_7")),
	
	"NUMBER_8":
		new SoundEntry(null, Strings.get("NUMBER_8")),
		
	"NUMBER_9":
		new SoundEntry(null, Strings.get("NUMBER_9")),
		
	"NUMBER_10":
		new SoundEntry(null, Strings.get("NUMBER_10"))
}

var soundSources = new Array();

for (var key in Sounds) {
	var entry = Sounds[key];
	Sounds[key]._key = key;
	if (entry.soundFile != null) {
		var e = {
			name: key,
			src: "../res/sound/" + entry.soundFile 
		}
		if (entry.instances != undefined) {
			e.instances = entry.instances;
		}
		soundSources.push(e);
	}
}
