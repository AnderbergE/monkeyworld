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
		var knowledge = {},
			guessPower = 0.2;
		
		
		/**
		 * An answer was picked.
		 * @public
		 * @param {Number} chosenNumber - the number that was incorrect.
		 * @param {Number} correctNumber - the correct number.
		 */
		this.answer = function (chosenNumber, correctNumber) {
			if (knowledge[correctNumber] === undefined) {
				knowledge[correctNumber] = {};
			}
			if (knowledge[correctNumber][chosenNumber] === undefined) {
				knowledge[correctNumber][chosenNumber] = 0;
			}
			knowledge[correctNumber][chosenNumber]++;
			
			if (chosenNumber == correctNumber) {
				guessPower *= 1.5;
				if (guessPower > 1) {
					guessPower = 1;
				}
			} else {
				guessPower *= 0.8;
				if (guessPower < 0.1) {
					guessPower = 0.1;
				}
			}
		}
		
		/**
		 * Calculate which number to pick based on previous knowledge.
		 * @public
		 * @param {Number} targetNumber - the number that is the target.
		 * @param {Number} maxNumber - the max number to pick.
		 * @return {Hash}
		 * @return {Number} {Hash}.guess - the picked number
		 * @return {Number} {Hash}.confidence - how sure the agent is
		 */
		this.pickNumber = function (targetNumber, maxNumber) {
			if (knowledge[targetNumber] === undefined) {
				return {
					guess: Math.floor((Math.random() * maxNumber) + 1),
					confidence: 1 / maxNumber
				};
			} else {
				var guess, bestSoFar = 0, total = 0;
				for (var i in knowledge[targetNumber]) {
					if (knowledge[targetNumber][i] > bestSoFar) {
						guess = i;
						bestSoFar = knowledge[targetNumber][i];
					}
					total += knowledge[targetNumber][i];
				}
				if (targetNumber != guess) {
					/* The agent learns when it picks the wrong number. */
					/* TODO: Maybe put this somewhere else? */
					knowledge[targetNumber][guess]--;
				}
				/* TODO: Should agent be able to pick wrong even though the
					player never has? */
				return {
					guess: guess,
					confidence: bestSoFar / total
				};
			}
		}
	}
});