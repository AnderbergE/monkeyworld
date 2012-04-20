/**
 * @constructor
 * @implements {ViewModule}
 * @extends {GameView}
 */
function FishingView(evm, stage, gameState, model) {

	/** @const @type {string} */ var EVM_TAG = "FishingView";
	/**
	 * Configuration of the view
	 */
	var config = function() {
		return {
		
		/** @const */ SKY: {
			/** @const */ Y: 50
		},
		
		/** @const */ POND: {
			/** @const */ X: 285,
			/** @const */ Y: 150,
			/** @const */ WIDTH: 400,
			/** @const */ HEIGHT: 580
		},
		
		/** @const */ BASKET: {
			/** @const */ X: 710,
			/** @const */ Y: 50,
			/** @const */ WIDTH: 270,
			/** @const */ HEIGHT: 400
		}

		};
	}();
	var ROLL_DIFF = -230;
	var BASKET_SLOTS = {};
	var basketGrid = Utils.gridizer(
		config.BASKET.X + 64, config.BASKET.Y + config.BASKET.HEIGHT - 64,
		125, -128, 2
	);
	for (var i = 0; i < 8; i++) {
		BASKET_SLOTS[i] = basketGrid.next();
	}

	/** @type {Object.<Fish, Kinetic.Group>} */ 
	var fishGroups = {};
	/** @type {Object.<Fish, Kinetic.Text>} */
	var numberGroups = {};
	var fishTank = null;
	var animator = new Animator();
	/** @type {boolean} */ var allowClicks = true; 
	
	var fishCountingView = new FishCountingView(stage, evm, EVM_TAG);
	
	/*
	 * Initiate layers
	 */
	var shapeLayer = new Kinetic.Layer();
	var rodLayer = new Kinetic.Layer();
	var backgroundLayer = new Kinetic.Layer();
	var outGroup = new Kinetic.Group({
		x: 0, y:0
	});
	var basket = null;
	var pondLayer = backgroundLayer;
	//var pondLayer = new Kinetic.Layer();
	stage.add(backgroundLayer);
	stage.add(pondLayer);
	stage.add(shapeLayer);
	stage.add(rodLayer);

	var turnOffClick = function(fish) {
		fishGroups[fish].off("mousedown touchstart");
	};
	
	var turnOnClick = function(fish) {
		fishGroups[fish].on("mousedown touchstart", function() {
			if (allowClicks) {
				clickFunction(fish);	
			}
		});
	};
	
	function switchToMonkey() {
		outGroup.moveTo(shapeLayer);
		shapeLayer.attrs.centerOffset = {x: config.POND.WIDTH + config.POND.X, y: 0};
		shapeLayer.attrs.x = config.POND.WIDTH + config.POND.X;
		outGroup.moveToBottom();
		backgroundLayer.draw();
		Tween.get(shapeLayer.attrs.scale).to({x:0}, 2000).call(function(){
			shapeLayer.attrs.centerOffset.x = 0;
			shapeLayer.attrs.x = ROLL_DIFF;
			/* ============================================================== */
			/*   Firefox zero scale bug work-around                           */
			/*   https://bugzilla.mozilla.org/show_bug.cgi?id=661452          */
			/*   Added 2012-04-12 by <bjorn.norrliden@gmail.com>              */
			/* ============================================================== */
			shapeLayer.attrs.scale.x = 0.1;
			/* ============================================================== */
			Tween.get(shapeLayer.attrs.scale).to({x:1}, 2000);
		});
		basket.moveTo(stage._gameLayer);
		backgroundLayer.draw();
		Tween.get(basket.attrs).to({x: basket.attrs.x - 230}, 2000).call(function() {
			basket.moveTo(backgroundLayer);
			backgroundLayer.draw();
		});
		rod.moveToMonkey(2000, ROLL_DIFF);
	};
	
	function translateFish(fish) {
		var pos = {};
		pos.x = fish.getX() * config.POND.WIDTH + config.POND.X;
		pos.y = fish.getY() * config.POND.HEIGHT + config.POND.Y;
		return pos;
	};
	
	function scaleFish(fish) {
		var dim = {};
		dim.width = fish.getWidth() * config.POND.WIDTH;
		dim.height = fish.getHeight() * config.POND.HEIGHT;
		return dim;
	};
	
	var clickFunction = function(fish) {
		fishTank.activity();
		if (allowClicks) {
			if (!fish.isCaptured()) {
				Log.debug("Starting to catch " + fish, "fish");
				fishTank.catchFish(fish, function() {});
			} else {
				fishTank.freeFish(fish, function() {});
				fishTank.noactivity();
			}
		}
	};
	
	var tearDownView = function() {
		Log.debug("Tearing down FishingView's layers", "view");
		evm.tell("Game.hideBig");
		stage.remove(backgroundLayer);
		stage.remove(shapeLayer);
		stage.remove(rodLayer);
		stage.remove(pondLayer);
	};
	
	var roundDone = function() {
		tearDownView();
		evm.off("frame", EVM_TAG);
		fishCountingView.init(fishTank, fishGroups);
		fishTank.readyToCount();
	};

	evm.on("FishingGame.catch", function(msg) {
		rod.initCatch(msg.fish, msg.done);
	}, EVM_TAG);
	
	evm.on("FishingGame.free", function(msg) {
		freeFish(msg.fish, msg.done);
	}, EVM_TAG);
	
	evm.on("fishinggame.turnOnClick", function(msg) {
		turnOnClick(msg.fish);
	}, EVM_TAG);
	
	evm.on("fishinggame.turnOffClick", function(msg) {
		turnOffClick(msg.fish);
	}, EVM_TAG)
	
	evm.on("fishinggame.allowClicks", function(msg) {
		allowClicks = true;
	}, EVM_TAG);
	
	evm.on("fishinggame.disallowClicks", function(msg) {
		allowClicks = false;
	}, EVM_TAG);
	
	evm.on("FishingGame.freeWrongOnes", function(msg) {
		evm.tell("Game.showBig", {text:Strings.get("FISHING_FREE_WRONG_ONES").toUpperCase()});
		evm.play(Sounds.FISHING_FREE_WRONG_ONES)
	}, EVM_TAG);
	
	evm.on("FishingGame.catchingDone", function(msg) {
		allowClicks = false;
		evm.tell("Game.showBig", {text:Strings.get("YAY").toUpperCase()});
		evm.play(Sounds.YAY);
		setTimeout(function() {
			roundDone();
		}, 2000);
	}, EVM_TAG);
	
	var rod = function(rodLayer) {
		/** @const @enum */ var ROD_STATE =
		{
			/** @const */ PENDULUM:             0,
			/** @const */ WIND_IN_FISH:         1,
			/** @const */ THROW_FISH_IN_BASKET: 2,
			/** @const */ INIT_CATCHING:        3,
			/** @const */ CATCHING:             4
		};

		var state = {
			tip: { x: (2*config.POND.X + config.POND.WIDTH) / 2, y: 75 },
			length: 300,
			pendulum: 0,
			pendulumDirection: -1,
			maxAngle: Math.PI / 30,
			speed: 0.0001,
			catching: null,
			state: ROD_STATE.PENDULUM,
			begin: {x:config.POND.X, y:125},
			hook: { x: (2*config.POND.X + config.POND.WIDTH) / 2, y: 375 },
			end: {
				x: (2*config.POND.X + config.POND.WIDTH) / 2,
				y: 375
			}
		};
		
		function getGoalAngle(fish) {
			var front = getFishFront(fish);
			var rx = state.tip.x;
			var ry = state.tip.y;
			var dx = (rx - front.x);
			var dy = (ry - front.y);
			return Math.atan(dx/dy);
		}

		function getFishFront(fish) {
			var dir = fish.getDirection();
			var pos = translateFish(fish);
			return {
				x: pos.x + dir * fish.getMouthPosition().x*config.POND.WIDTH,
				y: pos.y + dir * fish.getMouthPosition().y*config.POND.HEIGHT
			};
		}
		
		return {
			moveToMonkey: function(time, diff) {
				Tween.get(rodLayer.attrs).to({x:rodLayer.attrs.x+diff}, time);
			},
			
			draw: function(frame) {
				var angle = state.pendulum;
				switch (state.state) {
				case ROD_STATE.INIT_CATCHING:
					if (allowClicks) {
						fishTank.turnOffClicks();
					}
					state.playedSplash = false;
					evm.play(Sounds.FISHING_SWOSH);
					angle = getGoalAngle(state.catching);
					var front = getFishFront(state.catching);
					
					var distance = Math.sqrt(Math.pow(state.tip.x-front.x, 2)+
							             Math.pow(state.tip.y-front.y, 2));
					animator.animateTo
					(
						state,
						{ pendulum: angle, length: distance },
						{
							duration: { length: 500, pendulum: 500 },
							onFrame: function()
							{
								angle = getGoalAngle(state.catching);
								var front = getFishFront(state.catching);
								var distance = Math.sqrt(Math.pow(state.tip.x-front.x, 2)+
										             Math.pow(state.tip.y-front.y, 2));
								animator.updateEndState(state, { pendulum: angle, length: distance });
							},
							onFinish: function()
							{
								state.catching.hooked();
								state.state = ROD_STATE.WIND_IN_FISH;
							}
						}
					);
					state.state = ROD_STATE.CATCHING;
				case ROD_STATE.PENDULUM:
					angle = state.pendulum;
					state.pendulum += state.pendulumDirection *
					state.speed * frame.timeDiff;
					if (state.pendulum >= state.maxAngle) {
						state.pendulumDirection *= -1;
						state.pendulum = state.maxAngle;
					} else if (state.pendulum <= -state.maxAngle) {
						state.pendulumDirection *= -1; 
						state.pendulum = - state.maxAngle;
					}
					break;
				case ROD_STATE.CATCHING: break;
				case ROD_STATE.WIND_IN_FISH:
					//state.state = ROD_STATE.THROW_FISH_IN_BASKET;

					state.state = ROD_STATE.CATCHING;
					
					var fish = state.catching;
					var fishGroup = fishGroups[state.catching];
					var mouth = fish.getMouthPosition();
					mouth.x *= config.POND.WIDTH;
					mouth.y *= config.POND.HEIGHT;
					var direction = fish.getDirection();
					fishGroup.attrs.centerOffset.y = mouth.y;
					if (direction > 0) {
						fishGroup.attrs.x = fishGroup.attrs.x + mouth.x;
						fishGroup.attrs.centerOffset.x = mouth.x;
					} else {
						fishGroup.attrs.x = fishGroup.attrs.x - mouth.x;
						fishGroup.attrs.centerOffset.x = mouth.x;
					}
					
					evm.play(Sounds.FISHING_WINDING);
					animator.animateTo(
						fishGroup.attrs,
						{
							rotation: -1*direction * Math.PI /2
						},
						{
							duration: { rotation: 500 },
							onFrame: function(){},
							onFinish: function(){}
						}
					);
					
					animator.animateTo
					(
						state,
						{ y: config.POND.Y-120, length: 20 },
						{
							speed: { y: 1, length: 0.5 },
							onFrame: function()
							{
								var fishGroup = fishGroups[state.catching];
								fishGroup.attrs.x = state.end.x;
								fishGroup.attrs.y = state.end.y;
								var splashed = state.playedSplash;
								var surface = config.POND.Y;
								var aboveSurface = fishGroup.attrs.y < surface;
								if (!splashed && aboveSurface) {
									evm.play(Sounds.FISHING_SPLASH);
									state.playedSplash = true;
								}
							},
							onFinish: function()
							{
								evm.stop(Sounds.FISHING_WINDING);
								state.state = ROD_STATE.THROW_FISH_IN_BASKET;
							}
						}
					);

					break;
				case ROD_STATE.THROW_FISH_IN_BASKET:
					state.state = ROD_STATE.CATCHING;
					var endState = BASKET_SLOTS[fishTank.getNextBasketSlot()];
					var fish = state.catching;
					var mouthXPosition = fish.getMouthPosition().x;
					var fishDirection = fish.getDirection();
					endState.rotation = fishDirection * 2 * Math.PI;
					
					Tween.get(fishGroups[state.catching].attrs).to(endState, 1500).call(function(){
						fishTank.putFishInBasket(fish);
						if (allowClicks) {
							state.catching.capture();
							fishTank.turnOnClicks();
						}
						fishTank.noactivity();
					});
					
					Tween.get(fishGroups[state.catching].attrs.centerOffset).to({x:0,y:0}, 1500).call(function() {
					});
					animator.animateTo(
						state,
						{ length: 200, pendulum: 0, y: 75 },
						{
							duration: { length: 1000, pendulum: 1000, y: 200 },
							onFrame: function() {},
							onFinish: function() {
								state.state = ROD_STATE.PENDULUM;
								state.done();
							}
						}
					);
					break;
				default: break;
				}

				state.end.x = state.tip.x + state.length * Math.sin(angle);
				state.end.y = state.tip.y + state.length * Math.cos(angle);
				var context = rodLayer.getContext();
				var rx = rodLayer.attrs.x;
				var ry = rodLayer.attrs.y;
				rodLayer.clear();
				context.beginPath();
				context.strokeStyle = "black";
				context.moveTo(rx + state.begin.x, ry + state.begin.y);
				context.lineTo(rx + state.tip.x, ry + state.tip.y);
				context.stroke();
				context.closePath();
				context.beginPath();
				context.moveTo(rx + state.tip.x, ry + state.tip.y);
		        context.lineTo(rx + state.end.x, ry + state.end.y);
		        context.strokeStyle = "brown";
		        context.lineWidth = 2;
		        context.stroke();
		        context.closePath();
			},
			
			/**
			 * @param {Fish} fish
			 */
			initCatch: function(fish, done) {
				state.catching = fish;
				state.done = done;
				state.state = ROD_STATE.INIT_CATCHING;
			}
		};
	}(rodLayer);

	/**
	 * Animates a fish back to the pond.
	 * @param {Fish} fish
	 */
	var freeFish = function(fish, done) {
		if (fish.canFree()) {
			Log.debug("Starting to free " + fish, "fish");
			/** @type {Kinetic.Group} */ var group = fishGroups[fish];
			animator.animateTo
			(
				group.attrs, { x: config.POND.X + config.POND.WIDTH/2, y: config.POND.Y, rotation: Math.PI / 2 },
				{
					duration: { x: 1000, y: 1000, rotation: 1000 },
					onFinish: function()
					{
						evm.play(Sounds.FISHING_SPLASH);
						group.attrs.centerOffset.x = 0;
						group.attrs.centerOffset.y = 0;
						var pos = translateFish(fish);
						animator.animateTo(
							group.attrs, { x:pos.x, y:pos.y, rotation: 0 },
							{
								duration: { x: 1000, y: 1000, rotation: 1000 },
								onFrame: function() {},
								onFinish: function() {
									done();
								}
							}
						);
					}
				}
			);
		} else {
			evm.play(Sounds.FISHING_NOT_THIS_ONE);
		}
	};
	
	this.toString = function() { return "Fish View"; };
	
	/*evm.on("fishinggame.initiatedfish", function(msg){
		console.log("created");
		createFish(msg.fish);
		
	}, EVM_TAG);
	*/
	evm.on("fishinggame.fishmoved", function(msg) {
		moveFish(msg.fish);
	}, EVM_TAG);
	
	evm.on("fishinggame.fishturnedleft", function(msg) {
		var scale = fishGroups[msg.fish].getScale();
		fishGroups[msg.fish].setScale(-1 * scale.x, scale.y);
		numberGroups[msg.fish].setScale(-1 * msg.fish.getScale(), 1*msg.fish.getScale());
	}, EVM_TAG);
	
	evm.on("fishinggame.fishturnedright", function(msg) {
		var scale = fishGroups[msg.fish].getScale();
		fishGroups[msg.fish].setScale(-1 * scale.x, scale.y);
		numberGroups[msg.fish].setScale(msg.fish.getScale()*1, msg.fish.getScale()*1);
	}, EVM_TAG);
	
	evm.on("FishingGame.inactivity", function(msg) {
		evm.play(msg.sound);
	}, EVM_TAG);
	
	function moveFish(fish) {
		var pos = translateFish(fish);
		fishGroups[fish].attrs.x = Math.round(pos.x);
		fishGroups[fish].attrs.y = Math.round(pos.y);
	}

	/**
	 * Creates a fish
	 * @param {Fish} fish
	 */
	function createFish(fish) {

		var pos = translateFish(fish);
		var fishGroup = new Kinetic.Group({
			x: pos.x,
			y: pos.y,
			width: fish.getScale() * fish.getWidth()*config.POND.WIDTH,
			height: fish.getScale() * fish.getHeight()*config.POND.HEIGHT,
			centerOffset: { x: 0, y: 0 }
		});
		
		shapeLayer.add(fishGroup);
		
		var image = new Kinetic.Image({
			x: 0,
			y: 0,
			image: images["fish" + fish.getSpecies()],
			width: fish.getScale() * fish.getWidth()*config.POND.WIDTH,
			height: fish.getScale() * fish.getHeight()*config.POND.HEIGHT,
			centerOffset: {
				x: fish.getScaledWidth()*config.POND.WIDTH / 2,
				y: fish.getScaledHeight()*config.POND.HEIGHT / 2
			}
		});
		image.setScale(-1,1);
		fishGroup.add(image);

		var numberText = new Kinetic.Text({
			x: 0,
			y: 0,
			text: fish.getNumber(),
			fontSize: 48,
			fontFamily: "Gloria Hallelujah",
			textFill: "white",
			align: "center",
			verticalAlign: "middle",
			textStroke: "#444"
		});
		fishGroup.add(numberText);
		numberText.setScale(fish.getScale());

		fishGroups[fish] = fishGroup;
		numberGroups[fish] = numberText;
		turnOnClick(fish);
	};

	/**
	 * Adds a plant to the specified layer.
	 * @param {Kinetic.Container} layer
	 */
	function createPlant(layer, x, y) {
		var image = new Kinetic.Image({
			x: x+64, y: y+64, image: images["plant"],
			width: 128, height: 128, centerOffset: { x: 64, y: 64 }
		});
		layer.add(image);
	};

	/**
	 * Adds a bottom to the pond.
	 * @param {Kinetic.Container} layer
	 * @param {number} x1
	 * @param {number} x2
	 * @param {number} y
	 * @param {number} height
	 * @param {number} bend
	 */
	function createBottom(layer, x1, x2, y, height, bend) {
		var triangle = new Kinetic.Shape({
			drawFunc: function(){
				var that = this;
				var context = that.getContext();
				context.beginPath();
				context.moveTo(x1, y);
				context.lineTo(x2, y);
				context.lineTo(x2, y-height);
				context.quadraticCurveTo(x1, y-height, x1, y-bend);
				context.closePath();
				this.fillStroke();
			},
			fill: "#EED6AF",
			stroke: "#CDBA96",
			strokeWidth: 4
		});
		layer.add(triangle);
	};
	
	evm.on("Game.initiate", function(msg) {
		init();
	}, EVM_TAG);
	
	var that = this;
	var init = function() {
		
		that.setEventManager(evm);
		fishTank = model;
		
		var fishArray = fishTank.getAllFish();
		for (var i = 0; i < fishArray.length; i++) {
			createFish(fishArray[i]);
		}
		
		

		that.setStaticLayer(backgroundLayer);
		that.setDynamicLayer(shapeLayer);
		that.basicInit(gameState);
		
    	Log.debug("Building stage...", "view");


    	
		var background = new Kinetic.Rect({
			x: 0,
			y: 2,
			width: stage.attrs.width,
			height: stage.attrs.height,
			fill: "white"
		});
		var water = new Kinetic.Rect({
			x: config.POND.X,
			y: config.POND.Y + 20,
			width: config.POND.WIDTH,
			height: config.POND.HEIGHT - 20,
			fill: "#00D2FF",
			stroke: "#436EEE",
			strokeWidth: 4
		});
		var waterSurface = new Kinetic.Shape({
			drawFunc: function(){
				var that = this;
				var context = that.getContext();
				context.beginPath();
				context.moveTo(config.POND.X + 00, config.POND.Y);
				context.lineTo(config.POND.X + config.POND.WIDTH - 00, config.POND.Y);
				context.lineTo(config.POND.X + config.POND.WIDTH, config.POND.Y + 20);
				context.lineTo(config.POND.X, config.POND.Y + 20);
				context.closePath();
				this.fillStroke();
			},
			fill: "#00FFFF",
			alpha: 1
		});
		var waterSurface2 = new Kinetic.Shape({
			drawFunc: function(){
				var that = this;
				var context = that.getContext();
				context.beginPath();
				context.moveTo(config.POND.X + 00, config.POND.Y+10);
				context.lineTo(config.POND.X + config.POND.WIDTH - 0, config.POND.Y+10);
				context.lineTo(config.POND.X + config.POND.WIDTH, config.POND.Y + 20);
				context.lineTo(config.POND.X, config.POND.Y + 20);
				context.closePath();
				this.fillStroke();
			},
			fill: "#00FFFF",
			stroke: "#00FFFF",
			strokeWidth: 0,
			alpha: 0.5
		});
		images["sky"].style.width = "300px";
		
		basket = new Kinetic.Image({ x: config.BASKET.X, y: config.BASKET.Y, width: config.BASKET.WIDTH, height: config.BASKET.HEIGHT, image: images["basket"] });

		var sky = new Kinetic.Image({ x: config.POND.X, y: config.SKY.Y, width: config.POND.WIDTH, image: images['sky'] });
		
		// TOP LEFT
		var bamboo0 = new Kinetic.Image({ x: config.POND.X-10, y: config.SKY.Y-15, image: images["bamboo"] });
		
		// TOP RIGHT
		var bamboo1 = new Kinetic.Image({ x: config.POND.X+config.POND.WIDTH-10, y: config.SKY.Y-15, image: images["bamboo"] });
		
		// BOTTOM LEFT
		var bamboo3 = new Kinetic.Image({ x: config.POND.X-10, y: 255, image: images["bamboo"] });
		
		// BOTTOM RIGHT
		var bamboo4 = new Kinetic.Image({ x: config.POND.X+config.POND.WIDTH-10, y: 255, image: images["bamboo"] });
		
		// BOTTOM
		var bamboo7 = new Kinetic.Image({ x: config.POND.X-10, y: config.POND.Y + config.POND.HEIGHT+5, height: config.POND.WIDTH,rotation: -Math.PI/2, image: images["bamboo"] });
		
		// TOP
		var bamboo9 = new Kinetic.Image({ x: config.POND.X, y: config.SKY.Y, height:config.POND.WIDTH, rotation: -Math.PI/2, image: images["bamboo"] });

//		var bamboo2 = new Kinetic.Image({ x: 1024-20, y: 20, image: images["bamboo"] });
//		var bamboo5 = new Kinetic.Image({ x: 1024-20, y: 285, image: images["bamboo"] });
//		var bamboo6 = new Kinetic.Image({ x: config.POND.X+config.POND.WIDTH, y: 500, height:320, rotation: -Math.PI/2, image: images["bamboo"] });
//		var bamboo8 = new Kinetic.Image({ x: config.POND.X+config.POND.WIDTH, y: 760, height:320,rotation: -Math.PI/2, image: images["bamboo"] });
//		var bamboo10 = new Kinetic.Image({ x: config.POND.X+config.POND.WIDTH, y: 20,  height:320, rotation: -Math.PI/2, image: images["bamboo"] });
		//backgroundLayer.add(background);

		//backgroundLayer.add(avatar);
		outGroup.add(sky);
		backgroundLayer.add(basket);
		
		outGroup.add(water);
		outGroup.add(waterSurface);
		outGroup.add(waterSurface2);
		createBottom(outGroup,
				 config.POND.X,
				 config.POND.X + config.POND.WIDTH,
				 config.POND.Y + config.POND.HEIGHT,
				 50,
				 80);
		outGroup.add(bamboo0);
		outGroup.add(bamboo1);
//		backgroundLayer.add(bamboo2);
//		backgroundLayer.add(bamboo6);
		outGroup.add(bamboo3);
		outGroup.add(bamboo4);
//		backgroundLayer.add(bamboo5);
		outGroup.add(bamboo7);
//		backgroundLayer.add(bamboo8);
		outGroup.add(bamboo9);
//		backgroundLayer.add(bamboo10);

		
		
		
		createPlant(outGroup, config.POND.X + 20, config.POND.Y + config.POND.HEIGHT - 150);
		createPlant(outGroup, config.POND.X + 100, config.POND.Y + config.POND.HEIGHT - 160);
		createPlant(outGroup, config.POND.X + config.POND.WIDTH - 130, config.POND.Y + config.POND.HEIGHT - 140);
		
		if (gameState.getMode() == GameMode.MONKEY_DO && gameState.getMonkeyDoRounds() > 1 || gameState.getMode() == GameMode.GUARDIAN_ANGEL) {
			basket.attrs.x += ROLL_DIFF;
			outGroup.attrs.x += ROLL_DIFF;
			shapeLayer.attrs.x += ROLL_DIFF;
			rodLayer.attrs.x += ROLL_DIFF;
		}
		
		backgroundLayer.add(outGroup);
		backgroundLayer.draw();
		
		/**
		 * What to do on each frame.
		 * @param msg
		 */
		evm.on("frame", function(msg) {
			var frame = msg.frame;
			rod.draw(frame); // Draw the fishing rod
			animator.tick(frame.timeDiff); // Tell the animator about the frame
			shapeLayer.draw(); // Draw the shape layer

		}, EVM_TAG);
	};

	var loadingLayer;
	loadingLayer = new Kinetic.Layer();
	var text = new Kinetic.Text({
    	text: "Vänta...",
    	fontSize: 36,
    	fontFamily: "Arial",
    	textFill: "white",
    	x: stage.attrs.width / 2,
    	y: stage.attrs.height / 2,
        align: "center"
	});
	loadingLayer.add(text);
	loadingLayer._text = text;
	
	evm.on("Game.roundDone", function(msg) {
		Log.debug("Tearing down view", "view");
		fishCountingView.tearDown();
		forget();
	}, EVM_TAG);
	
	var forget = function() {
		evm.forget(EVM_TAG);
	};
	
	evm.on("Game.start", function(msg) {
		Log.debug("Start rolling view...", "view");
		if (gameState.getMode() == GameMode.MONKEY_DO && gameState.getMonkeyDoRounds() == 1) {
			evm.tell("Game.showBig", {text:Strings.get("MONKEYS_TURN").toUpperCase()});
			evm.play(Sounds.NOW_MONKEY_SHOW_YOU);
			setTimeout(function() {
				that.moveToMonkey(startGame);
				switchToMonkey();
			}, 3000);
		} else {
			startGame();
		}
	}, EVM_TAG);
	
	var startGame = function() {
		evm.tell("Game.showBig", {text:Strings.get("FISHING_CATCH_NUMBER", fishTank.getCatchingNumber()).toUpperCase()});
		evm.play(Sounds.FISHING_CATCH);
		setTimeout(function() {
			Log.debug("Ready to play", "view");
			evm.play(Sounds["NUMBER_" + fishTank.getCatchingNumber()]);
			evm.tell("FishingGame.started", null);
		}, 700);
	};
	
}
FishingView.prototype = new GameView();