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
			numberOfBranches = 5,
			targetNumber,
			roundsWon = 0,
			roundsLost = 0,
			winsToProgress = 3,
			maxTries = 6,
			agent;
		
		
		/**
		 * Introduce a new bird.
		 * @private
		 */
		function newBird () {
			/* Randomize where it should go and send event */
			targetNumber = 1 + Math.floor(Math.random()*numberOfBranches);
			elevator.tell(MW.Event.MG_LADDER_PLACE_TARGET, {
				targetNumber: targetNumber,
				callback: elevator.modeIsAgentDo() ? elevator.agentPickNumber :
					null
			});
		}
		
		/**
		 * Introduce a new mode.
		 * Child play -> Agent watch -> Agent act
		 * @private
		 */
		function nextMode () {
			if (elevator.modeIsChild()) {
				elevator.setMode(MW.GameMode.AGENT_SEE);
				agent = new MW.Agent();
				roundsWon = 0;
				roundsLost = 0;
				elevator.tell(MW.Event.MG_LADDER_INTRODUCE_AGENT,
					elevator.nextRound);
			} else if (elevator.modeIsAgentSee()) {
				elevator.setMode(MW.GameMode.AGENT_DO);
				roundsWon = 0;
				roundsLost = 0;
				elevator.tell(MW.Event.MG_LADDER_START_AGENT,
					elevator.nextRound);
			} else {
				elevator.tell(MW.Event.MG_LADDER_CHEER, elevator.quit);
			}
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
		 * Run next round.
		 * @public
		 */
		this.nextRound = function () {
			if (winsToProgress > roundsWon &&
				maxTries > (roundsWon + roundsLost)) {
				newBird();
			} else {
				nextMode();
			}
		}
		
		/**
		 * A number has been picked.
		 * @public
		 * @param pickedNumber - The number that was picked
		 */
		this.pickedNumber = function (pickedNumber) {
			if (pickedNumber == targetNumber) {
				roundsWon++;
				if (this.modeIsAgentSee()) {
					agent.watchCorrectAnswer(pickedNumber);
				}
			} else {
				roundsLost++;
				if (this.modeIsAgentSee()) {
					agent.watchIncorrectAnswer(pickedNumber, targetNumber);
				}
			}
			elevator.tell(MW.Event.MG_LADDER_PICKED, {
				number: pickedNumber,
				correct: pickedNumber == targetNumber
			});
		};
		
		/**
		 * Let the agent pick a number.
		 */
		this.agentPickNumber = function () {
			elevator.pickedNumber(agent.pickNumber());
		};
		
		
		/**
		 * Functions to run when starting.
		 */
		this.addStart(function () {
			elevator.nextRound();
		});

		/**
		 * Functions to run when stopping.
		 */
		this.addStop(function () {
			elevator.tell("Game.roundDone");
		});
		
		
		/* This is needed to start the game */
		this.on(MW.Event.INTRODUCE_AGENT, function (callback) {
			callback();
		});
	}
});
