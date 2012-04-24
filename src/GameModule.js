/** @enum {string} */
var GameMode = {
	CHILD_PLAY: "Child Play",
	MONKEY_SEE: "Monkey See",
	MONKEY_DO: "Monkey Do",
	GUARDIAN_ANGEL: "Guardian Angel"
};

/**
 * @constructor
 */
function GameModule() {
	
	/** @type {Array.<Object>} */ var actions = new Array();
	/** @type {boolean} */ var _madeMistake = false;
	/** @type {EventManager} */ var evm = new NoEventManager();
	
	/**
	 * Tell the game what the player did.
	 * @param {*} action
	 */
	this.addAction = function(action) {
		actions.push(action);
	};
	
	this.resetActions = function() {
		actions = new Array();
	};
	
	/**
	 * Tell the system that the player made a mistake during game play. 
	 */
	this.reportMistake = function() { _madeMistake = true; };
	/** @return {boolean} */
	this.madeMistake = function() { return _madeMistake; };
	this.resetMistake = function() { _madeMistake = false; };
	
	/**
	 * Returns the actions performed by the player during game play.
	 * @return {Array.<Object>}
	 */
	this.getActions = function() {
		return actions;
	};
	
	
	this.roundDone = function() {
		Log.debug("Round done", "game");
		evm.tell("Game.roundDone");
		evm.tell("Game.nextRound");
	};

	/**
	 * @param {Player} player
	 * @param {EventManager} eventManager
	 * @param {Object} config
	 */
	this.play = function(player, eventManager, config) {
		evm = eventManager;
		player.strategies[this._name](this, eventManager, config);
	};
}
GameModule.prototype = new GameView();


/** @type {string} */
GameModule.prototype._name = "GameModule";

GameModule.prototype.getMode = function() { return this.mode; };
/** @param {GameMode} mode */
GameModule.prototype.setMode = function(mode) { this.mode = mode; };

