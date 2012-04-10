/**
 * MonkeyPlayer
 * @extends {Player}
 * @constructor
 */
function MonkeyPlayer(eventManager) {
	Log.debug("Creating MonkeyPlayer", "player");
}
MonkeyPlayer.prototype = new Player();
MonkeyPlayer.prototype.strategies = function() {};

/**
 * @constructor
 * @param {FishingGame} game
 */
MonkeyPlayer.prototype.strategies["FishingGame"] = function(game, eventManager, config) {
	var result = config.result;
	var EVM_TAG = "MonkeyPlayer";
	Log.debug("Applying MonkeyPlayer's strategy to the FishingGame", "player");

	var resultPosition = 0;
	
	eventManager.on("fishinggame.started", function(msg) {
		game.turnOffInactivityTimer();
		console.log("Game started");
		handleResults();
		
	}, EVM_TAG);
	
	function handleResults() {
		var happening = result.sequence[resultPosition++];
		var resultLength = result.sequence.length;
		if (resultPosition <= resultLength) {
			this.setTimeout(function() {
				if (happening == "correct") {
					game.catchFish(game.getOneCorrectFish(), function() {handleResults();});
				} else if (happening == "incorrect") {
					game.catchFish(game.getOneIncorrectFish(), function() {handleResults();});
				} else if (happening == "freeIncorrect") {
					game.freeFish(game.getOneIncorrectlyCapturedFish(), function() {handleResults();});
				} else if (happening == "freeCorrect") {
					game.freeFish(game.getOneCorrectlyCapturedFish(), function() {handleResults();});
				} else {
					Log.error("Error when handling happenings (no such happening)", "monkey");
				}
			}, 2000);
		}
	}
	
	eventManager.on("catched", function(msg) {
		/** @type {Fish} */ var fish = msg.fish;
	}, EVM_TAG);
};