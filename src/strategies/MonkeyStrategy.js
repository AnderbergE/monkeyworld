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
		handleResults();
		
	}, EVM_TAG);
	
	eventManager.on("FishingGame.countingStarted", function(msg) {
		handleCountingResults();
	}, EVM_TAG);
	
	function handleCountingResults() {
		eventManager.play(Sounds.MONKEY_HMM);
		setTimeout(function() {
			var guess = result.sequence[resultPosition++];
			game.countFish(guess);
			if (resultPosition < result.sequence.length) {
				handleCountingResults();
			}
		}, 2000);		
	};
	
	function handleResults() {
		var happening = result.sequence[resultPosition++];
		var resultLength = result.sequence.length;
		if (resultPosition <= resultLength && happening != "FishingGame.catchingDone") {
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
					Log.error("Error when handling happenings (no such happening: " + happening + ")", "monkey");
				}
			}, 2000);
		}
	}
	
	eventManager.on("catched", function(msg) {
		/** @type {Fish} */ var fish = msg.fish;
	}, EVM_TAG);
	
	eventManager.on("Game.tearDown", function(msg) {
		eventManager.forget(EVM_TAG);
	}, EVM_TAG);
};