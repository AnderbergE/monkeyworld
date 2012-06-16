/**
 * @constructor
 * @extends {GameView}
 * @param {Ladder} ladder
 */
function LadderView(tag, ladder)
{
	GameView.call(this);
	this.tag(tag);
	Log.debug("Creating LadderView", "object");
	var view = this;
	var stopButton = null;
	var continueButton = null;
	
	this.addInterruptButtons = function(layer) {
		stopButton = new Kinetic.Image({
			image: images['symbol-stop'], x: 750, y: 700, centerOffset: {x:64,y:64}, alpha: 0
		});
		continueButton = new Kinetic.Image({
			image: images['symbol-check'], x: 900, y: 700, centerOffset: {x:64,y:64}, alpha: 0
		});
		
		layer.add(stopButton);
		layer.add(continueButton);
	};
	
	
	view.on("Ladder.allowInterrupt", function(msg) {
		stopButton.on("mousedown touchstart", function() {
			view.getTween(stopButton.attrs).to({rotation: 8*Math.PI}, 1200).to({rotation:0});
			Sound.play(Sounds.BIKE_HORN);
			ladder.interruptAgent();
		});
		continueButton.on("mousedown touchstart", function() {
			view.getTween(continueButton.attrs).to({rotation: 8*Math.PI}, 1200).to({rotation:0});
			Sound.play(Sounds.TADA);
		});
		msg.callback();
	});
	
	
	view.on("Ladder.startAgent", function(msg) {
		Sound.play(Sounds.LADDER_MY_TURN);
		view.setTimeout(function() {
			msg.callback();
			view.getTween(stopButton.attrs).to({alpha:1},1000);
			view.getTween(continueButton.attrs).to({alpha:1},1000);
		}, 2000);
	});
	
	
	view.on("Ladder.disallowInterrupt", function(msg) {
		stopButton.off("mousedown touchstart");
		continueButton.off("mousedown touchstart");
	});
}
inherit(LadderView, GameView);
