/**
 * @constructor
 */
function GameView() {
	
	/** @type {EventManager} */ var evm = new NoEventManager(); 
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
	
	var MONKEY_FRAME_CONFIG_INACTIVE = {
		x: 20, y: 20, width: INACTIVE_FRAME_WIDTH, height: 730,
		fill: "white", alpha: INACTIVE_FRAME_ALPHA
	};
	
	var GAMER_FRAME_CONFIG_ACTIVE = {
		x: 260, y: 20, width: ACTIVE_FRAME_WIDTH, height: 730,
		fill: "white", alpha: ACTIVE_FRAME_ALPHA
	};
	var GAMER_FRAME_CONFIG_INACTIVE = {
		y: GAMER_FRAME_CONFIG_ACTIVE.y,
		alpha: INACTIVE_FRAME_ALPHA,
		x: GAMER_FRAME_CONFIG_ACTIVE.x + (ACTIVE_FRAME_WIDTH - INACTIVE_FRAME_WIDTH),
		width: INACTIVE_FRAME_WIDTH,
		height: GAMER_FRAME_CONFIG_ACTIVE.height,
		fill: GAMER_FRAME_CONFIG_ACTIVE.fill
	}
	var MONKEY_FRAME_CONFIG_ACTIVE = {
		alpha: ACTIVE_FRAME_ALPHA,
		width: ACTIVE_FRAME_WIDTH,
		y: MONKEY_FRAME_CONFIG_INACTIVE.y,
		x: MONKEY_FRAME_CONFIG_INACTIVE.x,
		height: MONKEY_FRAME_CONFIG_INACTIVE.height,
		fill: MONKEY_FRAME_CONFIG_INACTIVE.fill
	};
	var MONKEY_CONFIG_ACTIVE = {x:ACTIVE_FRAME_WIDTH + MONKEY_FRAME_CONFIG_INACTIVE.x - 175, y: 540};
	var MONKEY_CONFIG_INACTIVE = {x: 60, y: 540};
	
	/**
	 * @param {GameState} gameState
	 */
	function setupMainFrame(gameState) {
		var mode = gameState.getMode();
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
	
	/**
	 * @param {GameState} gameState
	 */
	function setupMonkey(gameState) {
		var mode = gameState.getMode();
		var config = (mode == GameMode.MONKEY_DO && gameState.getMonkeyDoRounds() > 1) ?
				MONKEY_FRAME_CONFIG_ACTIVE : MONKEY_FRAME_CONFIG_INACTIVE;
		var monkeyConfig = (mode == GameMode.MONKEY_DO && gameState.getMonkeyDoRounds() > 1) ?
				MONKEY_CONFIG_ACTIVE : MONKEY_CONFIG_INACTIVE;
		var stage = staticLayer.getStage();
		//MONKEY_FRAME_CONFIG.height = staticLayer.getStage().getHeight()-40;
		monkeyFrame = new Kinetic.Rect(config);
		monkey = new Kinetic.Image({x:monkeyConfig.x, y:monkeyConfig.y, image: images["monkey"] });
		staticLayer.add(monkeyFrame);
		staticLayer.add(monkey);
	};
	
	function setupAngel(gameState) {
		var config = MONKEY_FRAME_CONFIG_ACTIVE;
		var monkeyConfig = MONKEY_CONFIG_ACTIVE;
		var stage = staticLayer.getStage();
		//MONKEY_FRAME_CONFIG.height = staticLayer.getStage().getHeight()-40;
		var angelFrame = new Kinetic.Rect(config);
		var angel = new Kinetic.Image({x:500, y:450, image: images["rafiki"], width: 200, height: 280 });
		staticLayer.add(angelFrame);
		staticLayer.add(angel);
	};
	
	/**
	 * @param {GameState} gameState
	 */
	function setupAvatar(gameState) {
		var mode = gameState.getMode();
		var config = (mode == GameMode.MONKEY_DO && gameState.getMonkeyDoRounds() > 1 || mode == GameMode.GUARDIAN_ANGEL) ?
				GAMER_FRAME_CONFIG_INACTIVE : GAMER_FRAME_CONFIG_ACTIVE;
		//GAMER_FRAME_CONFIG_ACTIVE.height = staticLayer.getStage().getHeight()-40;
		//GAMER_FRAME_CONFIG.width = staticLayer.getStage().getWidth() - GAMER_FRAME_CONFIG.x - 20;
		gamerFrame = new Kinetic.Rect(config);
		avatar = new Kinetic.Image({ x: GAMER_FRAME_CONFIG_ACTIVE.x + GAMER_FRAME_CONFIG_ACTIVE.width - 210, y: GAMER_FRAME_CONFIG_ACTIVE.y + GAMER_FRAME_CONFIG_ACTIVE.height - 220, scale:{x:0.8,y:0.8}, image: images["avatar"] });
		staticLayer.add(gamerFrame);
		staticLayer.add(avatar);
	};
	
	var moved = 0;
	var moveDone = function(done) {
		moved++;
		if (moved == 3) {
			done();
			staticLayer.draw();
			evm.forget("GameView");
		}
	};
	function moveToMonkey(done) {
		evm.play(Sounds.MAGIC_CHIMES);
		var stage = staticLayer.getStage();
		evm.on("frame", function() {
			staticLayer.draw();
		}, "GameView");
		Tween.get(monkey.attrs).to(MONKEY_CONFIG_ACTIVE, 2000).call(function() { moveDone(done); });
		Tween.get(monkeyFrame.attrs).to(MONKEY_FRAME_CONFIG_ACTIVE, 2000).call(function() { moveDone(done); });
		Tween.get(gamerFrame.attrs).to(GAMER_FRAME_CONFIG_INACTIVE, 2000).call(function() { moveDone(done); });
	};
	
	/**
	 * Initiate the view
	 * @param {GameState} gameState
	 */
	function init(gameState) {
		moved = 0;
		setupMainFrame(gameState);
		if (gameState.getMode() == GameMode.MONKEY_SEE || gameState.getMode() == GameMode.MONKEY_DO) {
			setupMonkey(gameState);
		}
		if (gameState.getMode() == GameMode.GUARDIAN_ANGEL) {
			setupAngel(gameState);
		}
		setupAvatar(gameState);
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
	 * @param {GameState} gameState
	 */
	this.basicInit = function(gameState) {
		init(gameState);
	};

}
