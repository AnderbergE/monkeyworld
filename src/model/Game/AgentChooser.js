/**
 * @constructor
 * @extends {MW.Module}
 */
MW.AgentChooser = function(done) {
	MW.Module.call(this, "AgentChooser");
	var chooser = this;
	
	var agents = [
		{ model: MW.MonkeyAgent, view: MW.MonkeyAgentView },
		{ model: MW.MouseAgent, view: MW.MouseAgentView },
		{ model: MW.MonkeyAgent, view: MW.MonkeyAgentView },
		{ model: MW.MonkeyAgent, view: MW.MonkeyAgentView }
	];

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
