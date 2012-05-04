/**
 * @interface
 */
function GameEventListener() {};
GameEventListener.prototype.notify = function(event) {};
/**
 * @param {string} name
 */
GameEventListener.prototype.forget = function(name) {};

/**
 * @interface
 */
function EventManager() {}

EventManager.prototype.wevm = function() {};

/**
 * @param {string} type
 * @param {Function} callback
 * @param {string} name
 */
EventManager.prototype.on = function(type, callback, name) {};

/**
 * @param {string} type
 * @param {Object=} message
 */
EventManager.prototype.tell = function(type, message) {};

/**
 * @param {string} type
 * @param {string} name
 */
EventManager.prototype.off = function(type, name) {};

/**
 * @param {string} name
 */
EventManager.prototype.forget = function(name) {};


/**
 * @constructor
 * @implements {EventManager}
 */
function GameEventManager(stage) {
	
	/**
	 * @type {Object.<string, Array>}
	 */
	var listeners = {};
	var toForget = new Array();
	var telling = 0;
	
	this.wevm = function() { return "GameEventManager"; };
	
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
		if (telling > 0) {
//			console.log("Can't forget " + name + " now.");
			toForget.push(name);
			return;
		}
		var sum = 0;
		for (var key in listeners) {
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
		telling++;
		var bucket = listeners[type];
		if (bucket != undefined) {
			for (var i = 0; i < bucket.length; i++) {
				var callback = bucket[i];
				callback(message);
			}
		}
		telling--;
		if (telling == 0 && toForget.length > 0) {
			for (var i = 0; i < toForget.length; i++) {
				this.forget(toForget[i]);
			}
			toForget = new Array();
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

/**
 * @constructor
 * @implements {EventManager}
 */
function NoEventManager() {
	
	this.wevm = function() { return "NoEventManager"; };
	
	/**
	 * @param {string} type
	 * @param {Function} callback
	 * @param {string} name
	 */
	this.on = function(type, callback, name) {};
	
	/**
	 * @param {string} type
	 * @param {Object=} message
	 */
	this.tell = function(type, message) {};
	
	/**
	 * @param {string} type
	 * @param {string} name
	 */
	this.off = function(type, name) {};
	
	/**
	 * @param {string} name
	 */
	this.forget = function(name) {};
};