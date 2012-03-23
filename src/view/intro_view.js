function IntroView(ievm, istage, icaller, icallback) {

	var stage = istage;
	var evm = ievm;
	var callback = icallback;
	var caller = icaller;
	
	
	var backgroundLayer = new Kinetic.Layer("bg");
	var background = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: stage.width,
		height: stage.height,
		strokewidth: 0
	});
	backgroundLayer.add(background);
	
	
    var text = new Kinetic.Text({
    	text: "Intro...",
    	fontSize: 36,
    	fontFamily: "Arial",
    	textFill: "black",
    	x: stage.width / 2,
    	y: 40,
        align: "center"
    });
    
    var button = new Kinetic.Rect({
    	width: 300,
    	height: 200,
    	fill: "gray",
    	x: stage.width / 2 - 150,
    	y: stage.height - 250 - 100
    });
    
    button.on("mousedown touchstart", function(){
        exit();
    });
	
	backgroundLayer.add(text);
	backgroundLayer.add(button);
	stage.add(backgroundLayer);

	function exit() {
		stage.remove(backgroundLayer);
		callback.call(caller);
	}
	
}

IntroView.prototype.start = function() {
	
};

IntroView.prototype.prepare = function() {
	
};