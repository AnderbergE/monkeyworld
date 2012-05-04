/**
 * @constructor
 * @extends {Module}
 */
function MiniGame() {
	
	/** @private @type {MW.MiniGameRoundResult} */
	var roundResult = null;
	
	/**
	 * Tell the game what the player did.
	 * @param {*} action
	 */
	this.addAction = function(action) {
		roundResult.pushAction(action);
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
		player.strategies[this._name](this, res);
	};
	
	
	this.stop = function() {
		
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