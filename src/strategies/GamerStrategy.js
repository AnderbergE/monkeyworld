/**
 * GamerPlayer
 * @extends {Player}
 * @constructor
 */
function GamerPlayer() {
	this.tag("GamerPlayer");
	Log.debug("Creating GamerPlayer", "player");
	this.strategies = function() {};
	
	this.strategies["Ladder"] = function(game) {
		
	};
}
GamerPlayer.prototype = new Player();
