/**
 * @constructor
 * @private
 */
function TimeoutController() {
	
	var timeouts = new Array();
	
	/**
	 * @param {Function} fnc
	 * @param {number} time
	 * @return {number}
	 */
	this.setTimeout = function(fnc, time) {
		var handler = setTimeout(fnc, time);
		timeouts.push(handler);
		return handler;
	};
	
	/**
	 * @param {Function} fnc
	 * @param {number} time
	 * @returns {number}
	 */
	this.setInterval = function(fnc, time) {
		var handler = setInterval(fnc, time);
		timeouts.push(handler);
		return handler;
	};
	
	/**
	 * @param {number} id
	 */
	this.clearTimeout = function(id) {
		timeouts.remove(id);
		clearTimeout(id);
	};
	
	/**
	 * @param {number} id
	 */
	this.clearInterval = function(id) {
		timeouts.remove(id);
		clearInterval(id);
	};
	
	/**
	 * 
	 */
	this.teardown = function() {
		for (var i = 0; i < timeouts.length; i++) {
			clearTimeout(timeouts[i]);
		}
		delete timeouts;
		timeouts = new Array();
	};
};

/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {string} tag
 */
MW.Module = MW.GlobalObject.extend(
/** @lends {MW.Module.prototype} */
{
	/** @constructs */
	init: function (tag) {
		this._super(tag);
		this._timeoutController = new TimeoutController();
		this._tearDowns = [];
		this._setups = [];
	},
	
	addTearDown: function (fnc) {
		this._tearDowns.push(fnc);
	},
	
	tearDown: function() {
		if (this._tearDowns === null)
			throw {
				name: "MW.TearDownAlreadyCalledException",
				message: "This module (" + this.getTag() + ") has " +
				         "already been teared down."
			};
		this._timeoutController.teardown();
		this.forget();
		for (var i = 0; i < this._tearDowns.length; i++) {
			this._tearDowns[i]();
			this._tearDowns[i] = null;
		};
		this._tearDowns = null;
	},

	addSetup: function(fnc) {
		this._setups.push(fnc);
	},
	
	setup: function() {
		if (this._setups === null)
			throw {
				name: "MW.SetupAlreadyCalledException",
				message: "This module (" + this.getTag() + ") has " +
				         "already been setted up."
			};
		for (var i = 0; i < this._setups.length; i++) {
			this._setups[i]();
			this._setups[i] = null;
		};
		this._setups = null;
	},
	
	/**
	 * @param {Function} fnc
	 * @param {number} time
	 * @return {number}
	 */
	setTimeout: function(fnc, time) {
		return this._timeoutController.setTimeout(fnc, time);
	},

	/**
	 * @param {Function} fnc
	 * @param {number} time
	 * @return {number}
	 */
	setInterval: function(fnc, time) {
		return this._timeoutController.setInterval(fnc, time);
	},
	
	/**
	 * @param {number} id
	 */
	clearTimeout: function(id) {
		this._timeoutController.clearTimeout(id);
	},

	/**
	 * @param {number} id
	 */
	clearInterval: function(id) {
		this._timeoutController.clearInterval(id);
	}
});

