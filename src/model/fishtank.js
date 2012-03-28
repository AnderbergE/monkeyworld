/**
 * @constructor
 * @param {EventManager} ieventManager
 * @param {Object} config 
 * @implements {ModelModule}
 * @implements {GameEventListener}
 * @extends {GameModule}
 */
function FishingGame(ieventManager, config) {
	this._name = "FishingGame";
	this.toString = function() { return "Fish Tank"; };
	var eventManager = ieventManager;
	var fishArray = new Array();
	var basketArray = new Array();
	var basketSize = 0;
	/** @const */ var WIDTH = 625;
	/** @const */ var HEIGHT = 600;
	
	eventManager.registerListener(this);
	
	this.init = function(config) {
		var maxNumber = config.maxNumber;
		var numberFishes = config.numberFishes;
		/** @const {number} */ var NBR_IMAGES = 2;
		/** @enum {Object} */ var Starts = {
			0: {x:150, y:200},
			1: {x:400, y:250},
			2: {x:300, y:370},
			3: {x:500, y:490},
			4: {x:200, y:125}
		};
		
		for (var i = 0; i < numberFishes; i++) {
			var pos = Starts[i % 5];
			fishArray.push(new Fish(
				eventManager,
				Math.floor(Math.random() * (maxNumber + 1)),
				pos.x,
				pos.y,
				Math.floor(Math.random() * NBR_IMAGES)
			));
		}
		
		return { width: WIDTH, height: HEIGHT };
	};
	
	this.notify = function(event) {
		if (event instanceof FrameEvent) {
			for (var i = 0; i < fishArray.length; i++) {
				var fish = fishArray[i];
				var x = fish.getX();
				if (fish.getDirection() > 0 && x >= WIDTH - fish.getScaledWidth() / 2) {
					fish.hitRightWall(WIDTH - fish.getScaledWidth() / 2);
				} else if (fish.getDirection() < 0 && x <= fish.getScaledWidth() / 2) {
					fish.hitLeftWall(fish.getScaledWidth() / 2);
				}
			}
		}
		
	};	
	
	eventManager.on("fishinggame.turnOnClicks", function() {
		for (var i = 0; i < fishArray.length; i++) {
			eventManager.tell("fishinggame.turnOnClick", {fish:fishArray[i]});	
		}
	});
	
	eventManager.on("fishinggame.turnOffClicks", function() {
		for (var i = 0; i < fishArray.length; i++) {
			eventManager.tell("fishinggame.turnOffClick", {fish:fishArray[i]});	
		}
	});
	
	this.getAllFish = function() {
		return fishArray;
	};
	
	this.putFishInBasket = function(fish) {
		console.log("Put fish " + fish + " in basket.");
		for (var i = 0; i < fishArray.length; i++) {
			if (fishArray[i] === fish) {
				fishArray.splice(i, 1);
			}
		}
		basketArray.push(fish);
		basketSize++;
	};
	
	this.getNextBasketSlot = function() {
		return basketSize;
	};
}
FishingGame.prototype = GameModule.prototype;

