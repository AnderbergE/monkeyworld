/**
 * @interface
 */
function GameEventListener() {};
GameEventListener.prototype.notify = function(event) {};

/**
 * @constructor
 */
function EventManager(stage) {
	
	var subtitleLayer = stage._subtitleLayer;
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
		if (!(type in listeners))
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
		if (listeners[type].length == 0) {
			delete listeners[type];
		}
	};
	
	/*this.forgetAll = function() {
		for (key in listeners) {
			if (key != "frame") {
				listeners[key] = new Array();
			}
		}
	};*/
	
	this.print = function () {
		console.log("-------EVENT MANAGER STATE-----------------");
		for (var key in listeners) {
			console.log("key: " + key);
			for (var j = 0; j < listeners[key].length; j++) {
				console.log("   " + listeners[key][j]._caller);
			}
		}
		console.log("-------------------------------------------");
	};
	
	this.who = function(type) {
		if (!(type in listeners))
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
			if (listeners[key].length == 0) {
				delete listeners[key];
			}
		}
		Log.debug("Forgot " + sum + " event registred by " + name, "evm");
	};
	
	/**
	 * @param {string} type
	 * @param {Object=} message
	 */
	this.tell = function(type, message) {
		var bucket = listeners[type];
		if (bucket != undefined) {
			for (var i = 0; i < bucket.length; i++) {
				var callback = bucket[i];
				callback(message);
			}
		}
	};
	
	var subtitles = new Array();
	
	var subtitlesX = subtitleLayer.getParent().attrs.width / 2;
	var subtitlesY = subtitleLayer.getParent().attrs.height - 50;
	
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
		var mute = true;
		if (!mute && entry.soundFile != null)
			SoundJS.play(entry._key);

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
	}
	
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
