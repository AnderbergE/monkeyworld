/**
 * Holds the knowledge of the agent.
 * @constructor
 * @extends {MW.GlobalObject}
 */
MW.AgentKnowledge = MW.GlobalObject.extend(
/** @lends {MW.AgentKnowledge.prototype} */
{
	/** @constructs */
	init: function () {
		this._super("AgentKnowledge");
		
		
		/**
		 * Correct answer was picked.
		 * @public
		 * @param {Number} number - the number that was correct.
		 */
		this.correctAnswer = function (number) {
			
		};
		
		/**
		 * Incorrect answer was picked.
		 * @public
		 * @param {Number} chosenNumber - the number that was incorrect.
		 * @param {Number} correctNumber - the correct number.
		 */
		this.incorrectAnswer = function (chosenNumber, correctNumber) {
			
		};
		
		/**
		 * Calculate which number to pick based on previous knowledge.
		 * @public
		 * @param {Number} targetNumber - the number that is the target.
		 */
		this.pickNumber = function (targetNumber) {
			pickedNumber = 3;
			return pickedNumber;
		};
	}
});
