/**
 * @constructor
 */
function GameView() {
	
	/** @type {EventManager} */ var evm = new NoEventManager(); 
	/** @type {Object.<string, Image>} */ var images = new Array();
	/** @type {Kinetic.Layer} */ var staticLayer = new Kinetic.Layer();
	/** @type {Kinetic.Layer} */ var dynamicLayer = new Kinetic.Layer();

	/** @type {Kinetic.Node} */ var mainFrame = null;
	/** @type {Kinetic.Node} */ var monkeyFrame = null;
	/** @type {Kinetic.Node} */ var gamerFrame = null;
	/** @type {Kinetic.Node} */ var avatar = null;
	/** @type {Kinetic.Node} */ var monkey = null;
	
	var ACTIVE_FRAME_ALPHA = 0.8;
	var INACTIVE_FRAME_ALPHA = 0.2;
	var ACTIVE_FRAME_WIDTH = 740;
	var INACTIVE_FRAME_WIDTH = 220;
	
	var MONKEY_FRAME_CONFIG = {
		x: 20, y: 20, width: INACTIVE_FRAME_WIDTH,
		fill: "white", alpha: INACTIVE_FRAME_ALPHA,
		centerOffset: {x:0,y:0}
	};
	
	var GAMER_FRAME_CONFIG = {
		x: 260, y: 20, width: ACTIVE_FRAME_WIDTH,
		fill: "white", alpha: ACTIVE_FRAME_ALPHA,
		centerOffset: {x:0,y:0}
	};

	function setupMainFrame() {
		console.log("setup mainframe");
		var stage = staticLayer.getStage();
		mainFrame = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: stage.getWidth(),
			height: stage.getHeight(),
			stroke: "white",
			strokeWidth: 4
		});
		staticLayer.add(mainFrame);
	};
	
	function setupMonkey() {
		console.log("setup monkey");
		var stage = staticLayer.getStage();
		MONKEY_FRAME_CONFIG.height = staticLayer.getStage().getHeight()-40;
		monkeyFrame = new Kinetic.Rect(MONKEY_FRAME_CONFIG);
		monkey = new Kinetic.Image({ x: 40, y: stage.getHeight() - 230, image: images["monkey"] });
		staticLayer.add(monkeyFrame);
		staticLayer.add(monkey);
	};
	
	function setupAvatar() {
		console.log("setup avatar");
		GAMER_FRAME_CONFIG.height = staticLayer.getStage().getHeight()-40;
		//GAMER_FRAME_CONFIG.width = staticLayer.getStage().getWidth() - GAMER_FRAME_CONFIG.x - 20;
		gamerFrame = new Kinetic.Rect(GAMER_FRAME_CONFIG);
		avatar = new Kinetic.Image({ x: GAMER_FRAME_CONFIG.x + GAMER_FRAME_CONFIG.width - 210, y: GAMER_FRAME_CONFIG.y + GAMER_FRAME_CONFIG.height - 220, scale:{x:0.8,y:0.8}, image: images["avatar"] });
		staticLayer.add(gamerFrame);
		staticLayer.add(avatar);
	};
	
	function moveToMonkey(done) {
		console.log("switch to monkey");
		/*monkey.moveTo(dynamicLayer);
		monkeyFrame.moveTo(dynamicLayer);
		gamerFrame.moveTo(dynamicLayer);
		staticLayer.draw();*/
		//avatar.transitionTo({x: 20, duration: 2});
		monkey.transitionTo({x:ACTIVE_FRAME_WIDTH + MONKEY_FRAME_CONFIG.x - 175, callback: done, duration: 2});
		monkeyFrame.transitionTo({alpha: ACTIVE_FRAME_ALPHA, width: ACTIVE_FRAME_WIDTH, duration: 2});
		gamerFrame.transitionTo({alpha: INACTIVE_FRAME_ALPHA, x: GAMER_FRAME_CONFIG.x + (ACTIVE_FRAME_WIDTH - INACTIVE_FRAME_WIDTH), width: INACTIVE_FRAME_WIDTH, duration: 2});
	};

	/**
	 * Prepare the view
	 * @param {Function} done
	 */
	function prepare(done) {
		loadImages(done);
	};

	
	/**
	 * Load images
	 * @param {Function} done
	 */
	function loadImages(done) {
		evm.loadImages({
			/** @const */ "monkey": "monkey.png",
			/** @const */ "avatar": "Boo-icon.png"
		}, images, function() {
			done();
		});
	};
	
	/**
	 * Initiate the prepared view
	 * @param {GameMode} gameMode
	 */
	function init(gameMode) {
		setupMainFrame();
		if (gameMode == GameMode.MONKEY_SEE || gameMode == GameMode.MONKEY_DO) {
			setupMonkey();
		}
		setupAvatar();
	};

	
/*----------------------------------------------------------------------------*/
	

	
	/**
	 * @param {EventManager} eventManager
	 */
	this.setEventManager = function(eventManager) {
		evm = eventManager;
	};
	
	/**
	 * @param {Kinetic.Layer} layer
	 */
	this.setStaticLayer = function(layer) {
		staticLayer = layer;
	};
		
	/**
	 * @param {Kinetic.Layer} layer
	 */
	this.setDynamicLayer = function(layer) {
		dynamicLayer = layer;
	};
	
	/**
	 * @param {Function} done
	 */
	this.moveToMonkey = function(done) {
		moveToMonkey(done);
	};
	
	/**
	 * @param {GameMode} gameMode
	 */
	this.basicInit = function(gameMode) {
		init(gameMode);
	};
	
	/**
	 * @param {Function} done
	 */
	this.basicPrepare = function(done) {
		prepare(done);
	};

}
