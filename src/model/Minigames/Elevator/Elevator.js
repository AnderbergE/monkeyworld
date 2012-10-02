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
			maxNumber = 10;

		this.addStart(function () {
			
		});

		this.addStop(function () {
			elevator.tell("Game.roundDone");
		});
	}
});

