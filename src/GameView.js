/**
 * @constructor
 * @extends {ViewModule}
 */
function GameView() {
	ViewModule.call(this, "GameView");
	/** @type {GameView}      */ var view  = this;
	/** @type {Kinetic.Layer} */ var layer = view.stage._gameLayer;

	/**
	 * Show the current backend score of a mini game.
	 * @param {MonkeyWorldView}
	 */
	(function(view) {
		var text = new Kinetic.Text({
			text: "Backend Score (current mode): ",
			fontSize: 20,
			fontFamily: "monospace",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 500,
			y: 15
		});
		layer.add(text);
		
		view.on(MW.Event.BACKEND_SCORE_UPDATE_MODE, function(msg) {
			text.setText(msg.backendScore);
		});
		
		view.on(MW.Event.BACKEND_SCORE_HIDE, function(msg) {
			text.attrs.visible = false;
		});
		
		view.on(MW.Event.BACKEND_SCORE_SHOW, function(msg) {
			text.attrs.visible = true;
		});
		
	})(this);

	
	
	
	
	
	/** @type {Kinetic.Layer} */ var staticLayer = new Kinetic.Layer();

	/** @type {Kinetic.Node} */ var mainFrame = null;
	/** @type {Kinetic.Node} */ var monkeyFrame = null;
	/** @type {Kinetic.Node} */ var gamerFrame = null;
	/** @type {Kinetic.Node} */ var avatar = null;
	/** @type {Kinetic.Node} */ var monkey = null;
	
	var MONKEY_FRAME_CONFIG_INACTIVE = null;
	var GAMER_FRAME_CONFIG_ACTIVE = null;
	var GAMER_FRAME_CONFIG_INACTIVE = null;
	var MONKEY_FRAME_CONFIG_ACTIVE = null;
	var MONKEY_CONFIG_ACTIVE = null;
	var MONKEY_CONFIG_INACTIVE = null;
	
	var _init = function(stage) {
		var ACTIVE_FRAME_ALPHA = 0.8;
		var INACTIVE_FRAME_ALPHA = 0.2;
		var ACTIVE_FRAME_WIDTH = 740;
		var INACTIVE_FRAME_WIDTH = 220;
		
		MONKEY_FRAME_CONFIG_INACTIVE = {
			x: 20, y: 20, width: INACTIVE_FRAME_WIDTH, height: 730,
			fill: "white", alpha: INACTIVE_FRAME_ALPHA
		};
		
		GAMER_FRAME_CONFIG_ACTIVE = {
			x: 260, y: 20, width: ACTIVE_FRAME_WIDTH, height: 730,
			fill: "white", alpha: ACTIVE_FRAME_ALPHA
		};
		GAMER_FRAME_CONFIG_INACTIVE = {
			y: GAMER_FRAME_CONFIG_ACTIVE.y,
			alpha: INACTIVE_FRAME_ALPHA,
			x: GAMER_FRAME_CONFIG_ACTIVE.x + (ACTIVE_FRAME_WIDTH - INACTIVE_FRAME_WIDTH),
			width: INACTIVE_FRAME_WIDTH,
			height: GAMER_FRAME_CONFIG_ACTIVE.height,
			fill: GAMER_FRAME_CONFIG_ACTIVE.fill
		};
		MONKEY_FRAME_CONFIG_ACTIVE = {
			alpha: ACTIVE_FRAME_ALPHA,
			width: ACTIVE_FRAME_WIDTH,
			y: MONKEY_FRAME_CONFIG_INACTIVE.y,
			x: MONKEY_FRAME_CONFIG_INACTIVE.x,
			height: MONKEY_FRAME_CONFIG_INACTIVE.height,
			fill: MONKEY_FRAME_CONFIG_INACTIVE.fill
		};
		MONKEY_CONFIG_ACTIVE = {x:ACTIVE_FRAME_WIDTH + MONKEY_FRAME_CONFIG_INACTIVE.x - 175, y: 540};
		MONKEY_CONFIG_INACTIVE = {x: 60, y: 540};
		
		Utils.scaleShape(MONKEY_FRAME_CONFIG_INACTIVE, stage._mwunit);
		Utils.scaleShape(GAMER_FRAME_CONFIG_ACTIVE, stage._mwunit);
		Utils.scaleShape(GAMER_FRAME_CONFIG_INACTIVE, stage._mwunit);
		Utils.scaleShape(MONKEY_FRAME_CONFIG_ACTIVE, stage._mwunit);
		Utils.scaleShape(MONKEY_CONFIG_ACTIVE, stage._mwunit);
		Utils.scaleShape(MONKEY_CONFIG_INACTIVE, stage._mwunit);
	};
	
	/**
	 */
	function setupMainFrame() {
		var stage = staticLayer.getStage();
		mainFrame = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: stage.getWidth(),
			height: stage.getHeight()
		});
		staticLayer.add(mainFrame);
	};

	function setupMonkey() {
		var stage = staticLayer.getStage();
		var mode = view.game.getMode();
		var config = (mode == MW.GameMode.AGENT_DO && view.game.getRound() > 1) ?
				MONKEY_FRAME_CONFIG_ACTIVE : MONKEY_FRAME_CONFIG_INACTIVE;
		var monkeyConfig = (mode == MW.GameMode.AGENT_DO && view.game.getRound() > 1) ?
				MONKEY_CONFIG_ACTIVE : MONKEY_CONFIG_INACTIVE;
		monkeyFrame = new Kinetic.Rect(config);
		
		var MONKEY_IMAGE_CONFIG = {
			x: monkeyConfig.x,
			y: monkeyConfig.y,
			scale: {
				x: 1.0 * stage._mwunit,
				y: 1.0 * stage._mwunit
			},
			width: images["monkey"].width,
			height: images["monkey"].height,
			image: images["monkey"]
		};
		
		monkey = new Kinetic.Image(MONKEY_IMAGE_CONFIG);
		staticLayer.add(monkeyFrame);
		staticLayer.add(monkey);
	};
	
	function setupAngel() {
		var stage = staticLayer.getStage();
		var config = MONKEY_FRAME_CONFIG_ACTIVE;
		var angelFrame = new Kinetic.Rect({
			x: config.x,
			y: config.y,
			width: config.width,
			height: config.height,
			fill: config.fill,
			alpha: config.alpha
		});
		var angel = new Kinetic.Image(Utils.scaleShape({
			x: 500,
			y: 450,
			image: images["rafiki"],
			width: 200,
			height: 280
		}, stage._mwunit));
		staticLayer.add(angelFrame);
		staticLayer.add(angel);
	};

	function setupAvatar() {
		var stage = staticLayer.getStage();
		var mode = view.game.getMode();
		var config = (mode == MW.GameMode.AGENT_DO && view.game.getRound() > 1) ?
				GAMER_FRAME_CONFIG_INACTIVE : GAMER_FRAME_CONFIG_ACTIVE;
		gamerFrame = new Kinetic.Rect(config);
		
		var AVATAR_IMAGE_CONFIG = {
			x:      GAMER_FRAME_CONFIG_ACTIVE.x + GAMER_FRAME_CONFIG_ACTIVE.width - 210 * stage._mwunit,
			y:      GAMER_FRAME_CONFIG_ACTIVE.y + GAMER_FRAME_CONFIG_ACTIVE.height - 220 * stage._mwunit,
			scale:  {
				x:      0.8 * stage._mwunit,
				y:      0.8 * stage._mwunit
			},
			width:  images["avatar"].width,
			height: images["avatar"].height,
			image:  images["avatar"]
		};
		
		avatar = new Kinetic.Image(AVATAR_IMAGE_CONFIG);
		staticLayer.add(gamerFrame);
		staticLayer.add(avatar);
	};
	
	var moved = 0;
	var moveDone = function(done) {
		moved++;
		if (moved == 3) {
			done();
			staticLayer.draw();
			view.forget("GameView");
		}
	};
	function moveToMonkey(done) {
		Sound.play(Sounds.MAGIC_CHIMES);
		view.on("frame", function() {
			staticLayer.draw();
		}, "GameView");
		view.getTween(monkey.attrs).to(MONKEY_CONFIG_ACTIVE, 2000).call(function() { moveDone(done); });
		view.getTween(monkeyFrame.attrs).to(MONKEY_FRAME_CONFIG_ACTIVE, 2000).call(function() { moveDone(done); });
		view.getTween(gamerFrame.attrs).to(GAMER_FRAME_CONFIG_INACTIVE, 2000).call(function() { moveDone(done); });
	};
	
	/**
	 * Initiate the view
	 */
	function init() {
		moved = 0;
		_init(staticLayer.getStage());
		setupMainFrame();
		if (view.game.getMode() == MW.GameMode.AGENT_SEE || view.game.getMode() == MW.GameMode.AGENT_DO) {
			setupMonkey();
		}
		setupAvatar();
	};
	
/*----------------------------------------------------------------------------*/
	
	/**
	 * @param {Kinetic.Layer} layer
	 */
	this.setStaticLayer = function(layer) {
		staticLayer = layer;
	};
	
	/**
	 * @param {Function} done
	 */
	this.moveToMonkey = function(done) {
		moveToMonkey(done);
	};
	
	/**
	 */
	this.basicInit = function() {
		init();
	};
}
inherit(GameView, ViewModule);