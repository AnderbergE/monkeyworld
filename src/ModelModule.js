/**
 * @constructor
 */
function ModelModule() {};

/**
 * @param {Object} config
 */
ModelModule.prototype.init = function(config) {};
ModelModule.prototype.start = function() {};
ModelModule.prototype.tearDown = function() {};
ModelModule.prototype.onFrame = function() {};
ModelModule.prototype.play = function() {};

/**
 * @constructor
 * @extends {ModelModule}
 */
function NoModule() {
	this.init = function() {};
	this.start = function() {};
	this.tearDown = function() {};
	this.onFrame = function() {};
}