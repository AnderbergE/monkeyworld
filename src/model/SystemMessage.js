/**
 * @constructor
 * @param {EventManager} evm
 * @implements {ModelModule}
 */
function SystemMessage(evm) {
	
	var config = null;
	
	this.init = function(_config) {
		config = _config;
	};
	
	this.tearDown = function() {
		
	};
	
	this.start = function() {
	};
	
	this.getMessage = function() {
		return config.msg;
	}
	
	this.animationDone = function() {
		if (config.callback != undefined)
			config.callback();
	};
}