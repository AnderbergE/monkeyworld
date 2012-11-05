/**
 * @constructor
 * @extends {MW.Module}
 * @param {Kinetic.Stage} stage
 * @param {string} tag
 */
MW.ViewModule = MW.Module.extend(
/** @lends {MW.ViewModule.prototype} */
{
	/** @constructs */
	init: function (stage, tag) {
		this._super(tag);
		this._stage = stage;
	},

	getStage: function() {
		return this._stage;
	}
});
