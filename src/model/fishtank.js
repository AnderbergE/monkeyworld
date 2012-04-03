/**
 * @constructor
 * @param {EventManager} ievm
 * @param {Object} config
 * @param {Object} mode 
 * @implements {ModelModule}
 * @extends {GameModule}
 */
function FishingGame(ievm, mode) {
	Log.debug("Applying " + mode + " Mode", "model");
	/** @const @type {string} */ var EVM_TAG = "FishingGame";
	
	this._name = "FishingGame";
	this.toString = function() { return "Fish Tank"; };
	var evm = ievm;
	var fishArray = new Array();
	var basketArray = new Array();
	var basketSize = 0;
	var correctCaptured = 0;
	var catchingNumber = 2;
	var numberCorrect = 1;

	/** @const */ var WIDTH = 625;
	/** @const */ var HEIGHT = 600;
	/** @enum {Object} */ var Starts = {
			0: {x:150, y:200, occ: false },
			1: {x:400, y:250, occ: false },
			2: {x:300, y:370, occ: false },
			3: {x:500, y:490, occ: false },
			4: {x:200, y:125, occ: false }
		};
	
	
	this.getCatchingNumber = function() { return catchingNumber };
	this.init = function(config) {
		var maxNumber = config.maxNumber;
		var numberFishes = config.numberFishes;
		/** @const {number} */ var NBR_IMAGES = 2;
		
		var numbers = Utils.crookedRandoms(1, maxNumber, numberFishes, catchingNumber, numberCorrect, true);
		
		for (var i = 0; i < numberFishes; i++) {
			var pos = Starts[i % 5];
			fishArray.push(new Fish(
				evm,
				numbers[i],
				pos.x,
				pos.y,
				Math.floor(Math.random() * NBR_IMAGES)
			));
		}
		
		return { width: WIDTH, height: HEIGHT };
	};
	
	this.onFrame = function(frame) {
		for (var i = 0; i < fishArray.length; i++) {
			var fish = fishArray[i];
			fish.onFrame(frame);
			var x = fish.getX();
			if (fish.getDirection() > 0 && x >= WIDTH - fish.getScaledWidth() / 2) {
				fish.hitRightWall(WIDTH - fish.getScaledWidth() / 2);
			} else if (fish.getDirection() < 0 && x <= fish.getScaledWidth() / 2) {
				fish.hitLeftWall(fish.getScaledWidth() / 2);
			}
		}
	};

	this.turnOnClicks = function() {
		for (var i = 0; i < fishArray.length; i++) {
			evm.tell("fishinggame.turnOnClick", {fish:fishArray[i]});
			//fishArray[i].setClickable(true);
		}	
	};
	
	this.turnOffClicks = function() {
		for (var i = 0; i < fishArray.length; i++) {
			evm.tell("fishinggame.turnOffClick", {fish:fishArray[i]});
			//fishArray[i].setClickable(false);
		}
	};

	/*evm.on("Game.startGame", function(msg) {
		Log.debug("I'm still alive!");
	}, EVM_TAG);*/
	
	function capturedWantedFish() {
		return correctCaptured == numberCorrect || basketSize == fishArray.length;
	};
	
	function inactivity() {
		var sound = Sounds.FISHING_THERE_ARE_MORE;
		evm.tell("FishingGame.inactivity", {sound:sound});
		restartInactivityTimer();
	}
	
	var timer = null;
	
	function restartInactivityTimer() {
		if (!capturedWantedFish()) {
			timer = setTimeout(inactivity, 5000);
		}
	}
	
	this.activity = function() {
		if (timer != null)
			clearTimeout(timer);
	};
	
	this.noactivity = function() {
		restartInactivityTimer();
	}
	
	/*evm.on("fishinggame.started", function(msg) {
		restartInactivityTimer();
	});*/

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
		if (fish.getNumber() == catchingNumber) {
			correctCaptured++;
		} 
		checkEndOfRound();
	};
	
	var checkEndOfRound = function() {
		if (capturedWantedFish()) {
			for (var i = 0; i < fishArray.length; i++) {
				if (fishArray[i].getNumber() == catchingNumber) {
					fishArray[i].setCanFree(false);
				}
			}
			evm.tell(
				"FishingGame.endOfRound",
				{ correct: basketSize == numberCorrect }
			);
		}
	};
	
	this.removeFishFromBasket = function(fish) {
		for (var i = 0; i < basketArray.length; i++) {
			if (basketArray[i] === fish) {
				basketArray[i] = undefined;
			}
		}
		basketSize--;
		if (fish.getNumber() == catchingNumber) {
			correctCaptured--;
		}
		checkEndOfRound();
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
	
	this.getBasket = function() {
		return basketArray;
	};
	
	/**
	 * Gets the choices the player can make when counting the fish in the
	 * basket.
	 * @return {Array.<number>} array of choices 
	 */
	this.getCountingChoices = function() {
		return [1, 2, 3, 4, 5];
	};
	
	function numberFishInBasket() {
		var sum = 0;
		for (var i = 0; i < basketArray.length; i++) {
			if (basketArray[i] != undefined)
				sum++;
		}
		return sum;
	}
	
	/**
	 * Lets the player count the fish in the basket.
	 */
	this.countFish = function(number) {
		evm.tell(
			"FishingGame.countingResult",
			{ correct: number == numberFishInBasket() }
		);
	}
	
	this.tearDown = function() {
		//evm.forget(EVM_TAG);
	};
	
	this.start = function() {
		restartInactivityTimer();
	};
}
FishingGame.prototype = new GameModule();

