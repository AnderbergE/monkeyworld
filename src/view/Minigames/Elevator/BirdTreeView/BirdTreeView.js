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
		var view = this,
			layer,
			tree,
			numpanel;

		layer = new Kinetic.Layer();
		
		/* Add background */
		layer.add(new Kinetic.Rect({
			x: 0,
			y: 0,
			width: stage.getWidth(),
			height: stage.getHeight(),
			fill: 'black'
		}));

		/* Create the tree */
		tree = new MW.BirdTree({
			x: 600,
			y: 100,
			height: 400,
			nbrOfBranches: 5
		});
		layer.add(tree);
		
		/* Add the panel with buttons */
		numpanel = new MW.Numpanel({
			height: 75,
			nbrOfButtons: tree.getNbrOfBranches(),
			buttonScale: 0.9,
			buttonPushed: function (i) {
				elevatorMinigame.pickedNumber(i)
			},
			drawScene: function () {
				layer.draw();
			}
		});
		numpanel.setX((stage.getWidth() / 2) - (numpanel.getWidth() / 2));
		numpanel.setY(stage.getHeight() - numpanel.getHeight() - 10);
		layer.add(numpanel);
		
		/* Add the elevator */
		elevator = new MW.BirdTreeElevator({});
		elevator.setX(tree.getX() + tree.getWidth() / 2 -
			elevator.getWidth() / 2);
		elevator.setY(tree.getY() + tree.getHeight() - elevator.getHeight());
		layer.add(elevator);

		/* Add the layer and draw it */
		stage.add(layer);
		layer.draw();
		
		
		/**
		 * Picked a number on the numpad
		 */
		view.on(MW.Event.MG_LADDER_PICKED, function (vars) {
			elevatorOrigin = elevator.getY();
			/* lock buttons from clicks */
			numpanel.lock(true);
			/* Anonymous function to stop at each elevator floor */
			var gotoFloor = 0;
			(function() {
				gotoFloor++;
				elevator.transitionTo({
					y: tree.getY() + tree.getBranchY(gotoFloor),
					duration: 1,
					easing: 'ease-in-out',
					/* Recursive call if we have not reached our destination */
					/* otherwise go back to start */
					callback: gotoFloor != vars.number ? arguments.callee :
						function () {
							elevator.transitionTo({
								y: elevatorOrigin,
								duration: 1,
								easing: 'ease-in-out',
								/* unlock buttons */
								callback: function () {numpanel.lock(false);}
							});
						}
				});
			})(); /* Call the anonymous function right away */
		});
		
		
		this.addTearDown(function () {
			stage.remove(layer);
		});
	}
});