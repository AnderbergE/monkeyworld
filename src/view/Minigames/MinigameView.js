/**
 * @constructor
 * @extends {MW.ViewModule}
 * @param {MW.Minigame} minigame
 * @param {Kinetic.Stage} stage
 * @param {string} tag
 */
MW.MinigameView = MW.ViewModule.extend(
/** @lends {MW.MinigameView.prototype} */
{
	/** @constructs */
	init: function (minigame, stage, tag) {
		this._super(stage, tag);
	}
});

