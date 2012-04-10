/**
 * @constructor
 */
function Model(ieventManager, iview, iviewInit, iviewStart, iModel, iconfig, iplayer, mode) {

	var myModel = iModel;
	var view = iview;
	var viewInit = iviewInit;
	var viewStart = iviewStart;
	var evm = ieventManager;
	var config = iconfig;
	var player = iplayer;
	var model = null;

	this.init = function() {
		Log.debug("Creating model...", "model");
		model = new myModel(evm, mode);
		if (model.setMode != undefined)
			model.setMode(mode);
		if (player != null) {
			model.play(player, evm, config);
		}
		Log.debug("Initiating model...", "model");
		var viewConfig = model.init(config);
		viewInit.call(view, viewConfig, model);
		evm.tell("view.initiated");
		viewStart.call(view);
		model.start();
	};
}