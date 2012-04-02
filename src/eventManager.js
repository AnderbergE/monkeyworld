/**
 * @interface
 */
function GameEventListener() {};
GameEventListener.prototype.notify = function(event) {};

/**
 * @constructor
 */
function EventManager(subtitleLayer) {
	
	/**
	 * @type {Object.<string, Array>}
	 */
	var listeners = {};
	
	/**
	 * @param {string} type
	 * @param {Function} callback
	 * @param {string} name
	 */
	this.on = function(type, callback, name) {
		if (listeners[type] === undefined)
			listeners[type] = new Array();
		listeners[type].push(callback);
		callback._caller = name;
		var _name = name === undefined ? "unnamed" : name;
		Log.debug(_name + " registerd " + type, "evm");
	};
	
	/**
	 * @param {string} type
	 * @param {string} name
	 */
	this.off = function(type, name) {
		for (var i = 0; i < listeners[type].length; i++) {
			if (listeners[type][i]._caller === name) {
				listeners[type].splice(i, 1);
			}
		}
	};
	
	this.forgetAll = function() {
		for (key in listeners) {
			if (key != "frame") {
				listeners[key] = new Array();
			}
		}
	};
	
	this.who = function(type) {
		if (listeners[type] === undefined)
			return;
		for (var i = 0; i < listeners[type].length; i++) {
			Log.debug(listeners[type][i]._caller + " listens to " + type);
		}
	};
	
	/**
	 * @param {string} name
	 */
	this.forget = function(name) {
		var sum = 0;
		for (key in listeners) {
			for (var i = 0; i < listeners[key].length; i++) {
				if (listeners[key][i]._caller === name) {
					listeners[key].splice(i, 1);
					sum++;
				}
			}
		}
		Log.debug("Forgot " + sum + " event registred by " + name, "evm");
	};
	
	/**
	 * @param {string} type
	 * @param {Object=} message
	 */
	this.tell = function(type, message) {
		if (Object.size(listeners) > 0 && listeners[type] != undefined) {
			for (var i = 0; i < listeners[type].length; i++) {
				var callback = listeners[type][i];
				callback(message);
			}
		}
	};
	
	var subtitles = new Array();
	
	var subtitlesX = subtitleLayer.getParent().width / 2;
	var subtitlesY = subtitleLayer.getParent().height - 50;
	
	function addSubtitle(text) {
		for (var i = 0; i < subtitles.length; i++) {
			subtitles[i].y -= 30; 
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
		
		if (entry.soundFile != null)
			SoundJS.play(entry._key);
		
		if (entry.subtitle != null) {
			var text = new Kinetic.Text({
				x: subtitleLayer.getParent().width / 2,
				y: subtitleLayer.getParent().height - 50,
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
			text._id = "subtitle" + subtitles.length;
			subtitleLayer.add(text);
			subtitleLayer._removeNext = false;
			var that = this;
	
			this.on("frame", function() {
				subtitleLayer.moveToTop();
				subtitleLayer.draw();
				if (subtitleLayer._removeNext) {
					that.off("frame", text._id);
					subtitleLayer._removeNext = false;
				}
			}, "subtitle" + subtitles.length);
			
			setTimeout(function() {
				subtitleLayer.remove(text);
				subtitleLayer._removeNext = true;
				removeSubtitle(text);
			}, 2000);
		}
	};
	
	this.loadImages = function(imageSources, images, callback) {
		Log.debug("Loading images...", "view");
		var loadedImages = 0;
		var numImages = Object.size(imageSources);
		for (var src in imageSources) {
            images[src] = new Image();
            images[src].onload = function(){
                if (++loadedImages >= numImages) {
                	callback();
                }
            };
            images[src].src = "../res/img/" + imageSources[src];
        }
	};
}
