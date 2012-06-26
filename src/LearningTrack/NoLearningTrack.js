/**
 * @constructor
 * @implements {MW.LearningTrack}
 */
MW.NoLearningTrack = function() {};

/** 
 * @param {number} round
 * @returns {number}
 */
MW.NoLearningTrack.prototype.errorRate = function(round) {
	return 1;
};

/**
 * @returns {string}
 */
MW.NoLearningTrack.prototype.name = function() {
	return "No track";
};