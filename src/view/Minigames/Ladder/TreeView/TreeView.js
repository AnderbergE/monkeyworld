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
		i,
		numpad,
		helper,
		shakeTreat,
		background,
		staticLayer,
		dynamicLayer,
		tellMyTurn = false,
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
				x: 130,
				y: view.getStage().getHeight() - 100 - 80,
				stepHeight: 80,
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
				x: 320,
				y: 660
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
		x: 609,
		y: 120,
		button: MW.Images.BUTTON_WOOD,
		buttonActive: MW.Images.BUTTON_WOOD_SELECTED,
		buttonWidth: 74,
		buttonHeight: 74,
		buttonMargin: 10,
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
		representationsScale: 0.9
	});
	numpad.lock();

	staticLayer = new Kinetic.Layer();
	dynamicLayer = new Kinetic.Layer();
	view.getStage().add(staticLayer);
	view.getStage().add(dynamicLayer);

	helper = new Kinetic.Image({
		image: MW.Images.TREEGAME_LIZARD,
		x: config.helper.x,
		y: config.helper.y,
		rotation: Math.PI / 2,
		width: 135,
		height: 80
	});

	shakeTreat = function () {
		var
			ox = treat.getX(),
			oy = treat.getY(),
			time = 100,
			offset = 5,
			waitTime = 4000;
		view.getTween(treat.attrs)
			.to({ x: ox - offset }, time)
			.to({ x: ox + offset }, time)
			.to({ x: ox - offset }, time)
			.to({ x: ox + offset }, time)
			.to({ x: ox - offset }, time)
			.to({ x: ox + offset }, time)
			.to({ x: ox - offset }, time)
			.to({ x: ox + offset }, time)
			.to({ x: ox - offset }, time)
			.to({ x: ox }, time);
		view.getTween(treat.attrs)
			.to({ y: oy - offset }, time)
			.to({ y: oy + offset }, time)
			.to({ y: oy - offset }, time)
			.to({ y: oy + offset }, time)
			.to({ y: oy - offset }, time)
			.to({ y: oy + offset }, time)
			.to({ y: oy - offset }, time)
			.to({ y: oy + offset }, time)
			.to({ y: oy - offset }, time)
			.to({ y: oy }, time).wait(waitTime)
			.call(function () { shakeTreat(); });
	};

	stopShakeTreat = function () {
		view.removeTween(treat.attrs);
	};

	addOnMouseActionToTreat = function () {
		treat.on("mousedown touchstart", function () {
			ladder.openTreat();
		});
	};

	createTreat = function (callback) {
		treat = new Kinetic.Group({ x: config.tree.x, y: config.tree.y });
		var treatCircle = new Kinetic.Circle({
			x: config.tree.stepWidth - 20,
			y: config.tree.stepHeight / 2,
			radius: config.tree.stepHeight / 2 - 10,
			fill: "red",
			stroke: "#440000",
			strokeWidth: 4
		});
		treat.circle = treatCircle;
		treat.add(treatCircle);
		view.getTween(treat.attrs).to({ y: stepGroups[ladder.getTargetNumber()].getY() }, 1000).call(callback);
		dynamicLayer.add(treat);
	};

	/**
	 * Open the treat
	 */
	view.confirmTarget = function (msg) {
		treat.off("mousedown touchstart");
		stopShakeTreat();
		treat.circle.setFill("blue");
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
		view.getTween(helper.attrs).to({x: 300, y: stepGroups[msg.number].getY()}, 5500).call(msg.callback);
	});

	/**
	 * Helper moves to its home
	 */
	view.on("Ladder.resetScene", function (msg) {
		view.getTween(helper.attrs).to({x: config.helper.x, y: config.helper.y}, 3000).call(function () {
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
		var
			TIME_TO_DROP_ZONE = 2000,
			flyTo = {
				x: config.dropZone.x + config.dropZone.offsetWidth * dropZoneOffset,
				y: config.dropZone.y - config.dropZone.height
			},
			dropAt = {
				x: flyTo.x,
				y: flyTo.y
			};
		flyTo.x += 170;
		view.getTween(helper.attrs).to(flyTo, TIME_TO_DROP_ZONE).call(function () {
			view.getTween(treat.attrs).to({
				x: config.dropZone.x + config.dropZone.offsetWidth * dropZoneOffset,
				y: config.dropZone.y
			}, 500).call(function () {
				if (!view.game.modeIsAgentDo()) {
					addOnMouseActionToTreat();
					shakeTreat();
				}
			});
		});
		view.getTween(treat.attrs).to(dropAt, TIME_TO_DROP_ZONE).call(function () {
			msg.callback();
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
		y: 0,
		width: view.getStage().getWidth(),
		height: view.getStage().getHeight()
	});

	staticLayer.add(background);

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
		ladderStepPolygon = new Kinetic.Polygon({
			points: [
				0, 0,
				config.tree.stepWidth, 0,
				config.tree.stepWidth - config.tree.stepNarrowing, config.tree.stepHeight,
				config.tree.stepNarrowing, config.tree.stepHeight
			],
			stroke: "#5C4033",
			strokeWidth: 5
		});
		ladderStepGroup.add(ladderStepPolygon);
		stepGroups[ladderStepNumber] = ladderStepGroup;
	}
	dynamicLayer.add(helper);

	dynamicLayer.add(new Kinetic.Image({
		image: MW.Images.TREEGAME_COVER,
		width: MW.Images.TREEGAME_COVER.width / MW.Images.TREEGAME_BACKGROUND.width * view.getStage().getWidth(),
		height: MW.Images.TREEGAME_COVER.height / MW.Images.TREEGAME_BACKGROUND.height * view.getStage().getHeight(),
		x: 158,
		y: 643
	}));

	dynamicLayer.add(numpad);

	view.addAgent(
		view.getStage().getWidth() - 500,
		view.getStage().getHeight() - 200 - view.agentImage.height,
		dynamicLayer
	);
	staticLayer.draw();
}
