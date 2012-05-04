/**
 * @constructor 
 * @extends {MiniGame}
 */
function FishingGame() {
	/** @type {FishingGame} */ var that = this;
	this.tag("FishingGame");
	//var evm = this.evm;

	var mode = that.game.getMode();
	Log.debug("Applying " + mode + " Mode", "model");
	
	this._name = "FishingGame";
	this.toString = function() { return "Fish Tank"; };
	var fishArray = new Array();
	var basketArray = new Array();
	var basketSize = 0;
	var correctCaptured = 0;
	var targetNumber = Settings.get("miniGames", "fishingGame", "targetNumber");
	var numberCorrect = Settings.get("miniGames", "fishingGame", "numberCorrect");
	var numberFishes = Settings.get("miniGames", "fishingGame", "numberOfFish");
	var maxNumber = Settings.get("miniGames", "fishingGame", "maxNumber");
	
	/** @const */ var WIDTH = 1;
	///** @const */ var HEIGHT = 1;
	/** @enum {Object} */ var Starts = {
		0: {x:0.3, y:0.3},
		1: {x:0.8, y:0.4},
		2: {x:0.6, y:0.6},
		3: {x:1, y:0.65},
		4: {x:0.4, y:0.2},
		5: {x:0.1, y: 0.5},
		6: {x:1, y: 0.8},
		7: {x:0.8, y: 0.2}
	};
	
	/** @const {number} */ var NBR_IMAGES = 7;
	var numbers = Utils.crookedRandoms(1, maxNumber, numberFishes,
			                           targetNumber, numberCorrect, true);
	var id = 0;
	for (var i = 0; i < numberFishes; i++) {
		var pos = Starts[i % 7];
		fishArray.push(new Fish(
			this.evm,
			id++,
			numbers[i],
			pos.x,
			pos.y,
			Math.floor(Math.random() * NBR_IMAGES)
		));
	}
	
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
			that.tell("fishinggame.turnOnClick", {fish:fishArray[i]});
		}	
	};
	
	this.getNumberOfFish = function() { return fishArray.length; };
	
	/**
	 * The number of fish that carries the correct number.
	 * @returns {number} the amount of fish that carries the correct number.
	 */
	this.getNumberOfCorrectFish = function() { return numberCorrect; };
	
	/**
	 * Get the number that should be catched.
	 * @returns {number} the number that should be catched.
	 */
	this.getTargetNumber = function() { return targetNumber; };
	
	this.turnOffClicks = function() {
		Log.debug("Turning off clicks", "FishingGame");
		for (var i = 0; i < fishArray.length; i++) {
			that.tell("fishinggame.turnOffClick", {fish:fishArray[i]});
		}
	};
	
	/**
	 * Checks if all the wanted fish are captured.
	 * @returns {boolean}
	 */
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
			that.tell("FishingGame.inactivity", {sound:sound});
			restartInactivityTimer();
		} else if (mode == GameMode.MONKEY_SEE){
			sound = Sounds.FISHING_KEEP_GOING;
			that.tell("FishingGame.inactivity", {sound:sound});
			restartInactivityTimer();
		}
	}
	
	var timer = null;
	
	function restartInactivityTimer() {
		if (useTimer && !capturedWantedFish()) {
			timer = that.setTimeout(inactivity, 5000);
		}
	}
	
	this.activity = function() {
		if (timer != null)
			that.clearTimeout(timer);
	};
	
	this.noactivity = function() {
		restartInactivityTimer();
	};

	/**
	 * Get an Array with all the fish in the game.
	 * @returns {Array.<Fish>}
	 */
	this.getAllFish = function() {
		return fishArray;
	};
	
	/**
	 * @private
	 * Put the specified fish in the basket.
	 * @param {Fish} fish the fish to put in the basket
	 */
	this._putFishInBasket = function(fish) {
		var slot = this.getNextBasketSlot();
		if (slot == basketArray.length) {
			basketArray.push(fish);	
		} else {
			basketArray[slot] = fish;
		}
		basketSize++;
		if (fish.getTargetNumber() == targetNumber) {
			correctCaptured++;
			this.addAction("correct");
		} else {
			this.addAction("incorrect");
		}
		fish.capture();
	};
	
	this.stop = function() {
		this.activity();
	};
	
	/**
	 * @private
	 * Check if the fishing round is over.
	 */
	var _checkEndOfRound = function() {
		if (capturedWantedFish()) {
			for (var i = 0; i < fishArray.length; i++) {
				if (fishArray[i].getTargetNumber() == targetNumber) {
					fishArray[i].setCanFree(false);
				}
			}
			if (basketSize == numberCorrect || mode == GameMode.MONKEY_SEE || mode == GameMode.MONKEY_DO) {
				if (basketSize != numberCorrect) {
					that.reportMistake();
				}
				that.addAction("FishingGame.catchingDone");
				that.tell("FishingGame.catchingDone", {
					callback: function() {
						that.tell("FishingGame.countingStarted");
					}
				});
			} else {
				that.tell("FishingGame.freeWrongOnes");
			}
		}
	};
	
	/**
	 * @private
	 * Free a fish from the basket.
	 * @param {Fish} fish the fish to free.
	 */
	var _removeFishFromBasket = function(fish) {
		for (var i = 0; i < basketArray.length; i++) {
			if (basketArray[i] === fish) {
				basketArray[i] = undefined;
			}
		}
		basketSize--;
		if (fish.getTargetNumber() == targetNumber) {
			correctCaptured--;
		}
		_checkEndOfRound();
	};
	
	var _hooked = function(fish) {
		fish.hooked();	
	};
	
	/**
	 * Catch a fish.
	 * @param {Fish} fish A fish in the pond that should be captured.
	 * @param {Function} done What to do when the fish has been caught.
	 */
	this.catchFish = function(fish, done) {
		//
		that.tell("FishingGame.catch", {
			fish: fish,
			hooked: _hooked, 
			done: function() {
				that._putFishInBasket(fish);
				_checkEndOfRound();
				if (done != undefined)
					done();
			} 
		});
	};
	
	/**
	 * Free a fish.
	 * @param {Fish} fish A fish in the basket that should be free'd.
	 */
	this.freeFish = function(fish, done) {
		if (fish.getTargetNumber() == numberCorrect)
			this.addAction("freeCorrect");
		else
			this.addAction("freeIncorrect");
		that.tell("FishingGame.free", {
			fish: fish,
			done: function() {
				_removeFishFromBasket(fish);
				fish.free();
				if (done != undefined)
					done();
			}
		});
	};

	/**
	 * Get the basket slot with the lowest position number that is free.
	 * @returns {number} a position in the basket Array.
	 */
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
	
	/**
	 * Gets an Array with all the fish in the basket.
	 * @returns {Array.<Fish>}
	 */
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
	
	var countTimes = 0;
	/**
	 * Lets the player count the fish in the basket.
	 * @param {number} number What the player thinks the correct number is.
	 */
	this.countFish = function(number) {
		if (that.game.getMode() === GameMode.MONKEY_SEE && countTimes == 0 ||
			that.game.getMode() != GameMode.MONKEY_SEE) {
			countTimes++;
			this.addAction(number);
			var seemCorrect = number == numberCorrect || that.game.getMode() != GameMode.CHILD_PLAY;
			var reallyCorrect = number == numberCorrect;
			if (!reallyCorrect)
				this.reportMistake();
			that.tell("FishingGame.counted", { number: number });
			that.tell(
				"FishingGame.countingResult",
				{ correct: seemCorrect }
			);
		}
	};
	
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
			if (!fish.isCaptured() && fish.getTargetNumber() == targetNumber) {
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
			if (!fish.isCaptured() && fish.getTargetNumber() != targetNumber) {
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
			if (fishArray[i].isCaptured() && fishArray[i].getTargetNumber() != targetNumber) {
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
			if (fishArray[i].isCaptured() && fishArray[i].getTargetNumber() == targetNumber) {
				return fishArray[i];
			}
		};
		return null;
	};
	
	/**
	 * Tell the game that the result of the fish counting part has been
	 * understood.
	 */
	this.acceptedCountingResult = function() {
		this.roundDone();
	};
}
FishingGame.prototype = new MiniGame();

