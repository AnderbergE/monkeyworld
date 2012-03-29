/**
 * @constructor
 */
function Player() {}
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
function GameModule() {}

/**
 * @param {Player} player
 * @param {EventManager} eventManager
 */
GameModule.prototype.play = function(player, eventManager) {
	this._eventManager = eventManager;
	player.strategies[this._name](this, eventManager);
};
GameModule.prototype._name = "GameModule";
