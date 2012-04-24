/**
 * View for illustrating general game events, such as banana retrievement and
 * system confirmation.
 * 
 * @constructor
 * @implements {ViewModule}
 * @param {EventManager} evm
 * @param {GameState} gameState
 */
function GeneralGameView(evm, stage, gameState) {
	
	var EVM_TAG = "GeneralGameView";
	var layer = stage._gameLayer;
	
	var bananas = new Array();
	
	this.init = function() {
		Log.debug("GeneralGameView kicking in", "GGV");
	};
	
	this.tearDown = function() {
		evm.forget(EVM_TAG);
	};
	
	var systemConfirmation = function(happy, callback) {
		Log.debug("Game.showSystemConfirmation", "GGV");
		if (happy) {
			evm.play(Sounds.MONKEY_LEARNED_WELL);
		} else {
			evm.play(Sounds.MONKEY_DIDNT_LEARN_WELL);
			if (!gameState.lastDoRound()) {
				setTimeout(function() {
					evm.play(Sounds.LETS_SHOW_HIM_AGAIN);
				}, 1000);
			}
		}
		var faceImg = happy ? images['happy-face'] : images['sad-face'];
		var face = new Kinetic.Image({
			image: faceImg,
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			centerOffset: { x: faceImg.width / 2, y: faceImg.height / 2 }
		});
		layer.add(face);
		setTimeout(function() {
			layer.remove(face);
			callback();
		}, 4000);
	};
	
	evm.on("Game.introduceBubba", function(msg) {
		var bubba = new Kinetic.Image({
			image: images['rafiki'],
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			centerOffset: { x: images['rafiki'].width / 2, y: images['rafiki'].height / 2 }
		});
		layer.add(bubba);
		evm.play(Sounds.BUBBA_HI);
		setTimeout(function() {
			evm.play(Sounds.BUBBA_HERE_TO_HELP);
			setTimeout(function() {
				layer.remove(bubba);
				msg.callback();
			}, 2000);
		}, 1000);
		
	}, EVM_TAG);
	
	evm.on("Game.showHappySystemConfirmation", function(msg) {
		systemConfirmation(true, msg.callback);
	}, EVM_TAG);
	
	evm.on("Game.showSadSystemConfirmation", function(msg) {
		systemConfirmation(false, msg.callback);
	}, EVM_TAG);	
	
	evm.on("Game.thankYouForHelpingMonkey", function(msg) {
		var text = new Kinetic.Text({
			fontFamily: "Arial",
			fontSize: 36,
			textFill: "white",
			textStrokeFill: "black",
			text: Strings.get("THANK_YOU_FOR_HELPING"),
			align: "center",
			y: stage.getHeight()/2,
			x: stage.getWidth()/2
		});
		layer.add(text);
		setTimeout(function() {
			Tween.get(text.attrs).to({x:-300, y:-400, alpha: 1}, 500).call(function() {
				layer.remove(text);
				msg.callback();	
			});
		}, 1500);
	}, EVM_TAG);
	
	var _loadingText = new Kinetic.Text({
		fontFamily: "Arial",
		fontSize: 36,
		textFill: "white",
		textStrokeFill: "black",
		text: Strings.get("INIT_LOADING"),
		align: "center",
		y: stage.getHeight()/2 + 20,
		x: stage.getWidth()/2
	});
	evm.on("Game.loading", function(msg) {
		layer.add(_loadingText);
	}, EVM_TAG);
	evm.on("Game.loadingDone", function(msg) {
		layer.remove(_loadingText);
	}, EVM_TAG);
	
	evm.on("Game.eatBananas", function(msg) {
//		var text1 = new Kinetic.Text({
//			fontFamily: "Arial",
//			fontSize: 36,
//			textFill: "white",
//			textStrokeFill: "black",
//			text: "Here the monkey will eat the bananas and grow.",
//			align: "center",
//			y: stage.getHeight()/2 - 20,
//			x: stage.getWidth()/2
//		});
//		var text2 = new Kinetic.Text({
//			fontFamily: "Arial",
//			fontSize: 36,
//			textFill: "white",
//			textStrokeFill: "black",
//			text: "The player can then play another game.",
//			align: "center",
//			y: stage.getHeight()/2 + 20,
//			x: stage.getWidth()/2
//		});
//		layer.add(text1);
//		layer.add(text2);
		
		var monkey = new Kinetic.Image({
			image: images["monkey"],
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			centerOffset: {x: images["monkey"].width / 2, y: images["monkey"].height / 2 },
			scale: {x:1, y:1}
		});
		layer.add(monkey);
		monkeyJump(monkey, 1);
		if (bananas.length > 0) {
			monkeyEat(monkey, bananas[bananas.length -1]);
		}
	}, EVM_TAG);
	
	var monkeyEat = function(monkey, banana) {
		bananas.splice(bananas.length - 1);
		Tween.get(banana.attrs).to({ y: 300, x: 400 }, 1000).to({alpha: 0}, 500).call(function() {
			Tween.get(monkey.attrs.scale).to({x:monkey.attrs.scale.x * 1.2, y:monkey.attrs.scale.y*1.2}, 1000).wait(500).call(function() {
				if (bananas.length > 0) {
					monkeyEat(monkey, bananas[bananas.length - 1]);
				}
			});
		});
	};
	
	var monkeyJump = function(monkey, dir) {
		Tween.get(monkey.attrs).to({y:monkey.attrs.y - dir * 100}, 600).call(function() {
			monkeyJump(monkey, dir * (-1));
		});
	};
	
	evm.on("Game.getBanana", function(msg) {
		gameState.addBanana();
        var banana = new Kinetic.Image({
        	image: images["banana-big"],
        	scale: { x: 0.001, y: 0.001 },
        	centerOffset: { x: 256, y: 256 },
        	x: stage.attrs.width / 2,
        	y: stage.attrs.height / 2
        });
        bananas.push(banana);
        layer.add(banana);
        evm.play(Sounds.GET_BANANA);
        Tween.get(banana.attrs).to({rotation: Math.PI * 2}, 1000).wait(1500)
        .to({
        	rotation: -Math.PI / 2,
        	x: stage.attrs.width - 50 - (gameState.getBananas()-1)*48,
			y: 50
        }, 1000);
        
        Tween.get(banana.attrs.scale).to({ x: 2, y: 2 }, 1000).wait(1500)
        .to({
        	x: 0.125, y: 0.125
        }, 1000).call(function(){
        	banana.attrs.image = images["banana-small"];
        }).wait(1500).call(function() {msg.callback();});
	}, EVM_TAG);
	
	evm.on("Game.readyToTeach", function(msg) {
		var noGroup = new Kinetic.Group({x: stage.getWidth()/2 - 200 - 128, y: 300 });
		var yesGroup = new Kinetic.Group({x: stage.getWidth()/2 + 200 - 128, y: 300 });
	
        
        var green = new Kinetic.Image({image: images["green"]});
        var red = new Kinetic.Image({image: images["red"]});
        var monkey = new Kinetic.Image({image: images["monkey_icon"], scale: {x:2,y:2},x: 100, y:100});
        var personYes = new Kinetic.Image({image: images["person-yes"], x: 20, y: 25});
        var personNo = new Kinetic.Image({image: images["person-no"], x: 60, y: 55});
		
        noGroup.add(red);
        noGroup.add(personNo);
        
        yesGroup.add(green);
        yesGroup.add(monkey);
        yesGroup.add(personYes);
		
        var animated = 0;
        var donea = function() {
        	animated++;
        	if (animated === 3) {
        		layer.remove(yesGroup);
        		layer.remove(noGroup);
        		layer.remove(text);
        	}
        };
        
        var tearDown = function() {
            Tween.get(yesGroup.attrs).to({ x: -300, y: -300}, 600).call(donea);
            Tween.get(noGroup.attrs).to({ x: stage.getWidth()+300, y: stage.getHeight()+300}, 600).call(donea);
            Tween.get(text.attrs).to({ x: 0, y: stage.getHeight()+300}, 600).call(donea);
        };
        
        yesGroup.on("mousedown touchstart", function() {
        	yesGroup.off("mousedown touchstart");
        	noGroup.off("mousedown touchstart");
        	tearDown();
        	msg.yes();
        });
        
        noGroup.on("mousedown touchstart", function() {
        	yesGroup.off("mousedown touchstart");
        	noGroup.off("mousedown touchstart");
        	tearDown();
        	msg.no();
        });
        
		layer.add(yesGroup);
		layer.add(noGroup);
		
		var text = new Kinetic.Text({
			fontSize: 48,
			fontFamily: "Arial",
			text: Strings.get("ARE_YOU_READY_TO_TEACH"),
			textFill: "white",
			align: "center",
			y: 100,
			x: stage.getWidth()/2
		});
		layer.add(text);
		
		layer.draw();
	}, EVM_TAG);
};
