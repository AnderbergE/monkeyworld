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
		this.quit = parent.miniGameDone;
		var
			that = this,
			startFunctions = [],
			stopFunctions = [],
			started = false,
			stopped = false;
	
		/** @private @type {MW.MiniGameRoundResult} */
		var roundResult = null;
	
		/** @private @type {number} */ var backendScore = 10;
	
		var _strategy = null;
	
		/**
		 * Tell the game what the player did.
		 * @param {*} action
		 */
		this.addAction = function(action) {
			roundResult.pushAction(action);
		};
	
		this.popAction = function() {
			roundResult.popAction();
		};
	
		/**
		 * @param {Function} fnc
		 */
		this.addStart = function (fnc) {
			startFunctions.push(fnc);
		};

		/**
		 * @param {Function} fnc
		 */	
		this.addStop = function (fnc) {
			stopFunctions.push(fnc);
		};
	
		this.start = function () {
			if (started)
				throw {
					name: "MW.MinigameModuleAlreadyStarted",
					message: "This minigame module (" + tag + ") " +
						     "has already been started."
				};
			started = true;
			while (startFunctions.length > 0)
				(startFunctions.shift())();
		};
	
		this.stop = function () {
			if (stopped)
				throw {
					name: "MW.MinigameModuleAlreadyStopped",
					message: "This minigame module (" + tag + ") " +
						     "has already been stopped."
				};
			stopped = true;
			while (stopFunctions.length > 0)
				(stopFunctions.shift())();
		};
	
		var subtractBackendScore = function() {
			if (backendScore > 0) {
				backendScore--;
				that.tell(MW.Event.BACKEND_SCORE_UPDATE_MODE,
					{ backendScore: backendScore }, true);
			}		
		};
	
		/**
		 * Tell the system that the player made a mistake during game play. 
		 */
		this.reportMistake = function() {
			subtractBackendScore();
			roundResult.reportMistake();
		};

		/** @return {boolean} */
		this.madeMistake = function() { return roundResult.madeMistake(); };
	
		/** @return {MW.MiniGameRoundResult} */
		this.getResult = function() {
			return roundResult;
		};
	
		/** @return {number} */
		this.getBackendScore = function() {
			return backendScore;
		};
	
		/**
		 * Call this function to tell the engine that the mini game round is
		 * over.
		 * @protected
		 * @deprecated
		 */
		this.roundDone = function() {
			//Log.debug("Round done", "game");
			//that.tell("Game.roundDone");
			//that.tell("Game.nextRound");
			//that.miniGameDone();
		};

		/**
		 * @param {MW.Player} player
		 * @param {Object=} res
		 */
		this.play = function(player, res) {
			backendScore = 10;
			that.tell(MW.Event.BACKEND_SCORE_UPDATE_MODE, { backendScore: backendScore }, true);
			roundResult = new MW.MiniGameRoundResult();
			_strategy = new player.strategies[this._tag](this, res);
			this.start();
		};
	
		var _agentIsInterrupted = false;
		var _agentIsBeingHelped = false;
		var interruptHandlers = [];
	
		this.interruptAgent = function() {
			_agentIsInterrupted = true;
			_strategy.interrupt();
			that.setGamerAsPlayer();
			for (var i = 0; i < interruptHandlers.length; i += 1) {
				interruptHandlers[i]();
			}
		};

		this.addAgentInterruptedHandler = function (fnc) {
			interruptHandlers.push(fnc);
		};
	
		this.resumeAgent = function() {
			_agentIsInterrupted = false;
			that.setAgentAsPlayer();
			_strategy.resume();
		};
	
		this.agentIsInterrupted = function() {
			return _agentIsInterrupted;
		};
	
		/**
		 * Tell the system that the teachable agent needs help.
		 */
		this.helpAgent = function() {
			_agentIsBeingHelped = true;
			that.setGamerAsPlayer();
		};
	
		/**
		 * Tell the system that the teachable agent has been helped, and that it
		 * can now continue on its own.
		 */
		this.helpedAgent = function() {
			_agentIsBeingHelped = false;
			that.setAgentAsPlayer();
		};
	
		/**
		 * Checks if the teachable agent is currently being helped by the gamer.
		 * @return {boolean}
		 */
		this.agentIsBeingHelped = function() {
			return _agentIsBeingHelped;
		};
	},
	
	addWaterDrop: function (callback) {
		return this._parent.addWaterDrop(callback);
	},
	
	setAgentAsPlayer: function () {
		return this._parent.setAgentAsPlayer();
	},

	setGamerAsPlayer: function () {
		return this._parent.setGamerAsPlayer();
	},
	
	/**
	 * Returns true if the current player is the gamer.
	 * @return {boolean}
	 */
	playerIsGamer: function() {
		return this._parent.playerIsGamer();
	},

	/**
	 * Returns true if the current player is the teachable agent.
	 * @return {boolean}
	 */
	playerIsAgent: function() {
		return this._parent.playerIsAgent();
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
	}
});

