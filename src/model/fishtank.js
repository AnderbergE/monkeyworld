/**
 * @constructor
 * @param {EventManager} ievm
 * @param {Object} config 
 * @implements {ModelModule}
 * @implements {GameEventListener}
 * @extends {GameModule}
 */
function FishingGame(ievm, config) {
	this._name = "FishingGame";
	this.toString = function() { return "Fish Tank"; };
	var evm = ievm;
	var fishArray = new Array();
	var basketArray = new Array();
	var basketSize = 0;
	/** @const */ var WIDTH = 625;
	/** @const */ var HEIGHT = 600;
	/** @enum {Object} */ var Starts = {
			0: {x:150, y:200, occ: false },
			1: {x:400, y:250, occ: false },
			2: {x:300, y:370, occ: false },
			3: {x:500, y:490, occ: false },
			4: {x:200, y:125, occ: false }
		};
	
	var catchingNumber = 3;
	
	evm.registerListener(this);
	
	this.getCatchingNumber = function() { return catchingNumber };
	this.init = function(config) {
		var maxNumber = config.maxNumber;
		var numberFishes = config.numberFishes;
		/** @const {number} */ var NBR_IMAGES = 2;
		
		for (var i = 0; i < numberFishes; i++) {
			var pos = Starts[i % 5];
			fishArray.push(new Fish(
				evm,
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
	
	evm.on("fishinggame.turnOnClicks", function() {
		for (var i = 0; i < fishArray.length; i++) {
			evm.tell("fishinggame.turnOnClick", {fish:fishArray[i]});
			//fishArray[i].setClickable(true);
		}
	});
	
	evm.on("fishinggame.turnOffClicks", function() {
		for (var i = 0; i < fishArray.length; i++) {
			evm.tell("fishinggame.turnOffClick", {fish:fishArray[i]});
			//fishArray[i].setClickable(false);
		}
	});
	
	
	
	this.getAllFish = function() {
		return fishArray;
	};
	
	this.putFishInBasket = function(fish) {
		var slot = this.getNextBasketSlot();
		if (slot == basketArray.length) {
			basketArray.push(fish);	
		} else {
			basketArray[slot] = fish;
		}
		
		basketSize++;
	};
	
	this.removeFishFromBasket = function(fish) {
		for (var i = 0; i < basketArray.length; i++) {
			if (basketArray[i] === fish) {
				basketArray[i] = undefined;
			}
		}
	}
	
	this.getNextBasketSlot = function() {
		var min = 1000;
		var foundAny = false;
		for (var i = 0; i < basketArray.length; i++) {
			if (basketArray[i] === undefined && i < min) {
				min = i;
				foundAny = true;
			}
		}
		if (!foundAny) {
			return basketArray.length;
		} else {
			return min;	
		}
	};
}
FishingGame.prototype = new GameModule();

