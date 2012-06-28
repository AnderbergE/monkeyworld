/**
 * @constructor
 * @extends {MW.Module}
 */
MW.AgentChooser = function(done) {
	MW.Module.call(this, "AgentChooser");
	var chooser = this;
	
	var agents = [
		MW.Images.MONKEY,
		MW.Images.LION,
		MW.Images.ELEPHANT,
		MW.Images.GIRAFF];
	
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
