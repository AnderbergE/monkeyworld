/**
 * @constructor
 * @implements {ViewModule}
 */
function FishingView(ievm, stage, config_dep) {

	/** @const @type {string} */ var EVM_TAG = "FishingView";
	
	/**
	 * Configuration of the view
	 */
	var config = function() {
		return {
		/** @const */ IMAGE_FOLDER: "../res/img",
		/** @const */ IMAGE_SOURCES: {
			/** @const */ "fish0": "fish/0.png",
			/** @const */ "fish1": "fish/1.png",
			/** @const */ "bambu": "bambu.png",
			/** @const */ "plant": "plant.png",
			/** @const */ "sky": "sky.png",
			/** @const */ "monkey": "monkey.png"
		},
		
		/** @const */ SOUND_SOURCES: [
			/** @const */ { name:"winding", src: "../res/sound/34968__mike-campbell__f-s-1-fishing-reel.wav" },
			/** @const */ { name:"splash", src: "../res/sound/water_movement_fast_002.wav" },
			/** @const */ { name:"swosh", src: "../res/sound/60009__qubodup__swosh-22.wav" }
		],
		
		/** @const */ POND: {
			/** @const */ X: 100,
			/** @const */ Y: 150,
			/** @const */ WIDTH: 625,
			/** @const */ HEIGHT: 600
		}

		};
	}();
//	console.log(config.SOUND_SOURCES);
	/** @const */ var BASKET_SLOTS = {
		/** @const */ 6: { x: 825, y: 0 },
		/** @const */ 4: { x: 700, y: 25 },
		/** @const */ 5: { x: 825, y: 25 },
		/** @const */ 2: { x: 700, y: 153 },
		/** @const */ 3: { x: 825, y: 153 },
		/** @const */ 0: { x: 700, y: 281 },
		/** @const */ 1: { x: 825, y: 281 }
	};

	/** @type {Object.<string, Image>} */ 
	var images = {};
	/** @type {Object.<Fish, Kinetic.Group>} */ 
	var fishGroups = {};
	/** @type {Object.<Fish, Kinetic.Text>} */
	var numberGroups = {};
	var fishTank = null;
	var animator = new Animator();
	/** @type {boolean} */ var allowClicks = true; 
	
	var fishCountingView = new FishCountingView(stage, ievm, EVM_TAG);
	
	/*
	 * Initiate layers
	 */
	var shapeLayer = new Kinetic.Layer({x: config.POND.X, y: config.POND.Y});
	var rodLayer = new Kinetic.Layer();
	var backgroundLayer = new Kinetic.Layer();
	var overlayLayer = new Kinetic.Layer();
	var dynamicOverlayLayer = new Kinetic.Layer();
	overlayLayer._drawOnce = false;
	var pondLayer = new Kinetic.Layer();
	var fpsLayer = new Kinetic.Layer();
	stage.add(backgroundLayer);
	stage.add(pondLayer);
	stage.add(shapeLayer);
	stage.add(rodLayer);
	stage.add(overlayLayer);
	stage.add(dynamicOverlayLayer);
	dynamicOverlayLayer._numberOfNodes = 0;
	dynamicOverlayLayer._doDraw = false;

	dynamicOverlayLayer.dynamicAdd = function(obj) {
		if ((++dynamicOverlayLayer._numberOfNodes) > 0)
			dynamicOverlayLayer._doDraw = true;
		dynamicOverlayLayer.add(obj);
	}
	dynamicOverlayLayer.dynamicRemove = function(obj) {
		if (dynamicOverlayLayer._numberOfNodes > 0 &&
			--dynamicOverlayLayer._numberOfNodes == 0) {
			dynamicOverlayLayer._doDraw = false;
			dynamicOverlayLayer._drawOnce = true;
		}		
		dynamicOverlayLayer.add(obj);
	}
	stage.add(fpsLayer);
	
	var evm = ievm;

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
	
	var clickFunction = function(fish) {
		fishTank.activity();
		if (allowClicks) {
			if (!fish.isCaptured()) {
				Log.debug("Starting to catch " + fish, "fish");
				rod.initCatch(fish);
			} else {
				freeFish(fish);
				fishTank.noactivity();
			}
		}
	};
	
	var tearDownView = function() {
		Log.debug("Tearing down FishingView's layers", "view");
		stage.remove(backgroundLayer);
		stage.remove(shapeLayer);
		stage.remove(rodLayer);
		stage.remove(overlayLayer);
		stage.remove(pondLayer);
		stage.remove(fpsLayer);
		stage.remove(dynamicOverlayLayer);
		/*stage.onFrame(function(frame){
			evm.tell("frame", {frame:frame});
		});*/
	};
	
	var roundDone = function() {
		tearDownView();
		evm.off("frame", EVM_TAG);
		fishCountingView.init(fishTank, fishGroups);
	};

	evm.on("fishinggame.catch", function(msg) {
		rod.initCatch(msg.fish);
		evm.tell("fishinggame.catched", {fish: msg.fish});
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
		showBig(Strings.get("FISHING_FREE_WRONG_ONES").toUpperCase());
		evm.play(Sounds.FISHING_FREE_WRONG_ONES)
	}, EVM_TAG);
	
	evm.on("FishingGame.catchingDone", function(msg) {
		allowClicks = false;
		showBig(Strings.get("YAY").toUpperCase());
		evm.play(Sounds.YAY);
		roundDone();
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
			return {
				x: fish.getX() + config.POND.X + dir * fish.getMouthPosition().x,
				y: fish.getY() + config.POND.Y + dir * fish.getMouthPosition().y
			};
		}
		
		return {
			draw: function(frame) {
				var angle = state.pendulum;
				switch (state.state) {
				case ROD_STATE.INIT_CATCHING:
					if (allowClicks) {
						fishTank.turnOffClicks();
					}
					state.playedSplash = false;
					SoundJS.play("FISHING_SWOSH");
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
					state.state = ROD_STATE.CATCHING;
					var fish = state.catching;
					var fishGroup = fishGroups[state.catching];
					var mouth = fish.getMouthPosition();
					var direction = fish.getDirection();
					fishGroup.centerOffset.y = mouth.y;
					if (direction > 0) {
						fishGroup.x = fishGroup.x + mouth.x;
						fishGroup.centerOffset.x = mouth.x;
					} else {
						fishGroup.x = fishGroup.x - mouth.x;
						fishGroup.centerOffset.x = mouth.x;
					}
					
					SoundJS.play("FISHING_WINDING");
					/*
					fishGroup.transitionTo({
						rotation: -1*direction * Math.PI /2,
						duration: 0.5
					});
					*/
					animator.animateTo(
						fishGroup,
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
								fishGroup.x = state.end.x - config.POND.X;
								fishGroup.y = state.end.y - config.POND.Y;
								var splashed = state.playedSplash;
								var surface = config.POND.Y - 100;
								var aboveSurface = fishGroup.y < surface;
								if (!splashed && aboveSurface) {
									SoundJS.play("FISHING_SPLASH");
									state.playedSplash = true;
								}
							},
							onFinish: function()
							{
								SoundJS.stop("FISHING_WINDING");
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
					/*endState.callback = function() {
						fishTank.putFishInBasket(fish);
						if (allowClicks) {
							state.catching.capture();
							evm.tell("fishinggame.turnOnClicks");
						}
					};*/
					//animator.animateTo(fishGroups[state.catching].centerOffset, {x:0, y:0}, {duration: 1000} );
					/*console.log("problem...");
					animator.animateTo(fishGroups[state.catching],endState,{duration:{x:1000,y:1000,rotation:1000},onFinish: function() {
						console.log("///problem...");
						fishTank.putFishInBasket(fish);
						if (allowClicks) {
							state.catching.capture();
							evm.tell("fishinggame.turnOnClicks");
						}
					}});*/
					
					Tween.get(fishGroups[state.catching]).to(endState, 1500).call(function(){
						fishTank.putFishInBasket(fish);
						if (allowClicks) {
							state.catching.capture();
							fishTank.turnOnClicks();
						}
						fishTank.noactivity();
					});
					
					Tween.get(fishGroups[state.catching].centerOffset).to({x:0,y:0}, 1500).call(function() {
					});
					animator.animateTo(
						state,
						{ length: 200, pendulum: 0, y: 75 },
						{
							duration: { length: 1000, pendulum: 1000, y: 200 },
							onFrame: function() {},
							onFinish: function() {
								state.state = ROD_STATE.PENDULUM;
							}
						}
					);
					break;
				default: break;
				}

				state.end.x = state.tip.x + state.length * Math.sin(angle);
				state.end.y = state.tip.y + state.length * Math.cos(angle);
				var context = rodLayer.getContext();
				rodLayer.clear();
				context.beginPath();
				context.strokeStyle = "black";
				context.moveTo(config.POND.X, 125);
				context.lineTo(state.tip.x, state.tip.y);
				context.stroke();
				context.closePath();
				context.beginPath();
				context.moveTo(state.tip.x, state.tip.y);
		        context.lineTo(state.end.x, state.end.y);
		        context.strokeStyle = "brown";
		        context.lineWidth = 2;
		        context.stroke();
		        context.closePath();
			},
			
			/**
			 * @param {Fish} fish
			 */
			initCatch: function(fish) {
				state.catching = fish;
				state.state = ROD_STATE.INIT_CATCHING;
			}
		};
	}(rodLayer);

	/**
	 * Animates a fish back to the pond.
	 * @param {Fish} fish
	 */
	var freeFish = function(fish) {
		if (fish.canFree()) {
		Log.debug("Starting to free " + fish, "fish");
		/** @type {Kinetic.Group} */ var group = fishGroups[fish];
			animator.animateTo
			(
				group, { x: 400, y: 0, rotation: Math.PI / 2 },
				{
					duration: { x: 1000, y: 1000, rotation: 1000 },
					onFinish: function()
					{
						SoundJS.play("FISHING_SPLASH");
						group.centerOffset.x = 0;
						group.centerOffset.y = 0;
						animator.animateTo(
							group, { x:fish.getX(), y:fish.getY(), rotation: 0 },
							{
								duration: { x: 1000, y: 1000, rotation: 1000 },
								onFrame: function() {},
								onFinish: function() {
	
								//group.x += fish.getDirection() * fish.getMouthPosition().x;
	
	
									fishTank.removeFishFromBasket(fish);
									fish.free();
								}
							}
						);
					}
				}
			);
		} else {
			//showBig(Strings.get("FISHING_NOT_THIS_ONE").toUpperCase());
			evm.play(Sounds.FISHING_NOT_THIS_ONE);
		}
	};
	
	this.toString = function() { return "Fish View"; };
	
	evm.on("fishinggame.initiatedfish", function(msg){
		createFish(msg.fish);
	}, EVM_TAG);
	
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
		fishGroups[fish].x = Math.round(fish.getX());
		fishGroups[fish].y = Math.round(fish.getY());
	}

	/**
	 * Creates a fish
	 * @param {Fish} fish
	 */
	function createFish(fish) {

		var fishGroup = new Kinetic.Group({
			x: fish.getX(),
			y: fish.getY(),
			width: fish.getScale() * fish.getWidth(),
			height: fish.getScale() * fish.getHeight(),
			centerOffset: { x: 0, y: 0 }
		});
		
		shapeLayer.add(fishGroup);
		
		var image = new Kinetic.Image({
			x: 0,
			y: 0,
			image: images["fish" + fish.getSpecies()],
			width: fish.getScale() * fish.getWidth(),
			height: fish.getScale() * fish.getHeight(),
			centerOffset: {
				x: fish.getScaledWidth() / 2,
				y: fish.getScaledHeight() / 2
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
	 * @param {Kinetic.Layer} layer
	 */
	function createPlant(layer, x, y) {
		var image = new Kinetic.Image({
			x: x+64, y: y+64, image: images["plant"],
			width: 128, height: 128, centerOffset: { x: 64, y: 64 }
		});
		layer.add(image);
		layer.draw();
	};

	/**
	 * Adds a bottom to the pond.
	 * @param {Kinetic.Layer} layer
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

	/**
	 * Initiates the Fishing View
	 * @param viewConfig
	 */
	this.init = function(viewConfig, model) {
		fishTank = model;
    	Log.debug("Building stage...", "view");

		var background = new Kinetic.Rect({
			x: 0,
			y: 2,
			width: stage.width,
			height: stage.height,
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
		var sky = new Kinetic.Image({ x: config.POND.X, y: 20, image: images['sky'] });
		var bambu0 = new Kinetic.Image({ x: config.POND.X-10, y: 20, image: images["bambu"] });
		var bambu1 = new Kinetic.Image({ x: config.POND.X+config.POND.WIDTH-10, y: 20, image: images["bambu"] });
		var bambu2 = new Kinetic.Image({ x: 1024-20, y: 20, image: images["bambu"] });
		var bambu3 = new Kinetic.Image({ x: config.POND.X-10, y: 285, image: images["bambu"] });
		var bambu4 = new Kinetic.Image({ x: config.POND.X+config.POND.WIDTH-10, y: 285, image: images["bambu"] });
		var bambu5 = new Kinetic.Image({ x: 1024-20, y: 285, image: images["bambu"] });
		var bambu6 = new Kinetic.Image({ x: 540, y: 500, rotation: -Math.PI/2, image: images["bambu"] });
		var bambu7 = new Kinetic.Image({ x: config.POND.X-10, y: 760, rotation: -Math.PI/2, image: images["bambu"] });
		var bambu8 = new Kinetic.Image({ x: 540, y: 760, rotation: -Math.PI/2, image: images["bambu"] });
		var bambu9 = new Kinetic.Image({ x: config.POND.X-10, y: 20, rotation: -Math.PI/2, image: images["bambu"] });
		var bambu10 = new Kinetic.Image({ x: 540, y: 20, rotation: -Math.PI/2, image: images["bambu"] });
		backgroundLayer.add(background);
		backgroundLayer.add(sky);
		pondLayer.add(water);
		pondLayer.add(waterSurface);
		overlayLayer.add(waterSurface2);
		//overlayLayer.add(water2);
		createBottom(pondLayer,
					 config.POND.X,
					 config.POND.X + config.POND.WIDTH,
					 config.POND.Y + config.POND.HEIGHT,
					 50,
					 80);
		createPlant(pondLayer, 500, config.POND.Y + config.POND.HEIGHT - 150);
		createPlant(pondLayer, 400, config.POND.Y + config.POND.HEIGHT - 160);
		createPlant(pondLayer, 200, config.POND.Y + config.POND.HEIGHT - 140);
		overlayLayer.add(bambu0);
		overlayLayer.add(bambu1);
		overlayLayer.add(bambu2);
		backgroundLayer.add(bambu6);
		overlayLayer.add(bambu3);
		overlayLayer.add(bambu4);
		overlayLayer.add(bambu5);
		overlayLayer.add(bambu7);
		overlayLayer.add(bambu8);
		overlayLayer.add(bambu9);
		overlayLayer.add(bambu10);
		
		if (fishTank.getMode() == GameMode.MONKEY_SEE) {
			var monkey = new Kinetic.Image({ x: 30, y: stage.height - 200, image: images["monkey"] });
			overlayLayer.add(monkey);
		}
		
		backgroundLayer.draw();
		overlayLayer.draw();
		
		/**
		 * What to do on each frame.
		 * @param msg
		 */
		evm.on("frame", function(msg) {
			var frame = msg.frame;
			fps.showFps(frame); // Update FPS display
			//evm.tell("frame", {frame:frame});
			rod.draw(frame); // Draw the fishing rod
			animator.tick(frame.timeDiff); // Tell the animator about the frame
			if (dynamicOverlayLayer._doDraw || dynamicOverlayLayer._drawOnce) {
				dynamicOverlayLayer.draw();
				dynamicOverlayLayer._drawOnce = false;
			}
			if (overlayLayer._drawOnce) {
				overlayLayer.draw();
				overlayLayer._drawOnce = false;
			}
			fishTank.onFrame(frame);
			Tween.tick(frame.timeDiff, false);
			shapeLayer.draw(); // Draw the shape layer

		}, EVM_TAG);
	};

	/**
	 * FPS counter module
	 */
	var fps = function() {
		var lastFps = 0;
		var context = fpsLayer.getContext();
		context.font = "18pt Arial";
		context.fillStyle = "black";
		return {
		showFps: function(frame) {
			if (lastFps == 0 || frame.time - lastFps > 10) {
				fpsLayer.clear();
				var count = Math.round(1000/frame.timeDiff);
				context.fillText("FPS: " + count, 10, 25);
				lastFps = frame.time;
			}
		}
		};
	}();

	var loadingLayer;
	loadingLayer = new Kinetic.Layer();
	var text = new Kinetic.Text({
    	text: "Vänta...",
    	fontSize: 36,
    	fontFamily: "Arial",
    	textFill: "white",
    	x: stage.width / 2,
    	y: stage.height / 2,
        align: "center"
	});
	loadingLayer.add(text);
	loadingLayer._text = text;

	function loadSounds(model, modelInit) {
		//loadingLayer._text.text = "Hämtar ljud";
		//loadingLayer.draw();
		//Log.debug("Loading sounds...", "view");
		//SoundJS.addBatch(config.SOUND_SOURCES);
		//SoundJS.onLoadQueueComplete = function() {loadImages(model, modelInit);};
		loadImages(model, modelInit);
	}
	
	function loadImages(model, modelInit) {
		loadingLayer._text.text = "Hämtar bilder";
		loadingLayer.draw();
		Log.debug("Loading images...", "view");
		evm.loadImages(config.IMAGE_SOURCES, images, function() {
			loadingLayer._text.text = "";
        	loadingLayer.draw();
        	modelInit.call(model);
		});
	}
	
	function setupLoadingScreen() {	
		stage.add(loadingLayer);
	}
	
	function tearDownLoadingScreen() {
		stage.remove(loadingLayer);
	}
	
	var bigShowing = null;
	
	function showBig(text) {
		if (bigShowing != null) {
			bigShowing.text = text;
			bigShowing.x = stage.width/2;
			bigShowing.y = 150; 
		} else {
			bigShowing = new Kinetic.Text({
				x: stage.width/2,
				y: 150,
				text: text,
				fontSize: 26,
				fontFamily: "Short Stack",
				textFill: "white",
				textStroke: "black",
				align: "center",
				verticalAlign: "middle",
					scale: {x:0,y:0},
				textStrokeWidth: 1
			});
		}
		dynamicOverlayLayer.dynamicAdd(bigShowing);

		Tween.get(bigShowing.scale).to({x:2, y:2}, 1000).wait(3000).call(function() {
			Tween.get(bigShowing.scale).to({x: 1, y: 1}, 1000).call(function() {
			});
			Tween.get(bigShowing).to({y: 50}, 1000).call(function(){
				bigShowing.moveTo(overlayLayer);
				dynamicOverlayLayer.dynamicRemove(bigShowing);
				overlayLayer._drawOnce = true;
			});
		});
	};
	
	this.prepare = function(model, modelInit) {
		setupLoadingScreen();
		Log.debug("Preparing view...", "view");
		loadSounds(model, modelInit);
	};

	this.start = function() {
		tearDownLoadingScreen();
		Log.debug("Start rolling view...", "view");
		showBig(Strings.get("FISHING_CATCH_NUMBER", fishTank.getCatchingNumber()).toUpperCase());
		evm.play(Sounds.FISHING_CATCH);
		setTimeout(function() {
			evm.play(Sounds["NUMBER_" + fishTank.getCatchingNumber()]);
		}, 700);
		evm.tell("fishinggame.started", null);
	};
	
	this.tearDown = function() {
		evm.forget(EVM_TAG);
	};
}
