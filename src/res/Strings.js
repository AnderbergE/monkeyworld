/** @enum {Object} */
var Strings = {
	
	"INIT_LOADING": {
		"sv": "Laddar ner bilder och ljud...",
		"en": "Downloading images and sounds..."
	},
		
	"YAY": {
		"sv": "Hurra!",
		"en": "Yay!"
	},
	
	"ARE_YOU_READY_TO_TEACH": {
		"sv": "Är du redo att lära apan?",
		"en": "Are you ready to teach monkey?"
	},
		
	"FISHING_CATCH_NUMBER": {
		"sv": "Fånga nummer %1",
		"en": "Catch number %1"
	},
	
	"FISHING_CATCH": {
		"sv": "Fånga",
		"en": "Catch"
	},

	"FISHING_FREE_WRONG_ONES": {
		"sv": "Frige fiskarna som är fel",
		"en": "Put back the wrong fish"
	},
	
	"FISHING_NOT_THIS_ONE": {
		"sv": "Inte den!",
		"en": "Not this one!"
	},
	
	"FISHING_THERE_ARE_MORE": {
		"sv": "Det finns mer fiskar att fånga. Fortsätt leta!",
		"en": "There are more fish to catch. Keep looking!"
	},
	
	"FISHING_ARE_YOU_SURE": {
		"sv": "Är du säker?",
		"en": "Are you sure?"
	},
	
	"FISHING_COUNT_FISH": {
		"sv": "Räkna fiskarna!",
		"en": "Count the fish!"
	},
	
	"FISHING_COUNT_TARGET_FISH": {
		"sv": "Räkna fiskarna med",
		"en": "Count the fish with"
	},
	
	"FISHING_ANGEL_CHOOSE_FISH": {
		"sv": "Jag väljer den här fisken eftersom...",
		"en": "I choose this fish, because it..."
	},
	
	"FISHING_ANGEL_COUNT": {
		"sv": "Jag väljer den här siffran eftersom...",
		"en": "I choose this number, because..."
	},
	
	"MONKEY_LEARNED_WELL": {
		"sv": "Toppen! Apan lärde sig bra!",
		"en": "Great! Monkey learned well!"
	},
	
	"MONKEY_DIDNT_LEARN_WELL": {
		"sv": "Åh, nej! Apan lärde sig inte riktigt.",
		"en": "Oh no! Monkey didn't learn well."
	},
	
	"LETS_SHOW_HIM_AGAIN": {
		"sv": "Visa honom igen!",
		"en": "Let's show him again!"
	},
	
	"THANK_YOU_FOR_HELPING": {
		"sv": "Tack för att du hjälpte apan!",
		"en": "Thank you for helping monkey!"
	},
	
	"NOW_MONKEY_SHOW_YOU": {
		"sv": "Nu visar apan dig vad den har lärt sig!",
		"en": "Now monkey show you what it learned!"	
	},
	
	"MONKEYS_TURN": {
		"sv": "Apans tur!",
		"en": "Monkey's turn!"
	},
	
	"MONKEY_HMM": {
		"sv": "Apan: Hmmm...",
		"en": "Monkey: Hmm..."
	},
	
	"FISHING_KEEP_GOING": {
		"sv": "Fortsätt!",
		"en": "Keep going!"
	},
	
	"NUMBER_1": {
		"sv": "nummer 1",
		"en": "number 1"
	},

	"NUMBER_2": {
		"sv": "nummer 2",
		"en": "number 2"
	},
	
	"NUMBER_3": {
		"sv": "nummer 3",
		"en": "number 3"
	},
	
	"NUMBER_4": {
		"sv": "nummer 4",
		"en": "number 4"
	},
	
	"NUMBER_5": {
		"sv": "nummer 5",
		"en": "number 5"
	},
	
	"NUMBER_6": {
		"sv": "nummer 6",
		"en": "number 6"
	},
	
	"NUMBER_7": {
		"sv": "nummer 7",
		"en": "number 7"
	},
	
	"NUMBER_8": {
		"sv": "nummer 8",
		"en": "number 8"
	},
	
	"NUMBER_9": {
		"sv": "nummer 9",
		"en": "number 9"
	},
	
	"NUMBER_10": {
		"sv": "nummer 10",
		"en": "number 10"
	}
	
};

var GlobalSettings = {
	language: "en"
}

/**
 * @param {string} str
 * @param {...number} var_args
 */
Strings.get = function(str, var_args) {
	var tmp = Strings[str][GlobalSettings.language];
	for(var i = 1; i < arguments.length; i++) 
	      tmp = tmp.replace("%"+i, arguments[i]);
	return tmp;
}
