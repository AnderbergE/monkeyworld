/**
 * @constructor
 * @extends {MW.Module}
 * @param {string} tag
 */
function ViewModule(tag) {
	MW.Module.call(this, tag);
	var that = this;
	var tweenController = new TweenController();
	
	this.addTearDown(function() {
		that.hideBig();
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
	 * Big Text module
	 */
	var bigText = function() {
		
		var bigShowing = null;
		
		return {
			
		hide: function() {
			if (bigShowing != null) {
				bigShowing.setText("");
				that.stage.pleaseDrawOverlayLayer();
			}
		},
			
		/**
		 * @param {string} text
		 */
		show: function(text) {
			if (bigShowing != null) {
				bigShowing.moveTo(that.stage.getDynamicLayer());
				that.stage.pleaseDrawOverlayLayer();
				bigShowing.setText(text);
				bigShowing.setPosition(that.stage.attrs.width/2, 150 * that.stage._mwunit); 
			} else {
				bigShowing = new Kinetic.Text({
					x: 0,
					y: 150,
					text: text,
					fontSize: 26,
					fontFamily: "Short Stack",
					textFill: "white",
					textStroke: "black",
					align: "center",
					width: that.stage.getWidth(),
					verticalAlign: "middle",
					scale: {x:0.001,y:0.001},
					textStrokeWidth: 1
				});
				Utils.scaleShape(bigShowing, that.stage._mwunit);
			}
			that.stage.getDynamicLayer().add(bigShowing);
			
			Tween.get(bigShowing.attrs.scale).to(Utils.scaleShape({x:2, y:2}, that.stage._mwunit), 1000).wait(3000).call(function() {
				Tween.get(bigShowing.attrs.scale).to(Utils.scaleShape({x: 1, y: 1}, that.stage._mwunit), 1000).call(function() {
				});
				Tween.get(bigShowing.attrs).to({y: 50*that.stage._mwunit }, 1000).call(function(){
					bigShowing.moveTo(that.stage.getOverlayLayer());
					that.stage.pleaseDrawOverlayLayer();
				});
			});
		}
		};
	}();
	
	/**
	 * Show a big text on the screen for a while.
	 * @param {string} text
	 */
	this.showBig = function(text) {
		bigText.show(text);
	};
	
	/**
	 * Hide any big text currently on the screen.
	 * @private
	 */
	this.hideBig = function() {
		bigText.hide();
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
	/** @this {ViewModule} */
	this.getStage = function() {
		return this.stage;
	};
};
