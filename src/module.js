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

/**
 * @interface
 */
function ModelModule() {};

/**
 * @param {Object} config
 */
ModelModule.prototype.init = function(config) {};
