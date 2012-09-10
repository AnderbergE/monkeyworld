/**
 * GamerPlayer
 * @extends {MW.Player}
 * @constructor
 */
MW.GamerPlayer = function() {
	MW.Player.call(this, "GamerPlayer");
	this.tag("GamerPlayer");
	this.strategies = function() {};
	this.strategies["Ladder"] = function(game) {
		
	};
};

