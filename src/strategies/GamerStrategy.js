/**
 * GamerPlayer
 * @extends {Player}
 * @constructor
 */
function GamerPlayer(eventManager) {
	Log.debug("Creating GamerPlayer", "player");
}
GamerPlayer.prototype = new Player();
GamerPlayer.prototype.strategies = function() {};

/**
 * @constructor
 * @param {FishingGame} game
 */
GamerPlayer.prototype.strategies["FishingGame"] = function(game, eventManager) {
	var EVM_TAG = "GamerPlayer";
	Log.debug("Applying GamerPlayer's strategy to the FishingGame", "player");
	
	eventManager.on("fishinggame.started", function(msg) {
		Log.debug("Starting to think", "player");
	//	eventManager.tell("fishinggame.turnOnClicks");
		eventManager.tell("fishinggame.allowClicks");
	}, EVM_TAG);
	
	eventManager.on("Game.tearDown", function(msg) {
		eventManager.forget(EVM_TAG);
	}, EVM_TAG);
};