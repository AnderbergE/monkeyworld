/**
 * @constructor
 * @extends {MW.ElevatorView}
 * @param {MW.ElevatorMinigame} elevatorMinigame
 * @param {Kinetic.Stage} stage
 * @param {MW.AgentView} agentView
 */
MW.BirdTreeView = MW.ElevatorView.extend(
/** @lends {MW.BirdTreeView.prototype} */
{
	/** @constructs */
	init: function (elevatorMinigame, stage, agentView) {
		this._super(elevatorMinigame, stage, agentView, "BirdTreeView");
		var
			view = this,
			layer = new Kinetic.Layer();

		stage.add(layer);
		layer.add(new Kinetic.Image({
			image: MW.Images.TREEGAME_BACKGROUND,
			x: 0,
			y: stage.getHeight() - MW.Images.TREEGAME_BACKGROUND.height,
			width: MW.Images.TREEGAME_BACKGROUND.width,
			height: MW.Images.TREEGAME_BACKGROUND.height
		}));

		layer.draw();
		
		view.addTearDown(function () {
			stage.remove(layer);
		});
	}
});

