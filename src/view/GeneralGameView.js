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
	
	this.init = function() {
		Log.debug("GeneralGameView kicking in", "GGV");
	};
	
	this.tearDown = function() {
		evm.forget(EVM_TAG);
	};
	
	var systemConfirmation = function(happy, callback) {
		Log.debug("Game.showSystemConfirmation", "GGV");
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
		}, 2000);
	};
	
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
        }
        
        var tearDown = function() {
            Tween.get(yesGroup.attrs).to({ x: -300, y: -300}, 600).call(donea);
            Tween.get(noGroup.attrs).to({ x: stage.getWidth()+300, y: stage.getHeight()+300}, 600).call(donea);
            Tween.get(text.attrs).to({ x: 0, y: stage.getHeight()+300}, 600).call(donea);
        }
        
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
		})
		layer.add(text);
		
		layer.draw();
	}, EVM_TAG);
};
