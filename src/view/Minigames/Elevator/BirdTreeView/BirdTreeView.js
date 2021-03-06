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
			introGroup,
			tree,
			panelLayer,
			numpanel,
			boolpanel,
			elevator,
			elevatorOrigin,
			bird,
			agent,
			agentPickGroup,
			first = {pick: true, agentPick: true},
			instructionArrow,
			bgMusic,
			exitFade,
			second = 1,
			coordinates = {
				treeX: 700, treeY: 10,
				numpadHeight: 100, numpadYOffset: -10,
				bgZoomX: -50, bgZoomY: -790, bgZoomScale: {x: 2.25, y: 2.25},
				birdStartX: -100, birdStartY: 600,
				birdShowX: 50, birdShowY: 500,
				agentStartX: 200, agentStartY: 800,
				agentStopX: 290, agentStopY: 400,
				helpButtonX: 10, helpButtonY: 10,
			};
		
		layer = new Kinetic.Layer();
		panelLayer = new Kinetic.Layer({
			opacity: 0
		});
		
		/* Add background */
		layer.add(new Kinetic.Image({
			image: MW.Images.ELEVATORGAME_BACKGROUND,
			width: stage.getWidth(),
			height: stage.getHeight()
		}));
		
		/* Create the tree */
		tree = new MW.BirdTree({
			x: coordinates.treeX,
			y: coordinates.treeY,
			nbrOfBranches: elevatorMinigame.getNumberOfBranches(),
			drawScene: function () {
				layer.draw();
			}
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
			width: stage.getWidth() - 50,
			buttonWidth: 86,
			buttonHeight: 84,
			nbrOfButtons: elevatorMinigame.getNumberOfBranches(),
			drawScene: function () {
				panelLayer.draw();
			}
		});
		numpanel.getGroup().setX((stage.getWidth() / 2) -
			(numpanel.getWidth() / 2));
		numpanel.getGroup().setY(stage.getHeight() - numpanel.getHeight() +
			coordinates.numpadYOffset);
		numpanel.getGroup().setOpacity(0);
		panelLayer.add(numpanel.getGroup());
		
		/* Add the panel with the yes and no buttons */
		boolpanel = new MW.Boolpanel({
			width: 180,
			buttonWidth: 60,
			buttonHeight: 84,
			drawScene: function () {
				panelLayer.draw();
			}
		});
		boolpanel.getGroup().setX((stage.getWidth() / 2) -
			(boolpanel.getWidth() / 2));
		boolpanel.getGroup().setY(stage.getHeight() - boolpanel.getHeight() +
			coordinates.numpadYOffset);
		boolpanel.getGroup().setOpacity(0);
		panelLayer.add(boolpanel.getGroup());
		
		/* Add intro group that will be used during intro animation */
		introGroup = new Kinetic.Group();
		layer.add(introGroup);
		
		/* This is used when the game ends */
		exitFade = new Kinetic.Rect({
			fill: 'white', 
			width: stage.getWidth(),
			height: stage.getHeight(),
			opacity: 0
		})
		layer.add(exitFade);
		
		/* Add help button */
		panelLayer.add(new MW.Button({
			x: coordinates.helpButtonX,
			y: coordinates.helpButtonY,
			width: 45,
			height: 60,
			number: 0,
			drawScene: function () {
				panelLayer.draw();
			}
		}).getGroup());
		
		/* Add instruction arrow */
		instructionArrow = new Kinetic.Image({
			image: MW.Images.ELEVATORGAME_ARROW,
			opacity: 0,
			scale: 0.6
		});
		panelLayer.add(instructionArrow);
		
		/* Add the layers */
		stage.add(layer);
		stage.add(panelLayer);
		numpanel.getGroup().setListening(false);
		boolpanel.getGroup().setListening(false);
		
		
		this.instruction1 = function (shows) {
			var numListen = numpanel.getGroup().getListening();
			var boolListen = boolpanel.getGroup().getListening();
			if (!numListen && !boolListen) return;
			
			var max = bird.getNumber();
			var arrowTime = 0.75;
			numpanel.getGroup().setListening(false);
			boolpanel.getGroup().setListening(false);
			bird.say(MW.Sounds.BIRD_INSTRUCTION_1A);
			bird.showNumber(false);
			setTimeout(function () {
				bird.showNumber(true);
				instructionArrow.setOpacity(1);
				var i = 0;
				var birdPos = bird.getAbsolutePosition();
				
				/* Arrow that helps instructions */
				var arrowAnimation = setInterval(function() {
					instructionArrow.rotateDeg(bird.featherPos[i].r);
					instructionArrow.setX(birdPos.x +
						bird.featherPos[i].x *
						bird.getScale().x * layer.getScale().x);
					instructionArrow.setY(birdPos.y +
						bird.featherPos[i].y *
						bird.getScale().y * layer.getScale().y +
						/* The arrow rotates "over x" when it goes 180% */
						(instructionArrow.getRotation() < 2 ?
						-instructionArrow.getImage().height / 2 : 
						instructionArrow.getImage().height / 2) *
						instructionArrow.getScale().y);
					panelLayer.draw();
					i++;
					if (i >= max) {
						clearInterval(arrowAnimation);
						setTimeout(function () {
							instructionArrow.setOpacity(0);
							instructionArrow.setRotation(0);
							panelLayer.draw();
						}, second * (2 * arrowTime) * 1000)
					}
				}, second * arrowTime * 1000);
				
				setTimeout(function () {
					bird.say(MW.Sounds.BIRD_INSTRUCTION_1B);
					numpanel.lightUp(true);
					setTimeout(function () {
						if (!shows) {
							bird.showNumber(false);
						}
						numpanel.lightUp(false);
						numpanel.getGroup().setListening(numListen);
						boolpanel.getGroup().setListening(boolListen);
						panelLayer.draw();
					}, second * MW.Sounds.BIRD_INSTRUCTION_1B.getLength() * 1000);
				}, second * ((max + 3) * arrowTime) * 1000);
				
			}, second * 5 * 1000);
			return 5 + // Before seeing feathers
				((max + 3) * arrowTime) + // Arrowtime
				MW.Sounds.BIRD_INSTRUCTION_1B.getLength() + 0.5;
		}
		
		this.instruction2 = function () {
			var numListen = numpanel.getGroup().getListening();
			var boolListen = boolpanel.getGroup().getListening();
			if (!numListen && !boolListen) return;
			numpanel.getGroup().setListening(false);
			boolpanel.getGroup().setListening(false);
			bird.say(MW.Sounds.BIRD_INSTRUCTION_2);
			setTimeout(function () {
				boolpanel.getGroup().getChildren()[0].lightUp(true);
				setTimeout(function () {
					boolpanel.getGroup().getChildren()[0].lightUp(false);
				}, second * 1.5 * 1000);
				setTimeout(function () {
					boolpanel.getGroup().getChildren()[1].lightUp(true);
					setTimeout(function () {
						boolpanel.getGroup().getChildren()[1].lightUp(false);
						numpanel.getGroup().setListening(numListen);
						boolpanel.getGroup().setListening(boolListen);
						panelLayer.draw();
					}, second * 1.5 * 1000);
				}, second * 3.5 * 1000);
			}, second * 1.5 * 1000);
			return MW.Sounds.BIRD_INSTRUCTION_2.getLength() + 0.5;
		}
		
		/**
		 * Show/hide a panel.
		 * @private
		 * @param {MW.Buttonpanel} panel - the panel to show/hide
		 * @param {Boolean} show - true to show, false to hide
		 * @param {Function} callback - function to call when done
		 */
		function showPanel (panel, show, callback) {
			/* Never listen to events when panel is not shown */
			panel.getGroup().setListening(show);
			/* If opacity is already correct, no need to run transition */
			if (panel.getGroup().getOpacity() == (show ? 1 : 0)) {
				/* Don't forget to call this anyway */
				if (callback !== undefined) {
					callback();
				}
				return;
			}
			panel.getGroup().transitionTo({
				opacity: show ? 1 : 0,
				duration: second * 1,
				easing: 'ease-out',
				callback: callback
			});
		}
		
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
			} else {
				bird.turn(callback);
			}
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
				duration: second * 2
			});
			
			var x = - elevator.getX() + coordinates.birdShowX;
			var scale = 0.6;
			/* Left is -1, right is 1 */
			var direction = x > bird.getX() ? 1 : -1;
			turnBird(direction, function () {
				/* Move to start position */
				bird.transitionTo({
					x: x + (direction < 0 ? (bird.getWidth() * scale) : 0),
					y: - elevator.getY() + coordinates.birdShowY,
					scale: {x: direction * scale, y: scale},
					duration: second * 2,
					easing: 'ease-out',
					callback: function () {
						bird.walk(false);
						/* Turn bird right */
						turnBird(1, function () {
							/* First time is introduction, highlight mechanics */
							var timeout = 0;
							if (first.pick) {
								first.pick = false;
								timeout = view.instruction1(false);
							}
							/* Bird say where it belongs */
							setTimeout(function () {
								bird.say(MW.Sounds.BIRD_THIS_LEVEL);
								setTimeout(function () {
									bird.showNumber(true);
								}, second * 1 * 1000);
								setTimeout(function () {
									view.tell(MW.Event.TARGET_IS_PLACED);
								}, second * MW.Sounds.BIRD_THIS_LEVEL.getLength() * 1000);
							}, second * timeout * 1000);
						});
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
			showPanel(boolpanel, false);
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
			var nest = tree.getBranch(branch).getNest();
			var x = - elevator.getX() + (tree.getX() +
					tree.getBranch(branch).getX() +
					nest.getX());
			/* Left is -1, right is 1 */
			var direction = x > bird.getX() ? 1 : -1;
			x = x + (direction > 0 ? -bird.getWidth() * bird.getScale().x :
				nest.getWidth() - 10)
			turnBird(direction, function () {
				/* Move bird to nest */
				bird.transitionTo({
					x: x - (direction < 0 ?
						(bird.getWidth() * bird.getScale().x) : 0),
					y: - elevator.getY() + tree.getY() +
						tree.getBranch(branch).getY() +
						nest.getY() + 15,
					duration: second * 1,
					easing: 'ease-out',
					callback: function () {
						bird.walk(false);
						var animationTime = second *
							MW.Sounds.BIRD_THANK.getLength();
						/* This is called after bird reacts to mother */
						var endFunction = function () {
							agentPickGroup.removeChildren();
							callback();
						}
						if (isCorrect) {
							/* The bird found home, celebrate! */
							elevator.removePassenger(bird);
							nest.addChick();
							nest.celebrate(true);
							MW.Sound.play(MW.Sounds.BIRD_THANK);
							if (agent !== undefined) {
								agent.wave(true);
							}
							setTimeout(function () {
								nest.celebrate(false);
								if (agent !== undefined) {
									agent.wave(false);
								}
								endFunction();
							}, animationTime * 1000);
						} else {
							/* The bird did not find home, its confusing! */
							nest.confused(true);
							setTimeout(function () {
								nest.confused(false);
							}, animationTime * 1000);
							endFunction();
						}
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
			if (targetFloor == 0) {
				MW.Sound.play(MW.Sounds.LIFT_SLIDE_DOWN);
			}
			elevator.transitionTo({
				y: targetFloor == 0 ? elevatorOrigin :
					tree.getY() + tree.getBranch(nextFloor).getY() +
					tree.getBranch(nextFloor).getNest().getY() + 20,
				duration: second * 1,
				easing: 'ease-in-out',
				callback: function () {
					elevator.setFloor(nextFloor);
					if (nextFloor < targetFloor) {
						/* Recursive call if we have not reached our dest */
						MW.Sound.play(MW.Sounds.LIFT);
						moveElevator(targetFloor, nextFloor + 1, callback);
					} else {
						if (targetFloor != 0) {
							MW.Sound.play(MW.Sounds.LIFT_STOP);
						}
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
			var thought = new Kinetic.Image({
				x: coordinates.agentStopX - 100,
				y: coordinates.agentStopY - 30,
				scale: {x: 0.1, y: 0.1},
				image: MW.Images.ELEVATORGAME_THOUGHT_BUBBLE,
			});
			agentPickGroup.add(thought);
			
			agent.say(MW.Sounds.AGENT_HMM);
			thought.transitionTo({
				x: thought.getX() - 100,
				y: thought.getY() - 30,
				scale: {x: 0.6, y: 0.6},
				duration: second * 2,
				easing: 'elastic-ease-out',
				callback: function () {
					var button = new MW.Button({
						x: thought.getX() +
							(thought.getWidth() * thought.getScale().x) / 3,
						y: thought.getY() +
							(thought.getHeight() * thought.getScale().y) / 3,
						number: number
					});
					button.getGroup().setScale({x: 0.5, y: 0.5});
					agentPickGroup.add(button.getGroup());
					showPanel(boolpanel, true);
					
					var timeout = 0;
					if (first.agentPick) {
						first.agentPick = false;
						timeout = view.instruction2();
					}
					setTimeout(function () {
						if (confidence >= 0.8) {
							agent.say(MW.Sounds.AGENT_PICK_CONFIDENCE_HIGH);
						} else if (confidence >= 0.5) {
							agent.say(MW.Sounds.AGENT_PICK_CONFIDENCE_MEDIUM);
						} else {
							agent.say(MW.Sounds.AGENT_PICK_CONFIDENCE_LOW);
						}
					}, second * timeout * 1000);
				}
			});
		}
		
		
		/**
		 * A target has been chosen, introduce baby bird.
		 * @param {Number} number - the target of the bird
		 */
		view.on(MW.Event.PLACE_TARGET, function (number) {
			bird = new MW.Bird({
				x: - elevator.getY() + coordinates.birdStartX,
				y: - elevator.getY() + coordinates.birdStartY,
				scale: {x: 0.3, y: 0.3},
				number: number,
				drawScene: function () {
					layer.draw();
				}
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
		view.on(MW.Event.PICKED_TARGET, function (vars) {
			/* Zoom out to tree */
			layer.transitionTo({
				x: 0,
				y: 0,
				scale: {x: 1, y: 1},
				duration: second * 1
			});
			
			var sound;
			if (vars.tooHigh) {
				sound = MW.Sounds.BIRD_WRONG_LOWER;
			} else if (vars.tooLow) {
				sound = MW.Sounds.BIRD_WRONG_HIGHER;
			}
			
			var agentFunc = function () {};
			if (agent !== undefined) {
				agentFunc = function () {
					agent.followObject();
					agent.followCursor(true);
				}
				agent.followObject(bird);
			}
			
			bird.showNumber(false);
			bird.walk(true);
			moveBirdToElevator(function () {
			moveBirdElevatorPeak(true, function () {
			moveElevator(vars.number, 1, function () {
			moveBirdElevatorPeak (false, function () {
			moveBirdToNest(vars.number, !(vars.tooHigh || vars.tooLow),
				function () {
				if (vars.tooHigh || vars.tooLow) {
					/* If picked wrong, bird goes back */
					bird.say(sound);
					setTimeout(function () {
						bird.walk(true);
						moveBirdToElevator(function () {
						moveBirdElevatorPeak(true, function () {
						moveElevator(0, 0, function () {
						moveBirdElevatorPeak(false, function () {
						moveBirdToStartPosition();
						agentFunc();
						if (!first.agentPick) {
							agent.say(MW.Sounds.AGENT_TRY_AGAIN);
						}
						});
						});
						});
						});
					}, (sound.getLength() + 0.1) * 1000);
				} else {
					moveElevator(0, 0, function () {
						agentFunc();
						view.tell(MW.Event.ROUND_DONE);
					});
				}
			});
			});
			});
			});
			});
		});
		
		/**
		 * Start the game, play introduction
		 */
		view.on(MW.Event.START_MINIGAME, function () {
			var i;
			for (i = 1; i <= tree.getNbrOfBranches(); i++) {
				tree.getBranch(i).getNest().addChick();
				tree.getBranch(i).getNest().celebrate(true);
			}
			var introClouds = new Kinetic.Image({
				image: MW.Images.ELEVATORGAME_BACKGROUND_CLOUDY,
				width: stage.getWidth(),
				height: stage.getHeight(),
				opacity: 0
			});
			introGroup.add(introClouds);
			var introRain = new Kinetic.Image({
				image: MW.Images.ELEVATORGAME_BACKGROUND_RAIN,
				width: stage.getWidth(),
				height: stage.getHeight(),
				opacity: 0
			});
			introGroup.add(introRain);
			var introAnimation = setInterval(function () {
				introRain.setX(Math.random()*30);
				introRain.setY(-50 + Math.random()*50);
				layer.draw();
			}, 50);
			
			/* Game begins, cue intro sound */
			MW.Sound.play(MW.Sounds.INTRO);
			/* Play background sounds after that */
			bgMusic = setInterval(function () {
				MW.Sound.play(MW.Sounds.BG);
			}, (MW.Sounds.BG.getLength() - 0.1) * 1000);
			
			/* Take some time before the storm starts */
			setTimeout(function () {
				/* Bring in clouds, birds stop being happy */
				introClouds.transitionTo({
					opacity: 1,
					duration: second * 1,
					callback: function () {
						for (i = 1; i <= tree.getNbrOfBranches(); i++) {
							tree.getBranch(i).getNest().celebrate(false);
						}
					}
				});
				/* Bring in rain, after birds are blown out of nest */
				introRain.transitionTo({
					opacity: 1,
					duration: second * 2.5,
					callback: function () {
						var animationTime = 4;
						for (i = 1; i <= tree.getNbrOfBranches(); i++) {
							tree.getBranch(i).getNest().removeChicks();
							var introNest = tree.getBranch(i).getNest();
							var introBird = new MW.Bird({
								x: tree.getX() +
									tree.getBranch(i).getX() +
									introNest.getX() +
									(introNest.getDirection() ?
										introNest.getWidth() - 20 : 20),
								y: tree.getY() +
									tree.getBranch(i).getY() +
									introNest.getY() + 15,
								scale: {x: 0.1, y: 0.1},
								number: introNest.getNumber()
							});
							introGroup.add(introBird);
							introBird.setZIndex(0);
							introNest.getDirection() ? introBird.turn() : null;
							introBird.transitionTo({
								x: -50,
								y: stage.getHeight() - 100,
								rotation: Math.random() * 40 + 5,
								duration: second * animationTime
							});
							introNest.scare(true);
						}
						/* Start this animation after the birds have fallen */
						setTimeout(function () {
							introGroup.transitionTo({
								opacity: 0,
								duration: second * 2,
								callback: function () {
									for (i = 1; i <= tree.getNbrOfBranches(); i++) {
										tree.getBranch(i).getNest().scare(false);
									}
									clearInterval(introAnimation);
									layer.remove(introGroup);
									/* Short break */
									setTimeout(function () {
										panelLayer.transitionTo({
											opacity: 1,
											duration: second * 0.25
										});
										showPanel(numpanel, true);
										view.tell(MW.Event.ROUND_DONE);
									}, second * 1 * 1000);
								}
							});
						}, second * animationTime * 1000);
					}
				});
			}, second * 2.2 * 1000);
		});
		
		/**
		 * Introduce the agent to the playing field.
		 */
		view.on(MW.Event.INTRODUCE_AGENT, function () {
			agent = new MW.PandaAgentView({
				x: coordinates.agentStartX,
				y: coordinates.agentStartY,
				drawScene: function () {
					layer.draw();
				}
			});
			layer.add(agent.getGraphics());
			agent.walk(true);
			agent.getGraphics().setZIndex(elevator.getZIndex() - 1);
			agent.transitionTo({
				x: coordinates.agentStopX,
				y: coordinates.agentStopY,
				duration: second * 3,
				easing: 'ease-out',
				callback: function () {
					agent.say(MW.Sounds.AGENT_HELLO);
					setTimeout(function () {
						agent.followCursor(true);
						view.tell(MW.Event.ROUND_DONE);
					}, second *
						(MW.Sounds.AGENT_HELLO.getLength() + 0.1) * 1000);
				}
			});
		});
		
		/**
		 * Agent starts acting.
		 */
		view.on(MW.Event.START_AGENT, function () {
			showPanel(numpanel, false);
			agent.followCursor(false);
			agent.say(MW.Sounds.AGENT_I_TRY);
			setTimeout(function () {
				agent.followCursor(true);
				view.tell(MW.Event.ROUND_DONE);
			}, MW.Sounds.AGENT_I_TRY.getLength() * 1000);
		});
		
		/**
		 * Agent has made his choice.
		 * @param {Hash} vars
		 * @param {Number} vars.number - the chosen number
		 * @param {Number} vars.confidence - how sure the agent is
		 */
		view.on(MW.Event.AGENT_CHOICE, function (vars) {
			showPanel(numpanel, false);
			agentPickNumber(vars.number, vars.confidence);
		});
		
		/**
		 * Player corrected agent.
		 */
		view.on(MW.Event.CORRECT_AGENT, function () {
			var cross = new Kinetic.Image({
				x: agentPickGroup.getChildren()[1].getX() - 2,
				y: agentPickGroup.getChildren()[1].getY() - 2,
				scale: agentPickGroup.getChildren()[1].getScale(),
				image: MW.Images.ELEVATORGAME_CROSS
			});
			agent.say(MW.Sounds.AGENT_HELPED);
			agentPickGroup.add(cross);
			layer.draw();
			showPanel(boolpanel, false, function () {
				setTimeout(function () {
					showPanel(numpanel, true);
				}, MW.Sounds.AGENT_HELPED.getLength());
			});
		});
		
		/**
		 * The game finished!
		 */
		view.on(MW.Event.END_MINIGAME, function () {
			var i;
			for (i = 1; i <= tree.getNbrOfBranches(); i++) {
				tree.getBranch(i).getNest().celebrate(true);
			}
			MW.Sound.play(MW.Sounds.BIRD_SCREAM);
			if (agent !== undefined) {
				agent.wave(true);
			}
			panelLayer.transitionTo({
				opacity: 0,
				duration: second * 1
			});
			exitFade.transitionTo({
				opacity: 1,
				duration: second * 7,
				callback: function () {
					clearInterval(bgMusic);
					view.tell(MW.Event.MINIGAME_ENDED);
				}
			});
		});
		
		/**
		 * User wants help!
		 */
		view.on(MW.Event.BUTTON_PUSH_HELP, function () {
			if (!first.agentPick) {
				view.instruction2();
			} else {
				view.instruction1(true);
			}
		});
		
		
		this.addTearDown(function () {
			stage.remove(layer);
			stage.remove(panelLayer);
		});
	}
});