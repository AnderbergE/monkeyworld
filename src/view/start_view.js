function StartView(ievm, istage, icaller, icallback) {
	var evm = ievm;
	var stage = istage;
	var caller = icaller;
	var callback = icallback;
	var menuStart = 300;
	var menuItemHeight = 100;
	var menuItemWidth = 300;
	
	var backgroundLayer = new Kinetic.Layer("bg");
	var background = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: stage.width,
		height: stage.height,
		strokewidth: 0
	});
	backgroundLayer.add(background);

	var aSoundObject = soundManager.createSound({
		id:'mySound2',
		url:'../res/sound/19446__totya__yeah.mp3'
	});
	aSoundObject.play();
	
    var text = new Kinetic.Text({
    	text: "Welcome!",
    	fontSize: 36,
    	fontFamily: "Arial",
    	textFill: "black",
    	x: stage.width / 2,
    	y: 40,
        align: "center"
    });

	backgroundLayer.add(text);
	createMenuOption(backgroundLayer, "Logga in", exit, "login");
	createMenuOption(backgroundLayer, "Ny spelare", exit, "new");
	stage.add(backgroundLayer);

	function exit(string) {
		stage.remove(backgroundLayer);
		callback.call(caller, string);
	}
	
	function createMenuOption(layer, text, callback, config) {
		var groupObj = new Kinetic.Group({
			x: stage.width / 2 - menuItemWidth/2,
			y: menuStart
		});
		menuStart += menuItemHeight + 20;
		var textObj = new Kinetic.Text({
	    	text: text,
	    	fontSize: 36,
	    	fontFamily: "Arial",
	    	textFill: "black",
	    	x: menuItemWidth / 2,
	    	y: 30,
	    	width: menuItemWidth,
	    	height: menuItemHeight,
	        align: "center"
	    });
	    var rectObj = new Kinetic.Rect({
	    	width: menuItemWidth,
	    	height: menuItemHeight,
	    	fill: "#FFFACD",
	    	strokeWidth: 4,
	    	stroke: "black",
	    	x: 0,
	    	y: 0
	    });
	    rectObj.on("mousedown touchstart", function(){
	    	callback(config);
	    });
	    groupObj.add(rectObj);
	    groupObj.add(textObj);
	    layer.add(groupObj);
	}
}

StartView.prototype.init = function() {
	
};

StartView.prototype.start = function() {

};

StartView.prototype.prepare = function() {
	
};