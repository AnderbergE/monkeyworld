/**
 * AngelPlayer
 * @extends {Player}
 * @constructor
 */
function AngelPlayer(eventManager) {
	Log.debug("Creating AngelPlayer", "player");
}
AngelPlayer.prototype = new Player();
AngelPlayer.prototype.strategies = function() {};

/**
 * @constructor
 * @param {FishingGame} game
 */
AngelPlayer.prototype.strategies["FishingGame"] = function(game, eventManager, config) {
	//var result = config.result;
	var EVM_TAG = "AngelPlayer";
	Log.debug("Applying AngelPlayer's strategy to the FishingGame", "player");

	
	eventManager.on("fishinggame.started", function(msg) {
		game.turnOffInactivityTimer();
		
	}, EVM_TAG);
	
	eventManager.on("FishingGame.countingStarted", function(msg) {
		
	}, EVM_TAG);
	
	eventManager.on("Game.tearDown", function(msg) {
		eventManager.forget(EVM_TAG);
	}, EVM_TAG);
};