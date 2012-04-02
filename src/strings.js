/** @enum {Object} */
var Strings = {
		
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
		"sv": "Fånga nummer",
		"en": "Catch number"
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
	}

};

var GlobalSettings = {
	language: "sv"
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
