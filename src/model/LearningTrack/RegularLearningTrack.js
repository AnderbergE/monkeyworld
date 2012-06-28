/**
 * @constructor
 * @implements {MW.LearningTrack}
 */
MW.RegularLearningTrack = function() {};

/** 
 * @param {number} round
 * @returns {number}
 */
MW.RegularLearningTrack.prototype.errorRate = function(round) {
	if (round >= 0 && round < 10)
		return 0.75;
	else if (round >= 10 && round < 20)
		return 0.5;
	else if (round >= 20 && round < 35)
		return 0.25;
	else
		return 0;
};

/**
 * @returns {string}
 */
MW.RegularLearningTrack.prototype.name = function() {
	return "Regular";
};