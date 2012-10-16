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
			numpanelLayer,
			numpanel,
			elevator,
			elevatorOrigin,
			bird,
			birdGroup, /* This holds the bird and the "fingers" */
			agent;
		
		layer = new Kinetic.Layer();
		numpanelLayer = new Kinetic.Layer();
		
		/* Setup colors that will be used by the birds. */
		MW.BirdColorSetup(elevatorMinigame.getNumberOfBranches());
		
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
			nbrOfBranches: elevatorMinigame.getNumberOfBranches()
		});
		layer.add(tree);
		
		/* Add the group which will hold the birds */
		birdGroup = new Kinetic.Group();
		layer.add(birdGroup);
		
		/* Add the elevator */
		elevator = new MW.BirdTreeElevator({});
		elevator.setX(tree.getX() + tree.getWidth() / 2 -
			elevator.getWidth() / 2);
		elevator.setY(tree.getY() + tree.getHeight() - elevator.getHeight());
		layer.add(elevator);
		elevatorOrigin = elevator.getY();
		
		/* Add the panel with buttons in its own layer so it is always shown */
		numpanel = new MW.Numpanel({
			height: 75,
			nbrOfButtons: elevatorMinigame.getNumberOfBranches(),
			buttonScale: 0.9,
			drawScene: function () {
				numpanelLayer.draw();
			}
		});
		numpanel.setX((stage.getWidth() / 2) - (numpanel.getWidth() / 2));
		numpanel.setY(stage.getHeight() - numpanel.getHeight() - 10);
		numpanelLayer.add(numpanel);
		
		/* Add the layers */
		stage.add(layer);
		stage.add(numpanelLayer);
		
		
		/**
		 * Move the bird to the elevator.
		 * @private
		 * @param {Function} callback - function to call when done
		 */
		function moveBirdToElevator (callback) {
			bird.transitionTo({
				x: elevator.getX(),
				y: elevator.getY() + elevator.getHeight() / 2,
				scale: {x: 0.40, y: 0.40},
				duration: 2,
				easing: 'ease-in-out',
				callback: callback
			});
		}
		
		/**
		 * Move the bird from the elevator out on the branch.
		 * @private
		 * @param {Number} branch - which branch the elevator is at 
		 * @param {Function} callback - function to call when done
		 */
		function moveBirdFromElevator (branch, callback) {
			bird.setY(elevator.getY() + elevator.getHeight() / 2);
			bird.setOpacity(1);
			bird.transitionTo({
				x: tree.getX() +
					tree.getBranches()[branch - 1].getX() +
					tree.getBranches()[branch - 1].getNestX(),
				duration: 1,
				easing: 'ease-in-out',
				callback: callback
			});
		}
		
		/**
		 * Move the elevator to specific floor.
		 * if floor is 0 the elevator is moved to the bottom of the tree.
		 * @private
		 * @param {Number} targetFloor - the target floor
		 * @param {Number} nextFloor - the next floor to go to
		 * @param {Function} callback - function to call when done
		 */
		function moveElevator (targetFloor, nextFloor, callback) {
			/* Anonymous function to stop at each elevator floor when going up.
			 * No stops when going to bottom. */
			elevator.transitionTo({
				y: targetFloor == 0 ? elevatorOrigin :
					tree.getY() + tree.getBranches()[nextFloor-1].getY(),
				duration: 1,
				easing: 'ease-in-out',
				callback: function () {
					if (nextFloor < targetFloor) {
						elevator.setFloor(nextFloor);
						/* Recursive call if we have not reached our dest */
						moveElevator(targetFloor, nextFloor + 1, callback);
					} else {
						elevator.setFloor(nextFloor);
						callback();
					}
				}
			});
		}
		
		
		/**
		 * A target has been chosen, introduce baby bird.
		 * @param {Hash} vars
		 * @param {Number} vars.targetNumber - the target of the bird
		 */
		view.on(MW.Event.MG_LADDER_PLACE_TARGET, function (vars) {
			layer.transitionTo({
				y: -300,
				scale: {x: 1.75, y: 1.75},
				duration: 1
			});
			birdGroup.removeChildren();
			bird = new MW.Bird({
				x: -50,
				y: 350,
				number: vars.targetNumber
			});
			birdGroup.add(bird);
			/* Bird enters screen */
			bird.transitionTo({
				x: 75,
				y: 400,
				scale: {x: 2, y: 2},
				duration: 1,
				easing: 'ease-out',
				callback: function () {
					/* Animate fingers here */
					for (var i = 1; i <= vars.targetNumber; i++) {
						birdGroup.add(new Kinetic.Rect({
							x: i*30,
							y: 200,
							width: 10,
							height: 30,
							fill: 'darkblue'
						}));
					}
					if (vars.callback === undefined || vars.callback == null) {
						/* Make buttons clickable */
						numpanel.lock(false);
					} else {
						vars.callback();
					}
				}
			});
		});
		
		/**
		 * Picked a number on the numpad, move bird and elevator.
		 * @param {Hash} vars
		 * @param {Number} vars.number - the chosen number
		 * @param {Boolean} vars.tooHigh - the chosen number was too high
		 * @param {Boolean} vars.tooLow - the chosen number was too low
		 */
		view.on(MW.Event.MG_LADDER_PICKED, function (vars) {
			/* lock buttons from clicks */
			numpanel.lock(true);
			
			layer.transitionTo({
				y: 0,
				scale: {x: 1, y: 1},
				duration: 1
			});
			
			/* This function will be called later, avoiding code duplication. */
			var tempMover = function () {
				moveElevator(vars.number, 1, function () {
					moveBirdFromElevator(vars.number, function () {
						
						/* Same as above. */
						var done = function () {
							if (vars.tooHigh || vars.tooLow) {
								numpanel.lock(false);
							} else {
								view.tell('ROUND_DONE');
							}
						}
						
						/* Move elevator to the bottom.
						 * If wrong, bird goes back */
						if (vars.tooHigh || vars.tooLow) {
							moveBirdToElevator(function () {
								bird.setOpacity(0);
								moveElevator(0, 0, done);
							});
						} else {
							moveElevator(0, 0, done);
						}
					});
				});
			};
			
			if (!bird.inElevator()) {
				moveBirdToElevator(function () {
					bird.setOpacity(0);
					bird.setInElevator(true);
					tempMover();
				});
			} else {
				tempMover();
			}
		});
		
		/**
		 * Introduce the agent to the playing field.
		 */
		view.on(MW.Event.MG_LADDER_INTRODUCE_AGENT, function () {
			agent = new Kinetic.Rect({
				x: 300,
				y: -100,
				width: 60,
				height: 80,
				fill: 'chartreuse' 
			});
			layer.add(agent);
			agent.transitionTo({
				x: 300,
				y: 350,
				duration: 1,
				easing: 'ease-out',
				callback: function () {
					view.tell('ROUND_DONE');
				}
			});
		});
		
		/**
		 * Agent starts acting.
		 */
		view.on(MW.Event.MG_LADDER_START_AGENT, function () {
			agent.transitionTo({
				x: 330,
				duration: 1,
				easing: 'ease-out',
				callback: function () {
					view.tell('ROUND_DONE');
				}
			});
		});
		
		
		this.addTearDown(function () {
			stage.remove(layer);
		});
	}
});