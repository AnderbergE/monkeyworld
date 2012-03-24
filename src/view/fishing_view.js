/**
 * @constructor
 * @implements {ViewModule}
 * @implements {GameEventListener}
 */
function FishingView(ievm, stage, config_dep) {

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
			/** @const */ "sky": "sky.png"
		},
		
		/** @const */ SOUND_FOLDER: "../res/sound",
		/** @const */ SOUND_SOURCES: {
			/** @const */ winding: "34968__mike-campbell__f-s-1-fishing-reel.wav",
			/** @const */ splash: "water_movement_fast_002.wav",
			/** @const */ swosh: "60009__qubodup__swosh-22.wav"
		},
		
		/** @const */ POND: {
			/** @const */ X: 100,
			/** @const */ Y: 150,
			/** @const */ WIDTH: 625,
			/** @const */ HEIGHT: 600
		}

		};
	}();

	/*
	 * Initiate layers
	 */
	var shapeLayer = new Kinetic.Layer({x: config.POND.X, y: config.POND.Y});
	var rodLayer = new Kinetic.Layer();
	var backgroundLayer = new Kinetic.Layer();
	var overlayLayer = new Kinetic.Layer();
	var pondLayer = new Kinetic.Layer();
	var fpsLayer = new Kinetic.Layer();
	stage.add(backgroundLayer);
	stage.add(pondLayer);
	stage.add(shapeLayer);
	stage.add(rodLayer);
	stage.add(overlayLayer);
	stage.add(fpsLayer);
	
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
					state.playedSplash = false;
					sounds.swosh.play();
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
					var fish = state.catching;
					var fishGroup = fishGroups[state.catching];
					var mouth = fish.getMouthPosition();
					var direction = fish.getDirection();
					fishGroup.centerOffset.y = mouth.y;
					if (direction > 0) {
						fishGroup.centerOffset.x = mouth.x;
					} else {
						fishGroup.x = fishGroup.x - 2*mouth.x;
						fishGroup.centerOffset.x = mouth.x;
					}
					fishGroup.centerOffset.y = mouth.y;
					
					sounds.winding.play();
					
					animator.animateTo
					(
						fishGroup,
						{ rotation: -1 * direction * Math.PI / 2  },
						{
							duration: { rotation: 1000 },
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
								var mouth = fish.getMouthPosition();
								var dir = fish.getDirection();
								fishGroup.x = state.end.x - config.POND.X - mouth.x;
								fishGroup.y = state.end.y - config.POND.Y - dir * mouth.y;
								if (!state.playedSplash && fishGroup.y < config.POND.Y - 100) {
									sounds.splash.play();
									state.playedSplash = true;
								}
							},
							onFinish: function()
							{
								sounds.winding.stop();
								state.state = ROD_STATE.THROW_FISH_IN_BASKET;
							}
						}
					);
					state.state = ROD_STATE.CATCHING;
					break;
				case ROD_STATE.THROW_FISH_IN_BASKET:
					var endState = BASKET_SLOTS[fishTank.getNextBasketSlot()];
					endState.rotation = -2 * Math.PI;
					if (state.catching.getDirection() < 0) {
						endState.x -= 2*state.catching.getMouthPosition().x;
						endState.rotation = 2 * Math.PI;
					}
					animator.animateTo
					(
						fishGroups[state.catching],
						endState,
						{
							duration: { x: 1000, y: 1000, rotation: 1000 },
							onFrame: function() {},
							onFinish: function() { fishTank.putFishInBasket(state.catching); }
						}
					);
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
					state.state = ROD_STATE.CATCHING;
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




	/** @type {Object.<string, Image>} */ 
	var images = {};
	/** @type {Object.<string, SoundObject>} */ 
	var sounds = {};
	/** @type {Object.<Fish, Kinetic.Group>} */ 
	var fishGroups = {};
	/** @type {Object.<Fish, Kinetic.Text>} */
	var numberGroups = {};
	var fishTank = null;
	var animator = new Animator();
 
	/** @const */ var BASKET_SLOTS = {
		/** @const */ 6: { x: 825, y: 0 },
		/** @const */ 4: { x: 700, y: 25 },
		/** @const */ 5: { x: 825, y: 25 },
		/** @const */ 2: { x: 700, y: 153 },
		/** @const */ 3: { x: 825, y: 153 },
		/** @const */ 0: { x: 700, y: 281 },
		/** @const */ 1: { x: 825, y: 281 }
	};
	
	this.toString = function() { return "Fish View"; };
	
	this.notify = function(event) {
		if (event instanceof InitiatedFishEvent) {
			createFish(event.config.fish, event.config.callback);
		} else if (event instanceof FishMovedEvent) {
			moveFish(event.fish);
		} else if (event instanceof FishTurnedLeft) {
			var scale = fishGroups[event.fish].getScale();
			fishGroups[event.fish].setScale(-1 * scale.x, scale.y);
			numberGroups[event.fish].setScale(-1 * event.fish.getScale(), 1*event.fish.getScale());
		} else if (event instanceof FishTurnedRight) {
			var scale = fishGroups[event.fish].getScale();
			fishGroups[event.fish].setScale(-1 * scale.x, scale.y);
			numberGroups[event.fish].setScale(event.fish.getScale()*1, event.fish.getScale()*1);
		}
	};
	
	function moveFish(fish) {
		fishGroups[fish].x = Math.round(fish.getX());
		fishGroups[fish].y = Math.round(fish.getY());
	}
	
	var evm = ievm;
	evm.registerListener(this);



	

	/**
	 * Draws the rod
	 * @param {Kinetic.Layer} rodLayer The layer on which the rod should be
	 *                                 drawn.
	 */
	function drawRod(rodLayer, frame) {
		
	}

	/**
	 * Creates a fish
	 * @param {Fish} fish
	 * @param {Function} callback Function supposed to be called when the fish
	 *                            is clicked.
	 */
	function createFish(fish, callback) {

		var fishGroup = new Kinetic.Group({
			x: fish.getX(),
			y: fish.getY(),
			width: fish.getScale() * fish.getWidth(),
			height: fish.getScale() * fish.getHeight()
		});
		
		shapeLayer.add(fishGroup);
		
		var image = new Kinetic.Image({
			x: - fish.getScaledWidth() / 2,
			y: - fish.getScaledHeight() / 2,
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
			fontFamily: "Comic Sans MS",
			textFill: "white",
			align: "center",
			verticalAlign: "middle",
			textStroke: "#444"
		});
		fishGroup.add(numberText);
		numberText.setScale(fish.getScale());

		var mouseDownAndTouchStartFunction = function() {
			console.log("FISH: Starting to catch " + fish);
//			catching = fish;
			//state = ROD_STATE.INIT_CATCHING;
			rod.initCatch(fish);
			callback.call(fish);
		};
		fishGroup.on("mousedown", mouseDownAndTouchStartFunction);
		fishGroup.on("touchstart", mouseDownAndTouchStartFunction);

		fishGroups[fish] = fishGroup;
		numberGroups[fish] = numberText;
	};

	/**
	 * Adds a plant to the specified layer.
	 * @param {Kinetic.Layer} layer
	 */
	function createPlant(layer, x, y) {
		var image = new Kinetic.Image({
			x: x, y: y, image: images["plant"],
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
    	evm.log('VIEW: Building stage...');

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
		//backgroundLayer.add(sky);
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
		
		backgroundLayer.draw();
		overlayLayer.draw();
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
			if (lastFps == 0 || frame.time - lastFps > 500) {
				fpsLayer.clear();
				var count = Math.round(1000/frame.timeDiff);
				context.fillText("FPS: " + count, 10, 25);
				lastFps = frame.time;
			}
		}
		};
	}();

	/**
	 * What to do on each frame.
	 * @param frame
	 */
	function onFrame(frame) {
		fps.showFps(frame); // Update FPS display
		evm.post(new FrameEvent(frame)); // Post an event about this frame
		rod.draw(frame); // Draw the fishing rod
		animator.tick(frame.timeDiff); // Tell the animator about the frame
		shapeLayer.draw(); // Draw the shape layer
	}

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
		loadingLayer._text.text = "Hämtar ljud";
		loadingLayer.draw();
		evm.log("VIEW: Loading sounds...");
		var loadedSounds = 0;
		var numSounds = Object.size(config.SOUND_SOURCES);
		for (var source in config.SOUND_SOURCES) {
			var sound = soundManager.createSound({
				id: source,
				url: config.SOUND_FOLDER + "/" + config.SOUND_SOURCES[source],
				autoLoad: true,
				autoPlay: false,
				onload: function(success) {
					if (success && ++loadedSounds == numSounds) {
						loadImages(model, modelInit);
						loadingLayer._text.text = "";
	                }
				}
			});
			sounds[source] = sound;
		}
	}

	function loadImages(model, modelInit) {
		loadingLayer._text.text = "Hämtar bilder";
		loadingLayer.draw();
		evm.log("VIEW: Loading images...");
		var loadedImages = 0;
		var numImages = Object.size(config.IMAGE_SOURCES);
		for (var src in config.IMAGE_SOURCES) {
            images[src] = new Image();
            images[src].onload = function(){
                if (++loadedImages >= numImages) {
                	loadingLayer._text.text = "";
                	loadingLayer.draw();
                	modelInit.call(model);
                }
            };
            images[src].src = config.IMAGE_FOLDER + "/" + config.IMAGE_SOURCES[src];
        }
		console.log(images);
	}
	
	function setupLoadingScreen() {	
		stage.add(loadingLayer);
	}
	
	function tearDownLoadingScreen() {
		stage.remove(loadingLayer);
	}
	
	this.prepare = function(model, modelInit) {
		setupLoadingScreen();
		evm.log('VIEW: Preparing view...');
		loadSounds(model, modelInit);
	};

	this.start = function() {
		tearDownLoadingScreen();
		evm.log('VIEW: Start rolling view...');
		stage.onFrame(onFrame);
		stage.start();
	};
}
