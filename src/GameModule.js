/** @enum {string} */
var GameMode = {
	CHILD_PLAY: "Child Play",
	MONKEY_SEE: "Monkey See",
	MONKEY_DO: "Monkey Do",
	GUARDIAN_ANGEL: "Guardian Angel"
}

/**
 * @constructor
 */
function GameModule() {
	
	var that = this;
	/** @type {Array.<Object>} */ var actions = new Array();
	/** @type {number} */ var round = 1;
	/** @type {GameMode} */ var mode = GameMode.CHILD_PLAY;
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
		/*decideMode[mode](function() {
			console.log("next round");
			that.init();
			evm.tell("Game.initiate");
			evm.tell("Game.initiatedView");
			evm.tell("Game.start");
		});
		*/
	};
	/*
	var decideMode = {};
	decideMode[GameMode.CHILD_PLAY] = function(done) {
		var readyToTeach = function() {
			mode = GameMode.MONKEY_SEE;
			round = 1;
			evm.tell("Game.getBanana", { callback: done });
		};
		var notReadyToTeach = function() {
			round++;
			done();
		};
		evm.tell("Game.readyToTeach", { yes: readyToTeach, no: notReadyToTeach });
	};
	
	decideMode[GameMode.MONKEY_SEE] = function(done) {
		console.log("see");
		if (round === 1) {
			// thank you for helping
			mode = GameMode.MONKEY_DO;
			round = 1;
			done();
		} else {
			round++;
		}
	};
	
	decideMode[GameMode.MONKEY_DO] = function(done) {
		if (round === 3) {
			mode = GameMode.GUARDIAN_ANGEL;
			round = 1;
		} else {
			//quit
		}
	};
	
	decideMode[GameMode.GUARDIAN_ANGEL] = function(done) {
		if (round === 1) {
			mode = GameMode.MONKEY_SEE;
			round = 1;
		} else {
			round++;
		}
	};
	*/
	/**
	 * @param {Player} player
	 * @param {EventManager} eventManager
	 * @param {Object} config
	 */
	this.play = function(player, eventManager, config) {
		//this._eventManager = eventManager;
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

