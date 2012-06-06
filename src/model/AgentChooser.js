/**
 * @constructor
 * @extends {Module}
 */
MW.AgentChooser = function(done) {
	Module.call(this);
	var chooser = this;
	
	var agents = ["monkey", "lion", "elephant", "giraff"];
	
	/**
	 * Get an array representing the available agents.
	 * @returns {Array}
	 */
	chooser.getAgents = function() { return agents; };
	
	/**
	 * Choose an agent
	 * @param agent
	 */
	chooser.choose = function(agent) {
		done(agent);
	};
	
};
inherit (MW.AgentChooser, Module);