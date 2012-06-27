/**
 * @constructor
 * 
 * @extends {GameView}
 * @param {FishingGame} fishingGame
 */
function FishingView(fishingGame) {
	GameView.call(this);
	this.tag("FishingView");
	var that = this;
	var game = that.game;
	var stage = that.stage;
	/** @const @type {string}                */ var EVM_TAG = "FishingView";
	/** @type {Object.<Fish, Kinetic.Group>} */ var fishGroups = {};
	/** @type {Object.<Fish, Kinetic.Text>}  */ var numberGroups = {};
	/** @type {Animator}                     */ var animator = new Animator();
	/** @type {FishingRod}                   */ var fishingRod = null;
	/** @type {boolean}                      */ var allowClicks = true;
	/** @type {BubbleGenerator}              */ var bubbleGenerator = null;
	/** @type {WaveGenerator}                */ var waveGenerator1 = null;
	/** @type {WaveGenerator}                */ var waveGenerator2 = null;
	/** @type {WaveGenerator}                */ var waveGenerator3 = null;
	//var evm = this.evm;
	
	/**
	 * Configuration of the view
	 */
	var config = function() {
		return {
		
		/** @const */ SKY: {
			/** @const */ Y: 50
		},
		
		/** @const */ POND: {
			/** @const */ X: 285/1024 * stage.getWidth(),
			/** @const */ Y: 150/768 * stage.getHeight(),
			/** @const */ WIDTH: 400 / 1024 * stage.getWidth(),
			/** @const */ HEIGHT: 580 / 768 * stage.getHeight(),
			/** @const */ COLOR_DARK: "#598FD9",
			/** @const */ COLOR_LIGHT: "#8ED6FF",
			/** @const */ GRADIENT_RADIUS_INNER: 30 * stage._mwunit,
			/** @const */ GRADIENT_RADIUS_OUTER: 400 * stage._mwunit
		},
		
		/** @const */ BASKET: {
			/** @const */ X: 710/1024  * stage.getWidth(),
			/** @const */ Y: 50/768  * stage.getHeight(),
			/** @const */ WIDTH: 270/1024 * stage.getWidth(),
			/** @const */ HEIGHT: 400/768 * stage.getHeight()
		}

		};
	}();
	var ROLL_DIFF = -240 * stage._mwunit;
	var BASKET_SLOTS = {};
	var basketGrid = Utils.gridizer(
		config.BASKET.X + 64/1024 * stage.getWidth(), config.BASKET.Y + config.BASKET.HEIGHT - 64/768 * stage.getHeight(),
		125/1024 * stage.getWidth(), -128/768 * stage.getHeight(), 2
	);
	for (var i = 0; i < 8; i++) {
		BASKET_SLOTS[i] = basketGrid.next();
	}

	var fishCountingView = new FishCountingView(this, stage, that.game, fishingGame, EVM_TAG);
	
	/*
	 * Initiate layers
	 */
	var shapeLayer = new Kinetic.Layer();
	var backgroundLayer = new Kinetic.Layer();
	var outGroup = new Kinetic.Group({
		x: 0, y:0
	});
	
	var basket = null;
	var pondLayer = backgroundLayer;
	stage.add(backgroundLayer);
	stage.add(pondLayer);
	stage.add(shapeLayer);
	
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
		basket.moveTo(shapeLayer);
		var offset = config.POND.WIDTH + config.POND.X + 300 * stage._mwunit;
		shapeLayer.attrs.centerOffset = {x: offset, y: 0};
		shapeLayer.attrs.x = offset;
		basket.moveToBottom();
		outGroup.moveToBottom();
		backgroundLayer.draw();
		that.getTween(shapeLayer.attrs.scale).to({x:0}, 2000).call(function(){
			shapeLayer.attrs.centerOffset.x = 0;
			shapeLayer.attrs.x = ROLL_DIFF;
			/* ============================================================== */
			/*   Firefox zero scale bug work-around                           */
			/*   https://bugzilla.mozilla.org/show_bug.cgi?id=661452          */
			/*   Added 2012-04-12 by <bjorn.norrliden@gmail.com>              */
			/* ============================================================== */
			shapeLayer.attrs.scale.x = 0.1;
			/* ============================================================== */
			that.getTween(shapeLayer.attrs.scale).to({x:1}, 2000).call(function() {
				outGroup.moveTo(backgroundLayer);
				outGroup.attrs.x = ROLL_DIFF;
				backgroundLayer.draw();
			});
			
		});
		//basket.moveTo(stage._gameLayer);
		//backgroundLayer.draw();
//		Tween.get(basket.attrs).to({x: basket.attrs.x - ROLL_DIFF}, 2000).call(function() {
//			basket.moveTo(backgroundLayer);
//			backgroundLayer.draw();
//		});
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
		fishingGame.activity();
		if (allowClicks) {
			if (!fish.isCaptured()) {
				Log.debug("Starting to catch " + fish, "fish");
				fishingGame.catchFish(fish, function() {});
			} else {
				fishingGame.freeFish(fish, function() {});
				fishingGame.noactivity();
			}
		}
	};
	
	var tearedDownView = false;
	var tearDownView = function() {
		if (tearedDownView) return;
		tearedDownView = true;
		Log.debug("Tearing down FishingView's layers", "view");
		stage.remove(backgroundLayer);
		stage.remove(shapeLayer);
		stage.remove(pondLayer);
	};
	
	var catchingDone = function(callback) {
		that.off("frame");
		bubbleGenerator.stop();
		waveGenerator1.stop();
		waveGenerator2.stop();
		waveGenerator3.stop();
		tearDownView();
		fishCountingView.init(fishingGame, fishGroups);
		callback();
	};

	this.on("Game.stopMiniGame", function(msg) {
		tearDownView();
		fishCountingView.tearDown();
		forget();
	});
	
	this.on("FishingGame.catch", function(msg) {
		fishingRod.catchFish(msg.fish, msg.done, msg.hooked);
	});
	
	this.on("FishingGame.free", function(msg) {
		freeFish(msg.fish, msg.done);
	});
	
	this.on("fishinggame.turnOnClick", function(msg) {
		turnOnClick(msg.fish);
	});
	
	this.on("fishinggame.turnOffClick", function(msg) {
		turnOffClick(msg.fish);
	});
	
	this.on("fishinggame.allowClicks", function(msg) {
		allowClicks = true;
	});
	
	this.on("fishinggame.disallowClicks", function(msg) {
		allowClicks = false;
	});
	
	this.on("FishingGame.freeWrongOnes", function(msg) {
		that.showBig(Strings.get("FISHING_FREE_WRONG_ONES").toUpperCase());
		MW.Sound.play(MW.Sounds.FISHING_FREE_WRONG_ONES);
	});
	
	this.on("FishingGame.catchingDone", function(msg) {
		allowClicks = false;
		that.showBig(Strings.get("YAY").toUpperCase());
		MW.Sound.play(MW.Sounds.YAY);
		this.setTimeout(function() {
			catchingDone(msg.callback);
		}, 2000);
	});
	
	/**
	 * @constructor
	 * @param {number} height
	 * @param {string} darkColor
	 * @param {string} lightColor
	 * @param {number} velocity
	 * @param {number} dy
	 */
	function WaveGenerator(height, darkColor, lightColor, velocity, dy) {
	
		var waveGroup = new Kinetic.Group({x:config.POND.X, y:config.POND.Y});
		shapeLayer.add(waveGroup);
		
		var startPosX = -stage._mwunit * 60;
		var startPosY = stage._mwunit * 20;
		var defaultInterval = 4000 * stage._mwunit;
		
		var defaultS = config.POND.WIDTH;
		
		var init = function() {
			for (var i = startPosX; i < defaultS; i+= velocity * defaultInterval / 1000 * 2) {
				createWave(i, velocity);
			}
		};
		
		var createWave = function(startPosX, velocity) {
			var s = defaultS - startPosX;
			var wave = new Kinetic.Wave({wx: startPosX, wy: startPosY + dy, height: height, darkColor: darkColor, lightColor: lightColor});
			waveGroup.add(wave);
			that.getTween(wave.attrs).to({wx: config.POND.WIDTH}, s / velocity * 1000).call(function() {
				waveGroup.remove(wave);
			});
		};
		
		this.start = function() {
			init();
			this._interval = setInterval(function() {
				createWave(startPosX, velocity);
			}, defaultInterval);
		};
		
		this.stop = function() {
			clearInterval(this._interval);
		};
		
	};
	
	/**
	 * @constructor
	 * @param {Object} cfg
	 * @extends {Kinetic.Shape}
	 */
	Kinetic.Wave = function(cfg) {
		var wave = new Kinetic.Shape(cfg);
		var height = cfg.height;
		var width = 50 * stage._mwunit;
		
		wave.drawFunc = function() {
			var context = this.getContext();
			
			context.beginPath();
			context.moveTo(0, -20 * stage._mwunit);
			context.lineTo(config.POND.WIDTH, -20 * stage._mwunit);
			context.lineTo(config.POND.WIDTH, 20 * stage._mwunit);
			context.lineTo(0, 20 * stage._mwunit);
			context.clip();
			
            context.beginPath();
            context.moveTo(wave.attrs.wx, wave.attrs.wy);
            context.lineTo(wave.attrs.wx + width, wave.attrs.wy);
            context.quadraticCurveTo(
            	Math.floor(wave.attrs.wx + width * 0.5),
            	Math.floor(wave.attrs.wy - height * 0.5),
            	Math.floor(wave.attrs.wx + width * 0.75),
            	Math.floor(wave.attrs.wy - height)
            );
            context.quadraticCurveTo(
        		Math.floor(wave.attrs.wx + width * 0.5),
				Math.floor(wave.attrs.wy - height * 0.5),
				Math.floor(wave.attrs.wx),
				Math.floor(wave.attrs.wy)
            );
            var grd = context.createRadialGradient(
            	config.POND.WIDTH / 2, 0, config.POND.GRADIENT_RADIUS_INNER,
            	config.POND.WIDTH / 2, 0, config.POND.GRADIENT_RADIUS_OUTER
            );
            grd.addColorStop(1, wave.attrs.darkColor); // dark blue
            grd.addColorStop(0, wave.attrs.lightColor); // light blue
            context.fillStyle = grd;
            context.fill();
            context.closePath();
		};
        //wave.stroke = "black";
        wave.strokeWidth = 4;
		
		return wave;
	};
	
	/**
	 * @constructor
	 * The config should contain:
	 *  {number} x
	 *  {number} y
	 *  {number} radius
	 * @param {Object} config
	 * @extends {Kinetic.Shape}
	 */
	Kinetic.Bubble = function(config) {
		config.glow = {};
		config.glow.x = config.radius / 2;
		config.glow.y = -config.radius / 2;
		config.glow.radius = config.radius / 3;
		
		var bubble = new Kinetic.Shape(config);
		
		
		bubble.drawFunc = function() {
			var context = this.getContext();
			
			
	        var grd = context.createRadialGradient(
	        	bubble.attrs.x,
	        	bubble.attrs.y,
	        	bubble.attrs.radius / 2,
	        	bubble.attrs.x,
	        	bubble.attrs.y,
	        	bubble.attrs.radius
	        );
	        
	        var grdGlow = context.createRadialGradient(
	        	bubble.attrs.x + bubble.attrs.glow.x,
	        	bubble.attrs.y + bubble.attrs.glow.y,
	        	bubble.attrs.glow.radius / 5,
	        	bubble.attrs.x + bubble.attrs.glow.x,
	        	bubble.attrs.y + bubble.attrs.glow.y,
	        	bubble.attrs.glow.radius
	        );
			
		    context.beginPath();
		    context.arc(Math.floor(bubble.attrs.x), Math.floor(bubble.attrs.y), bubble.attrs.radius, 0, 2 * Math.PI, false);
		    grd.addColorStop(0, "rgba(255,255,255,0)"); // dark blue
		    grd.addColorStop(1, "rgba(255,255,255,1)"); // light blue
            context.fillStyle = grd;
		    context.fill();
		    
		    context.beginPath();
		    context.arc(Math.floor(bubble.attrs.x), Math.floor(bubble.attrs.y), bubble.attrs.radius, 0, 2 * Math.PI, false);
		    grdGlow.addColorStop(0, "white"); // dark blue
		    grdGlow.addColorStop(1, "rgba(255,255,255,0)"); // light blue
            context.fillStyle = grdGlow;
		    context.fill();
		    context.closePath();
		    context.beginPath();
	        var x = bubble.attrs.x;
	        var y = bubble.attrs.y;
	        var radius = bubble.attrs.radius * 0.65;
	        var startAngle = Math.PI / 2;
	        var endAngle = Math.PI;
	        var counterClockwise = false;

	        context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
	        context.lineWidth = 2;
	        // line color
	        context.strokeStyle = "rgba(255,255,255,0.5)";
	        context.stroke();
		    //context.lineWidth = "1pt";
		    //context.strokeStyle = "black";
		    //context.stroke();
		};
		return bubble;
	};
	
	/**
	 * @constructor
	 */
	function BubbleGenerator() {
		var createBubble = function() {
			
			var radius = Utils.getRandomInt(3 * stage._mwunit, 6 * stage._mwunit);
			var x = Utils.getRandomInt(150 * stage._mwunit, 330 * stage._mwunit);
			var y = Utils.getRandomInt(350 * stage._mwunit, 360 * stage._mwunit);
			var time = Utils.getRandomInt(20000, 50000); 
			var bubble = new Kinetic.Bubble({
				x: x,
				y: y,
				radius: radius
			});
			that.getTween(bubble.attrs).to({y: (360 * stage._mwunit - y) + 80 * stage._mwunit}, time).call(function() {
				destroyBubble(bubble);
			});
			shapeLayer.add(bubble);
		};
		
		var destroyBubble = function(bubble) {
			shapeLayer.remove(bubble);
		};
		
		this.start = function() {
			this._interval = setInterval(createBubble, 3000);
		};
		
		this.stop = function() {
			clearInterval(this._interval);
		};
	}
	
	/**
	 * @constructor
	 * @param {Object} config
	 * @extends {Kinetic.Shape}
	 */
	Kinetic.Rod = function(config) {
		
		var line = new Kinetic.Shape(config);
		var dx = Math.floor(-5/1024 * stage.getWidth());
		var dy = Math.floor(7/768*stage.getHeight());
		var fontSize = 0.018 * stage.getWidth();
		var radius = 15/1024 * stage.getWidth();
		
		line.drawFunc = function() {
			line.attrs.x3 = line.attrs.x2 + line.attrs.length * Math.sin(line.attrs.angle);
			line.attrs.y3 = line.attrs.y2 + line.attrs.length * Math.cos(line.attrs.angle);
			
			var context = this.getContext();

			var cpx = (line.attrs.x2 + line.attrs.x1) / 2 - stage._mwunit * 20;
			var cpy = line.attrs.y2 - stage._mwunit * 10;			

			var mpx = (line.attrs.x1 + cpx) / 2;
			var mpy = (line.attrs.y1 + cpy) / 2 - 5 * stage._mwunit;
			
			var bezier = Utils.bezier(
				0.5,
				{ x: line.attrs.x1, y: line.attrs.y1 },
				{ x: mpx, y: mpy },
				{ x: cpx, y: cpy },
				{ x: line.attrs.x2, y: line.attrs.y2 }
			);
			
			context.beginPath();
			context.strokeStyle = "brown";
			context.moveTo(line.attrs.x1, line.attrs.y1);
			context.lineTo(bezier.x, bezier.y);
			context.lineTo(line.attrs.x2, line.attrs.y2);
			context.lineWidth = line.attrs.strokeWidth / 2;
			this.stroke();
			context.beginPath();
			context.moveTo(line.attrs.x2, line.attrs.y2);
			context.strokeStyle = "brown";			
			context.lineTo(line.attrs.x3, line.attrs.y3 - radius - radius * 0.2);
			this.stroke();
			
			context.beginPath();
			context.strokeStyle = "black";
			context.moveTo(line.attrs.x1, line.attrs.y1);

			context.bezierCurveTo(mpx, mpy, cpx, cpy, line.attrs.x2, line.attrs.y2);
			context.lineWidth = line.attrs.strokeWidth;
			this.stroke();

			
			context.beginPath();
		    context.arc(Math.floor(line.attrs.x3), Math.floor(line.attrs.y3) - radius*0.95, radius * 0.2, Math.PI, 0, false);
			context.lineWidth = 2;
	        context.strokeStyle = "black";
	        this.stroke();
			
			
            var grd = context.createRadialGradient(
            	line.attrs.x3 + radius * 0.5,
            	line.attrs.y3 - radius * 0.5,
            	radius*0.1,
            	line.attrs.x3,
            	line.attrs.y3,
            	radius
            );
            grd.addColorStop(0, "#ff6666");
            grd.addColorStop(0.5, "#ff0000");
            grd.addColorStop(1, "#cc0000");
			
		    context.beginPath();
		    context.arc(Math.floor(line.attrs.x3), Math.floor(line.attrs.y3), radius, 0, 2 * Math.PI, false);
		    context.fillStyle = grd;
		    context.fill();
		    context.lineWidth = line.attrs.strokeWidth * 0.5;
		    context.strokeStyle = "#aa0000";
		    context.stroke();
		    context.font = fontSize +"px Arial";
		    context.fillStyle = "white";
		    this.fillText(fishingGame.getTargetNumber(), Math.floor(line.attrs.x3 + dx), Math.floor(line.attrs.y3 + dy));
		};
		return line;
	};
	
	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {number} length
	 * @constructor
	 */
	function FishingRod(x1, y1, x2, y2, length, angle) {
		
		var playedSplash = false;
		var pendulumDirection = 1;
		var speed = 0.0001;
		var maxAngle = Math.PI / 30;
		
		var rod = new Kinetic.Rod({
			strokeWidth: 2 * stage._mwunit,
			x1: x1, x2: x2, y1: y1, y2: y2, length: length, angle: angle
		});

		shapeLayer.add(rod);
		
		function getGoalAngle(fish) {
			var front = getFishFront(fish);
			var rx = rod.attrs.x2;
			var ry = rod.attrs.y2;
			var dx = (rx - front.x);
			var dy = (ry - front.y);
			return Math.atan(dx/dy);
		}

		function getFishFront(fish) {
			var dir = fish.getDirection();
			var pos = translateFish(fish);
			var obj = new Object();
			obj.x = pos.x + dir * fish.getMouthPosition().x*config.POND.WIDTH;
			obj.y = pos.y + dir * fish.getMouthPosition().y*config.POND.HEIGHT;
			return obj;
		}
		
		var startPendulum = function() {
			that.on("frame", function(msg) {
				var frame = msg.frame;
				var timeDiff = frame.timeDiff;
				
				rod.attrs.angle += pendulumDirection * speed * timeDiff;
				if (rod.attrs.angle >= maxAngle) {
					pendulumDirection *= -1;
					rod.attrs.angle = maxAngle;
				} else if (rod.attrs.angle <= -maxAngle) {
					pendulumDirection *= -1; 
					rod.attrs.angle = -maxAngle;
				}
			}, EVM_TAG + "_ROD");
		};
		startPendulum();
		
		/**
		 * @param {Fish} fish
		 * @param {Function} done
		 */
		this.catchFish = function(fish, done, hooked) {
			that.off("frame", EVM_TAG + "_ROD");
			if (allowClicks) {
				fishingGame.turnOffClicks();
			}
			playedSplash = false;
			MW.Sound.play(MW.Sounds.FISHING_SWOSH);
			var angle = getGoalAngle(fish);
			var front = getFishFront(fish);
			
			var distance = Math.sqrt(Math.pow(rod.attrs.x2 - front.x, 2)+
					             Math.pow(rod.attrs.y2 - front.y, 2));
			
			animator.animateTo
			(
				rod.attrs,
				{ angle: angle, length: distance },
				{
					duration: { length: 500, angle: 500 },
					onFrame: function()
					{
						angle = getGoalAngle(fish);
						var front = getFishFront(fish);
						var distance = Math.sqrt(Math.pow(rod.attrs.x2 - front.x, 2)+
								             Math.pow(rod.attrs.y2 - front.y, 2));
						animator.updateEndState(rod.attrs, { angle: angle, length: distance });
					},
					onFinish: function()
					{
						hooked(fish);
						windInFish(fish, done);
					}
				}
			);
		};

		/**
		 * @param {Fish} fish
		 * @param {Function} done
		 */
		var windInFish = function(fish, done) {
			var fishGroup = fishGroups[fish];
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
			
			MW.Sound.play(MW.Sounds.FISHING_WINDING);
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
				rod.attrs,
				{ y2: config.POND.Y-90 * stage._mwunit, length: 20 * stage._mwunit },
				{
					speed: { y2: 0.4 * stage._mwunit, length: 0.5 * stage._mwunit },
					onFrame: function()
					{
						var fishGroup = fishGroups[fish];
						fishGroup.attrs.x = rod.attrs.x3;
						fishGroup.attrs.y = rod.attrs.y3;
						var splashed = playedSplash;
						var surface = config.POND.Y;
						var aboveSurface = fishGroup.attrs.y < surface;
						if (!splashed && aboveSurface) {
							MW.Sound.play(MW.Sounds.FISHING_SPLASH);
							playedSplash = true;
						}
					},
					onFinish: function()
					{
						MW.Sound.stop(MW.Sounds.FISHING_WINDING);
						throwFishInBasket(fish, done);
					}
				}
			);
		};
		
		/**
		 * @param {Fish} fish
		 * @param {Function} done
		 */
		var throwFishInBasket = function(fish, done) {
			var endState = BASKET_SLOTS[fishingGame.getNextBasketSlot()];
			var fishDirection = fish.getDirection();
			endState.rotation = fishDirection * 2 * Math.PI;
			
			that.getTween(fishGroups[fish].attrs).to(endState, 1500).call(function(){
				//fishingGame.putFishInBasket(fish);

				fishingGame.noactivity();
			});
			
			that.getTween(fishGroups[fish].attrs.centerOffset).to({x:0,y:0}, 1500);
			
			animator.animateTo(
				rod.attrs,
				{ length: length, angle: 0, y2: y2 },
				{
					duration: { length: 1000, angle: 1000, y2: 200 },
					onFrame: function() {},
					onFinish: function() {
						done();
						startPendulum();
						if (allowClicks) {
							fishingGame.turnOnClicks();
						}
					}
				}
			);
		};
	
	}
	
	/**
	 * Animates a fish back to the pond.
	 * @param {Fish} fish
	 */
	var freeFish = function(fish, done) {
		if (fish.canFree()) {
			Log.debug("Starting to free " + fish, "fish");
			if (allowClicks) {
				fishingGame.turnOffClicks();
			}
			/** @type {Kinetic.Group} */ var group = fishGroups[fish];
			animator.animateTo
			(
				group.attrs, { x: config.POND.X + config.POND.WIDTH/2, y: config.POND.Y, rotation: Math.PI / 2 },
				{
					duration: { x: 1000, y: 1000, rotation: 1000 },
					onFinish: function()
					{
						MW.Sound.play(MW.Sounds.FISHING_SPLASH);
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
									if (allowClicks) {
										fishingGame.turnOnClicks();
									}
								}
							}
						);
					}
				}
			);
		} else {
			MW.Sound.play(MW.Sounds.FISHING_NOT_THIS_ONE);
		}
	};
	
	this.toString = function() { return "Fish View"; };
	
	this.on("fishinggame.fishmoved", function(msg) {
		moveFish(msg.fish);
	});
	
	this.on("fishinggame.fishturnedleft", function(msg) {
		var scale = fishGroups[msg.fish].getScale();
		fishGroups[msg.fish].setScale(-1 * scale.x, scale.y);
		numberGroups[msg.fish].setScale(-1 * msg.fish.getScale(), 1*msg.fish.getScale());
	});
	
	this.on("fishinggame.fishturnedright", function(msg) {
		var scale = fishGroups[msg.fish].getScale();
		fishGroups[msg.fish].setScale(-1 * scale.x, scale.y);
		numberGroups[msg.fish].setScale(msg.fish.getScale()*1, msg.fish.getScale()*1);
	});
	
	this.on("FishingGame.inactivity", function(msg) {
		MW.Sound.play(msg.sound);
	});
	
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
		
		var getFishImage = function(num) {
//			switch(num) {
////			case 0: return MW.Images.FISH0; break;
////			case 1: return MW.Images.FISH1; break;
////			case 2: return MW.Images.FISH2; break;
////			case 3: return MW.Images.FISH3; break;
////			case 4: return MW.Images.FISH4; break;
////			case 5: return MW.Images.FISH5; break;
////			case 6: return MW.Images.FISH6; break;
//			}
			return 0;
		};
		
		var image = new Kinetic.Image({
			x: 0,
			y: 0,
			image: getFishImage(fish.getSpecies),
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
			text: fish.getTargetNumber(),
			fontSize: 48/1024*stage.getWidth(),
			fontFamily: "Gloria Hallelujah",
			textFill: "white",
			align: "center",
			verticalAlign: "middle",
			textStroke: "#444",
			textStrokeWidth: 2/1024*stage.getWidth()
		});
		/*
		var mouth = new Kinetic.Circle({
			x: fish.getMouthPosition().x * stage.getWidth() / 2,
			y: fish.getMouthPosition().y * stage.getHeight() / 2,
			radius: 10,
			fill: "red"
		});
		fishGroup.add(mouth);
		*/
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
			x: x+64, y: y+64,
