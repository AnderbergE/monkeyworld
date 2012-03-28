/**
 * MonkeyPlayer
 * @extends {Player}
 * @constructor
 */
function MonkeyPlayer(eventManager) {
	console.log("Creating MonkeyPlayer");
}
MonkeyPlayer.prototype = new Player();
MonkeyPlayer.prototype.strategies = function() {};

/**
 * @constructor
 * @param {FishingGame} game
 */
MonkeyPlayer.prototype.strategies["FishingGame"] = function(game, eventManager) {
	console.log("Applying MonkeyPlayer's strategy to the FishingGame");
	
	eventManager.on("fishinggame.started", function(msg) {
		console.log("Game started");
		var allFish = game.getAllFish();
		this.setTimeout(function() {
			console.log("Will catch");
			eventManager.tell("fishinggame.catch", {fish:allFish[0]});
		}, 2000);
		
	});
	
	eventManager.on("catched", function(msg) {
		/** @type {Fish} */ var fish = msg.fish;
	});
};