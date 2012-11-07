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
	init: function (parent, difficulty, useAgent) {
		"use strict";
		this._super(parent, "Elevator");
		var
			elevator = this,
			numberOfBranches = difficulty,
			targetNumber,
			roundsWon = 0,
			roundsLost = 0,
			winsToProgress = 3 * (useAgent ? 1 : 3),
			maxTries = 6 * (useAgent ? 1 : 3),
			agent,
			agentPick;
		
		
		/**
		 * Introduce a new bird.
		 * @private
		 */
		function newBird () {
			/* Randomize where it should go and send event */
			targetNumber = 1 + Math.floor(Math.random() * numberOfBranches);
			elevator.tell(MW.Event.PLACE_TARGET, targetNumber);
		}
		
		/**
		 * Run next round.
		 * @private
		 */
		function nextRound () {
			if (winsToProgress > roundsWon &&
				maxTries > (roundsWon + roundsLost)) {
				newBird();
			} else {
				nextMode();
			}
		}
		
		/**
		 * Introduce a new mode.
		 * Child play -> Agent watch -> Agent act
		 * @private
		 */
		function nextMode () {
			if (!useAgent) {
				elevator.tell(MW.Event.END_MINIGAME);
			} else if (elevator.modeIsChild()) {
				roundsWon = 0;
				roundsLost = 0;
				elevator.setMode(MW.GameMode.AGENT_WATCH);
				agent = new MW.Agent();
				elevator.tell(MW.Event.INTRODUCE_AGENT);
			} else if (elevator.modeIsAgentSee()) {
				roundsWon = 0;
				roundsLost = 0;
				elevator.setMode(MW.GameMode.AGENT_ACT);
				elevator.tell(MW.Event.START_AGENT);
			} else {
				elevator.setMode(MW.GameMode.CHILD_PLAY);
				elevator.tell(MW.Event.END_MINIGAME);
			}
		}
		
		/**
		 * The player has picked a number.
		 * @private
		 * @param pickedNumber - The number that was picked
		 */
		function playerPickNumber(number) {
			elevator.tell(MW.Event.PICKED_TARGET, {
				number: number,
				tooHigh: number > targetNumber,
				tooLow: number < targetNumber
			});
			if (elevator.modeIsAgentSee() ||
				(elevator.modeIsAgentDo() && number == targetNumber)) {
				agent.watchAnswer(number, targetNumber);
			}
		}
		
		/**
		 * Let the agent pick a number.
		 */
		function agentPickNumber () {
			agentPick = agent.pickNumber(targetNumber, numberOfBranches);
			elevator.tell(MW.Event.AGENT_CHOICE, {
				number: agentPick.guess,
				confidence: agentPick.confidence
			});
		}
		
		
		/**
		 * Get the number of branches for this game.
		 * @public
		 * @return {Number}
		 */
		this.getNumberOfBranches = function () {
			return numberOfBranches;
		}
		
		
		/**
		 * Functions to run when starting.
		 */
		this.addStart(function () {
			elevator.tell(MW.Event.START_MINIGAME);
		});

		/**
		 * Functions to run when stopping.
		 */
		/*this.addStop(function () {
		});*/
		
		
		/**
		 * Listen to button pushes.
		 */
		this.on(MW.Event.BUTTON_PUSH_NUMBER, function (number) {
			elevator.tell(MW.Event.LOCK_BUTTONS, true);
			playerPickNumber(number);
		});
		
		/**
		 * Listen to button pushes.
		 */
		this.on(MW.Event.BUTTON_PUSH_BOOL, function (bool) {
			if (bool) {
				elevator.tell(MW.Event.LOCK_BUTTONS, true);
				playerPickNumber(agentPick.guess);
			} else {
				elevator.tell(MW.Event.CORRECT_AGENT);
				elevator.tell(MW.Event.LOCK_BUTTONS, false);
			}
		});
		
		/**
		 * Player or agent has picked a number.
		 * @param {Hash} vars
		 * @param {Number} vars.number - the chosen number
		 */
		this.on(MW.Event.PICKED_TARGET, function (vars) {
			if (vars.number == targetNumber) {
				roundsWon++;
			} else {
				roundsLost++;
			}
		});
		
		/**
		 * Start new round.
		 */
		this.on(MW.Event.ROUND_DONE, function (vars) {
			nextRound();
		});
		
		/**
		 * Start new round.
		 */
		this.on(MW.Event.TARGET_IS_PLACED, function () {
			if (elevator.modeIsAgentDo()) {
				agentPickNumber();
			} else {
				elevator.tell(MW.Event.LOCK_BUTTONS, false);
			}
		});
	}
});
