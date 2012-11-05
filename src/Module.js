/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {string} tag
 */
MW.Module = MW.GlobalObject.extend(
/** @lends {MW.Module.prototype} */
{
	/** @constructs */
	init: function (tag) {
		this._super(tag);
		this._tearDowns = [];
		this._setups = [];
	},
	
	addTearDown: function (fnc) {
		this._tearDowns.push(fnc);
	},
	
	tearDown: function() {
		if (this._tearDowns === null)
			throw {
				name: "MW.TearDownAlreadyCalledException",
				message: "This module (" + this.getTag() + ") has " +
				         "already been teared down."
			};
		this.forget();
		for (var i = 0; i < this._tearDowns.length; i++) {
			this._tearDowns[i]();
			this._tearDowns[i] = null;
		};
		this._tearDowns = null;
	},

	addSetup: function(fnc) {
		this._setups.push(fnc);
	},
	
	setup: function() {
		if (this._setups === null)
			throw {
				name: "MW.SetupAlreadyCalledException",
				message: "This module (" + this.getTag() + ") has " +
				         "already been setted up."
			};
		for (var i = 0; i < this._setups.length; i++) {
			this._setups[i]();
			this._setups[i] = null;
		};
		this._setups = null;
	}
});

