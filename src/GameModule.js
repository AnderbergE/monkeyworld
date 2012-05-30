/**
 * @constructor
 * @extends {Module}
 */
function MiniGame() {
	
	var that = this;
	
	/** @private @type {MW.MiniGameRoundResult} */
	var roundResult = null;
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
	 * Tell the system that the player made a mistake during game play. 
	 */
	this.reportMistake = function() { roundResult.reportMistake(); };

	/** @return {boolean} */
	this.madeMistake = function() { return roundResult.madeMistake(); };
	
	this.getResult = function() {
		return roundResult;
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
	 * @param {Player} player
	 * @param {Object=} res
	 */
	this.play = function(player, res) {
		roundResult = new MW.MiniGameRoundResult();
		console.log(this._tag);
		_strategy = new player.strategies[this._tag](this, res);
	};
	
	var _agentIsInterrupted = false;
	
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
	
	this.stop = function() {
		this.tell("Game.roundDone");
	};
	
	this.start = function() {
		
	};
}

MiniGame.prototype = new Module();
MiniGame.prototype.onFrame = function(frame) {};

/**
 * @constructor
 * @extends {MiniGame}
 */
function NoMiniGame() {
	this.play = function() {
		throw "No implemented mini game";
	};
}
NoMiniGame.prototype = new MiniGame();