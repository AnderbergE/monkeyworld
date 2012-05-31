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
	/** @type {number} */ var maxTreats = 2;
	/** @type {number} */ var tries = 0;
	/** @type {number} */ var minTries = 3;
	/** @type {number} */ var collectedTreats = 0;
	/** @type {boolean} */ var birdHasTreat = false;
	/** @type {boolean} */ var interruptable = false;
	
	for (var i = minNumber, j = 0; i <= maxNumber; i += stepNumber)
		ladder[j++] = i;
	
	
	var setTargetNumber = function() {
		targetNumber = Utils.getRandomInt(minNumber, maxNumber);
	};
	
	var disallowInterrupt = function() {
		interruptable = false;
		if (that.game.modeIsAgentDo()) {
			that.tell("Ladder.disallowInterrupt");
		}
	};
	
	var allowInterrupt = function(callback) {
		interruptable = true;
		if (that.game.modeIsAgentDo() && !that.agentIsInterrupted()) {
			that.tell("Ladder.allowInterrupt", { callback: callback });
		} else callback();
	};
	
	var birdHasFlewn = function(correct) { return function() {
		disallowInterrupt();
		if (correct) {
			birdHasTreat = true;
			dropTreat(function() {
				that.addAction("correct");
				birdHasTreat = false;
			});
		} else {
			that.tell("Ladder.birdFlyToNest", { callback: function() {
				that.tell("Ladder.incorrect");
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
					if (that.game.modeIsAgentDo())
						that.resumeAgent();
				}
			}
		});
	};
	
	/**
	 * Pick a number
	 * @param {number} number
	 */
	this.pick = function(number) {
		tries++;
		allowInterrupt(function() {
			that.tell("Ladder.picked", {
				number: number,
				correct: number === targetNumber,
				callback: function() {
					if (that.agentIsInterrupted() && number === targetNumber) {
						that.helpedAgent();
					}
					that.tell("Ladder.birdFlyToLadder", {
						number: number,
						callback: function() {
							birdHasFlewn(number === targetNumber)();
							if (number < targetNumber && that.game.modeIsAgentSee()) that.tell("Ladder.tooLow");
							if (number > targetNumber && that.game.modeIsAgentSee()) that.tell("Ladder.tooHigh");
						}
					});
					if (number === targetNumber && that.agentIsInterrupted()) that.tell("Ladder.justRight");
					if (number != targetNumber && that.agentIsInterrupted()) that.tell("Ladder.hmm");
				}
			});
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
		if (interruptable && that.game.playerIsAgent()) {
			disallowInterrupt();
			_oldInterruptAgent();
			that.popAction();
			if (!birdHasTreat) {
				that.tell("Ladder.interrupt");
				that.tell("Ladder.birdFlyToNest", { callback: function() {
					
				}});
			}
		} else {
			console.log("Not interruptable");
		}
	};
	
	this.start = function() {
		that.tell("Ladder.start");
		if (that.game.modeIsAgentSee()) {
			that.tell("Ladder.introduceAgent", { callback: placeTreat });
		} else if (that.game.modeIsAgentDo()) {
			that.tell("Ladder.startAgent", { callback: placeTreat });
		} else {
			placeTreat();
		}
	};
}

Ladder.prototype = new MiniGame();
