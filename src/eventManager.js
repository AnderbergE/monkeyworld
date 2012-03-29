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
	 * @param {string=} name
	 */
	this.on = function(type, callback, name) {
		if (listeners[type] === undefined)
			listeners[type] = new Array();
		listeners[type].push(callback);
		callback._caller = name;
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
	
	/**
	 * @param {string} type
	 * @param {Object} message
	 */
	this.tell = function(type, message) {
		if (listeners[type] === undefined)
			return;
		for (var i = 0; i < listeners[type].length; i++) {
			var callback = listeners[type][i];
			callback(message);
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
	
	this.log = function(msg) {
		console.log(msg);
	};
}
