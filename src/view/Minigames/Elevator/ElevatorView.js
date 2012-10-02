/**
 * @constructor
 * @extends {MW.MinigameView}
 * @param {MW.ElevatorMinigame} elevatorMinigame
 * @param {Kinetic.Stage} stage
 * @param {MW.AgentView} agentView
 * @param {String} tag
 */
MW.ElevatorView = MW.MinigameView.extend(
/** @lends {MW.ElevatorView.prototype} */
{
	/** @constructs */
	init: function (elevatorMinigame, stage, agentView, tag) {
		this._super(elevatorMinigame, stage, agentView, tag);
		this.tag(tag);
		var view = this;
	}
});
