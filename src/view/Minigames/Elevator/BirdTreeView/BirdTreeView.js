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
			agent,
			agentPickGroup,
			second = 0.75,
			coordinates = {
				treeX: 700, treeY: 10,
				numpadHeight: 100, numpadYOffset: 30,
				bgZoomX: -50, bgZoomY: -810, bgZoomScale: {x: 2.25, y: 2.25},
				birdStartX: -100, birdStartY: 600,
				birdShowX: 50, birdShowY: 500,
				agentStartX: 200, agentStartY: 800,
				agentStopX: 290, agentStopY: 400,
			};
		
		layer = new Kinetic.Layer();
		numpanelLayer = new Kinetic.Layer();
		
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
			x: coordinates.treeX,
			y: coordinates.treeY,
			nbrOfBranches: elevatorMinigame.getNumberOfBranches()
		});
		layer.add(tree);
		
		/* Add the group which will hold the agents thought bubble. */
		agentPickGroup = new Kinetic.Group();
		layer.add(agentPickGroup);
		
		/* Add the elevator */
		elevator = new MW.BirdTreeElevator({});
		elevator.setX(tree.getX() - elevator.getWidth() / 2);
		elevator.setY(tree.getY() + tree.getHeight() - elevator.getHeight());
		elevatorOrigin = elevator.getY();
		layer.add(elevator);
		
		/* Add the tree top */
		layer.add(new Kinetic.Image({
			x: tree.getX() - MW.Images.ELEVATORGAME_TREE_TOP.width / 2,
			y: tree.getY() - MW.Images.ELEVATORGAME_TREE_TOP.height / 2 - 15,
			image: MW.Images.ELEVATORGAME_TREE_TOP
		}));
		
		/* Add the panel with buttons in its own layer so it is always shown */
		numpanel = new MW.Numpanel({
			height: coordinates.numpadHeight,
			nbrOfButtons: elevatorMinigame.getNumberOfBranches(),
			buttonScale: 0.9,
			drawScene: function () {
				numpanelLayer.draw();
			}
		});
		numpanel.setX((stage.getWidth() / 2) - (numpanel.getWidth() / 2));
		numpanel.setY(stage.getHeight() - numpanel.getHeight() -
			coordinates.numpadYOffset);
		numpanelLayer.add(numpanel);
		
		/* Add the layers */
		stage.add(layer);
		stage.add(numpanelLayer);
		
		
		/**
		 * Turn the bird around.
		 * @private
		 * @param {Number} direction - 1 is right, -1 is left
		 */ 
		function turnBird (direction, callback) {
			/* No need to turn if already in correct direction */
			if (direction > 0 && bird.getScale().x > 0 ||
				direction < 0 && bird.getScale().x < 0) {
				callback();
				return;
			}
			
			bird.transitionTo({
				x: bird.getX() + (bird.getWidth() * bird.getScale().x),
				scale: {x: -1 * bird.getScale().x, y: bird.getScale().y},
				duration: second * 0.1,
				callback: callback
			});
		}
		
		/**
		 * Move the bird to the start position.
		 * @private
		 */
		function moveBirdToStartPosition () {
			/* Zoom in on bird */
			layer.transitionTo({
				x: coordinates.bgZoomX,
				y: coordinates.bgZoomY,
				scale: coordinates.bgZoomScale,
				duration: second * 1
			});
			
			var x = - elevator.getX() + coordinates.birdShowX;
			var scale = 0.6;
			/* Left is -1, right is 1 */
			var direction = x > bird.getX() ? 1 : -1;
			turnBird(direction, function () {
				bird.transitionTo({
					x: x + (direction < 0 ? (bird.getWidth() * scale) : 0),
					y: - elevator.getY() + coordinates.birdShowY,
					scale: {x: direction * scale, y: scale},
					duration: second * 2,
					easing: 'ease-out',
					callback: function () {
						turnBird(1, function () {
							bird.showNumber(true);
						});
						view.tell(MW.Event.MG_ELEVATOR_TARGET_IS_PLACED);
					}
				});
			});
		}
		
		/**
		 * Move the bird to peak in the elevator.
		 * @private
		 * @param {Boolean} peak - true if the bird should peak, false if not
		 * @param {Function} callback - function to call when done
		 */
		function moveBirdElevatorPeak (peak, callback) {
			bird.transitionTo({
				y: bird.getY() + (peak ? -18 : 18),
				duration: second * 0.5,
				easing: (peak ? 'ease-out' : 'ease-in'),
				callback: callback
			});
		}
		
		/**
		 * Move the bird to the elevator.
		 * @private
		 * @param {Function} callback - function to call when done
		 */
		function moveBirdToElevator (callback) {
			var x = 8;
			var scale = 0.1;
			/* Left is -1, right is 1 */
			var direction = x > bird.getX() ? 1 : -1;
			turnBird(direction, function () {
				bird.transitionTo({
					x: x + (direction < 0 ? (bird.getWidth() * scale) : 0),
					y: 8,
					scale: {x: direction * scale, y: scale},
					duration: second * 2,
					easing: 'ease-in',
					callback: callback
				});
			});
		}
		
		/**
		 * Move the bird from the elevator out on the branch.
		 * @private
		 * @param {Number} branch - which branch the elevator is at 
		 * @param {Function} callback - function to call when done
		 */
		function moveBirdToNest (branch, isCorrect, callback) {
			var nest = tree.getBranches()[branch - 1].getNest();
			var x = - elevator.getX() + (tree.getX() +
					tree.getBranches()[branch - 1].getX() +
					nest.getX());
			/* Left is -1, right is 1 */
			var direction = x > bird.getX() ? 1 : -1;
			x = x + (direction > 0 ? -bird.getWidth() * bird.getScale().x :
				nest.getWidth())
			turnBird(direction, function () {
				bird.transitionTo({
					x: x - (direction < 0 ?
						(bird.getWidth() * bird.getScale().x) : 0),
					duration: second * 1,
					easing: 'ease-out',
					callback: function () {
						/* Did our bird get to the correct nest? */
						var animationTime = 2; 
						if (isCorrect) {
							elevator.removePassenger(bird);
							nest.addChick();
							nest.celebrate(true);
							setTimeout(function () {
								nest.celebrate(false);
							}, second * animationTime * 1000);
						} else {
							nest.scare(true);
							setTimeout(function () {
								nest.scare(false);
							}, second * animationTime * 1000);
						}
						layer.transitionTo({
							x: layer.getX(),
							duration: second * animationTime,
							callback: callback
						});
					}
				});
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
					tree.getY() + tree.getBranches()[nextFloor-1].getY() +
					tree.getBranches()[nextFloor-1].getNest().getY() + 12,
				duration: second * 1,
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
		 * Agent wants to pick a number.
		 * @private
		 * @param {Number} number - the number the agent want to pick
		 * @param {Number} confidence - how sure the agent is
		 */
		function agentPickNumber (number, confidence) {
			var button = new MW.Button({
				x: coordinates.agentStopX - 150,
				y: coordinates.agentStopY - 20,
				number: number
			});
			button.getGroup().setScale({x: 0.5, y: 0.5});
			button.getGroup().setListening(false);
			agentPickGroup.add(button.getGroup());
		}
		
		
		/**
		 * A target has been chosen, introduce baby bird.
		 * @param {Hash} vars
		 * @param {Number} vars.targetNumber - the target of the bird
		 */
		view.on(MW.Event.MG_LADDER_PLACE_TARGET, function (vars) {
			bird = new MW.Bird({
				x: - elevator.getY() + coordinates.birdStartX,
				y: - elevator.getY() + coordinates.birdStartY,
				scale: {x: 0.3, y: 0.3},
				number: vars.targetNumber
			});
			bird.walk(true);
			elevator.addPassenger(bird);
			moveBirdToStartPosition();
		});
		
		/**
		 * Picked a number on the numpad, move bird and elevator.
		 * @param {Hash} vars
		 * @param {Number} vars.number - the chosen number
		 * @param {Boolean} vars.tooHigh - the chosen number was too high
		 * @param {Boolean} vars.tooLow - the chosen number was too low
		 */
		view.on(MW.Event.MG_LADDER_PICKED, function (vars) {
			bird.showNumber(false);
			
			/* Zoom out to tree */
			layer.transitionTo({
				x: 0,
				y: 0,
				scale: {x: 1, y: 1},
				duration: second * 1
			});
			
			if (!(vars.agent === undefined || !vars.agent)) {
				agentPickNumber(vars.number, vars.agentConfidence);
			}
			
			bird.walk(true);
			moveBirdToElevator(function () {
			moveBirdElevatorPeak(true, function () {
			moveElevator(vars.number, 1, function () {
			moveBirdElevatorPeak (false, function () {
			moveBirdToNest(vars.number, !(vars.tooHigh || vars.tooLow),
				function () {
				if (vars.tooHigh || vars.tooLow) {
					/* If picked wrong, bird goes back */
					moveBirdToElevator(function () {
					moveBirdElevatorPeak(true, function () {
					moveElevator(0, 0, function () {
					moveBirdElevatorPeak(false, function () {
					moveBirdToStartPosition();
					});
					});
					});
					});
				} else {
					moveElevator(0, 0, function () {
						view.tell('ROUND_DONE');
					});
				}
			});
			});
			});
			});
			});
		});
		
		/**
		 * Introduce the agent to the playing field.
		 */
		view.on(MW.Event.MG_LADDER_INTRODUCE_AGENT, function () {
			agent = new MW.PandaAgentView({
				x: coordinates.agentStartX,
				y: coordinates.agentStartY
			});
			layer.add(agent.getGraphics());
			agent.getGraphics().setZIndex(elevator.getZIndex() - 1);
			agent.transitionTo({
				x: coordinates.agentStopX,
				y: coordinates.agentStopY,
				duration: second * 1,
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
				x: 225,
				y: 425,
				duration: second * 1,
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