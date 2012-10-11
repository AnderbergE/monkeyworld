/**
 * Creates an agent.
 * @constructor
 * @extends {MW.GlobalObject}
 */
MW.Agent = MW.GlobalObject.extend(
/** @lends {MW.Agent.prototype} */
{
	init: function () {
		this._super("Agent");
		
		var knowledge = new MW.AgentKnowledge();
		
		
		/**
		 * Player picked correct answer.
		 * @public
		 * @param {Number} number - the number that was correct.
		 */
		this.watchCorrectAnswer = function (number) {
			knowledge.correctAnswer(number);
		};
		
		/**
		 * Player picked incorrect answer.
		 * @public
		 * @param {Number} chosenNumber - the number that was incorrect.
		 * @param {Number} correctNumber - the correct number.
		 */
		this.watchIncorrectAnswer = function (chosenNumber, correctNumber) {
			knowledge.incorrectAnswer(chosenNumber, correctNumber);
		};
		
		/**
		 * Have the agent pick a number.
		 * @public
		 * @param {Number} targetNumber - the number that is the target.
		 */
		this.pickNumber = function (targetNumber) {
			return knowledge.pickNumber(targetNumber);
		};
	}
});
