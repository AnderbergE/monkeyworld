/** @enum {Object} */
var Strings = {
	"FISHING_CATCH_NUMBER": {
		"sv" :"Fånga nummer %1",
		"en" :"Catch number %1"
	}

};


var GlobalSettings = {
	"language": "sv"
}

/**
 * @param {string} str
 * @param {...number} var_args
 */
Strings.get = function(str, var_args) {
	var tmp = Strings[str][GlobalSettings["language"]];
	for(var i = 1; i < arguments.length; i++) 
	      tmp = tmp.replace("%"+i, arguments[i]);
	return tmp;
}

//console.log(Strings.get("FISHING_CATCH_NUMBER", 5, 7));