/**
 * AngelPlayer
 * @extends {Player}
 * @constructor
 */
function AngelPlayer() {
	this.tag("AngelPlayer");
	var that = this;
	Log.debug("Creating AngelPlayer", "player");
	
	this.strategies = function() {};

	/**
	 * @param {FishingGame} game
	 */
	this.strategies["FishingGame"] = function(game) {
		var catched = 0;
		Log.debug("Applying AngelPlayer's strategy to the FishingGame", "player");
		
		that.on("Game.start", function(msg) {
			catched = 0;
			game.turnOffClicks();
			game.turnOffInactivityTimer();
		});
		
		that.on("FishingGame.started", function(msg) {
			setTimeout(function() {
				catchFish();	
			}, 2000);
		});
		
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
		
		that.on("FishingGame.countingStarted", function(msg) {
			count();
		});
		
		that.on("Game.tearDown", function(msg) {
			that.forget();
		});
	};
}
AngelPlayer.prototype = new Player();
