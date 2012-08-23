/**
 * @constructor
 * @extends {LadderView}
 * @param {MW.LadderMinigame} ladder
 */
function TreeView(ladder) {
	"use strict";
	LadderView.call(this, "TreeView", ladder);
	var
		view = this,
		scale = 1 / 2.083168317,
		i,
		numpad,
		helper,
		shakeHandler,
		shakeTreat,
		treats = [],
		background,
		staticLayer,
		dynamicLayer,
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
				y: view.getStage().getHeight() - 160,
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
				y: view.getStage().getHeight() - 120,
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
				x: 550,
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
			MW.Sound.play(MW.Sounds.NO_MY_TURN);
			view.setTimeout(function () {
				MW.Sound.play(MW.Sounds.BUT_YOU_CAN_INTERRUPT);
				view.setTimeout(function () {
					tellMyTurn = false;
				}, 2000);
			}, 2000);
		},
		pushed: function (i) {
			if (view.game.playerIsGamer())
				ladder.pick(i);
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

	staticLayer = new Kinetic.Layer();
	dynamicLayer = new Kinetic.Layer();
	view.getStage().add(staticLayer);
	view.getStage().add(dynamicLayer);

	/** @type {Kinetic.MW.Lizard} */
	helper = new Kinetic.MW.Lizard({
		x: config.helper.x,
		y: config.helper.y,
		scale: scale * 0.7
	}, view);

	shakeTreat = function () {
		shakeHandler = view.setInterval(function () {
			treats[ladder.getRoundNumber() - 1].shake(view);
		}, 4000);
	};

	stopShakeTreat = function () {
		view.clearInterval(shakeHandler);
	};

	addOnMouseActionToTreat = function () {
		treat.onClick(ladder.openTreat);
	};
	
	view.on(MW.Event.PITCHER_LEVEL_ADD_BEFORE, function (msg) {
		view.tell(MW.Event.PITCHER_LEVEL_SET_DROP_ORIGIN, {
			x: treats[ladder.getRoundNumber() - 1].getX(),
			y: treats[ladder.getRoundNumber() - 1].getY()
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
		treat = treats[ladder.getRoundNumber() - 1];
		view.getTween(treat.attrs).wait(2000).to({
			x: 100,
			y: 150,
			rotation: 2 * Math.PI
		}, 1000).to({ rotation: 0 }).to({
			y: stepGroups[ladder.getTargetNumber()].getY() + 25,
			rotation: 2 * Math.PI * (7 - ladder.getTargetNumber())
		}, 1000).to({ rotation: 0 }).call(callback);
	};

	/**
	 * Open the treat
	 */
	view.confirmTarget = function () {
		treat.offClick();
		stopShakeTreat();
		treat.open();
		numpad.release();
		staticLayer.draw();
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
		dynamicLayer.add(balloons);
		view.getTween(balloons.attrs.scale).to({ x: 1, y: 1 }, 500).call(function () {
			view.getTween(balloons.attrs).to({ y: 200 }, 2000).call(callback);
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
	view.on(MW.Event.MG_LADDER_PICKED, function(callback) {
		if (view.game.modeIsAgentDo() && !ladder.agentIsInterrupted() && !ladder.agentIsBeingHelped()) {
			var pos = view.getStickPoint(ladder.getChosenNumber());
			MW.Sound.play(MW.Sounds.IM_GOING_TO_PICK_THIS_ONE);
			var reset = null;
			view.setTimeout(function () {
				reset = view.game.getAgentView().pointAt(ladder.getChosenNumber(), function () {
					view.setTimeout(function () {
						if (!ladder.agentIsInterrupted()) {
							view.pick(ladder.getChosenNumber(), callback);
							view.setTimeout(function () {
								reset(function () {});
							}, 1000);
						}
					}, 3000);
				});
			}, 1500);
		} else {
			view.pick(ladder.getChosenNumber(), callback);
		}
	});

	/**
	 * Helper approaches the target
	 */
	view.on(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET, function (callback) {
		currentPick = ladder.getChosenNumber();
		view.getTween(helper.attrs).to({
			y: config.helper.y - 100
		}, 2000).to({
			rotation: -Math.PI / 8,
			x: config.helper.x - 25
		}, 1000).call(function () {
			if (currentPick > 1) {
				view.getTween(helper.attrs).to({
					rotation: 0,
					y: 430
				}, 1000).call(function () {
					if (currentPick > 2) {
						helper.startWalk();
						view.getTween(helper.attrs).to({
							y: stepGroups[currentPick].getY()
						}, 500 * currentPick).call(function () {
							helper.stopWalk();
							callback();
						});
					} else {
						helper.stopWalk();
						callback();
					}
				});
			} else {
				callback();
			}
		});
	});

	/**
	 * Helper moves to its home
	 */
	view.on(MW.Event.MG_LADDER_RESET_SCENE, function (callback, msg) {
		var step1 = function (next) {
			helper.startWalk();
			view.getTween(helper.attrs).to({
				y: 430
			}, 500 * currentPick).call(helper.stopWalk).call(next);
		};
		var step2 = function (next) {
			view.getTween(helper.attrs).to({
				rotation: -Math.PI / 16,
				x: config.helper.x,
				y: config.helper.y - 70
			}, 1000).to({
				rotation: 0,
				y: config.helper.y - 50
			}, 1000).call(next);
		};
		var step3 = function () {
			view.getTween(helper.attrs).to({
				rotation: 0,
				x: config.helper.x,
				y: config.helper.y
			}, 2000).call(function () {
				numpad.release();
				callback();
			});
		};
		if (currentPick > 2) {
			step1(function () { step2(step3); });
		} else if (currentPick > 1) {
			step2(step3);
		} else {
			step3();
		}
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
			view.getTween(treat.attrs).to({
				x: treat.getX() + 30,
				y: treat.getY() - 30
			}).wait(200).call(function () {
				MW.Sound.play(MW.Sounds.LADDER_TREE_TONGUE);
				helper.tongueIn(done);
			}).to({
				x: config.dropZone.x + config.dropZone.offsetWidth * dropZoneOffset,
				y: config.dropZone.y,
				rotation: 3 * Math.PI
			}, 2000).to({ rotation: 0 }).call(done).call(function () {
				if (!view.game.modeIsAgentDo()) {
					addOnMouseActionToTreat();
					shakeTreat();
				}
			});
		});
	});

	view.on(MW.Event.FRAME, function () {
		dynamicLayer.draw();
	});

	view.addTearDown(function () {
		view.getStage().remove(staticLayer);
		view.getStage().remove(dynamicLayer);
	});

	view.interrupt = function () {
		view.removeTween(helper.attrs);
	};

	background = new Kinetic.Image({
		image: MW.Images.TREEGAME_BACKGROUND,
		x: 0,
		y: view.getStage().getHeight() - MW.Images.TREEGAME_BACKGROUND.height,
		width: MW.Images.TREEGAME_BACKGROUND.width,
		height: MW.Images.TREEGAME_BACKGROUND.height
	});

	staticLayer.add(background);
	staticLayer.add(new Kinetic.Image({
		image: MW.Images.TREEGAME_TREEDOTS,
		x: 144,
		y: 167
	}));
	view.addInterruptButtons(dynamicLayer);

	view.on("Ladder.helpAgent", function () {

	});

	for (i = 0; i < ladder.getLadder().length; i += 1) {
		ladderStepNumber = ladder.getLadder()[i];
		ladderStepGroup = new Kinetic.Group({
			x: config.tree.x,
			y: config.tree.y - i * config.tree.stepHeight
		});
//		ladderStepPolygon = new Kinetic.Polygon({
//			points: [
//				0, 0,
//				config.tree.stepWidth, 0,
//				config.tree.stepWidth - config.tree.stepNarrowing, config.tree.stepHeight,
//				config.tree.stepNarrowing, config.tree.stepHeight
//			],
//			stroke: "#5C4033",
//			strokeWidth: 5
//		});
//		ladderStepGroup.add(ladderStepPolygon);
		stepGroups[ladderStepNumber] = ladderStepGroup;
//		staticLayer.add(ladderStepGroup);
//		staticLayer.draw();
	}

	dynamicLayer.add(helper);

	dynamicLayer.add(new Kinetic.Image({
		image: MW.Images.TREEGAME_COVER,
		width: MW.Images.TREEGAME_COVER.width,
		height: MW.Images.TREEGAME_COVER.height,
		x: 182,
		y: view.getStage().getHeight() - MW.Images.TREEGAME_COVER.height
	}));


	this.pick = function (number, callback) {
		MW.Sound.play(MW.Sounds.CLICK);
		if (view.game.playerIsAgent()) {
			numpad.push(number);
		}
		callback();
	};

	this.getStickPoint = function (number) {
		return numpad.getButtonPosition(number);
	};

	staticLayer.add(new Kinetic.Image({
		x: config.numpad.x - 180,
		y: config.numpad.y - 280,
		image: MW.Images.NUMPAD_WOOD
	}));
	dynamicLayer.add(numpad);

	var agentView = view.game.getAgentView();
	var agentScale = 0.8;
	
	view.addSetup(function () {
		view.addAgent(
			view.getStage().getWidth() - 248,
			view.getStage().getHeight() - 100 - agentScale * (agentView.feetOffset() - agentView.bodyOffset().y),
			agentScale,
			dynamicLayer
		);


		/**
		 * Hang the treats in the crown
		 */
		(function (view) {
			var
				max = ladder.getMaximumTreats(),
				parcel;
			for (i = 0; i < max; i += 1) {
				parcel = new Kinetic.MW.Parcel({
					x: config.treatGrid[i + 1].x,
					y: config.treatGrid[i + 1].y,
					rotation: config.treatGrid[i + 1].rotation,
					type: (i % 3) + 1,
					scale: scale
				});
				dynamicLayer.add(parcel);
				treats.push(parcel);
			}
		}) (this);
	});
	staticLayer.draw();
}
