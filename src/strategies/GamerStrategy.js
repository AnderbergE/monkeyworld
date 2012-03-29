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
	Log.debug("Applying GamerPlayer's strategy to the FishingGame", "player");
	
	eventManager.on("fishinggame.started", function(msg) {
		Log.debug("Starting to think", "player");
	//	eventManager.tell("fishinggame.turnOnClicks");
		eventManager.tell("fishinggame.allowClicks");
	});
	
	eventManager.on("catched", function(msg) {
		/** @type {Fish} */ var fish = msg.fish;
	});
};