/**
 * @constructor
 * @extends {LadderView}
 * @param {Ladder} ladder
 */
function TreeView(ladder) {
	/** @type {TreeView} */ var view = this;
	LadderView.call(this, "TreeView", ladder);
	Log.debug("Creating TreeView", "object");
	
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
	
	var GROUND_HEIGHT = 100;
	var LEFT_GROUND_WIDTH = view.getStage().getWidth() * 0.4;
	var RIGHT_GROUND_WIDTH = view.getStage().getWidth() * 0.45;
	var GROUND_FILL = "#F4A460";
	var GROUND_STROKE = "#A52A2A";
	var GROUND_STROKE_WIDTH = 4;
	
	var numpad = {
		x: 1024 - 300,
		y: 300,
		buttonWidth: 100,
		buttonHeight: 100,
		buttonMargin: 20
	};
	
	var allowNumpad = false;
	var activeButton = null;
	
	/** @type{Kinetic.Layer} */ var staticLayer = new Kinetic.Layer();
	/** @type{Kinetic.Layer} */ var dynamicLayer = new Kinetic.Layer();
	
	view.getStage().add(staticLayer);
	view.getStage().add(dynamicLayer);

	/** @type {number} */ var stepHeight = 80;
	/** @type {number} */ var stepWidth = 120;
	/** @type {Object} */ var ladderBegin = {
		/** @type {number} */ x: 130,
		/** @type {number} */ y: view.getStage().getHeight() - GROUND_HEIGHT - stepHeight
	};
	/** @type {number} */ var stepNarrowing = 10;
	
	
	/** @const @type {Object.<Number>} */ var NEST = {
		/** @const @type {number} */ x: 700,
		/** @const @type {number} */ y: 130
	};
	
	/** @const @type {Object.<Number>} */ var DROP_ZONE = {
		/** @const @type {number} */ x: 650,
		/** @const @type {number} */ y: view.getStage().getHeight() - GROUND_HEIGHT - 80
	};
	
	/** @const @type {number} */ var DROP_ZONE_HEIGHT = 200;
	
	/** @type {number} */ var dropZoneOffset = 0;
	/** @type {number} */ var dropZoneOffsetWidth = 75;
	
	/** @type {Object.<Kinetic.Group>} */ var numpadGroups = {};
	/** @type {Object.<Kinetic.Group>} */ var stepGroups = {};
	
	var BIRD = {x: NEST.x + 90, y: NEST.y};
	
	/** @type {Kinetic.Group} */ var bird = new Kinetic.Group({
		x: BIRD.x, y: BIRD.y
	});
	
	var birdCirc = new Kinetic.Circle({
		radius: 50,
		fill: "blue"
	});
	var eyeball1 = new Kinetic.Image({
		image: MW.Images.EYEBALL,
		width: 30,
		height: 30,
		x: -50,
		y: -40
	});
	var eyeball2 = new Kinetic.Image({
		image: MW.Images.EYEBALL,
		width: 30,
		height: 30,
		x: -30,
		y: -40
	});
	var nosePos = {x:-48, y:-20};
	var birdNose = new Kinetic.Shape({
          drawFunc: function() {
            var context = this.getContext();
            context.beginPath();
            context.moveTo(nosePos.x, nosePos.y);
            context.quadraticCurveTo(nosePos.x - 20, nosePos.y - 10, nosePos.x - 30, nosePos.y + 10);
            context.quadraticCurveTo(nosePos.x, nosePos.y + 10, nosePos.x, nosePos.y + 20);
            context.closePath();
            this.fill();
            this.stroke();
          },
          fill: "#FFD700",
          stroke: "#DAA520",
          strokeWidth: 4
        });
	var wing = new Kinetic.Shape({
          drawFunc: function() {
            var context = this.getContext();
            context.beginPath();
            context.moveTo(0, 0);
            context.moveTo(30, 0);
            context.quadraticCurveTo(40, 80, 50, 100);
            context.quadraticCurveTo(40, 80, 0, 0);
            context.closePath();
            this.fill();
          },
          fill: "#FFD700",
          stroke: "#DAA520",
          strokeWidth: 4
        });
	wing.attrs.scale.y = 0.2;
	bird.add(birdCirc);
	bird.add(birdNose);
	bird.add(eyeball1);
	bird.add(eyeball2);
	bird.add(wing);
	
	var fly = true;
	
	/**
	 * @param {number=} wingDir
	 */
	var moveWingRec = function(wingDir) {
		if (wingDir === undefined) wingDir = 1;
		view.getTween(wing.attrs.scale).to({y:wingDir*(-1)}, 500).call(function() {
			if (fly) {
				moveWingRec(wingDir * (-1));
			}
		});
	};
	
	var moveWing = function() {
		fly = true;
		moveWingRec();
	};
	
	var stopWing = function() {
		fly = false;
		view.getTween(wing.attrs.scale).to({y:0.2}, 500);
	};
	
	
	var buttonFill = {
		start: {
			x: -50,
			y: -50
		},
		end: {
			x: 50,
			y: 50
		},
		colorStops: [0, 'red', 1, 'yellow']
	};
	
	var shakeTreat = function() {
		var ox = treat.getX();
		var oy = treat.getY();
		var time = 100;
		var offset = 5;
		var waitTime = 4000;
		view.getTween(treat.attrs)
			.to({ x: ox-offset }, time)
			.to({ x: ox+offset }, time)
			.to({ x: ox-offset }, time)
			.to({ x: ox+offset }, time)
			.to({ x: ox-offset }, time)
			.to({ x: ox+offset }, time)
			.to({ x: ox-offset }, time)
			.to({ x: ox+offset }, time)
			.to({ x: ox-offset }, time)
			.to({ x: ox }, time);
		view.getTween(treat.attrs)
			.to({ y: oy-offset }, time)
			.to({ y: oy+offset }, time)
			.to({ y: oy-offset }, time)
			.to({ y: oy+offset }, time)
			.to({ y: oy-offset }, time)
			.to({ y: oy+offset }, time)
			.to({ y: oy-offset }, time)
			.to({ y: oy+offset }, time)
			.to({ y: oy-offset }, time)
			.to({ y: oy }, time).wait(waitTime)
			.call(function() { shakeTreat(); });
	};
	
	var stopShakeTreat = function() {
		view.removeTween(treat.attrs);
	};
	
	var addOnMouseActionToTreat = function() {
		treat.on("mousedown touchstart", function() {
			ladder.openTreat();
		});
	};
	
	var treat = null;
	
	var createTreat = function(callback) {
		treat = new Kinetic.Group({x:ladderBegin.x, y:200});
		var treatCircle = new Kinetic.Circle({
			x: stepWidth - 20,
			y: stepHeight / 2,
			radius: stepHeight / 2 - 10,
			fill: "red",
			stroke: "#440000",
			strokeWidth: 4
		});
		treat._circle = treatCircle;
		treat.add(treatCircle);
		
		view.getTween(treat.attrs).to({y:stepGroups[ladder.getTargetNumber()].getY()}, 1000).call(callback);
		dynamicLayer.add(treat);
	};
	
	/**
	 * Open the treat
	 */
	view.confirmTarget = function(msg) {
		treat.off("mousedown touchstart");
		stopShakeTreat();
		treat._circle.setFill("blue");
		activeButton._rect.attrs.fill = buttonFill;
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
		view.getTween(balloons.attrs.scale).to({x:1,y:1}, 500).call(function() {
			view.getTween(balloons.attrs).to({y: 100}, 2000).call(msg.callback);
		});
	};
	
	view.on("Ladder.placeTarget", function(msg) {
		dropZoneOffset++;
		createTreat(msg.callback);
		allowNumpad = true;
	});
	
	this.pick = function(number, callback) {
		MW.Sound.play(MW.Sounds.CLICK);
		numpadGroups[number]._rect._originalFill = numpadGroups[number]._rect.attrs.fill;
		numpadGroups[number]._rect.setFill("red");
		activeButton = numpadGroups[number]; 
		staticLayer.draw();
		callback();
	};
	
	this.getStickPoint = function(number) {
		console.log(number);
		return {
			x:numpadGroups[number].getX(),
			y:numpadGroups[number].getY()
		};
	};
	
	/**
	 * Bird flies to the ladder
	 */
	view.on("Ladder.approachLadder", function(msg) {
		moveWing();
		view.getTween(bird.attrs).to({x: 300, y: stepGroups[msg.number].getY()}, 5500).call(msg.callback);
	});
	
	/**
	 * Bird flies to the nest
	 */
	view.on("Ladder.resetScene", function(msg) {
		view.getTween(bird.attrs).to({x: BIRD.x, y: BIRD.y}, 3000).call(function() {
			if (activeButton != null) {
				activeButton._rect.attrs.fill = buttonFill;
				staticLayer.draw();
			}
			if (msg.allowNumpad) allowNumpad = true;
			stopWing();
			msg.callback();
		});
	});
	
	/**
	 * Bird drops the treat
	 */
	view.on("Ladder.getTarget", function(msg) {
		/** @const @type {number} */ var TIME_TO_DROP_ZONE = 2000;
		
		var flyTo = {x: DROP_ZONE.x + dropZoneOffsetWidth * dropZoneOffset, y: DROP_ZONE.y - DROP_ZONE_HEIGHT};
		var dropAt = {x:flyTo.x, y: flyTo.y};
		flyTo.x += 170;
		
		view.getTween(bird.attrs).to(flyTo, TIME_TO_DROP_ZONE).call(function() {
			view.getTween(treat.attrs).to({x: DROP_ZONE.x + dropZoneOffsetWidth * dropZoneOffset, y: DROP_ZONE.y}, 500).call(function() {
				if (!view.game.modeIsAgentDo()) {
					addOnMouseActionToTreat();
					shakeTreat();
				}
			});
			
		});
		view.getTween(treat.attrs).to(dropAt, TIME_TO_DROP_ZONE).call(function() {
			msg.callback();
		});	
	});
	
	view.on("frame", function() {
		dynamicLayer.draw();
	});

	view.addTearDown(function() {
		Log.debug("Tearing down", this._tag);
		view.getStage().remove(staticLayer);
		view.getStage().remove(dynamicLayer);	
	});

	view.interrupt = function() {
		console.log("interrupt!");
		view.removeTween(bird.attrs);
	};
	
	var background = new Kinetic.Image({
		image: MW.Images.TREEGAME_BACKGROUND,
		x: 0,
		y: 0,
		width: view.getStage().getWidth(),
		height: view.getStage().getHeight()
	});

	staticLayer.add(background);

	view.addInterruptButtons(dynamicLayer);
	
	view.on("Ladder.helpAgent", function(msg) {
		allowNumpad = true;
	});
	
	for (var i = 0; i < ladder.getLadder().length; i ++) {
		var number = ladder.getLadder()[i];
		var begin = {
			x: ladderBegin.x,
			y: ladderBegin.y
		};
		begin.y -= i * stepHeight;
		var group = new Kinetic.Group({
			x: begin.x,
			y: begin.y
		});
		var poly = new Kinetic.Polygon({
			points: [
				0, 0,
				stepWidth, 0,
				stepWidth - stepNarrowing, stepHeight,
				stepNarrowing, stepHeight
			],
			stroke: "#5C4033",
			strokeWidth: 5
		});
		var text = new Kinetic.Text({
			text: number,
			y: stepHeight / 2,
			x: 15,
			height: stepHeight,
			fontSize: 56,
			fontFamily: "Doppio One",
			textFill: "white",
			verticalAlign: "middle",
			textStroke: "#5C4033",
			textStrokeWidth: 2
		});
		group.add(poly);
		group.add(text);
		stepGroups[number] = group;
//		staticLayer.add(group);
	}
	dynamicLayer.add(bird);
	
	var numpadGrid = Utils.gridizer(
		numpad.x, numpad.y,
		numpad.buttonWidth + numpad.buttonMargin,
		numpad.buttonHeight + numpad.buttonMargin,
		2
	);
	
	var tellMyTurn = false;
	for (var i = 1; i <= 6; i++) {
		(function(i) {
			var pos = numpadGrid.next();
			var group = new Kinetic.Group(pos);
			var rect = new Kinetic.Rect({
				width: numpad.buttonWidth,
				height: numpad.buttonHeight,
				fill: buttonFill,
				cornerRadius: 10,
				strokeWidth: 4,
				stroke: "orange",
				centerOffset: {
					x: numpad.buttonWidth / 2,
					y: numpad.buttonHeight / 2
				}
			});
			group.add(rect);
			group._rect = rect;
			var text = new Kinetic.Text({
				text: i,
				fontSize: 60,
				fontFamily: "Nunito",
				textFill: "orange",
				verticalAlign: "middle",
				align: "center",
				textStroke: "red",
				textStrokeWidth: 1,
				x: numpad.buttonWidth / 2,
				y: numpad.buttonHeight / 2,
				centerOffset: {
					x: numpad.buttonWidth / 2,
					y: numpad.buttonHeight / 2
				}
			});
			group._text = text;
			group.add(text);
			group.on("mousedown touchstart", function() {
				if (allowNumpad && view.game.playerIsGamer()) {
					allowNumpad = false;
					ladder.pick(i);
				} else if (view.game.playerIsAgent() && !tellMyTurn) {
					tellMyTurn = true;
					MW.Sound.play(MW.Sounds.NO_MY_TURN);
					setTimeout(function() {
						MW.Sound.play(MW.Sounds.BUT_YOU_CAN_INTERRUPT);
						setTimeout(function() {
							tellMyTurn = false;
						}, 2000);
					}, 2000);
				}
			});
			numpadGroups[i] = group;
			staticLayer.add(group);
		})(i);
	}
	
	view.addAgent(
		view.getStage().getWidth() - 500,
		view.getStage().getHeight() - GROUND_HEIGHT - view.agentImage.height,
		dynamicLayer
	);
	
	staticLayer.draw();
	
}
