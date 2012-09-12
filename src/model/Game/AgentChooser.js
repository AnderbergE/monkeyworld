/**
 * @constructor
 * @extends {MW.Module}
 * @param {Function} done
 */
MW.AgentChooser = MW.Module.extend(
/** @lends {MW.AgentChooser.prototype} */
{
	/** @constructs */
	init: function (done) {
		this._super("AgentChooser");
		this._agents = [
			{ model: MW.MonkeyAgent, view: MW.MonkeyAgentView },
			{ model: MW.MouseAgent, view: MW.MouseAgentView },
			{ model: MW.MonkeyAgent, view: MW.MonkeyAgentView },
			{ model: MW.MonkeyAgent, view: MW.MonkeyAgentView }
		];
		this._done = done;
	},

	/**
	 * Get an array representing the available agents.
	 * @returns {Array}
	 */
	getAgents: function () {
		return this._agents;
	},

	/**
	 * Choose an agent
	 * @param agent
	 */
	choose: function (agent) {
		this._done(agent);
	}
});

