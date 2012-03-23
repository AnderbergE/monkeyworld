function NewPlayerView(ievm, istage, icaller, icallback) {
	var evm = ievm;
	var stage = istage;
	var caller = icaller;
	var callback = icallback;
	
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
    	text: "Ny spelare",
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
    
    backgroundLayer.add(button);
    backgroundLayer.add(text);
	stage.add(backgroundLayer);

	/**
	 * @param {Object=} config
	 */
	function exit(config) {
		stage.remove(backgroundLayer);
		callback.call(caller, config);
	}
}

NewPlayerView.prototype.init = function() {
	
};

NewPlayerView.prototype.start = function() {
	
};

NewPlayerView.prototype.prepare = function() {
	
};