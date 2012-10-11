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
			numpanel,
			elevator,
			elevatorOrigin,
			bird,
			birdGroup, /* This holds the bird and the "fingers" */
			agent;

		layer = new Kinetic.Layer();
		
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
		
		/* Add the panel with buttons */
		numpanel = new MW.Numpanel({
			height: 75,
			nbrOfButtons: tree.getBranches().length,
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
		elevatorOrigin = elevator.getY();

		/* Add the group which will hold the birds and set Z */
		birdGroup = new Kinetic.Group();
		layer.add(birdGroup);
		birdGroup.setZIndex(elevator.getZIndex() - 1);
		tree.setZIndex(birdGroup.getZIndex() - 1);
		
		/* Add the layer and draw it */
		stage.add(layer);
		layer.draw();
		
		
		/**
		 * Move the bird to the elevator.
		 * @private
		 * @param callback - function to call when done
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
		 * @param branch - which branch the elevator is at 
		 * @param callback - function to call when done
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
		 * @param floor - the target floor
		 * @param callback - function to call when done
		 */
		function moveElevator (floor, callback) {
			if (floor == 0) {
				elevator.transitionTo({
					y: elevatorOrigin,
					duration: 1,
					easing: 'ease-in-out',
					callback: callback
				});
				return;
			}
			/* Anonymous function to stop at each elevator floor */
			var gotoFloor = 0;
			(function () {
				gotoFloor++;
				elevator.transitionTo({
					y: tree.getY() + tree.getBranches()[gotoFloor-1].getY(),
					duration: 1,
					easing: 'ease-in-out',
					/* Recursive call if we have not reached our destination */
					/* otherwise go back to start */
					callback: gotoFloor != floor ? arguments.callee : callback
				});
			})(); /* Call the anonymous function right away */
		}
		
		
		/**
		 * A target has been chosen, introduce baby bird.
		 */
		view.on(MW.Event.MG_LADDER_PLACE_TARGET, function (vars) {
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
		 */
		view.on(MW.Event.MG_LADDER_PICKED, function (vars) {
			/* lock buttons from clicks */
			numpanel.lock(true);
			
			/* This function will be called later, avoiding code duplication. */
			var tempMover = function () {
				moveElevator(vars.number, function () {
					moveBirdFromElevator(vars.number, function () {
						
						/* Same as above. */
						var done = function () {
							if (vars.correct) {
								elevatorMinigame.nextRound();
							} else {
								/* Make buttons clickable */
								numpanel.lock(false);
							}
						}
						
						if (!vars.correct) {
							moveBirdToElevator(function () {
								bird.setOpacity(0);
								moveElevator(0, done);
							});
						} else {
							moveElevator(0, done);
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
		view.on(MW.Event.MG_LADDER_INTRODUCE_AGENT, function (callback) {
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
				callback: callback
			});
		});
		
		/**
		 * Agent starts acting.
		 */
		view.on(MW.Event.MG_LADDER_START_AGENT, function (callback) {
			agent.transitionTo({
				x: 330,
				duration: 1,
				easing: 'ease-out',
				callback: callback
			});
		});
		
		
		this.addTearDown(function () {
			stage.remove(layer);
		});
	}
});