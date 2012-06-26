/**
 * @constructor
 * @implements {MW.LearningTrack}
 */
MW.MediumLearningTrack = function() {};

/** 
 * @param {number} round
 * @returns {number}
 */
MW.MediumLearningTrack.prototype.errorRate = function(round) {
	if (round >= 0 && round < 5)
		return 0.75;
	else if (round >= 5 && round < 10)
		return 0.5;
	else if (round >= 10 && round < 17)
		return 0.25;
	else
		return 0;
};

/**
 * @returns {string}
 */
MW.MediumLearningTrack.prototype.name = function() {
	return "Medium";
};