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
			maxTries = 6;
		
		
		/**
		 * Introduce a new bird.
		 */
		function newBird () {
			/* Randomize where it should go and send event */
			targetNumber = 1 + Math.floor(Math.random()*numberOfBranches);
			elevator.tell(MW.Event.MG_LADDER_PLACE_TARGET, {
				targetNumber: targetNumber
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
		 * Run next round.
		 * @public
		 */
		this.nextRound = function () {
			if (winsToProgress > roundsWon &&
				maxTries > (roundsWon + roundsLost)) {
				newBird();
			} else {
				if (this.modeIsChild()) {
					elevator.tell(MW.Event.MG_LADDER_INTRODUCE_AGENT,
						elevator.nextRound);
					roundsWon = 0;
					roundsLost = 0;
					this.setMode(MW.GameMode.AGENT_SEE);
				} else if (this.modeIsAgentSee()) {
					elevator.tell(MW.Event.MG_LADDER_START_AGENT);
					roundsWon = 0;
					roundsLost = 0;
					this.setMode(MW.GameMode.AGENT_DO);
				} else {
					elevator.tell(MW.Event.MG_LADDER_CHEER, elevator.quit);
				}
			}
		}
		
		/**
		 * A number has been picked.
		 * @public
		 * @param pickedNumber - The number that was picked
		 */
		this.pickedNumber = function (pickedNumber) {
			elevator.tell(MW.Event.MG_LADDER_PICKED, {
				number: pickedNumber,
				correct: pickedNumber == targetNumber 
			});
			if (pickedNumber == targetNumber) {
				roundsWon++;
			} else {
				roundsLost++;
			}
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
