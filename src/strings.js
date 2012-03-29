/** @enum {Object} */
var Strings = {
		
	"YAY": {
		"sv" :"Hurra!",
		"en" :"Yay!"
	},
		
	"FISHING_CATCH_NUMBER": {
		"sv" :"Fånga nummer %1",
		"en" :"Catch number %1"
	},
	
	"FISHING_CATCH": {
		"sv" :"Fånga nummer",
		"en" :"Catch number"
	},

	"FISHING_FREE_WRONG_ONES": {
		"sv" :"Frige fiskarna som är fel",
		"en" :"Put back the wrong fish"
	},
	
	"FISHING_NOT_THIS_ONE": {
		"sv" :"Inte den!",
		"en" :"Not this one!"
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
