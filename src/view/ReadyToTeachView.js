/**
 * @constructor
 * @implements {ViewModule}
 */
function ReadyToTeachView(evm, stage) {

	var layer = new Kinetic.Layer();
	var images = new Array();
	var EVM_TAG = "ReadyToTeachView";
	var yesGroup;
	var noGroup;
	var text;
	stage.add(layer);
	
	this.init = function(viewConfig, model) {
		
		var backRect = new Kinetic.Rect({
			width: stage.width,
			height: stage.height,
			fill: "white"
		});
		layer.add(backRect);
		noGroup = new Kinetic.Group({x: stage.width/2 - 200 - 128, y: 300 });
		yesGroup = new Kinetic.Group({x: stage.width/2 + 200 - 128, y: 300 });
	
        
        var green = new Kinetic.Image({image: images["green"]});
        var red = new Kinetic.Image({image: images["red"]});
        var monkey = new Kinetic.Image({image: images["monkey"], scale: {x:2,y:2},x: 100, y:100});
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
			x: stage.width/2
		})
		layer.add(text);
		
		layer.draw();
	};
	
	evm.on("frame", function(msg) {
		var frame = msg.frame;
		//Tween.tick(frame.timeDiff, false);
		layer.draw();
	});
	
	evm.on("Game.getBanana", function(msg) {
		console.log("banana");
		
        var banana = new Kinetic.Image({
        	image: images["banana-big"],
        	scale: { x: 0, y: 0 },
        	centerOffset: { x: 256, y: 256 },
        	x: stage.width / 2,
        	y: stage.height / 2
        });
        
        //yesGroup.transitionTo({ x: -300, y: -300, duration: 0.3 });
        Tween.get(yesGroup).to({ x: -300, y: -300}, 600);
        Tween.get(noGroup).to({ x: stage.width+300, y: stage.height+300}, 600);
        Tween.get(text).to({ x: 0, y: stage.height+300}, 600);
        
        layer.add(banana);
        SoundJS.play("GET_BANANA");
        Tween.get(banana).to({rotation: Math.PI * 2}, 600).wait(1500)
        .to({
        	rotation: -Math.PI / 2,
        	x: stage.width - 50,
			y: 50
        }, 600);
        
        Tween.get(banana.scale).to({ x: 2, y: 2 }, 600).wait(1500)
        .to({
        	x: 0.125, y: 0.125
        }, 600).call(function(){
        	banana.image = images["banana-small"];
        }).wait(1500).call(function() {msg.callback()});
	}, EVM_TAG);
	
	this.prepare = function(model, modelInit) {
		evm.loadImages({
			"monkey": "Gnome-Face-Monkey-64.png",
			"green": "1333364667_Circle_Green.png",
			"red": "1333364683_Circle_Red.png",
			"person-yes": "Accept-Male-User.png",
			"person-no": "Remove-Male-User.png",
			"banana-big": "1333448754_Banana.png",
			"banana-small": "1333448736_Banana64.png"
		}, images, function() {
			modelInit.call(model);	
		});
	};
	
	this.start = function() {
		evm.play(Sounds.ARE_YOU_READY_TO_TEACH);
		stage.start();
	};
	
	this.tearDown = function() {
		evm.forget(EVM_TAG);
	};
}