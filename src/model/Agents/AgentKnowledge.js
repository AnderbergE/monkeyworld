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
			guessPower = 0.2,
			guessArray,
			lastTarget = -1;
		
		
		function fillArray (maxNumber) {
			var i;
			guessArray = new Array();
			for (i = 1; i <= maxNumber; i++) {
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
			if (guessArray === undefined) {
				fillArray(maxNumber);
			}
			if (knowledge[targetNumber] === undefined) {
				var guess = Math.floor(Math.random() * guessArray.length);
				/* splice return an array of removed elements */
				guess = guessArray.splice(guess, 1)[0];
				/* if guess was correct, reset guess array */
				if (guess == targetNumber) {
					fillArray(maxNumber);
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