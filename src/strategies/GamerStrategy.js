/**
 * GamerPlayer
 * @extends {Player}
 * @constructor
 */
function GamerPlayer(eventManager) {
	console.log("Creating GamerPlayer");
}
GamerPlayer.prototype = new Player();
GamerPlayer.prototype.strategies = function() {};

/**
 * @constructor
 * @param {FishingGame} game
 */
GamerPlayer.prototype.strategies["FishingGame"] = function(game, eventManager) {
	console.log("Applying GamerPlayer's strategy to the FishingGame");
	
	eventManager.on("fishinggame.started", function(msg) {
		console.log("Game started");
		eventManager.tell("fishinggame.turnOnClicks");
		eventManager.tell("fishinggame.allowClicks");
	});
	
	eventManager.on("catched", function(msg) {
		/** @type {Fish} */ var fish = msg.fish;
	});
};