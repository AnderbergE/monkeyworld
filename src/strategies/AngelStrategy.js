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
	var catched = 0;
	Log.debug("Applying AngelPlayer's strategy to the FishingGame", "player");
	
	eventManager.on("Game.start", function(msg) {
		catched = 0;
		game.turnOffClicks();
		game.turnOffInactivityTimer();
	}, EVM_TAG);
	
	eventManager.on("FishingGame.started", function(msg) {
		setTimeout(function() {
			catchFish();	
		}, 2000);
	}, EVM_TAG);
	
	function catchFish() {
		if (catched < game.getNumberOfCorrectFish()) {
			Sound.play(Sounds.FISHING_ANGEL_CHOOSE_FISH);
			setTimeout(function() {
				catched++;
				game.catchFish(game.getOneCorrectFish(), function() {catchFish();});	
			}, 1000);
		}
	}
	
	function count() {
		setTimeout(function() {
			Sound.play(Sounds.FISHING_ANGEL_COUNT);
			setTimeout(function() {
				game.countFish(game.getNumberOfCorrectFish());	
			}, 1000);
		}, 2000);	
	}
	
	eventManager.on("FishingGame.countingStarted", function(msg) {
		count();
	}, EVM_TAG);
	
	eventManager.on("Game.tearDown", function(msg) {
		eventManager.forget(EVM_TAG);
	}, EVM_TAG);
};