/**
 * @constructor
 * @implements {ViewModule}
 */
function SystemMessageView(evm, stage) {

	var layer = new Kinetic.Layer();
	var images = new Array();
	var model = null;
	var EVM_TAG = "SystemMessageView";
	stage.add(layer);
	
	this.init = function(viewConfig, _model) {
		model = _model;
		var text = new Kinetic.Text({
			fontFamily: "Arial",
			fontSize: 36,
			textFill: "white",
			textStrokeFill: "black",
			text: model.getMessage(),
			align: "center",
			y: stage.getHeight()/2,
			x: stage.getWidth()/2
		});
		layer.add(text);
		layer.draw();
	};
	
	this.prepare = function(model, modelInit) {
		modelInit.call(model);
	};
	
	this.start = function() {
		setTimeout(function() {
			model.animationDone();
		}, 2000);
	};
	
	this.tearDown = function() {
		stage.remove(layer);
		evm.forget(EVM_TAG);
	};
}