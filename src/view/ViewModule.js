/**
 * @constructor
 * @private
 */
function TweenController() {
	
	var tweens = new Array();
	
	/**
	 * @param {Object} target
	 */
	this.getTween = function(target) {
		if (!Utils.inArray(tweens, target))
				tweens.push(target);
		return Tween.get(target);
	};
	
	this.removeTweens = function(target) {
		Tween.removeTweens(target);
	};
	
	/**
	 * 
	 */
	this.teardown = function() {
		for (var i = 0; i < tweens.length; i++) {
			Tween.removeTweens(tweens[i]);
		}
	};
};

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
		this._tweenController = new TweenController();
	},
	
	tearDown: function () {
		this._super();
		this._tweenController.teardown();
	},
	
	setup: function () {
		this._super();
	},
	
	/**
	 * @param {Object} target
	 * @return {Tween}
	 */
	getTween: function(target) {
		return this._tweenController.getTween(target);
	},
	
	/**
	 * @param {Object} target
	 */
	removeTween: function(target) {
		this._tweenController.removeTweens(target);
	},

	getStage: function() {
		return this._stage;
	}
});

