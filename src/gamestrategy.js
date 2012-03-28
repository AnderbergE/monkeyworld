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

/*============================================================================*/

/**
 * @constructor
 */
function GameModule() {
	console.log("WARNING: No extension to GameModule defined.");
}

//GameModule.prototype.getEventManager = function() { return this._eventManager; };
/**
 * @param {Player} player
 * @param {EventManager} eventManager
 */
GameModule.prototype.play = function(player, eventManager) {
	this._eventManager = eventManager;
	player.strategies[this._name](this, eventManager);
};
GameModule.prototype._name = "GameModule";
