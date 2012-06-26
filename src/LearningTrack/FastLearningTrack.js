/**
 * @constructor
 * @implements {MW.LearningTrack}
 */
MW.FastLearningTrack = function() {};

/** 
 * @param {number} round
 * @returns {number}
 */
MW.FastLearningTrack.prototype.errorRate = function(round) {
	if (round >= 0 && round < 3)
		return 0.75;
	else if (round >= 3 && round < 6)
		return 0.5;
	else if (round >= 7 && round < 13)
		return 0.25;
	else
		return 0;
};

/**
 * @returns {string}
 */
MW.FastLearningTrack.prototype.name = function() {
	return "Fast";
};