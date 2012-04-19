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
		catchFish();
	}, EVM_TAG);
	
	function catchFish() {
		if (catched < game.getNumberOfCorrectFish()) {
			catched++;
			game.catchFish(game.getOneCorrectFish(), function() {catchFish();});
		}		
	}
	
	function count() {
		//eventManager.play(Sounds.MONKEY_HMM);
		setTimeout(function() {
			game.countFish(game.getCatchingNumber());
		}, 2000);	
	}
	
	eventManager.on("FishingGame.countingStarted", function(msg) {
		count();
	}, EVM_TAG);
	
	eventManager.on("Game.tearDown", function(msg) {
		eventManager.forget(EVM_TAG);
	}, EVM_TAG);
};