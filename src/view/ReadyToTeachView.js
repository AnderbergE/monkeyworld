/**
 * @constructor
 * @implements {ViewModule}
 */
function ReadyToTeachView(evm, stage, gameState, model) {

	var layer = new Kinetic.Layer();
	var EVM_TAG = "ReadyToTeachView";
	var yesGroup = null;
	var noGroup = null;
	var text = null;
	stage.add(layer);
	
	this.init = function() {
		var backRect = new Kinetic.Rect({
			width: stage.getWidth(),
			height: stage.getHeight(),
			fill: "white"
		});
		layer.add(backRect);
		noGroup = new Kinetic.Group({x: stage.getWidth()/2 - 200 - 128, y: 300 });
		yesGroup = new Kinetic.Group({x: stage.getWidth()/2 + 200 - 128, y: 300 });
	
        
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
		
        yesGroup.on("mousedown touchstart", function() {
        	yesGroup.off("mousedown touchstart");
        	noGroup.off("mousedown touchstart");
        	model.readyToTeach();
        });
        
        noGroup.on("mousedown touchstart", function() {
        	yesGroup.off("mousedown touchstart");
        	noGroup.off("mousedown touchstart");
        	model.notReadyToTeach();
        });
        
		layer.add(yesGroup);
		layer.add(noGroup);
		
		text = new Kinetic.Text({
			fontSize: 48,
			fontFamily: "Arial",
			text: Strings.get("ARE_YOU_READY_TO_TEACH"),
			textFill: "black",
			align: "center",
			y: 100,
			x: stage.getWidth()/2
		});
		layer.add(text);
		
		layer.draw();
	};
	
	evm.on("frame", function(msg) {
		layer.draw();
	}, EVM_TAG);
	
	evm.on("Game.getBanana", function(msg) {
        Tween.get(yesGroup).to({ x: -300, y: -300}, 600);
        Tween.get(noGroup).to({ x: stage.getWidth()+300, y: stage.getHeight()+300}, 600);
        Tween.get(text).to({ x: 0, y: stage.getHeight()+300}, 600);
	}, EVM_TAG);
	
	this.start = function() {
		Sound.play(Sounds.ARE_YOU_READY_TO_TEACH);
	};
	
	this.tearDown = function() {
		stage.remove(layer);
		evm.forget(EVM_TAG);
	};
}