/**
 * @constructor
 * @param {EventManager} evm
 * @param {Object} gameState 
 * @extends {GameModule}
 */
function FishingGame(evm, gameState, config) {
	var mode = gameState.getMode();
	Log.debug("Applying " + mode + " Mode", "model");
	/** @const @type {string} */ var EVM_TAG = "FishingGame";
	
	this._name = "FishingGame";
	this.toString = function() { return "Fish Tank"; };
	var fishArray = new Array();
	var basketArray = new Array();
	var basketSize = 0;
	var correctCaptured = 0;
	var catchingNumber = 2;
	var numberCorrect = 1;
	
	/** @const */ var WIDTH = 1;
	/** @const */ var HEIGHT = 1;
	/** @enum {Object} */ var Starts = {
			0: {x:0.3, y:0.3},
			1: {x:0.8, y:0.4},
			2: {x:0.6, y:0.6},
			3: {x:1, y:0.8},
			4: {x:0.4, y:0.2}
		};
	
	this.getCatchingNumber = function() { return catchingNumber };
	this.init = function() {
		var maxNumber = config.maxNumber;
		var numberFishes = config.numberFishes;
		/** @const {number} */ var NBR_IMAGES = 2;
		
		var numbers = Utils.crookedRandoms(1, maxNumber, numberFishes,
				                           catchingNumber, numberCorrect, true);
		var id = 0;
		for (var i = 0; i < numberFishes; i++) {
			var pos = Starts[i % 5];
			fishArray.push(new Fish(
				evm,
				id++,
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
		}	
	};
	
	this.getNumberOfCorrectFish = function() {
		return numberCorrect;
	};
	
	this.turnOffClicks = function() {
		Log.debug("Turning off clicks", "FishingGame");
		for (var i = 0; i < fishArray.length; i++) {
			evm.tell("fishinggame.turnOffClick", {fish:fishArray[i]});
		}
	};
	
	function capturedWantedFish() {
		return correctCaptured == numberCorrect || basketSize == fishArray.length;
	};
	
	var useTimer = true;
	this.turnOffInactivityTimer = function() {
		useTimer = false;
	};
	
	function inactivity() {
		var sound = null;
		if (mode == GameMode.CHILD_PLAY) {
			sound = Sounds.FISHING_THERE_ARE_MORE;
		} else {
			sound = Sounds.FISHING_KEEP_GOING;
		}
		evm.tell("FishingGame.inactivity", {sound:sound});
		restartInactivityTimer();
	}
	
	var timer = null;
	
	function restartInactivityTimer() {
		if (useTimer && !capturedWantedFish()) {
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
			this.addAction("correct");
		} else {
			this.addAction("incorrect");
		}
		checkEndOfRound();
	};
	var that = this;
	var checkEndOfRound = function() {
		if (capturedWantedFish()) {
			for (var i = 0; i < fishArray.length; i++) {
				if (fishArray[i].getNumber() == catchingNumber) {
					fishArray[i].setCanFree(false);
				}
			}
			if (basketSize == numberCorrect || mode == GameMode.MONKEY_SEE || mode == GameMode.MONKEY_DO) {
				if (basketSize != numberCorrect) {
					that.reportMistake();
				}
				that.addAction("FishingGame.catchingDone");
				evm.tell("FishingGame.catchingDone");
			} else {
				evm.tell("FishingGame.freeWrongOnes");
			}
		}
	};
	
	var removeFishFromBasket = function(fish) {
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
	
	/**
	 * Catch a fish.
	 * @param {Fish} fish A fish in the pond that should be captured. 
	 */
	this.catchFish = function(fish, done) {
		evm.tell("FishingGame.catch", {
			fish: fish,
			done: done
		});
	};
	
	/**
	 * Free a fish.
	 * @param {Fish} fish A fish in the basket that should be free'd.
	 */
	this.freeFish = function(fish, done) {
		if (fish.getNumber() == numberCorrect)
			this.addAction("freeCorrect");
		else
			this.addAction("freeIncorrect");
		evm.tell("FishingGame.free", {
			fish: fish,
			done: function() {
				removeFishFromBasket(fish);
				fish.free();
				done();
			}
		});
	};

	
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
		return [1, 2, 3, 4];
	};
	
	/**
	 * Lets the player count the fish in the basket.
	 * @param {number} number What the player thinks the correct number is.
	 */
	this.countFish = function(number) {
		this.addAction(number);
		var correct = number == numberCorrect;
		if (!correct)
			this.reportMistake();
		evm.tell("FishingGame.counted", { number: number });
		evm.tell(
			"FishingGame.countingResult",
			{ correct: correct }
		);
	}
	
	/**
	 * Called when the game starts.
	 */
	this.start = function() {
		restartInactivityTimer();
	};
	
	/**
	 * Returns a fish that should be captured. If no such fish exists in the
	 * pond, null is returned.
	 * @return {Fish|null} A catchable fish with the correct number, if it
	 *                     exists. Otherwise null.
	 */
	this.getOneCorrectFish = function() {
		for (var i = 0; i < fishArray.length; i++) {
			var fish = fishArray[i];
			if (!fish.isCaptured() && fish.getNumber() == catchingNumber) {
				return fish;
			}
		};
		return null;
	};
	
	/**
	 * Returns a fish that should not be captured. If no such fish exists in
	 * the pond, null i returned.
	 * @return {Fish|null} A catchable fish with an incorrect number, if it
	 *                     exists. Otherwise null.
	 */
	this.getOneIncorrectFish = function() {
		for (var i = 0; i < fishArray.length; i++) {
			var fish = fishArray[i];
			if (!fish.isCaptured() && fish.getNumber() != catchingNumber) {
				return fish;
			}
		};
		return null;
	};
	
	/**
	 * Returns a fish that has been captured, but shouldn't. If no such fish
	 * exists in the basket, null is returned.
	 * @return {Fish|null} A captured fish with incorrect number, if it exists.
	 *                     Otherwise null. 
	 */
	this.getOneIncorrectlyCapturedFish = function() {
		for (var i = 0; i < fishArray.length; i++) {
			if (fishArray[i].isCaptured() && fishArray[i].getNumber() != catchingNumber) {
				return fishArray[i];
			}
		};
		return null;
	};
	
	/**
	 * Returns a fish that has been captured, and should be captured. If no such
	 * fish exists in the basket, null is returned.
	 * @return {Fish|null} A captured fish with correct number, if it exists.
	 *                     Otherwise null. 
	 */
	this.getOneCorrectlyCapturedFish = function() {
		for (var i = 0; i < fishArray.length; i++) {
			if (fishArray[i].isCaptured() && fishArray[i].getNumber() == catchingNumber) {
				return fishArray[i];
			}
		};
		return null;
	};
	
	this.readyToCount = function() {
		evm.tell("FishingGame.countingStarted", {});
	};
	
	/**
	 * Tell the game that the result of the fish counting part has been
	 * understood.
	 */
	this.acceptedCountingResult = function() {
		this.roundDone();
	};
}
FishingGame.prototype = new GameModule();

