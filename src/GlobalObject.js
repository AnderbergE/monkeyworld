/**
 * MonkeyWorld namespace
 * @namespace
 */
var MW = {};

/** @enum {string} */
var Events = {
	FRAME: "frame",
	TEAR_DOWN: "tearDown"
};

/** @enum {string} */
var GameMode = {
	CHILD_PLAY: "Child Play",
	MONKEY_SEE: "Monkey See",
	MONKEY_DO: "Monkey Do",
	GUARDIAN_ANGEL: "Guardian Angel"
};

/**
 * @extends {Kinetic.Stage}
 * @constructor
 */
Kinetic.NoStage = function() {};
Kinetic.NoStage.getWidth = function(){};


/**
 * @constructor
 */
MW.GlobalObject = function(tag) {
	this._tag = tag;
    
	/**
	 * Register a listener to the event manager.
	 * @param {string} type
	 * @param {Function} fnc
	 * @param {string=} tag
	 */
	this.on = function(type, fnc, tag) {
		this.evm.on(type, fnc, tag === undefined ? this._tag : tag);
	};
	
	/**
	 * @param {string} type
	 * @param {string=} tag
	 */
	this.off = function(type, tag) {
		this.evm.off(type, tag === undefined ? this._tag : tag);
	};
	
	/**
	 * Forget all listeners registered on the event manager.
	 * @param {string=} tag
	 */
	this.forget = function(tag) {
		this.evm.forget(tag === undefined ? this._tag : tag);
	};
	
	/**
	 * Tell the event manager that an event happened. It will be propagated to
	 * all listeners.
	 * @param {string} type
	 * @param {Object=} msg
	 */
	this.tell = function(type, msg) {
		this.evm.tell(type, msg);
	};
	
	this.wevm = function() {
		console.log(this.evm.wevm());
	};
	
	/**
	 * @param {string} tag
	 */
	this.tag = function(tag) {
		this._tag = tag;
	};
};

MW.GlobalObject.prototype.evm  = new NoEventManager();
MW.GlobalObject.prototype.stage = new Kinetic.NoStage();


/**
 * @constructor
 */
MW.MiniGameResult = function() {
	
	/**
	 * @type {Array.<MW.MiniGameRoundResult>}
	 */
	var results = new Array();
	
	/**
	 * @param {MW.MiniGameRoundResult} roundResult
	 */
	this.pushResult = function(roundResult) {
		results.push(roundResult);
	};
	
	/**
	 * Get the results of specified round 
	 * @param {number} round
	 */
	this.getResult = function(round) {
		var index = round - 1;
		if (index < 0 || index >= results.length) {
			throw "MonkeyWorld.NoSuchRoundException ("+round+")";
		}
		return results[index];
	};
};

/**
 * @constructor
 */
MW.MiniGameRoundResult = function() {
	/**
	 * @type {boolean}
	 */
	var madeMistake = false;
	
	/**
	 * @type {Array.<*>}
	 */
	var actions = new Array();
	
	/**
	 * Report that a mistake has been made.
	 */ 
	this.reportMistake = function() { console.log("reportMistake"); madeMistake = true; };
	
	/**
	 * Returns true if a mistake has been made.
	 * @returns {boolean}
	 */
	this.madeMistake = function() { console.log("madeMistake="+madeMistake); return madeMistake; };
	
	/**
	 * @param {*} action
	 */
	this.pushAction = function(action) {
		actions.push(action);
	};
	
	this.popAction = function() {
		actions.splice(actions.length - 1);
	};
	
	/**
	 * @return {Array.<*>}
	 */
	this.getActions = function() {
		return actions;
	};
};

/**
 * @extends {MW.MiniGameResult}
 * @constructor
 */
MW.NoMiniGameResult = function() {
	this.pushResult = function() {
		throw "MonkeyWorld.NoMiniGameResultException";
	};
	this.getResult = function() {
		throw "MonkeyWorld.NoMiniGameResultException";
	};
};
