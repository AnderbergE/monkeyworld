/**
 * @constructor
 * @implements {ViewModule}
 */
function ReadyToTeachView(evm, stage) {

	var layer = new Kinetic.Layer();
	var images = new Array();
	stage.add(layer);
	
	this.init = function(viewConfig, model) {
		
		var backRect = new Kinetic.Rect({
			width: stage.width,
			height: stage.height,
			fill: "white"
		});
		layer.add(backRect);
		var noGroup = new Kinetic.Group({x: stage.width/2 - 200 - 128, y: 300 });
		var yesGroup = new Kinetic.Group({x: stage.width/2 + 200 - 128, y: 300 });
	
        
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
        	model.readyToTeach();
        });
        
        noGroup.on("mousedown touchstart", function() {
        	model.notReadyToTeach();
        });
        
		layer.add(yesGroup);
		layer.add(noGroup);
		
		var text = new Kinetic.Text({
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
	
	this.prepare = function(model, modelInit) {
		evm.loadImages({
			"monkey": "Gnome-Face-Monkey-64.png",
			"green": "1333364667_Circle_Green.png",
			"red": "1333364683_Circle_Red.png",
			"person-yes": "Accept-Male-User.png",
			"person-no": "Remove-Male-User.png"
		}, images, function() {
			modelInit.call(model);	
		});
	};
	
	this.start = function() {
		evm.play(Sounds.ARE_YOU_READY_TO_TEACH);
		stage.start();
	};
	
	this.tearDown = function() {
	};
}