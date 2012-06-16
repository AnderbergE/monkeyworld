/**
 * @constructor
 * @extends {Module}
 * @param {string} moduleName
 */
function ViewModule(moduleName) {
	Log.debug("Creating ViewModule", "object");
	Module.call(this);
	var that = this;
	var tweenController = new TweenController();
	
	var tearDown = function() {
		that.hideBig();
		that.forget();
		if (that.tearDown != undefined)
			that.tearDown();
	};
	
	this._setup = function() {
		this.on("Game.stopMiniGame", function() { tearDown(); });
		this.on("Game.roundDone", function() { tearDown(); });
	};
	
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
	
	var _oldTearDown = this.tearDown; 
	this.tearDown = function() {
		Log.debug("Tearing down", "ViewModule");
		bigText.hide();
		_oldTearDown();
		tweenController.teardown();
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
					x: that.stage.attrs.width/2,
					y: 150,
					text: text,
					fontSize: 26,
					fontFamily: "Short Stack",
					textFill: "white",
					textStroke: "black",
					align: "center",
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

inherit(ViewModule, Module);
ViewModule.prototype.stage = null;