/**
 * @constructor
 * @param {string} tag
 * @extends Class
 */
MW.GlobalObject = Class.extend(
/** @lends {MW.GlobalObject.prototype} */
{
	init: function (tag)  {
		this._tag = tag;
		this.evm = MW.EventManager;
	},
	
	/**
	 * Register a listener to the event manager.
	 * @param {string} type
	 * @param {Function} fnc
	 * @param {string=} tag
	 */
	on: function(type, fnc, tag) {
		this.evm.on(type, fnc, tag === undefined ? this._tag : tag);
	},
	
	/**
	 * @param {string} type
	 * @param {string=} tag
	 */
	off: function(type, tag) {
		this.evm.off(type, tag === undefined ? this._tag : tag);
	},
	
	/**
	 * Forget all listeners registered on the event manager.
	 * @param {string=} tag
	 */
	forget: function(tag) {
		this.evm.forget(tag === undefined ? this._tag : tag);
	},
	
	/**
	 * Tell the event manager that an event happened. It will be propagated to
	 * all listeners.
	 * @param {string} type
	 * @param {Object=} msg
	 * @param {boolean=} debug
	 */
	tell: function(type, msg, debug) {
		if (debug != undefined && debug)
			console.log(this.getTag() + ": " + type);
		this.evm.tell(type, msg, debug);
	},
	
	tellWait: function (type, callback, msg) {
		console.log(this.getTag() + ": " + type);
		this.evm.tellWait(type, callback, msg);
	},

	sendable_: function (waitable, event, var_args) {
		var that = this;
		return function (callback) {
			console.log(that.getTag() + ": " + event);
			that.evm.tellArguments(callback, waitable, event, var_args);
		};
	},
	
	sendable: function (event, var_args) {
		var that = this;
		return that.sendable_(false, event, var_args);
	},
	
	waitable: function (event, var_args) {
		var that = this;
		return that.sendable_(true, event, var_args);
	},
	
	/**
	 * @param {string} tag
	 */
	tag: function(tag) {
		this._tag = tag;
	},

	setEventManager: function (evm) {
		this.evm = evm;
	},
	
	getTag: function () {
		return this._tag;
	}
});