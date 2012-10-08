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
			targetNumber,
			roundsWon = 0,
			roundsLost = 0,
			nbrOfRounds = 3;
		
		function newBird() {
			if (nbrOfRounds > (roundsWon + roundsLost)) {
				targetNumber = 1 + Math.floor(Math.random()*5);
				elevator.tell(MW.Event.MG_LADDER_PLACE_TARGET, {
						targetNumber: targetNumber,
				});
			}
		}
		
		this.pickedNumber = function (pickedNumber) {
			elevator.tell(MW.Event.MG_LADDER_PICKED, {
					number: pickedNumber,
			});
			if (pickedNumber == targetNumber) {
				roundsWon++;
			} else {
				roundsLost++;
			}
		};
		
		
		this.addStart(function () {
			newBird();
		});

		this.addStop(function () {
			elevator.tell("Game.roundDone");
		});
		
		
		/* This is needed to start the game */
		this.on(MW.Event.INTRODUCE_AGENT, function (callback) {
			callback();
		});
	}
});
