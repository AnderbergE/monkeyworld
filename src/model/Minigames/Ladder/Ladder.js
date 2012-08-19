/**
 * @constructor
 * @extends {MW.Minigame}
 */
MW.LadderMinigame = function () {
	"use strict";
	MW.Minigame.call(this, "Ladder");
	var
		ladder = this,
		minNumber = 1,
		maxNumber = 6,
		stepNumber = 1,
		ladderArray = [],
		targetNumber = Utils.getRandomInt(minNumber, maxNumber),
		chosenNumber = null,
		/** @const */
		minTreats = 1,
		/** @const */
		maxTreats = 3,
		tries = 0,
		/** @const */
		minTries = 3,
		collectedTreats = 0,
		birdHasTreat = false,
		interruptable = false,
		round = 0,
		lastHelpAttempt = 0,
		timesHelped = 0,
		/** @const */
		MAX_HELP = 4;

	ladder.addSetup(function () {
		var i, j = 0;
		for (i = minNumber; i <= maxNumber; i += stepNumber) {
			ladderArray[j] = i;
			j += 1;
		}
	});

	/**
	 * Agent interrupts will not be handled when generated.
	 * @private
	 */
	function disallowInterrupt() {
		interruptable = false;
		if (ladder.game.modeIsAgentDo()) {
			ladder.tell(MW.Event.MG_LADDER_FORBID_INTERRUPT);
		}
	}

	/**
	 * Agent interrupts will be handled when generated.
	 * @private
	 */
	function allowInterrupt(callback) {
		interruptable = true;
		if (ladder.game.modeIsAgentDo() && !ladder.agentIsInterrupted()) {
			ladder.tellWait(MW.Event.MG_LADDER_ALLOW_INTERRUPT, callback);
		} else {
			callback();
		}
	}

	/**
	 * Make a new treat ready to be targeted.
	 * @private
	 */
	function placeTreat() {
		targetNumber = Utils.getRandomInt(minNumber, maxNumber);
		round += 1;
		Utils.chain(
			ladder.waitable(MW.Event.MG_LADDER_PLACE_TARGET),
			function () {
				ladder.tell(MW.Event.MG_LADDER_READY_TO_PICK);
				ladder.tell(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, {}, true);
				if (!ladder.game.modeIsAgentDo()) {
					ladder.tell(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT, {}, true);
				}
			}
		)();
	}

	/**
	 * When a mistake has been done.
	 * @private
	 * @param {Function} callback
	 */
	function mistake(callback) {
		ladder.tell(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, {}, true);
		if (!ladder.game.modeIsAgentDo())
			ladder.tell(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT);
		ladder.reportMistake();
		ladder.tell("Ladder.incorrect");
		if (timesHelped >= MAX_HELP) {
			ladder.tell("Ladder.agentSuggestSolution");
		}
		ladder.addAction("incorrect");
		callback();
	}

	/**
	 * @private
	 * @param {Function} callback
	 */
	function gotCorrectTarget(callback) {
		birdHasTreat = true;
		Utils.chain(
			ladder.waitable(MW.Event.MG_LADDER_GET_TARGET),
			ladder.waitable(MW.Event.MG_LADDER_RESET_SCENE),
			ladder.sendable(MW.Event.MG_LADDER_HAS_TARGET),
			function () {
				ladder.addAction("correct");
				birdHasTreat = false;
				callback();
			}
		)();
	}

	/**
	 * @private
	 * @param {Function} callback
	 */
	function gotIncorrectTarget(callback) {
		ladder.tellWait(
			MW.Event.MG_LADDER_RESET_SCENE,
			function () { mistake(callback); }
		);
	}

	/**
	 * @private
	 */
	function checkEndOfRound() {
		var
			hasMaxTreats = collectedTreats === maxTreats,
			enoughTries = tries >= minTries,
			enoughTreats = collectedTreats >= minTreats;

		if (hasMaxTreats || (enoughTries && enoughTreats)) {
			console.log("checkok");
			Utils.chain(
				ladder.waitable(MW.Event.MG_LADDER_CHEER),
				ladder.roundDone
			)();
		} else {
					console.log("placetreat");
			placeTreat();
		}
	}

	/**
	 * Open a collected treat
	 * @private
	 */
	this.openTreat = function () {
		collectedTreats += 1;
		if (!ladder.game.modeIsChild()) {
			ladder.tell(MW.Event.MG_LADDER_CONFIRM_TARGET);
			ladder.game.addWaterDrop(checkEndOfRound);
		} else {
			ladder.tellWait(MW.Event.MG_LADDER_CONFIRM_TARGET);
			ladder.tellWait(MW.Event.MG_LADDER_GET_TREAT, checkEndOfRound);
		}
	};

	/**
	 * Pick a number
	 * @public
	 * @param {number} number
	 */
	this.pick = function (number) {
		chosenNumber = number;
		tries += 1;
		Utils.chain(
			allowInterrupt,
			ladder.sendable(MW.Event.MG_LADDER_IGNORE_INPUT),
			ladder.waitable(MW.Event.MG_LADDER_PICKED, {
				number: number,
				correct: number === targetNumber
			}),
			function (next) {
				if (ladder.agentIsBeingHelped()) {
					timesHelped += 1;
				} else {
					timesHelped = 0;
				}
				if (ladder.agentIsBeingHelped() && number === targetNumber) {
					ladder.helpedAgent();
				}
				next();
			},
			function (next) {
				if (number === targetNumber &&
				    number < lastHelpAttempt &&
				    (ladder.agentIsInterrupted() ||
				     ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.betterBecauseSmaller");
				}

				if (number === targetNumber &&
				    number > lastHelpAttempt &&
				    (ladder.agentIsInterrupted() ||
				     ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.betterBecauseBigger");
				}

				if (number !== targetNumber &&
				   (ladder.agentIsInterrupted() ||
				    ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.hmm");
				}

				if (ladder.game.modeIsAgentDo()) {
					lastHelpAttempt = number;
				}

				if ((ladder.game.modeIsAgentDo() && !ladder.agentIsBeingHelped()) ||
				    (ladder.agentIsBeingHelped() && number === targetNumber)) {
					ladder.resumeAgent();
					ladder.tell(MW.Event.MG_LADDER_FORBID_GAMER_INPUT, {}, true);
				}
				next();
			},
			ladder.waitable(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET),
			function (next) {
				disallowInterrupt();
				if (number === targetNumber) {
					gotCorrectTarget(next);
				} else {
					gotIncorrectTarget(next);
				}
				if (number < targetNumber &&
				    ladder.game.modeIsAgentDo() &&
				    !ladder.agentIsInterrupted() &&
				    !ladder.agentIsBeingHelped()) {
					ladder.tell("Ladder.agentTooLow");
				   }

				if (number > targetNumber &&
				    ladder.game.modeIsAgentDo() &&
				    !ladder.agentIsInterrupted() &&
				    !ladder.agentIsBeingHelped()) {
					ladder.tell("Ladder.agentTooHigh");
				}

				if (number < targetNumber &&
				   (ladder.game.modeIsAgentSee() ||
				    ladder.agentIsInterrupted() ||
				    ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.tooLow");
				}

				if (number > targetNumber &&
				   (ladder.game.modeIsAgentSee() ||
				    ladder.agentIsInterrupted() ||
				    ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.tooHigh");
				}
				chosenNumber = null;
			}
		)();
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
		var pos = Utils.getRandomInt(0, ladderArray.length - 1);
		if (ladderArray[pos] === targetNumber) {
			return this.getIncorrectNumber();
		}
		return ladderArray[pos];
	};

	/**
	 * @return {number} the number that has been chosen
	 */
	this.getChosenNumber = function () {
		if (chosenNumber === null) {
			throw {
				name: "No number chosen yet",
				game: "Ladder",
				message: "A chosen number was asked for in " + 
				         "the Ladder Game, but no number has " +
				         "yet been chosen by the user or the " +
				         "agent."
			};
		}
		return chosenNumber;
	};

	/**
	 * @return {number} the maximum number of treats that the player can get
	 * @const
	 */
	this.getMaximumTreats = function () {
		return maxTreats;
	};

	/**
	 * @return {number} the current round number, which is >= 1 if the
	 *                  minigame has started
	 */
	this.getRoundNumber = function () {
		if (round === 0) {
			throw "MinigameNotStartedException";
		} else {
			return round;
		}
	};

	/**
	 * Gets the ladder with its numbers
	 * @returns {Array.<number>}
	 */
	this.getLadder = function() {
		return ladderArray;
	};

	this.addAgentInterruptedHandler(function () {
		if (interruptable && ladder.game.modeIsAgentDo()) {
			disallowInterrupt();
			ladder.popAction();
			if (!birdHasTreat) {
				ladder.tell("Ladder.interrupt", {});
				ladder.tellWait(MW.Event.MG_LADDER_RESET_SCENE, function() {
					ladder.tell(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT, {}, true);
					ladder.tell(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, {}, true);
				});
			}
		}
	});

	this.addStart(function () {
		ladder.tell(MW.Event.MG_LADDER_IGNORE_INPUT, {}, true);
		ladder.tell(MW.Event.MG_LADDER_FORBID_GAMER_INPUT, {}, true);
		ladder.tell("Ladder.start");
		if (ladder.game.modeIsAgentSee()) {
			ladder.tellWait("Ladder.introduceAgent", placeTreat );
		} else if (ladder.game.modeIsAgentDo()) {
			ladder.tellWait("Ladder.startAgent", placeTreat );
		} else {
			placeTreat();
		}
	});

	this.addStop(function () {
		ladder.tell("Game.roundDone");
	});
}

