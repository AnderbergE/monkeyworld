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
		 * Player picked an answer.
		 * @public
		 * @param {Number} chosenNumber - the number that was incorrect.
		 * @param {Number} correctNumber - the correct number.
		 */
		this.watchAnswer = function (chosenNumber, correctNumber) {
			knowledge.answer(chosenNumber, correctNumber);
		}
		
		/**
		 * Have the agent pick a number.
		 * @public
		 * @param {Number} targetNumber - the number that is the target.
		 * @param {Number} maxNumber - the max number to pick.
		 * @return {Hash}
		 * @return {Number} {Hash}.guess - the picked number
		 * @return {Number} {Hash}.confidence - how sure the agent is
		 */
		this.pickNumber = function (targetNumber, maxNumber) {
			return knowledge.pickNumber(targetNumber, maxNumber);
		}
	}
});