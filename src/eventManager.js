/**
 * @interface
 */
function GameEventListener() {};
GameEventListener.prototype.notify = function(event) {};

/**
 * @constructor
 */
function EventManager() {
	
	var listeners = new Array();
	
	/*
	 * Registers a ordinary listener to the messaging system.
	 * @param {GameEventListener} listener The listener to register.
	 */
	/*this.registerListener = function(listener) {
		this.log("EVMAN: Register " + listener);
		listeners.push(listener);
	};*/

	/**
	 * Unregisters a listener from the messaging system.
	 * @param listener The listener to unregister.
	 */
	this.unregisterListener = function(listener) {
		for (var i = 0; i < listeners.length; i++) {
			if (listeners[i] === listener) {
				listeners.splice(i, 1);
			}
		}
	};

	/**
	 * Sends a message to all listeners registerd.
	 * @param {EventInterface} event
	 */
	this.post = function(event) {
		for (var i = 0; i < listeners.length; i++) {
			listeners[i].notify(event);
		}
	};
	
	/**
	 * @type {Object.<string, Array>}
	 */
	var listeners2 = {};
	
	/**
	 * @param {string} type
	 * @param {Function} callback
	 */
	this.on = function(type, callback) {
		if (listeners2[type] === undefined)
			listeners2[type] = new Array();
		listeners2[type].push(callback);
	}
	
	/**
	 * @param {string} type
	 * @param {Object} message
	 */
	this.tell = function(type, message) {
		if (listeners2[type] === undefined)
			return;
		for (var i = 0; i < listeners2[type].length; i++) {
			var callback = listeners2[type][i];
			callback(message);
		}
	}
	
	this.log = function(msg) {
		console.log(msg);
	};
}

/** @interface */
function EventInterface() {}

/**
 * @constructor
 * @implements {EventInterface}
 */
function GameEvent(type, config) { this.type = type; this.config = config; };

/**
 * @constructor
 * @implements {EventInterface}
 */
function GameStartedEvent() {}

/**
 * @constructor
 */
function RodMovedEvent() {}

/**
 * @constructor
 */
function FrameEvent(frame) { this.frame = frame; }

/**
 * @constructor
 * @implements {EventInterface}
 * Indicates that a fish has been created.
 */
function InitiatedFishEvent(config) { this.config = config; }

/**
 * @constructor
 */
function FishMovedEvent(fish) { this.fish = fish; }

/**
 * @constructor
 */
function FishTurnedLeft(fish) { this.fish = fish; }

/**
 * @constructor
 */
function FishTurnedRight(fish) { this.fish = fish; }

/**
 * @constructor
 */
function TouchStartEvent(x, y) { this.x = x; this.y = y; }