//			image: MW.Images.PLANT,
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
				this.fill();
			},
			fill: "#EED6AF"
		});
		layer.add(triangle);
	};
	
	this.on("Game.initiate", function(msg) {
		init();
	});
	
	var init = function() {
		
		waveGenerator2 = new WaveGenerator(30 * stage._mwunit, "#3333ff", "#aaaaff", 4, -2 * stage._mwunit);
		waveGenerator3 = new WaveGenerator(20 * stage._mwunit, "blue", "white", 6, -2 * stage._mwunit);
		waveGenerator1 = new WaveGenerator(15 * stage._mwunit, config.POND.COLOR_DARK, config.POND.COLOR_LIGHT, 8, -1 * stage._mwunit);
		
		var fishArray = fishingGame.getAllFish();
		for (var i = 0; i < fishArray.length; i++) {
			createFish(fishArray[i]);
		}

		that.setStaticLayer(backgroundLayer);
		that.basicInit(that.game);
		
    	Log.debug("Building stage...", "view");

		var water = new Kinetic.Shape({
          drawFunc: function() {
            var context = this.getContext();
            context.beginPath();
            context.moveTo(config.POND.X, config.POND.Y + 17 * stage._mwunit);
            context.lineTo(config.POND.X + config.POND.WIDTH, config.POND.Y + 17 * stage._mwunit);
            context.lineTo(config.POND.X + config.POND.WIDTH, config.POND.Y + config.POND.HEIGHT);
            context.lineTo(config.POND.X, config.POND.Y + config.POND.HEIGHT);
            
            var grd = context.createRadialGradient(
            	config.POND.X + config.POND.WIDTH / 2, config.POND.Y, config.POND.GRADIENT_RADIUS_INNER,
            	config.POND.X + config.POND.WIDTH / 2, config.POND.Y, config.POND.GRADIENT_RADIUS_OUTER
            );
            grd.addColorStop(1, config.POND.COLOR_DARK); // dark blue
            grd.addColorStop(0, config.POND.COLOR_LIGHT); // light blue
            context.fillStyle = grd;
            context.fill();
            
            context.closePath();
            this.fill();
          }
        });

//		MW.Images.SKY.style.width = 300*stage._mwunit + "px";

		basket = new Kinetic.Image({ x: config.BASKET.X, y: config.BASKET.Y, width: config.BASKET.WIDTH, height: config.BASKET.HEIGHT/*, image: MW.Images.BASKET*/ });
		var sky = new Kinetic.Image({
			x: config.POND.X,
			y: config.SKY.Y * stage._mwunit,
			width: config.POND.WIDTH
//			image: MW.Images.SKY
		});

		outGroup.add(sky);
		backgroundLayer.add(basket);
		
		outGroup.add(water);

		createBottom(outGroup,
				 config.POND.X,
				 config.POND.X + config.POND.WIDTH,
				 config.POND.Y + config.POND.HEIGHT,
				 50,
				 80);

		createPlant(outGroup, config.POND.X + 20, config.POND.Y + config.POND.HEIGHT - 150);
		createPlant(outGroup, config.POND.X + 100, config.POND.Y + config.POND.HEIGHT - 160);
		createPlant(outGroup, config.POND.X + config.POND.WIDTH - 130, config.POND.Y + config.POND.HEIGHT - 140);
		
		if (game.modeIsAgentDo() && that.game.getRound() > 1) {
			basket.attrs.x += ROLL_DIFF;
			outGroup.attrs.x += ROLL_DIFF;
			shapeLayer.attrs.x += ROLL_DIFF;
		}
		
		fishingRod = new FishingRod(
			config.POND.X,
			config.POND.Y - config.SKY.Y * stage._mwunit / 2,
			config.POND.X + config.POND.WIDTH / 2,
			config.POND.Y - config.SKY.Y * stage._mwunit,
			300/768 * stage.getHeight(),
			0
		);
		
		bubbleGenerator = new BubbleGenerator();
		bubbleGenerator.start();
		waveGenerator1.start();
		waveGenerator2.start();
		waveGenerator3.start();
		
		backgroundLayer.add(outGroup);
		backgroundLayer.draw();

		/**
		 * What to do on each frame.
		 * @param msg
		 */
		that.on("frame", function(msg) {
			var frame = msg.frame;
			animator.tick(frame.timeDiff); // Tell the animator about the frame
			shapeLayer.draw(); // Draw the shape layer
		});
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
	
	this.on("Game.roundDone", function(msg) {
		Log.debug("Tearing down view", "view");
		fishCountingView.tearDown();
		forget();
	});
	
	var forget = function() {
		that.forget(EVM_TAG + "_ROD");
		that.forget();
	};
	
	this.on("Game.start", function(msg) {
		Log.debug("Start rolling view...", "view");
		if (game.modeIsAgentDo() && that.game.getRound() === 1) {
			that.showBig(Strings.get("MONKEYS_TURN").toUpperCase());
			MW.Sound.play(MW.Sounds.NOW_MONKEY_SHOW_YOU);
			that.setTimeout(function() {
				that.moveToMonkey(startGame);
				switchToMonkey();
			}, 3000);
		} else {
			startGame();
		}
	});
	
	var startGame = function() {
		that.showBig(Strings.get("FISHING_CATCH_NUMBER", fishingGame.getTargetNumber()).toUpperCase());
		MW.Sound.play(MW.Sounds.FISHING_CATCH);
		that.setTimeout(function() {
			Log.debug("Ready to play", "view");
			MW.Sound.play(MW.Sounds["NUMBER_" + fishingGame.getTargetNumber()]);
			that.evm.tell("FishingGame.started", null);
		}, 700);
	};
	
}
inherit(FishingView, GameView);
//FishingView.prototype = new GameView();