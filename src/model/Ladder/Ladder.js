/**
 * @constructor
 * @extends {MiniGame}
 */
function Ladder()
{
	/** @type {Ladder} */ var that = this;
	this.tag("Ladder");
	
	/** @type {number} */ var minNumber = 1;
	/** @type {number} */ var maxNumber = 6;
	/** @type {number} */ var stepNumber = 1;
	/** @type {Array.<number>} */ var ladder = new Array(maxNumber - minNumber + 1);
	/** @type {number} */ var settingsTargetNumber = Settings.get("miniGames", "ladder", "targetNumber");
	/** @type {number} */ var targetNumber = Utils.getRandomInt(minNumber, maxNumber);
	
	/** @type {number} */ var minTreats = 1;
	/** @type {number} */ var maxTreats = 3;
	/** @type {number} */ var tries = 0;
	/** @type {number} */ var minTries = 3;
	/** @type {number} */ var collectedTreats = 0;
	/** @type {boolean} */ var birdHasTreat = false;
	
	for (var i = minNumber, j = 0; i <= maxNumber; i += stepNumber)
		ladder[j++] = i;
	
	
	var setTargetNumber = function() {
		targetNumber = Utils.getRandomInt(minNumber, maxNumber);
	};
	
	var birdHasFlewn = function(correct) { return function() {
		if (correct) {
			birdHasTreat = true;
			dropTreat(function() {
				that.addAction("correct");
				birdHasTreat = false;
			});
		} else {
			that.tell("Ladder.birdFlyToNest", { callback: function() {
				that.addAction("incorrect");
			}});
		}
	};};
	
	var placeTreat = function() {
		setTargetNumber();
		that.tell("Ladder.placeTreat", {
			callback: function() {
				that.tell("Ladder.readyToPick");
			}
		});
	};
	
	var dropTreat = function(callback) {
		that.tell("Ladder.dropTreat", {
			callback: function() {
				that.tell("Ladder.birdFlyToNest", { callback: callback });
				that.tell("Ladder.hasTreat");
			}
		});
	};
	
	this.openTreat = function() {
		collectedTreats++;
		that.tell("Ladder.openTreat", {
			callback: function() {
				/*
				 * End round if gamer has maximum number of treats, OR if
				 * gamer has tried at least minTries times and has at least
				 * minTreats.
				 */
				if (collectedTreats === maxTreats || (tries >= minTries && collectedTreats >= minTreats))
					that.tell("Ladder.cheer", { callback: function() { that.roundDone(); } });
				else {
					placeTreat();
				}
			}
		});
	};
	
	this.turnOnClicks = function() { that.tell("Ladder.turnOnClicks"); };
	this.turnOffClicks = function() { that.tell("Ladder.turnOffClicks"); };
	
	/**
	 * Pick a number
	 * @param {number} number
	 */
	this.pick = function(number) {
		tries++;
		that.tell("Ladder.picked", {
			number: number,
			correct: number === targetNumber,
			callback: function() {
				that.tell("Ladder.birdFlyToLadder", {
					number: number,
					callback: birdHasFlewn(number === targetNumber)
				});				
			}
		});
	};
	
	/**
	 * Returns the target number.
	 * @returns {number}
	 */
	this.getTargetNumber = function() {
		return targetNumber;
	};
	
	/**
	 * @return {number} a number on the ladder which isn't the target number.
	 */
	this.getIncorrectNumber = function() {
		var pos = Utils.getRandomInt(0, ladder.length - 1);
		if (ladder[pos] === targetNumber)
			return this.getIncorrectNumber();
		else
			return ladder[pos];
	};
	
	/**
	 * Gets the ladder with its numbers
	 * @returns {Array.<number>}
	 */
	this.getLadder = function() {
		return ladder;
	};
	
	var _oldInterruptAgent = this.interruptAgent;
	this.interruptAgent = function() {
		_oldInterruptAgent();
		if (!birdHasTreat) {
			that.tell("Ladder.interrupt");
			that.tell("Ladder.birdFlyToNest", { callback: function() {
				
			}});
		}
	};
	
	this.start = function() {
		that.tell("Ladder.start");
		placeTreat();
		console.log("start");
	};
}

Ladder.prototype = new MiniGame();
