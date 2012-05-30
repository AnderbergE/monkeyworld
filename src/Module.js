/**
 * @constructor
 * @extends {MW.GlobalObject}
 */
function Module() {
	MW.GlobalObject.call(this, "Module");
	var timeoutController = new TimeoutController();

	this.tearDown = function() {
		timeoutController.teardown();
	};
	
	/**
	 * @param {Function} fnc
	 * @param {number} time
	 * @return {number}
	 */
	this.setTimeout = function(fnc, time) {
		return timeoutController.setTimeout(fnc, time);
	};

	/**
	 * @param {Function} fnc
	 * @param {number} time
	 * @return {number}
	 */
	this.setInterval = function(fnc, time) {
		return timeoutController.setInterval(fnc, time);
	};
	
	/**
	 * @param {number} id
	 */
	this.clearTimeout = function(id) {
		timeoutController.clearTimeout(id);
	};
	
	/**
	 * @constructor
	 * @private
	 */
	function TimeoutController() {
		
		var timeouts = new Array();
		
		/**
		 * @param {Function} fnc
		 * @param {number} time
		 * @return {number}
		 */
		this.setTimeout = function(fnc, time) {
			var handler = setTimeout(fnc, time);
			timeouts.push(handler);
			return handler;
		};
		
		/**
		 * @param {Function} fnc
		 * @param {number} time
		 * @returns {number}
		 */
		this.setInterval = function(fnc, time) {
			var handler = setTimeout(fnc, time);
			timeouts.push(handler);
			return handler;
		};
		
		/**
		 * @param {number} id
		 */
		this.clearTimeout = function(id) {
			timeouts.remove(id);
			clearTimeout(id);
		};
		
		/**
		 * 
		 */
		this.teardown = function() {
			for (var i = 0; i < timeouts.length; i++) {
				clearTimeout(timeouts[i]);
			}
			delete timeouts;
			timeouts = new Array();
		};
	};
}
inherit(Module, MW.GlobalObject);