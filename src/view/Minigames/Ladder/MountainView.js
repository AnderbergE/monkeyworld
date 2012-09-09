/**
 * @constructor
 * @extends {LadderView}
 * @param {MW.LadderMinigame} game
 */
MW.MountainView = function(game) {
	/** @type {MountainView} */ var view = this;
	MW.LadderView.call(this, "MtView", game);
	Log.debug("Constructing MountainView", this._tag);
	
	/**
	 * Define sounds specific for this implementation of the ladder game. 
	 */
	view.tooLow          = MW.Sounds.LADDER_MOUNTAIN_IM_UP_HERE;
	view.tooHigh         = MW.Sounds.LADDER_MOUNTAIN_IM_DOWN_HERE;
	view.tryBigger       = MW.Sounds.LADDER_MOUNTAIN_TRY_MORE_BALLOONS;
	view.trySmaller      = MW.Sounds.LADDER_MOUNTAIN_TRY_FEWER_BALLOONS;
	view.suggestion1     = MW.Sounds.LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_1;
	view.suggestion2     = MW.Sounds.LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_2;
	view.agentTooLow     = MW.Sounds.LADDER_MOUNTAIN_AGENT_PLAY_TOO_LOW;
	view.agentTooHigh    = MW.Sounds.LADDER_MOUNTAIN_AGENT_PLAY_TOO_HIGH;
	view.betterBigger    = MW.Sounds.LADDER_MOUNTAIN_BETTER_BECAUSE_BIGGER;
	view.betterSmaller   = MW.Sounds.LADDER_MOUNTAIN_BETTER_BECAUSE_SMALLER;
	view.agentSeeCorrect = MW.Sounds.LADDER_MOUNTAIN_AGENT_SEE_CORRECT;
	
	var allowNumpad = false;
	var resetButton = null;
	var tellMyTurn = false;
	
	var dynamicLayer = new Kinetic.Layer();
	var staticLayer = new Kinetic.Layer();
	
	var CAGE_CONFIG = {
		X: 400, Y: 600, WIDTH: 100, HEIGHT: 50, SLOPE: 10
	};
	
	var FRIEND_CONFIG = {
		WIDTH: 50, HEIGHT: 50
	};
	
	var LADDER_CONFIG = {
		HEIGHT: 60,
		WIDTH: 100,
		SLOPE: 24,
		X: 280,
		Y: 430
	};
	
	var balloonGroups = new Array();
	var cage = new Kinetic.Group({ x: CAGE_CONFIG.X, y: CAGE_CONFIG.Y });
	
	var friend = new Kinetic.Rect({
		width: FRIEND_CONFIG.WIDTH,
		height: FRIEND_CONFIG.HEIGHT,
		fill: "blue",
		stroke: "black",
		strokeWidth: 4,
		offset: {
			x: FRIEND_CONFIG.WIDTH / 2,
			y: FRIEND_CONFIG.HEIGHT
		}
	});
	
	/**
	 * @constructor
	 * @extends {Kinetic.Shape}
	 */
	Kinetic.Balloon = function(x, y) {
		var group = new Kinetic.Group({ x: x, y: y });
		var balloon = new Kinetic.Circle({
			fill: "red",
			stroke: "black",
			strokeWidth: 4,
			radius: 20
		});
		var string = new Kinetic.Line({
			stroke: "black",
			strokeWidth: 4,
			points: [0, 20, 0, 65]
		});
		group.add(string);
		group.add(balloon);
		return group;
	};
	
	var BALLOON_GRID = {
		X: 730, Y: 180, STEPX: 140, STEPY: 140, WIDTH: 2
	};
	
	view.addSetup(function() {
		Log.debug("Setting up MountainView", "mt-view");
		view.stage.add(staticLayer);
		view.stage.add(dynamicLayer);
		
		var mountain = new Kinetic.Polygon({
			points: [50, 600,
			         350, 600,
			         150, 100],
			fill: "gray",
			stroke: "black",
			strokeWidth: 4
		});
		
		cage.add(new Kinetic.Polygon({
			points: [0, 0,
			         CAGE_CONFIG.WIDTH, 0,
			         CAGE_CONFIG.WIDTH + CAGE_CONFIG.SLOPE, -
			         CAGE_CONFIG.HEIGHT,
			         -CAGE_CONFIG.SLOPE, -CAGE_CONFIG.HEIGHT],
			fill: "#993300",
			stroke: "black",
			strokeWidth: 4
		}));
		
		var balloonGrid = new Utils.gridizer(
			BALLOON_GRID.X,
			BALLOON_GRID.Y,
			BALLOON_GRID.STEPX,
			BALLOON_GRID.STEPY,
			BALLOON_GRID.WIDTH
		);
		
		for (var i = 0; i < 6; i++) {
			(function(i) {
				var pos = balloonGrid.next();
				var group = new Kinetic.Group({
					x: pos.x,
					y: pos.y
				});
				var balloons = new Kinetic.Group({
					x: 40,
					y: 40
				});
				var rect = new Kinetic.Rect({
					width: BALLOON_GRID.STEPX,
					height: BALLOON_GRID.STEPY,
					fill: "yellow",
					strokeWidth: 4,
					stroke: "black"
				});
				group.add(rect);
				balloonGroups.push(group);
				var r = 0;
				for (var j = 0; j <= i; j++) {
					if (j === 3) r++;
					balloons.add(new Kinetic.Balloon(
						j * 30 - 2.7 * r * 30,
						r * 30
					));
				}
				group.add(balloons);
				group._rect = rect;
				group._balloons = balloons;
				
				group.on("mousedown touchstart", function() {
					if (allowNumpad &&
					    view.game.playerIsGamer()) {
						game.pick(i + 1);
					} else if (view.game.playerIsAgent() &&
					           !tellMyTurn) {
						tellMyTurn = true;
						MW.Sound.play(
							MW.Sounds.NO_MY_TURN
						);
						setTimeout(function() {
							MW.Sound.play(MW.Sounds.BUT_YOU_CAN_INTERRUPT);
							setTimeout(function() {
								tellMyTurn = false;
							}, 2000);
						}, 2000);
					}
				});
				dynamicLayer.add(group);
			})(i);
		};

		staticLayer.add(mountain);

		var ladder = game.getLadder();
		for (var i = 0; i < ladder.length; i++) {
			var line = new Kinetic.Line({
				points: [
					LADDER_CONFIG.X - i * LADDER_CONFIG.SLOPE,
					LADDER_CONFIG.Y - i * LADDER_CONFIG.HEIGHT,
					LADDER_CONFIG.X - i * LADDER_CONFIG.SLOPE 
					+ LADDER_CONFIG.WIDTH,
					LADDER_CONFIG.Y - i * LADDER_CONFIG.HEIGHT
				],
				stroke: "black",
				strokeWidth: 4
			});
			staticLayer.add(line);
		}
		friend.hide();
		dynamicLayer.add(friend);
		dynamicLayer.add(cage);
		view.on("frame", function() { dynamicLayer.draw(); });
		view.addInterruptButtons(dynamicLayer);

		var agentView = view.game.getAgentView();
		var agentScale = 0.8;
		view.addAgent(
			view.getStage().getWidth() - 500,
			view.getStage().getHeight() - 50 -
			  agentScale *
			  (agentView.feetOffset() - agentView.bodyOffset().y),
			agentScale,
			dynamicLayer
		);

		staticLayer.draw();
	});

	view.interrupt = function() {
		if (resetButton != null) resetButton();
		view.removeTween(cage.attrs);
		view.getTween(cage.attrs).to({x:CAGE_CONFIG.X,y:CAGE_CONFIG.Y});
	};

	view.on(MW.Event.MG_LADDER_PLACE_TARGET, function(callback, msg) {
		var level = game.getTargetNumber() - 1;
		friend.setX(LADDER_CONFIG.X - level * LADDER_CONFIG.SLOPE);
		friend.setY(LADDER_CONFIG.Y - level * LADDER_CONFIG.HEIGHT);
		friend.show();
		callback();
	});
	
	view.on(MW.Event.MG_LADDER_IGNORE_INPUT, function () {
		allowNumpad = false;
	});
	
	view.on(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, function () {
		allowNumpad = true;
	});
	
	view.on(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT, function () {
		// TODO: Implement
	});
	
	view.on(MW.Event.MG_LADDER_FORBID_GAMER_INPUT, function () {
		// TODO: Implement
	});
	
	this.getStickPoint = function(number) {
		var r = balloonGroups[number - 1];
		return {
			x: r.getX() + r._rect.getWidth() / 2,
			y: r.getY() + r._rect.getHeight() / 2
		};
	};

	this.pick = function(number, callback) {
		allowNumpad = false;
		var b = balloonGroups[number - 1]._balloons;
		var g = balloonGroups[number - 1];
		
		g._rect.setFill("red");
		
		var x = g._balloons.getX();
		var y = b.getY();
		resetButton = function() {
			view.removeTween(b.attrs);
			b.setX(x);
			b.setY(y);
			b.moveTo(g);
			g._rect.setFill("yellow");
		};
		
		var yOffset = -110;
		var xOffset = 20;
		view.getTween(b.attrs).to({
			x: - Math.abs(CAGE_CONFIG.X - g.getX()) + xOffset,
			y: CAGE_CONFIG.Y - g.getY() + yOffset }, 4000)
		.call(function() {
			b.moveTo(cage);
			b.setX(xOffset);
			b.setY(yOffset);
			b.moveDown();
			callback();
		});
	};

	/**
	 * Picked a number on the numpad
	 */
	view.on(MW.Event.MG_LADDER_PICKED, function(callback) {
		if (view.game.modeIsAgentDo() && !game.agentIsInterrupted() && !game.agentIsBeingHelped()) {
			var pos = view.getStickPoint(game.getChosenNumber());
			MW.Sound.play(MW.Sounds.IM_GOING_TO_PICK_THIS_ONE);
			var reset = null;
			view.setTimeout(function () {
				reset = view.game.getAgentView().pointAt(game.getChosenNumber(), function () {
					view.setTimeout(function () {
						if (!game.agentIsInterrupted()) {
							view.pick(game.getChosenNumber(), callback);
							view.setTimeout(function () {
								reset(function () {});
							}, 1000);
						}
					}, 3000);
				});
			}, 1500);
		} else {
			view.pick(game.getChosenNumber(), callback);
		}
	});

	view.on(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET, function(callback) {
		var number = game.getChosenNumber();
		view.getTween(cage.attrs).to({
			x: (LADDER_CONFIG.X - (number - 1) *
			    LADDER_CONFIG.SLOPE + LADDER_CONFIG.WIDTH),
			y: (LADDER_CONFIG.Y - (number - 1) *
			    LADDER_CONFIG.HEIGHT)
		}, 2000).call(callback);
	});

	view.on(MW.Event.MG_LADDER_GET_TARGET, function(callback, msg) {
		var friendOffsetX = CAGE_CONFIG.WIDTH / 2;
		var friendOffsetY = -FRIEND_CONFIG.HEIGHT / 2;
		MW.Sound.play(MW.Sounds.LADDER_MOUNTAIN_YOU_SAVED_ME);
		view.setTimeout(function() {
			MW.Sound.play(MW.Sounds.LADDER_MOUNTAIN_IM_HUNGRY);
		}, 2000);
		view.getTween(friend.attrs).to({
			x: cage.getX() + friendOffsetX,
			y: cage.getY() + friendOffsetY
		}, 1000).call(function() {
			var time = 3000;
			view.getTween(cage.attrs).to({
				x: CAGE_CONFIG.X,
				y: CAGE_CONFIG.Y
			}, time);
			view.getTween(friend.attrs).to({
				x: CAGE_CONFIG.X + friendOffsetX,
				y: CAGE_CONFIG.Y + friendOffsetY
			}, time).call(function() {
				view.getTween(friend.attrs).to({
					x: CAGE_CONFIG.X +
					   CAGE_CONFIG.WIDTH +
					   FRIEND_CONFIG.WIDTH,
					y: CAGE_CONFIG.Y
				}, 2000).call(callback);
			});
		});
	});
	
	view.on(MW.Event.MG_LADDER_HAS_TARGET, function(msg) {
		if (!view.game.modeIsAgentDo())
			game.openTreat();
		
	});

	/**
	 * Called by the LadderView when the player confirms the target, e.g. by
	 * clicking on it.
	 */
	view.confirmTarget = function () {
		/*
		 * The target can not be confirmed (clicked on) by the player in
		 * this version of the Ladder minigame, so nothing is done here.
		 */
	};

	/**
	 * Called when something is about to pop out from the target treat.
	 */
	view.getTreat = function (callback) {
		/*
		 * In this version of the Ladder minigame, no treat is given
		 * to the player (except the water), so control is just handed
		 * back to the minigame model right away, by calling the
		 * callback function:
		 */
		callback();
	};
	
	view.on(MW.Event.MG_LADDER_RESET_SCENE, function(callback, msg) {
		var whenDone = function() {
			if (resetButton != null) resetButton();
			callback();
		};
		if (cage.getY() != CAGE_CONFIG.Y) {
			view.getTween(cage.attrs).to({
				x: CAGE_CONFIG.X, y: CAGE_CONFIG.Y
			}, 2000).call(whenDone);
		} else {
			whenDone();
		}
	});
	
	this.addTearDown(function() {
		Log.debug("Tearing down MountainView", this._tag);
		view.stage.remove(staticLayer);
		view.stage.remove(dynamicLayer);
	});
};

