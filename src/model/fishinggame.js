/**
 * @constructor
 */
function Player() {
	console.log("WARNING: No extension to GameModule defined.");
}
Player.prototype.strategies = function() {};
/**
 * @param {FishingGame} game
 */
Player.prototype.eventManager;

Player.prototype._name = "Player";

/*----------------------------------------------------------------------------*/

/**
 * @extends {Player}
 * @constructor
 */
function MonkeyPlayer(eventManager) {
	console.log("Creating MonkeyPlayer");
}
MonkeyPlayer.prototype = Player.prototype;
MonkeyPlayer.prototype.strategies = function() {};
/**
 * @constructor
 * @implements {GameEventListener}
 * @param {FishingGame} game
 */
MonkeyPlayer.prototype.strategies["FishingGame"] = function(game, eventManager) {
	console.log("Applying MonkeyPlayer's strategy to the FishingGame");
	
	this.notify = function(event) {
		
	};
	
	eventManager.registerListener2("started", function() {
		console.log("Game started");
	});
};

/*============================================================================*/

/**
 * @constructor
 * @param {EventManager} eventManager
 */
function GameModule(eventManager) {
	/** @private */
	this._eventManager = eventManager;
	console.log("WARNING: No extension to GameModule defined.");
}

GameModule.prototype.getEventManager = function() { return this._eventManager; };
/**
 * @param {Player} player
 * @param {EventManager} eventManager
 */
GameModule.prototype.play = function(player, eventManager) {
	this._eventManager = eventManager;
	player.strategies[this._name](this, eventManager);
};
GameModule.prototype._name = "GameModule";


/*----------------------------------------------------------------------------*/

/**
 * @extends {GameModule}
 * @constructor
 */
function FishingGame() {
	this._name = "FishingGame";
	console.log("Creating FishingGame"); 
}
FishingGame.prototype = GameModule.prototype;
