/**
 * GamerPlayer
 * @extends {Player}
 * @constructor
 */
function GamerPlayer() {
	this.tag("GamerPlayer");
	var that = this;
	Log.debug("Creating GamerPlayer", "player");
	this.strategies = function() {};
	
	/**
	 * @param {FishingGame} game
	 */
	this.strategies["FishingGame"] = function(game) {
		Log.debug("Applying GamerPlayer's strategy to the FishingGame", "player");
		
		that.on("fishinggame.started", function(msg) {
			Log.debug("Starting to think", "player");
			that.tell("fishinggame.allowClicks");
		});
		
		that.on("Game.tearDown", function(msg) {
			that.forget();
		});
	};
}
GamerPlayer.prototype = new Player();
