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
			elevatorGroup,
			elevatorOrigin,
			bird,
			birdGroup, /* This holds the bird and the "fingers" */
			birdInElevator,
			agent;
		
		layer = new Kinetic.Layer();
		numpanelLayer = new Kinetic.Layer();
		
		/* Setup colors that will be used by the birds. */
		MW.BirdColorSetup(elevatorMinigame.getNumberOfBranches());
		
		/* Add background */
		layer.add(new Kinetic.Image({
			x: 0,
			y: 0,
			image: MW.Images.ELEVATORGAME_BACKGROUND,
			width: stage.getWidth(),
			height: stage.getHeight()
		}));
		
		/* Create the tree */
		tree = new MW.BirdTree({
			x: 700,
			y: 10,
			height: 400,
			nbrOfBranches: elevatorMinigame.getNumberOfBranches()
		});
		//tree.setScale(0.5, 0.5);
		layer.add(tree);
		
		/* Add the group which will hold the birds */
		birdGroup = new Kinetic.Group();
		layer.add(birdGroup);
		
		/* Add the elevator */
		elevator = new MW.BirdTreeElevator({});
		elevatorGroup = new Kinetic.Group({
			x: tree.getX() - elevator.getWidth() / 2,
			y: tree.getY() + tree.getHeight() - elevator.getHeight()
		});
		elevatorOrigin = elevatorGroup.getY();
		elevatorGroup.add(elevator);
		layer.add(elevatorGroup);
		
		/* Add the tree top */
		layer.add(new Kinetic.Image({
			x: tree.getX() - MW.Images.ELEVATORGAME_TREE_TOP.width / 2,
			y: tree.getY() - MW.Images.ELEVATORGAME_TREE_TOP.height / 2,
			image: MW.Images.ELEVATORGAME_TREE_TOP
		}));
		
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
		numpanel.setY(stage.getHeight() - numpanel.getHeight() - 40);
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
				x: elevatorGroup.getX() + 5,
				y: elevatorGroup.getY(),
				scale: {x: 0.40, y: 0.40},
				duration: 2,
				easing: 'ease-in-out',
				callback: function () {
					bird.transitionTo({
						y: bird.getY() - 15,
						duration: 0.5,
						easing: 'ease-out',
						callback: callback
					});
				}
			});
		}
		
		/**
		 * Move the bird from the elevator out on the branch.
		 * @private
		 * @param {Number} branch - which branch the elevator is at 
		 * @param {Function} callback - function to call when done
		 */
		function moveBirdFromElevator (branch, callback) {
			bird.setY(elevatorGroup.getY() + elevator.getHeight() / 2);
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
			elevatorGroup.transitionTo({
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
			/* Zoom in on bird when it arrives */
			layer.transitionTo({
				x: -100,
				y: -650,
				scale: {x: 2, y: 2},
				duration: 1
			});
			
			birdGroup.removeChildren();
			bird = new MW.Bird({
				x: -50,
				y: 600,
				number: vars.targetNumber
			});
			birdGroup.add(bird);
			/* Bird enters screen */
			bird.transitionTo({
				x: 100,
				y: 500,
				scale: {x: 2, y: 2},
				duration: 1,
				easing: 'ease-out',
				callback: function () {
					bird.showNumber(true);
					if (!vars.agentDo) {
						/* Make buttons clickable */
						numpanel.lock(false);
					}
					view.tell('MW.Event.MG_ELEVATOR_TARGET_IS_PLACED');
				}
			});
			birdInElevator = false;
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
			
			/* Zoom out to tree */
			layer.transitionTo({
				x: 0,
				y: 0,
				scale: {x: 1, y: 1},
				duration: 1
			});
			
			bird.showNumber(false);
			
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
							/* BIRD SHOULD BE SAD :( */
							moveBirdToElevator(function () {
								bird.setOpacity(0);
								moveElevator(0, 0, done);
							});
						} else {
							/* BIRD SHOULD BE HAPPY :) */
							moveElevator(0, 0, done);
						}
					});
				});
			};
			
			if (!birdInElevator) {
				moveBirdToElevator(function () {
					bird.setOpacity(0);
					birdInElevator = true;
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