/**
 * @constructor
 * @extends {MW.Module}
 * @param {string} tag
 */
function MiniGame(tag) {//TODO: Rename to MW.Minigame
	MW.Module.call(this, tag);
	var that = this;
	
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
	 * Call this function to tell the engine that the mini game round is over.
	 * The message "Game.roundDone" will be broadcasted, allowing views to tear
	 * down. Then the engine will control if another round should be played,
	 * (restarting the mini game in another game mode) or if it is time to play
	 * another mini game.
	 * @protected
	 */
	this.roundDone = function() {
		Log.debug("Round done", "game");
		this.tell("Game.roundDone");
		this.tell("Game.nextRound");
		this.game.miniGameDone();
	};

	/**
	 * @param {MW.Player} player
	 * @param {Object=} res
	 */
	this.play = function(player, res) {
		backendScore = 10;
		that.tell(MW.Event.BACKEND_SCORE_UPDATE_MODE, { backendScore: backendScore }, true);
		roundResult = new MW.MiniGameRoundResult();
		console.log(this._tag);
		_strategy = new player.strategies[this._tag](this, res);
		this.start();
	};
	
	var _agentIsInterrupted = false;
	var _agentIsBeingHelped = false;
	
	this.interruptAgent = function() {
		_agentIsInterrupted = true;
		_strategy.interrupt();
		that.game.setGamerAsPlayer();
	};
	
	this.resumeAgent = function() {
		_agentIsInterrupted = false;
		that.game.setAgentAsPlayer();
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
		that.game.setGamerAsPlayer();
	};
	
	/**
	 * Tell the system that the teachable agent has been helped, and that it
	 * can now continue on its own.
	 */
	this.helpedAgent = function() {
		_agentIsBeingHelped = false;
		that.game.setAgentAsPlayer();
	};
	
	/**
	 * Checks if the teachable agent is currently being helped by the gamer.
	 * @return {boolean}
	 */
	this.agentIsBeingHelped = function() {
		return _agentIsBeingHelped;
	};
	
	this.stop = function() {
		this.tell("Game.roundDone");
	};
}

/**
 * @constructor
 * @extends {MiniGame}
 */
function NoMiniGame() {
	this.play = function() {
		throw "No implemented mini game";
	};
}
NoMiniGame.prototype = new MiniGame("NoMiniGame");