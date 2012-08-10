/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {string} tag
 */
MW.Module = function(tag) {
	MW.GlobalObject.call(this, tag);
	var module = this;
	var timeoutController = new TimeoutController();
	
	var tearDowns = new Array();
	var setups = new Array();
	
	this.addTearDown = function(fnc) {
		tearDowns.push(fnc);
	};
	
	this.tearDown = function() {
		if (tearDowns === null)
			throw "MW.TearDownAlreadyCalledException";
		timeoutController.teardown();
		module.forget();
		for (var i = 0; i < tearDowns.length; i++) {
			tearDowns[i]();
			tearDowns[i] = null;
		};
		tearDowns = null;
	};
	
	this.addSetup = function(fnc) {
		setups.push(fnc);
	};
	
	this.setup = function() {
		if (setups === null)
			throw "MW.SetupAlreadyCalledException";
		for (var i = 0; i < setups.length; i++) {
			setups[i]();
			setups[i] = null;
		};
		setups = null;
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
	 * @param {number} id
	 */
	this.clearInterval = function(id) {
		timeoutController.clearInterval(id);
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
			var handler = setInterval(fnc, time);
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
		 * @param {number} id
		 */
		this.clearInterval = function(id) {
			timeouts.remove(id);
			clearInterval(id);
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
};
