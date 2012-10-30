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
			numberOfBranches = 10,
			targetNumber,
			roundsWon = 0,
			roundsLost = 0,
			winsToProgress = 3,
			maxTries = 6,
			agent,
			agentPick;
		
		
		/**
		 * Introduce a new bird.
		 * @private
		 */
		function newBird () {
			/* Randomize where it should go and send event */
			targetNumber = 1 + Math.floor(Math.random() * numberOfBranches);
			elevator.tell(MW.Event.MG_LADDER_PLACE_TARGET, {
				targetNumber: targetNumber,
				agentDo: elevator.modeIsAgentDo()
			});
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
			if (elevator.modeIsChild()) {
				elevator.setMode(MW.GameMode.AGENT_SEE);
				agent = new MW.Agent();
				roundsWon = 0;
				roundsLost = 0;
				elevator.tell(MW.Event.MG_LADDER_INTRODUCE_AGENT);
			} else if (elevator.modeIsAgentSee()) {
				elevator.setMode(MW.GameMode.AGENT_DO);
				roundsWon = 0;
				roundsLost = 0;
				elevator.tell(MW.Event.MG_LADDER_START_AGENT);
			} else {
				elevator.tell(MW.Event.MG_LADDER_CHEER);
			}
		}
		
		/**
		 * The player has picked a number.
		 * @private
		 * @param pickedNumber - The number that was picked
		 */
		function playerPickNumber(number) {
			elevator.tell(MW.Event.MG_LADDER_PICKED, {
				number: number,
				tooHigh: number > targetNumber,
				tooLow: number < targetNumber
			});
			if (elevator.modeIsAgentSee()) {
				agent.watchAnswer(number, targetNumber);
			}
		}
		
		/**
		 * Let the agent pick a number.
		 */
		function agentPickNumber () {
			agentPick = agent.pickNumber(targetNumber, numberOfBranches);
			elevator.tell(MW.Event.MG_ELEVATOR_AGENT_CHOICE, {
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
			nextRound();
		});

		/**
		 * Functions to run when stopping.
		 */
		this.addStop(function () {
			elevator.tell("Game.roundDone");
		});
		
		
		/**
		 * Listen to button pushes.
		 */
		this.on('BUTTON_PUSHED', function (vars) {
			elevator.tell(MW.Event.MG_ELEVATOR_LOCK, true);
			if (vars.number === undefined) {
				/* agent was correct/incorrect */
				if (vars.bool) {
					playerPickNumber(agentPick.guess);
				} else {
					elevator.tell(MW.Event.MG_ELEVATOR_CORRECT_AGENT);
					elevator.tell(MW.Event.MG_ELEVATOR_LOCK, false);
				}
			} else {
				playerPickNumber(vars.number);
			}
		});
		
		/**
		 * Player or agent has picked a number.
		 * @param {Hash} vars
		 * @param {Number} vars.number - the chosen number
		 */
		this.on(MW.Event.MG_LADDER_PICKED, function (vars) {
			if (vars.number == targetNumber) {
				roundsWon++;
			} else {
				roundsLost++;
			}
		});
		
		/**
		 * Start new round.
		 */
		this.on('ROUND_DONE', function (vars) {
			nextRound();
		});
		
		/**
		 * Start new round.
		 */
		this.on(MW.Event.MG_ELEVATOR_TARGET_IS_PLACED, function () {
			if (elevator.modeIsAgentDo()) {
				agentPickNumber();
			} else {
				elevator.tell(MW.Event.MG_ELEVATOR_LOCK, false);
			}
		});
		
		/* This is needed to start the game */
		this.on(MW.Event.INTRODUCE_AGENT, function (callback) {
			callback();
		});
		
		this.on('QUIT', function () {
			elevator.quit();
		});
	}
});
