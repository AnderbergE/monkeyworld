/**
 * Sets up and shows the fish counting view in the fishing game.
 * 
 * @constructor
 * @param {Kinetic.Stage} stage
 * @param {EventManager} evm
 */
function FishCountingView(stage, evm, EVM_TAG) {

	/** @type {FishCountingView} */ var that = this;
	
	/** @const */ var GRID_POSITION   = { x: 700 , y: 150 };
	/** @const */ var GRID_STEP       = { x: 100,  y: 150 };
	/** @const */ var GRID_WIDTH      = 2;
	/** @const */ var GRID_FONT       = "Arial";
	/** @const */ var GRID_FONT_COLOR = "red";
	/** @const */ var BASKET_CONFIG = {
		/** @const */ x: 200,
		/** @const */ y: 200,
		/** @const */ width: 300,
		/** @const */ height: 500,
		/** @const */ stroke: "black",
		/** @const */ strokeWidth: 3
	};

	/** @type {FishingGame}   */ var fishTank = null;
	/** @type {Kinetic.Layer} */ var backgroundLayer = new Kinetic.Layer();
	/** @type {Kinetic.Layer} */ var shapeLayer = new Kinetic.Layer();
	stage.add(backgroundLayer);
	stage.add(shapeLayer);
	
	/**
	 * Creates a number button for the user to click on.
	 * 
	 * @param x   {number} Position of button on x axis 
	 * @param y   {number} Position of button on y axis
	 * @param num {number} Number that the button represents
	 */
	function createNumber(x, y, num) {
		var numGroup = new Kinetic.Group({
			x: x, y: y
		});
		var rect = new Kinetic.Rect({
			width: 100,
			height: 100
		});
		var number = new Kinetic.Text({
			text: num,
			fontSize: 72,
			fontFamily: GRID_FONT,
			textFill: GRID_FONT_COLOR,
			textStroke: "black",
			textStrokeWidth: 2
		});
		numGroup.add(rect);
		numGroup.add(number);
		numGroup._num = number;
		numGroup.on("mousedown touchstart", function() {
			fishTank.countFish(num);
		});
		shapeLayer.add(numGroup);
	};
	
	/**
	 * Sets up the counting view in the Fishing Game.
	 * @param ifishTank  {FishingGame}
	 * @param fishGroups {Kinetic.Group} 
	 */
	this.init = function(ifishTank, fishGroups) {
		fishTank = ifishTank;
		Log.debug("Setting up FishCountingView", "view");
		
		var backgroundRect = new Kinetic.Rect({
			x: 0, y: 0,
			width: stage.width, height: stage.height,
			fill: "white"
		});
		backgroundLayer.add(backgroundRect);
		backgroundLayer.draw();
		var basketRect = new Kinetic.Rect(BASKET_CONFIG);
		shapeLayer.add(basketRect);

		/*
		 * Insert fish
		 */
		var basket = fishTank.getBasket();
		var fishGrid = Utils.gridizer(
			BASKET_CONFIG.x + 75, BASKET_CONFIG.y + 100,
			135, 135, 2
		);
		/*
		 * Not very stylish to have to check if the basket slot is defined, but
		 * that's how the basketArray is treated in the main fishing view,
		 * when fish are thrown back into the pond (to save the slot for the
		 * next fish that we may catch).
		 */
		for (var i = 0; i < basket.length; i++) { if (basket[i] != undefined) {
			var fish = basket[i];
			var pos = fishGrid.next();
			fishGroups[fish].x = pos.x;
			fishGroups[fish].y = pos.y;
			shapeLayer.add(fishGroups[fish]);
		}}
		
		/*
		 * Insert choices
		 */
		var choices = fishTank.getCountingChoices();
		var choiceGrid = Utils.gridizer(
			GRID_POSITION.x, GRID_POSITION.y,
			GRID_STEP.x, GRID_STEP.y, GRID_WIDTH
		);
		for (var i = 0; i < choices.length; i++) {
			var pos = choiceGrid.next();
			createNumber(pos.x, pos.y, choices[i]);
		}

		shapeLayer.draw();
		if (fishTank.getMode() == GameMode.CHILD_PLAY)
			evm.play(Sounds.FISHING_COUNT_FISH);
		else {
			evm.play(Sounds.FISHING_COUNT_TARGET_FISH);
			setTimeout(function() {
				evm.play(Sounds["NUMBER_" + fishTank.getCatchingNumber()]);
			}, 700);
		}
	};
	
	/**
	 * Tears down the view
	 */
	this.tearDown = function() {
		stage.remove(shapeLayer);
		stage.remove(backgroundLayer);
	};
	
	/**
	 * What to do when the game module has evaluated the user's count. 
	 */
	evm.on("FishingGame.countingResult", function(msg) {
		if (msg.correct) {
			evm.play(Sounds.YAY);
			setTimeout(function(){fishTank.tearDown()}, 1500);
		} else {
			evm.play(Sounds.FISHING_ARE_YOU_SURE);
		}
	}, EVM_TAG);
	
}
