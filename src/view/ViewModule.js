/**
 * @constructor
 * @extends {MW.Module}
 * @param {string} tag
 */
MW.ViewModule = function(tag) {
	MW.Module.call(this, tag);
	var that = this;
	var tweenController = new TweenController();
	
	this.addTearDown(function() {
		Log.debug("Tearing down", "ViewModule");
		tweenController.teardown();
	});
	
	/**
	 * @param {Object} target
	 * @return {Tween}
	 */
	this.getTween = function(target) {
		return tweenController.getTween(target);
	};
	
	/**
	 * @param {Object} target
	 */
	this.removeTween = function(target) {
		tweenController.removeTweens(target);
	};
	
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
	/** @this {MW.ViewModule} */
	this.getStage = function() {
		return this.stage;
	};
};
