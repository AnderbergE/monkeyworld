/**
 * @constructor
 * @extends {MW.Module}
 */
MW.AgentChooser = function(done) {
	MW.Module.call(this, "AgentChooser");
	var chooser = this;
	
	var agents = [
		{ model: MW.MonkeyAgent, headView: MW.MonkeyAgentView, bodyView: MonkeyAgentView },
		{ model: MW.MouseAgent, headView: MW.MouseAgentHeadView, bodyView: MouseAgentBodyView },
		{ model: MW.MonkeyAgent, headView: MW.MonkeyAgentView, bodyView: MonkeyAgentView },
		{ model: MW.MonkeyAgent, headView: MW.MonkeyAgentView, bodyView: MonkeyAgentView }
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

