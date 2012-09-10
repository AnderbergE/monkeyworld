/**
 * @constructor
 */
MW.EventManager = function() {
	
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
		var types = type.split(" ");
		for (var i = 0; i < types.length; i++) {
			if (!(types[i] in listeners))
				listeners[types[i]] = new Array();
			listeners[types[i]].push(callback);
			callback._caller = name;
			var _name = name === undefined ? "unnamed" : name;
		}
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
			console.log(listeners[type][i]._caller + " listens to " + type);
		}
	};

	/**
	 * @param {string} name
	 */
	this.forget = function(name) {
		if (telling > 0) {
			toForget.push(name);
			return;
		}
		var sum = 0;
		for (var key in listeners) {
			var total = listeners[key].length;
			for (var i = 0; i < total; i++) {
				if (listeners[key][i]._caller === name) {
					listeners[key].splice(i, 1);
					i--;
					total--;
					sum++;
				}
			}
			if (listeners[key].length == 0) {
				delete listeners[key];
			}
		}
	};

	/**
	 * @param {string} type
	 * @param {Object=} message
	 * @param {boolean=} debug
	 */
	this.tell = function(type, message, debug) {
		telling++;
		var bucket = listeners[type];
		if (bucket != undefined) {
			for (var i = 0; i < bucket.length; i++) {
				var callback = bucket[i];
				if (debug != undefined && debug)
					console.log("  Observer: " + bucket[i]._caller);
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

	this.tellArguments = function (next, wait, type, args) {
		var debug = true;
		telling++;
		var bucket = listeners[type];
		if (bucket != undefined) {
			for (var i = 0; i < bucket.length; i++) {
				var callback = bucket[i];
				if (debug != undefined && debug)
					console.log("  Observer: " + bucket[i]._caller);
				callback(next, args);
				if (!wait)
					next();
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

	this.tellWait = function (type, callback, message) {
		this.tellArguments(callback, true, type, message);
	};
};

