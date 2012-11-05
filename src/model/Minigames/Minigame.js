/**
 * @constructor
 * @extends {MW.Module}
 */
MW.Minigame = MW.Module.extend(
/** @lends {MW.Minigame.prototype} */
{
	/**
	 * @constructs
	 * @param {MW.Game} parent
	 * @param {string} tag
	 */
	init: function (parent, tag) {
		this._super(tag);
		this._parent = parent;
		this._started = false;
		this._startFunctions = [];
		this._stopped = false;
		this._stopFunctions = [];
		var that = this;
	
	
		/**
		 * @param {Function} fnc
		 */
		this.addStart = function (fnc) {
			this._startFunctions.push(fnc);
		};

		/**
		 * @param {Function} fnc
		 */	
		this.addStop = function (fnc) {
			this._stopFunctions.push(fnc);
		};

		/**
		 * @param {MW.Player} player
		 * @param {Object=} res
		 */
		this.play = function(player, res) {
			that.start();
		};
	},
	
	start: function () {
		if (this._started)
			throw {
				name: "MW.MinigameModuleAlreadyStarted",
				message: "This minigame module (" + this.getTag() + ") " +
					     "has already been started."
			};
		this._started = true;
		while (this._startFunctions.length > 0)
			(this._startFunctions.shift())();
	},
	
	stop: function () {
		if (this._stopped)
			throw {
				name: "MW.MinigameModuleAlreadyStopped",
				message: "This minigame module (" + this.getTag() + ") " +
					     "has already been stopped."
			};
		this._stopped = true;
		while (this._stopFunctions.length > 0)
			(this._stopFunctions.shift())();
	},

	/** @return {boolean} true if the current mode is Child Play */
	modeIsChild: function() {
		return this._parent.modeIsChild();
	},

	/** @return {boolean} true if the current mode is Agent See */
	modeIsAgentSee: function() {
		return this._parent.modeIsAgentSee();
	},

	/** @return {boolean} true if the current mode is Agent Do */
	modeIsAgentDo: function() {
		return this._parent.modeIsAgentDo();
	},
	
	setMode: function (mode) {
		this._parent.setMode(mode);
	}
});

