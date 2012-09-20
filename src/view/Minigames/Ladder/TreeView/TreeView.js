/**
 * @constructor
 * @extends {MW.LadderView}
 * @param {MW.LadderMinigame} ladderMinigame
 * @param {Kinetic.Stage} stage
 * @param {MW.AgentView} agentView
 */
MW.TreeView = MW.LadderView.extend(
/** @lends {MW.LadderView.prototype} */
{
	/** @constructs */
	init: function (ladderMinigame, stage, agentView) {
		this._super(ladderMinigame, stage, agentView, "TreeView");
		var
			view = this,
			scale = 1 / 2.083168317,
			i,
			numpad,
			helper,
			agent,
			shakeHandler,
			shakeTreat,
			treats = [],
			background,
			layer,
			tellMyTurn = false,
			currentPick,
			stopShakeTreat,
			treat = null,
			createTreat,
			addOnMouseActionToTreat,
			dropZoneOffset = 0,
			stepGroups = {},
			ladderStepNumber,
			ladderStepGroup,
			ladderStepPolygon,
			config = {
				tree: {
					x: 120,
					y: stage.getHeight() - 160,
					stepHeight: 70,
					stepWidth: 120,
					stepNarrowing: 10
				},
				nest: {
					x: 320,
					y: 660
				},
				dropZone: {
					x: 650,
					y: stage.getHeight() - 120,
					height: 200,
					offset: 0,
					offsetWidth: 75
				},
				helper: {
					x: 244,
					y: 580
				},
				treatGrid: {
					"1": { x: 100, y: 40, rotation: -Math.PI / 9 },
					"2": { x: 100, y: 100, rotation: Math.PI / 11 },
					"3": { x: 200, y: 40, rotation: -Math.PI / 12 },
					"4": { x: 200, y: 100, rotation: Math.PI / 9 }
				},
				numpad: {
					x: 575,
					y: 180
				}
			};

		/**
		 * Define sounds specific for this implementation of the ladder game.
		 */
		view.tooLow          = MW.Sounds.LADDER_TREE_OOPS_TOO_LOW;
		view.tooHigh         = MW.Sounds.LADDER_TREE_OOPS_TOO_HIGH;
		view.tryBigger       = MW.Sounds.LADDER_TREE_TRY_A_BIGGER_NUMBER;
		view.trySmaller      = MW.Sounds.LADDER_TREE_TRY_A_SMALLER_NUMBER;
		view.suggestion1     = MW.Sounds.LADDER_TREE_AGENT_SUGGEST_SOLUTION_1;
		view.suggestion2     = MW.Sounds.LADDER_TREE_AGENT_SUGGEST_SOLUTION_2;
		view.agentTooLow     = MW.Sounds.LADDER_TREE_AGENT_PLAY_TOO_LOW;
		view.agentTooHigh    = MW.Sounds.LADDER_TREE_AGENT_PLAY_TOO_HIGH;
		view.betterBigger    = MW.Sounds.LADDER_TREE_BETTER_BECAUSE_BIGGER;
		view.betterSmaller   = MW.Sounds.LADDER_TREE_BETTER_BECAUSE_SMALLER;
		view.agentSeeCorrect = MW.Sounds.LADDER_TREE_AGENT_SEE_CORRECT;

		numpad = new MW.Numpad({
			x: config.numpad.x,
			y: config.numpad.y,
			button: MW.Images.BUTTON_WOOD,
			buttonActive: MW.Images.BUTTON_WOOD_SELECTED,
			buttonWidth: MW.Images.BUTTON_WOOD.width,
			buttonHeight: MW.Images.BUTTON_WOOD.height,
			buttonMargin: 15,
			forbid: function (i) {
				tellMyTurn = true;
				view.agentTalk(4000);
				MW.Sound.play(MW.Sounds.NO_MY_TURN);
				view.setTimeout(function () {
					MW.Sound.play(MW.Sounds.BUT_YOU_CAN_INTERRUPT);
					view.setTimeout(function () {
						tellMyTurn = false;
					}, 2000);
				}, 2000);
			},
			pushed: function (i) {
				if (ladderMinigame.playerIsGamer())
					ladderMinigame.pick(i);
			},
			representations: {
				"1": MW.Images.DOTS_1,
				"2": MW.Images.DOTS_2,
				"3": MW.Images.DOTS_3,
				"4": MW.Images.DOTS_4,
				"5": MW.Images.DOTS_5,
				"6": MW.Images.DOTS_6
			},
			representationsScale: 0.75
		});
		numpad.lock();

		layer = new Kinetic.Layer();
		stage.add(layer);

		/** @type {Kinetic.MW.Lizard} */
		helper = new Kinetic.MW.Lizard({
			x: config.helper.x,
			y: config.helper.y,
			scale: scale * 0.7
		});

		shakeTreat = function () {
			shakeHandler = view.setInterval(function () {
				treats[ladderMinigame.getRoundNumber() - 1].shake(view);
			}, 4000);
		};

		stopShakeTreat = function () {
			view.clearInterval(shakeHandler);
		};

		addOnMouseActionToTreat = function () {
			treat.onClick(ladderMinigame.openTreat);
		};
	
		view.on(MW.Event.PITCHER_LEVEL_ADD_BEFORE, function (msg) {
			view.tell(MW.Event.PITCHER_LEVEL_SET_DROP_ORIGIN, {
				x: treats[ladderMinigame.getRoundNumber() - 1].getX(),
				y: treats[ladderMinigame.getRoundNumber() - 1].getY()
			});
		});

		view.on(MW.Event.MG_LADDER_IGNORE_INPUT, function () {
			numpad.ignore();
		});
	
		view.on(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, function () {
			numpad.acknowledge();
		});
	
		view.on(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT, function () {
			numpad.unlock();
		});
	
		view.on(MW.Event.MG_LADDER_FORBID_GAMER_INPUT, function () {
			numpad.lock();
		});

		createTreat = function (callback) {
			treat = treats[ladderMinigame.getRoundNumber() - 1];
			view.setTimeout(function () {
				treat.transitionTo({
					x: 100,
					y: 150,
					rotation: 2 * Math.PI,
					duration: 1,
					callback: function () {
						treat.setRotation(0);
						treat.transitionTo({
							y: stepGroups[ladderMinigame.getTargetNumber()].getY() + 25,
							rotation: 2 * Math.PI * (7 - ladderMinigame.getTargetNumber()),
							duration: 1,
							callback: function () {
								treat.setRotation(0);
								callback();
							}
						});
					}
				});
			}, 2000);
		};

		/**
		 * Open the treat
		 */
		view.confirmTarget = function () {
			treat.offClick();
			stopShakeTreat();
			treat.open();
			numpad.release();
			layer.draw();
		};

		/**
		 * Get a treat from the latest catched parcel
		 */
		view.getTreat = function (callback) {
			var balloons = new Kinetic.Image({
				x: treat.getX(),
				y: treat.getY(),
				image: MW.Images.BALLOONS,
				width: 128,
				height: 128,
				offset: {
					x: 64,
					y: 64
				},
				scale: {
					x: 0.1,
					y: 0.1
				}
			});
			layer.add(balloons);
		
			balloons.transitionTo({
				scale: {
					x: 0.7,
					y: 0.7
				},
				duration: 0.5,
				callback: function () {
					balloons.transitionTo({
						x: balloons.getX() + 50,
						y: 200,
						duration: 2,
						callback: callback
					});
				}
			
			});
		};

		/**
		 * Drop a target from the tree crown. 
		 */
		view.on(MW.Event.MG_LADDER_PLACE_TARGET, function (callback, msg) {
			dropZoneOffset += 1;
			createTreat(callback);
		});

		/**
		 * Picked a number on the numpad
		 */
		view.on(MW.Event.MG_LADDER_PICKED, function (callback) {
			if (ladderMinigame.modeIsAgentDo() && !ladderMinigame.agentIsInterrupted() && !ladderMinigame.agentIsBeingHelped()) {
				var pos = view.getStickPoint(ladderMinigame.getChosenNumber());
				view.agentTalk(2000);
				MW.Sound.play(MW.Sounds.IM_GOING_TO_PICK_THIS_ONE);
				view.setTimeout(function () {
				    view.pointAt(ladderMinigame.getChosenNumber(), callback);
				}, 1500);
			} else {
				view.pick(ladderMinigame.getChosenNumber(), callback);
			}
		});

		/**
		 * Helper approaches the target
		 */
		view.on(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET, function (callback) {
			currentPick = ladderMinigame.getChosenNumber();
			helper.transitionTo({
				y: config.helper.y - 100,
				duration: 2,
				callback: function () { helper.transitionTo({
					rotation: -Math.PI / 8,
					x: config.helper.x - 25,
					duration: 1,
					callback: function () {
						if (currentPick > 1) {
							helper.transitionTo({
								rotation: 0,
								y: 430,
								duration: 1,
								callback: function () {
									if (currentPick > 2) {
										helper.startWalk();
										helper.transitionTo({
											y: stepGroups[currentPick].getY(),
											duration: 0.5 * currentPick,
											callback: function () {
												helper.stopWalk();
												callback();
											}
										});
									} else {
										helper.stopWalk();
										callback();
									}
								}
							});
						} else {
							callback();
						}
					}
				});}
			});
		});

		/**
		 * Helper moves to its home
		 */
		view.on(MW.Event.MG_LADDER_RESET_SCENE, function (callback, msg) {
			var timeout = 0;
			if (currentPick !== ladderMinigame.getTargetNumber()) {
				timeout = 2000;
			}
			view.setTimeout(function () {
				var step1 = function (next) {
					helper.startWalk();
					helper.transitionTo({
						y: 430,
						duration: 0.5 * currentPick,
						callback: function () {
							helper.stopWalk();
							next();
						}
					});
				};
				var step2 = function (next) {
			
					helper.transitionTo({
						rotation: -Math.PI / 16,
						x: config.helper.x,
						y: config.helper.y - 70,
						duration: 1,
						callback: function () { helper.transitionTo({
							rotation: 0,
							y: config.helper.y - 50,
							duration: 1,
							callback: next
						});}
					});
				};
				var step3 = function () {
					helper.transitionTo({
						rotation: 0,
						x: config.helper.x,
						y: config.helper.y,
						duration: 2,
						callback: function () {
							numpad.release();
							callback();
						}
					});
				};
				if (currentPick > 2) {
					step1(function () { step2(step3); });
				} else if (currentPick > 1) {
					step2(step3);
				} else {
					step3();
				}
			}, timeout);
		});

		/**
		 * Helper drops the treat
		 */
		view.on(MW.Event.MG_LADDER_GET_TARGET, function (callback) {
			helper.tongueOut(function () {
				var done_ = 0, done = function () {
					done_ += 1;
					if (done_ === 2)
						callback();
				};
				treat.transitionTo({
					x: treat.getX() + 55,
					y: treat.getY() - 40,
					duration: 0.01,
					callback: function () {
						view.setTimeout( function () {
							MW.Sound.play(MW.Sounds.LADDER_TREE_TONGUE);
							helper.tongueIn(done);
							treat.transitionTo({
								x: config.dropZone.x + config.dropZone.offsetWidth * dropZoneOffset,
								y: config.dropZone.y,
								rotation: 3 * Math.PI,
								duration: 2,
								callback: function () {
									treat.setRotation(0);
									done();
									if (!ladderMinigame.modeIsAgentDo()) {
										addOnMouseActionToTreat();
										shakeTreat();
									}
								}
							});
						}, 200);
					}
				});
			});
		});

		view.addTearDown(function () {
			stage.remove(layer);
		});

		view.interrupt = function () {
			view.removeTween(helper.attrs);
		};

		background = new Kinetic.Image({
			image: MW.Images.TREEGAME_BACKGROUND,
			x: 0,
			y: stage.getHeight() - MW.Images.TREEGAME_BACKGROUND.height,
			width: MW.Images.TREEGAME_BACKGROUND.width,
			height: MW.Images.TREEGAME_BACKGROUND.height
		});

		layer.add(background);
		layer.add(new Kinetic.Image({
			image: MW.Images.TREEGAME_TREEDOTS,
			x: 145,
			y: 161
		}));

		for (i = 0; i < ladderMinigame.getLadder().length; i += 1) {
			ladderStepNumber = ladderMinigame.getLadder()[i];
			ladderStepGroup = new Kinetic.Group({
				x: config.tree.x,
				y: config.tree.y - i * config.tree.stepHeight
			});
			stepGroups[ladderStepNumber] = ladderStepGroup;
		}

		layer.add(helper);
		helper.start();

		layer.add(new Kinetic.Image({
			image: MW.Images.TREEGAME_COVER,
			width: MW.Images.TREEGAME_COVER.width,
			height: MW.Images.TREEGAME_COVER.height,
			x: 182,
			y: stage.getHeight() - MW.Images.TREEGAME_COVER.height
		}));


		this.pick = function (number, callback) {
			MW.Sound.play(MW.Sounds.CLICK);
			if (ladderMinigame.playerIsAgent()) {
				numpad.push(number);
			}
			callback();
		};

		this.getStickPoint = function (number) {
			return numpad.getButtonPosition(number);
		};

		layer.add(new Kinetic.Image({
			x: config.numpad.x - 180,
			y: config.numpad.y - 280,
			image: MW.Images.NUMPAD_WOOD
		}));
		layer.add(numpad);

	    view.addAgent(
	        stage.getWidth() - 248,
            stage.getHeight() - 50,
            layer,
            0.8
        );

        view.hasIntroducedAgent = function () {
			for (i = 0; i < ladderMinigame.getMaximumTreats(); i += 1) {
				treats[i].moveToTop();
			}
        };

		view.addSetup(function () {

			view.addInterruptButtons(layer);

			/**
			 * Hang the treats in the crown
			 */
			(function (view) {
				var
					max = ladderMinigame.getMaximumTreats(),
					parcel;
				for (i = 0; i < max; i += 1) {
					parcel = new Kinetic.MW.Parcel({
						x: config.treatGrid[i + 1].x,
						y: config.treatGrid[i + 1].y,
						rotation: config.treatGrid[i + 1].rotation,
						type: (i % 3) + 1,
						scale: scale
					});
					layer.add(parcel);
					treats.push(parcel);
				}
			}) (this);

		});
		layer.draw();
	}
});

