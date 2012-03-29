/**
 * @interface
 */
function GameEventListener() {};
GameEventListener.prototype.notify = function(event) {};

/**
 * @constructor
 */
function EventManager() {
	
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
	
	/**
	 * @param {SoundEntry} entry
	 */
	this.play = function(entry) {
		console.log(entry.subtitle);
	}
	
	this.log = function(msg) {
		console.log(msg);
	};
}
