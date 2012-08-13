/**
 * @constructor
 * @extends {LadderView}
 * @param {Ladder} ladder
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
				x: 240,
				y: 580
			},
			treatGrid: {
				"1": { x: 100, y: 40, rotation: -Math.PI / 9 },
				"2": { x: 100, y: 100, rotation: Math.PI / 11 },
				"3": { x: 200, y: 40, rotation: -Math.PI / 12 },
				"4": { x: 200, y: 100, rotation: Math.PI / 9 }
			},
			numpad: {
				x: 609,
				y: 120
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
		pushed: function (i) {
			if (view.game.playerIsGamer()) {
				ladder.pick(i);
			} else if (view.game.playerIsAgent() && !tellMyTurn) {
				tellMyTurn = true;
				MW.Sound.play(MW.Sounds.NO_MY_TURN);
				view.setTimeout(function () {
					MW.Sound.play(MW.Sounds.BUT_YOU_CAN_INTERRUPT);
					view.setTimeout(function () {
						tellMyTurn = false;
					}, 2000);
				}, 2000);
			}
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

	helper = new Kinetic.MW.Lizard({
		x: config.helper.x,
		y: config.helper.y,
		scale: scale
	}, view);

	shakeTreat = function () {
		shakeHandler = view.setInterval(function () {
			treat.shake(view);
		}, 4000);
	};

	stopShakeTreat = function () {
		view.clearInterval(shakeHandler);
	};

	addOnMouseActionToTreat = function () {
		treat.onClick(ladder.openTreat);
	};

	createTreat = function (callback) {
		console.log(treats);
		treat = treats[ladder.getRoundNumber() - 1];
		view.getTween(treat.attrs).wait(2000).to({
			x: 250,
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
	view.confirmTarget = function (msg) {
		treat.off("mousedown touchstart");
		stopShakeTreat();
		treat.open();
		numpad.release();
		staticLayer.draw();
		var balloons = new Kinetic.Image({
			x: treat.getX() + 128,
			y: treat.getY(),
			image: MW.Images.BALLOONS,
			width: 128,
			height: 128,
			centerOffset: {
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
			view.getTween(balloons.attrs).to({ y: 100 }, 2000).call(msg.callback);
		});
	};

	view.on("Ladder.placeTarget", function (msg) {
		dropZoneOffset += 1;
		createTreat(msg.callback);
		if (view.game.modeIsChild() || view.game.modeIsAgentSee()) {
			numpad.unlock();
		}
	});

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

	/**
	 * Helper movers to the ladder
	 */
	view.on("Ladder.approachLadder", function (msg) {
		currentPick = msg.number;
		helper.startWalk();
		view.getTween(helper.attrs).to({
			y: config.helper.y - 100
		}, 2000).to({
			rotation: -Math.PI / 8,
			x: config.helper.x - 25,
		}, 1000).to({
			rotation: 0,
			y: config.helper.y - 170
		}, 1000).to({
			y: stepGroups[msg.number].getY()
		}, 500 * msg.number).call(function () {
			helper.stopWalk();
			msg.callback();
		});
	});

	/**
	 * Helper moves to its home
	 */
	view.on("Ladder.resetScene", function (msg) {
		helper.startWalk();
		view.getTween(helper.attrs).to({
			y: config.helper.y - 170
		}, 1000).to({
			rotation: -Math.PI / 16,
			x: config.helper.x,
			y: config.helper.y - 70
		}, 1000).to({
			rotation: 0,
			y: config.helper.y - 50
		}, 1000).to({
			rotation: 0,
			x: config.helper.x,
			y: config.helper.y
		}, 500 * currentPick).call(function () {
			helper.stopWalk();
			numpad.release();
			if ((msg.allowNumpad && view.game.modeIsChild()) || view.game.modeIsAgentSee()) {
				numpad.unlock();
			}
			msg.callback();
		});
	});

	/**
	 * Helper drops the treat
	 */
	view.on("Ladder.getTarget", function (msg) {
		view.getTween(treat.attrs).to({
			x: config.dropZone.x + config.dropZone.offsetWidth * dropZoneOffset,
			y: config.dropZone.y
		}, 2000).call(msg.callback).call(function () {
			if (!view.game.modeIsAgentDo()) {
				addOnMouseActionToTreat();
				shakeTreat();
			}
		});
	});

	view.on("frame", function () {
		dynamicLayer.draw();
	});

	view.addTearDown(function () {
		view.getStage().remove(staticLayer);
		view.getStage().remove(dynamicLayer);
	});

	view.interrupt = function () {
		console.log("interrupt!");
		view.removeTween(helper.attrs);
		numpad.unlock();
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
		numpad.unlock();
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
		x: 184,
		y: view.getStage().getHeight() - MW.Images.TREEGAME_COVER.height
	}));

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

	staticLayer.add(new Kinetic.Image({
		x: config.numpad.x - 180,
		y: config.numpad.y - 280,
		image: MW.Images.NUMPAD_WOOD
	}));
	dynamicLayer.add(numpad);

	view.addAgent(
		view.getStage().getWidth() - 500,
		view.getStage().getHeight() - 200 - view.agentImage.height,
		dynamicLayer
	);
	staticLayer.draw();
}
