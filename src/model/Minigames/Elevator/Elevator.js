/**
 * @constructor
 * @extends {MW.Minigame}
 */
MW.ElevatorMinigame = MW.Minigame.extend(
/** @lends {MW.ElevatorMinigame.prototype} */
{
	/**
	 * @constructs
	 * @param {MW.Game} parent
	 */
	init: function (parent) {
		"use strict";
		this._super(parent, "Elevator");
		var
			elevator = this,
			minNumber = 1,
			maxNumber = 10,
			stepNumber = 1,
			elevatorArray = [],
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

		elevator.addSetup(function () {
			var i, j = 0;
			for (i = minNumber; i <= maxNumber; i += stepNumber) {
				elevatorArray[j] = i;
				j += 1;
			}
		});

		/**
		 * Agent interrupts will not be handled when generated.
		 * @private
		 */
		function disallowInterrupt() {
			interruptable = false;
			if (elevator.modeIsAgentDo()) {
				elevator.tell(MW.Event.MG_LADDER_FORBID_INTERRUPT);
			}
		}

		/**
		 * Agent interrupts will be handled when generated.
		 * @private
		 */
		function allowInterrupt(callback) {
			interruptable = true;
			if (elevator.modeIsAgentDo() && !elevator.agentIsInterrupted()) {
				elevator.tellWait(MW.Event.MG_LADDER_ALLOW_INTERRUPT, callback);
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
				elevator.waitable(MW.Event.MG_LADDER_PLACE_TARGET),
				function () {
					elevator.tell(MW.Event.MG_LADDER_READY_TO_PICK);
					elevator.tell(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, {}, true);
					if (!elevator.modeIsAgentDo()) {
						elevator.tell(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT, {}, true);
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
			elevator.tell(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, {}, true);
			if (!elevator.modeIsAgentDo())
				elevator.tell(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT);
			elevator.reportMistake();
			elevator.tell("Elevator.incorrect");
			if (timesHelped >= MAX_HELP) {
				elevator.tell("Elevator.agentSuggestSolution");
			}
			elevator.addAction("incorrect");
			callback();
		}

		/**
		 * @private
		 * @param {Function} callback
		 */
		function gotCorrectTarget(callback) {
			birdHasTreat = true;
			Utils.chain(
				elevator.waitable(MW.Event.MG_LADDER_GET_TARGET),
				elevator.waitable(MW.Event.MG_LADDER_RESET_SCENE),
				elevator.sendable(MW.Event.MG_LADDER_HAS_TARGET),
				function () {
					elevator.addAction("correct");
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
			elevator.tellWait(
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
				elevator.tellWait(MW.Event.MG_LADDER_CHEER, elevator.quit);
			} else {
				placeTreat();
			}
		}

		/**
		 * Open a collected treat
		 * @public
		 */
		this.openTreat = function () {
			collectedTreats += 1;
			if (!elevator.modeIsChild()) {
				elevator.tell(MW.Event.MG_LADDER_CONFIRM_TARGET);
				elevator.addWaterDrop(checkEndOfRound);
			} else {
				elevator.tellWait(MW.Event.MG_LADDER_CONFIRM_TARGET);
				elevator.tellWait(MW.Event.MG_LADDER_GET_TREAT, checkEndOfRound);
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
				elevator.waitable(MW.Event.MG_LADDER_PICKED, {
					number: number,
					correct: number === targetNumber
				}),
				elevator.sendable(MW.Event.MG_LADDER_IGNORE_INPUT),
				function (next) {
					if (elevator.agentIsBeingHelped()) {
						timesHelped += 1;
					} else {
						timesHelped = 0;
					}
					if (elevator.agentIsBeingHelped() && number === targetNumber) {
						elevator.helpedAgent();
					}
					next();
				},
				function (next) {
					if (number === targetNumber &&
						number < lastHelpAttempt &&
						(elevator.agentIsInterrupted() ||
						 elevator.agentIsBeingHelped())) {
						elevator.tell("Elevator.betterBecauseSmaller");
					}

					if (number === targetNumber &&
						number > lastHelpAttempt &&
						(elevator.agentIsInterrupted() ||
						 elevator.agentIsBeingHelped())) {
						elevator.tell("Elevator.betterBecauseBigger");
					}

					if (number !== targetNumber &&
					   (elevator.agentIsInterrupted() ||
						elevator.agentIsBeingHelped())) {
						elevator.tell("Elevator.hmm");
					}

					if (elevator.modeIsAgentDo()) {
						lastHelpAttempt = number;
					}

					if ((elevator.modeIsAgentDo() && !elevator.agentIsBeingHelped()) ||
						(elevator.agentIsBeingHelped() && number === targetNumber)) {
						elevator.resumeAgent();
						elevator.tell(MW.Event.MG_LADDER_FORBID_GAMER_INPUT, {}, true);
					}
					next();
				},
				elevator.waitable(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET),
				function (next) {
					disallowInterrupt();
					if (number === targetNumber) {
						gotCorrectTarget(next);
					} else {
						gotIncorrectTarget(next);
					}
					if (number < targetNumber &&
						elevator.modeIsAgentDo() &&
						!elevator.agentIsInterrupted() &&
						!elevator.agentIsBeingHelped()) {
						elevator.tell("Elevator.agentTooLow");
					   }

					if (number > targetNumber &&
						elevator.modeIsAgentDo() &&
						!elevator.agentIsInterrupted() &&
						!elevator.agentIsBeingHelped()) {
						elevator.tell("Elevator.agentTooHigh");
					}

					if (number < targetNumber &&
					   (elevator.modeIsAgentSee() ||
						elevator.agentIsInterrupted() ||
						elevator.agentIsBeingHelped())) {
						elevator.tell("Elevator.tooLow");
					}

					if (number > targetNumber &&
					   (elevator.modeIsAgentSee() ||
						elevator.agentIsInterrupted() ||
						elevator.agentIsBeingHelped())) {
						elevator.tell("Elevator.tooHigh");
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
		 * @return {number} a number on the elevator which isn't the target number.
		 */
		this.getIncorrectNumber = function() {
			var pos = Utils.getRandomInt(0, elevatorArray.length - 1);
			if (elevatorArray[pos] === targetNumber) {
				return this.getIncorrectNumber();
			}
			return elevatorArray[pos];
		};

		/**
		 * @return {number} the number that has been chosen
		 */
		this.getChosenNumber = function () {
			if (chosenNumber === null) {
				throw {
					name: "No number chosen yet",
					game: "Elevator",
					message: "A chosen number was asked for in " + 
						     "the Elevator Game, but no number has " +
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
		 * Gets the elevator with its numbers
		 * @returns {Array.<number>}
		 */
		this.getElevator = function() {
			return elevatorArray;
		};

		this.addAgentInterruptedHandler(function () {
			if (interruptable && elevator.modeIsAgentDo()) {
				disallowInterrupt();
				elevator.popAction();
				tries -= 1;
				if (!birdHasTreat) {
					elevator.tell(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT, {}, true);
					elevator.tell(MW.Event.MG_LADDER_INTERRUPT, {});
					elevator.tellWait(MW.Event.MG_LADDER_RESET_SCENE, function() {
						elevator.tell(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, {}, true);
					});
				}
			}
		});

		this.addStart(function () {
			elevator.tell(MW.Event.MG_LADDER_IGNORE_INPUT, {}, true);
			elevator.tell(MW.Event.MG_LADDER_FORBID_GAMER_INPUT, {}, true);
	//		elevator.tell("Elevator.start");
			if (elevator.modeIsAgentDo()) {
				elevator.tellWait(MW.Event.MG_LADDER_START_AGENT, placeTreat );
			} else {
				placeTreat();
			}
		});

		this.addStop(function () {
			elevator.tell("Game.roundDone");
		});
	}
});

