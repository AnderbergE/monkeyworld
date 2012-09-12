/**
 * GamerPlayer
 * @extends {MW.Player}
 * @constructor
 */
MW.GamerPlayer = MW.Player.extend(
/** @lends {MW.GamerPlayer.prototype} */
{
	/** @constructs */
	init: function () {
		this._super("GamerPlayer");
		this.tag("GamerPlayer");
		this.strategies = function () {};
		this.strategies["Ladder"] = function(game) {
		
		};
	}

});

