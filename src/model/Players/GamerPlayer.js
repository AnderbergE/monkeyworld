/**
 * GamerPlayer
 * @extends {MW.Player}
 * @constructor
 */
function GamerPlayer() {
	MW.Player.call(this, "GamerPlayer");
	this.tag("GamerPlayer");
	Log.debug("Creating GamerPlayer", "player");
	this.strategies = function() {};
	
	this.strategies["Ladder"] = function(game) {
		
	};
}
//GamerPlayer.prototype = new Player();
