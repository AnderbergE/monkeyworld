/** @enum {string} */ var Language = { SWEDISH: "sv", ENGLISH: "en" }; 

/** @enum {string|number} */
var GlobalSettings = {
	/** @type {Language} */ LANGUAGE: Language.SWEDISH
};

/**
 * @constructor
 */
function SettingsObject() {
	var settings = {
		"global": {
			"language": {
				_value: "en"
			},
			"monkeySeeRounds": {
				_value: 1
			},
			"triesBeforeGuardianAngel": {
				_value: 3
			}
		},
		
		"miniGames": {
			"fishingGame": {
				"targetNumber": {
					_value: 2
				},
				"numberCorrect": {
					_value: 1
				},
				"numberOfFish": {
					_value: 7
				},
				"maxNumber": {
					_value: 9
				}
			},
			
			"ladder": {
				"targetNumber": {
					_value: -1
				}
			}
		}
	};
	
	this.json = function() { return settings; };
	this.get = function(args) {
		var current = settings;
		for (var i = 0; i < arguments.length; i++) {
			current = current[arguments[i]];
		}
		return current._value;
	};
	
	this.set = function(args) {
		var current = settings;
		for (var i = 0; i < arguments.length - 1; i++) {
			current = current[arguments[i]];
		}
		current._value = arguments[arguments.length - 1];
	};
	
	this.setJSON = function(obj) {
		if (obj === null) return;
		settings = obj;
	};
	
	this.set2 = function(arg, val) {
		var args = arg.split("-");
		var current = settings;
		for (var i = 0; i < args.length; i++) {
			current = current[args[i]];
		}
		current._value = val;
	};
}
var Settings = new SettingsObject();

/**
 * @constructor
 */
function SettingsPanel(settings) {
	
	/** @const */ var SETTINGS_PANEL_ID = "#settings-panel-content";
	var panel = $(SETTINGS_PANEL_ID);
	
	var _widget = function(setting, id) {
		var html = "";
		html += "<input type=\"text\" id=\"" + id + "\" value=\"" + setting._value + "\" />";
		return html;
	};
	
	var _title = function(name, level, pre) {
		var html = "";
		if (pre === undefined) pre = ""; else pre += "_";
		var lookFor = "SETTINGS_" + (pre + name).toUpperCase().replace("-", "_") + "_LABEL";
		var title = MW.Strings.get(lookFor);
		if (title != null)
			html += "<h" + level + ">" + title + "</h" + level + ">";
		return html;
	};
	
	var _list = function(json, level, pre) {
		var html = "";
		html += "<ul>";
		for (var key in json) {
			if (typeof json[key] === "object" && json[key]._value === undefined) {
				html += _title(key, level + 1, pre);
				html += _list(json[key], level + 1, pre + "-" + key);
				continue;
			}
			html += "<li>";
			html += _title(key, level + 1, pre);
			html += _widget(json[key], pre + "-" + key) + "</li>";
		}
		html += "</ul>";
		return html;
	};
	
	var _init = function() {
		$("#settings-panel").append("<div id=\"settings-panel-content\">");
		panel = $(SETTINGS_PANEL_ID);
		panel.append("<h1>" + MW.Strings.get("SETTINGS_LABEL") + "</h1>");
		panel.append("<form>");
		var settingsJSON = settings.json();
		
		for (var key in settingsJSON) {
			panel.append(_title(key, 2, ""));
			panel.append(_list(settingsJSON[key], 2, key));
		}
		var gamestr = "'egame'";
		var applystr = "'applySettings'";
		var hidestr = "'hideSettings'";
		
		var hidef = "window[" + gamestr + "][" + hidestr + "]()";
		var applyf = "window[" + gamestr + "][" + applystr + "]()";
		
		panel.append("<button type=\"button\" onclick=\"" + hidef + "\">" + MW.Strings.get("SETTINGS_CANCEL") + "</button>");
		panel.append("<button type=\"button\" onclick=\"" + applyf + ";" + hidef + "\">" + MW.Strings.get("SETTINGS_APPLY") + "</button>");
		//panel.append("<button type=\"button\" onclick=\"game.hideSettings();\">" + MW.Strings.get("SETTINGS_HIDE") + "</button>");
		panel.append("</form>");
		panel.append("</div>");
	};
	
	var _apply_object = function(object, name, pre) {
		for (var key in object) {
			if (typeof object[key] === "object" && object[key]._value === undefined)
				_apply_object(object[key], key, pre + "-" + key);
			else if (object[key]._value != undefined) {
				var val = $("#" + pre + "-" + key).val();
				Settings.set2(pre + "-" + key, val);
			}
		}
	};
	
	var _apply = function() {
		var json = settings.json();
		for (var key in json) {
			if (typeof json[key] === "object") _apply_object(json[key], key, key);
		}
		panel.remove();
		_init();
	};
	
	this.apply = function() { _apply(); };
	
	/**
	 * Shows the settings panel
	 */
	this.show = function() {
		_init();
		$("#settings-panel").show();
	};
	
	this.hide = function() {
		panel.remove();
		$("#settings-panel").hide();
	};
	
}