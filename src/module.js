/**
 * @interface
 */
function ViewModule() {};

/**
 * @param {Object} config
 */
ViewModule.prototype.init = function(config, model) {};
ViewModule.prototype.tearDown = function() {};

/**
 * @interface
 */
function ModelModule() {};

/**
 * @param {Object} config
 */
ModelModule.prototype.init = function(config) {};
ModelModule.prototype.start = function() {};
ModelModule.prototype.tearDown = function(config) {};
ModelModule.prototype.onFrame = function(config) {};

/**
 * @constructor
 * @implements {ModelModule}
 */
var NoModule = function() {
	this.init = function() {};
	this.start = function() {};
	this.tearDown = function() {};
	this.onFrame = function() {};
}