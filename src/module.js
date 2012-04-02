/**
 * @interface
 */
function ViewModule() {};

/**
 * @param {Model} model
 * @param {Function} modelInit
 */
ViewModule.prototype.prepare = function(model, modelInit) {};

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
