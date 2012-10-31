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
			biggestMiss = 1,
			guessArray = new Array();
		
		
		/**
		 * Fill an array with numbers to guess between.
		 * @private
		 * @param {Number} targetNumber - the target of the round.
		 * @param {Number} maxNumber - the biggest number.
		 */
		function fillArray (targetNumber, maxNumber) {
			var i = targetNumber - biggestMiss;
			if (i < 1) {
				i = 1;
			}
			var max = targetNumber + biggestMiss;
			if (max > maxNumber) {
				max = maxNumber;
			}
			
			for (i; i <= max; i++) {
				guessArray.push(i);
			}
		}
		
		
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
			
			if (biggestMiss < Math.abs(chosenNumber - correctNumber)) {
				biggestMiss = Math.abs(chosenNumber - correctNumber);
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
				if (guessArray.length == 0) {
					fillArray(targetNumber, maxNumber);
				}
				var guess = Math.floor(Math.random() * guessArray.length);
				/* splice returns an array of removed elements, we remove one */
				guess = guessArray.splice(guess, 1)[0];
				/* if guess was correct, reset guess array */
				if (guess == targetNumber) {
					guessArray = new Array();
				}
				return {
					guess: guess,
					confidence: 1 / guessArray.length
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
					knowledge[targetNumber][guess]--;
				} else if (Math.random() > 0.90) {
					if (targetNumber == maxNumber) {
						guess--;
					} else if (targetNumber == 0) {
						guess++;
					} else {
						guess += Math.random() > 0.50 ? 1 : -1;
					}
				}
				return {
					guess: guess,
					confidence: bestSoFar / total
				};
			}
		}
	}
});